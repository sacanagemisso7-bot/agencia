import { subDays } from "date-fns";

import { demoStore } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { NotificationRecord } from "@/lib/types";
import { getAutomationSettings } from "@/modules/automation-config/repository";
import { assessLeadSla, rankLeadsByIntent } from "@/modules/leads/intent";
import { listLeads } from "@/modules/leads/repository";
import { dispatchMessage } from "@/modules/messages/provider";
import { createMessage, listMessages, updateMessageStatus } from "@/modules/messages/repository";
import { listProposals } from "@/modules/proposals/repository";
import { listClients } from "@/modules/clients/repository";
import { recordActivity } from "@/modules/shared/activity-log";
import { getDefaultBackofficeAssignee } from "@/modules/shared/assignment";
import { listTasks } from "@/modules/tasks/repository";

const HIGH_INTENT_FOLLOW_UP_ACTION = "lead.high_intent_follow_up_alerted";
const PROPOSAL_FOLLOW_UP_ACTION = "proposal.follow_up_suggested";

function isOlderThan(value: string | null | undefined, hours: number) {
  if (!value) {
    return false;
  }

  return Date.now() - new Date(value).getTime() >= hours * 60 * 60 * 1000;
}

function isProposalStale(createdAt: string, status: string, afterDays: number) {
  if (!(status === "SENT" || status === "VIEWED")) {
    return false;
  }

  return new Date(createdAt) <= subDays(new Date(), afterDays);
}

async function hasOperationalActivity(action: string, entityId: string) {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.activities.some((item) => item.action === action && item.entityId === entityId);
      }

      const existing = await prisma.activityLog.findFirst({
        where: {
          action,
          entityId,
        },
      });

      return Boolean(existing);
    },
    () => demoStore.activities.some((item) => item.action === action && item.entityId === entityId),
  );
}

async function triggerHighIntentReminder() {
  const automationSettings = await getAutomationSettings();
  const leads = await listLeads();
  const rankedLeads = rankLeadsByIntent(leads, automationSettings);
  const assignee = await getDefaultBackofficeAssignee();

  for (const { lead, assessment } of rankedLeads) {
    if (!assessment.isHighIntent || lead.status !== "NEW") {
      continue;
    }

    const sla = assessLeadSla(lead, automationSettings);
    if (sla.status !== "overdue" || !isOlderThan(lead.createdAt, automationSettings.leadReminderDelayHours)) {
      continue;
    }

    const alreadyAlerted = await hasOperationalActivity(HIGH_INTENT_FOLLOW_UP_ACTION, lead.id);
    if (alreadyAlerted) {
      continue;
    }

    const message = await createMessage({
      subject: `Reforco de atendimento | ${lead.company ?? lead.name}`,
      body: [
        `Lead high-intent com SLA estourado para ${lead.company ?? lead.name}.`,
        "",
        `Responsavel sugerido: ${assignee.name}`,
        `Servico: ${lead.serviceInterest ?? "Nao informado"}`,
        `Urgencia: ${lead.urgency ?? "Nao informada"}`,
        `Score: ${assessment.score}/100`,
        "",
        "Acao sugerida: responder agora, qualificar e mover o lead no funil para evitar perda de oportunidade.",
      ].join("\n"),
      channel: "INTERNAL",
      status: "QUEUED",
      recipientName: assignee.name,
      leadId: lead.id,
    });

    const delivery = await dispatchMessage(message);
    await updateMessageStatus(message.id, delivery.ok ? "SENT" : "FAILED", delivery.sentAt, {
      providerName: delivery.provider,
      providerMessageId: delivery.providerMessageId,
      deliveryNote: delivery.error,
    });

    await recordActivity({
      action: HIGH_INTENT_FOLLOW_UP_ACTION,
      entityType: "Lead",
      entityId: lead.id,
      description: "Lead high-intent sem movimentacao dentro do SLA gerou alerta de reforco para o time.",
      leadId: lead.id,
      messageId: message.id,
      metadata: {
        score: assessment.score,
        dueAt: sla.dueAt,
      },
    });
  }
}

async function triggerProposalFollowUpSuggestions() {
  const automationSettings = await getAutomationSettings();
  const [proposals, leads, clients] = await Promise.all([listProposals(), listLeads(), listClients()]);
  const leadMap = new Map(leads.map((lead) => [lead.id, lead] as const));
  const clientMap = new Map(clients.map((client) => [client.id, client] as const));

  for (const proposal of proposals) {
    if (!isProposalStale(proposal.createdAt, proposal.status, automationSettings.proposalFollowUpAfterDays)) {
      continue;
    }

    const alreadySuggested = await hasOperationalActivity(PROPOSAL_FOLLOW_UP_ACTION, proposal.id);
    if (alreadySuggested) {
      continue;
    }

    const lead = proposal.leadId ? leadMap.get(proposal.leadId) : null;
    const client = proposal.clientId ? clientMap.get(proposal.clientId) : null;
    const recipientName = proposal.clientName ?? proposal.leadName ?? "Contato";
    const recipientEmail = lead?.email ?? client?.email;

    const message = await createMessage({
      subject: `Follow-up sugerido | ${proposal.title}`,
      body: [
        `Oi ${recipientName}, tudo bem?`,
        "",
        `Quis retomar a proposta "${proposal.title}" para entender se faz sentido avancarmos agora ou se existe algum ponto que eu possa esclarecer para facilitar sua decisao.`,
        "",
        "Se fizer sentido, posso resumir os proximos passos e o desenho da operacao recomendado para este momento.",
      ].join("\n"),
      channel: recipientEmail ? automationSettings.proposalFollowUpChannel : "INTERNAL",
      status: "DRAFT",
      recipientName,
      recipientEmail,
      leadId: proposal.leadId ?? undefined,
      clientId: proposal.clientId ?? undefined,
    });

    await recordActivity({
      action: PROPOSAL_FOLLOW_UP_ACTION,
      entityType: "Proposal",
      entityId: proposal.id,
      description: "Sistema sugeriu follow-up automatico para proposta parada ha mais de 3 dias.",
      proposalId: proposal.id,
      leadId: proposal.leadId,
      clientId: proposal.clientId,
      messageId: message.id,
    });
  }
}

export async function runOperationalMonitors() {
  await triggerHighIntentReminder();
  await triggerProposalFollowUpSuggestions();

  return {
    highIntentReminderChecked: true,
    proposalFollowUpChecked: true,
  };
}

export async function listNotifications(): Promise<NotificationRecord[]> {
  const automationSettings = await getAutomationSettings();
  const [leads, tasks, proposals, messages] = await Promise.all([
    listLeads(),
    listTasks(),
    listProposals(),
    listMessages(),
  ]);

  const notifications: NotificationRecord[] = [];
  const rankedLeads = rankLeadsByIntent(leads, automationSettings);

  for (const { lead, assessment } of rankedLeads.slice(0, 12)) {
    const sla = assessLeadSla(lead, automationSettings);

    if (assessment.isHighIntent && lead.status === "NEW") {
      notifications.push({
        id: `lead-${lead.id}`,
        title: `Lead high-intent: ${lead.company ?? lead.name}`,
        description: `${assessment.priorityLabel} com score ${assessment.score}. ${sla.label}.`,
        severity: sla.status === "overdue" ? "critical" : "warning",
        category: "lead",
        href: `/admin/leads/${lead.id}`,
        createdAt: lead.createdAt,
      });
    }
  }

  for (const task of tasks) {
    if (task.status === "DONE" || !task.dueDate) {
      continue;
    }

    const overdue = new Date(task.dueDate).getTime() < Date.now();
    if (!overdue && !isOlderThan(task.createdAt, 12)) {
      continue;
    }

    notifications.push({
      id: `task-${task.id}`,
      title: overdue ? `Tarefa atrasada: ${task.title}` : `Tarefa em aberto: ${task.title}`,
      description: `${task.ownerName ?? "Time"} precisa revisar ${task.clientName ?? task.leadName ?? "esta demanda"}.`,
      severity: overdue ? "critical" : "warning",
      category: "task",
      href: `/admin/tasks/${task.id}`,
      createdAt: task.dueDate ?? task.createdAt,
    });
  }

  for (const proposal of proposals) {
    if (!isProposalStale(proposal.createdAt, proposal.status, automationSettings.proposalFollowUpAfterDays)) {
      continue;
    }

    notifications.push({
      id: `proposal-${proposal.id}`,
      title: `Proposta sem resposta: ${proposal.title}`,
      description: "Ja existe sinal para follow-up comercial ou ajuste de cadencia.",
      severity: "warning",
      category: "proposal",
      href: `/admin/proposals/${proposal.id}`,
      createdAt: proposal.createdAt,
    });
  }

  for (const message of messages) {
    if (message.status !== "FAILED") {
      continue;
    }

    notifications.push({
      id: `message-${message.id}`,
      title: `Falha de envio: ${message.subject ?? "Mensagem sem assunto"}`,
      description: message.deliveryNote ?? "Uma mensagem falhou e precisa de revisao.",
      severity: "critical",
      category: "message",
      href: "/admin/messages",
      createdAt: message.createdAt,
    });
  }

  return notifications
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);
}

export async function getNotificationsSummary() {
  const notifications = await listNotifications();

  return {
    total: notifications.length,
    critical: notifications.filter((item) => item.severity === "critical").length,
    warning: notifications.filter((item) => item.severity === "warning").length,
    items: notifications,
  };
}

import type { LeadRecord } from "@/lib/types";
import { getAutomationSettings } from "@/modules/automation-config/repository";
import { assignLeadOwner } from "@/modules/leads/repository";
import { createTask } from "@/modules/tasks/repository";
import { getDefaultBackofficeAssignee } from "@/modules/shared/assignment";
import { recordActivity } from "@/modules/shared/activity-log";

import { assessLeadIntent, assessLeadSla } from "./intent";

function buildRoutingTaskDescription(lead: LeadRecord, score: number, dueAt: string) {
  return [
    `Lead priorizado automaticamente com score ${score}/100.`,
    "",
    `Empresa: ${lead.company ?? "Nao informada"}`,
    `Servico de interesse: ${lead.serviceInterest ?? "Nao informado"}`,
    `Canal preferido: ${lead.contactPreference ?? "Nao informado"}`,
    `Urgencia: ${lead.urgency ?? "Nao informada"}`,
    `Faixa estimada: ${lead.estimatedTicket ?? 0}`,
    `Origem: ${lead.source}`,
    `UTM: ${[lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ") || "Nao identificado"}`,
    `SLA comercial ate: ${new Date(dueAt).toLocaleString("pt-BR")}`,
    "",
    "Proximo passo sugerido: responder, qualificar e mover o lead no funil ainda dentro da janela de atendimento.",
  ].join("\n");
}

export async function routeHighIntentLead(lead: LeadRecord) {
  const automationSettings = await getAutomationSettings();
  const assessment = assessLeadIntent(lead, automationSettings);

  if (!assessment.isHighIntent) {
    return null;
  }

  const assignee = await getDefaultBackofficeAssignee();
  const sla = assessLeadSla(lead, automationSettings);

  await assignLeadOwner(lead.id, assignee.id, assignee.name);

  const task = await createTask({
    title:
      lead.contactPreference === "Reuniao estrategica"
        ? `Agendar reuniao com lead high-intent: ${lead.company ?? lead.name}`
        : `Atender lead high-intent: ${lead.company ?? lead.name}`,
    description: buildRoutingTaskDescription(lead, assessment.score, sla.dueAt),
    priority: lead.urgency === "imediata" ? "URGENT" : "HIGH",
    status: "TODO",
    dueDate: sla.dueAt,
    ownerId: assignee.id,
    ownerName: assignee.name,
    leadId: lead.id,
  });

  await recordActivity({
    action: "lead.routed_to_owner",
    entityType: "Task",
    entityId: task.id,
    description: `Lead high-intent roteado para ${assignee.name} com tarefa e SLA automaticos.`,
    leadId: lead.id,
    taskId: task.id,
    metadata: {
      score: assessment.score,
      ownerId: assignee.id,
      ownerName: assignee.name,
      dueAt: sla.dueAt,
    },
  });

  return {
    task,
    assignee,
    assessment,
    sla,
  };
}

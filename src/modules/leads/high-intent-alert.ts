import { parseRecipientList } from "@/lib/automation-config";
import { env } from "@/lib/env";
import { logOperationalEvent } from "@/lib/logger";
import type { LeadRecord, MessageChannel, MessageRecord } from "@/lib/types";
import { getAutomationSettings } from "@/modules/automation-config/repository";
import { dispatchMessage } from "@/modules/messages/provider";
import { createMessage, updateMessageStatus } from "@/modules/messages/repository";
import { recordActivity } from "@/modules/shared/activity-log";

import { assessLeadIntent } from "./intent";

function formatCurrency(value?: number | null) {
  if (!value) {
    return "Nao informado";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildAlertBody(lead: LeadRecord) {
  const assessment = assessLeadIntent(lead);
  const reasons = assessment.reasons.map((reason) => `- ${reason}`).join("\n");

  return [
    `Novo lead high-intent identificado com score ${assessment.score}/100.`,
    "",
    `Nome: ${lead.name}`,
    `Empresa: ${lead.company ?? "Nao informada"}`,
    `Email: ${lead.email}`,
    `Telefone: ${lead.phone ?? "Nao informado"}`,
    `Frente de interesse: ${lead.serviceInterest ?? "Nao informada"}`,
    `Urgencia: ${lead.urgency ?? "Nao informada"}`,
    `Faixa estimada: ${formatCurrency(lead.estimatedTicket)}`,
    `Origem: ${lead.source}`,
    `Landing page: ${lead.landingPage ?? "Nao informada"}`,
    `UTM source: ${lead.utmSource ?? "Nao informado"}`,
    `UTM medium: ${lead.utmMedium ?? "Nao informado"}`,
    `UTM campaign: ${lead.utmCampaign ?? "Nao informada"}`,
    "",
    "Sinais que elevaram a prioridade:",
    reasons || "- Lead com composicao de sinais forte para acao rapida.",
    "",
    "Objetivo declarado:",
    lead.objective ?? lead.message ?? "Nao informado",
  ].join("\n");
}

async function dispatchAlertMessage(input: {
  lead: LeadRecord;
  channel: MessageChannel;
  subject: string;
  recipientName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
}): Promise<MessageRecord> {
  const body = buildAlertBody(input.lead);
  const message = await createMessage({
    subject: input.subject,
    body,
    channel: input.channel,
    status: "QUEUED",
    recipientName: input.recipientName,
    recipientEmail: input.recipientEmail,
    recipientPhone: input.recipientPhone,
    leadId: input.lead.id,
  });

  const delivery = await dispatchMessage(message);

  await updateMessageStatus(message.id, delivery.ok ? "SENT" : "FAILED", delivery.sentAt, {
    providerName: delivery.provider,
    providerMessageId: delivery.providerMessageId,
    deliveryNote: delivery.error,
  });

  if (!delivery.ok) {
    throw new Error(delivery.error ?? "Falha ao despachar alerta de lead high-intent.");
  }

  return {
    ...message,
    status: "SENT",
    sentAt: delivery.sentAt,
    providerName: delivery.provider,
    providerMessageId: delivery.providerMessageId,
    deliveryNote: delivery.error,
  };
}

export async function notifyHighIntentLead(lead: LeadRecord) {
  const automationSettings = await getAutomationSettings();
  const assessment = assessLeadIntent(lead, automationSettings);

  if (!assessment.isHighIntent) {
    return {
      skipped: true,
      score: assessment.score,
    };
  }

  const internalSubject = `Lead high-intent: ${lead.company ?? lead.name}`;
  const emailSubject = `Alerta comercial | ${lead.company ?? lead.name} entrou com alta prioridade`;
  const emailRecipients = [
    ...parseRecipientList(automationSettings.internalAlertRecipients),
    env.adminEmail,
  ].filter((value, index, array) => value && array.indexOf(value) === index);

  try {
    const internalAlert = await dispatchAlertMessage({
      lead,
      channel: "INTERNAL",
      subject: internalSubject,
      recipientName: "Time comercial",
    });

    const emailAlerts = await Promise.all(
      emailRecipients.map((recipientEmail) =>
        dispatchAlertMessage({
          lead,
          channel: "EMAIL",
          subject: emailSubject,
          recipientName: "Time Atlas",
          recipientEmail,
        }),
      ),
    );

    await recordActivity({
      action: "lead.high_intent_alerted",
      entityType: "Lead",
      entityId: lead.id,
      description: "Lead com alta intencao gerou alerta interno imediato para o time.",
      leadId: lead.id,
      messageId: internalAlert.id,
      metadata: {
        score: assessment.score,
        reasons: assessment.reasons,
        internalAlertId: internalAlert.id,
        emailAlertIds: emailAlerts.map((item) => item.id),
      },
    });

    await logOperationalEvent({
      level: "info",
      event: "lead.high_intent.alerted",
      message: `Lead ${lead.id} alertado com score ${assessment.score}.`,
      metadata: {
        leadId: lead.id,
        score: assessment.score,
        serviceInterest: lead.serviceInterest,
        urgency: lead.urgency,
      },
    });

    return {
      skipped: false,
      score: assessment.score,
      internalAlertId: internalAlert.id,
      emailAlertIds: emailAlerts.map((item) => item.id),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Falha inesperada ao alertar lead high-intent.";

    await recordActivity({
      action: "lead.high_intent_alert_failed",
      entityType: "Lead",
      entityId: lead.id,
      description: `Falha ao alertar o time sobre um lead high-intent: ${errorMessage}.`,
      leadId: lead.id,
      metadata: {
        score: assessment.score,
        reasons: assessment.reasons,
      },
    });

    await logOperationalEvent({
      level: "warn",
      event: "lead.high_intent.alert_failed",
      message: errorMessage,
      metadata: {
        leadId: lead.id,
        score: assessment.score,
      },
    });

    return {
      skipped: false,
      score: assessment.score,
      error: errorMessage,
    };
  }
}

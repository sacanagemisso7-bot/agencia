import { logOperationalEvent } from "@/lib/logger";
import type { LeadRecord } from "@/lib/types";
import { buildCalendarEmbedUrl } from "@/lib/contact";
import { dispatchMessage } from "@/modules/messages/provider";
import { createMessage, updateMessageStatus } from "@/modules/messages/repository";
import { getSiteContent } from "@/modules/site-content/repository";
import { recordActivity } from "@/modules/shared/activity-log";

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

function buildLeadAutoReplyEmail(
  lead: LeadRecord,
  agencyName: string,
  agencyEmail: string,
  agencyWhatsapp: string,
  calendarUrl: string,
) {
  const firstName = getFirstName(lead.name);
  const serviceLine = lead.serviceInterest ? ` sobre ${lead.serviceInterest}` : "";
  const ticketLine = lead.estimatedTicket ? ` com a faixa de investimento estimada em ${Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(lead.estimatedTicket)}` : "";
  const normalizedCalendarUrl = buildCalendarEmbedUrl(calendarUrl);

  const subject = `Recebemos seu diagnostico${serviceLine} | ${agencyName}`;
  const body = [
    `Oi ${firstName},`,
    "",
    `Recebemos seu pedido de diagnostico${serviceLine}${ticketLine}.`,
    "Nosso time vai revisar o contexto enviado e retornar com uma leitura inicial e os proximos passos mais aderentes ao momento da sua empresa.",
    "",
    "O que acontece agora:",
    "- analisamos objetivo, urgencia e servico de interesse",
    "- organizamos uma leitura inicial da estrutura comercial e digital",
    "- retornamos com orientacao consultiva em ate 1 dia util",
    "",
    normalizedCalendarUrl
      ? `Se preferir acelerar, voce tambem pode reservar um horario direto aqui: ${normalizedCalendarUrl}.`
      : null,
    `Se voce quiser acelerar a conversa, pode responder este email ou chamar no WhatsApp: ${agencyWhatsapp}.`,
    "",
    `${agencyName}`,
    agencyEmail,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    body,
  };
}

export async function sendLeadAutoReply(lead: LeadRecord) {
  const content = await getSiteContent();
  const email = buildLeadAutoReplyEmail(
    lead,
    content.settings.agencyName,
    content.settings.email,
    content.settings.whatsapp,
    content.settings.calendarUrl,
  );

  const message = await createMessage({
    subject: email.subject,
    body: email.body,
    channel: "EMAIL",
    status: "QUEUED",
    recipientName: lead.name,
    recipientEmail: lead.email,
    leadId: lead.id,
  });

  try {
    const delivery = await dispatchMessage(message);

    await updateMessageStatus(message.id, delivery.ok ? "SENT" : "FAILED", delivery.sentAt, {
      providerName: delivery.provider,
      providerMessageId: delivery.providerMessageId,
      deliveryNote: delivery.error,
    });

    await recordActivity({
      action: delivery.ok ? "lead.auto_reply_sent" : "lead.auto_reply_failed",
      entityType: "Message",
      entityId: message.id,
      description: delivery.ok
        ? "Plataforma enviou email automatico de confirmacao para o lead."
        : `Falha ao enviar email automatico para o lead: ${delivery.error ?? "erro desconhecido"}.`,
      leadId: lead.id,
      messageId: message.id,
      metadata: {
        provider: delivery.provider,
        serviceInterest: lead.serviceInterest,
      },
    });

    if (!delivery.ok) {
      await logOperationalEvent({
        level: "warn",
        event: "lead.auto_reply.failed",
        message: delivery.error ?? "Falha ao enviar email automatico para lead.",
        metadata: {
          leadId: lead.id,
          messageId: message.id,
          recipientEmail: lead.email,
        },
      });
    }

    return {
      ok: delivery.ok,
      messageId: message.id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Falha inesperada ao enviar resposta automatica.";

    await updateMessageStatus(message.id, "FAILED", undefined, {
      providerName: "email",
      deliveryNote: errorMessage,
    });

    await recordActivity({
      action: "lead.auto_reply_failed",
      entityType: "Message",
      entityId: message.id,
      description: `Falha inesperada ao enviar email automatico para o lead: ${errorMessage}.`,
      leadId: lead.id,
      messageId: message.id,
    });

    await logOperationalEvent({
      level: "error",
      event: "lead.auto_reply.exception",
      message: errorMessage,
      metadata: {
        leadId: lead.id,
        messageId: message.id,
      },
    });

    return {
      ok: false,
      messageId: message.id,
    };
  }
}

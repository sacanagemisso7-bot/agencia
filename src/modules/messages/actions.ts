"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createMessage, getMessageById, updateMessageStatus } from "@/modules/messages/repository";
import { dispatchMessage } from "@/modules/messages/provider";
import { processQueuedMessages } from "@/modules/messages/queue";
import { recordActivity } from "@/modules/shared/activity-log";

const messageSchema = z.object({
  subject: z.string().optional(),
  body: z.string().min(10, "Mensagem obrigatoria."),
  channel: z.enum(["EMAIL", "WHATSAPP", "INTERNAL", "SMS"]).optional(),
  recipientName: z.string().optional(),
  recipientEmail: z.string().optional(),
  recipientPhone: z.string().optional(),
  scheduledFor: z.string().optional(),
  clientId: z.string().optional(),
  leadId: z.string().optional(),
  sendNow: z.string().optional(),
});

export async function createMessageAction(formData: FormData) {
  const parsed = messageSchema.parse({
    subject: String(formData.get("subject") ?? ""),
    body: String(formData.get("body") ?? ""),
    channel: String(formData.get("channel") ?? "EMAIL"),
    recipientName: String(formData.get("recipientName") ?? ""),
    recipientEmail: String(formData.get("recipientEmail") ?? ""),
    recipientPhone: String(formData.get("recipientPhone") ?? ""),
    scheduledFor: String(formData.get("scheduledFor") ?? ""),
    clientId: String(formData.get("clientId") ?? ""),
    leadId: String(formData.get("leadId") ?? ""),
    sendNow: String(formData.get("sendNow") ?? ""),
  });

  const status = parsed.sendNow === "true" || parsed.scheduledFor ? "QUEUED" : "DRAFT";

  const message = await createMessage({
    ...parsed,
    status,
    scheduledFor: parsed.scheduledFor || undefined,
    clientId: parsed.clientId || undefined,
    leadId: parsed.leadId || undefined,
  });

  if (parsed.sendNow === "true") {
    const delivery = await dispatchMessage(message);
    await updateMessageStatus(message.id, delivery.ok ? "SENT" : "FAILED", delivery.sentAt, {
      providerName: delivery.provider,
      providerMessageId: delivery.providerMessageId,
      deliveryNote: delivery.error,
    });

    await recordActivity({
      action: delivery.ok ? "message.sent" : "message.failed",
      entityType: "Message",
      entityId: message.id,
      description: delivery.ok
        ? "Mensagem enviada pela central de mensagens."
        : `Falha ao enviar mensagem: ${delivery.error ?? "erro desconhecido"}.`,
      messageId: message.id,
      clientId: message.clientId,
      leadId: message.leadId,
    });
  } else {
    await recordActivity({
      action: "message.draft",
      entityType: "Message",
      entityId: message.id,
      description: "Mensagem salva como rascunho.",
      messageId: message.id,
      clientId: message.clientId,
      leadId: message.leadId,
    });
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  redirect(`/admin/messages?success=${parsed.sendNow === "true" ? "sent" : "draft"}`);
}

export async function sendDraftMessageAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const message = await getMessageById(id);

  if (!message) {
    redirect("/admin/messages?error=missing");
  }

  const delivery = await dispatchMessage(message);
  await updateMessageStatus(message.id, delivery.ok ? "SENT" : "FAILED", delivery.sentAt, {
    providerName: delivery.provider,
    providerMessageId: delivery.providerMessageId,
    deliveryNote: delivery.error,
  });

  await recordActivity({
    action: delivery.ok ? "message.sent_from_draft" : "message.failed_from_draft",
    entityType: "Message",
    entityId: message.id,
    description: delivery.ok
      ? "Rascunho aprovado e enviado pela equipe."
      : `Falha ao enviar rascunho: ${delivery.error ?? "erro desconhecido"}.`,
    messageId: message.id,
    clientId: message.clientId,
    leadId: message.leadId,
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin/logs");
  redirect(`/admin/messages?success=${delivery.ok ? "approved" : "failed"}`);
}

export async function processMessageQueueAction() {
  await processQueuedMessages();

  revalidatePath("/admin/messages");
  revalidatePath("/admin/logs");
  redirect("/admin/messages?success=queue");
}

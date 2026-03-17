import { logOperationalEvent } from "@/lib/logger";
import { listMessages, updateMessageStatus } from "@/modules/messages/repository";
import { dispatchMessage } from "@/modules/messages/provider";
import { recordActivity } from "@/modules/shared/activity-log";

export async function processQueuedMessages() {
  const now = Date.now();
  const queuedMessages = (await listMessages()).filter((message) => {
    if (message.status !== "QUEUED") {
      return false;
    }

    if (!message.scheduledFor) {
      return true;
    }

    return new Date(message.scheduledFor).getTime() <= now;
  });

  let sent = 0;
  let failed = 0;

  for (const message of queuedMessages) {
    const delivery = await dispatchMessage(message);
    await updateMessageStatus(message.id, delivery.ok ? "SENT" : "FAILED", delivery.sentAt, {
      providerName: delivery.provider,
      providerMessageId: delivery.providerMessageId,
      deliveryNote: delivery.error,
    });

    if (delivery.ok) {
      sent += 1;
    } else {
      failed += 1;
      await logOperationalEvent({
        level: "error",
        event: "queue.message.failed",
        message: delivery.error ?? "Falha ao processar mensagem da fila.",
        metadata: {
          messageId: message.id,
          provider: delivery.provider,
        },
      });
    }

    await recordActivity({
      action: delivery.ok ? "queue.message.sent" : "queue.message.failed",
      entityType: "Message",
      entityId: message.id,
      description: delivery.ok
        ? "Mensagem processada e enviada pela fila."
        : `Mensagem falhou na fila: ${delivery.error ?? "erro desconhecido"}.`,
      messageId: message.id,
      clientId: message.clientId,
      leadId: message.leadId,
    });
  }

  return {
    total: queuedMessages.length,
    sent,
    failed,
  };
}

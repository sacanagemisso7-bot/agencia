import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { logOperationalEvent } from "@/lib/logger";
import { getMessageByProviderMessageId, updateMessageStatus } from "@/modules/messages/repository";
import { recordActivity } from "@/modules/shared/activity-log";

export const runtime = "nodejs";

type WebhookBody = {
  token?: string;
  providerMessageId?: string;
  status?: "SENT" | "FAILED";
  note?: string;
  sentAt?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as WebhookBody;

  if (!body.token || body.token !== env.queueSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!body.providerMessageId || !body.status) {
    return NextResponse.json({ error: "Missing payload" }, { status: 400 });
  }

  const message = await getMessageByProviderMessageId(body.providerMessageId);

  if (!message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  await updateMessageStatus(message.id, body.status, body.sentAt, {
    providerName: message.providerName ?? "webhook",
    providerMessageId: body.providerMessageId,
    deliveryNote: body.note,
  });

  await recordActivity({
    action: "message.webhook.updated",
    entityType: "Message",
    entityId: message.id,
    description: `Webhook atualizou a entrega da mensagem para ${body.status}.`,
    messageId: message.id,
    clientId: message.clientId,
    leadId: message.leadId,
    metadata: {
      providerMessageId: body.providerMessageId,
      note: body.note,
    },
  });

  await logOperationalEvent({
    level: body.status === "FAILED" ? "warn" : "info",
    event: "message.webhook.updated",
    message: `Webhook atualizou mensagem para ${body.status}.`,
    metadata: {
      messageId: message.id,
      providerMessageId: body.providerMessageId,
    },
  });

  return NextResponse.json({ ok: true });
}

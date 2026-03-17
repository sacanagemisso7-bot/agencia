import { MessageChannel, MessageStatus } from "@prisma/client";

import { demoStore, nextDemoId } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { MessageRecord } from "@/lib/types";

type MessageInput = {
  subject?: string;
  body: string;
  channel?: MessageRecord["channel"];
  status?: MessageRecord["status"];
  recipientName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  scheduledFor?: string;
  providerName?: string;
  providerMessageId?: string;
  deliveryNote?: string;
  clientId?: string;
  leadId?: string;
  aiRequestId?: string;
};

function mapMessage(message: {
  id: string;
  subject: string | null;
  body: string;
  channel: MessageChannel;
  status: MessageStatus;
  recipientName: string | null;
  recipientEmail: string | null;
  recipientPhone: string | null;
  clientId: string | null;
  leadId: string | null;
  aiRequestId: string | null;
  scheduledFor: Date | null;
  sentAt: Date | null;
  providerName: string | null;
  providerMessageId: string | null;
  deliveryNote: string | null;
  createdAt: Date;
  client?: { companyName: string } | null;
  lead?: { name: string } | null;
}): MessageRecord {
  return {
    id: message.id,
    subject: message.subject,
    body: message.body,
    channel: message.channel,
    status: message.status,
    recipientName: message.recipientName,
    recipientEmail: message.recipientEmail,
    recipientPhone: message.recipientPhone,
    clientId: message.clientId,
    clientName: message.client?.companyName,
    leadId: message.leadId,
    leadName: message.lead?.name,
    aiRequestId: message.aiRequestId,
    scheduledFor: message.scheduledFor?.toISOString(),
    sentAt: message.sentAt?.toISOString(),
    providerName: message.providerName,
    providerMessageId: message.providerMessageId,
    deliveryNote: message.deliveryNote,
    createdAt: message.createdAt.toISOString(),
  };
}

export async function listMessages(): Promise<MessageRecord[]> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.messages;
      }

      const messages = await prisma.message.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          client: true,
          lead: true,
        },
      });

      return messages.map(mapMessage);
    },
    () => demoStore.messages,
  );
}

export async function getMessageById(id: string): Promise<MessageRecord | null> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.messages.find((item) => item.id === id) ?? null;
      }

      const message = await prisma.message.findUnique({
        where: { id },
        include: {
          client: true,
          lead: true,
        },
      });

      return message ? mapMessage(message) : null;
    },
    () => demoStore.messages.find((item) => item.id === id) ?? null,
  );
}

export async function createMessage(input: MessageInput): Promise<MessageRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const message = await prisma.message.create({
        data: {
          subject: input.subject,
          body: input.body,
          channel: input.channel ?? "EMAIL",
          status: input.status ?? "DRAFT",
          recipientName: input.recipientName,
          recipientEmail: input.recipientEmail,
          recipientPhone: input.recipientPhone,
          scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : undefined,
          providerName: input.providerName,
          providerMessageId: input.providerMessageId,
          deliveryNote: input.deliveryNote,
          clientId: input.clientId,
          leadId: input.leadId,
          aiRequestId: input.aiRequestId,
        },
        include: {
          client: true,
          lead: true,
        },
      });

      return mapMessage(message);
    },
    () => {
      const client = demoStore.clients.find((item) => item.id === input.clientId);
      const lead = demoStore.leads.find((item) => item.id === input.leadId);
      const message = {
        id: nextDemoId("msg"),
        subject: input.subject,
        body: input.body,
        channel: input.channel ?? "EMAIL",
        status: input.status ?? "DRAFT",
        recipientName: input.recipientName,
        recipientEmail: input.recipientEmail,
        recipientPhone: input.recipientPhone,
        scheduledFor: input.scheduledFor,
        providerName: input.providerName,
        providerMessageId: input.providerMessageId,
        deliveryNote: input.deliveryNote,
        clientId: input.clientId,
        clientName: client?.companyName,
        leadId: input.leadId,
        leadName: lead?.name,
        aiRequestId: input.aiRequestId,
        createdAt: new Date().toISOString(),
      } satisfies MessageRecord;

      demoStore.messages.unshift(message);
      return message;
    },
  );
}

export async function updateMessageStatus(
  id: string,
  status: MessageRecord["status"],
  sentAt?: string,
  metadata?: {
    providerName?: string;
    providerMessageId?: string;
    deliveryNote?: string;
  },
): Promise<MessageRecord | undefined> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const message = await prisma.message.update({
        where: { id },
        data: {
          status,
          sentAt: sentAt ? new Date(sentAt) : undefined,
          providerName: metadata?.providerName,
          providerMessageId: metadata?.providerMessageId,
          deliveryNote: metadata?.deliveryNote,
        },
        include: {
          client: true,
          lead: true,
        },
      });

      return mapMessage(message);
    },
    () => {
      const message = demoStore.messages.find((item) => item.id === id);
      if (message) {
        message.status = status;
        message.sentAt = sentAt;
        message.providerName = metadata?.providerName ?? message.providerName;
        message.providerMessageId = metadata?.providerMessageId ?? message.providerMessageId;
        message.deliveryNote = metadata?.deliveryNote ?? message.deliveryNote;
      }
      return message;
    },
  );
}

export async function getMessageByProviderMessageId(providerMessageId: string): Promise<MessageRecord | null> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.messages.find((item) => item.providerMessageId === providerMessageId) ?? null;
      }

      const message = await prisma.message.findFirst({
        where: { providerMessageId },
        include: {
          client: true,
          lead: true,
        },
      });

      return message ? mapMessage(message) : null;
    },
    () => demoStore.messages.find((item) => item.providerMessageId === providerMessageId) ?? null,
  );
}

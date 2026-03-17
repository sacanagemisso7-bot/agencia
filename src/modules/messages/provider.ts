import nodemailer from "nodemailer";

import { env } from "@/lib/env";
import type { MessageChannel, MessageRecord } from "@/lib/types";

type SendPayload = {
  channel: MessageChannel;
  recipientEmail?: string | null;
  recipientPhone?: string | null;
  recipientName?: string | null;
  subject?: string | null;
  body: string;
};

export type DeliveryResult = {
  ok: boolean;
  provider: string;
  providerMessageId?: string;
  sentAt?: string;
  error?: string;
};

async function sendEmail(payload: SendPayload): Promise<DeliveryResult> {
  if (!payload.recipientEmail) {
    return {
      ok: false,
      provider: "email",
      error: "Email do destinatario nao informado.",
    };
  }

  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    return {
      ok: true,
      provider: "mock-email",
      providerMessageId: `mock-email-${Date.now()}`,
      sentAt: new Date().toISOString(),
    };
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });

  await transporter.sendMail({
    from: env.smtpFrom,
    to: payload.recipientEmail,
    subject: payload.subject ?? "Mensagem da agencia",
    text: payload.body,
  });

  return {
    ok: true,
    provider: "smtp",
    providerMessageId: `smtp-${Date.now()}`,
    sentAt: new Date().toISOString(),
  };
}

async function sendWhatsApp(payload: SendPayload): Promise<DeliveryResult> {
  if (!payload.recipientPhone) {
    return {
      ok: false,
      provider: "whatsapp",
      error: "Telefone do destinatario nao informado.",
    };
  }

  if (!env.whatsappApiUrl || !env.whatsappApiToken) {
    return {
      ok: true,
      provider: "mock-whatsapp",
      providerMessageId: `mock-whatsapp-${Date.now()}`,
      sentAt: new Date().toISOString(),
    };
  }

  const response = await fetch(env.whatsappApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.whatsappApiToken}`,
    },
    body: JSON.stringify({
      to: payload.recipientPhone,
      name: payload.recipientName,
      message: payload.body,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return {
      ok: false,
      provider: "whatsapp-api",
      error: `Falha no WhatsApp provider: ${response.status} ${body}`,
    };
  }

  return {
    ok: true,
    provider: "whatsapp-api",
    providerMessageId: `whatsapp-${Date.now()}`,
    sentAt: new Date().toISOString(),
  };
}

export async function dispatchMessage(message: Pick<
  MessageRecord,
  "channel" | "recipientEmail" | "recipientPhone" | "recipientName" | "subject" | "body"
>): Promise<DeliveryResult> {
  switch (message.channel) {
    case "EMAIL":
      return sendEmail(message);
    case "WHATSAPP":
      return sendWhatsApp(message);
    case "SMS":
    case "INTERNAL":
      return {
        ok: true,
        provider: `mock-${message.channel.toLowerCase()}`,
        providerMessageId: `mock-${message.channel.toLowerCase()}-${Date.now()}`,
        sentAt: new Date().toISOString(),
      };
    default:
      return {
        ok: false,
        provider: "unknown",
        error: "Canal nao suportado.",
      };
  }
}

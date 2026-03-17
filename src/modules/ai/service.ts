import { AIRequestMode } from "@prisma/client";

import { demoStore, nextDemoId } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { AIRequestRecord, MessageRecord } from "@/lib/types";
import { listClients } from "@/modules/clients/repository";
import { createMessage, updateMessageStatus } from "@/modules/messages/repository";
import { dispatchMessage } from "@/modules/messages/provider";
import { createProposal } from "@/modules/proposals/repository";
import { recordActivity } from "@/modules/shared/activity-log";
import { createTask } from "@/modules/tasks/repository";

import { getAIProvider } from "./provider";

type AIExecutionInput = {
  idea: string;
  tone: string;
  objective: string;
  responseSize: string;
  mode: AIRequestRecord["mode"];
  channel: MessageRecord["channel"];
  clientId?: string;
  leadId?: string;
};

function buildContext({
  clientName,
  niche,
  goals,
}: {
  clientName?: string;
  niche?: string | null;
  goals?: string | null;
}) {
  return [clientName ? `Cliente: ${clientName}` : null, niche ? `Nicho: ${niche}` : null, goals ? `Objetivo: ${goals}` : null]
    .filter(Boolean)
    .join(" | ");
}

async function createAIRequestRecord(input: AIExecutionInput, generatedText: string) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const request = await prisma.aIRequest.create({
        data: {
          input: input.idea,
          objective: input.objective,
          tone: input.tone,
          responseSize: input.responseSize,
          mode: input.mode as AIRequestMode,
          status: "GENERATED",
          generatedText,
          clientId: input.clientId,
          leadId: input.leadId,
        },
      });

      const client = demoStore.clients.find((item) => item.id === input.clientId);
      const lead = demoStore.leads.find((item) => item.id === input.leadId);

      return {
        id: request.id,
        input: request.input,
        objective: request.objective,
        tone: request.tone,
        responseSize: request.responseSize,
        mode: request.mode,
        status: request.status,
        generatedText: request.generatedText,
        error: request.error,
        clientId: request.clientId ?? undefined,
        clientName: client?.companyName,
        leadId: request.leadId ?? undefined,
        leadName: lead?.name,
        createdAt: request.createdAt.toISOString(),
      } satisfies AIRequestRecord;
    },
    () => {
      const client = demoStore.clients.find((item) => item.id === input.clientId);
      const lead = demoStore.leads.find((item) => item.id === input.leadId);

      const request = {
        id: nextDemoId("ai"),
        input: input.idea,
        objective: input.objective,
        tone: input.tone,
        responseSize: input.responseSize,
        mode: input.mode,
        status: "GENERATED",
        generatedText,
        error: null,
        clientId: input.clientId,
        clientName: client?.companyName,
        leadId: input.leadId,
        leadName: lead?.name,
        createdAt: new Date().toISOString(),
      } satisfies AIRequestRecord;

      demoStore.aiRequests.unshift(request);
      return request;
    },
  );
}

async function createAIErrorRecord(input: AIExecutionInput, error: string) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const request = await prisma.aIRequest.create({
        data: {
          input: input.idea,
          objective: input.objective,
          tone: input.tone,
          responseSize: input.responseSize,
          mode: input.mode as AIRequestMode,
          status: "FAILED",
          error,
          clientId: input.clientId,
          leadId: input.leadId,
        },
      });

      const client = demoStore.clients.find((item) => item.id === input.clientId);
      const lead = demoStore.leads.find((item) => item.id === input.leadId);

      return {
        id: request.id,
        input: request.input,
        objective: request.objective,
        tone: request.tone,
        responseSize: request.responseSize,
        mode: request.mode,
        status: request.status,
        generatedText: request.generatedText,
        error: request.error,
        clientId: request.clientId ?? undefined,
        clientName: client?.companyName,
        leadId: request.leadId ?? undefined,
        leadName: lead?.name,
        createdAt: request.createdAt.toISOString(),
      } satisfies AIRequestRecord;
    },
    () => {
      const client = demoStore.clients.find((item) => item.id === input.clientId);
      const lead = demoStore.leads.find((item) => item.id === input.leadId);

      const request = {
        id: nextDemoId("ai"),
        input: input.idea,
        objective: input.objective,
        tone: input.tone,
        responseSize: input.responseSize,
        mode: input.mode,
        status: "FAILED",
        generatedText: null,
        error,
        clientId: input.clientId,
        clientName: client?.companyName,
        leadId: input.leadId,
        leadName: lead?.name,
        createdAt: new Date().toISOString(),
      } satisfies AIRequestRecord;

      demoStore.aiRequests.unshift(request);
      return request;
    },
  );
}

export async function listAIRequests(): Promise<AIRequestRecord[]> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.aiRequests;
      }

      const requests = await prisma.aIRequest.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          client: true,
          lead: true,
        },
        take: 20,
      });

      return requests.map((request) => ({
        id: request.id,
        input: request.input,
        objective: request.objective,
        tone: request.tone,
        responseSize: request.responseSize,
        mode: request.mode,
        status: request.status,
        generatedText: request.generatedText,
        error: request.error,
        clientId: request.clientId,
        clientName: request.client?.companyName,
        leadId: request.leadId,
        leadName: request.lead?.name,
        createdAt: request.createdAt.toISOString(),
      }));
    },
    () => demoStore.aiRequests,
  );
}

export async function executeAIWorkflow(input: AIExecutionInput) {
  const clients = await listClients();
  const client = clients.find((item) => item.id === input.clientId);
  const lead = demoStore.leads.find((item) => item.id === input.leadId);
  const provider = getAIProvider();
  const context = buildContext({
    clientName: client?.companyName ?? lead?.name,
    niche: client?.niche ?? lead?.niche,
    goals: client?.goals ?? lead?.objective,
  });
  let generatedText: string;

  try {
    generatedText = await provider.generate({
      prompt: `Intencao: ${input.idea}\nTom: ${input.tone}\nObjetivo: ${input.objective}\nTamanho: ${input.responseSize}\nCanal: ${input.channel}`,
      context,
    });
  } catch (error) {
    const failedRequest = await createAIErrorRecord(
      input,
      error instanceof Error ? error.message : "Falha desconhecida no provider de IA.",
    );

    await recordActivity({
      action: "ai.failed",
      entityType: "AIRequest",
      entityId: failedRequest.id,
      description: `Fluxo de IA falhou: ${failedRequest.error}`,
      clientId: input.clientId,
      leadId: input.leadId,
      aiRequestId: failedRequest.id,
    });

    return failedRequest;
  }

  const aiRequest = await createAIRequestRecord(input, generatedText);

  if (input.mode === "TEXT_ONLY") {
    await recordActivity({
      action: "ai.generated",
      entityType: "AIRequest",
      entityId: aiRequest.id,
      description: "IA gerou um texto para revisao.",
      clientId: input.clientId,
      leadId: input.leadId,
      aiRequestId: aiRequest.id,
    });

    return aiRequest;
  }

  if (input.mode === "GENERATE_PROPOSAL") {
    const proposal = await createProposal({
      title: `Proposta gerada por IA - ${client?.companyName ?? lead?.name ?? "Novo negocio"}`,
      summary: generatedText.slice(0, 180),
      scope: generatedText,
      price: client?.monthlyTicket ?? 4500,
      clientId: input.clientId,
      leadId: input.leadId,
      status: "DRAFT",
    });

    await recordActivity({
      action: "proposal.generated_by_ai",
      entityType: "Proposal",
      entityId: proposal.id,
      description: "IA converteu um briefing em proposta comercial.",
      clientId: input.clientId,
      leadId: input.leadId,
      aiRequestId: aiRequest.id,
      proposalId: proposal.id,
    });

    return aiRequest;
  }

  if (input.mode === "CREATE_TASK") {
    const task = await createTask({
      title: `Acao sugerida pela IA para ${client?.companyName ?? lead?.name ?? "operacao"}`,
      description: generatedText,
      clientId: input.clientId,
      leadId: input.leadId,
      priority: "HIGH",
    });

    await recordActivity({
      action: "task.generated_by_ai",
      entityType: "Task",
      entityId: task.id,
      description: "IA criou uma tarefa operacional a partir da solicitacao.",
      clientId: input.clientId,
      leadId: input.leadId,
      aiRequestId: aiRequest.id,
      taskId: task.id,
    });

    return aiRequest;
  }

  if (input.mode === "INTERNAL_SUMMARY") {
    await recordActivity({
      action: "ai.summary",
      entityType: "AIRequest",
      entityId: aiRequest.id,
      description: "IA gerou um resumo interno para a operacao.",
      clientId: input.clientId,
      leadId: input.leadId,
      aiRequestId: aiRequest.id,
    });

    return aiRequest;
  }

  const message = await createMessage({
    subject:
      input.channel === "EMAIL"
        ? `Atualizacao - ${client?.companyName ?? lead?.name ?? "Cliente"}`
        : undefined,
    body: generatedText,
    channel: input.channel,
    status: input.mode === "AUTO_SEND" ? "QUEUED" : "DRAFT",
    recipientName: client?.name ?? lead?.name,
    recipientEmail: client?.email ?? lead?.email,
    recipientPhone: client?.phone ?? lead?.phone ?? undefined,
    clientId: input.clientId,
    leadId: input.leadId,
    aiRequestId: aiRequest.id,
  });

  if (input.mode === "AUTO_SEND") {
    const delivery = await dispatchMessage(message);

    await updateMessageStatus(message.id, delivery.ok ? "SENT" : "FAILED", delivery.sentAt);

    await recordActivity({
      action: delivery.ok ? "message.sent_by_ai" : "message.failed_by_ai",
      entityType: "Message",
      entityId: message.id,
      description: delivery.ok
        ? "IA gerou e enviou a mensagem automaticamente."
        : `IA tentou enviar a mensagem, mas houve erro: ${delivery.error ?? "desconhecido"}.`,
      clientId: input.clientId,
      leadId: input.leadId,
      aiRequestId: aiRequest.id,
      messageId: message.id,
    });

    return aiRequest;
  }

  await recordActivity({
    action: "message.draft_by_ai",
    entityType: "Message",
    entityId: message.id,
    description: "IA gerou uma mensagem e salvou como rascunho para revisao.",
    clientId: input.clientId,
    leadId: input.leadId,
    aiRequestId: aiRequest.id,
    messageId: message.id,
  });

  return aiRequest;
}

import { listAttachments } from "@/modules/attachments/repository";
import { listAIRequests } from "@/modules/ai/service";
import { listCampaigns } from "@/modules/campaigns/repository";
import { listActivityLogs } from "@/modules/logs/repository";
import { listMessages } from "@/modules/messages/repository";
import { listProposals } from "@/modules/proposals/repository";
import { listTasks } from "@/modules/tasks/repository";
import type { ActivityRecord, TimelineItem } from "@/lib/types";

function truncate(value: string, length = 180) {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length - 1)}...`;
}

function buildActivityHref(item: ActivityRecord) {
  if (item.clientId) return `/admin/clients/${item.clientId}`;
  if (item.leadId) return `/admin/leads/${item.leadId}`;
  if (item.proposalId) return `/admin/proposals/${item.proposalId}`;
  if (item.taskId) return `/admin/tasks/${item.taskId}`;
  if (item.campaignId) return `/admin/campaigns/${item.campaignId}`;
  if (item.messageId) return "/admin/messages";
  if (item.aiRequestId) return "/admin/ai";
  return "/admin/logs";
}

export async function getLeadTimeline(leadId: string, limit = 16): Promise<TimelineItem[]> {
  const [activities, messages, proposals, tasks, attachments, aiRequests] = await Promise.all([
    listActivityLogs({ leadId, take: 20 }),
    listMessages(),
    listProposals(),
    listTasks(),
    listAttachments({ leadId }),
    listAIRequests({ leadId, take: 12 }),
  ]);

  return [
    ...activities.map(
      (item) =>
        ({
          id: `activity-${item.id}`,
          kind: "activity",
          title: "Atividade do sistema",
          description: item.description,
          createdAt: item.createdAt,
          href: buildActivityHref(item),
          meta: `${item.actorName ?? "Sistema"} | ${item.action}`,
        }) satisfies TimelineItem,
    ),
    ...messages
      .filter((item) => item.leadId === leadId)
      .map(
        (item) =>
          ({
            id: `message-${item.id}`,
            kind: "message",
            title: item.subject ?? `Mensagem ${item.channel}`,
            description: truncate(item.body),
            status: item.status,
            href: "/admin/messages",
            createdAt: item.sentAt ?? item.createdAt,
            meta: `${item.channel} | ${item.recipientName ?? item.recipientEmail ?? "Contato"}`,
          }) satisfies TimelineItem,
      ),
    ...proposals
      .filter((item) => item.leadId === leadId)
      .map(
        (item) =>
          ({
            id: `proposal-${item.id}`,
            kind: "proposal",
            title: item.title,
            description: truncate(item.summary),
            status: item.status,
            href: `/admin/proposals/${item.id}`,
            createdAt: item.createdAt,
            meta: `${item.status} | ${item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
          }) satisfies TimelineItem,
      ),
    ...tasks
      .filter((item) => item.leadId === leadId)
      .map(
        (item) =>
          ({
            id: `task-${item.id}`,
            kind: "task",
            title: item.title,
            description: truncate(item.description ?? "Tarefa operacional registrada para este lead."),
            status: item.status,
            href: `/admin/tasks/${item.id}`,
            createdAt: item.dueDate ?? item.createdAt,
            meta: `${item.priority} | ${item.ownerName ?? "Sem responsavel"}`,
          }) satisfies TimelineItem,
      ),
    ...attachments.map(
      (item) =>
        ({
          id: `attachment-${item.id}`,
          kind: "attachment",
          title: item.title,
          description: item.notes ?? `Arquivo ${item.fileName}`,
          href: item.fileUrl,
          createdAt: item.createdAt,
          meta: item.proposalTitle ?? item.fileName,
        }) satisfies TimelineItem,
    ),
    ...aiRequests.map(
      (item) =>
        ({
          id: `ai-${item.id}`,
          kind: "ai",
          title: "Assistente IA",
          description: truncate(item.generatedText ?? item.input),
          status: item.status,
          href: `/admin/ai?leadId=${leadId}`,
          createdAt: item.createdAt,
          meta: `${item.mode} | ${item.objective ?? "Fluxo contextual"}`,
        }) satisfies TimelineItem,
    ),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getClientTimeline(clientId: string, limit = 18): Promise<TimelineItem[]> {
  const [activities, messages, proposals, tasks, attachments, aiRequests, campaigns] = await Promise.all([
    listActivityLogs({ clientId, take: 24 }),
    listMessages(),
    listProposals(),
    listTasks(),
    listAttachments({ clientId }),
    listAIRequests({ clientId, take: 14 }),
    listCampaigns(),
  ]);

  return [
    ...activities.map(
      (item) =>
        ({
          id: `activity-${item.id}`,
          kind: "activity",
          title: "Atividade do sistema",
          description: item.description,
          createdAt: item.createdAt,
          href: buildActivityHref(item),
          meta: `${item.actorName ?? "Sistema"} | ${item.action}`,
        }) satisfies TimelineItem,
    ),
    ...messages
      .filter((item) => item.clientId === clientId)
      .map(
        (item) =>
          ({
            id: `message-${item.id}`,
            kind: "message",
            title: item.subject ?? `Mensagem ${item.channel}`,
            description: truncate(item.body),
            status: item.status,
            href: "/admin/messages",
            createdAt: item.sentAt ?? item.createdAt,
            meta: `${item.channel} | ${item.recipientName ?? item.recipientEmail ?? "Contato"}`,
          }) satisfies TimelineItem,
      ),
    ...proposals
      .filter((item) => item.clientId === clientId)
      .map(
        (item) =>
          ({
            id: `proposal-${item.id}`,
            kind: "proposal",
            title: item.title,
            description: truncate(item.summary),
            status: item.status,
            href: `/admin/proposals/${item.id}`,
            createdAt: item.createdAt,
            meta: `${item.status} | ${item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
          }) satisfies TimelineItem,
      ),
    ...tasks
      .filter((item) => item.clientId === clientId)
      .map(
        (item) =>
          ({
            id: `task-${item.id}`,
            kind: "task",
            title: item.title,
            description: truncate(item.description ?? "Tarefa operacional registrada nesta conta."),
            status: item.status,
            href: `/admin/tasks/${item.id}`,
            createdAt: item.dueDate ?? item.createdAt,
            meta: `${item.priority} | ${item.ownerName ?? "Sem responsavel"}`,
          }) satisfies TimelineItem,
      ),
    ...attachments.map(
      (item) =>
        ({
          id: `attachment-${item.id}`,
          kind: "attachment",
          title: item.title,
          description: item.notes ?? `Arquivo ${item.fileName}`,
          href: item.fileUrl,
          createdAt: item.createdAt,
          meta: item.proposalTitle ?? item.fileName,
        }) satisfies TimelineItem,
    ),
    ...aiRequests.map(
      (item) =>
        ({
          id: `ai-${item.id}`,
          kind: "ai",
          title: "Assistente IA",
          description: truncate(item.generatedText ?? item.input),
          status: item.status,
          href: `/admin/ai?clientId=${clientId}`,
          createdAt: item.createdAt,
          meta: `${item.mode} | ${item.objective ?? "Fluxo contextual"}`,
        }) satisfies TimelineItem,
    ),
    ...campaigns
      .filter((item) => item.clientId === clientId)
      .map(
        (item) =>
          ({
            id: `campaign-${item.id}`,
            kind: "campaign",
            title: item.name,
            description: truncate(item.objective),
            status: item.status,
            href: `/admin/campaigns/${item.id}`,
            createdAt: item.createdAt,
            meta: `${item.platform} | ${item.clientName}`,
          }) satisfies TimelineItem,
      ),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

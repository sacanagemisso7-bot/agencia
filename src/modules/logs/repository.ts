import { demoStore } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { ActivityRecord } from "@/lib/types";

type ActivityFilters = {
  leadId?: string;
  clientId?: string;
  proposalId?: string;
  taskId?: string;
  campaignId?: string;
  messageId?: string;
  aiRequestId?: string;
  take?: number;
};

function matchesFilters(log: ActivityRecord, filters?: ActivityFilters) {
  if (!filters) {
    return true;
  }

  if (filters.leadId && log.leadId !== filters.leadId) return false;
  if (filters.clientId && log.clientId !== filters.clientId) return false;
  if (filters.proposalId && log.proposalId !== filters.proposalId) return false;
  if (filters.taskId && log.taskId !== filters.taskId) return false;
  if (filters.campaignId && log.campaignId !== filters.campaignId) return false;
  if (filters.messageId && log.messageId !== filters.messageId) return false;
  if (filters.aiRequestId && log.aiRequestId !== filters.aiRequestId) return false;

  return true;
}

export async function listActivityLogs(filters?: ActivityFilters): Promise<ActivityRecord[]> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.activities.filter((item) => matchesFilters(item, filters)).slice(0, filters?.take ?? 30);
      }

      const logs = await prisma.activityLog.findMany({
        where: {
          leadId: filters?.leadId,
          clientId: filters?.clientId,
          proposalId: filters?.proposalId,
          taskId: filters?.taskId,
          campaignId: filters?.campaignId,
          messageId: filters?.messageId,
          aiRequestId: filters?.aiRequestId,
        },
        orderBy: { createdAt: "desc" },
        take: filters?.take ?? 30,
        include: {
          actor: true,
        },
      });

      return logs.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        description: log.description,
        actorName: log.actor?.name ?? "Sistema",
        leadId: log.leadId,
        clientId: log.clientId,
        proposalId: log.proposalId,
        taskId: log.taskId,
        campaignId: log.campaignId,
        messageId: log.messageId,
        aiRequestId: log.aiRequestId,
        createdAt: log.createdAt.toISOString(),
      }));
    },
    () => demoStore.activities.filter((item) => matchesFilters(item, filters)).slice(0, filters?.take ?? 30),
  );
}

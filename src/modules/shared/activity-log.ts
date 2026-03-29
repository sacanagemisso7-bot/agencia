import { Prisma } from "@prisma/client";

import { demoAdminUser } from "@/lib/demo-data";
import { demoStore, nextDemoId } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";

type ActivityInput = {
  action: string;
  entityType: string;
  entityId?: string | null;
  description: string;
  actorId?: string | null;
  actorName?: string | null;
  leadId?: string | null;
  clientId?: string | null;
  proposalId?: string | null;
  taskId?: string | null;
  campaignId?: string | null;
  messageId?: string | null;
  aiRequestId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function recordActivity(input: ActivityInput) {
  await withFallback(
    async () => {
      if (!prisma) {
        return null;
      }

      return prisma.activityLog.create({
        data: {
          action: input.action,
          entityType: input.entityType,
          entityId: input.entityId,
          description: input.description,
          actorId: input.actorId ?? undefined,
          leadId: input.leadId ?? undefined,
          clientId: input.clientId ?? undefined,
          proposalId: input.proposalId ?? undefined,
          taskId: input.taskId ?? undefined,
          campaignId: input.campaignId ?? undefined,
          messageId: input.messageId ?? undefined,
          aiRequestId: input.aiRequestId ?? undefined,
          metadata: input.metadata as Prisma.InputJsonValue | undefined,
        },
      });
    },
    () => {
      demoStore.activities.unshift({
        id: nextDemoId("log"),
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        description: input.description,
        actorName: input.actorName ?? demoAdminUser.name,
        leadId: input.leadId,
        clientId: input.clientId,
        proposalId: input.proposalId,
        taskId: input.taskId,
        campaignId: input.campaignId,
        messageId: input.messageId,
        aiRequestId: input.aiRequestId,
        createdAt: new Date().toISOString(),
      });

      return null;
    },
  );
}

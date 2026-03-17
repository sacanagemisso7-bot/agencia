import { demoStore } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { ActivityRecord } from "@/lib/types";

export async function listActivityLogs(): Promise<ActivityRecord[]> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.activities;
      }

      const logs = await prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 30,
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
        createdAt: log.createdAt.toISOString(),
      }));
    },
    () => demoStore.activities,
  );
}


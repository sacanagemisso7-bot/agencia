import { demoStore } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { DashboardSummary } from "@/lib/types";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.dashboardSummary;
      }

      const [totalLeads, activeClients, openProposals, pendingTasks, runningCampaigns, sentMessages] =
        await Promise.all([
          prisma.lead.count(),
          prisma.client.count({
            where: { contractStatus: "ACTIVE" },
          }),
          prisma.proposal.count({
            where: { status: { in: ["DRAFT", "SENT", "VIEWED"] } },
          }),
          prisma.task.count({
            where: { status: { in: ["TODO", "IN_PROGRESS", "REVIEW"] } },
          }),
          prisma.campaign.count({
            where: { status: { in: ["ACTIVE", "OPTIMIZING"] } },
          }),
          prisma.message.count({
            where: { status: "SENT" },
          }),
        ]);

      const wonLeads = await prisma.lead.count({
        where: { status: "WON" },
      });

      const revenue = await prisma.client.aggregate({
        _sum: {
          monthlyTicket: true,
        },
      });

      return {
        totalLeads,
        activeClients,
        openProposals,
        pendingTasks,
        runningCampaigns,
        aiMessagesSent: sentMessages,
        conversionRate: totalLeads ? (wonLeads / totalLeads) * 100 : 0,
        estimatedRevenue: Number(revenue._sum.monthlyTicket ?? 0),
      };
    },
    () => demoStore.dashboardSummary,
  );
}


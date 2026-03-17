import { CampaignPlatform, CampaignStatus } from "@prisma/client";

import { demoStore, nextDemoId } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { CampaignRecord } from "@/lib/types";

type CampaignInput = {
  name: string;
  objective: string;
  platform: CampaignRecord["platform"];
  budget?: number;
  status?: CampaignRecord["status"];
  notes?: string;
  clientId: string;
};

function mapCampaign(campaign: {
  id: string;
  name: string;
  objective: string;
  platform: CampaignPlatform;
  budget: { toNumber(): number } | null;
  status: CampaignStatus;
  metrics: Record<string, number | string> | null;
  notes: string | null;
  createdAt: Date;
  clientId: string;
  client: { companyName: string };
}): CampaignRecord {
  return {
    id: campaign.id,
    name: campaign.name,
    objective: campaign.objective,
    platform: campaign.platform,
    budget: campaign.budget?.toNumber(),
    status: campaign.status,
    metrics: campaign.metrics,
    notes: campaign.notes,
    clientId: campaign.clientId,
    clientName: campaign.client.companyName,
    createdAt: campaign.createdAt.toISOString(),
  };
}

export async function listCampaigns(): Promise<CampaignRecord[]> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.campaigns;
      }

      const campaigns = await prisma.campaign.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          client: true,
        },
      });

      return campaigns.map((campaign) =>
        mapCampaign({
          ...campaign,
          metrics: campaign.metrics as Record<string, number | string> | null,
        }),
      );
    },
    () => demoStore.campaigns,
  );
}

export async function getCampaignById(id: string): Promise<CampaignRecord | null> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.campaigns.find((campaign) => campaign.id === id) ?? null;
      }

      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
          client: true,
        },
      });

      return campaign
        ? mapCampaign({
            ...campaign,
            metrics: campaign.metrics as Record<string, number | string> | null,
          })
        : null;
    },
    () => demoStore.campaigns.find((campaign) => campaign.id === id) ?? null,
  );
}

export async function createCampaign(input: CampaignInput): Promise<CampaignRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const campaign = await prisma.campaign.create({
        data: {
          name: input.name,
          objective: input.objective,
          platform: input.platform,
          budget: input.budget,
          status: input.status ?? "PLANNING",
          notes: input.notes,
          clientId: input.clientId,
        },
        include: {
          client: true,
        },
      });

      return mapCampaign({
        ...campaign,
        metrics: campaign.metrics as Record<string, number | string> | null,
      });
    },
    () => {
      const client = demoStore.clients.find((item) => item.id === input.clientId);
      const campaign = {
        id: nextDemoId("camp"),
        name: input.name,
        objective: input.objective,
        platform: input.platform,
        budget: input.budget,
        status: input.status ?? "PLANNING",
        notes: input.notes,
        clientId: input.clientId,
        clientName: client?.companyName ?? "Cliente",
        createdAt: new Date().toISOString(),
      } satisfies CampaignRecord;

      demoStore.campaigns.unshift(campaign);
      return campaign;
    },
  );
}

export async function deleteCampaign(id: string) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      return prisma.campaign.delete({
        where: { id },
      });
    },
    () => {
      const index = demoStore.campaigns.findIndex((item) => item.id === id);
      if (index >= 0) {
        demoStore.campaigns.splice(index, 1);
      }
      return null;
    },
  );
}

export async function updateCampaign(id: string, input: CampaignInput) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const campaign = await prisma.campaign.update({
        where: { id },
        data: {
          name: input.name,
          objective: input.objective,
          platform: input.platform,
          budget: input.budget,
          status: input.status,
          notes: input.notes,
          clientId: input.clientId,
        },
        include: {
          client: true,
        },
      });

      return mapCampaign({
        ...campaign,
        metrics: campaign.metrics as Record<string, number | string> | null,
      });
    },
    () => {
      const campaign = demoStore.campaigns.find((item) => item.id === id);
      const client = demoStore.clients.find((item) => item.id === input.clientId);

      if (campaign) {
        Object.assign(campaign, {
          name: input.name,
          objective: input.objective,
          platform: input.platform,
          budget: input.budget,
          status: input.status,
          notes: input.notes,
          clientId: input.clientId,
          clientName: client?.companyName ?? campaign.clientName,
        });
      }

      return campaign;
    },
  );
}

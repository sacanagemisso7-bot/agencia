import { ContractStatus } from "@prisma/client";

import { demoStore, nextDemoId } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { ClientRecord } from "@/lib/types";

type ClientInput = {
  name: string;
  companyName: string;
  email: string;
  phone?: string;
  niche?: string;
  goals?: string;
  monthlyTicket?: number;
  contractStatus?: ClientRecord["contractStatus"];
  activeChannels?: string[];
  notes?: string;
  websiteUrl?: string;
};

function mapClient(client: {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string | null;
  niche: string | null;
  goals: string | null;
  monthlyTicket: { toNumber(): number } | null;
  contractStatus: ContractStatus;
  activeChannels: string[];
  notes: string | null;
  websiteUrl: string | null;
  convertedFromLeadId: string | null;
  createdAt: Date;
}): ClientRecord {
  return {
    id: client.id,
    name: client.name,
    companyName: client.companyName,
    email: client.email,
    phone: client.phone,
    niche: client.niche,
    goals: client.goals,
    monthlyTicket: client.monthlyTicket?.toNumber(),
    contractStatus: client.contractStatus,
    activeChannels: client.activeChannels,
    notes: client.notes,
    websiteUrl: client.websiteUrl,
    convertedFromLeadId: client.convertedFromLeadId,
    createdAt: client.createdAt.toISOString(),
  };
}

export async function listClients(): Promise<ClientRecord[]> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.clients;
      }

      const clients = await prisma.client.findMany({
        orderBy: { createdAt: "desc" },
      });

      return clients.map(mapClient);
    },
    () => demoStore.clients,
  );
}

export async function getClientById(id: string): Promise<ClientRecord | null> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.clients.find((client) => client.id === id) ?? null;
      }

      const client = await prisma.client.findUnique({
        where: { id },
      });

      return client ? mapClient(client) : null;
    },
    () => demoStore.clients.find((client) => client.id === id) ?? null,
  );
}

export async function getClientByEmail(email: string): Promise<ClientRecord | null> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.clients.find((client) => client.email === email) ?? null;
      }

      const client = await prisma.client.findFirst({
        where: { email },
      });

      return client ? mapClient(client) : null;
    },
    () => demoStore.clients.find((client) => client.email === email) ?? null,
  );
}

export async function createClient(input: ClientInput): Promise<ClientRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const client = await prisma.client.create({
        data: {
          name: input.name,
          companyName: input.companyName,
          email: input.email,
          phone: input.phone,
          niche: input.niche,
          goals: input.goals,
          monthlyTicket: input.monthlyTicket,
          contractStatus: input.contractStatus ?? "PENDING",
          activeChannels: input.activeChannels ?? [],
          notes: input.notes,
          websiteUrl: input.websiteUrl,
        },
      });

      return mapClient(client);
    },
    () => {
      const client = {
        id: nextDemoId("client"),
        name: input.name,
        companyName: input.companyName,
        email: input.email,
        phone: input.phone,
        niche: input.niche,
        goals: input.goals,
        monthlyTicket: input.monthlyTicket,
        contractStatus: input.contractStatus ?? "PENDING",
        activeChannels: input.activeChannels ?? [],
        notes: input.notes,
        websiteUrl: input.websiteUrl,
        createdAt: new Date().toISOString(),
      } satisfies ClientRecord;

      demoStore.clients.unshift(client);
      return client;
    },
  );
}

export async function updateClient(id: string, input: ClientInput) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const client = await prisma.client.update({
        where: { id },
        data: {
          name: input.name,
          companyName: input.companyName,
          email: input.email,
          phone: input.phone,
          niche: input.niche,
          goals: input.goals,
          monthlyTicket: input.monthlyTicket,
          contractStatus: input.contractStatus,
          activeChannels: input.activeChannels ?? [],
          notes: input.notes,
          websiteUrl: input.websiteUrl,
        },
      });

      return mapClient(client);
    },
    () => {
      const client = demoStore.clients.find((item) => item.id === id);

      if (client) {
        Object.assign(client, {
          name: input.name,
          companyName: input.companyName,
          email: input.email,
          phone: input.phone,
          niche: input.niche,
          goals: input.goals,
          monthlyTicket: input.monthlyTicket,
          contractStatus: input.contractStatus,
          activeChannels: input.activeChannels ?? [],
          notes: input.notes,
          websiteUrl: input.websiteUrl,
        });
      }

      return client;
    },
  );
}

export async function deleteClient(id: string) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      return prisma.client.delete({
        where: { id },
      });
    },
    () => {
      const index = demoStore.clients.findIndex((item) => item.id === id);
      if (index >= 0) {
        demoStore.clients.splice(index, 1);
      }
      return null;
    },
  );
}

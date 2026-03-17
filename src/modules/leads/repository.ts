import { LeadStatus } from "@prisma/client";

import { demoStore, nextDemoId } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { LeadRecord } from "@/lib/types";

type LeadInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  niche?: string;
  objective?: string;
  message?: string;
  source?: string;
  tags?: string[];
  notes?: string;
  status?: LeadRecord["status"];
};

function mapLead(lead: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  niche: string | null;
  objective: string | null;
  message: string | null;
  source: string;
  status: LeadStatus;
  tags: string[];
  notes: string | null;
  createdAt: Date;
  owner?: { name: string } | null;
}): LeadRecord {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    niche: lead.niche,
    objective: lead.objective,
    message: lead.message,
    source: lead.source,
    status: lead.status,
    tags: lead.tags,
    notes: lead.notes,
    ownerName: lead.owner?.name,
    createdAt: lead.createdAt.toISOString(),
  };
}

export async function listLeads(): Promise<LeadRecord[]> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.leads;
      }

      const leads = await prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        include: { owner: true },
      });

      return leads.map(mapLead);
    },
    () => demoStore.leads,
  );
}

export async function getLeadById(id: string): Promise<LeadRecord | null> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.leads.find((lead) => lead.id === id) ?? null;
      }

      const lead = await prisma.lead.findUnique({
        where: { id },
        include: { owner: true },
      });

      return lead ? mapLead(lead) : null;
    },
    () => demoStore.leads.find((lead) => lead.id === id) ?? null,
  );
}

export async function createLead(input: LeadInput): Promise<LeadRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const lead = await prisma.lead.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          company: input.company,
          niche: input.niche,
          objective: input.objective,
          message: input.message,
          source: input.source ?? "website",
          status: input.status ?? "NEW",
          tags: input.tags ?? [],
          notes: input.notes,
        },
      });

      return mapLead({
        ...lead,
        owner: null,
      });
    },
    () => {
      const lead = {
        id: nextDemoId("lead"),
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.company,
        niche: input.niche,
        objective: input.objective,
        message: input.message,
        source: input.source ?? "website",
        status: input.status ?? "NEW",
        tags: input.tags ?? [],
        notes: input.notes,
        createdAt: new Date().toISOString(),
      } satisfies LeadRecord;

      demoStore.leads.unshift(lead);
      return lead;
    },
  );
}

export async function updateLead(id: string, input: LeadInput) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const lead = await prisma.lead.update({
        where: { id },
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          company: input.company,
          niche: input.niche,
          objective: input.objective,
          message: input.message,
          source: input.source,
          status: input.status,
          tags: input.tags ?? [],
          notes: input.notes,
        },
      });

      return mapLead({
        ...lead,
        owner: null,
      });
    },
    () => {
      const lead = demoStore.leads.find((item) => item.id === id);

      if (lead) {
        Object.assign(lead, {
          name: input.name,
          email: input.email,
          phone: input.phone,
          company: input.company,
          niche: input.niche,
          objective: input.objective,
          message: input.message,
          source: input.source,
          status: input.status,
          tags: input.tags ?? [],
          notes: input.notes,
        });
      }

      return lead;
    },
  );
}

export async function deleteLead(id: string) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      return prisma.lead.delete({
        where: { id },
      });
    },
    () => {
      const index = demoStore.leads.findIndex((item) => item.id === id);
      if (index >= 0) {
        demoStore.leads.splice(index, 1);
      }
      return null;
    },
  );
}

export async function convertLeadToClient(leadId: string) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
      });

      if (!lead) {
        return null;
      }

      const client = await prisma.client.create({
        data: {
          name: lead.name,
          companyName: lead.company ?? lead.name,
          email: lead.email,
          phone: lead.phone,
          niche: lead.niche,
          goals: lead.objective,
          notes: lead.notes,
          convertedFromLeadId: lead.id,
          activeChannels: ["Email"],
          contractStatus: "PENDING",
        },
      });

      await prisma.lead.update({
        where: { id: leadId },
        data: {
          status: "WON",
        },
      });

      return client.id;
    },
    () => {
      const lead = demoStore.leads.find((item) => item.id === leadId);

      if (!lead) {
        return null;
      }

      lead.status = "WON";

      const clientId = nextDemoId("client");

      demoStore.clients.unshift({
        id: clientId,
        name: lead.name,
        companyName: lead.company ?? lead.name,
        email: lead.email,
        phone: lead.phone,
        niche: lead.niche,
        goals: lead.objective,
        notes: lead.notes,
        monthlyTicket: null,
        contractStatus: "PENDING",
        activeChannels: ["Email"],
        convertedFromLeadId: lead.id,
        createdAt: new Date().toISOString(),
      });

      return clientId;
    },
  );
}

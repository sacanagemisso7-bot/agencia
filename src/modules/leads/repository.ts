import { LeadStatus } from "@prisma/client";

import { demoAdminUser } from "@/lib/demo-data";
import { demoStore, nextDemoId } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { LeadRecord } from "@/lib/types";

type LeadInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  niche?: string;
  contactPreference?: string;
  serviceInterest?: string;
  urgency?: string;
  objective?: string;
  message?: string;
  source?: string;
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  tags?: string[];
  notes?: string;
  estimatedTicket?: number;
  ownerId?: string;
  status?: LeadRecord["status"];
};

function mapLead(lead: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  niche: string | null;
  contactPreference: string | null;
  serviceInterest: string | null;
  urgency: string | null;
  objective: string | null;
  message: string | null;
  source: string;
  landingPage: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  status: LeadStatus;
  tags: string[];
  notes: string | null;
  estimatedTicket: { toNumber(): number } | null;
  ownerId: string | null;
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
    contactPreference: lead.contactPreference,
    serviceInterest: lead.serviceInterest,
    urgency: lead.urgency,
    objective: lead.objective,
    message: lead.message,
    source: lead.source,
    landingPage: lead.landingPage,
    referrer: lead.referrer,
    utmSource: lead.utmSource,
    utmMedium: lead.utmMedium,
    utmCampaign: lead.utmCampaign,
    utmTerm: lead.utmTerm,
    utmContent: lead.utmContent,
    status: lead.status,
    tags: lead.tags,
    notes: lead.notes,
    estimatedTicket: lead.estimatedTicket?.toNumber(),
    ownerId: lead.ownerId,
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
          contactPreference: input.contactPreference,
          serviceInterest: input.serviceInterest,
          urgency: input.urgency,
          objective: input.objective,
          message: input.message,
          source: input.source ?? "website",
          landingPage: input.landingPage,
          referrer: input.referrer,
          utmSource: input.utmSource,
          utmMedium: input.utmMedium,
          utmCampaign: input.utmCampaign,
          utmTerm: input.utmTerm,
          utmContent: input.utmContent,
          status: input.status ?? "NEW",
          tags: input.tags ?? [],
          notes: input.notes,
          estimatedTicket: input.estimatedTicket,
          ownerId: input.ownerId,
        },
        include: {
          owner: true,
        },
      });

      return mapLead(lead);
    },
    () => {
      const lead = {
        id: nextDemoId("lead"),
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.company,
        niche: input.niche,
        contactPreference: input.contactPreference,
        serviceInterest: input.serviceInterest,
        urgency: input.urgency,
        objective: input.objective,
        message: input.message,
        source: input.source ?? "website",
        landingPage: input.landingPage,
        referrer: input.referrer,
        utmSource: input.utmSource,
        utmMedium: input.utmMedium,
        utmCampaign: input.utmCampaign,
        utmTerm: input.utmTerm,
        utmContent: input.utmContent,
        status: input.status ?? "NEW",
        tags: input.tags ?? [],
        notes: input.notes,
        estimatedTicket: input.estimatedTicket,
        ownerId: input.ownerId,
        ownerName: input.ownerId ? demoAdminUser.name : undefined,
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
          contactPreference: input.contactPreference,
          serviceInterest: input.serviceInterest,
          urgency: input.urgency,
          objective: input.objective,
          message: input.message,
          source: input.source,
          landingPage: input.landingPage,
          referrer: input.referrer,
          utmSource: input.utmSource,
          utmMedium: input.utmMedium,
          utmCampaign: input.utmCampaign,
          utmTerm: input.utmTerm,
          utmContent: input.utmContent,
          status: input.status,
          tags: input.tags ?? [],
          notes: input.notes,
          estimatedTicket: input.estimatedTicket,
          ownerId: input.ownerId,
        },
        include: {
          owner: true,
        },
      });

      return mapLead(lead);
    },
    () => {
      const lead = demoStore.leads.find((item) => item.id === id);

      if (lead) {
        const nextValues = {
          name: input.name,
          email: input.email,
          phone: input.phone,
          company: input.company,
          niche: input.niche,
          contactPreference: input.contactPreference,
          serviceInterest: input.serviceInterest,
          urgency: input.urgency,
          objective: input.objective,
          message: input.message,
          source: input.source,
          landingPage: input.landingPage,
          referrer: input.referrer,
          utmSource: input.utmSource,
          utmMedium: input.utmMedium,
          utmCampaign: input.utmCampaign,
          utmTerm: input.utmTerm,
          utmContent: input.utmContent,
          status: input.status,
          tags: input.tags ?? [],
          notes: input.notes,
          estimatedTicket: input.estimatedTicket,
        } satisfies Partial<LeadRecord>;

        Object.assign(lead, nextValues);

        if (typeof input.ownerId !== "undefined") {
          lead.ownerId = input.ownerId;
          lead.ownerName = input.ownerId ? demoAdminUser.name : undefined;
        }
      }

      return lead;
    },
  );
}

export async function updateLeadStatus(id: string, status: LeadRecord["status"]) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const lead = await prisma.lead.update({
        where: { id },
        data: { status },
        include: {
          owner: true,
        },
      });

      return mapLead(lead);
    },
    () => {
      const lead = demoStore.leads.find((item) => item.id === id);
      if (lead) {
        lead.status = status;
      }
      return lead ?? null;
    },
  );
}

export async function assignLeadOwner(leadId: string, ownerId?: string, ownerName?: string) {
  return withFallback(
    async () => {
      if (!prisma || !ownerId) {
        return null;
      }

      const lead = await prisma.lead.update({
        where: { id: leadId },
        data: {
          ownerId,
        },
        include: {
          owner: true,
        },
      });

      return mapLead(lead);
    },
    () => {
      const lead = demoStore.leads.find((item) => item.id === leadId);
      if (lead) {
        lead.ownerId = ownerId;
        lead.ownerName = ownerName ?? lead.ownerName;
      }
      return lead ?? null;
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
          monthlyTicket: lead.estimatedTicket ?? undefined,
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
        monthlyTicket: lead.estimatedTicket ?? null,
        contractStatus: "PENDING",
        activeChannels: ["Email"],
        convertedFromLeadId: lead.id,
        createdAt: new Date().toISOString(),
      });

      return clientId;
    },
  );
}

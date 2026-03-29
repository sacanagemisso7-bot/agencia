import { ProposalStatus } from "@prisma/client";

import { demoStore, nextDemoId } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { ProposalRecord } from "@/lib/types";

type ProposalInput = {
  title: string;
  summary: string;
  scope: string;
  price: number;
  status?: ProposalRecord["status"];
  validUntil?: string;
  clientId?: string;
  leadId?: string;
};

function mapProposal(proposal: {
  id: string;
  title: string;
  summary: string;
  scope: string;
  price: { toNumber(): number };
  status: ProposalStatus;
  validUntil: Date | null;
  clientId: string | null;
  leadId: string | null;
  client?: { companyName: string } | null;
  lead?: { name: string } | null;
  createdAt: Date;
}): ProposalRecord {
  return {
    id: proposal.id,
    title: proposal.title,
    summary: proposal.summary,
    scope: proposal.scope,
    price: proposal.price.toNumber(),
    status: proposal.status,
    validUntil: proposal.validUntil?.toISOString(),
    clientId: proposal.clientId,
    clientName: proposal.client?.companyName,
    leadId: proposal.leadId,
    leadName: proposal.lead?.name,
    createdAt: proposal.createdAt.toISOString(),
  };
}

export async function listProposals(): Promise<ProposalRecord[]> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.proposals;
      }

      const proposals = await prisma.proposal.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          client: true,
          lead: true,
        },
      });

      return proposals.map(mapProposal);
    },
    () => demoStore.proposals,
  );
}

export async function getProposalById(id: string): Promise<ProposalRecord | null> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.proposals.find((proposal) => proposal.id === id) ?? null;
      }

      const proposal = await prisma.proposal.findUnique({
        where: { id },
        include: {
          client: true,
          lead: true,
        },
      });

      return proposal ? mapProposal(proposal) : null;
    },
    () => demoStore.proposals.find((proposal) => proposal.id === id) ?? null,
  );
}

export async function createProposal(input: ProposalInput): Promise<ProposalRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const proposal = await prisma.proposal.create({
        data: {
          title: input.title,
          summary: input.summary,
          scope: input.scope,
          price: input.price,
          status: input.status ?? "DRAFT",
          validUntil: input.validUntil ? new Date(input.validUntil) : undefined,
          clientId: input.clientId,
          leadId: input.leadId,
        },
        include: {
          client: true,
          lead: true,
        },
      });

      return mapProposal(proposal);
    },
    () => {
      const client = demoStore.clients.find((item) => item.id === input.clientId);
      const lead = demoStore.leads.find((item) => item.id === input.leadId);

      const proposal = {
        id: nextDemoId("prop"),
        title: input.title,
        summary: input.summary,
        scope: input.scope,
        price: input.price,
        status: input.status ?? "DRAFT",
        validUntil: input.validUntil,
        clientId: input.clientId,
        clientName: client?.companyName,
        leadId: input.leadId,
        leadName: lead?.name,
        createdAt: new Date().toISOString(),
      } satisfies ProposalRecord;

      demoStore.proposals.unshift(proposal);
      return proposal;
    },
  );
}

export async function deleteProposal(id: string) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      return prisma.proposal.delete({
        where: { id },
      });
    },
    () => {
      const index = demoStore.proposals.findIndex((item) => item.id === id);
      if (index >= 0) {
        demoStore.proposals.splice(index, 1);
      }
      return null;
    },
  );
}

export async function updateProposal(id: string, input: ProposalInput) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const proposal = await prisma.proposal.update({
        where: { id },
        data: {
          title: input.title,
          summary: input.summary,
          scope: input.scope,
          price: input.price,
          status: input.status,
          validUntil: input.validUntil ? new Date(input.validUntil) : null,
          clientId: input.clientId,
          leadId: input.leadId,
        },
        include: {
          client: true,
          lead: true,
        },
      });

      return mapProposal(proposal);
    },
    () => {
      const proposal = demoStore.proposals.find((item) => item.id === id);
      const client = demoStore.clients.find((item) => item.id === input.clientId);
      const lead = demoStore.leads.find((item) => item.id === input.leadId);

      if (proposal) {
        Object.assign(proposal, {
          title: input.title,
          summary: input.summary,
          scope: input.scope,
          price: input.price,
          status: input.status,
          validUntil: input.validUntil,
          clientId: input.clientId,
          clientName: client?.companyName,
          leadId: input.leadId,
          leadName: lead?.name,
        });
      }

      return proposal;
    },
  );
}

export async function updateProposalStatus(id: string, status: ProposalRecord["status"]) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const proposal = await prisma.proposal.update({
        where: { id },
        data: { status },
        include: {
          client: true,
          lead: true,
        },
      });

      return mapProposal(proposal);
    },
    () => {
      const proposal = demoStore.proposals.find((item) => item.id === id);
      if (proposal) {
        proposal.status = status;
      }
      return proposal ?? null;
    },
  );
}

export async function updateProposalLinks(id: string, input: { clientId?: string | null; leadId?: string | null }) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const proposal = await prisma.proposal.update({
        where: { id },
        data: {
          clientId: typeof input.clientId === "undefined" ? undefined : input.clientId,
          leadId: typeof input.leadId === "undefined" ? undefined : input.leadId,
        },
        include: {
          client: true,
          lead: true,
        },
      });

      return mapProposal(proposal);
    },
    () => {
      const proposal = demoStore.proposals.find((item) => item.id === id);
      const client = demoStore.clients.find((item) => item.id === input.clientId);
      const lead = demoStore.leads.find((item) => item.id === input.leadId);

      if (proposal) {
        if (typeof input.clientId !== "undefined") {
          proposal.clientId = input.clientId ?? undefined;
          proposal.clientName = client?.companyName;
        }

        if (typeof input.leadId !== "undefined") {
          proposal.leadId = input.leadId ?? undefined;
          proposal.leadName = lead?.name;
        }
      }

      return proposal ?? null;
    },
  );
}

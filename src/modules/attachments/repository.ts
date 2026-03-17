import { demoStore, nextDemoId } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { AttachmentRecord } from "@/lib/types";

type AttachmentInput = {
  title: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  sizeBytes?: number;
  notes?: string;
  clientId?: string;
  leadId?: string;
  proposalId?: string;
};

function mapAttachment(attachment: {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  mimeType: string | null;
  sizeBytes: number | null;
  notes: string | null;
  clientId: string | null;
  leadId: string | null;
  proposalId: string | null;
  createdAt: Date;
  client?: { companyName: string } | null;
  lead?: { name: string } | null;
  proposal?: { title: string } | null;
}): AttachmentRecord {
  return {
    id: attachment.id,
    title: attachment.title,
    fileName: attachment.fileName,
    fileUrl: attachment.fileUrl,
    mimeType: attachment.mimeType,
    sizeBytes: attachment.sizeBytes,
    notes: attachment.notes,
    clientId: attachment.clientId,
    clientName: attachment.client?.companyName,
    leadId: attachment.leadId,
    leadName: attachment.lead?.name,
    proposalId: attachment.proposalId,
    proposalTitle: attachment.proposal?.title,
    createdAt: attachment.createdAt.toISOString(),
  };
}

export async function listAttachments(filters?: {
  clientId?: string;
  proposalId?: string;
  leadId?: string;
}): Promise<AttachmentRecord[]> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.attachments.filter((attachment) => {
          if (filters?.clientId && attachment.clientId !== filters.clientId) return false;
          if (filters?.proposalId && attachment.proposalId !== filters.proposalId) return false;
          if (filters?.leadId && attachment.leadId !== filters.leadId) return false;
          return true;
        });
      }

      const attachments = await prisma.attachment.findMany({
        where: {
          clientId: filters?.clientId,
          proposalId: filters?.proposalId,
          leadId: filters?.leadId,
        },
        include: {
          client: true,
          lead: true,
          proposal: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return attachments.map(mapAttachment);
    },
    () =>
      demoStore.attachments.filter((attachment) => {
        if (filters?.clientId && attachment.clientId !== filters.clientId) return false;
        if (filters?.proposalId && attachment.proposalId !== filters.proposalId) return false;
        if (filters?.leadId && attachment.leadId !== filters.leadId) return false;
        return true;
      }),
  );
}

export async function createAttachment(input: AttachmentInput): Promise<AttachmentRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const attachment = await prisma.attachment.create({
        data: {
          title: input.title,
          fileName: input.fileName,
          fileUrl: input.fileUrl,
          mimeType: input.mimeType,
          sizeBytes: input.sizeBytes,
          notes: input.notes,
          clientId: input.clientId,
          leadId: input.leadId,
          proposalId: input.proposalId,
        },
        include: {
          client: true,
          lead: true,
          proposal: true,
        },
      });

      return mapAttachment(attachment);
    },
    () => {
      const client = demoStore.clients.find((item) => item.id === input.clientId);
      const lead = demoStore.leads.find((item) => item.id === input.leadId);
      const proposal = demoStore.proposals.find((item) => item.id === input.proposalId);
      const attachment = {
        id: nextDemoId("att"),
        title: input.title,
        fileName: input.fileName,
        fileUrl: input.fileUrl,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        notes: input.notes,
        clientId: input.clientId,
        clientName: client?.companyName,
        leadId: input.leadId,
        leadName: lead?.name,
        proposalId: input.proposalId,
        proposalTitle: proposal?.title,
        createdAt: new Date().toISOString(),
      } satisfies AttachmentRecord;

      demoStore.attachments.unshift(attachment);
      return attachment;
    },
  );
}


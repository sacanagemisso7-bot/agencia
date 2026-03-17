"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createAttachment } from "@/modules/attachments/repository";
import { recordActivity } from "@/modules/shared/activity-log";

const attachmentSchema = z.object({
  title: z.string().min(3),
  fileName: z.string().min(3),
  fileUrl: z.string().url(),
  mimeType: z.string().optional(),
  sizeBytes: z.string().optional(),
  notes: z.string().optional(),
  clientId: z.string().optional(),
  leadId: z.string().optional(),
  proposalId: z.string().optional(),
  redirectTo: z.string().min(1),
});

export async function createAttachmentAction(formData: FormData) {
  const parsed = attachmentSchema.parse({
    title: String(formData.get("title") ?? ""),
    fileName: String(formData.get("fileName") ?? ""),
    fileUrl: String(formData.get("fileUrl") ?? ""),
    mimeType: String(formData.get("mimeType") ?? ""),
    sizeBytes: String(formData.get("sizeBytes") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    clientId: String(formData.get("clientId") ?? ""),
    leadId: String(formData.get("leadId") ?? ""),
    proposalId: String(formData.get("proposalId") ?? ""),
    redirectTo: String(formData.get("redirectTo") ?? ""),
  });

  const attachment = await createAttachment({
    title: parsed.title,
    fileName: parsed.fileName,
    fileUrl: parsed.fileUrl,
    mimeType: parsed.mimeType || undefined,
    sizeBytes: parsed.sizeBytes ? Number(parsed.sizeBytes) : undefined,
    notes: parsed.notes || undefined,
    clientId: parsed.clientId || undefined,
    leadId: parsed.leadId || undefined,
    proposalId: parsed.proposalId || undefined,
  });

  await recordActivity({
    action: "attachment.created",
    entityType: "Attachment",
    entityId: attachment.id,
    description: "Novo anexo registrado no sistema.",
    clientId: attachment.clientId,
    leadId: attachment.leadId,
    proposalId: attachment.proposalId,
  });

  revalidatePath(parsed.redirectTo);
  redirect(`${parsed.redirectTo}?success=attachment`);
}

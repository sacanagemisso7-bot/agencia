import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";
import { logOperationalEvent } from "@/lib/logger";
import { getStorageProvider } from "@/lib/storage";
import { createAttachment } from "@/modules/attachments/repository";
import { recordActivity } from "@/modules/shared/activity-log";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || !file.size) {
    return NextResponse.redirect(new URL(String(formData.get("redirectTo") ?? "/admin"), request.url));
  }

  const redirectTo = String(formData.get("redirectTo") ?? "/admin");
  const storage = getStorageProvider();

  try {
    const uploadedFile = await storage.upload(file);

    const attachment = await createAttachment({
      title: String(formData.get("title") ?? file.name),
      fileName: uploadedFile.fileName,
      fileUrl: uploadedFile.fileUrl,
      mimeType: uploadedFile.mimeType,
      sizeBytes: uploadedFile.sizeBytes,
      notes: String(formData.get("notes") ?? "") || undefined,
      clientId: String(formData.get("clientId") ?? "") || undefined,
      leadId: String(formData.get("leadId") ?? "") || undefined,
      proposalId: String(formData.get("proposalId") ?? "") || undefined,
    });

    await recordActivity({
      action: "attachment.uploaded",
      entityType: "Attachment",
      entityId: attachment.id,
      description: "Arquivo enviado e registrado com sucesso.",
      clientId: attachment.clientId,
      leadId: attachment.leadId,
      proposalId: attachment.proposalId,
    });

    await logOperationalEvent({
      level: "info",
      event: "attachment.uploaded",
      message: "Upload processado com sucesso.",
      metadata: {
        attachmentId: attachment.id,
        fileUrl: attachment.fileUrl,
      },
    });

    return NextResponse.redirect(new URL(`${redirectTo}?success=attachment`, request.url));
  } catch (error) {
    await logOperationalEvent({
      level: "error",
      event: "attachment.upload_failed",
      message: error instanceof Error ? error.message : "Falha desconhecida no upload.",
      metadata: {
        redirectTo,
        fileName: file.name,
      },
    });

    return NextResponse.redirect(new URL(`${redirectTo}?error=attachment`, request.url));
  }
}

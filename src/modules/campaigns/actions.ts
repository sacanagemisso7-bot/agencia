"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createCampaign, deleteCampaign, updateCampaign } from "@/modules/campaigns/repository";
import { recordActivity } from "@/modules/shared/activity-log";

const campaignSchema = z.object({
  name: z.string().min(3, "Nome obrigatorio."),
  objective: z.string().min(5, "Objetivo obrigatorio."),
  platform: z.enum(["META", "GOOGLE", "LINKEDIN", "TIKTOK", "OTHER"]),
  budget: z.string().optional(),
  status: z.enum(["PLANNING", "ACTIVE", "OPTIMIZING", "PAUSED", "COMPLETED"]).optional(),
  notes: z.string().optional(),
  clientId: z.string().min(1, "Selecione o cliente."),
});

export async function createCampaignAction(formData: FormData) {
  const parsed = campaignSchema.parse({
    name: String(formData.get("name") ?? ""),
    objective: String(formData.get("objective") ?? ""),
    platform: String(formData.get("platform") ?? "META"),
    budget: String(formData.get("budget") ?? ""),
    status: String(formData.get("status") ?? "PLANNING"),
    notes: String(formData.get("notes") ?? ""),
    clientId: String(formData.get("clientId") ?? ""),
  });

  const campaign = await createCampaign({
    ...parsed,
    budget: parsed.budget ? Number(parsed.budget) : undefined,
  });

  await recordActivity({
    action: "campaign.created",
    entityType: "Campaign",
    entityId: campaign.id,
    description: "Nova campanha registrada na operacao.",
    clientId: campaign.clientId,
    campaignId: campaign.id,
  });

  revalidatePath("/admin/campaigns");
  revalidatePath("/admin");
  redirect("/admin/campaigns?success=created");
}

export async function deleteCampaignAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await deleteCampaign(id);

  await recordActivity({
    action: "campaign.deleted",
    entityType: "Campaign",
    entityId: id,
    description: "Campanha removida.",
    campaignId: id,
  });

  revalidatePath("/admin/campaigns");
  redirect("/admin/campaigns?success=deleted");
}

export async function updateCampaignAction(id: string, formData: FormData) {
  const parsed = campaignSchema.parse({
    name: String(formData.get("name") ?? ""),
    objective: String(formData.get("objective") ?? ""),
    platform: String(formData.get("platform") ?? "META"),
    budget: String(formData.get("budget") ?? ""),
    status: String(formData.get("status") ?? "PLANNING"),
    notes: String(formData.get("notes") ?? ""),
    clientId: String(formData.get("clientId") ?? ""),
  });

  const campaign = await updateCampaign(id, {
    ...parsed,
    budget: parsed.budget ? Number(parsed.budget) : undefined,
  });

  await recordActivity({
    action: "campaign.updated",
    entityType: "Campaign",
    entityId: id,
    description: "Campanha atualizada no painel.",
    clientId: campaign?.clientId,
    campaignId: id,
  });

  revalidatePath("/admin/campaigns");
  redirect("/admin/campaigns?success=updated");
}

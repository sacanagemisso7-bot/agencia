"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { convertLeadToClient, createLead, deleteLead, updateLead } from "@/modules/leads/repository";
import { recordActivity } from "@/modules/shared/activity-log";

const leadSchema = z.object({
  name: z.string().min(2, "Nome obrigatorio."),
  email: z.string().email("Email invalido."),
  phone: z.string().optional(),
  company: z.string().optional(),
  niche: z.string().optional(),
  objective: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
  status: z
    .enum(["NEW", "CONTACTED", "MEETING_SCHEDULED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST"])
    .optional(),
});

export async function createLeadAction(formData: FormData) {
  const parsed = leadSchema.parse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    company: String(formData.get("company") ?? ""),
    niche: String(formData.get("niche") ?? ""),
    objective: String(formData.get("objective") ?? ""),
    message: String(formData.get("message") ?? ""),
    source: String(formData.get("source") ?? ""),
    tags: String(formData.get("tags") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    status: (formData.get("status") as string | null) ?? "NEW",
  });

  const lead = await createLead({
    ...parsed,
    tags: parsed.tags ? parsed.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
  });

  await recordActivity({
    action: "lead.created",
    entityType: "Lead",
    entityId: lead.id,
    description: "Novo lead registrado no sistema.",
    leadId: lead.id,
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  redirect("/admin/leads?success=created");
}

export async function updateLeadAction(id: string, formData: FormData) {
  const parsed = leadSchema.parse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    company: String(formData.get("company") ?? ""),
    niche: String(formData.get("niche") ?? ""),
    objective: String(formData.get("objective") ?? ""),
    message: String(formData.get("message") ?? ""),
    source: String(formData.get("source") ?? ""),
    tags: String(formData.get("tags") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    status: String(formData.get("status") ?? "NEW"),
  });

  await updateLead(id, {
    ...parsed,
    tags: parsed.tags ? parsed.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
  });

  await recordActivity({
    action: "lead.updated",
    entityType: "Lead",
    entityId: id,
    description: "Lead atualizado pelo painel administrativo.",
    leadId: id,
  });

  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}

export async function deleteLeadAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await deleteLead(id);

  await recordActivity({
    action: "lead.deleted",
    entityType: "Lead",
    entityId: id,
    description: "Lead removido do CRM.",
    leadId: id,
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function captureLeadFromSiteAction(formData: FormData) {
  const parsed = leadSchema.parse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    company: String(formData.get("company") ?? ""),
    niche: String(formData.get("niche") ?? ""),
    objective: String(formData.get("objective") ?? ""),
    message: String(formData.get("message") ?? ""),
    source: "website",
    tags: "",
    notes: "",
    status: "NEW",
  });

  const lead = await createLead({
    ...parsed,
    source: "website",
    tags: [],
    status: "NEW",
  });

  await recordActivity({
    action: "lead.captured_from_site",
    entityType: "Lead",
    entityId: lead.id,
    description: "Visitante preencheu o formulario de contato do site.",
    leadId: lead.id,
  });

  redirect("/contato?success=1");
}

export async function convertLeadToClientAction(formData: FormData) {
  const leadId = String(formData.get("id") ?? "");
  const clientId = await convertLeadToClient(leadId);

  if (!clientId) {
    redirect("/admin/leads?error=convert");
  }

  await recordActivity({
    action: "lead.converted_to_client",
    entityType: "Client",
    entityId: clientId,
    description: "Lead convertido em cliente a partir do CRM.",
    leadId,
    clientId,
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin/clients");
  revalidatePath("/admin");
  redirect(`/admin/clients/${clientId}?success=converted`);
}

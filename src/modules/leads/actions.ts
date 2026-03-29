"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { sendLeadAutoReply } from "@/modules/leads/auto-reply";
import { notifyHighIntentLead } from "@/modules/leads/high-intent-alert";
import { routeHighIntentLead } from "@/modules/leads/routing";
import { convertLeadToClient, createLead, deleteLead, updateLead, updateLeadStatus } from "@/modules/leads/repository";
import { recordActivity } from "@/modules/shared/activity-log";

const leadSchema = z.object({
  name: z.string().min(2, "Nome obrigatorio."),
  email: z.string().email("Email invalido."),
  phone: z.string().optional(),
  company: z.string().optional(),
  niche: z.string().optional(),
  contactPreference: z.string().optional(),
  serviceInterest: z.string().optional(),
  urgency: z.string().optional(),
  objective: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  landingPage: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  estimatedTicket: z.string().optional(),
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
    contactPreference: String(formData.get("contactPreference") ?? ""),
    serviceInterest: String(formData.get("serviceInterest") ?? ""),
    urgency: String(formData.get("urgency") ?? ""),
    objective: String(formData.get("objective") ?? ""),
    message: String(formData.get("message") ?? ""),
    source: String(formData.get("source") ?? "manual"),
    landingPage: String(formData.get("landingPage") ?? ""),
    referrer: String(formData.get("referrer") ?? ""),
    utmSource: String(formData.get("utmSource") ?? ""),
    utmMedium: String(formData.get("utmMedium") ?? ""),
    utmCampaign: String(formData.get("utmCampaign") ?? ""),
    utmTerm: String(formData.get("utmTerm") ?? ""),
    utmContent: String(formData.get("utmContent") ?? ""),
    estimatedTicket: String(formData.get("estimatedTicket") ?? ""),
    tags: String(formData.get("tags") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    status: (formData.get("status") as string | null) ?? "NEW",
  });

  const lead = await createLead({
    ...parsed,
    source: parsed.source || "manual",
    estimatedTicket: parsed.estimatedTicket ? Number(parsed.estimatedTicket) : undefined,
    tags: parsed.tags ? parsed.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
  });

  await routeHighIntentLead(lead);

  await recordActivity({
    action: "lead.created",
    entityType: "Lead",
    entityId: lead.id,
    description: "Novo lead registrado no sistema.",
    leadId: lead.id,
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  revalidatePath("/admin/tasks");
  revalidatePath("/admin/notifications");
  revalidatePath("/admin/scheduling");
  redirect("/admin/leads?success=created");
}

export async function updateLeadAction(id: string, formData: FormData) {
  const parsed = leadSchema.parse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    company: String(formData.get("company") ?? ""),
    niche: String(formData.get("niche") ?? ""),
    contactPreference: String(formData.get("contactPreference") ?? ""),
    serviceInterest: String(formData.get("serviceInterest") ?? ""),
    urgency: String(formData.get("urgency") ?? ""),
    objective: String(formData.get("objective") ?? ""),
    message: String(formData.get("message") ?? ""),
    source: String(formData.get("source") ?? ""),
    landingPage: String(formData.get("landingPage") ?? ""),
    referrer: String(formData.get("referrer") ?? ""),
    utmSource: String(formData.get("utmSource") ?? ""),
    utmMedium: String(formData.get("utmMedium") ?? ""),
    utmCampaign: String(formData.get("utmCampaign") ?? ""),
    utmTerm: String(formData.get("utmTerm") ?? ""),
    utmContent: String(formData.get("utmContent") ?? ""),
    estimatedTicket: String(formData.get("estimatedTicket") ?? ""),
    tags: String(formData.get("tags") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    status: String(formData.get("status") ?? "NEW"),
  });

  await updateLead(id, {
    ...parsed,
    estimatedTicket: parsed.estimatedTicket ? Number(parsed.estimatedTicket) : undefined,
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
    contactPreference: String(formData.get("contactPreference") ?? ""),
    serviceInterest: String(formData.get("serviceInterest") ?? ""),
    urgency: String(formData.get("urgency") ?? ""),
    objective: String(formData.get("objective") ?? ""),
    message: String(formData.get("message") ?? ""),
    source: String(formData.get("source") ?? "website"),
    landingPage: String(formData.get("landingPage") ?? ""),
    referrer: String(formData.get("referrer") ?? ""),
    utmSource: String(formData.get("utmSource") ?? ""),
    utmMedium: String(formData.get("utmMedium") ?? ""),
    utmCampaign: String(formData.get("utmCampaign") ?? ""),
    utmTerm: String(formData.get("utmTerm") ?? ""),
    utmContent: String(formData.get("utmContent") ?? ""),
    estimatedTicket: String(formData.get("estimatedTicket") ?? ""),
    tags: "",
    notes: "",
    status: "NEW",
  });

  const lead = await createLead({
    ...parsed,
    source: parsed.source || "website",
    estimatedTicket: parsed.estimatedTicket ? Number(parsed.estimatedTicket) : undefined,
    tags: [],
    status: "NEW",
  });

  await recordActivity({
    action: "lead.captured_from_site",
    entityType: "Lead",
    entityId: lead.id,
    description: "Visitante preencheu o formulario de contato do site.",
    leadId: lead.id,
    metadata: {
      serviceInterest: lead.serviceInterest,
      urgency: lead.urgency,
      estimatedTicket: lead.estimatedTicket,
      contactPreference: lead.contactPreference,
      landingPage: lead.landingPage,
      utmSource: lead.utmSource,
      utmMedium: lead.utmMedium,
      utmCampaign: lead.utmCampaign,
      utmTerm: lead.utmTerm,
      utmContent: lead.utmContent,
    },
  });

  await sendLeadAutoReply(lead);
  await routeHighIntentLead(lead);
  await notifyHighIntentLead(lead);

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/tasks");
  revalidatePath("/admin/notifications");
  revalidatePath("/admin/messages");
  revalidatePath("/admin/logs");
  revalidatePath("/admin/reports");
  revalidatePath("/admin/scheduling");

  const serviceQuery = lead.serviceInterest ? `&service=${encodeURIComponent(lead.serviceInterest)}` : "";
  const contactPreferenceQuery = lead.contactPreference
    ? `&contactPreference=${encodeURIComponent(lead.contactPreference)}`
    : "";
  redirect(`/obrigado?success=1${serviceQuery}${contactPreferenceQuery}`);
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

export async function moveLeadStageAction(
  id: string,
  status: "NEW" | "CONTACTED" | "MEETING_SCHEDULED" | "PROPOSAL_SENT" | "NEGOTIATION" | "WON" | "LOST",
) {
  await updateLeadStatus(id, status);

  await recordActivity({
    action: "lead.stage_moved",
    entityType: "Lead",
    entityId: id,
    description: `Lead movido para ${status.replaceAll("_", " ")} via pipeline.`,
    leadId: id,
  });

  revalidatePath("/admin/pipeline");
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  revalidatePath("/admin/notifications");
  revalidatePath("/admin/reports");
}

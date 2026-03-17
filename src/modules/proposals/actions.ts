"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createProposal, deleteProposal, updateProposal } from "@/modules/proposals/repository";
import { recordActivity } from "@/modules/shared/activity-log";

const proposalSchema = z.object({
  title: z.string().min(3, "Titulo obrigatorio."),
  summary: z.string().min(10, "Resumo obrigatorio."),
  scope: z.string().min(10, "Escopo obrigatorio."),
  price: z.string().min(1, "Preco obrigatorio."),
  status: z.enum(["DRAFT", "SENT", "VIEWED", "ACCEPTED", "REJECTED", "EXPIRED"]).optional(),
  validUntil: z.string().optional(),
  clientId: z.string().optional(),
  leadId: z.string().optional(),
});

export async function createProposalAction(formData: FormData) {
  const parsed = proposalSchema.parse({
    title: String(formData.get("title") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    scope: String(formData.get("scope") ?? ""),
    price: String(formData.get("price") ?? ""),
    status: String(formData.get("status") ?? "DRAFT"),
    validUntil: String(formData.get("validUntil") ?? ""),
    clientId: String(formData.get("clientId") ?? ""),
    leadId: String(formData.get("leadId") ?? ""),
  });

  const proposal = await createProposal({
    ...parsed,
    price: Number(parsed.price),
    clientId: parsed.clientId || undefined,
    leadId: parsed.leadId || undefined,
    validUntil: parsed.validUntil || undefined,
  });

  await recordActivity({
    action: "proposal.created",
    entityType: "Proposal",
    entityId: proposal.id,
    description: "Nova proposta criada no painel.",
    clientId: proposal.clientId,
    leadId: proposal.leadId,
    proposalId: proposal.id,
  });

  revalidatePath("/admin/proposals");
  redirect("/admin/proposals?success=created");
}

export async function deleteProposalAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await deleteProposal(id);

  await recordActivity({
    action: "proposal.deleted",
    entityType: "Proposal",
    entityId: id,
    description: "Proposta removida do pipeline.",
    proposalId: id,
  });

  revalidatePath("/admin/proposals");
  redirect("/admin/proposals?success=deleted");
}

export async function updateProposalAction(id: string, formData: FormData) {
  const parsed = proposalSchema.parse({
    title: String(formData.get("title") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    scope: String(formData.get("scope") ?? ""),
    price: String(formData.get("price") ?? ""),
    status: String(formData.get("status") ?? "DRAFT"),
    validUntil: String(formData.get("validUntil") ?? ""),
    clientId: String(formData.get("clientId") ?? ""),
    leadId: String(formData.get("leadId") ?? ""),
  });

  const proposal = await updateProposal(id, {
    ...parsed,
    price: Number(parsed.price),
    clientId: parsed.clientId || undefined,
    leadId: parsed.leadId || undefined,
    validUntil: parsed.validUntil || undefined,
  });

  await recordActivity({
    action: "proposal.updated",
    entityType: "Proposal",
    entityId: id,
    description: "Proposta atualizada no painel.",
    clientId: proposal?.clientId,
    leadId: proposal?.leadId,
    proposalId: id,
  });

  revalidatePath("/admin/proposals");
  redirect("/admin/proposals?success=updated");
}

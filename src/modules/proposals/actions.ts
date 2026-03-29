"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth";
import { getClientByEmail, listClients } from "@/modules/clients/repository";
import { ensureContractEntryForProposal } from "@/modules/finance/service";
import { listLeads } from "@/modules/leads/repository";
import { createMessage } from "@/modules/messages/repository";
import { createTask, listTasks } from "@/modules/tasks/repository";
import { convertLeadToClient } from "@/modules/leads/repository";
import {
  createProposal,
  deleteProposal,
  getProposalById,
  updateProposal,
  updateProposalLinks,
  updateProposalStatus,
} from "@/modules/proposals/repository";
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
  revalidatePath("/admin/notifications");
  revalidatePath("/admin/reports");
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
  revalidatePath("/admin/notifications");
  revalidatePath("/admin/reports");
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
  revalidatePath("/admin/notifications");
  revalidatePath("/admin/reports");
  redirect("/admin/proposals?success=updated");
}

export async function moveProposalStageAction(
  id: string,
  status: "DRAFT" | "SENT" | "VIEWED" | "ACCEPTED" | "REJECTED" | "EXPIRED",
) {
  const proposal = await updateProposalStatus(id, status);

  await recordActivity({
    action: "proposal.stage_moved",
    entityType: "Proposal",
    entityId: id,
    description: `Proposta movida para ${status.replaceAll("_", " ")} via pipeline.`,
    clientId: proposal?.clientId,
    leadId: proposal?.leadId,
    proposalId: id,
  });

  revalidatePath("/admin/pipeline");
  revalidatePath("/admin/proposals");
  revalidatePath("/admin/reports");
  revalidatePath("/admin/notifications");
}

export async function sendProposalForApprovalAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const proposal = await getProposalById(id);

  if (!proposal) {
    redirect("/admin/proposals?error=missing");
  }

  const [clients, leads] = await Promise.all([listClients(), listLeads()]);
  const client = proposal.clientId ? clients.find((item) => item.id === proposal.clientId) : null;
  const lead = proposal.leadId ? leads.find((item) => item.id === proposal.leadId) : null;
  const recipientName = client?.name ?? lead?.name ?? proposal.clientName ?? proposal.leadName ?? "Contato";
  const recipientEmail = client?.email ?? lead?.email;

  await updateProposalStatus(id, "SENT");

  await createMessage({
    subject: `Proposta comercial | ${proposal.title}`,
    body: [
      `Oi ${recipientName}, tudo bem?`,
      "",
      `A proposta "${proposal.title}" esta pronta para sua avaliacao.`,
      proposal.summary,
      "",
      `Valor proposto: ${proposal.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
      "",
      "Assim que houver sinal verde, seguimos com os proximos passos de onboarding e ativacao.",
    ].join("\n"),
    channel: recipientEmail ? "EMAIL" : "INTERNAL",
    status: "QUEUED",
    recipientName,
    recipientEmail,
    clientId: proposal.clientId ?? undefined,
    leadId: proposal.leadId ?? undefined,
  });

  await recordActivity({
    action: "proposal.sent_for_approval",
    entityType: "Proposal",
    entityId: id,
    description: "Proposta enviada para aprovacao comercial.",
    proposalId: id,
    clientId: proposal.clientId,
    leadId: proposal.leadId,
  });

  revalidatePath("/admin/proposals");
  revalidatePath(`/admin/proposals/${id}`);
  revalidatePath("/admin/messages");
  revalidatePath("/admin/notifications");
  redirect(`/admin/proposals/${id}?success=sent`);
}

async function ensureOnboardingTask(input: {
  proposalId: string;
  proposalTitle: string;
  clientId?: string | null;
  clientName?: string | null;
}) {
  if (!input.clientId) {
    return null;
  }

  const tasks = await listTasks();
  const existing = tasks.find(
    (task) =>
      task.clientId === input.clientId &&
      task.title.toLowerCase().includes("onboarding") &&
      task.status !== "DONE",
  );

  if (existing) {
    return existing;
  }

  return createTask({
    title: `Onboarding comercial: ${input.clientName ?? "cliente"}`,
    description: `Kickoff e alinhamento inicial apos aceite da proposta ${input.proposalTitle}.`,
    priority: "HIGH",
    status: "TODO",
    clientId: input.clientId,
  });
}

export async function registerProposalDecisionAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "ACCEPTED") as "ACCEPTED" | "REJECTED";
  const session = await getSessionUser();
  const proposal = await getProposalById(id);

  if (!session || !proposal) {
    redirect("/login");
  }

  if (session.role === "CLIENT") {
    const client = await getClientByEmail(session.email);
    if (!client || proposal.clientId !== client.id) {
      redirect("/portal");
    }
  }

  let clientId = proposal.clientId;
  let clientName = proposal.clientName;

  if (decision === "ACCEPTED" && !clientId && proposal.leadId) {
    const convertedClientId = await convertLeadToClient(proposal.leadId);
    if (convertedClientId) {
      const relinkedProposal = await updateProposalLinks(id, {
        clientId: convertedClientId,
      });
      clientId = relinkedProposal?.clientId ?? convertedClientId;
      clientName = relinkedProposal?.clientName ?? clientName;
    }
  }

  await updateProposalStatus(id, decision);

  if (decision === "ACCEPTED" && clientId) {
    await ensureContractEntryForProposal({
      proposalId: proposal.id,
      proposalTitle: proposal.title,
      amount: proposal.price,
      clientId,
    });

    await ensureOnboardingTask({
      proposalId: proposal.id,
      proposalTitle: proposal.title,
      clientId,
      clientName,
    });
  }

  await recordActivity({
    action: decision === "ACCEPTED" ? "proposal.accepted" : "proposal.rejected",
    entityType: "Proposal",
    entityId: id,
    description:
      decision === "ACCEPTED"
        ? "Proposta aceita e encaminhada para onboarding/financeiro."
        : "Proposta recusada e devolvida para ajuste comercial.",
    proposalId: id,
    clientId: clientId ?? undefined,
    leadId: proposal.leadId ?? undefined,
    metadata: {
      actorRole: session.role,
      actorEmail: session.email,
    },
  });

  revalidatePath("/admin/proposals");
  revalidatePath(`/admin/proposals/${id}`);
  revalidatePath("/admin/finance");
  revalidatePath("/admin/clients");
  revalidatePath("/admin/reports");
  revalidatePath("/admin/notifications");
  revalidatePath("/portal");

  if (session.role === "CLIENT") {
    redirect(`/portal?success=${decision === "ACCEPTED" ? "proposal-accepted" : "proposal-rejected"}`);
  }

  redirect(`/admin/proposals/${id}?success=${decision === "ACCEPTED" ? "accepted" : "rejected"}`);
}

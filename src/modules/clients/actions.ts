"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient, deleteClient, updateClient } from "@/modules/clients/repository";
import { recordActivity } from "@/modules/shared/activity-log";

const clientSchema = z.object({
  name: z.string().min(2, "Nome obrigatorio."),
  companyName: z.string().min(2, "Empresa obrigatoria."),
  email: z.string().email("Email invalido."),
  phone: z.string().optional(),
  niche: z.string().optional(),
  goals: z.string().optional(),
  monthlyTicket: z.string().optional(),
  contractStatus: z.enum(["PENDING", "ACTIVE", "PAUSED", "ENDED"]).optional(),
  activeChannels: z.string().optional(),
  notes: z.string().optional(),
  websiteUrl: z.string().optional(),
});

export async function createClientAction(formData: FormData) {
  const parsed = clientSchema.parse({
    name: String(formData.get("name") ?? ""),
    companyName: String(formData.get("companyName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    niche: String(formData.get("niche") ?? ""),
    goals: String(formData.get("goals") ?? ""),
    monthlyTicket: String(formData.get("monthlyTicket") ?? ""),
    contractStatus: String(formData.get("contractStatus") ?? "PENDING"),
    activeChannels: String(formData.get("activeChannels") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    websiteUrl: String(formData.get("websiteUrl") ?? ""),
  });

  const client = await createClient({
    ...parsed,
    monthlyTicket: parsed.monthlyTicket ? Number(parsed.monthlyTicket) : undefined,
    activeChannels: parsed.activeChannels
      ? parsed.activeChannels.split(",").map((item) => item.trim()).filter(Boolean)
      : [],
  });

  await recordActivity({
    action: "client.created",
    entityType: "Client",
    entityId: client.id,
    description: "Novo cliente cadastrado no painel.",
    clientId: client.id,
  });

  revalidatePath("/admin/clients");
  revalidatePath("/admin");
  redirect("/admin/clients?success=created");
}

export async function updateClientAction(id: string, formData: FormData) {
  const parsed = clientSchema.parse({
    name: String(formData.get("name") ?? ""),
    companyName: String(formData.get("companyName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    niche: String(formData.get("niche") ?? ""),
    goals: String(formData.get("goals") ?? ""),
    monthlyTicket: String(formData.get("monthlyTicket") ?? ""),
    contractStatus: String(formData.get("contractStatus") ?? "PENDING"),
    activeChannels: String(formData.get("activeChannels") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    websiteUrl: String(formData.get("websiteUrl") ?? ""),
  });

  await updateClient(id, {
    ...parsed,
    monthlyTicket: parsed.monthlyTicket ? Number(parsed.monthlyTicket) : undefined,
    activeChannels: parsed.activeChannels
      ? parsed.activeChannels.split(",").map((item) => item.trim()).filter(Boolean)
      : [],
  });

  await recordActivity({
    action: "client.updated",
    entityType: "Client",
    entityId: id,
    description: "Cadastro do cliente atualizado.",
    clientId: id,
  });

  revalidatePath("/admin/clients");
  redirect("/admin/clients");
}

export async function deleteClientAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await deleteClient(id);

  await recordActivity({
    action: "client.deleted",
    entityType: "Client",
    entityId: id,
    description: "Cliente removido da base.",
    clientId: id,
  });

  revalidatePath("/admin/clients");
  revalidatePath("/admin");
  redirect("/admin/clients?success=deleted");
}

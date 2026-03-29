"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { executeAIWorkflow } from "@/modules/ai/service";

const aiSchema = z.object({
  idea: z.string().min(8, "Descreva melhor a solicitacao."),
  tone: z.string().min(2, "Escolha o tom."),
  objective: z.string().min(3, "Defina o objetivo."),
  responseSize: z.string().min(3, "Defina o tamanho."),
  mode: z.enum(["TEXT_ONLY", "SAVE_DRAFT", "AUTO_SEND", "GENERATE_PROPOSAL", "CREATE_TASK", "INTERNAL_SUMMARY"]),
  channel: z.enum(["EMAIL", "WHATSAPP", "INTERNAL", "SMS"]),
  clientId: z.string().optional(),
  leadId: z.string().optional(),
  redirectTo: z.string().optional(),
});

export async function runAIAction(formData: FormData) {
  const parsed = aiSchema.parse({
    idea: String(formData.get("idea") ?? ""),
    tone: String(formData.get("tone") ?? "consultivo"),
    objective: String(formData.get("objective") ?? "Gerar mensagem profissional"),
    responseSize: String(formData.get("responseSize") ?? "medio"),
    mode: String(formData.get("mode") ?? "TEXT_ONLY"),
    channel: String(formData.get("channel") ?? "EMAIL"),
    clientId: String(formData.get("clientId") ?? ""),
    leadId: String(formData.get("leadId") ?? ""),
    redirectTo: String(formData.get("redirectTo") ?? ""),
  });

  await executeAIWorkflow({
    ...parsed,
    clientId: parsed.clientId || undefined,
    leadId: parsed.leadId || undefined,
  });

  revalidatePath("/admin/ai");
  revalidatePath("/admin/messages");
  revalidatePath("/admin/proposals");
  revalidatePath("/admin/tasks");
  revalidatePath("/admin/logs");
  revalidatePath("/admin");
  if (parsed.clientId) {
    revalidatePath(`/admin/clients/${parsed.clientId}`);
  }
  if (parsed.leadId) {
    revalidatePath(`/admin/leads/${parsed.leadId}`);
  }

  const targetPath =
    parsed.redirectTo ||
    `/admin/ai?success=generated${parsed.clientId ? `&clientId=${parsed.clientId}` : ""}${parsed.leadId ? `&leadId=${parsed.leadId}` : ""}`;

  redirect(targetPath);
}

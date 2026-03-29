"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminUser } from "@/modules/auth/guards";
import { createFinancialEntry, updateFinancialEntryStatus } from "@/modules/finance/repository";
import { recordActivity } from "@/modules/shared/activity-log";

const financeSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  type: z.enum(["CONTRACT", "INVOICE", "PAYMENT", "ADJUSTMENT"]),
  status: z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED"]).optional(),
  amount: z.string().min(1),
  dueDate: z.string().optional(),
  paidAt: z.string().optional(),
  reference: z.string().optional(),
  clientId: z.string().min(1),
});

export async function createFinancialEntryAction(formData: FormData) {
  await requireAdminUser();
  const parsed = financeSchema.parse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    type: String(formData.get("type") ?? "INVOICE"),
    status: String(formData.get("status") ?? "PENDING"),
    amount: String(formData.get("amount") ?? ""),
    dueDate: String(formData.get("dueDate") ?? ""),
    paidAt: String(formData.get("paidAt") ?? ""),
    reference: String(formData.get("reference") ?? ""),
    clientId: String(formData.get("clientId") ?? ""),
  });

  const entry = await createFinancialEntry({
    ...parsed,
    amount: Number(parsed.amount),
    dueDate: parsed.dueDate || undefined,
    paidAt: parsed.paidAt || undefined,
  });

  await recordActivity({
    action: "finance.entry.created",
    entityType: "FinancialEntry",
    entityId: entry.id,
    description: "Novo lancamento financeiro registrado.",
    clientId: entry.clientId,
  });

  revalidatePath("/admin/finance");
  revalidatePath("/admin");
  revalidatePath("/admin/reports");
  redirect("/admin/finance?success=created");
}

const financialStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED"]),
});

export async function updateFinancialEntryStatusAction(formData: FormData) {
  await requireAdminUser();
  const parsed = financialStatusSchema.parse({
    id: String(formData.get("id") ?? ""),
    status: String(formData.get("status") ?? "PENDING"),
  });

  const entry = await updateFinancialEntryStatus(parsed.id, parsed.status);

  await recordActivity({
    action: "finance.entry.status.updated",
    entityType: "FinancialEntry",
    entityId: parsed.id,
    description: `Lancamento financeiro atualizado para ${parsed.status}.`,
    clientId: entry?.clientId,
  });

  revalidatePath("/admin/finance");
  revalidatePath("/admin/reports");
  redirect("/admin/finance?success=updated");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminUser } from "@/modules/auth/guards";
import { recordActivity } from "@/modules/shared/activity-log";

import { createUser, resetUserPassword, updateUserRole } from "./repository";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["ADMIN", "ACCOUNT_MANAGER", "CLIENT"]),
  password: z.string().min(6),
});

const updateRoleSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["ADMIN", "ACCOUNT_MANAGER", "CLIENT"]),
});

const resetPasswordSchema = z.object({
  id: z.string().min(1),
  password: z.string().min(6),
});

export async function createUserAction(formData: FormData) {
  await requireAdminUser();
  const parsed = createUserSchema.parse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    role: String(formData.get("role") ?? "ACCOUNT_MANAGER"),
    password: String(formData.get("password") ?? ""),
  });

  const user = await createUser(parsed);

  await recordActivity({
    action: "user.created",
    entityType: "User",
    entityId: user.id,
    description: `Novo usuario criado para o time: ${user.email}.`,
    metadata: { role: user.role },
  });

  revalidatePath("/admin/team");
  redirect("/admin/team?success=created");
}

export async function updateUserRoleAction(formData: FormData) {
  await requireAdminUser();
  const parsed = updateRoleSchema.parse({
    id: String(formData.get("id") ?? ""),
    role: String(formData.get("role") ?? "ACCOUNT_MANAGER"),
  });

  const user = await updateUserRole(parsed.id, parsed.role);

  await recordActivity({
    action: "user.role.updated",
    entityType: "User",
    entityId: parsed.id,
    description: `Perfil de acesso atualizado para ${parsed.role}.`,
    metadata: { role: parsed.role, email: user?.email },
  });

  revalidatePath("/admin/team");
  redirect("/admin/team?success=updated");
}

export async function resetUserPasswordAction(formData: FormData) {
  await requireAdminUser();
  const parsed = resetPasswordSchema.parse({
    id: String(formData.get("id") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  await resetUserPassword(parsed.id, parsed.password);

  await recordActivity({
    action: "user.password.reset",
    entityType: "User",
    entityId: parsed.id,
    description: "Senha do usuario redefinida no painel.",
  });

  revalidatePath("/admin/team");
  redirect("/admin/team?success=password");
}

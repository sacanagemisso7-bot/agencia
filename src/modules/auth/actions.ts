"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { clearSessionCookie, createSessionCookie } from "@/lib/auth";
import { demoAdminUser } from "@/lib/demo-data";
import { env } from "@/lib/env";
import { prisma, withFallback } from "@/lib/prisma";

type LoginState = {
  error?: string;
};

const loginSchema = z.object({
  email: z.string().email("Informe um email valido."),
  password: z.string().min(6, "Informe a senha."),
});

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Falha ao autenticar.",
    };
  }

  const { email, password } = parsed.data;
  const db = prisma;

  const user = db
    ? await withFallback(
        () =>
          db.user.findUnique({
            where: { email },
          }),
        () => null,
      )
    : null;

  if (user) {
    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return {
        error: "Credenciais invalidas.",
      };
    }

    await createSessionCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    revalidatePath("/admin");
    redirect("/admin");
  }

  if (email === env.adminEmail && password === env.adminPassword) {
    await createSessionCookie(demoAdminUser);
    revalidatePath("/admin");
    redirect("/admin");
  }

  return {
    error: "Credenciais invalidas.",
  };
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}

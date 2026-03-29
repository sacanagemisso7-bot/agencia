import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
import { hasRequiredRole } from "@/lib/rbac";
import type { UserSession } from "@/lib/types";

export async function requireSession() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireBackofficeUser() {
  const user = await requireSession();

  if (user.role === "CLIENT") {
    redirect("/portal");
  }

  return user;
}

export async function requireClientPortalUser() {
  const user = await requireSession();
  if (user.role !== "CLIENT") {
    redirect("/admin");
  }
  return user;
}

export async function requireRoles(allowedRoles: UserSession["role"][]) {
  const user = await requireSession();

  if (!hasRequiredRole(user.role, allowedRoles)) {
    redirect(user.role === "CLIENT" ? "/portal" : "/admin");
  }

  return user;
}

export async function requireAdminUser() {
  return requireRoles(["ADMIN"]);
}

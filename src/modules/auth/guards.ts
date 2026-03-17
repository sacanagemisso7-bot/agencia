import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";

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
  return user;
}

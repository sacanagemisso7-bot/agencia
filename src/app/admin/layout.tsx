import type { ReactNode } from "react";

import { requireBackofficeUser } from "@/modules/auth/guards";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireBackofficeUser();
  return children;
}

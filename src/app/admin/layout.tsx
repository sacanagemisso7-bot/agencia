import type { ReactNode } from "react";
import type { Metadata } from "next";

import { buildNoIndexMetadata } from "@/lib/seo";
import { requireBackofficeUser } from "@/modules/auth/guards";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildNoIndexMetadata(
  "Admin | Ameni",
  "Área administrativa da operação da agência.",
);

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireBackofficeUser();
  return children;
}


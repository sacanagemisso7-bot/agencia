import type { ReactNode } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { logoutAction } from "@/modules/auth/actions";

export function ClientShell({
  children,
  title,
  description,
  clientName,
}: {
  children: ReactNode;
  title: string;
  description: string;
  clientName: string;
}) {
  return (
    <div className="min-h-screen bg-sand-50">
      <header className="border-b border-ink-950/8 bg-white/80 backdrop-blur">
        <div className="container-shell flex items-center justify-between py-5">
          <div>
            <Link className="font-display text-2xl text-ink-950" href="/portal">
              Portal do Cliente
            </Link>
            <p className="mt-1 text-sm text-ink-950/62">Ameni</p>
          </div>
          <form action={logoutAction}>
            <SubmitButton size="sm" variant="secondary">
              Sair
            </SubmitButton>
          </form>
        </div>
      </header>
      <main className="container-shell py-10">
        <Card className="mb-6 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Área do cliente</p>
              <h1 className="mt-2 font-display text-4xl text-ink-950">{title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-950/65">{description}</p>
            </div>
            <Badge tone="success">{clientName}</Badge>
          </div>
        </Card>
        {children}
      </main>
    </div>
  );
}

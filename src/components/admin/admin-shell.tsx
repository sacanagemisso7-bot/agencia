import type { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, BriefcaseBusiness, FileText, KanbanSquare, Bot, Mail, Megaphone, Settings2, Users, ClipboardList, WalletCards, ChartColumnIncreasing } from "lucide-react";

import { adminNavigation } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { requireSession } from "@/modules/auth/guards";
import { logoutAction } from "@/modules/auth/actions";

import { SubmitButton } from "@/components/ui/submit-button";

const iconMap: Record<string, ReactNode> = {
  Dashboard: <LayoutDashboard className="size-4" />,
  Relatorios: <ChartColumnIncreasing className="size-4" />,
  Leads: <Users className="size-4" />,
  Clientes: <BriefcaseBusiness className="size-4" />,
  Propostas: <FileText className="size-4" />,
  Tarefas: <ClipboardList className="size-4" />,
  Campanhas: <Megaphone className="size-4" />,
  Financeiro: <WalletCards className="size-4" />,
  Mensagens: <Mail className="size-4" />,
  "Central IA": <Bot className="size-4" />,
  CMS: <Settings2 className="size-4" />,
  Logs: <KanbanSquare className="size-4" />,
};

export function AdminShell({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description: string;
}) {
  const userPromise = requireSession();

  return (
    <div className="min-h-screen bg-[#eef1eb]">
      <div className="container-shell grid gap-6 py-6 lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="glass-panel flex h-fit flex-col gap-8 p-6">
          <div>
            <p className="font-display text-2xl text-ink-950">Atlas OS</p>
            <p className="mt-2 text-sm text-ink-950/60">CRM, operacao e IA comercial.</p>
          </div>
          {/* Awaiting here keeps the shell as the single gate for admin routes. */}
          <AdminUserMeta userPromise={userPromise} />
          <nav className="space-y-2">
            {adminNavigation.map((item) => (
              <Link
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-ink-950/75 transition hover:bg-ink-950/5 hover:text-ink-950"
                href={item.href}
                key={item.href}
              >
                {iconMap[item.label]}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <form action={logoutAction}>
            <SubmitButton className="w-full" variant="secondary">
              Sair
            </SubmitButton>
          </form>
        </aside>
        <main className="space-y-6">
          <header className="glass-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">Backoffice</p>
            <h1 className="mt-3 font-display text-4xl text-ink-950">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-950/65">{description}</p>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}

async function AdminUserMeta({
  userPromise,
}: {
  userPromise: ReturnType<typeof requireSession>;
}) {
  const user = await userPromise;

  return (
    <div className="rounded-[24px] bg-ink-950 p-4 text-white">
      <p className="font-medium">{user.name}</p>
      <p className="mt-1 text-sm text-white/70">{user.email}</p>
      <Badge className="mt-3 w-fit bg-white/12 text-white" tone="neutral">
        {user.role}
      </Badge>
    </div>
  );
}

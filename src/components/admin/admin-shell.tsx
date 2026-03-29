import type { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, BriefcaseBusiness, FileText, KanbanSquare, Bot, Mail, Megaphone, Settings2, Users, ClipboardList, WalletCards, ChartColumnIncreasing, BellRing, SlidersHorizontal, Columns3, ShieldCheck, CalendarDays, Blocks } from "lucide-react";

import { getAdminNavigation } from "@/lib/navigation";
import { getBrandCompanyName } from "@/lib/brand";
import { Badge } from "@/components/ui/badge";
import { requireSession } from "@/modules/auth/guards";
import { logoutAction } from "@/modules/auth/actions";

import { SubmitButton } from "@/components/ui/submit-button";

const iconMap: Record<string, ReactNode> = {
  Dashboard: <LayoutDashboard className="size-4" />,
  "Work OS": <Blocks className="size-4" />,
  "Notificações": <BellRing className="size-4" />,
  "Automações": <SlidersHorizontal className="size-4" />,
  "Relatórios": <ChartColumnIncreasing className="size-4" />,
  Pipeline: <Columns3 className="size-4" />,
  Agenda: <CalendarDays className="size-4" />,
  Leads: <Users className="size-4" />,
  Clientes: <BriefcaseBusiness className="size-4" />,
  Propostas: <FileText className="size-4" />,
  Tarefas: <ClipboardList className="size-4" />,
  Campanhas: <Megaphone className="size-4" />,
  Financeiro: <WalletCards className="size-4" />,
  Mensagens: <Mail className="size-4" />,
  "Central IA": <Bot className="size-4" />,
  Time: <ShieldCheck className="size-4" />,
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
  const brandCompanyName = getBrandCompanyName();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(48,178,124,0.10),_transparent_0_24%),linear-gradient(180deg,#eef2ec,#e7ede6)]">
      <div className="container-shell grid gap-6 py-6 lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="relative sticky top-6 flex h-fit flex-col gap-8 overflow-hidden rounded-[32px] border border-white/10 bg-[#08101a] p-6 text-white shadow-[0_30px_80px_rgba(9,17,31,0.24)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />
          <div className="pointer-events-none absolute right-[-3rem] top-[-3rem] size-32 rounded-full bg-emerald-300/12 blur-[60px]" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/34">Backoffice da marca</p>
            <p className="mt-4 font-display text-3xl tracking-[-0.04em] text-white">{brandCompanyName}</p>
            <p className="mt-3 text-sm leading-7 text-white/60">CRM, automações, comercial, IA e operação da agência em uma visão única.</p>
          </div>
          {/* Awaiting here keeps the shell as the single gate for admin routes. */}
          <AdminUserMeta userPromise={userPromise} />
          <AdminNavigationMenu userPromise={userPromise} />
          <form action={logoutAction}>
            <SubmitButton className="w-full border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]" variant="secondary">
              Sair
            </SubmitButton>
          </form>
        </aside>
        <main className="space-y-6">
          <header className="glass-panel p-6 sm:p-8">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/45 to-transparent" />
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-600">Backoffice premium</p>
                <h1 className="mt-3 font-display text-[2.5rem] leading-none tracking-[-0.05em] text-ink-950 sm:text-[3.1rem]">{title}</h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-950/65">{description}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Pipeline", value: "Live" },
                  { label: "Automações", value: "Ready" },
                  { label: "IA", value: "Assistida" },
                ].map((item) => (
                  <div className="rounded-[22px] border border-ink-950/8 bg-white/72 px-4 py-4" key={item.label}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-950/42">{item.label}</p>
                    <p className="mt-2 font-display text-2xl tracking-[-0.04em] text-ink-950">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}

async function AdminNavigationMenu({
  userPromise,
}: {
  userPromise: ReturnType<typeof requireSession>;
}) {
  const user = await userPromise;
  const navigation = getAdminNavigation(user.role);

  return (
    <nav className="space-y-2">
      {navigation.map((item) => (
        <Link
          className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-white/68 transition hover:bg-white/[0.06] hover:text-white"
          href={item.href}
          key={item.href}
        >
          {iconMap[item.label]}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

async function AdminUserMeta({
  userPromise,
}: {
  userPromise: ReturnType<typeof requireSession>;
}) {
  const user = await userPromise;

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4 text-white">
      <p className="font-medium">{user.name}</p>
      <p className="mt-1 text-sm text-white/70">{user.email}</p>
      <Badge className="mt-3 w-fit bg-white/12 text-white" tone="neutral">
        {user.role}
      </Badge>
    </div>
  );
}

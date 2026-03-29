import Link from "next/link";

import { ActivityFeed } from "@/components/admin/activity-feed";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageSection } from "@/components/admin/page-section";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageToast } from "@/components/ui/page-toast";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { getAutomationSettings } from "@/modules/automation-config/repository";
import { getDashboardSummary } from "@/modules/dashboard/service";
import { rankLeadsByIntent } from "@/modules/leads/intent";
import { listLeads } from "@/modules/leads/repository";
import { listActivityLogs } from "@/modules/logs/repository";
import { listMessages } from "@/modules/messages/repository";
import { getNotificationsSummary } from "@/modules/notifications/service";

function getTopDimensionLabel(items: string[]) {
  const counters = new Map<string, number>();

  for (const item of items) {
    const label = item.trim() || "Não identificado";
    counters.set(label, (counters.get(label) ?? 0) + 1);
  }

  return Array.from(counters.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Sem dados";
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const query = await searchParams;
  const [summary, automationSettings, leads, messages, logs, notifications] = await Promise.all([
    getDashboardSummary(),
    getAutomationSettings(),
    listLeads(),
    listMessages(),
    listActivityLogs(),
    getNotificationsSummary(),
  ]);

  const rankedLeads = rankLeadsByIntent(leads, automationSettings);
  const allHighIntentLeads = rankedLeads.filter((item) => item.assessment.isHighIntent);
  const highIntentLeads = allHighIntentLeads.slice(0, 4);
  const meetingQueueCount = leads.filter(
    (lead) =>
      ["Reunião estratégica", "Reuniao estrategica"].includes(lead.contactPreference ?? "") &&
      lead.status !== "MEETING_SCHEDULED",
  ).length;
  const topUtmSource = getTopDimensionLabel(leads.map((lead) => lead.utmSource ?? ""));
  const topCampaign = getTopDimensionLabel(leads.map((lead) => lead.utmCampaign ?? ""));

  return (
    <AdminShell
      title="Dashboard executiva"
      description="Panorama do funil comercial, da operação e das automações assistidas por IA."
    >
      <PageToast message={query?.error === "forbidden" ? "Seu papel atual não tem acesso a esse módulo." : undefined} type={query?.error === "forbidden" ? "error" : "success"} />
      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="bg-[radial-gradient(circle_at_top,_rgba(48,178,124,0.12),_transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(243,247,242,0.92))] p-6 sm:p-7">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/45 to-transparent" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600">Operação de hoje</p>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h2 className="font-display text-[2.4rem] leading-[0.95] tracking-[-0.05em] text-ink-950">
                Leads, agenda, pipeline e receita sob a mesma leitura executiva.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-950/62">
                O backoffice agora consolida aquisição, atendimento, follow-up, automações e leitura de performance em uma visão única.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-ink-950/8 bg-white/72 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-950/42">Leads quentes</p>
                <p className="mt-2 font-display text-3xl tracking-[-0.05em] text-ink-950">{allHighIntentLeads.length}</p>
                <p className="mt-2 text-sm text-ink-950/58">Precisando de ação rápida do time.</p>
              </div>
              <div className="rounded-[22px] border border-ink-950/8 bg-white/72 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-950/42">Fila de agenda</p>
                <p className="mt-2 font-display text-3xl tracking-[-0.05em] text-ink-950">{meetingQueueCount}</p>
                <p className="mt-2 text-sm text-ink-950/58">Leads pedindo reunião estratégica.</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <StatCard helper="Entradas registradas" label="Leads" value={String(summary.totalLeads)} />
          <StatCard helper="Contratos em andamento" label="Clientes ativos" value={String(summary.activeClients)} />
          <StatCard helper="Taxa atual do funil" label="Conversão" value={formatPercent(summary.conversionRate)} />
          <StatCard helper="Receita mensal estimada" label="Receita" value={formatCurrency(summary.estimatedRevenue)} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <PageSection
            title="Alertas comerciais"
            description="Leads com maior composição de sinais para abordagem rápida do time."
          >
            <Card className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">High-intent</p>
                  <h2 className="mt-2 font-display text-2xl text-ink-950">
                    {allHighIntentLeads.length} leads quentes pedindo resposta rápida
                  </h2>
                </div>
                <div className="grid gap-2 text-sm text-ink-950/62">
                  <p>UTM source dominante: {topUtmSource}</p>
                  <p>Campanha dominante: {topCampaign}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {highIntentLeads.length ? (
                  highIntentLeads.map(({ lead, assessment }) => (
                    <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={lead.id}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-ink-950">{lead.name}</p>
                          <p className="mt-1 text-sm text-ink-950/62">
                            {lead.company ?? "Empresa não informada"} | {lead.serviceInterest ?? "Sem serviço definido"}
                          </p>
                        </div>
                        <Badge tone="warning">Score {assessment.score}</Badge>
                      </div>
                      <p className="mt-3 text-sm text-ink-950/66">{assessment.reasons.slice(0, 2).join(" | ")}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[22px] bg-white p-4 text-sm text-ink-950/62 ring-1 ring-ink-950/6">
                    Nenhum lead com score alto no momento. O sistema continua monitorando novas entradas automaticamente.
                  </div>
                )}
              </div>
            </Card>
          </PageSection>

          <PageSection
            title="Pontos de atenção"
            description="Leads recentes e cadência comercial para agir rápido."
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Leads recentes</p>
                  <h2 className="mt-2 font-display text-2xl text-ink-950">Entradas do CRM</h2>
                </div>
                <Link href="/admin/leads">
                  <Button size="sm" variant="secondary">
                    Abrir CRM
                  </Button>
                </Link>
              </div>
              <div className="mt-6 space-y-4">
                {leads.slice(0, 4).map((lead) => (
                  <div className="flex items-start justify-between gap-4 border-b border-ink-950/6 pb-4" key={lead.id}>
                    <div>
                      <p className="font-medium text-ink-950">{lead.name}</p>
                      <p className="mt-1 text-sm text-ink-950/62">
                        {lead.company ?? "Empresa não informada"} | {lead.source}
                      </p>
                    </div>
                    <Badge tone={lead.status === "WON" ? "success" : lead.status === "LOST" ? "warning" : "neutral"}>
                      {lead.status.replaceAll("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </PageSection>

          <PageSection
            title="Mensagens"
            description="Últimos envios e rascunhos acompanhados pela central de mensagens."
          >
            <Card className="p-6">
              <div className="grid gap-4">
                {messages.slice(0, 4).map((message) => (
                  <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={message.id}>
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium text-ink-950">{message.subject ?? "Mensagem sem assunto"}</p>
                      <Badge tone={message.status === "SENT" ? "success" : message.status === "FAILED" ? "warning" : "neutral"}>
                        {message.status}
                      </Badge>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-ink-950/65">{message.body}</p>
                  </div>
                ))}
              </div>
            </Card>
          </PageSection>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Aquisição</p>
            <h2 className="mt-2 font-display text-2xl text-ink-950">Leitura rápida das últimas entradas</h2>
            <div className="mt-6 grid gap-4 text-sm text-ink-950/72">
              <div className="rounded-[20px] bg-white p-4 ring-1 ring-ink-950/6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-950/42">Origem dominante</p>
                <p className="mt-2 font-medium text-ink-950">{topUtmSource}</p>
              </div>
              <div className="rounded-[20px] bg-white p-4 ring-1 ring-ink-950/6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-950/42">Campanha mais recorrente</p>
                <p className="mt-2 font-medium text-ink-950">{topCampaign}</p>
              </div>
              <div className="rounded-[20px] bg-white p-4 ring-1 ring-ink-950/6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-950/42">Leads high-intent</p>
                <p className="mt-2 font-medium text-ink-950">{allHighIntentLeads.length} em destaque agora</p>
              </div>
              <div className="rounded-[20px] bg-white p-4 ring-1 ring-ink-950/6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-950/42">Fila de agenda</p>
                <p className="mt-2 font-medium text-ink-950">{meetingQueueCount} leads pedindo reunião</p>
              </div>
            </div>
            <div className="mt-5">
              <Link href="/admin/scheduling">
                <Button size="sm" variant="secondary">
                  Abrir agenda comercial
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Inbox</p>
            <h2 className="mt-2 font-display text-2xl text-ink-950">Notificações operacionais</h2>
            <div className="mt-6 grid gap-4 text-sm text-ink-950/72">
              <div className="rounded-[20px] bg-white p-4 ring-1 ring-ink-950/6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-950/42">Total</p>
                <p className="mt-2 font-medium text-ink-950">{notifications.total}</p>
              </div>
              <div className="rounded-[20px] bg-white p-4 ring-1 ring-ink-950/6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-950/42">Críticos</p>
                <p className="mt-2 font-medium text-ink-950">{notifications.critical}</p>
              </div>
              <div className="rounded-[20px] bg-white p-4 ring-1 ring-ink-950/6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-950/42">Atenção</p>
                <p className="mt-2 font-medium text-ink-950">{notifications.warning}</p>
              </div>
            </div>
            <div className="mt-5">
              <Link href="/admin/notifications">
                <Button size="sm" variant="secondary">
                  Abrir inbox
                </Button>
              </Link>
            </div>
          </Card>

          <ActivityFeed items={logs.slice(0, 8)} />
        </div>
      </section>
    </AdminShell>
  );
}

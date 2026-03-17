import Link from "next/link";

import { ActivityFeed } from "@/components/admin/activity-feed";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageSection } from "@/components/admin/page-section";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { getDashboardSummary } from "@/modules/dashboard/service";
import { listLeads } from "@/modules/leads/repository";
import { listActivityLogs } from "@/modules/logs/repository";
import { listMessages } from "@/modules/messages/repository";

export default async function AdminDashboardPage() {
  const [summary, leads, messages, logs] = await Promise.all([
    getDashboardSummary(),
    listLeads(),
    listMessages(),
    listActivityLogs(),
  ]);

  return (
    <AdminShell
      title="Dashboard executiva"
      description="Panorama do funil comercial, da operacao e das automacoes assistidas por IA."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard helper="Entradas registradas" label="Leads" value={String(summary.totalLeads)} />
        <StatCard helper="Contratos em andamento" label="Clientes ativos" value={String(summary.activeClients)} />
        <StatCard helper="Taxa atual do funil" label="Conversao" value={formatPercent(summary.conversionRate)} />
        <StatCard helper="Receita mensal estimada" label="Receita" value={formatCurrency(summary.estimatedRevenue)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <PageSection
            title="Pontos de atencao"
            description="Leads recentes e cadencia comercial para agir rapido."
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
                        {lead.company ?? "Empresa nao informada"} • {lead.source}
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
            description="Ultimos envios e rascunhos acompanhados pela central de mensagens."
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
        <ActivityFeed items={logs.slice(0, 8)} />
      </section>
    </AdminShell>
  );
}


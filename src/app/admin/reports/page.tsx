import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { getReportsSnapshot } from "@/modules/reports/service";

function getMaxValue(items: Array<{ total: number }>) {
  return Math.max(...items.map((item) => item.total), 1);
}

export default async function ReportsPage() {
  const report = await getReportsSnapshot();
  const maxLeadSource = getMaxValue(report.leadsBySource);
  const maxChannelMix = getMaxValue(report.channelMix);
  const maxMonthlyFinance = getMaxValue(report.monthlyFinance);
  const maxUtmSource = getMaxValue(report.utmSources);
  const maxUtmMedium = getMaxValue(report.utmMediums);
  const maxUtmCampaign = getMaxValue(report.utmCampaigns);
  const maxLandingPages = getMaxValue(report.landingPages);

  return (
    <AdminShell
      title="Relatórios"
      description="Leitura executiva do negócio com foco em receita, conversão, operação e aquisição."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <ReportStat label="Receita paga" value={formatCurrency(report.headline.paidRevenue)} />
        <ReportStat label="Receita pendente" value={formatCurrency(report.headline.pendingRevenue)} />
        <ReportStat label="Aceite de propostas" value={formatPercent(report.headline.proposalAcceptanceRate)} />
        <ReportStat label="Conversão de leads" value={formatPercent(report.headline.leadConversionRate)} />
        <ReportStat label="Leads rastreados" value={formatPercent(report.headline.trackedLeadRate)} />
        <ReportStat label="Leads high-intent" value={formatPercent(report.headline.highIntentLeadRate)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Saúde operacional</h2>
          <div className="mt-5 space-y-4 text-sm text-ink-950/72">
            <p>Clientes ativos acompanhados: {report.headline.totalClients}</p>
            <p>Campanhas ativas/otimizando: {report.headline.activeCampaigns}</p>
            <p>Mensagens na fila: {report.headline.queuedMessages}</p>
            <p>Mensagens enviadas: {report.headline.sentMessages}</p>
            <p>Lancamentos em atraso: {report.headline.overdueEntries}</p>
            <p>Leads high-intent na base: {report.headline.highIntentLeads}</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Resumo de aquisição</h2>
          <div className="mt-5 grid gap-4">
            <MetricRow label="Origem dominante" value={report.acquisitionHighlights.topSource} />
            <MetricRow label="UTM source mais frequente" value={report.acquisitionHighlights.topUtmSource} />
            <MetricRow label="Campanha mais recorrente" value={report.acquisitionHighlights.topCampaign} />
            <MetricRow label="Landing principal" value={report.acquisitionHighlights.topLandingPage} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Leads high-intent</h2>
          <div className="mt-5 space-y-4">
            {report.recentHighIntentLeads.length ? (
              report.recentHighIntentLeads.map((lead) => (
                <div className="rounded-[20px] bg-white p-4 ring-1 ring-ink-950/6" key={lead.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-ink-950">{lead.name}</p>
                      <p className="mt-1 text-sm text-ink-950/62">
                        {lead.company ?? "Empresa não informada"} | {lead.serviceInterest ?? "Sem serviço"}
                      </p>
                    </div>
                    <Badge tone="warning">Score {lead.score}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-ink-950/66">{lead.reasons.slice(0, 2).join(" | ")}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] bg-white p-4 text-sm text-ink-950/62 ring-1 ring-ink-950/6">
                Ainda não há leads com score alto suficiente para destaque.
              </div>
            )}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Origem declarada dos leads</h2>
          <div className="mt-5 grid gap-4">
            {report.leadsBySource.map((item) => (
              <MetricBar
                key={item.source}
                label={item.source}
                value={String(item.total)}
                width={`${(item.total / maxLeadSource) * 100}%`}
              />
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">UTM source</h2>
          <div className="mt-5 grid gap-4">
            {report.utmSources.map((item) => (
              <MetricBar
                key={item.label}
                label={item.label}
                value={String(item.total)}
                width={`${(item.total / maxUtmSource) * 100}%`}
              />
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">UTM medium</h2>
          <div className="mt-5 grid gap-4">
            {report.utmMediums.map((item) => (
              <MetricBar
                key={item.label}
                label={item.label}
                value={String(item.total)}
                width={`${(item.total / maxUtmMedium) * 100}%`}
              />
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">UTM campaign</h2>
          <div className="mt-5 grid gap-4">
            {report.utmCampaigns.map((item) => (
              <MetricBar
                key={item.label}
                label={item.label}
                value={String(item.total)}
                width={`${(item.total / maxUtmCampaign) * 100}%`}
              />
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Landing pages de entrada</h2>
          <div className="mt-5 grid gap-4">
            {report.landingPages.map((item) => (
              <MetricBar
                key={item.label}
                label={item.label}
                value={String(item.total)}
                width={`${(item.total / maxLandingPages) * 100}%`}
              />
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Mix de canais de mensagem</h2>
          <div className="mt-5 space-y-4">
            {report.channelMix.map((item) => (
              <MetricBar
                key={item.channel}
                label={item.channel}
                value={String(item.total)}
                width={`${(item.total / maxChannelMix) * 100}%`}
              />
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Clientes com maior ticket</h2>
          <div className="mt-5 space-y-4">
            {report.topClientsByRevenue.map((item) => (
              <MetricRow key={item.clientName} label={item.clientName} value={formatCurrency(item.monthlyTicket)} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Financeiro por mes</h2>
          <div className="mt-5 grid gap-4">
            {report.monthlyFinance.map((item) => (
              <MetricBar
                key={item.month}
                label={item.month}
                value={formatCurrency(item.total)}
                width={`${(item.total / maxMonthlyFinance) * 100}%`}
              />
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Atribuicao ate receita por source</h2>
          <div className="mt-5 space-y-4">
            {report.revenueAttributionBySource.map((item) => (
              <AttributionRow
                acceptedProposals={item.acceptedProposals}
                convertedClients={item.convertedClients}
                key={item.label}
                label={item.label}
                leads={item.leads}
                paidRevenue={item.paidRevenue}
              />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Atribuicao ate receita por campanha</h2>
          <div className="mt-5 space-y-4">
            {report.revenueAttributionByCampaign.map((item) => (
              <AttributionRow
                acceptedProposals={item.acceptedProposals}
                convertedClients={item.convertedClients}
                key={item.label}
                label={item.label}
                leads={item.leads}
                paidRevenue={item.paidRevenue}
              />
            ))}
          </div>
        </Card>
      </section>
    </AdminShell>
  );
}

function ReportStat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950/45">{label}</p>
      <p className="mt-3 font-display text-3xl text-ink-950">{value}</p>
    </Card>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[20px] bg-white p-4 ring-1 ring-ink-950/6">
      <span className="text-sm text-ink-950/72">{label}</span>
      <span className="font-medium text-ink-950">{value}</span>
    </div>
  );
}

function MetricBar({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div className="rounded-[20px] bg-white p-4 ring-1 ring-ink-950/6">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-sm text-ink-950/72">{label}</span>
        <span className="font-medium text-ink-950">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-ink-950/8">
        <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400" style={{ width }} />
      </div>
    </div>
  );
}

function AttributionRow({
  label,
  leads,
  convertedClients,
  acceptedProposals,
  paidRevenue,
}: {
  label: string;
  leads: number;
  convertedClients: number;
  acceptedProposals: number;
  paidRevenue: number;
}) {
  return (
    <div className="rounded-[20px] bg-white p-4 ring-1 ring-ink-950/6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-medium text-ink-950">{label}</p>
        <p className="text-sm font-medium text-ink-950">{formatCurrency(paidRevenue)}</p>
      </div>
      <div className="mt-3 grid gap-2 text-sm text-ink-950/65 md:grid-cols-3">
        <span>Leads: {leads}</span>
        <span>Clientes: {convertedClients}</span>
        <span>Propostas aceitas: {acceptedProposals}</span>
      </div>
    </div>
  );
}

import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { getReportsSnapshot } from "@/modules/reports/service";

export default async function ReportsPage() {
  const report = await getReportsSnapshot();
  const maxLeadSource = Math.max(...report.leadsBySource.map((item) => item.total), 1);
  const maxChannelMix = Math.max(...report.channelMix.map((item) => item.total), 1);
  const maxMonthlyFinance = Math.max(...report.monthlyFinance.map((item) => item.total), 1);

  return (
    <AdminShell
      title="Relatorios"
      description="Leitura executiva do negocio com foco em receita, conversao, operacao e canais."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ReportStat label="Receita paga" value={formatCurrency(report.headline.paidRevenue)} />
        <ReportStat label="Receita pendente" value={formatCurrency(report.headline.pendingRevenue)} />
        <ReportStat label="Aceite de propostas" value={formatPercent(report.headline.proposalAcceptanceRate)} />
        <ReportStat label="Conversao de leads" value={formatPercent(report.headline.leadConversionRate)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Saude operacional</h2>
          <div className="mt-5 space-y-4 text-sm text-ink-950/72">
            <p>Clientes ativos acompanhados: {report.headline.totalClients}</p>
            <p>Campanhas ativas/otimizando: {report.headline.activeCampaigns}</p>
            <p>Mensagens na fila: {report.headline.queuedMessages}</p>
            <p>Mensagens enviadas: {report.headline.sentMessages}</p>
            <p>Lancamentos em atraso: {report.headline.overdueEntries}</p>
          </div>
        </Card>
        <Card className="p-6 xl:col-span-2">
          <h2 className="font-display text-2xl text-ink-950">Origem dos leads</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
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
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
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
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Clientes com maior ticket</h2>
          <div className="mt-5 space-y-4">
            {report.topClientsByRevenue.map((item) => (
              <MetricRow key={item.clientName} label={item.clientName} value={formatCurrency(item.monthlyTicket)} />
            ))}
          </div>
        </Card>
      </section>

      <section>
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Financeiro por mes</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
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
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-ink-950/72">{label}</span>
        <span className="font-medium text-ink-950">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-ink-950/8">
        <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400" style={{ width }} />
      </div>
    </div>
  );
}

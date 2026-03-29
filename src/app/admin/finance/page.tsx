import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageToast } from "@/components/ui/page-toast";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formatters";
import { financialStatusOptions, financialTypeOptions } from "@/lib/navigation";
import { requireAdminUser } from "@/modules/auth/guards";
import { listClients } from "@/modules/clients/repository";
import { createFinancialEntryAction, updateFinancialEntryStatusAction } from "@/modules/finance/actions";
import { getFinanceSnapshot } from "@/modules/finance/service";

function getFinanceToast(success?: string) {
  switch (success) {
    case "created":
      return "Lancamento financeiro criado com sucesso.";
    case "updated":
      return "Status financeiro atualizado.";
    default:
      return null;
  }
}

export default async function FinancePage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  await requireAdminUser();
  const [{ entries, headline, agingBuckets, monthlyProjection, clientsByExposure }, clients, query] = await Promise.all([
    getFinanceSnapshot(),
    listClients(),
    searchParams,
  ]);

  return (
    <AdminShell
      title="Financeiro"
      description="Recebiveis, previsao de caixa, inadimplencia e exposicao por cliente em uma leitura mais executiva."
    >
      <PageToast message={getFinanceToast(query?.success)} />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FinanceStat label="MRR ativo" value={formatCurrency(headline.activeMrr)} />
        <FinanceStat label="Recebido" value={formatCurrency(headline.totalPaid)} />
        <FinanceStat label="Em aberto" value={formatCurrency(headline.totalPending)} />
        <FinanceStat label="Inadimplencia" value={formatCurrency(headline.totalOverdue)} />
      </section>
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Novo lancamento</h2>
          <form action={createFinancialEntryAction} className="mt-6 grid gap-4">
            <Input name="title" placeholder="Titulo" required />
            <Textarea name="description" placeholder="Descricao" />
            <div className="grid gap-4 md:grid-cols-2">
              <Select defaultValue="INVOICE" name="type">
                {financialTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select defaultValue="PENDING" name="status">
                {financialStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <Input name="amount" placeholder="Valor" required type="number" />
            <div className="grid gap-4 md:grid-cols-2">
              <Input name="dueDate" type="date" />
              <Input name="paidAt" type="date" />
            </div>
            <Input name="reference" placeholder="Referencia / numero" />
            <Select defaultValue="" name="clientId">
              <option value="">Selecione o cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.companyName}
                </option>
              ))}
            </Select>
            <Button type="submit">Salvar lancamento</Button>
          </form>
        </Card>
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display text-2xl text-ink-950">Leitura executiva</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <MetricTile label="Previsao 30 dias" value={formatCurrency(headline.forecastNext30Days)} />
              <MetricTile label="Taxa de recebimento" value={formatPercent(headline.collectionRate)} />
              <MetricTile label="Titulos pendentes" value={String(headline.pendingCount)} />
              <MetricTile label="Titulos vencidos" value={String(headline.overdueCount)} />
            </div>
            <div className="mt-6 grid gap-3 text-sm text-ink-950/68">
              <p>Aging 0-7 dias: {formatCurrency(agingBuckets.upTo7)}</p>
              <p>Aging 8-30 dias: {formatCurrency(agingBuckets.eightTo30)}</p>
              <p>Aging 30+ dias: {formatCurrency(agingBuckets.above30)}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-2xl text-ink-950">Clientes com maior exposicao</h2>
            <div className="mt-5 space-y-4">
              {clientsByExposure.map((client) => (
                <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={client.clientId}>
                  <p className="font-medium text-ink-950">{client.clientName}</p>
                  <p className="mt-2 text-sm text-ink-950/65">
                    Pendente {formatCurrency(client.pending)} | Vencido {formatCurrency(client.overdue)} | Recebido {formatCurrency(client.paid)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Lancamento</TableHeaderCell>
                  <TableHeaderCell>Tipo</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Cliente</TableHeaderCell>
                  <TableHeaderCell>Valor</TableHeaderCell>
                  <TableHeaderCell>Vencimento</TableHeaderCell>
                  <TableHeaderCell className="text-right">Acoes</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <p className="font-medium text-ink-950">{entry.title}</p>
                      <p className="text-xs text-ink-950/55">{entry.reference ?? "-"}</p>
                    </TableCell>
                    <TableCell>{entry.type}</TableCell>
                    <TableCell>
                      <Badge tone={entry.status === "PAID" ? "success" : entry.status === "OVERDUE" ? "warning" : "neutral"}>
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.clientName}</TableCell>
                    <TableCell>{formatCurrency(entry.amount)}</TableCell>
                    <TableCell>{formatDate(entry.dueDate ?? entry.paidAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {entry.status !== "PAID" ? (
                          <form action={updateFinancialEntryStatusAction}>
                            <input name="id" type="hidden" value={entry.id} />
                            <input name="status" type="hidden" value="PAID" />
                            <Button size="sm" type="submit" variant="secondary">
                              Marcar pago
                            </Button>
                          </form>
                        ) : null}
                        {entry.status === "PENDING" ? (
                          <form action={updateFinancialEntryStatusAction}>
                            <input name="id" type="hidden" value={entry.id} />
                            <input name="status" type="hidden" value="CANCELLED" />
                            <Button size="sm" type="submit" variant="ghost">
                              Cancelar
                            </Button>
                          </form>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Projecao mensal</h2>
          <div className="mt-5 space-y-4">
            {monthlyProjection.map((item) => (
              <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={item.month}>
                <p className="font-medium text-ink-950">{item.month}</p>
                <p className="mt-2 text-sm text-ink-950/65">
                  Previsto {formatCurrency(item.forecast)} | Recebido {formatCurrency(item.paid)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AdminShell>
  );
}

function FinanceStat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950/45">{label}</p>
      <p className="mt-3 font-display text-3xl text-ink-950">{value}</p>
    </Card>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-white p-4 ring-1 ring-ink-950/6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-950/42">{label}</p>
      <p className="mt-2 font-display text-2xl text-ink-950">{value}</p>
    </div>
  );
}

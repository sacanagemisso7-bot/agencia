import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageToast } from "@/components/ui/page-toast";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { financialStatusOptions, financialTypeOptions } from "@/lib/navigation";
import { listClients } from "@/modules/clients/repository";
import { createFinancialEntryAction } from "@/modules/finance/actions";
import { listFinancialEntries } from "@/modules/finance/repository";

function getFinanceToast(success?: string) {
  switch (success) {
    case "created":
      return "Lancamento financeiro criado com sucesso.";
    default:
      return null;
  }
}

export default async function FinancePage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  const [entries, clients, query] = await Promise.all([listFinancialEntries(), listClients(), searchParams]);

  return (
    <AdminShell
      title="Financeiro"
      description="Controle basico de contratos, faturas, pagamentos e pendencias por cliente."
    >
      <PageToast message={getFinanceToast(query?.success)} />
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}


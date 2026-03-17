import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { PageSection } from "@/components/admin/page-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageToast } from "@/components/ui/page-toast";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { contractStatusOptions } from "@/lib/navigation";
import { createClientAction, deleteClientAction } from "@/modules/clients/actions";
import { listClients } from "@/modules/clients/repository";

function getClientToast(success?: string) {
  switch (success) {
    case "created":
      return "Cliente criado com sucesso.";
    case "deleted":
      return "Cliente removido.";
    default:
      return null;
  }
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  const clients = await listClients();
  const query = await searchParams;

  return (
    <AdminShell title="Clientes" description="Cadastro completo de contas ativas, objetivos, ticket e canais em operacao.">
      <PageToast message={getClientToast(query?.success)} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Novo cliente</p>
          <h2 className="mt-2 font-display text-2xl text-ink-950">Adicionar contrato</h2>
          <form action={createClientAction} className="mt-6 grid gap-4">
            <Input name="name" placeholder="Responsavel" required />
            <Input name="companyName" placeholder="Empresa" required />
            <Input name="email" placeholder="Email" required type="email" />
            <Input name="phone" placeholder="Telefone" />
            <Input name="niche" placeholder="Nicho" />
            <Input name="monthlyTicket" placeholder="Ticket mensal" type="number" />
            <Input name="activeChannels" placeholder="Canais ativos separados por virgula" />
            <Select defaultValue="PENDING" name="contractStatus">
              {contractStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Textarea name="goals" placeholder="Objetivos do cliente" />
            <Textarea name="notes" placeholder="Observacoes operacionais" />
            <Button type="submit">Salvar cliente</Button>
          </form>
        </Card>

        <PageSection title="Base ativa" description="Clientes com contexto comercial e operacional centralizados.">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Cliente</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Ticket</TableHeaderCell>
                    <TableHeaderCell>Canais</TableHeaderCell>
                    <TableHeaderCell className="text-right">Acoes</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <p className="font-medium text-ink-950">{client.companyName}</p>
                        <p className="text-xs text-ink-950/55">{client.email}</p>
                      </TableCell>
                      <TableCell>
                        <Badge tone={client.contractStatus === "ACTIVE" ? "success" : "neutral"}>
                          {client.contractStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(client.monthlyTicket)}</TableCell>
                      <TableCell>{client.activeChannels.join(", ") || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/clients/${client.id}`}>
                            <Button size="sm" variant="secondary">
                              Editar
                            </Button>
                          </Link>
                          <form action={deleteClientAction}>
                            <input name="id" type="hidden" value={client.id} />
                            <Button size="sm" type="submit" variant="ghost">
                              Excluir
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </PageSection>
      </div>
    </AdminShell>
  );
}

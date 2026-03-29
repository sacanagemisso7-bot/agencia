import Link from "next/link";

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
import { proposalStatusOptions } from "@/lib/navigation";
import { listClients } from "@/modules/clients/repository";
import { listLeads } from "@/modules/leads/repository";
import { createProposalAction, deleteProposalAction, sendProposalForApprovalAction } from "@/modules/proposals/actions";
import { listProposals } from "@/modules/proposals/repository";

function getProposalToast(success?: string) {
  switch (success) {
    case "created":
      return "Proposta criada com sucesso.";
    case "deleted":
      return "Proposta removida.";
    case "updated":
      return "Proposta atualizada.";
    case "sent":
      return "Proposta enviada para aprovacao.";
    default:
      return null;
  }
}

export default async function ProposalsPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  const [proposals, clients, leads] = await Promise.all([listProposals(), listClients(), listLeads()]);
  const query = await searchParams;

  return (
    <AdminShell title="Propostas" description="Templates comerciais, geracao assistida por IA e acompanhamento de aceite.">
      <PageToast message={getProposalToast(query?.success)} />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Nova proposta</h2>
          <form action={createProposalAction} className="mt-6 grid gap-4">
            <Input name="title" placeholder="Titulo da proposta" required />
            <Textarea name="summary" placeholder="Resumo executivo" />
            <Textarea name="scope" placeholder="Escopo / entregas" />
            <Input name="price" placeholder="Valor" required type="number" />
            <Input name="validUntil" type="date" />
            <Select defaultValue="DRAFT" name="status">
              {proposalStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select defaultValue="" name="clientId">
              <option value="">Sem cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.companyName}
                </option>
              ))}
            </Select>
            <Select defaultValue="" name="leadId">
              <option value="">Sem lead</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name}
                </option>
              ))}
            </Select>
            <Button type="submit">Salvar proposta</Button>
          </form>
        </Card>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Proposta</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Conta</TableHeaderCell>
                  <TableHeaderCell>Valor</TableHeaderCell>
                  <TableHeaderCell className="text-right">Acoes</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell>
                      <p className="font-medium text-ink-950">{proposal.title}</p>
                      <p className="text-xs text-ink-950/55">{formatDate(proposal.validUntil)}</p>
                    </TableCell>
                    <TableCell>
                      <Badge tone={proposal.status === "ACCEPTED" ? "success" : "neutral"}>{proposal.status}</Badge>
                    </TableCell>
                    <TableCell>{proposal.clientName ?? proposal.leadName ?? "-"}</TableCell>
                    <TableCell>{formatCurrency(proposal.price)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/proposals/${proposal.id}`}>
                          <Button size="sm" variant="secondary">
                            Editar
                          </Button>
                        </Link>
                        {proposal.status === "DRAFT" ? (
                          <form action={sendProposalForApprovalAction}>
                            <input name="id" type="hidden" value={proposal.id} />
                            <Button size="sm" type="submit" variant="secondary">
                              Enviar
                            </Button>
                          </form>
                        ) : null}
                        <form action={deleteProposalAction}>
                          <input name="id" type="hidden" value={proposal.id} />
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
      </div>
    </AdminShell>
  );
}

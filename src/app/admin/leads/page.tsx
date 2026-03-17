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
import { formatDate } from "@/lib/formatters";
import { leadStatusOptions } from "@/lib/navigation";
import { convertLeadToClientAction, createLeadAction, deleteLeadAction } from "@/modules/leads/actions";
import { listLeads } from "@/modules/leads/repository";

function getLeadToast(success?: string, error?: string) {
  if (error === "convert") {
    return { type: "error" as const, message: "Nao foi possivel converter o lead." };
  }

  switch (success) {
    case "created":
      return { type: "success" as const, message: "Lead criado com sucesso." };
    default:
      return null;
  }
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string; error?: string }>;
}) {
  const leads = await listLeads();
  const query = await searchParams;
  const toastConfig = getLeadToast(query?.success, query?.error);

  return (
    <AdminShell title="Leads" description="CRM comercial com captura, status, observacoes e historico operacional.">
      <PageToast message={toastConfig?.message} type={toastConfig?.type} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Novo lead</p>
          <h2 className="mt-2 font-display text-2xl text-ink-950">Cadastrar manualmente</h2>
          <form action={createLeadAction} className="mt-6 grid gap-4">
            <Input name="name" placeholder="Nome" required />
            <Input name="email" placeholder="Email" required type="email" />
            <Input name="phone" placeholder="Telefone" />
            <Input name="company" placeholder="Empresa" />
            <Input name="objective" placeholder="Objetivo" />
            <Select defaultValue="NEW" name="status">
              {leadStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Input name="tags" placeholder="Tags separadas por virgula" />
            <Textarea name="notes" placeholder="Observacoes internas" />
            <Button type="submit">Salvar lead</Button>
          </form>
        </Card>

        <PageSection title="Pipeline" description="Visao atual dos leads ativos e seu status no funil.">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Lead</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Origem</TableHeaderCell>
                    <TableHeaderCell>Entrada</TableHeaderCell>
                    <TableHeaderCell className="text-right">Acoes</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <p className="font-medium text-ink-950">{lead.name}</p>
                        <p className="text-xs text-ink-950/55">{lead.email}</p>
                      </TableCell>
                      <TableCell>
                        <Badge tone={lead.status === "WON" ? "success" : lead.status === "LOST" ? "warning" : "neutral"}>
                          {lead.status.replaceAll("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>{formatDate(lead.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/leads/${lead.id}`}>
                            <Button size="sm" variant="secondary">
                              Editar
                            </Button>
                          </Link>
                          {lead.status !== "WON" ? (
                            <form action={convertLeadToClientAction}>
                              <input name="id" type="hidden" value={lead.id} />
                              <Button size="sm" type="submit" variant="secondary">
                                Converter
                              </Button>
                            </form>
                          ) : null}
                          <form action={deleteLeadAction}>
                            <input name="id" type="hidden" value={lead.id} />
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

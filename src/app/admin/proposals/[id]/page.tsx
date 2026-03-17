import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageToast } from "@/components/ui/page-toast";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { listAttachments } from "@/modules/attachments/repository";
import { proposalStatusOptions } from "@/lib/navigation";
import { listClients } from "@/modules/clients/repository";
import { listLeads } from "@/modules/leads/repository";
import { updateProposalAction } from "@/modules/proposals/actions";
import { getProposalById } from "@/modules/proposals/repository";

export default async function ProposalDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const [proposal, clients, leads, attachments] = await Promise.all([
    getProposalById(id),
    listClients(),
    listLeads(),
    listAttachments({ proposalId: id }),
  ]);

  if (!proposal) {
    notFound();
  }

  return (
    <AdminShell title="Editar proposta" description="Refine o escopo, valor, relacionamento e status comercial.">
      <PageToast message={query?.success === "attachment" ? "Anexo adicionado a proposta." : undefined} />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <form action={updateProposalAction.bind(null, proposal.id)} className="grid gap-4">
            <Input defaultValue={proposal.title} name="title" placeholder="Titulo" />
            <Textarea defaultValue={proposal.summary} name="summary" placeholder="Resumo" />
            <Textarea defaultValue={proposal.scope} name="scope" placeholder="Escopo" />
            <Input defaultValue={proposal.price.toString()} name="price" placeholder="Valor" type="number" />
            <Input defaultValue={proposal.validUntil?.slice(0, 10) ?? ""} name="validUntil" type="date" />
            <Select defaultValue={proposal.status} name="status">
              {proposalStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select defaultValue={proposal.clientId ?? ""} name="clientId">
              <option value="">Sem cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.companyName}
                </option>
              ))}
            </Select>
            <Select defaultValue={proposal.leadId ?? ""} name="leadId">
              <option value="">Sem lead</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name}
                </option>
              ))}
            </Select>
            <Button type="submit">Salvar alteracoes</Button>
          </form>
        </Card>
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display text-2xl text-ink-950">Anexar arquivo</h2>
            <form action="/api/uploads" className="mt-5 grid gap-4" encType="multipart/form-data" method="post">
              <input name="proposalId" type="hidden" value={proposal.id} />
              {proposal.clientId ? <input name="clientId" type="hidden" value={proposal.clientId} /> : null}
              <input name="redirectTo" type="hidden" value={`/admin/proposals/${proposal.id}`} />
              <Input name="title" placeholder="Titulo" />
              <input
                className="block w-full rounded-2xl border border-ink-950/10 bg-white px-4 py-3 text-sm text-ink-950"
                name="file"
                required
                type="file"
              />
              <Textarea name="notes" placeholder="Observacoes" />
              <Button type="submit" variant="secondary">
                Registrar anexo
              </Button>
            </form>
          </Card>
          <Card className="p-6">
            <h2 className="font-display text-2xl text-ink-950">Arquivos vinculados</h2>
            <div className="mt-5 space-y-4">
              {attachments.length ? (
                attachments.map((attachment) => (
                  <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={attachment.id}>
                    <p className="font-medium text-ink-950">{attachment.title}</p>
                    <a
                      className="mt-2 block text-sm text-emerald-500 underline"
                      href={attachment.fileUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {attachment.fileName}
                    </a>
                    {attachment.notes ? <p className="mt-2 text-sm text-ink-950/65">{attachment.notes}</p> : null}
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink-950/55">Nenhum arquivo vinculado a esta proposta.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

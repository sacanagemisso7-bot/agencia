import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageToast } from "@/components/ui/page-toast";
import { Select } from "@/components/ui/select";
import { TimelineFeed } from "@/components/ui/timeline-feed";
import { Textarea } from "@/components/ui/textarea";
import { listAttachments } from "@/modules/attachments/repository";
import { listCampaigns } from "@/modules/campaigns/repository";
import { contractStatusOptions } from "@/lib/navigation";
import { formatCurrency } from "@/lib/formatters";
import { updateClientAction } from "@/modules/clients/actions";
import { getClientById } from "@/modules/clients/repository";
import { listMessages } from "@/modules/messages/repository";
import { listProposals } from "@/modules/proposals/repository";
import { listTasks } from "@/modules/tasks/repository";
import { getClientTimeline } from "@/modules/timeline/service";

export default async function ClientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const [client, attachments, campaigns, messages, proposals, tasks, timeline] = await Promise.all([
    getClientById(id),
    listAttachments({ clientId: id }),
    listCampaigns(),
    listMessages(),
    listProposals(),
    listTasks(),
    getClientTimeline(id),
  ]);

  if (!client) {
    notFound();
  }

  const clientCampaigns = campaigns.filter((item) => item.clientId === client.id);
  const clientMessages = messages.filter((item) => item.clientId === client.id);
  const clientProposals = proposals.filter((item) => item.clientId === client.id);
  const clientTasks = tasks.filter((item) => item.clientId === client.id);

  return (
    <AdminShell title="Editar cliente" description="Atualize dados da empresa, contexto, canais e status do contrato.">
      <PageToast
        message={
          query?.success === "converted"
            ? "Lead convertido em cliente com sucesso."
            : query?.success === "attachment"
              ? "Anexo registrado com sucesso."
              : undefined
        }
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Contrato" value={client.contractStatus} />
        <SummaryCard label="Ticket mensal" value={formatCurrency(client.monthlyTicket)} />
        <SummaryCard label="Campanhas ativas" value={String(clientCampaigns.length)} />
        <SummaryCard label="Mensagens registradas" value={String(clientMessages.length)} />
      </section>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <form action={updateClientAction.bind(null, client.id)} className="grid gap-4">
            <Input defaultValue={client.name} name="name" placeholder="Responsavel" required />
            <Input defaultValue={client.companyName} name="companyName" placeholder="Empresa" required />
            <Input defaultValue={client.email} name="email" placeholder="Email" required type="email" />
            <Input defaultValue={client.phone ?? ""} name="phone" placeholder="Telefone" />
            <Input defaultValue={client.niche ?? ""} name="niche" placeholder="Nicho" />
            <Input defaultValue={client.monthlyTicket?.toString() ?? ""} name="monthlyTicket" placeholder="Ticket mensal" type="number" />
            <Input defaultValue={client.activeChannels.join(", ")} name="activeChannels" placeholder="Canais ativos" />
            <Input defaultValue={client.websiteUrl ?? ""} name="websiteUrl" placeholder="Site" />
            <Select defaultValue={client.contractStatus} name="contractStatus">
              {contractStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Textarea defaultValue={client.goals ?? ""} name="goals" placeholder="Objetivos do cliente" />
            <Textarea defaultValue={client.notes ?? ""} name="notes" placeholder="Observacoes" />
            <Button type="submit">Salvar alteracoes</Button>
          </form>
        </Card>
        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Conta</p>
            <h2 className="mt-2 font-display text-2xl text-ink-950">Leitura executiva</h2>
            <div className="mt-6 grid gap-3 text-sm text-ink-950/68">
              <p>Nicho: {client.niche ?? "Nao informado"}</p>
              <p>Canais ativos: {client.activeChannels.join(", ") || "Nenhum canal cadastrado"}</p>
              <p>Propostas vinculadas: {clientProposals.length}</p>
              <p>Tarefas em aberto: {clientTasks.filter((item) => item.status !== "DONE").length}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {clientCampaigns.slice(0, 3).map((campaign) => (
                <Badge key={campaign.id} tone={campaign.status === "ACTIVE" || campaign.status === "OPTIMIZING" ? "success" : "neutral"}>
                  {campaign.platform}
                </Badge>
              ))}
            </div>
            <div className="mt-6 grid gap-3">
              <Link href={`/admin/ai?clientId=${client.id}&mode=SAVE_DRAFT&idea=${encodeURIComponent("Crie uma atualizacao executiva para este cliente com tom premium.")}`}>
                <Button className="w-full justify-center" variant="secondary">
                  Gerar atualizacao para cliente
                </Button>
              </Link>
              <Link href={`/admin/ai?clientId=${client.id}&mode=INTERNAL_SUMMARY&channel=INTERNAL&idea=${encodeURIComponent("Resuma o momento da conta e sugira os proximos passos internos.")}`}>
                <Button className="w-full justify-center" variant="secondary">
                  Resumo interno da conta
                </Button>
              </Link>
              <Link href="/portal">
                <Button className="w-full justify-center" variant="secondary">
                  Abrir portal do cliente
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-2xl text-ink-950">Registrar anexo</h2>
            <form action="/api/uploads" className="mt-5 grid gap-4" encType="multipart/form-data" method="post">
              <input name="clientId" type="hidden" value={client.id} />
              <input name="redirectTo" type="hidden" value={`/admin/clients/${client.id}`} />
              <Input name="title" placeholder="Titulo" />
              <input
                className="block w-full rounded-2xl border border-ink-950/10 bg-white px-4 py-3 text-sm text-ink-950"
                name="file"
                required
                type="file"
              />
              <Textarea name="notes" placeholder="Observacoes" />
              <Button type="submit" variant="secondary">
                Salvar anexo
              </Button>
            </form>
          </Card>
          <Card className="p-6">
            <h2 className="font-display text-2xl text-ink-950">Anexos</h2>
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
                <p className="text-sm text-ink-950/55">Nenhum anexo registrado para este cliente.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <TimelineFeed
        description="Auditoria, mensagens, campanhas, IA, propostas e entregas reunidas em uma unica visao operacional."
        emptyMessage="Esta conta ainda nao possui itens suficientes para montar uma timeline."
        items={timeline}
        title="Timeline da conta"
      />
    </AdminShell>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950/45">{label}</p>
      <p className="mt-3 font-display text-3xl text-ink-950">{value}</p>
    </Card>
  );
}

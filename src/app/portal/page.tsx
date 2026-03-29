import type { Metadata } from "next";

import { ClientShell } from "@/components/client/client-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageToast } from "@/components/ui/page-toast";
import { TimelineFeed } from "@/components/ui/timeline-feed";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { buildNoIndexMetadata } from "@/lib/seo";
import { listAttachments } from "@/modules/attachments/repository";
import { requireClientPortalUser } from "@/modules/auth/guards";
import { listCampaigns } from "@/modules/campaigns/repository";
import { getClientByEmail } from "@/modules/clients/repository";
import { listMessages } from "@/modules/messages/repository";
import { registerProposalDecisionAction } from "@/modules/proposals/actions";
import { listProposals } from "@/modules/proposals/repository";
import { listTasks } from "@/modules/tasks/repository";
import { getClientTimeline } from "@/modules/timeline/service";

export const metadata: Metadata = buildNoIndexMetadata(
  "Portal do Cliente | Ameni",
  "Area reservada para acompanhamento da operacao do cliente.",
);

export default async function ClientPortalPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  const query = await searchParams;
  const user = await requireClientPortalUser();
  const client = await getClientByEmail(user.email);

  if (!client) {
    return (
      <ClientShell
        clientName={user.name}
        description="Assim que vincularmos sua conta a um cliente ativo, esta area mostrara campanhas, mensagens e proximos passos."
        title="Portal do cliente"
      >
        <EmptyState
          title="Conta ainda sem cliente vinculado"
          description="O login funcionou, mas nao encontramos um cliente associado a este email."
        />
      </ClientShell>
    );
  }

  const [campaigns, messages, proposals, tasks, attachments, timeline] = await Promise.all([
    listCampaigns(),
    listMessages(),
    listProposals(),
    listTasks(),
    listAttachments({ clientId: client.id }),
    getClientTimeline(client.id),
  ]);

  const clientCampaigns = campaigns.filter((item) => item.clientId === client.id);
  const clientMessages = messages.filter((item) => item.clientId === client.id);
  const clientProposals = proposals.filter((item) => item.clientId === client.id);
  const clientTasks = tasks.filter((item) => item.clientId === client.id);
  const activeCampaigns = clientCampaigns.filter((item) => item.status === "ACTIVE" || item.status === "OPTIMIZING");
  const openTasks = clientTasks.filter((item) => item.status !== "DONE");
  const totalBudget = activeCampaigns.reduce((sum, item) => sum + (item.budget ?? 0), 0);
  const totalConversions = activeCampaigns.reduce((sum, item) => sum + readMetricNumber(item.metrics, ["leads", "conversoes"]), 0);

  return (
    <ClientShell
      clientName={client.companyName}
      description="Visao executiva da conta com campanhas, entregas, comunicacao recente e contexto operacional compartilhavel."
      title="Visao da sua operacao"
    >
      <PageToast
        message={
          query?.success === "proposal-accepted"
            ? "Proposta aceita com sucesso."
            : query?.success === "proposal-rejected"
              ? "Recebemos sua decisao sobre a proposta."
              : undefined
        }
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PortalStat label="Status do contrato" value={client.contractStatus} />
        <PortalStat label="Ticket mensal" value={formatCurrency(client.monthlyTicket)} />
        <PortalStat label="Campanhas ativas" value={String(activeCampaigns.length)} />
        <PortalStat label="Entregaveis" value={String(attachments.length)} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Foco da operacao</h2>
          <p className="mt-4 text-sm leading-7 text-ink-950/65">
            {client.goals ??
              "A equipe esta consolidando midia, conteudo e rotina comercial para manter crescimento com previsibilidade."}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetricPill label="Budget ativo" value={formatCurrency(totalBudget)} />
            <MetricPill label="Conversoes" value={String(totalConversions)} />
            <MetricPill label="Tarefas abertas" value={String(openTasks.length)} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Mensagens e atualizacoes</h2>
          <div className="mt-5 space-y-4">
            {clientMessages.length ? (
              clientMessages.slice(0, 5).map((message) => (
                <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={message.id}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-ink-950">{message.subject ?? "Mensagem"}</p>
                    <Badge tone={message.status === "SENT" ? "success" : "neutral"}>{message.status}</Badge>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-ink-950/65">{message.body}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-ink-950/42">
                    {formatDateTime(message.sentAt ?? message.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                title="Sem mensagens recentes"
                description="As comunicacoes registradas pela equipe aparecerao aqui."
              />
            )}
          </div>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Campanhas em andamento</h2>
          <div className="mt-5 space-y-4">
            {clientCampaigns.length ? (
              clientCampaigns.map((campaign) => (
                <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={campaign.id}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-ink-950">{campaign.name}</p>
                    <Badge tone={campaign.status === "ACTIVE" || campaign.status === "OPTIMIZING" ? "success" : "neutral"}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-ink-950/65">{campaign.objective}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.12em] text-ink-950/48">
                    {renderMetricChips(campaign.metrics)}
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="Sem campanhas ainda"
                description="Quando novas campanhas forem registradas, elas aparecerao aqui."
              />
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Arquivos e entregaveis</h2>
          <div className="mt-5 space-y-4">
            {attachments.length ? (
              attachments.slice(0, 6).map((attachment) => (
                <a
                  className="block rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6 transition hover:ring-ink-950/14"
                  href={attachment.fileUrl}
                  key={attachment.id}
                  rel="noreferrer"
                  target="_blank"
                >
                  <p className="font-medium text-ink-950">{attachment.title}</p>
                  <p className="mt-2 text-sm text-ink-950/65">{attachment.notes ?? attachment.fileName}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-ink-950/42">
                    {formatDateTime(attachment.createdAt)}
                  </p>
                </a>
              ))
            ) : (
              <EmptyState
                title="Sem entregaveis publicados"
                description="Assim que a equipe registrar novos arquivos, eles aparecerao aqui."
              />
            )}
          </div>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Propostas</h2>
          <div className="mt-5 space-y-4">
            {clientProposals.length ? (
              clientProposals.map((proposal) => (
                <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={proposal.id}>
                  <p className="font-medium text-ink-950">{proposal.title}</p>
                  <p className="mt-2 text-sm text-ink-950/65">{proposal.summary}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-ink-950/42">
                    {proposal.status} | {formatCurrency(proposal.price)}
                  </p>
                  {proposal.status === "SENT" || proposal.status === "VIEWED" ? (
                    <div className="mt-4 flex gap-2">
                      <form action={registerProposalDecisionAction}>
                        <input name="id" type="hidden" value={proposal.id} />
                        <input name="decision" type="hidden" value="ACCEPTED" />
                        <Button size="sm" type="submit" variant="secondary">
                          Aceitar
                        </Button>
                      </form>
                      <form action={registerProposalDecisionAction}>
                        <input name="id" type="hidden" value={proposal.id} />
                        <input name="decision" type="hidden" value="REJECTED" />
                        <Button size="sm" type="submit" variant="ghost">
                          Recusar
                        </Button>
                      </form>
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <EmptyState
                title="Sem propostas no momento"
                description="Quando houver uma nova proposta ou aditivo, ela ficara disponivel aqui."
              />
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Proximos passos</h2>
          <div className="mt-5 space-y-4">
            {clientTasks.length ? (
              clientTasks.map((task) => (
                <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={task.id}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-ink-950">{task.title}</p>
                    <Badge tone={task.status === "DONE" ? "success" : "neutral"}>{task.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-ink-950/65">{task.description ?? "Atividade em acompanhamento."}</p>
                  {task.dueDate ? (
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-ink-950/42">
                      Prazo {formatDateTime(task.dueDate)}
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <EmptyState
                title="Sem tarefas abertas"
                description="A equipe ainda nao registrou tarefas compartilhaveis nesta conta."
              />
            )}
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <TimelineFeed
          description="Resumo cronologico do que aconteceu na conta, incluindo mensagens, propostas, campanhas e entregas."
          emptyMessage="A timeline desta conta ainda esta vazia."
          items={timeline}
          showLinks={false}
          title="Timeline da conta"
        />
      </section>
    </ClientShell>
  );
}

function PortalStat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950/45">{label}</p>
      <p className="mt-3 font-display text-3xl text-ink-950">{value}</p>
    </Card>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-white p-4 ring-1 ring-ink-950/6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-950/42">{label}</p>
      <p className="mt-2 font-display text-2xl text-ink-950">{value}</p>
    </div>
  );
}

function readMetricNumber(metrics: Record<string, number | string> | null | undefined, keys: string[]) {
  if (!metrics) {
    return 0;
  }

  for (const key of keys) {
    const value = metrics[key];
    if (typeof value === "number") {
      return value;
    }
  }

  return 0;
}

function renderMetricChips(metrics: Record<string, number | string> | null | undefined) {
  if (!metrics) {
    return <span className="rounded-full bg-ink-950/6 px-3 py-1">Sem metricas ainda</span>;
  }

  return Object.entries(metrics)
    .slice(0, 4)
    .map(([key, value]) => (
      <span className="rounded-full bg-ink-950/6 px-3 py-1" key={key}>
        {key}: {String(value)}
      </span>
    ));
}


import { ClientShell } from "@/components/client/client-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { requireClientPortalUser } from "@/modules/auth/guards";
import { getClientByEmail } from "@/modules/clients/repository";
import { listCampaigns } from "@/modules/campaigns/repository";
import { listMessages } from "@/modules/messages/repository";
import { listProposals } from "@/modules/proposals/repository";
import { listTasks } from "@/modules/tasks/repository";

export default async function ClientPortalPage() {
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

  const [campaigns, messages, proposals, tasks] = await Promise.all([
    listCampaigns(),
    listMessages(),
    listProposals(),
    listTasks(),
  ]);

  const clientCampaigns = campaigns.filter((item) => item.clientId === client.id);
  const clientMessages = messages.filter((item) => item.clientId === client.id);
  const clientProposals = proposals.filter((item) => item.clientId === client.id);
  const clientTasks = tasks.filter((item) => item.clientId === client.id);

  return (
    <ClientShell
      clientName={client.companyName}
      description="Visao simplificada da conta, das campanhas em andamento, do historico recente e dos proximos passos da operacao."
      title="Visao da sua operacao"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PortalStat label="Status do contrato" value={client.contractStatus} />
        <PortalStat label="Ticket mensal" value={formatCurrency(client.monthlyTicket)} />
        <PortalStat label="Campanhas ativas" value={String(clientCampaigns.length)} />
        <PortalStat label="Mensagens registradas" value={String(clientMessages.length)} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Campanhas</h2>
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
          <h2 className="font-display text-2xl text-ink-950">Propostas</h2>
          <div className="mt-5 space-y-4">
            {clientProposals.length ? (
              clientProposals.map((proposal) => (
                <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={proposal.id}>
                  <p className="font-medium text-ink-950">{proposal.title}</p>
                  <p className="mt-2 text-sm text-ink-950/65">{proposal.summary}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-ink-950/42">
                    {proposal.status} • {formatCurrency(proposal.price)}
                  </p>
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

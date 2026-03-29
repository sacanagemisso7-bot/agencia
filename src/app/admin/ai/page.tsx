import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageToast } from "@/components/ui/page-toast";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { aiModeOptions, aiToneOptions, messageChannelOptions } from "@/lib/navigation";
import { runAIAction } from "@/modules/ai/actions";
import { listAIRequests } from "@/modules/ai/service";
import { listCampaigns } from "@/modules/campaigns/repository";
import { listClients } from "@/modules/clients/repository";
import { listLeads } from "@/modules/leads/repository";
import { listMessages } from "@/modules/messages/repository";
import { listProposals } from "@/modules/proposals/repository";
import { listTasks } from "@/modules/tasks/repository";

type AIPageQuery = {
  success?: string;
  idea?: string;
  objective?: string;
  responseSize?: string;
  tone?: string;
  mode?: string;
  channel?: string;
  clientId?: string;
  leadId?: string;
};

export default async function AIPage({
  searchParams,
}: {
  searchParams?: Promise<AIPageQuery>;
}) {
  const query = await searchParams;
  const [clients, leads, campaigns, messages, proposals, tasks] = await Promise.all([
    listClients(),
    listLeads(),
    listCampaigns(),
    listMessages(),
    listProposals(),
    listTasks(),
  ]);

  const selectedClient = clients.find((client) => client.id === query?.clientId);
  const selectedLead = leads.find((lead) => lead.id === query?.leadId);
  const requests = await listAIRequests({
    clientId: selectedClient?.id,
    leadId: selectedLead?.id,
    take: selectedClient || selectedLead ? 12 : 20,
  });

  const contextualMessages = messages
    .filter((item) => (selectedClient ? item.clientId === selectedClient.id : true) && (selectedLead ? item.leadId === selectedLead.id : true))
    .slice(0, 3);
  const contextualTasks = tasks
    .filter((item) => item.status !== "DONE" && ((selectedClient && item.clientId === selectedClient.id) || (selectedLead && item.leadId === selectedLead.id)))
    .slice(0, 3);
  const contextualProposals = proposals
    .filter((item) => (selectedClient ? item.clientId === selectedClient.id : true) && (selectedLead ? item.leadId === selectedLead.id : true))
    .slice(0, 2);
  const contextualCampaigns = campaigns.filter((item) => selectedClient && item.clientId === selectedClient.id).slice(0, 3);

  return (
    <AdminShell
      title="Central IA"
      description="Transforme contexto comercial e operacional em mensagens, propostas, resumos e proximos passos auditaveis."
    >
      <PageToast
        message={query?.success === "generated" ? "Fluxo da IA executado com sucesso." : undefined}
      />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Assistente comercial</p>
            <h2 className="mt-2 font-display text-2xl text-ink-950">Gerar com contexto</h2>
            <form action={runAIAction} className="mt-6 grid gap-4">
              <input
                name="redirectTo"
                type="hidden"
                value={`/admin/ai?success=generated${query?.clientId ? `&clientId=${query.clientId}` : ""}${query?.leadId ? `&leadId=${query.leadId}` : ""}`}
              />
              <Textarea
                defaultValue={query?.idea ?? ""}
                name="idea"
                placeholder="Ex.: crie um follow-up consultivo para proposta enviada ha 3 dias."
              />
              <Input
                defaultValue={query?.objective ?? "Gerar mensagem profissional"}
                name="objective"
                placeholder="Objetivo"
              />
              <Input defaultValue={query?.responseSize ?? "medio"} name="responseSize" placeholder="Tamanho da resposta" />
              <Select defaultValue={query?.tone ?? "consultivo"} name="tone">
                {aiToneOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select defaultValue={query?.mode ?? "SAVE_DRAFT"} name="mode">
                {aiModeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select defaultValue={query?.channel ?? "EMAIL"} name="channel">
                {messageChannelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select defaultValue={query?.clientId ?? ""} name="clientId">
                <option value="">Sem cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName}
                  </option>
                ))}
              </Select>
              <Select defaultValue={query?.leadId ?? ""} name="leadId">
                <option value="">Sem lead</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name}
                  </option>
                ))}
              </Select>
              <Button type="submit">Executar fluxo IA</Button>
            </form>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Contexto selecionado</p>
            <h2 className="mt-2 font-display text-2xl text-ink-950">
              {selectedClient?.companyName ?? selectedLead?.name ?? "Sem entidade vinculada"}
            </h2>
            <div className="mt-6 space-y-4 text-sm text-ink-950/66">
              {selectedClient ? (
                <>
                  <p>Nicho: {selectedClient.niche ?? "Nao informado"}</p>
                  <p>Objetivo: {selectedClient.goals ?? "Nao informado"}</p>
                  <p>Ticket: {selectedClient.monthlyTicket ? `R$ ${selectedClient.monthlyTicket}` : "Nao informado"}</p>
                </>
              ) : null}
              {selectedLead ? (
                <>
                  <p>Empresa: {selectedLead.company ?? "Nao informada"}</p>
                  <p>Servico: {selectedLead.serviceInterest ?? "Nao informado"}</p>
                  <p>Status: {selectedLead.status}</p>
                </>
              ) : null}
              {!selectedClient && !selectedLead ? (
                <p>Selecione um cliente ou lead para enriquecer a resposta com historico e contexto operacional.</p>
              ) : null}
            </div>
            <div className="mt-6 grid gap-3">
              {contextualCampaigns.map((campaign) => (
                <div className="rounded-[20px] bg-white p-4 ring-1 ring-ink-950/6" key={campaign.id}>
                  <p className="font-medium text-ink-950">{campaign.name}</p>
                  <p className="mt-1 text-sm text-ink-950/62">
                    {campaign.platform} | {campaign.status}
                  </p>
                </div>
              ))}
              {contextualTasks.map((task) => (
                <div className="rounded-[20px] bg-white p-4 ring-1 ring-ink-950/6" key={task.id}>
                  <p className="font-medium text-ink-950">{task.title}</p>
                  <p className="mt-1 text-sm text-ink-950/62">
                    {task.priority} | {task.ownerName ?? "Sem responsavel"}
                  </p>
                </div>
              ))}
              {contextualCampaigns.length === 0 && contextualTasks.length === 0 ? (
                <p className="rounded-[20px] bg-white p-4 text-sm text-ink-950/55 ring-1 ring-ink-950/6">
                  O contexto operacional vai aparecer aqui assim que houver campanhas ou tarefas vinculadas.
                </p>
              ) : null}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Memoria operacional</p>
            <h2 className="mt-2 font-display text-2xl text-ink-950">Sinais recentes</h2>
            <div className="mt-6 grid gap-4">
              {contextualMessages.map((message) => (
                <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={message.id}>
                  <p className="font-medium text-ink-950">{message.subject ?? "Mensagem"}</p>
                  <p className="mt-2 text-sm text-ink-950/65">{message.body}</p>
                </div>
              ))}
              {contextualProposals.map((proposal) => (
                <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={proposal.id}>
                  <p className="font-medium text-ink-950">{proposal.title}</p>
                  <p className="mt-2 text-sm text-ink-950/65">{proposal.summary}</p>
                </div>
              ))}
              {contextualMessages.length === 0 && contextualProposals.length === 0 ? (
                <p className="rounded-[22px] bg-white p-4 text-sm text-ink-950/55 ring-1 ring-ink-950/6">
                  Sem historico suficiente ainda. Mesmo assim, a IA consegue gerar fluxo a partir da sua instruicao.
                </p>
              ) : null}
            </div>
          </Card>

          <div className="space-y-4">
            {requests.map((request) => (
              <Card className="p-6" key={request.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-500">{request.mode}</p>
                    <h3 className="mt-2 font-display text-2xl text-ink-950">
                      {request.clientName ?? request.leadName ?? "Solicitacao interna"}
                    </h3>
                  </div>
                  <Badge tone={request.status === "SENT" ? "success" : request.status === "FAILED" ? "warning" : "neutral"}>
                    {request.status}
                  </Badge>
                </div>
                <p className="mt-4 text-sm leading-7 text-ink-950/65">{request.input}</p>
                <div className="mt-5 rounded-[24px] bg-white p-5 ring-1 ring-ink-950/6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950/45">Saida gerada</p>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink-950/78">{request.generatedText}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

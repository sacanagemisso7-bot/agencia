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
import { listClients } from "@/modules/clients/repository";
import { listLeads } from "@/modules/leads/repository";

export default async function AIPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  const [requests, clients, leads] = await Promise.all([listAIRequests(), listClients(), listLeads()]);
  const query = await searchParams;

  return (
    <AdminShell
      title="Central IA"
      description="Transforme ideias soltas em mensagens profissionais, propostas, tarefas e resumos auditaveis."
    >
      <PageToast
        message={query?.success === "generated" ? "Fluxo da IA executado com sucesso." : undefined}
      />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Assistente comercial</p>
          <h2 className="mt-2 font-display text-2xl text-ink-950">Gerar com contexto</h2>
          <form action={runAIAction} className="mt-6 grid gap-4">
            <Textarea name="idea" placeholder="Ex.: crie um follow-up consultivo para proposta enviada ha 3 dias." />
            <Input defaultValue="Gerar mensagem profissional" name="objective" placeholder="Objetivo" />
            <Input defaultValue="medio" name="responseSize" placeholder="Tamanho da resposta" />
            <Select defaultValue="consultivo" name="tone">
              {aiToneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select defaultValue="SAVE_DRAFT" name="mode">
              {aiModeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select defaultValue="EMAIL" name="channel">
              {messageChannelOptions.map((option) => (
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
            <Button type="submit">Executar fluxo IA</Button>
          </form>
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
                <Badge tone={request.status === "SENT" ? "success" : "neutral"}>{request.status}</Badge>
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
    </AdminShell>
  );
}

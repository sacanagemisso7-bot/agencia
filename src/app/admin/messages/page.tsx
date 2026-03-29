import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageToast } from "@/components/ui/page-toast";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/formatters";
import { messageChannelOptions } from "@/lib/navigation";
import { listClients } from "@/modules/clients/repository";
import { listLeads } from "@/modules/leads/repository";
import { createMessageAction, processMessageQueueAction, sendDraftMessageAction } from "@/modules/messages/actions";
import { listMessages } from "@/modules/messages/repository";

function getMessageToast(success?: string, error?: string) {
  if (error === "missing") {
    return { type: "error" as const, message: "Mensagem nao encontrada." };
  }

  switch (success) {
    case "draft":
      return { type: "success" as const, message: "Mensagem salva como rascunho." };
    case "sent":
      return { type: "success" as const, message: "Mensagem enviada com sucesso." };
    case "approved":
      return { type: "success" as const, message: "Rascunho aprovado e enviado." };
    case "queue":
      return { type: "success" as const, message: "Fila de mensagens processada." };
    case "failed":
      return { type: "error" as const, message: "Houve falha no envio da mensagem." };
    default:
      return null;
  }
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string; error?: string }>;
}) {
  const [messages, clients, leads] = await Promise.all([listMessages(), listClients(), listLeads()]);
  const query = await searchParams;
  const toastConfig = getMessageToast(query?.success, query?.error);

  return (
    <AdminShell title="Central de mensagens" description="Rascunhos, envios, historico por cliente e canais preparados para escalar.">
      <PageToast message={toastConfig?.message} type={toastConfig?.type} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-ink-950">Nova mensagem</h2>
            <form action={processMessageQueueAction}>
              <Button size="sm" type="submit" variant="secondary">
                Executar ciclo
              </Button>
            </form>
          </div>
          <form action={createMessageAction} className="mt-6 grid gap-4">
            <Input name="subject" placeholder="Assunto" />
            <Textarea name="body" placeholder="Mensagem" />
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
            <Input name="recipientName" placeholder="Nome do destinatario" />
            <Input name="recipientEmail" placeholder="Email do destinatario" />
            <Input name="recipientPhone" placeholder="Telefone do destinatario" />
            <Input name="scheduledFor" type="datetime-local" />
            <Select defaultValue="false" name="sendNow">
              <option value="false">Salvar como rascunho</option>
              <option value="true">Enviar agora</option>
            </Select>
            <Button type="submit">Salvar mensagem</Button>
          </form>
        </Card>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Mensagem</TableHeaderCell>
                  <TableHeaderCell>Canal</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Relacionamento</TableHeaderCell>
                  <TableHeaderCell>Provedor</TableHeaderCell>
                  <TableHeaderCell>Quando</TableHeaderCell>
                  <TableHeaderCell className="text-right">Acoes</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <p className="font-medium text-ink-950">{message.subject ?? "Mensagem"}</p>
                      <p className="line-clamp-2 text-xs text-ink-950/55">{message.body}</p>
                    </TableCell>
                    <TableCell>{message.channel}</TableCell>
                  <TableCell>
                      <Badge tone={message.status === "SENT" ? "success" : message.status === "FAILED" ? "warning" : "neutral"}>
                        {message.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{message.clientName ?? message.leadName ?? "-"}</TableCell>
                    <TableCell>
                      <p>{message.providerName ?? "-"}</p>
                      <p className="text-xs text-ink-950/45">{message.providerMessageId ?? ""}</p>
                    </TableCell>
                    <TableCell>{formatDateTime(message.sentAt ?? message.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      {message.status === "DRAFT" ? (
                        <form action={sendDraftMessageAction}>
                          <input name="id" type="hidden" value={message.id} />
                          <Button size="sm" type="submit" variant="secondary">
                            Aprovar e enviar
                          </Button>
                        </form>
                      ) : null}
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

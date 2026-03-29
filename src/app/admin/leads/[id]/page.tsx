import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TimelineFeed } from "@/components/ui/timeline-feed";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDateTime, formatRelativeHoursFromNow } from "@/lib/formatters";
import { contactPreferenceOptions, estimatedTicketOptions, serviceInterestOptions, urgencyOptions } from "@/lib/lead-capture";
import { leadStatusOptions } from "@/lib/navigation";
import { getAutomationSettings } from "@/modules/automation-config/repository";
import { convertLeadToClientAction, updateLeadAction } from "@/modules/leads/actions";
import { assessLeadIntent, assessLeadSla } from "@/modules/leads/intent";
import { getLeadById } from "@/modules/leads/repository";
import { getLeadTimeline } from "@/modules/timeline/service";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [lead, automationSettings, timeline] = await Promise.all([
    getLeadById(id),
    getAutomationSettings(),
    getLeadTimeline(id),
  ]);

  if (!lead) {
    notFound();
  }

  const assessment = assessLeadIntent(lead, automationSettings);
  const sla = assessLeadSla(lead, automationSettings);
  const scoreTone = assessment.isHighIntent ? "warning" : assessment.priorityLabel === "Media prioridade" ? "neutral" : "success";
  const slaTone = sla.status === "overdue" ? "warning" : sla.status === "due-soon" ? "neutral" : "success";

  return (
    <AdminShell title="Editar lead" description="Atualize os dados, o status do funil e as observacoes internas.">
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Leitura comercial</p>
            <h2 className="mt-2 font-display text-2xl text-ink-950">Score e prioridade</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-950/42">Heat score</p>
                <div className="mt-3 flex items-center gap-3">
                  <Badge tone={scoreTone}>{assessment.score}</Badge>
                  <span className="text-sm text-ink-950/68">{assessment.priorityLabel}</span>
                </div>
                <p className="mt-3 text-sm text-ink-950/62">{assessment.reasons.join(" | ")}</p>
              </div>

              <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-950/42">SLA comercial</p>
                <div className="mt-3 flex items-center gap-3">
                  <Badge tone={slaTone}>{sla.label}</Badge>
                  <span className="text-sm text-ink-950/68">{formatRelativeHoursFromNow(sla.dueAt)}</span>
                </div>
                <p className="mt-3 text-sm text-ink-950/62">Janela de resposta: {sla.responseWindowHours}h</p>
                <p className="mt-1 text-sm text-ink-950/62">Limite: {formatDateTime(sla.dueAt)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Contexto</p>
            <h2 className="mt-2 font-display text-2xl text-ink-950">Resumo do lead</h2>
            <div className="mt-6 grid gap-4 text-sm text-ink-950/72">
              <p>Responsavel: {lead.ownerName ?? "Nao atribuido"}</p>
              <p>Servico de interesse: {lead.serviceInterest ?? "Nao informado"}</p>
              <p>Canal preferido: {lead.contactPreference ?? "Nao informado"}</p>
              <p>Faixa estimada: {formatCurrency(lead.estimatedTicket)}</p>
              <p>Origem: {[lead.source, lead.utmSource, lead.utmCampaign].filter(Boolean).join(" / ") || "Nao informada"}</p>
              <p>Entrada: {formatDateTime(lead.createdAt)}</p>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">IA contextual</p>
            <h2 className="mt-2 font-display text-2xl text-ink-950">Acionamentos rapidos</h2>
            <div className="mt-6 grid gap-3">
              <Link href={`/admin/ai?leadId=${lead.id}&mode=SAVE_DRAFT&idea=${encodeURIComponent("Crie uma abordagem inicial consultiva para este lead.")}`}>
                <Button className="w-full justify-center" variant="secondary">
                  Gerar primeira abordagem
                </Button>
              </Link>
              <Link href={`/admin/ai?leadId=${lead.id}&mode=SAVE_DRAFT&idea=${encodeURIComponent("Crie um follow-up consultivo para movimentar este lead no funil.")}`}>
                <Button className="w-full justify-center" variant="secondary">
                  Gerar follow-up
                </Button>
              </Link>
              <Link href={`/admin/ai?leadId=${lead.id}&mode=CREATE_TASK&channel=INTERNAL&idea=${encodeURIComponent("Transforme o contexto deste lead em proximos passos operacionais.")}`}>
                <Button className="w-full justify-center" variant="secondary">
                  Sugerir proximos passos
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        <Card className="max-w-3xl p-6">
          <form action={updateLeadAction.bind(null, lead.id)} className="grid gap-4">
            <Input defaultValue={lead.name} name="name" placeholder="Nome" required />
            <Input defaultValue={lead.email} name="email" placeholder="Email" required type="email" />
            <Input defaultValue={lead.phone ?? ""} name="phone" placeholder="Telefone" />
            <Input defaultValue={lead.company ?? ""} name="company" placeholder="Empresa" />
            <Input defaultValue={lead.niche ?? ""} name="niche" placeholder="Nicho" />
            <Select defaultValue={lead.contactPreference ?? ""} name="contactPreference">
              <option value="">Canal preferido</option>
              {contactPreferenceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select defaultValue={lead.serviceInterest ?? ""} name="serviceInterest">
              <option value="">Servico de interesse</option>
              {serviceInterestOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Select defaultValue={lead.estimatedTicket?.toString() ?? ""} name="estimatedTicket">
              <option value="">Faixa de investimento</option>
              {estimatedTicketOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select defaultValue={lead.urgency ?? ""} name="urgency">
              <option value="">Urgencia</option>
              {urgencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Input defaultValue={lead.objective ?? ""} name="objective" placeholder="Objetivo" />
            <Input defaultValue={lead.source} name="source" placeholder="Origem" />
            <Input defaultValue={lead.landingPage ?? ""} name="landingPage" placeholder="Landing page" />
            <Input defaultValue={lead.referrer ?? ""} name="referrer" placeholder="Referrer" />
            <Input defaultValue={lead.utmSource ?? ""} name="utmSource" placeholder="UTM source" />
            <Input defaultValue={lead.utmMedium ?? ""} name="utmMedium" placeholder="UTM medium" />
            <Input defaultValue={lead.utmCampaign ?? ""} name="utmCampaign" placeholder="UTM campaign" />
            <Input defaultValue={lead.utmTerm ?? ""} name="utmTerm" placeholder="UTM term" />
            <Input defaultValue={lead.utmContent ?? ""} name="utmContent" placeholder="UTM content" />
            <Input defaultValue={lead.tags.join(", ")} name="tags" placeholder="Tags" />
            <Select defaultValue={lead.status} name="status">
              {leadStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Textarea defaultValue={lead.message ?? ""} name="message" placeholder="Mensagem original" />
            <Textarea defaultValue={lead.notes ?? ""} name="notes" placeholder="Observacoes internas" />
            <Button type="submit">Salvar alteracoes</Button>
          </form>
          {lead.status !== "WON" ? (
            <form action={convertLeadToClientAction} className="mt-4">
              <input name="id" type="hidden" value={lead.id} />
              <Button type="submit" variant="secondary">
                Converter este lead em cliente
              </Button>
            </form>
          ) : null}
        </Card>
      </section>

      <TimelineFeed
        description="Mensagens, propostas, tarefas, IA e auditoria aparecem em ordem cronologica para orientar o atendimento."
        emptyMessage="Este lead ainda nao possui eventos registrados na timeline."
        items={timeline}
        title="Timeline do lead"
      />
    </AdminShell>
  );
}

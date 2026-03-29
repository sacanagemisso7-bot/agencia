import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDateTime, formatRelativeHoursFromNow } from "@/lib/formatters";
import { getAutomationSettings } from "@/modules/automation-config/repository";
import { moveLeadStageAction } from "@/modules/leads/actions";
import { assessLeadSla, rankLeadsByIntent } from "@/modules/leads/intent";
import { listLeads } from "@/modules/leads/repository";
import { getSiteContent } from "@/modules/site-content/repository";

export default async function SchedulingPage() {
  const [automationSettings, leads, content] = await Promise.all([
    getAutomationSettings(),
    listLeads(),
    getSiteContent(),
  ]);

  const rankedLeads = rankLeadsByIntent(leads, automationSettings);
  const requestedMeeting = rankedLeads.filter(({ lead }) => lead.contactPreference === "Reuniao estrategica");
  const scheduledMeeting = rankedLeads.filter(({ lead }) => lead.status === "MEETING_SCHEDULED");
  const pendingScheduling = requestedMeeting.filter(({ lead }) => lead.status !== "MEETING_SCHEDULED");

  return (
    <AdminShell
      title="Agenda comercial"
      description="Fila de leads que pediram conversa, leitura de SLA e acesso rapido ao agendamento da equipe."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <SchedulingStat label="Pedidos de reuniao" value={String(requestedMeeting.length)} />
        <SchedulingStat label="Pendentes de agendamento" value={String(pendingScheduling.length)} />
        <SchedulingStat label="Ja marcados" value={String(scheduledMeeting.length)} />
      </section>

      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Agenda externa</p>
            <h2 className="mt-2 font-display text-2xl text-ink-950">Link principal de agendamento</h2>
            <p className="mt-3 text-sm leading-7 text-ink-950/62">
              Use este atalho para confirmar horarios com quem pediu reuniao ou compartilhar a agenda da equipe.
            </p>
          </div>
          <Link href={content.settings.calendarUrl} rel="noreferrer" target="_blank">
            <Button>Abrir agenda</Button>
          </Link>
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Fila de atendimento</p>
          <h2 className="mt-2 font-display text-2xl text-ink-950">Leads pedindo reuniao</h2>
          <div className="mt-6 grid gap-4">
            {pendingScheduling.length ? (
              pendingScheduling.map(({ lead, assessment }) => {
                const sla = assessLeadSla(lead, automationSettings);
                const slaTone = sla.status === "overdue" ? "warning" : sla.status === "due-soon" ? "neutral" : "success";

                return (
                  <div className="rounded-[24px] bg-white p-5 ring-1 ring-ink-950/6" key={lead.id}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-ink-950">{lead.company ?? lead.name}</p>
                        <p className="mt-1 text-sm text-ink-950/62">{lead.name}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge tone={assessment.isHighIntent ? "warning" : "neutral"}>Score {assessment.score}</Badge>
                        <Badge tone={slaTone}>{sla.label}</Badge>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-ink-950/64">
                      {[lead.serviceInterest, lead.source, lead.contactPreference].filter(Boolean).join(" | ")}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-ink-950/42">
                      {formatRelativeHoursFromNow(sla.dueAt)} | {formatCurrency(lead.estimatedTicket)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/admin/leads/${lead.id}`}>
                        <Button size="sm" variant="secondary">
                          Abrir lead
                        </Button>
                      </Link>
                      <form action={moveLeadStageAction.bind(null, lead.id, "MEETING_SCHEDULED")}>
                        <Button size="sm" type="submit">
                          Marcar como agendado
                        </Button>
                      </form>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[22px] bg-white p-4 text-sm text-ink-950/62 ring-1 ring-ink-950/6">
                Nenhum lead novo pedindo reuniao no momento.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Ja agendados</p>
          <h2 className="mt-2 font-display text-2xl text-ink-950">Fila confirmada</h2>
          <div className="mt-6 grid gap-4">
            {scheduledMeeting.length ? (
              scheduledMeeting.map(({ lead, assessment }) => (
                <div className="rounded-[24px] bg-white p-5 ring-1 ring-ink-950/6" key={lead.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink-950">{lead.company ?? lead.name}</p>
                      <p className="mt-1 text-sm text-ink-950/62">
                        {lead.name} | {lead.ownerName ?? "Sem responsavel"}
                      </p>
                    </div>
                    <Badge tone={assessment.isHighIntent ? "warning" : "neutral"}>Score {assessment.score}</Badge>
                  </div>
                  <p className="mt-4 text-sm text-ink-950/64">{[lead.serviceInterest, lead.contactPreference].filter(Boolean).join(" | ")}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-ink-950/42">{formatDateTime(lead.createdAt)}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[22px] bg-white p-4 text-sm text-ink-950/62 ring-1 ring-ink-950/6">
                Nenhum lead marcado como reuniao agendada ainda.
              </div>
            )}
          </div>
        </Card>
      </section>
    </AdminShell>
  );
}

function SchedulingStat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950/45">{label}</p>
      <p className="mt-3 font-display text-3xl text-ink-950">{value}</p>
    </Card>
  );
}

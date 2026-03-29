import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { PipelineLane } from "@/components/admin/pipeline-lane";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDateTime, formatRelativeHoursFromNow } from "@/lib/formatters";
import { leadStatusOptions, proposalStatusOptions } from "@/lib/navigation";
import { getAutomationSettings } from "@/modules/automation-config/repository";
import { moveLeadStageAction } from "@/modules/leads/actions";
import { assessLeadSla, rankLeadsByIntent } from "@/modules/leads/intent";
import { listLeads } from "@/modules/leads/repository";
import { moveProposalStageAction } from "@/modules/proposals/actions";
import { listProposals } from "@/modules/proposals/repository";

const nextLeadStatusMap = {
  NEW: "CONTACTED",
  CONTACTED: "MEETING_SCHEDULED",
  MEETING_SCHEDULED: "PROPOSAL_SENT",
  PROPOSAL_SENT: "NEGOTIATION",
  NEGOTIATION: "WON",
} as const;

const nextProposalStatusMap = {
  DRAFT: "SENT",
  SENT: "VIEWED",
  VIEWED: "ACCEPTED",
} as const;

export default async function PipelinePage() {
  const [automationSettings, leads, proposals] = await Promise.all([
    getAutomationSettings(),
    listLeads(),
    listProposals(),
  ]);

  const rankedLeads = rankLeadsByIntent(leads, automationSettings);
  const proposalStatusMap = new Map(proposalStatusOptions.map((option) => [option.value, option.label] as const));
  const leadGroups = new Map(leadStatusOptions.map((option) => [option.value, rankedLeads.filter((item) => item.lead.status === option.value)] as const));
  const proposalGroups = new Map(
    proposalStatusOptions.map((option) => [option.value, proposals.filter((proposal) => proposal.status === option.value)] as const),
  );

  const highIntentCount = rankedLeads.filter((item) => item.assessment.isHighIntent).length;
  const openProposals = proposals.filter((proposal) => proposal.status !== "ACCEPTED" && proposal.status !== "REJECTED").length;

  return (
    <AdminShell
      title="Pipeline visual"
      description="Movimente leads e propostas com leitura de calor comercial, SLA e contexto em um unico quadro operacional."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PipelineStat label="Leads em andamento" value={String(leads.filter((lead) => lead.status !== "WON" && lead.status !== "LOST").length)} />
        <PipelineStat label="Leads high-intent" value={String(highIntentCount)} />
        <PipelineStat label="Propostas abertas" value={String(openProposals)} />
        <PipelineStat label="Wins recentes" value={String(leads.filter((lead) => lead.status === "WON").length)} />
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Leads</p>
          <h2 className="mt-2 font-display text-3xl text-ink-950">Kanban comercial</h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-4">
          {leadStatusOptions.map((column) => (
            <PipelineLane
              key={column.value}
              count={leadGroups.get(column.value)?.length ?? 0}
              helper="Funil comercial"
              title={column.label}
            >
              {(leadGroups.get(column.value) ?? []).length ? (
                (leadGroups.get(column.value) ?? []).map(({ lead, assessment }) => {
                  const sla = assessLeadSla(lead, automationSettings);
                  const nextStatus = nextLeadStatusMap[lead.status as keyof typeof nextLeadStatusMap];
                  const scoreTone = assessment.isHighIntent ? "warning" : assessment.priorityLabel === "Media prioridade" ? "neutral" : "success";
                  const slaTone = sla.status === "overdue" ? "warning" : sla.status === "due-soon" ? "neutral" : "success";

                  return (
                    <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={lead.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-ink-950">{lead.company ?? lead.name}</p>
                          <p className="mt-1 text-sm text-ink-950/62">{lead.name}</p>
                        </div>
                        <Badge tone={scoreTone}>Score {assessment.score}</Badge>
                      </div>
                      <p className="mt-3 text-sm text-ink-950/65">
                        {[lead.serviceInterest, lead.source].filter(Boolean).join(" | ") || "Sem contexto comercial"}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge tone={slaTone}>{sla.label}</Badge>
                        {lead.ownerName ? <Badge tone="neutral">{lead.ownerName}</Badge> : null}
                      </div>
                      <p className="mt-3 text-xs uppercase tracking-[0.14em] text-ink-950/45">
                        {formatRelativeHoursFromNow(sla.dueAt)} | {formatCurrency(lead.estimatedTicket)}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Link href={`/admin/leads/${lead.id}`}>
                          <Button size="sm" variant="secondary">
                            Abrir
                          </Button>
                        </Link>
                        {nextStatus ? (
                          <form action={moveLeadStageAction.bind(null, lead.id, nextStatus)}>
                            <Button size="sm" type="submit">
                              Avancar
                            </Button>
                          </form>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyLane text={`Nenhum lead em ${column.label.toLowerCase()}.`} />
              )}
            </PipelineLane>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Propostas</p>
          <h2 className="mt-2 font-display text-3xl text-ink-950">Cadencia comercial</h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-4">
          {proposalStatusOptions.map((column) => (
            <PipelineLane
              key={column.value}
              count={proposalGroups.get(column.value)?.length ?? 0}
              helper="Pipeline de propostas"
              title={proposalStatusMap.get(column.value) ?? column.value}
            >
              {(proposalGroups.get(column.value) ?? []).length ? (
                (proposalGroups.get(column.value) ?? []).map((proposal) => {
                  const nextStatus = nextProposalStatusMap[proposal.status as keyof typeof nextProposalStatusMap];
                  const tone =
                    proposal.status === "ACCEPTED" ? "success" : proposal.status === "REJECTED" ? "warning" : "neutral";

                  return (
                    <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={proposal.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-ink-950">{proposal.title}</p>
                          <p className="mt-1 text-sm text-ink-950/62">
                            {proposal.clientName ?? proposal.leadName ?? "Negocio sem vinculo"}
                          </p>
                        </div>
                        <Badge tone={tone}>{proposal.status}</Badge>
                      </div>
                      <p className="mt-3 line-clamp-3 text-sm text-ink-950/65">{proposal.summary}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.14em] text-ink-950/45">
                        {formatCurrency(proposal.price)} | Criada em {formatDateTime(proposal.createdAt)}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Link href={`/admin/proposals/${proposal.id}`}>
                          <Button size="sm" variant="secondary">
                            Abrir
                          </Button>
                        </Link>
                        {nextStatus ? (
                          <form action={moveProposalStageAction.bind(null, proposal.id, nextStatus)}>
                            <Button size="sm" type="submit">
                              Avancar
                            </Button>
                          </form>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyLane text={`Nenhuma proposta em ${column.label.toLowerCase()}.`} />
              )}
            </PipelineLane>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

function PipelineStat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950/45">{label}</p>
      <p className="mt-3 font-display text-3xl text-ink-950">{value}</p>
    </Card>
  );
}

function EmptyLane({ text }: { text: string }) {
  return <p className="rounded-[20px] bg-white p-4 text-sm text-ink-950/55 ring-1 ring-ink-950/6">{text}</p>;
}

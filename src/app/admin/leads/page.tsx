import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { PageSection } from "@/components/admin/page-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageToast } from "@/components/ui/page-toast";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate, formatRelativeHoursFromNow } from "@/lib/formatters";
import { contactPreferenceOptions, estimatedTicketOptions, serviceInterestOptions, urgencyOptions } from "@/lib/lead-capture";
import { leadStatusOptions } from "@/lib/navigation";
import { getAutomationSettings } from "@/modules/automation-config/repository";
import { convertLeadToClientAction, createLeadAction, deleteLeadAction } from "@/modules/leads/actions";
import { assessLeadSla, rankLeadsByIntent } from "@/modules/leads/intent";
import { listLeads } from "@/modules/leads/repository";

function getLeadToast(success?: string, error?: string) {
  if (error === "convert") {
    return { type: "error" as const, message: "Nao foi possivel converter o lead." };
  }

  switch (success) {
    case "created":
      return { type: "success" as const, message: "Lead criado com sucesso." };
    default:
      return null;
  }
}

type LeadsPageQuery = {
  success?: string;
  error?: string;
  view?: string;
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams?: Promise<LeadsPageQuery>;
}) {
  const [rawLeads, automationSettings] = await Promise.all([listLeads(), getAutomationSettings()]);
  const query = await searchParams;
  const toastConfig = getLeadToast(query?.success, query?.error);
  const rankedLeads = rankLeadsByIntent(rawLeads, automationSettings);
  const activeView = query?.view ?? "heat";

  const leads = rankedLeads.filter(({ lead, assessment }) => {
    if (activeView === "high-intent") {
      return assessment.isHighIntent;
    }

    if (activeView === "sla") {
      return assessLeadSla(lead, automationSettings).status !== "on-track";
    }

    return true;
  });

  const highIntentCount = rankedLeads.filter((item) => item.assessment.isHighIntent).length;
  const criticalSlaCount = rankedLeads.filter((item) => assessLeadSla(item.lead, automationSettings).status !== "on-track").length;

  return (
    <AdminShell title="Leads" description="CRM comercial com score, SLA, roteamento e historico operacional.">
      <PageToast message={toastConfig?.message} type={toastConfig?.type} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Novo lead</p>
          <h2 className="mt-2 font-display text-2xl text-ink-950">Cadastrar manualmente</h2>
          <form action={createLeadAction} className="mt-6 grid gap-4">
            <Input name="name" placeholder="Nome" required />
            <Input name="email" placeholder="Email" required type="email" />
            <Input name="phone" placeholder="Telefone" />
            <Input name="company" placeholder="Empresa" />
            <Select defaultValue="" name="contactPreference">
              <option value="">Canal preferido</option>
              {contactPreferenceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select defaultValue="" name="serviceInterest">
              <option value="">Servico de interesse</option>
              {serviceInterestOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Select defaultValue="" name="estimatedTicket">
              <option value="">Faixa de investimento</option>
              {estimatedTicketOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select defaultValue="" name="urgency">
              <option value="">Urgencia</option>
              {urgencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Input defaultValue="manual" name="source" placeholder="Origem" />
            <Input name="objective" placeholder="Objetivo" />
            <Select defaultValue="NEW" name="status">
              {leadStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Input name="tags" placeholder="Tags separadas por virgula" />
            <Textarea name="notes" placeholder="Observacoes internas" />
            <Button type="submit">Salvar lead</Button>
          </form>
        </Card>

        <PageSection title="Pipeline" description="Leitura por calor comercial, SLA e roteamento do atendimento.">
          <div className="flex flex-wrap gap-3">
            <FilterLink active={activeView === "heat"} href="/admin/leads?view=heat" label={`Heatmap (${rankedLeads.length})`} />
            <FilterLink
              active={activeView === "high-intent"}
              href="/admin/leads?view=high-intent"
              label={`High-intent (${highIntentCount})`}
            />
            <FilterLink
              active={activeView === "sla"}
              href="/admin/leads?view=sla"
              label={`SLA critico (${criticalSlaCount})`}
            />
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Lead</TableHeaderCell>
                    <TableHeaderCell>Score</TableHeaderCell>
                    <TableHeaderCell>SLA</TableHeaderCell>
                    <TableHeaderCell>Responsavel</TableHeaderCell>
                    <TableHeaderCell>Origem</TableHeaderCell>
                    <TableHeaderCell>Entrada</TableHeaderCell>
                    <TableHeaderCell className="text-right">Acoes</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leads.map(({ lead, assessment }) => {
                    const sla = assessLeadSla(lead, automationSettings);
                    const scoreTone = assessment.isHighIntent ? "warning" : assessment.priorityLabel === "Media prioridade" ? "neutral" : "success";
                    const slaTone = sla.status === "overdue" ? "warning" : sla.status === "due-soon" ? "neutral" : "success";

                    return (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <p className="font-medium text-ink-950">{lead.name}</p>
                          <p className="text-xs text-ink-950/55">{lead.email}</p>
                          {lead.serviceInterest || lead.estimatedTicket ? (
                            <p className="mt-1 text-xs text-ink-950/55">
                              {[
                                lead.serviceInterest,
                                lead.contactPreference,
                                lead.estimatedTicket ? formatCurrency(lead.estimatedTicket) : null,
                              ]
                                .filter(Boolean)
                                .join(" | ")}
                            </p>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <Badge tone={scoreTone}>
                            {assessment.score} | {assessment.priorityLabel}
                          </Badge>
                          <p className="mt-2 text-xs text-ink-950/55">{lead.status.replaceAll("_", " ")}</p>
                        </TableCell>
                        <TableCell>
                          <Badge tone={slaTone}>{sla.label}</Badge>
                          <p className="mt-2 text-xs text-ink-950/55">{formatRelativeHoursFromNow(sla.dueAt)}</p>
                        </TableCell>
                        <TableCell>{lead.ownerName ?? "Nao atribuido"}</TableCell>
                        <TableCell>
                          <p>{lead.source}</p>
                          {lead.utmSource || lead.utmCampaign ? (
                            <p className="text-xs text-ink-950/55">
                              {[lead.utmSource, lead.utmCampaign].filter(Boolean).join(" / ")}
                            </p>
                          ) : null}
                        </TableCell>
                        <TableCell>{formatDate(lead.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/leads/${lead.id}`}>
                              <Button size="sm" variant="secondary">
                                Editar
                              </Button>
                            </Link>
                            {lead.status !== "WON" ? (
                              <form action={convertLeadToClientAction}>
                                <input name="id" type="hidden" value={lead.id} />
                                <Button size="sm" type="submit" variant="secondary">
                                  Converter
                                </Button>
                              </form>
                            ) : null}
                            <form action={deleteLeadAction}>
                              <input name="id" type="hidden" value={lead.id} />
                              <Button size="sm" type="submit" variant="ghost">
                                Excluir
                              </Button>
                            </form>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </PageSection>
      </div>
    </AdminShell>
  );
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link href={href}>
      <span
        className={`inline-flex rounded-full border px-4 py-2 text-sm transition ${
          active
            ? "border-ink-950/16 bg-ink-950 text-white"
            : "border-ink-950/10 bg-white text-ink-950/70 hover:border-ink-950/18"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

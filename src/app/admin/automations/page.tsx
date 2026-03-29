import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageToast } from "@/components/ui/page-toast";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { messageChannelOptions } from "@/lib/navigation";
import { requireAdminUser } from "@/modules/auth/guards";
import { runAutomationCycleAction, updateAutomationSettingsAction } from "@/modules/automation-config/actions";
import { getResolvedAutomationSummary } from "@/modules/automation-config/repository";

type AutomationsPageQuery = {
  success?: string;
};

export default async function AutomationsPage({
  searchParams,
}: {
  searchParams?: Promise<AutomationsPageQuery>;
}) {
  await requireAdminUser();
  const [{ settings, highIntentThreshold, followUpWindowDays, internalRecipientsCount, slaWindows }, query] =
    await Promise.all([getResolvedAutomationSummary(), searchParams]);

  return (
    <AdminShell
      title="Automações"
      description="Ajuste o que o sistema considera lead quente, quando cobrar resposta do time e qual cadência usar para follow-ups internos."
    >
      <PageToast
        message={
          query?.success === "saved"
            ? "Regras de automação atualizadas com sucesso."
            : query?.success === "cycle"
              ? "Ciclo assíncrono executado manualmente."
              : undefined
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Threshold high-intent" value={`${highIntentThreshold} pts`} />
        <SummaryCard label="Reforco do lead" value={`${settings.leadReminderDelayHours}h`} />
        <SummaryCard label="Follow-up de proposta" value={`${followUpWindowDays} dias`} />
        <SummaryCard label="Destinatarios internos" value={String(internalRecipientsCount)} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Motor de regras</p>
          <h2 className="mt-2 font-display text-2xl text-ink-950">Parâmetros da operação</h2>
          <form action={updateAutomationSettingsAction} className="mt-6 grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                defaultValue={settings.highIntentThreshold.toString()}
                min="20"
                max="100"
                name="highIntentThreshold"
                placeholder="Threshold high-intent"
                type="number"
              />
              <Input
                defaultValue={settings.leadReminderDelayHours.toString()}
                min="1"
                max="120"
                name="leadReminderDelayHours"
                placeholder="Após quantas horas reforçar"
                type="number"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                defaultValue={settings.leadSlaImmediateHours.toString()}
                min="1"
                max="72"
                name="leadSlaImmediateHours"
                placeholder="SLA urgencia imediata"
                type="number"
              />
              <Input
                defaultValue={settings.leadSlaThirtyDaysHours.toString()}
                min="1"
                max="120"
                name="leadSlaThirtyDaysHours"
                placeholder="SLA 30 dias"
                type="number"
              />
              <Input
                defaultValue={settings.leadSlaSixtyToNinetyDaysHours.toString()}
                min="1"
                max="240"
                name="leadSlaSixtyToNinetyDaysHours"
                placeholder="SLA 60-90 dias"
                type="number"
              />
              <Input
                defaultValue={settings.leadSlaPlanningHours.toString()}
                min="1"
                max="240"
                name="leadSlaPlanningHours"
                placeholder="SLA planejamento"
                type="number"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                defaultValue={settings.leadSlaDefaultHours.toString()}
                min="1"
                max="240"
                name="leadSlaDefaultHours"
                placeholder="SLA padrao"
                type="number"
              />
              <Input
                defaultValue={settings.proposalFollowUpAfterDays.toString()}
                min="1"
                max="30"
                name="proposalFollowUpAfterDays"
                placeholder="Dias para follow-up"
                type="number"
              />
            </div>

            <Select defaultValue={settings.proposalFollowUpChannel} name="proposalFollowUpChannel">
              {messageChannelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Textarea
              defaultValue={settings.internalAlertRecipients}
              name="internalAlertRecipients"
              placeholder="Emails internos separados por virgula"
            />

            <SubmitButton>Salvar regras de automação</SubmitButton>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">SLA vigente</p>
            <h2 className="mt-2 font-display text-2xl text-ink-950">Janelas de atendimento</h2>
            <div className="mt-6 space-y-3">
              {slaWindows.map((window) => (
                <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={window.label}>
                  <p className="text-sm font-medium text-ink-950">{window.label}</p>
                  <p className="mt-1 text-sm text-ink-950/62">Resposta esperada em ate {window.hours}h.</p>
                </div>
              ))}
            </div>
            <form action={runAutomationCycleAction} className="mt-5">
              <Button type="submit" variant="secondary">
                Executar ciclo agora
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Cobertura</p>
            <h2 className="mt-2 font-display text-2xl text-ink-950">O que muda no sistema</h2>
            <div className="mt-6 space-y-3 text-sm leading-7 text-ink-950/66">
              <p>Leads acima do threshold entram no heatmap prioritário, recebem dono e podem gerar tarefa automática.</p>
              <p>Se o lead quente ficar parado além do combinado, o inbox interno abre alerta de reforço.</p>
              <p>Propostas sem resposta entram em modo de follow-up automático com rascunho pronto para o time revisar.</p>
              <p>Os mesmos parâmetros aparecem no pipeline, nas notificações e na leitura executiva do dashboard.</p>
            </div>
          </Card>
        </div>
      </div>
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

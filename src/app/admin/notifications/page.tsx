import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/formatters";
import { getNotificationsSummary } from "@/modules/notifications/service";

function getBadgeTone(severity: "info" | "warning" | "critical" | "success") {
  if (severity === "critical") {
    return "warning" as const;
  }

  if (severity === "success") {
    return "success" as const;
  }

  return "neutral" as const;
}

export default async function NotificationsPage() {
  const summary = await getNotificationsSummary();

  return (
    <AdminShell
      title="Notificações"
      description="Inbox operacional com alertas de SLA, propostas paradas, falhas de envio e sinais de prioridade comercial."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950/45">Inbox total</p>
          <p className="mt-3 font-display text-3xl text-ink-950">{summary.total}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950/45">Críticos</p>
          <p className="mt-3 font-display text-3xl text-ink-950">{summary.critical}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950/45">Atenção</p>
          <p className="mt-3 font-display text-3xl text-ink-950">{summary.warning}</p>
        </Card>
      </section>

      <section>
        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Inbox operacional</p>
              <h2 className="mt-2 font-display text-2xl text-ink-950">Itens que pedem ação do time</h2>
            </div>
            <Link href="/admin/reports">
              <Button size="sm" variant="secondary">
                Ver relatórios
              </Button>
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {summary.items.length ? (
              summary.items.map((item) => (
                <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={item.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink-950">{item.title}</p>
                      <p className="mt-2 max-w-3xl text-sm text-ink-950/66">{item.description}</p>
                    </div>
                    <Badge tone={getBadgeTone(item.severity)}>{item.severity.toUpperCase()}</Badge>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-ink-950/45">
                    <span>{item.category}</span>
                    <span>{formatDateTime(item.createdAt)}</span>
                  </div>

                  {item.href ? (
                    <div className="mt-4">
                      <Link href={item.href}>
                        <Button size="sm" variant="secondary">
                          Abrir item
                        </Button>
                      </Link>
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-[22px] bg-white p-5 text-sm text-ink-950/62 ring-1 ring-ink-950/6">
                Nenhum alerta pendente no momento. O monitor operacional continua rodando normalmente.
              </div>
            )}
          </div>
        </Card>
      </section>
    </AdminShell>
  );
}

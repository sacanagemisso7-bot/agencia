import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/formatters";
import { requireAdminUser } from "@/modules/auth/guards";
import { listActivityLogs } from "@/modules/logs/repository";

export default async function LogsPage() {
  await requireAdminUser();
  const logs = await listActivityLogs();

  return (
    <AdminShell title="Logs e auditoria" description="Tudo o que foi alterado, quando foi alterado e por quem passou pelo painel ou pela IA.">
      <Card className="p-6">
        <div className="space-y-4">
          {logs.map((log) => (
            <div className="rounded-[22px] bg-white p-5 ring-1 ring-ink-950/6" key={log.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-medium text-ink-950">{log.description}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-ink-950/45">{formatDateTime(log.createdAt)}</p>
              </div>
              <p className="mt-2 text-sm text-ink-950/65">
                {log.action} • {log.entityType} • {log.actorName ?? "Sistema"}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </AdminShell>
  );
}

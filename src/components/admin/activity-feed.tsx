import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/formatters";
import type { ActivityRecord } from "@/lib/types";

export function ActivityFeed({ items }: { items: ActivityRecord[] }) {
  return (
    <Card className="p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/45 to-transparent" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600">Auditoria</p>
          <h2 className="mt-2 font-display text-[1.8rem] tracking-[-0.04em] text-ink-950">Atividades recentes</h2>
        </div>
      </div>
      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <div className="border-l border-ink-950/10 pl-4" key={item.id}>
            <p className="text-sm font-medium text-ink-950">{item.description}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-ink-950/45">
              {item.action} | {item.actorName ?? "Sistema"} | {formatDateTime(item.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

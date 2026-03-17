import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/formatters";
import type { ActivityRecord } from "@/lib/types";

export function ActivityFeed({ items }: { items: ActivityRecord[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Auditoria</p>
          <h2 className="mt-2 font-display text-2xl text-ink-950">Atividades recentes</h2>
        </div>
      </div>
      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <div className="border-l border-ink-950/10 pl-4" key={item.id}>
            <p className="text-sm font-medium text-ink-950">{item.description}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-ink-950/45">
              {item.action} • {item.actorName ?? "Sistema"} • {formatDateTime(item.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}


import Link from "next/link";
import { Bot, Clock3, FileStack, FolderKanban, MessageSquareText, Paperclip, Sparkles, Target } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/formatters";
import type { TimelineItem } from "@/lib/types";

const iconMap = {
  activity: Clock3,
  message: MessageSquareText,
  proposal: FileStack,
  task: FolderKanban,
  attachment: Paperclip,
  ai: Sparkles,
  campaign: Target,
} satisfies Record<TimelineItem["kind"], typeof Bot>;

export function TimelineFeed({
  title,
  description,
  items,
  emptyMessage,
  showLinks = true,
}: {
  title: string;
  description: string;
  items: TimelineItem[];
  emptyMessage: string;
  showLinks?: boolean;
}) {
  return (
    <Card className="p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Timeline</p>
        <h2 className="mt-2 font-display text-2xl text-ink-950">{title}</h2>
        <p className="mt-2 text-sm text-ink-950/62">{description}</p>
      </div>

      <div className="mt-6 space-y-4">
        {items.length ? (
          items.map((item) => {
            const Icon = iconMap[item.kind];
            const content = (
              <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6 transition hover:ring-ink-950/12">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-ink-950/5 p-3 text-ink-950">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-ink-950">{item.title}</p>
                      {item.status ? (
                        <span className="rounded-full bg-ink-950/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-950/65">
                          {item.status}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-ink-950/66">{item.description}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-ink-950/42">
                      {[item.meta, formatDateTime(item.createdAt)].filter(Boolean).join(" | ")}
                    </p>
                  </div>
                </div>
              </div>
            );

            if (showLinks && item.href) {
              return (
                <Link href={item.href} key={item.id}>
                  {content}
                </Link>
              );
            }

            return <div key={item.id}>{content}</div>;
          })
        ) : (
          <p className="rounded-[22px] bg-white p-4 text-sm text-ink-950/55 ring-1 ring-ink-950/6">{emptyMessage}</p>
        )}
      </div>
    </Card>
  );
}

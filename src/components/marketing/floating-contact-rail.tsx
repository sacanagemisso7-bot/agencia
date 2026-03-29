"use client";

import { CalendarDays, MessageCircleMore, Send } from "lucide-react";
import Link from "next/link";

import { useMarketingTheme } from "@/components/platform/marketing-theme-provider";
import { buildCalendarEmbedUrl, toWhatsAppHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

const items = [
  {
    label: "WhatsApp",
    icon: MessageCircleMore,
    getHref: (whatsapp: string) => toWhatsAppHref(whatsapp),
  },
  {
    label: "Agendar",
    icon: CalendarDays,
    getHref: (...args: [string, string]) => buildCalendarEmbedUrl(args[1]) || "/contato#agenda",
  },
  {
    label: "Diagnóstico",
    icon: Send,
    getHref: () => "/contato",
  },
] as const;

export function FloatingContactRail({
  whatsapp,
  calendarUrl,
}: {
  whatsapp: string;
  calendarUrl: string;
}) {
  const { effectiveTheme } = useMarketingTheme();
  const light = effectiveTheme === "light";

  return (
    <>
      <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
        {items.map((item) => (
          <Link
            className={cn(
              "group premium-outline premium-panel flex items-center gap-3 rounded-full px-4 py-3 text-sm transition hover:-translate-x-1",
              light ? "text-emerald-950/72 hover:border-emerald-500/20 hover:text-emerald-950" : "text-mist-100/72 hover:border-jade-300/30 hover:text-white",
            )}
            href={item.getHref(whatsapp, calendarUrl)}
            key={item.label}
            rel="noreferrer"
            target={item.label === "Diagnóstico" ? undefined : "_blank"}
          >
            <span className={cn(
              "flex size-10 items-center justify-center rounded-full border transition",
              light
                ? "border-emerald-700/10 bg-white/76 text-emerald-700 group-hover:bg-emerald-500/10"
                : "border-mist-100/12 bg-[linear-gradient(180deg,rgba(12,23,43,0.92),rgba(8,15,30,0.92))] text-jade-300 group-hover:bg-jade-300/12",
            )}>
              <item.icon className="size-4" />
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="fixed inset-x-4 bottom-4 z-40 xl:hidden">
        <div className="premium-outline premium-panel grid grid-cols-3 gap-2 rounded-[24px] p-2">
          {items.map((item) => (
            <Link
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-[18px] px-3 py-3 text-xs font-medium transition",
                light
                  ? "text-emerald-950/72 hover:bg-emerald-500/8 hover:text-emerald-950"
                  : "text-mist-100/72 hover:bg-white/[0.05] hover:text-white",
              )}
              href={item.getHref(whatsapp, calendarUrl)}
              key={item.label}
              rel="noreferrer"
              target={item.label === "Diagnóstico" ? undefined : "_blank"}
            >
              <item.icon className={cn("size-4", light ? "text-emerald-700" : "text-jade-300")} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

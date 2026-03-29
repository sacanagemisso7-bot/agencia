import Link from "next/link";
import { CalendarDays, Clock3, MessageCircleMore } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildCalendarEmbedUrl, toWhatsAppHref } from "@/lib/contact";

export function SchedulingEmbedSection({
  title = "Agende uma conversa estrategica sem esperar retorno manual.",
  description = "Se o seu momento pede velocidade, voce pode reservar um horario direto na agenda da equipe e entrar na fila de atendimento com contexto comercial.",
  calendarUrl,
  calendarEmbedUrl,
  whatsapp,
}: {
  title?: string;
  description?: string;
  calendarUrl: string;
  calendarEmbedUrl: string;
  whatsapp: string;
}) {
  const embedUrl = buildCalendarEmbedUrl(calendarEmbedUrl || calendarUrl);
  const openUrl = buildCalendarEmbedUrl(calendarUrl);

  return (
    <section className="container-shell py-16 sm:py-20" id="agenda">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-jade-300">Agenda</p>
          <h2 className="font-display text-4xl text-white sm:text-5xl">{title}</h2>
          <p className="max-w-2xl text-base leading-8 text-mist-100/60">{description}</p>

          <div className="grid gap-4">
            {[
              {
                icon: Clock3,
                title: "Fila comercial organizada",
                text: "Leads que pedem reuniao entram com prioridade e contexto no admin da agencia.",
              },
              {
                icon: CalendarDays,
                title: "Agendamento imediato",
                text: "A conversa pode ser marcada direto pela agenda embutida, sem depender de troca manual de mensagens.",
              },
              {
                icon: MessageCircleMore,
                title: "Canal alternativo rapido",
                text: "Se preferir, o mesmo fluxo pode ser acelerado por WhatsApp com a equipe.",
              },
            ].map((item) => (
              <div className="rounded-[24px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] p-5" key={item.title}>
                <item.icon className="size-5 text-jade-300" />
                <p className="mt-4 text-base font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-mist-100/58">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={openUrl || "/contato#agenda"} rel="noreferrer" target={openUrl ? "_blank" : undefined}>
              <Button className="border border-white/10 bg-[linear-gradient(135deg,#30E2BC,#8FB6FF)] text-ink-950 hover:brightness-105" size="lg">
                Abrir agenda em nova aba
              </Button>
            </Link>
            <Link href={toWhatsAppHref(whatsapp)} rel="noreferrer" target="_blank">
              <Button className="border border-mist-100/10 bg-[linear-gradient(180deg,rgba(12,23,43,0.92),rgba(8,15,30,0.92))] text-white hover:bg-[linear-gradient(180deg,rgba(15,28,49,0.96),rgba(8,16,32,0.94))]" size="lg">
                Falar no WhatsApp
              </Button>
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-[34px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
          {embedUrl ? (
            <iframe
              className="min-h-[760px] w-full rounded-[28px] bg-[#060b14]"
              src={embedUrl}
              title="Agenda Ameni"
            />
          ) : (
            <div className="flex min-h-[540px] items-center justify-center rounded-[28px] border border-dashed border-mist-100/12 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.92))] p-8 text-center text-sm leading-7 text-mist-100/58">
              Configure `calendarUrl` ou `calendarEmbedUrl` no CMS para embutir a agenda aqui.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

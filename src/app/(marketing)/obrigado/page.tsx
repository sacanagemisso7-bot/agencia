import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, MessageCircleMore, ShieldCheck } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { SchedulingEmbedSection } from "@/components/marketing/scheduling-embed-section";
import { Button } from "@/components/ui/button";
import { buildNoIndexMetadata } from "@/lib/seo";
import { getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildNoIndexMetadata(
  "Obrigado | Ameni",
  "Confirmacao de envio do diagnostico solicitado no site.",
);

export default async function ObrigadoPage({
  searchParams,
}: {
  searchParams?: Promise<{ service?: string; contactPreference?: string }>;
}) {
  const query = await searchParams;
  const content = await getSiteContent();

  return (
    <main>
      <PageHero
        aside="Seu pedido entrou no CRM da agencia com contexto comercial, interesse de servico, atribuicao de origem e uma resposta automatica registrada no historico."
        description="Recebemos seu contato. Agora o proximo passo e analisar o momento da marca e devolver uma direcao inicial clara."
        eyebrow="Obrigado"
        title="Diagnostico solicitado com sucesso."
      />

      <section className="container-shell py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.05] to-emerald-400/10 p-7 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">O que acontece agora</p>
            <div className="mt-6 grid gap-4">
              {[
                {
                  title: "Leitura estrategica inicial",
                  description: "Avaliamos objetivo, interesse de servico, urgencia e contexto do negocio antes do primeiro retorno.",
                  icon: ShieldCheck,
                },
                {
                  title: "Contato consultivo",
                  description: "Voce tambem recebe um email de confirmacao com o resumo do fluxo e nossos canais para acelerar a conversa.",
                  icon: MessageCircleMore,
                },
                {
                  title: "Proximo passo comercial",
                  description: "Se fizer sentido, agendamos a conversa para aprofundar diagnostico, escopo e plano de crescimento.",
                  icon: CalendarDays,
                },
              ].map((item) => (
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-5" key={item.title}>
                  <item.icon className="size-5 text-emerald-300" />
                  <h2 className="mt-4 text-lg font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/62">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Resumo do pedido</p>
              <h2 className="mt-4 font-display text-3xl text-white">Contexto registrado</h2>
              <p className="mt-4 text-sm leading-7 text-white/62">
                {query?.service
                  ? `Interesse principal: ${query.service}.`
                  : "Seu contato foi registrado para um diagnostico comercial e estrategico."}{" "}
                {query?.contactPreference
                  ? `Canal preferido: ${query.contactPreference}. `
                  : ""}
                Se o email informado estiver correto, voce tambem deve receber uma confirmacao automatica da agencia.
              </p>
              <div className="mt-6 space-y-3 text-sm text-white/72">
                <p>{content.settings.email}</p>
                <p>{content.settings.whatsapp}</p>
              </div>
            </div>

            <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">Enquanto isso</p>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/cases">
                  <Button className="w-full border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]" size="lg">
                    Ver cases
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="/insights">
                  <Button className="w-full border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]" size="lg">
                    Explorar insights
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SchedulingEmbedSection
        calendarEmbedUrl={content.settings.calendarEmbedUrl}
        calendarUrl={content.settings.calendarUrl}
        description="Se voce prefere acelerar, pode sair desta pagina com um horario reservado. O lead ja foi registrado e a agenda entra como proximo passo opcional."
        title="Quer encurtar o caminho e ja marcar a conversa?"
        whatsapp={content.settings.whatsapp}
      />
    </main>
  );
}


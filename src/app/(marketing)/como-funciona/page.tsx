import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, ClipboardList, FileText, MessageCircleMore } from "lucide-react";

import { CTASection } from "@/components/marketing/cta-section";
import { PageHero } from "@/components/marketing/page-hero";
import { SchedulingEmbedSection } from "@/components/marketing/scheduling-embed-section";
import { StructuredData } from "@/components/marketing/structured-data";
import { Button } from "@/components/ui/button";
import { buildPageMetadata, getAbsoluteUrl, getSiteName } from "@/lib/seo";
import { getSiteContent } from "@/modules/site-content/repository";

export const metadata: Metadata = buildPageMetadata({
  title: "Como Funciona | Ameni",
  description:
    "Entenda o fluxo comercial da Ameni, do diagnóstico inicial à proposta, onboarding e execução full-service.",
  path: "/como-funciona",
});

const steps = [
  {
    label: "01",
    title: "Diagnóstico qualificado",
    description: "Você entra com contexto, ticket, objetivo, urgência e canal preferido. O lead já nasce qualificado no CRM.",
    icon: MessageCircleMore,
  },
  {
    label: "02",
    title: "Leitura estratégica",
    description: "Nossa equipe revisa ativos, posicionamento, oferta, canal e maturidade da operação para devolver uma leitura inicial.",
    icon: ClipboardList,
  },
  {
    label: "03",
    title: "Proposta comercial",
    description: "Quando existe fit, transformamos diagnóstico em proposta com escopo, entregáveis, ritmo de operação e investimento.",
    icon: FileText,
  },
  {
    label: "04",
    title: "Onboarding e execução",
    description: "Com aceite, a operação entra em onboarding, cronograma, backlog, campanhas, conteúdo e acompanhamento executivo.",
    icon: CalendarDays,
  },
];

export default async function ComoFuncionaPage() {
  const content = await getSiteContent();

  return (
    <main>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: `${getSiteName()} | Como funciona`,
          url: getAbsoluteUrl("/como-funciona"),
          description:
            "Fluxo comercial e operacional de uma agência full-service premium, do diagnóstico inicial à proposta, onboarding e execução.",
        }}
        id="commercial-process-schema"
      />

      <PageHero
        aside="Essa página existe para marcas que ainda não querem preencher o formulário agora, mas precisam entender como a agência trabalha, como a proposta nasce e o que acontece depois do primeiro contato."
        description="Mostramos com transparência como conduzimos o caminho entre diagnóstico, proposta, aceite e operação para que a relação comercial comece com clareza."
        eyebrow="Como funciona"
        title="Do primeiro contato a uma operação full-service bem organizada."
      />

      <section className="container-shell py-12 sm:py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <article className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6" key={step.label}>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">{step.label}</span>
                <step.icon className="size-5 text-emerald-300" />
              </div>
              <h2 className="mt-5 font-display text-3xl text-white">{step.title}</h2>
              <p className="mt-4 text-sm leading-7 text-white/62">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.05] to-emerald-400/10 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Proposta comercial</p>
            <h2 className="mt-5 font-display text-4xl text-white">Quando faz sentido avançar, a proposta nasce do diagnóstico.</h2>
            <p className="mt-5 text-sm leading-8 text-white/66">
              Não trabalhamos com pacote genérico. A proposta nasce da leitura de contexto, da maturidade da operação,
              dos gargalos comerciais e da combinação de frentes que pode mover resultado com mais eficiência.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              "Escopo por frente: performance, orgânico, social, vídeo, web e branding.",
              "Entregáveis e cadência: o que acontece nas primeiras semanas e no ritmo recorrente.",
              "Modelo operacional: rituais, acompanhamento, backlog e leitura executiva.",
              "Investimento e prioridade: o que entra primeiro para destravar resultado mais rápido.",
            ].map((item) => (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/64" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SchedulingEmbedSection
        calendarEmbedUrl={content.settings.calendarEmbedUrl}
        calendarUrl={content.settings.calendarUrl}
        description="Se preferir pular a troca inicial de mensagens, você pode reservar um horário direto na agenda comercial da agência."
        title="Quer acelerar e já sair desta página com uma reunião marcada?"
        whatsapp={content.settings.whatsapp}
      />

      <section className="container-shell py-8 sm:py-10">
        <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">Alternativas</p>
          <h2 className="mt-4 font-display text-4xl text-white">Você pode escolher o ritmo mais confortável.</h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contato">
              <Button className="border border-emerald-300/18 bg-emerald-400 text-ink-950 hover:bg-emerald-300" size="lg">
                Preencher diagnóstico
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href={content.settings.calendarUrl || "/contato#agenda"} rel="noreferrer" target={content.settings.calendarUrl ? "_blank" : undefined}>
              <Button className="border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]" size="lg">
                Abrir agenda
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        description="Podemos começar por diagnóstico, por agenda direta ou por uma conversa de contexto. O importante é iniciar com clareza."
        title="Quer entender qual seria o melhor primeiro passo para a sua marca?"
      />
    </main>
  );
}


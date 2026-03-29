import type { Metadata } from "next";
import { Compass, Gem, Layers3, Rocket } from "lucide-react";

import { CTASection } from "@/components/marketing/cta-section";
import { PageHero } from "@/components/marketing/page-hero";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sobre | Ameni",
  description:
    "Conheca a visao, o metodo e o posicionamento da Ameni como agencia premium de growth, marca e performance.",
  path: "/sobre",
});

const aboutCards = [
  {
    title: "Visao",
    description:
      "Construir marcas que crescem com performance sem abrir mao de percepcao premium, narrativa forte e estrutura de longo prazo.",
    icon: Compass,
  },
  {
    title: "Metodo",
    description:
      "Diagnostico, estrategia, criacao, execucao e otimizacao em um ciclo unico. O objetivo e reduzir ruido e acelerar decisao.",
    icon: Layers3,
  },
  {
    title: "Criterio criativo",
    description:
      "Estetica importa, mas so quando sustenta valor percebido, clareza de mensagem e resposta comercial. Criatividade aqui tem funcao.",
    icon: Gem,
  },
  {
    title: "Ambicao",
    description:
      "Ajudar empresas a parecerem mais fortes, venderem melhor e construirem ativos digitais que suportem a proxima fase do negocio.",
    icon: Rocket,
  },
];

export default function SobrePage() {
  return (
    <main>
      <PageHero
        aside="Acreditamos que marcas premium crescem quando estrategia, conteudo, execucao e experiencia digital trabalham na mesma direcao."
        description="Somos uma agencia orientada a resultado, com mentalidade de produto e execucao full-service para marcas que querem crescer com mais maturidade."
        eyebrow="Sobre"
        title="Uma agencia construida para unir growth, conteudo, marca e operacao em um mesmo nivel de excelencia."
      />

      <section className="container-shell py-16 sm:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {aboutCards.map((card) => (
            <article className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7" key={card.title}>
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/12 bg-black/20 text-emerald-300">
                <card.icon className="size-5" />
              </div>
              <h2 className="mt-5 font-display text-3xl text-white">{card.title}</h2>
              <p className="mt-4 text-sm leading-7 text-white/64">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.05] to-emerald-400/10 p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">Posicionamento</p>
          <h2 className="mt-5 max-w-4xl font-display text-4xl text-white sm:text-5xl">
            Crescimento com elegancia operacional, clareza comercial e sensibilidade de marca.
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/68">
            Nao entramos para ser apenas a agencia que executa pauta ou sobe campanha. Entramos para construir uma
            presenca digital mais forte, uma estrutura mais inteligente e uma maquina de crescimento mais segura.
          </p>
        </div>
      </section>

      <CTASection
        description="Se voce busca uma agencia que pense negocio, crescimento e marca de forma conectada, vamos conversar."
        title="Quer entender como isso se traduz no seu contexto?"
      />
    </main>
  );
}


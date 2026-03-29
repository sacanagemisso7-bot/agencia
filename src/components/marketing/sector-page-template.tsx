import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { CTASection } from "@/components/marketing/cta-section";
import { CaseCard } from "@/components/marketing/case-card";
import { ProcessSection } from "@/components/marketing/process-section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { SectorCard } from "@/components/marketing/sector-card";
import type { SectorPageViewModel } from "@/lib/sector-content";

export function SectorPageTemplate({
  sector,
  relatedSectors = [],
}: {
  sector: SectorPageViewModel;
  relatedSectors?: SectorPageViewModel[];
}) {
  return (
    <main>
      <section className="container-shell pt-16 pb-12 sm:pt-20 sm:pb-18">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-jade-300">Setores</p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl leading-tight text-white sm:text-6xl">
              {sector.heroTitle}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-mist-100/66">{sector.heroDescription}</p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/contato">
                <Button className="border border-white/10 bg-[linear-gradient(135deg,#30E2BC,#8FB6FF)] text-ink-950 hover:brightness-105" size="lg">
                  Solicitar diagnostico
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/setores">
                <Button className="border border-mist-100/10 bg-[linear-gradient(180deg,rgba(12,23,43,0.92),rgba(8,15,30,0.92))] text-white hover:bg-[linear-gradient(180deg,rgba(15,28,49,0.96),rgba(8,16,32,0.94))]" size="lg">
                  Ver outros setores
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-[34px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-jade-300">Onde entramos</p>
            <h2 className="mt-4 font-display text-3xl text-white">{sector.audience}</h2>
            <p className="mt-4 text-sm leading-7 text-mist-100/60">{sector.summary}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {sector.metrics.map((metric) => (
                <div className="rounded-[24px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] p-4" key={metric.label}>
                  <p className="font-display text-3xl text-white">{metric.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-mist-100/44">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-16 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <SectionHeading
            eyebrow="Gargalos comuns"
            title={`O que normalmente trava crescimento em ${sector.name.toLowerCase()}.`}
            description="Quando o mercado exige mais confianca, qualificacao ou narrativa, crescimento sem estrutura vira ruido."
            theme="dark"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {sector.painPoints.map((painPoint) => (
              <div className="rounded-[26px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] p-5" key={painPoint}>
                <CheckCircle2 className="size-5 text-jade-300" />
                <p className="mt-4 text-sm leading-7 text-mist-100/68">{painPoint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection
        description="Organizamos a operacao para conectar canal, narrativa, pagina, conteudo e comercial em um mesmo plano de crescimento."
        eyebrow="Playbook"
        steps={sector.playbook}
        title={`Como estruturamos uma operacao premium para ${sector.name.toLowerCase()}.`}
      />

      <section className="container-shell py-16 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[34px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-jade-300">Mix recomendado</p>
            <h2 className="mt-4 font-display text-3xl text-white">Frentes que tendem a mover mais resultado nesse setor.</h2>
            <div className="mt-6 grid gap-4">
              {sector.serviceMix.map((service) => (
                <Link
                  className="rounded-[24px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] p-5 transition hover:border-jade-300/26 hover:bg-[linear-gradient(180deg,rgba(12,23,43,0.94),rgba(8,15,30,0.92))]"
                  href={service.href}
                  key={service.label}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-medium text-white">{service.label}</h3>
                    <ArrowRight className="size-4 text-jade-300" />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-mist-100/60">{service.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-jade-300/16 bg-[linear-gradient(135deg,rgba(16,31,56,0.98),rgba(12,50,72,0.76))] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-jade-300">Por que funciona</p>
            <h2 className="mt-4 font-display text-3xl text-white">Uma estrutura pensada para proteger valor percebido e conversao.</h2>
            <div className="mt-6 grid gap-4">
              {sector.differentiators.map((item) => (
                <div className="rounded-[22px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] p-4" key={item}>
                  <p className="text-sm leading-7 text-mist-100/68">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-16 sm:py-18">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Casos e referencias"
            title={`Recortes estrategicos para ${sector.name.toLowerCase()}.`}
            description="Mesmo quando a operacao ainda esta no inicio, o desenho certo ja deixa claro quais sinais precisam se mover."
            theme="dark"
          />
          <div className="max-w-xl rounded-[28px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] p-6 text-sm leading-7 text-mist-100/60">
            Cada recorte abaixo mostra como combinamos captacao, narrativa, conteudo e estrutura digital conforme o
            contexto comercial do setor.
          </div>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-2">
          {sector.caseHighlights.map((item) => (
            <article className="rounded-[32px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] p-7" key={item.title}>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-jade-300">{item.companyLabel}</p>
                <span className="rounded-full border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-mist-100/50">
                  Blueprint
                </span>
              </div>
              <h3 className="mt-5 font-display text-3xl text-white">{item.title}</h3>
              <div className="mt-8 grid gap-4 text-sm leading-7 text-mist-100/66">
                <div className="rounded-[24px] border border-mist-100/8 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist-100/40">Desafio</p>
                  <p className="mt-3">{item.challenge}</p>
                </div>
                <div className="rounded-[24px] border border-mist-100/8 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist-100/40">Abordagem</p>
                  <p className="mt-3">{item.approach}</p>
                </div>
                <div className="rounded-[24px] border border-jade-300/16 bg-[linear-gradient(135deg,rgba(16,31,56,0.98),rgba(12,50,72,0.76))] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-jade-300">Impacto esperado</p>
                  <p className="mt-3 text-white/82">{item.result}</p>
                </div>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {item.metrics.map((metric) => (
                  <div className="rounded-[22px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] p-4" key={metric.label}>
                    <p className="font-display text-2xl text-white">{metric.value}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-mist-100/44">{metric.label}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        {sector.matchedCaseStudies.length ? (
          <div className="mt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mist-100/42">Cases da base</p>
            <div className="mt-5 grid gap-6 xl:grid-cols-2">
              {sector.matchedCaseStudies.map((caseStudy) => (
                <CaseCard caseStudy={caseStudy} key={caseStudy.id} />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {relatedSectors.length ? (
        <section className="container-shell py-16 sm:py-18">
          <SectionHeading
            eyebrow="Mais mercados"
            title="Outros segmentos em que a mesma disciplina de growth se aplica."
            description="Se o seu negocio tem outra configuracao comercial, ainda podemos adaptar a estrutura para o seu contexto."
            theme="dark"
          />
          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            {relatedSectors.map((relatedSector) => (
              <SectorCard key={relatedSector.slug} sector={relatedSector} />
            ))}
          </div>
        </section>
      ) : null}

      <CTASection
        defaultServiceInterest="Estrutura full-service"
        description={sector.ctaDescription}
        title={sector.ctaTitle}
      />
    </main>
  );
}

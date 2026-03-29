import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { CTASection } from "@/components/marketing/cta-section";
import { ProcessSection } from "@/components/marketing/process-section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { StructuredData } from "@/components/marketing/structured-data";
import { Button } from "@/components/ui/button";
import type { MarketingService } from "@/lib/marketing-content";
import { getAbsoluteUrl, getSiteName } from "@/lib/seo";

export function ServicePageTemplate({ service }: { service: MarketingService }) {
  return (
    <main>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: service.name,
          name: `${service.name} | ${getSiteName()}`,
          description: service.description,
          url: getAbsoluteUrl(`/${service.slug}`),
          provider: {
            "@type": "Organization",
            name: getSiteName(),
          },
        }}
        id={`service-schema-${service.slug}`}
      />
      <section className="container-shell pt-12 pb-14 sm:pt-16 sm:pb-18">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-jade-300">{service.category}</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[0.94] tracking-[-0.06em] text-white sm:text-6xl">
              {service.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-mist-100/66">{service.headline}</p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/contato">
                <Button className="rounded-full border border-white/10 bg-[linear-gradient(135deg,#30E2BC,#8FB6FF)] text-ink-950 hover:brightness-105" size="lg">
                  Solicitar proposta
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/servicos">
                <Button className="rounded-full border border-mist-100/10 bg-[linear-gradient(180deg,rgba(12,23,43,0.92),rgba(8,15,30,0.92))] text-white hover:bg-[linear-gradient(180deg,rgba(15,28,49,0.96),rgba(8,16,32,0.94))]" size="lg">
                  Ver todas as frentes
                </Button>
              </Link>
            </div>
          </div>

          <div className="premium-outline premium-panel rounded-[36px] p-6 lg:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mist-100/38">Visao executiva</p>
                <h2 className="mt-3 font-display text-3xl tracking-[-0.05em] text-white">{service.shortLabel}</h2>
              </div>
              <div className="flex size-14 items-center justify-center rounded-2xl border border-mist-100/10 bg-[linear-gradient(180deg,rgba(12,23,43,0.92),rgba(8,15,30,0.92))] text-jade-300">
                <service.icon className="size-6" />
              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-mist-100/60">{service.pageIntro}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {service.heroMetrics.map((metric) => (
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
            eyebrow="Beneficios"
            title="Uma entrega desenhada para mover percepcao, demanda e conversao."
            description={service.description}
            theme="dark"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {service.outcomes.map((outcome) => (
              <div className="rounded-[26px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] p-5" key={outcome}>
                <CheckCircle2 className="size-5 text-jade-300" />
                <p className="mt-4 text-sm leading-7 text-mist-100/68">{outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection
        description="Nosso processo conecta estrategia, criacao e melhoria continua para cada frente da operacao."
        eyebrow="Processo"
        steps={service.process}
        title={`Como conduzimos ${service.name.toLowerCase()} com criterio estrategico.`}
      />

      <section className="container-shell py-16 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[34px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-jade-300">Entregaveis</p>
            <div className="mt-6 grid gap-4">
              {service.deliverables.map((deliverable) => (
                <div className="rounded-[22px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] px-4 py-4 text-sm text-mist-100/68" key={deliverable}>
                  {deliverable}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-jade-300/16 bg-[linear-gradient(135deg,rgba(16,31,56,0.98),rgba(12,50,72,0.76))] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-jade-300">Onde isso aparece</p>
            <h3 className="mt-4 font-display text-3xl text-white">Aplicacao pratica no negocio</h3>
            <p className="mt-4 text-sm leading-7 text-mist-100/64">{service.benefit}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {service.proofPoints.map((proofPoint) => (
                <span
                  className="rounded-full border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.9),rgba(6,12,24,0.88))] px-3 py-1 text-xs uppercase tracking-[0.16em] text-mist-100/54"
                  key={proofPoint}
                >
                  {proofPoint}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection defaultServiceInterest={service.name} description={service.ctaDescription} title={service.ctaTitle} />
    </main>
  );
}

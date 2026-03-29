import Link from "next/link";
import { ArrowRight, MoveUpRight, Sparkles } from "lucide-react";

import { AmeniMark } from "@/components/branding/ameni-logo";
import { ScrollRevealSection } from "@/components/marketing/scroll-reveal-section";
import { Button } from "@/components/ui/button";
import {
  BRAND_SLOGAN,
  resolveHeroSubtitle,
  resolveHeroTitle,
  resolvePrimaryCta,
  resolveSecondaryCta,
} from "@/lib/brand";
import type { MarketingMetric, MarketingService } from "@/lib/marketing-content";
import type { SiteSettingsRecord } from "@/lib/types";

export function CinematicHero({
  settings,
  services,
  metrics,
}: {
  settings: SiteSettingsRecord;
  services: MarketingService[];
  metrics: MarketingMetric[];
}) {
  const signatureServices = services.slice(0, 6);
  const featuredServices = services.slice(0, 2);
  const heroTitle = resolveHeroTitle(settings.heroTitle);
  const heroSubtitle = resolveHeroSubtitle(settings.heroSubtitle);
  const primaryCta = resolvePrimaryCta(settings.primaryCta);
  const secondaryCta = resolveSecondaryCta(settings.secondaryCta);
  const usesBrandSlogan = heroTitle === BRAND_SLOGAN;

  return (
    <section className="container-shell relative pt-12 pb-14 sm:pt-16 sm:pb-20 lg:pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_8%_8%,rgba(48,226,188,0.2),transparent_0_28%),radial-gradient(circle_at_86%_10%,rgba(143,182,255,0.16),transparent_0_26%),radial-gradient(circle_at_52%_100%,rgba(27,49,91,0.32),transparent_0_38%)]" />
      <div className="relative grid gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
        <ScrollRevealSection className="max-w-3xl" variant="soft">
          <div className="inline-flex items-center gap-3 rounded-full border border-mist-100/12 bg-[linear-gradient(135deg,rgba(13,25,45,0.86),rgba(7,15,29,0.86))] px-4 py-2 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
            <AmeniMark className="h-5 w-auto" />
            <span className="text-[11px] uppercase tracking-[0.28em] text-mist-100/58">Ameni clarity system</span>
          </div>
          <div className="mt-7">
            <p className="text-sm uppercase tracking-[0.34em] text-mist-100/64">Clareza. Ritmo. Resultado.</p>
            <h1 className="mt-6 max-w-5xl text-wrap-balance font-display text-[3.6rem] leading-[0.9] tracking-[-0.06em] text-white sm:text-[4.8rem] lg:text-[5.7rem] xl:text-[6.5rem]">
              {usesBrandSlogan ? (
                <>
                  Amenize a complexidade
                  <span className="block bg-[linear-gradient(135deg,#30E2BC,#9AD8FF,#EEF8FF)] bg-clip-text font-editorial text-[1.04em] font-medium italic text-transparent">
                    potencialize seus resultados
                  </span>
                </>
              ) : (
                heroTitle
              )}
            </h1>
          </div>

          <p className="mt-7 max-w-2xl text-lg leading-9 text-mist-100/68 sm:text-xl">{heroSubtitle}</p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/contato">
              <Button
                className="rounded-full border border-white/10 bg-[linear-gradient(135deg,#30E2BC,#8FB6FF)] px-7 text-ink-950 shadow-[0_20px_44px_rgba(77,170,224,0.24)] transition hover:brightness-105"
                size="lg"
              >
                {primaryCta}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link
              href={settings.calendarUrl || "/contato#agenda"}
              rel={settings.calendarUrl ? "noreferrer" : undefined}
              target={settings.calendarUrl ? "_blank" : undefined}
            >
              <Button
                className="rounded-full border border-mist-100/12 bg-[linear-gradient(180deg,rgba(12,23,43,0.94),rgba(7,14,28,0.92))] px-7 text-white hover:bg-[linear-gradient(180deg,rgba(15,28,49,0.96),rgba(8,16,32,0.94))]"
                size="lg"
              >
                {secondaryCta}
                <MoveUpRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {signatureServices.map((service, index) => (
              <span
                className="rounded-full border border-mist-100/10 bg-[linear-gradient(180deg,rgba(12,23,43,0.8),rgba(8,15,29,0.78))] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-mist-100/60"
                key={service.slug}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                {service.shortLabel}
              </span>
            ))}
          </div>
        </ScrollRevealSection>

        <div className="grid gap-5 lg:pl-8">
          <ScrollRevealSection delay={120} variant="right">
            <div className="premium-outline premium-panel relative overflow-hidden rounded-[40px] p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mist-100/70 to-transparent" />
              <div className="absolute -left-24 top-1/2 size-56 -translate-y-1/2 rounded-full bg-emerald-400/12 blur-[110px]" />
              <div className="absolute right-0 top-0 size-44 rounded-full bg-jade-400/12 blur-[90px]" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-mist-100/38">Ameni method</p>
                  <h2 className="mt-4 max-w-md font-display text-4xl leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl">
                    Complexidade alta pede leitura clara, execucao coordenada e uma marca que organize a decisao.
                  </h2>
                </div>
                <div className="flex size-16 shrink-0 items-center justify-center rounded-[24px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(16,31,56,0.96),rgba(8,15,29,0.92))] p-3 shadow-[0_16px_38px_rgba(0,0,0,0.24)]">
                  <AmeniMark className="h-10 w-auto" navy="#8FB6FF" teal="#30E2BC" />
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {metrics.slice(0, 3).map((metric) => (
                  <div className="rounded-[24px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(8,15,30,0.9))] p-4" key={metric.label}>
                    <p className="font-display text-3xl tracking-[-0.05em] text-white">{metric.value}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-mist-100/40">{metric.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[28px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(12,24,44,0.92),rgba(7,15,29,0.94))] p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-jade-300/80">Brand premise</p>
                <p className="mt-4 text-2xl leading-[1.2] text-white">
                  Resultados consistentes nao pedem mais ruido. Pedem
                  <span className="font-editorial text-[1.16em] italic text-jade-300"> clareza</span>, coerencia e
                  uma operacao que simplifique o valor.
                </p>
              </div>
            </div>
          </ScrollRevealSection>

          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <ScrollRevealSection className="lg:translate-y-8" delay={220} variant="scale">
              <div className="premium-outline premium-panel rounded-[34px] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-mist-100/38">Brand clarity</p>
                    <p className="mt-3 max-w-md font-display text-3xl tracking-[-0.05em] text-white">
                      O site precisa simplificar a percepcao de valor antes da primeira reuniao.
                    </p>
                  </div>
                  <Sparkles className="hidden size-5 shrink-0 text-jade-300 sm:block" />
                </div>
              </div>
            </ScrollRevealSection>

            <ScrollRevealSection delay={280} variant="soft">
              <div className="grid gap-4">
                {featuredServices.map((service) => (
                  <Link
                    className="group rounded-[24px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(8,15,30,0.9))] p-5 transition duration-500 hover:-translate-y-1 hover:border-jade-300/24 hover:bg-[linear-gradient(180deg,rgba(13,25,45,0.96),rgba(8,16,31,0.92))]"
                    href={`/${service.slug}`}
                    key={service.slug}
                  >
                    <service.icon className="size-5 text-jade-300" />
                    <p className="mt-4 font-display text-2xl tracking-[-0.04em] text-white">{service.name}</p>
                    <p className="mt-2 text-sm leading-7 text-mist-100/56">{service.benefit}</p>
                  </Link>
                ))}
              </div>
            </ScrollRevealSection>
          </div>
        </div>
      </div>
    </section>
  );
}

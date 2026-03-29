"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  MoveUpRight,
  Orbit,
  Plus,
  Sparkles,
} from "lucide-react";

import { AmeniMark } from "@/components/branding/ameni-logo";
import { LeadCaptureForm } from "@/components/marketing/lead-capture-form";
import { useMarketingTheme } from "@/components/platform/marketing-theme-provider";
import {
  getBrandCompanyName,
  resolveHeroSubtitle,
  resolvePrimaryCta,
  resolveSecondaryCta,
} from "@/lib/brand";
import { getMarketingServices } from "@/lib/marketing-content";
import type {
  MarketingMetric,
  MarketingProcessStep,
} from "@/lib/marketing-content";
import type { SectorPageViewModel } from "@/lib/sector-content";
import type {
  CaseStudyRecord,
  FAQRecord,
  ServiceRecord,
  SiteSettingsRecord,
  TestimonialRecord,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type PointerState = {
  px: number;
  py: number;
  x: number;
  y: number;
};

export function ArtDirectedHomeExperience({
  settings,
  serviceRecords,
  metrics,
  steps,
  caseStudies,
  testimonials,
  faqs,
  sectors,
  logos,
}: {
  settings: SiteSettingsRecord;
  serviceRecords: ServiceRecord[];
  metrics: MarketingMetric[];
  steps: MarketingProcessStep[];
  caseStudies: CaseStudyRecord[];
  testimonials: TestimonialRecord[];
  faqs: FAQRecord[];
  sectors: SectorPageViewModel[];
  logos: string[];
}) {
  const [pointer, setPointer] = useState<PointerState>({
    px: 0,
    py: 0,
    x: 0.5,
    y: 0.5,
  });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const services = useMemo(() => getMarketingServices(serviceRecords), [serviceRecords]);
  const activeService = services[activeServiceIndex] ?? services[0];
  const activeCase = caseStudies[activeCaseIndex] ?? caseStudies[0];
  const activeCaseMetrics = Object.entries(activeCase?.metrics ?? {}).slice(0, 3);
  const leadTestimonial = testimonials[0];
  const topFaqs = faqs.slice(0, 3);
  const heroMetrics = metrics.slice(0, 3);
  const marqueeServices = useMemo(() => [...services, ...services, ...services], [services]);
  const { effectiveTheme } = useMarketingTheme();
  const light = effectiveTheme === "light";

  const onPointerMove = useCallback((event: PointerEvent) => {
    setCursorVisible(true);
    setPointer({
      px: event.clientX,
      py: event.clientY,
      x: event.clientX / window.innerWidth,
      y: event.clientY / window.innerHeight,
    });
  }, []);

  const onPointerOver = useCallback((event: Event) => {
    const target = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>("[data-cursor-label]") : null;
    setCursorLabel(target?.dataset.cursorLabel ?? "");
  }, []);

  const onPointerLeave = useCallback(() => {
    setCursorVisible(false);
    setCursorLabel("");
  }, []);

  const onScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver);
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [onPointerLeave, onPointerMove, onPointerOver]);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  if (!activeService || !activeCase) {
    return null;
  }

  const ActiveServiceIcon = activeService.icon;
  const heroParallax = {
    transform: `translate3d(${(pointer.x - 0.5) * 56}px, ${(pointer.y - 0.5) * 40 - scrollY * 0.03}px, 0)`,
  };
  const heroOrbit = {
    transform: `translate3d(${(pointer.x - 0.5) * -34}px, ${(pointer.y - 0.5) * -22 - scrollY * 0.04}px, 0) rotate(${scrollY * 0.02}deg)`,
  };
  const heroSubtitle = resolveHeroSubtitle(settings.heroSubtitle);
  const primaryCta = resolvePrimaryCta(settings.primaryCta);
  const secondaryCta = resolveSecondaryCta(settings.secondaryCta);
  const themeText = light ? "text-emerald-950" : "text-white";
  const themeMuted = light ? "text-emerald-950/64" : "text-mist-100/58";
  const themeMutedStrong = light ? "text-emerald-950/72" : "text-mist-100/72";
  const themeSubtle = light ? "text-emerald-950/42" : "text-mist-100/42";
  const themeSubtleSoft = light ? "text-emerald-950/48" : "text-mist-100/48";
  const themeRule = light ? "border-emerald-700/12" : "border-mist-100/10";
  const themeRuleSoft = light ? "border-emerald-700/10" : "border-mist-100/12";
  const themeAccent = light ? "text-emerald-700" : "text-jade-300";
  const themeIconBox = light
    ? "border border-emerald-700/10 bg-white/76 text-emerald-700"
    : "border border-mist-100/12 bg-ink-900/60 text-jade-300";
  const themePanel = light
    ? "border border-emerald-700/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(241,250,245,0.94))] shadow-[0_24px_80px_rgba(16,74,58,0.08)]"
    : "border border-mist-100/12 bg-[linear-gradient(180deg,rgba(10,20,39,0.94),rgba(4,10,22,0.9))]";
  const themePrimaryButton = light
    ? "border border-emerald-700/10 bg-[linear-gradient(135deg,#28C7A5,#7AE9D1)] text-emerald-950 shadow-[0_16px_36px_rgba(40,199,165,0.18)]"
    : "border border-white/10 bg-[linear-gradient(135deg,#30E2BC,#8FB6FF)] text-ink-950 shadow-[0_20px_44px_rgba(77,170,224,0.24)]";
  const themeSecondaryLink = light
    ? "border-b border-emerald-700/16 text-emerald-950/72 hover:border-emerald-700/42 hover:text-emerald-950"
    : "border-b border-mist-100/20 text-mist-100/74 hover:border-mist-100/60 hover:text-white";
  const themeChip = light
    ? "border border-emerald-700/10 bg-white/72 text-emerald-950/58"
    : "border border-mist-100/10 bg-ink-900/50 text-mist-100/58";
  const themeTag = light
    ? "border border-emerald-700/10 bg-white/74 text-emerald-950/50"
    : "border border-mist-100/10 text-mist-100/48";
  const themePassiveText = light ? "translate-x-0 text-emerald-950/42 hover:translate-x-3 hover:text-emerald-950/74" : "translate-x-0 text-white/42 hover:translate-x-3 hover:text-white/74";
  const themeCasePassiveText = light ? "translate-x-0 text-emerald-950/46 hover:translate-x-3 hover:text-emerald-950/78" : "translate-x-0 text-white/46 hover:translate-x-3 hover:text-white/78";
  const themeGhostText = light ? "text-emerald-950/[0.08]" : "text-white/[0.05]";
  const themeGradientText = light
    ? "bg-[linear-gradient(135deg,#17997D,#28C7A5,#1B315B)]"
    : "bg-[linear-gradient(135deg,#30E2BC,#9AD8FF,#EEF8FF)]";

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[90] hidden lg:block">
        <div
          className="ameni-home-cursor"
          data-active={cursorLabel ? "true" : "false"}
          style={{
            opacity: cursorVisible ? 1 : 0,
            transform: `translate3d(${pointer.px}px, ${pointer.py}px, 0) scale(${cursorLabel ? 1.08 : 1})`,
          }}
        >
          <span>{cursorLabel || "ameni"}</span>
        </div>
      </div>

      <section className="relative min-h-[100svh] overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="ameni-home-scanlines absolute inset-0 opacity-40" />
          <div className={cn(
            "absolute inset-0",
            light
              ? "bg-[radial-gradient(circle_at_18%_18%,rgba(40,199,165,0.18),transparent_0_20%),radial-gradient(circle_at_82%_16%,rgba(27,49,91,0.08),transparent_0_26%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(17,47,41,0.08))]"
              : "bg-[radial-gradient(circle_at_18%_18%,rgba(48,226,188,0.22),transparent_0_20%),radial-gradient(circle_at_82%_16%,rgba(143,182,255,0.2),transparent_0_26%),linear-gradient(180deg,rgba(4,10,22,0.02),rgba(4,10,22,0.72))]",
          )} />
          <div className={cn("absolute -left-[18rem] top-[18vh] h-[28rem] w-[28rem] rounded-full blur-[120px]", light ? "bg-emerald-400/14" : "bg-emerald-400/10")} style={heroParallax} />
          <div className={cn("absolute right-[-10rem] top-[10vh] h-[26rem] w-[26rem] rounded-full blur-[120px]", light ? "bg-emerald-500/10" : "bg-jade-300/14")} style={heroOrbit} />
          <div className={cn("absolute left-1/2 top-[18vh] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full border", light ? "border-emerald-700/10" : "border-mist-100/8")} style={heroOrbit} />
          <div className={cn("absolute left-1/2 top-[18vh] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full border", light ? "border-emerald-700/10" : "border-mist-100/8")} style={heroParallax} />
          <div className={cn("absolute inset-y-[12vh] left-[6vw] w-px bg-gradient-to-b from-transparent to-transparent", light ? "via-emerald-700/18" : "via-mist-100/20")} />
        </div>

        <div className="container-shell relative flex min-h-[calc(100svh-4rem)] flex-col justify-between">
          <div className="grid gap-14 pt-10 lg:grid-cols-[1.16fr_0.84fr] lg:pt-16">
            <div className="max-w-6xl">
              <div className={cn("ameni-home-rise inline-flex items-center gap-4 px-4 py-3 text-[10px] uppercase tracking-[0.42em] backdrop-blur-md", themeChip)}>
                <AmeniMark className="h-5 w-auto" />
                {getBrandCompanyName()}
              </div>

              <div className="mt-10 space-y-2">
                <p className={cn("ameni-home-rise text-[18vw] font-display leading-[0.82] tracking-[-0.1em] sm:text-[7rem] lg:text-[10rem]", themeText)} style={{ animationDelay: "80ms" }}>
                  AMENIZE
                </p>
                <p className={cn("ameni-home-rise ml-[8vw] max-w-[16ch] text-[clamp(1.3rem,3vw,2.2rem)] uppercase tracking-[0.2em]", themeMutedStrong)} style={{ animationDelay: "180ms" }}>
                  a complexidade
                </p>
                <p className={cn("ameni-home-rise bg-clip-text font-editorial text-[18vw] font-medium italic leading-[0.82] tracking-[-0.08em] text-transparent sm:text-[7rem] lg:text-[10rem]", themeGradientText)} style={{ animationDelay: "260ms" }}>
                  potencialize
                </p>
                <p className={cn("ameni-home-rise ml-auto max-w-[14ch] text-right text-[clamp(1.2rem,2.8vw,2rem)] uppercase tracking-[0.2em]", themeMutedStrong)} style={{ animationDelay: "340ms" }}>
                  seus resultados
                </p>
              </div>

              <div className="mt-10 grid gap-8 lg:grid-cols-[0.75fr_0.25fr]">
                <p className={cn("ameni-home-rise max-w-xl text-base leading-8 sm:text-lg", themeMuted)} style={{ animationDelay: "420ms" }}>
                  {heroSubtitle}
                </p>

                <div className="ameni-home-rise flex flex-col items-start gap-4 lg:items-end" style={{ animationDelay: "500ms" }}>
                  <Link
                    className={cn("group inline-flex items-center gap-3 px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] transition duration-500 hover:translate-x-1", themePrimaryButton)}
                    data-cursor-label="abrir"
                    href="/contato"
                  >
                    {primaryCta}
                    <ArrowRight className="size-4 transition duration-500 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    className={cn("inline-flex items-center gap-3 pb-2 text-sm uppercase tracking-[0.22em] transition", themeSecondaryLink)}
                    data-cursor-label="agenda"
                    href={settings.calendarUrl || "/contato#agenda"}
                    rel={settings.calendarUrl ? "noreferrer" : undefined}
                    target={settings.calendarUrl ? "_blank" : undefined}
                  >
                    {secondaryCta}
                    <MoveUpRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative lg:pt-20">
              <div className={cn("ameni-home-cut-a relative ml-auto p-6 backdrop-blur-xl sm:p-8", themePanel)}>
                <div className={cn(
                  "pointer-events-none absolute inset-0",
                  light
                    ? "bg-[radial-gradient(circle_at_100%_0%,rgba(40,199,165,0.12),transparent_0_24%),radial-gradient(circle_at_0%_100%,rgba(27,49,91,0.08),transparent_0_28%)]"
                    : "bg-[radial-gradient(circle_at_100%_0%,rgba(143,182,255,0.16),transparent_0_24%),radial-gradient(circle_at_0%_100%,rgba(48,226,188,0.12),transparent_0_28%)]",
                )} />
                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <p className={cn("text-[10px] uppercase tracking-[0.34em]", themeSubtle)}>visão executiva</p>
                    <Orbit className={cn("size-4", themeAccent)} />
                  </div>

                  <div className="mt-10 space-y-6">
                    {heroMetrics.map((metric, index) => (
                      <div
                        className={cn(
                          "border-t pt-5",
                          themeRule,
                          index === 1 ? "ml-10" : "",
                          index === 2 ? "ml-4" : "",
                        )}
                        key={metric.label}
                      >
                        <p className={cn("font-display text-[clamp(2.8rem,7vw,4.6rem)] leading-none tracking-[-0.08em]", themeText)}>
                          {metric.value}
                        </p>
                        <p className={cn("mt-3 max-w-[18ch] text-[11px] uppercase tracking-[0.24em]", themeSubtleSoft)}>
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className={cn("mt-10 max-w-[22ch] text-sm leading-7", themeMuted)}>
                    Tráfego. Conteúdo. Web. Marca. Uma direção.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={cn("ameni-home-marquee mt-12 border-y py-4", themeRule)}>
            <div className={cn("ameni-home-marquee-track flex items-center gap-12 whitespace-nowrap text-xs uppercase tracking-[0.4em]", themeSubtleSoft)}>
              {marqueeServices.map((service, index) => (
                <span className="inline-flex items-center gap-12" key={`${service.slug}-${index}`}>
                  <span>{service.shortLabel}</span>
                  <span className={cn("h-px w-12 bg-gradient-to-r from-transparent to-transparent", light ? "via-emerald-700/18" : "via-mist-100/22")} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell relative py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.52fr_1.48fr] lg:items-start">
          <div className="space-y-6">
            <p className={cn("text-[10px] uppercase tracking-[0.34em]", themeSubtle)}>não é pacote. é direção.</p>
            <p className={cn("max-w-xs text-sm leading-7", themeMuted)}>
              Menos ruído. Menos camada desnecessária. Mais leitura. Mais tração.
            </p>
          </div>

          <div>
            <p className={cn("text-[15vw] font-display leading-[0.84] tracking-[-0.1em] sm:text-[5.6rem] lg:text-[9rem]", themeText)}>
              Ruído out.
            </p>
            <p className="ameni-home-outline ml-[10vw] text-[14vw] font-display leading-[0.84] tracking-[-0.1em] sm:text-[5rem] lg:text-[8rem]">
              Clareza in.
            </p>

            <div className="mt-16 grid gap-4 lg:grid-cols-3">
              {metrics.map((metric, index) => (
                <div
                  className={cn(
                    "border-t pt-4",
                    themeRuleSoft,
                    index === 1 ? "lg:translate-y-10" : "",
                    index === 2 ? "lg:translate-y-4" : "",
                  )}
                  key={metric.label}
                >
                  <p className={cn("font-display text-[3rem] leading-none tracking-[-0.08em]", themeText)}>{metric.value}</p>
                  <p className={cn("mt-3 text-[11px] uppercase tracking-[0.22em]", themeSubtleSoft)}>{metric.label}</p>
                  {metric.detail ? <p className={cn("mt-4 max-w-[22ch] text-sm leading-7", light ? "text-emerald-950/58" : "text-mist-100/54")}>{metric.detail}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell relative py-24 sm:py-32" id="servicos">
        <div className="grid gap-16 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className={cn("text-[10px] uppercase tracking-[0.34em]", themeSubtle)}>frentes</p>
            <div className={cn("ameni-home-cut-b relative mt-8 overflow-hidden p-6 sm:p-8", themePanel)}>
              <div className={cn(
                "pointer-events-none absolute inset-0",
                light
                  ? "bg-[radial-gradient(circle_at_100%_0%,rgba(40,199,165,0.12),transparent_0_26%),radial-gradient(circle_at_0%_100%,rgba(27,49,91,0.08),transparent_0_30%)]"
                  : "bg-[radial-gradient(circle_at_100%_0%,rgba(143,182,255,0.18),transparent_0_26%),radial-gradient(circle_at_0%_100%,rgba(48,226,188,0.14),transparent_0_30%)]",
              )} />
              <div className={cn("pointer-events-none absolute right-[-6rem] top-[-6rem] font-display text-[10rem] leading-none tracking-[-0.08em]", themeGhostText)}>
                {activeService.shortLabel}
              </div>
              <div className="relative">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className={cn("text-[10px] uppercase tracking-[0.3em]", themeSubtle)}>0{activeServiceIndex + 1}</p>
                    <p className={cn("mt-4 max-w-[9ch] font-display text-5xl leading-[0.88] tracking-[-0.08em] sm:text-6xl", themeText)}>
                      {activeService.shortLabel}
                    </p>
                  </div>
                  <div className={cn("flex h-14 w-14 items-center justify-center", themeIconBox)}>
                    <ActiveServiceIcon className="size-6" />
                  </div>
                </div>

                <p className={cn("mt-8 max-w-sm font-display text-3xl leading-[0.96] tracking-[-0.05em]", themeText)}>
                  {activeService.name}
                </p>
                <p className={cn("mt-4 max-w-md text-sm leading-7", themeMuted)}>{activeService.benefit}</p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {activeService.proofPoints.slice(0, 4).map((proofPoint) => (
                    <span className={cn("px-3 py-2 text-[10px] uppercase tracking-[0.22em]", themeTag)} key={proofPoint}>
                      {proofPoint}
                    </span>
                  ))}
                </div>

                <Link
                  className={cn("mt-10 inline-flex items-center gap-3 text-sm uppercase tracking-[0.24em] transition hover:gap-5", themeAccent, light ? "hover:text-emerald-950" : "hover:text-white")}
                  data-cursor-label="servico"
                  href={`/${activeService.slug}`}
                >
                  Explorar serviço
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {services.map((service, index) => (
              <button
                className={cn(
                  "group w-full border-t py-5 text-left transition duration-500",
                  themeRule,
                  activeServiceIndex === index ? cn("translate-x-0", themeText) : themePassiveText,
                  index % 2 === 1 ? "lg:ml-12" : "",
                )}
                data-cursor-label="ativar"
                key={service.slug}
                onClick={() => setActiveServiceIndex(index)}
                onFocus={() => setActiveServiceIndex(index)}
                onMouseEnter={() => setActiveServiceIndex(index)}
                type="button"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className={cn("text-[10px] uppercase tracking-[0.3em]", light ? "text-emerald-950/34" : "text-mist-100/34")}>0{index + 1}</p>
                    <p className="mt-3 font-display text-[clamp(2rem,5vw,4.8rem)] leading-[0.9] tracking-[-0.08em]">
                      {service.name}
                    </p>
                  </div>
                  <p className={cn("mt-3 hidden max-w-[18ch] text-right text-[11px] uppercase tracking-[0.22em] lg:block", light ? "text-emerald-950/36" : "text-mist-100/36")}>
                    {service.category}
                  </p>
                </div>

                <div
                  className={cn(
                    "grid overflow-hidden transition-all duration-500",
                    activeServiceIndex === index ? "grid-rows-[1fr] pt-5 opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="min-h-0">
                    <div className="flex flex-wrap gap-3">
                      {service.outcomes.slice(0, 2).map((outcome) => (
                        <span className={cn("text-sm leading-7", themeMuted)} key={outcome}>
                          {outcome}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell relative py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="relative">
            <p className={cn("pointer-events-none absolute -top-10 left-0 font-display text-[18vw] leading-none tracking-[-0.12em] sm:text-[8rem] lg:text-[12rem]", themeGhostText)}>
              PROOF
            </p>
            <div className={cn("ameni-home-cut-c relative overflow-hidden p-7 sm:p-10", themePanel)}>
              <div className={cn(
                "pointer-events-none absolute inset-0",
                light
                  ? "bg-[radial-gradient(circle_at_86%_18%,rgba(40,199,165,0.12),transparent_0_24%),radial-gradient(circle_at_8%_100%,rgba(27,49,91,0.08),transparent_0_26%)]"
                  : "bg-[radial-gradient(circle_at_86%_18%,rgba(143,182,255,0.16),transparent_0_24%),radial-gradient(circle_at_8%_100%,rgba(48,226,188,0.14),transparent_0_26%)]",
              )} />
              <div className="relative">
                <p className={cn("text-[10px] uppercase tracking-[0.34em]", themeAccent)}>{activeCase.niche}</p>
                <h2 className={cn("mt-6 max-w-[13ch] font-display text-[clamp(2.6rem,5vw,5rem)] leading-[0.9] tracking-[-0.08em]", themeText)}>
                  {activeCase.title}
                </h2>
                <p className={cn("mt-8 max-w-[15ch] bg-clip-text font-editorial text-[clamp(2.2rem,5vw,4.4rem)] italic leading-[0.94] tracking-[-0.05em] text-transparent", themeGradientText)}>
                  {activeCase.result}
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {activeCaseMetrics.map(([label, value], index) => (
                    <div className={cn("border-t pt-4", themeRule, index === 1 ? "sm:translate-y-8" : "")} key={label}>
                      <p className={cn("font-display text-4xl leading-none tracking-[-0.08em]", themeText)}>{String(value)}</p>
                      <p className={cn("mt-3 text-[10px] uppercase tracking-[0.22em]", light ? "text-emerald-950/44" : "text-mist-100/44")}>
                        {label.replaceAll("_", " ")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                  <div>
                    <p className={cn("text-[10px] uppercase tracking-[0.22em]", light ? "text-emerald-950/34" : "text-mist-100/34")}>Desafio</p>
                    <p className={cn("mt-3 text-sm leading-7", themeMuted)}>{activeCase.challenge}</p>
                  </div>
                  <div>
                    <p className={cn("text-[10px] uppercase tracking-[0.22em]", light ? "text-emerald-950/34" : "text-mist-100/34")}>Virada</p>
                    <p className={cn("mt-3 text-sm leading-7", themeMuted)}>{activeCase.solution}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {caseStudies.map((caseStudy, index) => (
              <button
                className={cn(
                  "group w-full border-t py-4 text-left transition duration-500",
                  themeRule,
                  activeCaseIndex === index ? cn("translate-x-0", themeText) : themeCasePassiveText,
                  index === 1 ? "lg:ml-12" : "",
                )}
                data-cursor-label="case"
                key={caseStudy.id}
                onClick={() => setActiveCaseIndex(index)}
                onFocus={() => setActiveCaseIndex(index)}
                onMouseEnter={() => setActiveCaseIndex(index)}
                type="button"
              >
                <p className={cn("text-[10px] uppercase tracking-[0.28em]", light ? "text-emerald-950/34" : "text-mist-100/34")}>{caseStudy.niche}</p>
                <p className="mt-3 font-display text-[clamp(1.8rem,3vw,3rem)] leading-[0.94] tracking-[-0.06em]">
                  {caseStudy.title}
                </p>
                <p className={cn("mt-3 max-w-[26ch] text-sm leading-7", light ? "text-emerald-950/56" : "text-mist-100/52")}>{caseStudy.result}</p>
              </button>
            ))}

            <div className="mt-10 flex flex-wrap gap-2">
              {[...logos.slice(0, 4), ...sectors.map((sector) => sector.shortLabel)].slice(0, 7).map((item) => (
                <span className={cn("px-3 py-2 text-[10px] uppercase tracking-[0.22em]", themeTag)} key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell relative py-24 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className={cn("text-[10px] uppercase tracking-[0.34em]", themeSubtle)}>uma direção. seis frentes.</p>
            <p className={cn("mt-6 max-w-[12ch] font-display text-[clamp(3rem,7vw,6rem)] leading-[0.88] tracking-[-0.08em]", themeText)}>
              Dirigida. Não empilhada.
            </p>

            {leadTestimonial ? (
              <div className="mt-12">
                <p className={cn("font-editorial text-[clamp(2.6rem,5vw,4.4rem)] italic leading-[0.94] tracking-[-0.05em]", light ? "text-emerald-950" : "text-mist-50")}>
                  &ldquo;{leadTestimonial.quote}&rdquo;
                </p>
                <p className={cn("mt-6 text-[11px] uppercase tracking-[0.22em]", themeSubtle)}>
                  {leadTestimonial.authorName} / {leadTestimonial.company}
                </p>
              </div>
            ) : null}
          </div>

          <div className="relative">
            <div className={cn("pointer-events-none absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent to-transparent", light ? "via-emerald-700/16" : "via-mist-100/16")} />
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  className={cn(
                    "relative border-t py-6",
                    themeRule,
                    index % 2 === 1 ? "ml-8 lg:ml-20" : "",
                    index % 3 === 2 ? "mr-6 lg:mr-16" : "",
                  )}
                  key={`${step.step}-${step.title}`}
                >
                  <div className={cn("absolute left-0 top-0 h-px w-14 bg-gradient-to-r to-transparent", light ? "from-emerald-500 via-emerald-400" : "from-emerald-300 via-jade-300")} />
                  <div className="grid gap-4 lg:grid-cols-[0.18fr_0.82fr]">
                    <p className={cn("font-display text-5xl leading-none tracking-[-0.08em]", light ? "text-emerald-950/16" : "text-white/18")}>{step.step}</p>
                    <div>
                      <p className={cn("text-[10px] uppercase tracking-[0.3em]", themeAccent)}>{step.title}</p>
                      <p className={cn("mt-3 max-w-[34rem] text-sm leading-7", themeMuted)}>{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell relative py-24 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className={cn("text-[10px] uppercase tracking-[0.34em]", themeSubtle)}>primeiro passo</p>
            <p className={cn("mt-6 max-w-[10ch] font-display text-[clamp(3.6rem,8vw,7rem)] leading-[0.86] tracking-[-0.08em]", themeText)}>
              Menos ruído. Mais resultado.
            </p>
            <p className={cn("mt-6 max-w-sm text-sm leading-7", themeMuted)}>
              Diagnóstico estratégico. Leitura direta. Próximo movimento claro.
            </p>

            <div className="mt-12 space-y-2">
              {topFaqs.map((faq, index) => {
                const open = activeFaqIndex === index;

                return (
                  <button
                    className={cn("w-full border-t py-4 text-left", themeRule)}
                    data-cursor-label="faq"
                    key={faq.id}
                    onClick={() => setActiveFaqIndex(index)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <p className={cn("max-w-[18ch] font-display text-2xl tracking-[-0.05em] transition", open ? themeText : light ? "text-emerald-950/56" : "text-white/56")}>
                        {faq.question}
                      </p>
                      <Plus className={cn("mt-1 size-4 transition", open ? `rotate-45 ${light ? "text-emerald-700" : "text-jade-300"}` : themeSubtle)} />
                    </div>
                    <div
                      className={cn(
                        "grid overflow-hidden transition-all duration-500",
                        open ? "grid-rows-[1fr] pt-4 opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="min-h-0">
                        <p className={cn("max-w-xl text-sm leading-7", themeMuted)}>{faq.answer}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={cn("ameni-home-cut-a relative overflow-hidden p-5 sm:p-8", themePanel)}>
            <div className={cn(
              "pointer-events-none absolute inset-0",
              light
                ? "bg-[radial-gradient(circle_at_100%_0%,rgba(40,199,165,0.12),transparent_0_22%),radial-gradient(circle_at_0%_100%,rgba(27,49,91,0.08),transparent_0_30%)]"
                : "bg-[radial-gradient(circle_at_100%_0%,rgba(143,182,255,0.16),transparent_0_22%),radial-gradient(circle_at_0%_100%,rgba(48,226,188,0.14),transparent_0_30%)]",
            )} />
            <div className={cn("pointer-events-none absolute right-[-2rem] top-[-3rem] font-display text-[7rem] leading-none tracking-[-0.08em] sm:text-[10rem]", themeGhostText)}>
              AMENI
            </div>
            <div className="relative">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className={cn("text-[10px] uppercase tracking-[0.3em]", themeSubtle)}>entrada estratégica</p>
                  <p className={cn("mt-3 max-w-[18ch] font-display text-3xl leading-[0.96] tracking-[-0.05em]", themeText)}>
                    Entre pelo ponto certo.
                  </p>
                </div>
                <Sparkles className={cn("size-5", themeAccent)} />
              </div>
              <LeadCaptureForm defaultServiceInterest="Diagnóstico estratégico" theme={light ? "light" : "dark"} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

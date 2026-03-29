import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ScrollRevealSection } from "@/components/marketing/scroll-reveal-section";
import { SectionHeading } from "@/components/marketing/section-heading";
import type { MarketingService } from "@/lib/marketing-content";
import { cn } from "@/lib/utils";

const serviceAccents = [
  "from-emerald-300/22 via-white/[0.04] to-transparent",
  "from-jade-300/24 via-white/[0.04] to-transparent",
  "from-sky-400/20 via-white/[0.04] to-transparent",
  "from-emerald-400/18 via-white/[0.04] to-transparent",
  "from-blue-300/18 via-white/[0.04] to-transparent",
  "from-mist-100/14 via-white/[0.04] to-transparent",
] as const;

export function PremiumServicesGrid({ services }: { services: MarketingService[] }) {
  return (
    <section className="container-shell py-24 sm:py-28" id="servicos">
      <div className="grid gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:items-end">
        <SectionHeading
          eyebrow="Capability architecture"
          title="Cada frente existe para sustentar um pedaco da percepcao, da atencao e da conversao."
          description="Nada aqui foi pensado como card de catalogo. Cada servico entra como bloco de poder dentro da narrativa comercial da marca."
          theme="dark"
        />
        <div className="rounded-[30px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.9))] p-6 text-sm leading-8 text-mist-100/60">
          O ganho nao esta em contratar mais pecas. Esta em operar midia, conteudo, video, posicionamento e web
          como um sistema coerente, rapido e visualmente superior.
        </div>
      </div>

      <div className="mt-12 grid auto-rows-[minmax(18rem,auto)] gap-5 lg:grid-cols-12">
        {services.map((service, index) => {
          const featured = index < 2;

          return (
            <ScrollRevealSection
              className={cn("h-full", featured ? "lg:col-span-6" : "lg:col-span-4")}
              delay={index * 70}
              key={service.slug}
              variant={index % 2 === 0 ? "left" : "right"}
            >
              <Link
                className={cn(
                  "group premium-outline premium-panel relative flex h-full flex-col overflow-hidden rounded-[34px] p-6 sm:p-7",
                  featured ? "min-h-[24rem]" : "min-h-[20rem]",
                )}
                href={`/${service.slug}`}
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", serviceAccents[index % serviceAccents.length])} />
                <div className="absolute right-0 top-0 size-40 rounded-full bg-jade-300/12 blur-[80px]" />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-mist-100/40">{service.category}</p>
                      <h3 className="mt-4 font-display text-3xl tracking-[-0.05em] text-white sm:text-4xl">{service.name}</h3>
                    </div>
                    <div className="flex size-14 items-center justify-center rounded-[22px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(12,23,43,0.92),rgba(8,15,30,0.92))] text-jade-300">
                      <service.icon className="size-6" />
                    </div>
                  </div>

                  <p className="mt-5 max-w-xl text-base leading-8 text-mist-100/64">{service.description}</p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {service.proofPoints.slice(0, featured ? 4 : 3).map((proofPoint) => (
                      <span
                        className="rounded-full border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.9),rgba(6,12,24,0.88))] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-mist-100/48"
                        key={proofPoint}
                      >
                        {proofPoint}
                      </span>
                    ))}
                  </div>

                  <div className={cn("mt-auto grid gap-4 pt-8", featured ? "sm:grid-cols-2" : "")}>
                    {service.outcomes.slice(0, featured ? 2 : 1).map((outcome) => (
                      <div className="rounded-[24px] border border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.9),rgba(6,12,24,0.88))] p-4 text-sm leading-7 text-mist-100/66" key={outcome}>
                        {outcome}
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex items-center justify-between text-sm font-medium text-white">
                    <span className="max-w-[18rem] text-mist-100/70">{service.benefit}</span>
                    <span className="inline-flex items-center gap-2 text-jade-300 transition group-hover:text-white">
                      Explorar
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollRevealSection>
          );
        })}
      </div>
    </section>
  );
}

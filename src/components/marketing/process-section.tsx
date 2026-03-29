import type { MarketingProcessStep } from "@/lib/marketing-content";

import { SectionHeading } from "@/components/marketing/section-heading";

export function ProcessSection({
  eyebrow = "Metodo",
  title,
  description,
  steps,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  steps: MarketingProcessStep[];
}) {
  return (
    <section className="container-shell py-24 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} theme="dark" />
        <div className="grid gap-4">
          {steps.map((step) => (
            <article
              className="premium-outline premium-panel group relative overflow-hidden rounded-[32px] p-6 transition duration-500 hover:-translate-y-1"
              key={`${step.step}-${step.title}`}
            >
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 font-display text-[5rem] leading-none tracking-[-0.08em] text-mist-100/[0.05]">
                {step.step}
              </div>
              <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-jade-300">{step.step}</p>
              <h3 className="relative mt-4 font-display text-3xl tracking-[-0.05em] text-white">{step.title}</h3>
              <p className="relative mt-4 max-w-2xl text-sm leading-7 text-mist-100/64">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

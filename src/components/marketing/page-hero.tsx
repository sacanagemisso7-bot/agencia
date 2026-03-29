import type { ReactNode } from "react";

import { SectionHeading } from "@/components/marketing/section-heading";

export function PageHero({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  aside?: ReactNode;
}) {
  return (
    <section className="container-shell pt-12 pb-12 sm:pt-16 sm:pb-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} theme="dark" />
        {aside ? (
          <div className="premium-outline premium-panel rounded-[32px] p-6 text-sm leading-8 text-mist-100/60">
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  );
}

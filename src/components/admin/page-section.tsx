import type { ReactNode } from "react";

export function PageSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-600">Module</p>
        <h2 className="mt-3 font-display text-[1.8rem] leading-none tracking-[-0.04em] text-ink-950">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-ink-950/62">{description}</p>
      </div>
      {children}
    </section>
  );
}

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
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-2xl text-ink-950">{title}</h2>
        <p className="mt-1 text-sm text-ink-950/62">{description}</p>
      </div>
      {children}
    </section>
  );
}

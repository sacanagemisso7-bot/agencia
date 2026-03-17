export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl text-ink-950 sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-ink-950/70">{description}</p> : null}
    </div>
  );
}


import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <Card className="bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,244,0.92))] p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/45 to-transparent" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-950/46">{label}</p>
      <p className="mt-4 font-display text-4xl tracking-[-0.05em] text-ink-950">{value}</p>
      <p className="mt-3 text-sm leading-7 text-ink-950/60">{helper}</p>
    </Card>
  );
}

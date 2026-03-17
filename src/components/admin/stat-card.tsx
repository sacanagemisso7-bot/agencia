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
    <Card className="p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-950/48">{label}</p>
      <p className="mt-4 font-display text-4xl text-ink-950">{value}</p>
      <p className="mt-2 text-sm text-ink-950/60">{helper}</p>
    </Card>
  );
}


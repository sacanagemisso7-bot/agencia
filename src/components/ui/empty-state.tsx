import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="p-8 text-center">
      <h3 className="font-display text-xl text-ink-950">{title}</h3>
      <p className="mt-2 text-sm text-ink-950/65">{description}</p>
    </Card>
  );
}


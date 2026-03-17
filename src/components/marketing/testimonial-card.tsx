import { Card } from "@/components/ui/card";
import type { TestimonialRecord } from "@/lib/types";

export function TestimonialCard({ testimonial }: { testimonial: TestimonialRecord }) {
  return (
    <Card className="h-full p-7">
      <p className="text-lg leading-8 text-ink-950/80">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-6 border-t border-ink-950/8 pt-5">
        <p className="font-semibold text-ink-950">{testimonial.authorName}</p>
        <p className="text-sm text-ink-950/60">
          {testimonial.role} • {testimonial.company}
        </p>
      </div>
    </Card>
  );
}

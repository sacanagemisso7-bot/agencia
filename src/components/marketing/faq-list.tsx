import { Card } from "@/components/ui/card";
import type { FAQRecord } from "@/lib/types";

export function FAQList({ faqs }: { faqs: FAQRecord[] }) {
  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <Card className="p-6" key={faq.id}>
          <h3 className="font-semibold text-ink-950">{faq.question}</h3>
          <p className="mt-3 text-sm leading-7 text-ink-950/70">{faq.answer}</p>
        </Card>
      ))}
    </div>
  );
}


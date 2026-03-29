import type { FAQRecord } from "@/lib/types";

export function FAQList({ faqs }: { faqs: FAQRecord[] }) {
  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <div className="premium-outline premium-panel rounded-[30px] p-6" key={faq.id}>
          <h3 className="font-display text-2xl tracking-[-0.04em] text-white">{faq.question}</h3>
          <p className="mt-3 text-sm leading-7 text-mist-100/60">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}

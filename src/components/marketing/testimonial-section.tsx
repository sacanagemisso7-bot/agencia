import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { SectionHeading } from "@/components/marketing/section-heading";
import type { TestimonialRecord } from "@/lib/types";

export function TestimonialSection({ testimonials }: { testimonials: TestimonialRecord[] }) {
  return (
    <section className="container-shell py-24 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.74fr_1.26fr]">
        <SectionHeading
          eyebrow="Confianca"
          title="Relacao premium, clareza executiva e entregas que fazem sentido para o negocio."
          description="Clientes escolhem ficar quando sentem que marca, operacao e crescimento estao finalmente alinhados."
          theme="dark"
        />
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

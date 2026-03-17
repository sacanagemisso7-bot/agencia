import { SectionHeading } from "@/components/marketing/section-heading";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { getSiteContent } from "@/modules/site-content/repository";

export default async function DepoimentosPage() {
  const content = await getSiteContent();

  return (
    <main className="container-shell py-20">
      <SectionHeading
        eyebrow="Depoimentos"
        title="Clientes que buscavam mais clareza, mais controle e mais escala."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {content.testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </main>
  );
}


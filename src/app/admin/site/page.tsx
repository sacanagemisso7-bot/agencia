import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageToast } from "@/components/ui/page-toast";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  createFAQEntryAction,
  createServiceEntryAction,
  createTestimonialEntryAction,
  updateSiteSettingsAction,
} from "@/modules/site-content/actions";
import { getSiteContent } from "@/modules/site-content/repository";

function getCmsToast(success?: string) {
  switch (success) {
    case "settings":
      return "Configuracoes do site atualizadas.";
    case "service":
      return "Servico publicado no site.";
    case "testimonial":
      return "Depoimento publicado.";
    case "faq":
      return "FAQ publicado.";
    default:
      return null;
  }
}

export default async function SitePage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  const content = await getSiteContent();
  const query = await searchParams;
  const toastMessage = getCmsToast(query?.success);

  return (
    <AdminShell title="CMS" description="Visao do conteudo institucional e da estrutura pronta para evoluir para CRUD completo.">
      <PageToast message={toastMessage} />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Hero</p>
          <h2 className="mt-2 font-display text-2xl text-ink-950">{content.settings.agencyName}</h2>
          <p className="mt-4 text-sm leading-7 text-ink-950/68">{content.settings.heroTitle}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Servicos</p>
          <p className="mt-3 font-display text-4xl text-ink-950">{content.services.length}</p>
          <p className="mt-2 text-sm text-ink-950/65">Cards prontos para expansao do CRUD no proximo ciclo.</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Prova social</p>
          <p className="mt-3 font-display text-4xl text-ink-950">{content.testimonials.length}</p>
          <p className="mt-2 text-sm text-ink-950/65">Depoimentos e cases sincronizados com a frente publica.</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Configuracoes principais</h2>
          <form action={updateSiteSettingsAction} className="mt-6 grid gap-4">
            <Input defaultValue={content.settings.agencyName} name="agencyName" placeholder="Nome da agencia" />
            <Textarea defaultValue={content.settings.heroTitle} name="heroTitle" placeholder="Headline principal" />
            <Textarea defaultValue={content.settings.heroSubtitle} name="heroSubtitle" placeholder="Subtitulo" />
            <div className="grid gap-4 md:grid-cols-2">
              <Input defaultValue={content.settings.primaryCta} name="primaryCta" placeholder="CTA principal" />
              <Input defaultValue={content.settings.secondaryCta} name="secondaryCta" placeholder="CTA secundario" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Input defaultValue={content.settings.email} name="email" placeholder="Email" />
              <Input defaultValue={content.settings.phone} name="phone" placeholder="Telefone" />
              <Input defaultValue={content.settings.whatsapp} name="whatsapp" placeholder="WhatsApp" />
            </div>
            <Button type="submit">Salvar configuracoes</Button>
          </form>
        </Card>
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Novo servico</h2>
          <form action={createServiceEntryAction} className="mt-6 grid gap-4">
            <Input name="name" placeholder="Nome do servico" />
            <Textarea name="description" placeholder="Descricao" />
            <Input name="benefit" placeholder="Beneficio principal" />
            <Select defaultValue="false" name="featured">
              <option value="false">Nao destacado</option>
              <option value="true">Destacado</option>
            </Select>
            <Button type="submit">Publicar servico</Button>
          </form>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Novo depoimento</h2>
          <form action={createTestimonialEntryAction} className="mt-6 grid gap-4">
            <Input name="authorName" placeholder="Nome" />
            <Input name="role" placeholder="Cargo" />
            <Input name="company" placeholder="Empresa" />
            <Textarea name="quote" placeholder="Depoimento" />
            <Select defaultValue="false" name="featured">
              <option value="false">Nao destacado</option>
              <option value="true">Destacado</option>
            </Select>
            <Button type="submit">Publicar depoimento</Button>
          </form>
        </Card>
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Novo FAQ</h2>
          <form action={createFAQEntryAction} className="mt-6 grid gap-4">
            <Input name="question" placeholder="Pergunta" />
            <Textarea name="answer" placeholder="Resposta" />
            <Button type="submit">Publicar FAQ</Button>
          </form>
        </Card>
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Servicos publicados</h2>
          <div className="mt-6 space-y-4">
            {content.services.map((service) => (
              <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={service.id}>
                <p className="font-medium text-ink-950">{service.name}</p>
                <p className="mt-2 text-sm text-ink-950/65">{service.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Depoimentos publicados</h2>
          <div className="mt-6 space-y-4">
            {content.testimonials.map((testimonial) => (
              <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={testimonial.id}>
                <p className="font-medium text-ink-950">{testimonial.authorName}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-950/42">
                  {testimonial.role} • {testimonial.company}
                </p>
                <p className="mt-3 text-sm text-ink-950/65">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">FAQ publicado</h2>
          <div className="mt-6 space-y-4">
            {content.faqs.map((faq) => (
              <div className="rounded-[22px] bg-white p-4 ring-1 ring-ink-950/6" key={faq.id}>
                <p className="font-medium text-ink-950">{faq.question}</p>
                <p className="mt-2 text-sm text-ink-950/65">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}

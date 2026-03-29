import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageToast } from "@/components/ui/page-toast";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireAdminUser } from "@/modules/auth/guards";
import {
  createBlogPostEntryAction,
  createCaseStudyEntryAction,
  createFAQEntryAction,
  createServiceEntryAction,
  createTestimonialEntryAction,
  deleteBlogPostEntryAction,
  deleteCaseStudyEntryAction,
  updateBlogPostEntryAction,
  updateCaseStudyEntryAction,
  updateMethodologyContentAction,
  updateProofAssetsContentAction,
  updateSectorEntryAction,
  updateSiteSettingsAction,
} from "@/modules/site-content/actions";
import { getSectorCmsCatalog, getSiteContent } from "@/modules/site-content/repository";

function getCmsToast(success?: string) {
  switch (success) {
    case "settings":
      return "Configuracoes principais atualizadas.";
    case "service":
      return "Servico publicado no site.";
    case "testimonial":
      return "Depoimento publicado.";
    case "faq":
      return "FAQ publicado.";
    case "case-study":
      return "Case sincronizado no CMS.";
    case "blog-post":
      return "Insight sincronizado no CMS.";
    case "methodology":
      return "Pagina de metodologia atualizada.";
    case "proof-assets":
      return "Bloco de prova visual atualizado.";
    case "sector":
      return "Pagina de setor atualizada.";
    default:
      return null;
  }
}

function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function joinPairs(items: Array<{ title: string; description: string }>) {
  return items.map((item) => `${item.title} | ${item.description}`).join("\n");
}

function joinMetrics(items: Array<{ value: string; label: string }>) {
  return items.map((item) => `${item.value} | ${item.label}`).join("\n");
}

function joinBars(items: Array<{ label: string; width: string }>) {
  return items.map((item) => `${item.label} | ${item.width}`).join("\n");
}

export default async function SitePage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  await requireAdminUser();
  const [content, sectorCatalog] = await Promise.all([getSiteContent(), getSectorCmsCatalog()]);
  const query = await searchParams;
  const toastMessage = getCmsToast(query?.success);

  return (
    <AdminShell
      title="CMS editorial"
      description="Edite posicionamento, paginas de autoridade, setores, cases, insights e prova visual sem tocar no codigo."
    >
      <PageToast message={toastMessage} />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <CmsStatCard label="Servicos" value={String(content.services.length)} />
        <CmsStatCard label="Cases" value={String(content.caseStudies.length)} />
        <CmsStatCard label="Insights" value={String(content.blogPosts.length)} />
        <CmsStatCard label="Setores" value={String(sectorCatalog.length)} />
        <CmsStatCard label="Depoimentos" value={String(content.testimonials.length)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
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
            <div className="grid gap-4 md:grid-cols-2">
              <Input defaultValue={content.settings.calendarUrl} name="calendarUrl" placeholder="URL do Calendly" />
              <Input defaultValue={content.settings.calendarEmbedUrl} name="calendarEmbedUrl" placeholder="URL embed" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input defaultValue={content.settings.instagramUrl} name="instagramUrl" placeholder="Instagram" />
              <Input defaultValue={content.settings.linkedinUrl} name="linkedinUrl" placeholder="LinkedIn" />
            </div>
            <Button type="submit">Salvar configuracoes</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Pagina de metodologia</h2>
          <form action={updateMethodologyContentAction} className="mt-6 grid gap-4">
            <Input defaultValue={content.methodology.heroEyebrow} name="heroEyebrow" placeholder="Eyebrow" />
            <Textarea defaultValue={content.methodology.heroTitle} name="heroTitle" placeholder="Titulo" />
            <Textarea defaultValue={content.methodology.heroDescription} name="heroDescription" placeholder="Descricao" />
            <Textarea defaultValue={content.methodology.heroAside} name="heroAside" placeholder="Aside" />
            <Input defaultValue={content.methodology.processTitle} name="processTitle" placeholder="Titulo do processo" />
            <Textarea
              defaultValue={content.methodology.processDescription}
              name="processDescription"
              placeholder="Descricao do processo"
            />
            <Input defaultValue={content.methodology.impactEyebrow} name="impactEyebrow" placeholder="Eyebrow de impacto" />
            <Input defaultValue={content.methodology.impactTitle} name="impactTitle" placeholder="Titulo de impacto" />
            <Textarea
              defaultValue={content.methodology.impactBody.join("\n")}
              name="impactBody"
              placeholder="Um paragrafo por linha"
            />
            <Textarea
              defaultValue={joinPairs(content.methodology.pillars)}
              name="pillars"
              placeholder="Um pilar por linha: Titulo | Descricao"
            />
            <Input defaultValue={content.methodology.ctaTitle} name="ctaTitle" placeholder="CTA title" />
            <Textarea defaultValue={content.methodology.ctaDescription} name="ctaDescription" placeholder="CTA description" />
            <Button type="submit">Salvar metodologia</Button>
          </form>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="font-display text-2xl text-ink-950">Prova visual e autoridade</h2>
        <form action={updateProofAssetsContentAction} className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input defaultValue={content.proofAssets.eyebrow} name="eyebrow" placeholder="Eyebrow" />
            <Input defaultValue={content.proofAssets.mockupEyebrow} name="mockupEyebrow" placeholder="Eyebrow mockup" />
          </div>
          <Textarea defaultValue={content.proofAssets.title} name="title" placeholder="Titulo" />
          <Textarea defaultValue={content.proofAssets.description} name="description" placeholder="Descricao" />
          <Textarea defaultValue={content.proofAssets.logos.join("\n")} name="logos" placeholder="Uma logo por linha" />
          <Textarea
            defaultValue={joinPairs(content.proofAssets.features)}
            name="features"
            placeholder="Uma feature por linha: Titulo | Descricao"
          />
          <Input defaultValue={content.proofAssets.mockupTitle} name="mockupTitle" placeholder="Titulo do mockup" />
          <Textarea
            defaultValue={joinMetrics(content.proofAssets.mockupMetrics)}
            name="mockupMetrics"
            placeholder="Uma metrica por linha: Valor | Label"
          />
          <Textarea
            defaultValue={joinBars(content.proofAssets.mockupBars)}
            name="mockupBars"
            placeholder="Uma barra por linha: Label | 78%"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input defaultValue={content.proofAssets.creativeEyebrow} name="creativeEyebrow" placeholder="Eyebrow criativo" />
            <Input defaultValue={content.proofAssets.landingEyebrow} name="landingEyebrow" placeholder="Eyebrow landing" />
          </div>
          <Input defaultValue={content.proofAssets.creativeTitle} name="creativeTitle" placeholder="Titulo criativo" />
          <Textarea
            defaultValue={content.proofAssets.creativeDescription}
            name="creativeDescription"
            placeholder="Descricao criativo"
          />
          <Textarea defaultValue={content.proofAssets.landingHighlight} name="landingHighlight" placeholder="Texto do bloco de landing" />
          <Button type="submit">Salvar prova visual</Button>
        </form>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Novo case</h2>
          <form action={createCaseStudyEntryAction} className="mt-6 grid gap-4">
            <Input name="title" placeholder="Titulo" />
            <Input name="niche" placeholder="Nicho" />
            <Textarea name="challenge" placeholder="Desafio" />
            <Textarea name="solution" placeholder="Solucao" />
            <Textarea name="result" placeholder="Resultado" />
            <Textarea name="metrics" placeholder="Uma metrica por linha: nome | valor" />
            <Select defaultValue="false" name="featured">
              <option value="false">Nao destacado</option>
              <option value="true">Destacado</option>
            </Select>
            <Button type="submit">Publicar case</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Novo insight</h2>
          <form action={createBlogPostEntryAction} className="mt-6 grid gap-4">
            <Input name="title" placeholder="Titulo" />
            <Input name="category" placeholder="Categoria" />
            <Textarea name="excerpt" placeholder="Resumo" />
            <Textarea name="content" placeholder="Conteudo completo" rows={12} />
            <Input name="publishedAt" placeholder="2026-03-27T09:00:00.000Z" />
            <Button type="submit">Publicar insight</Button>
          </form>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Cases publicados</h2>
          <div className="mt-6 space-y-6">
            {content.caseStudies.map((caseStudy) => (
              <form action={updateCaseStudyEntryAction.bind(null, caseStudy.id)} className="rounded-[24px] bg-white p-4 ring-1 ring-ink-950/6" key={caseStudy.id}>
                <input name="id" type="hidden" value={caseStudy.id} />
                <div className="grid gap-3">
                  <Input defaultValue={caseStudy.title} name="title" placeholder="Titulo" />
                  <Input defaultValue={caseStudy.niche} name="niche" placeholder="Nicho" />
                  <Textarea defaultValue={caseStudy.challenge} name="challenge" placeholder="Desafio" />
                  <Textarea defaultValue={caseStudy.solution} name="solution" placeholder="Solucao" />
                  <Textarea defaultValue={caseStudy.result} name="result" placeholder="Resultado" />
                  <Textarea
                    defaultValue={Object.entries(caseStudy.metrics ?? {})
                      .map(([label, value]) => `${label} | ${String(value)}`)
                      .join("\n")}
                    name="metrics"
                    placeholder="Uma metrica por linha: nome | valor"
                  />
                  <Select defaultValue={caseStudy.featured ? "true" : "false"} name="featured">
                    <option value="false">Nao destacado</option>
                    <option value="true">Destacado</option>
                  </Select>
                  <div className="flex gap-3">
                    <Button type="submit">Salvar case</Button>
                    <Button formAction={deleteCaseStudyEntryAction} type="submit" variant="ghost">
                      Excluir
                    </Button>
                  </div>
                </div>
              </form>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Insights publicados</h2>
          <div className="mt-6 space-y-6">
            {content.blogPosts.map((post) => (
              <form action={updateBlogPostEntryAction.bind(null, post.id)} className="rounded-[24px] bg-white p-4 ring-1 ring-ink-950/6" key={post.id}>
                <input name="id" type="hidden" value={post.id} />
                <div className="grid gap-3">
                  <Input defaultValue={post.title} name="title" placeholder="Titulo" />
                  <Input defaultValue={post.category} name="category" placeholder="Categoria" />
                  <Textarea defaultValue={post.excerpt} name="excerpt" placeholder="Resumo" />
                  <Textarea defaultValue={post.content} name="content" placeholder="Conteudo" rows={10} />
                  <Input defaultValue={post.publishedAt ?? ""} name="publishedAt" placeholder="Data ISO de publicacao" />
                  <div className="flex gap-3">
                    <Button type="submit">Salvar insight</Button>
                    <Button formAction={deleteBlogPostEntryAction} type="submit" variant="ghost">
                      Excluir
                    </Button>
                  </div>
                </div>
              </form>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="font-display text-2xl text-ink-950">Paginas de setores</h2>
        <p className="mt-3 text-sm leading-7 text-ink-950/62">
          Edite heros, CTA, dores e estruturas complexas de cada setor. Campos mais ricos usam JSON para manter edicao completa sem depender de deploy.
        </p>
        <div className="mt-6 grid gap-6">
          {sectorCatalog.map((sector) => (
            <form action={updateSectorEntryAction} className="rounded-[28px] bg-white p-5 ring-1 ring-ink-950/6" key={sector.slug}>
              <input name="slug" type="hidden" value={sector.slug} />
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Input defaultValue={sector.name} name="name" placeholder="Nome" />
                  <Input defaultValue={sector.shortLabel} name="shortLabel" placeholder="Short label" />
                  <Input defaultValue={sector.audience} name="audience" placeholder="Audience" />
                </div>
                <Textarea defaultValue={sector.seoDescription} name="seoDescription" placeholder="SEO description" />
                <Textarea defaultValue={sector.heroTitle} name="heroTitle" placeholder="Hero title" />
                <Textarea defaultValue={sector.heroDescription} name="heroDescription" placeholder="Hero description" />
                <Textarea defaultValue={sector.summary} name="summary" placeholder="Summary" />
                <Textarea defaultValue={sector.keywords.join("\n")} name="keywords" placeholder="Uma keyword por linha" />
                <Textarea
                  defaultValue={sector.matchingNiches.join("\n")}
                  name="matchingNiches"
                  placeholder="Um nicho relacionado por linha"
                />
                <Textarea defaultValue={prettyJson(sector.metrics)} name="metrics" placeholder="JSON de metrics" rows={6} />
                <Textarea defaultValue={sector.painPoints.join("\n")} name="painPoints" placeholder="Uma dor por linha" rows={6} />
                <Textarea defaultValue={prettyJson(sector.serviceMix)} name="serviceMix" placeholder="JSON de service mix" rows={8} />
                <Textarea
                  defaultValue={sector.differentiators.join("\n")}
                  name="differentiators"
                  placeholder="Um diferencial por linha"
                  rows={5}
                />
                <Textarea defaultValue={prettyJson(sector.playbook)} name="playbook" placeholder="JSON de playbook" rows={10} />
                <Textarea
                  defaultValue={prettyJson(sector.caseHighlights)}
                  name="caseHighlights"
                  placeholder="JSON de case highlights"
                  rows={14}
                />
                <Input defaultValue={sector.ctaTitle} name="ctaTitle" placeholder="CTA title" />
                <Textarea defaultValue={sector.ctaDescription} name="ctaDescription" placeholder="CTA description" />
                <div>
                  <Button type="submit">Salvar pagina de setor</Button>
                </div>
              </div>
            </form>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
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
      </div>
    </AdminShell>
  );
}

function CmsStatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">{label}</p>
      <p className="mt-3 font-display text-4xl text-ink-950">{value}</p>
    </Card>
  );
}

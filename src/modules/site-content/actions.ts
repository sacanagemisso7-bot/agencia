"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminUser } from "@/modules/auth/guards";
import {
  createBlogPostEntry,
  createCaseStudyEntry,
  createFAQEntry,
  createServiceEntry,
  createTestimonialEntry,
  deleteBlogPostEntry,
  deleteCaseStudyEntry,
  getSectorCmsCatalog,
  updateBlogPostEntry,
  updateCaseStudyEntry,
  updateMethodologyContent,
  updateProofAssetsContent,
  updateSectorCatalog,
  updateSiteSettings,
} from "@/modules/site-content/repository";
import { recordActivity } from "@/modules/shared/activity-log";
import type { SectorPageContent } from "@/lib/sector-content";

const settingsSchema = z.object({
  agencyName: z.string().min(2),
  heroTitle: z.string().min(8),
  heroSubtitle: z.string().min(8),
  primaryCta: z.string().min(2),
  secondaryCta: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  whatsapp: z.string().min(5),
  calendarUrl: z.string().url(),
  calendarEmbedUrl: z.string().url(),
  instagramUrl: z.string().url(),
  linkedinUrl: z.string().url(),
});

const serviceSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(8),
  benefit: z.string().min(4),
  featured: z.string().optional(),
});

const testimonialSchema = z.object({
  authorName: z.string().min(2),
  role: z.string().min(2),
  company: z.string().min(2),
  quote: z.string().min(12),
  featured: z.string().optional(),
});

const faqSchema = z.object({
  question: z.string().min(8),
  answer: z.string().min(8),
});

const caseStudySchema = z.object({
  title: z.string().min(4),
  niche: z.string().min(2),
  challenge: z.string().min(12),
  solution: z.string().min(12),
  result: z.string().min(12),
  featured: z.string().optional(),
  metrics: z.string().optional(),
});

const blogPostSchema = z.object({
  title: z.string().min(4),
  excerpt: z.string().min(12),
  content: z.string().min(40),
  category: z.string().min(2),
  publishedAt: z.string().optional(),
});

const methodologySchema = z.object({
  heroEyebrow: z.string().min(2),
  heroTitle: z.string().min(8),
  heroDescription: z.string().min(8),
  heroAside: z.string().min(8),
  processTitle: z.string().min(8),
  processDescription: z.string().min(8),
  impactEyebrow: z.string().min(2),
  impactTitle: z.string().min(8),
  impactBody: z.string().min(8),
  ctaTitle: z.string().min(8),
  ctaDescription: z.string().min(8),
  pillars: z.string().min(8),
});

const proofAssetsSchema = z.object({
  eyebrow: z.string().min(2),
  title: z.string().min(8),
  description: z.string().min(8),
  logos: z.string().min(2),
  features: z.string().min(8),
  mockupEyebrow: z.string().min(2),
  mockupTitle: z.string().min(8),
  mockupMetrics: z.string().min(8),
  mockupBars: z.string().min(8),
  creativeEyebrow: z.string().min(2),
  creativeTitle: z.string().min(8),
  creativeDescription: z.string().min(8),
  landingEyebrow: z.string().min(2),
  landingHighlight: z.string().min(8),
});

const sectorSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  shortLabel: z.string().min(2),
  audience: z.string().min(8),
  seoDescription: z.string().min(8),
  heroTitle: z.string().min(8),
  heroDescription: z.string().min(8),
  summary: z.string().min(8),
  keywords: z.string().min(2),
  matchingNiches: z.string().min(2),
  metrics: z.string().min(2),
  painPoints: z.string().min(2),
  serviceMix: z.string().min(2),
  differentiators: z.string().min(2),
  playbook: z.string().min(2),
  caseHighlights: z.string().min(2),
  ctaTitle: z.string().min(8),
  ctaDescription: z.string().min(8),
});

function parseLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseJsonField<T>(value: string, fallback: T): T {
  if (!value.trim()) {
    return fallback;
  }

  return JSON.parse(value) as T;
}

function parseMetricsInput(value: string) {
  const metrics = parseLines(value).map((line) => {
    const [label = "", metricValue = ""] = line.split("|").map((item) => item.trim());
    return [label, metricValue] as const;
  });

  return Object.fromEntries(metrics.filter(([label, metricValue]) => label && metricValue));
}

export async function updateSiteSettingsAction(formData: FormData) {
  await requireAdminUser();
  const parsed = settingsSchema.parse({
    agencyName: String(formData.get("agencyName") ?? ""),
    heroTitle: String(formData.get("heroTitle") ?? ""),
    heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
    primaryCta: String(formData.get("primaryCta") ?? ""),
    secondaryCta: String(formData.get("secondaryCta") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    calendarUrl: String(formData.get("calendarUrl") ?? ""),
    calendarEmbedUrl: String(formData.get("calendarEmbedUrl") ?? ""),
    instagramUrl: String(formData.get("instagramUrl") ?? ""),
    linkedinUrl: String(formData.get("linkedinUrl") ?? ""),
  });

  await updateSiteSettings(parsed);

  await recordActivity({
    action: "cms.settings.updated",
    entityType: "SiteSetting",
    description: "Configuracoes principais do site atualizadas.",
  });

  revalidatePath("/");
  revalidatePath("/metodologia");
  revalidatePath("/como-funciona");
  revalidatePath("/sobre");
  revalidatePath("/servicos");
  revalidatePath("/contato");
  revalidatePath("/admin/site");
  redirect("/admin/site?success=settings");
}

export async function createServiceEntryAction(formData: FormData) {
  await requireAdminUser();
  const parsed = serviceSchema.parse({
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    benefit: String(formData.get("benefit") ?? ""),
    featured: String(formData.get("featured") ?? ""),
  });

  const service = await createServiceEntry({
    name: parsed.name,
    description: parsed.description,
    benefit: parsed.benefit,
    featured: parsed.featured === "true",
  });

  await recordActivity({
    action: "cms.service.created",
    entityType: "Service",
    entityId: service.id,
    description: "Novo servico publicado no site.",
  });

  revalidatePath("/");
  revalidatePath("/servicos");
  revalidatePath("/admin/site");
  redirect("/admin/site?success=service");
}

export async function createTestimonialEntryAction(formData: FormData) {
  await requireAdminUser();
  const parsed = testimonialSchema.parse({
    authorName: String(formData.get("authorName") ?? ""),
    role: String(formData.get("role") ?? ""),
    company: String(formData.get("company") ?? ""),
    quote: String(formData.get("quote") ?? ""),
    featured: String(formData.get("featured") ?? ""),
  });

  const testimonial = await createTestimonialEntry({
    authorName: parsed.authorName,
    role: parsed.role,
    company: parsed.company,
    quote: parsed.quote,
    featured: parsed.featured === "true",
  });

  await recordActivity({
    action: "cms.testimonial.created",
    entityType: "Testimonial",
    entityId: testimonial.id,
    description: "Novo depoimento publicado no site.",
  });

  revalidatePath("/");
  revalidatePath("/depoimentos");
  revalidatePath("/admin/site");
  redirect("/admin/site?success=testimonial");
}

export async function createFAQEntryAction(formData: FormData) {
  await requireAdminUser();
  const parsed = faqSchema.parse({
    question: String(formData.get("question") ?? ""),
    answer: String(formData.get("answer") ?? ""),
  });

  const faq = await createFAQEntry(parsed);

  await recordActivity({
    action: "cms.faq.created",
    entityType: "FAQ",
    entityId: faq.id,
    description: "Novo FAQ publicado no site.",
  });

  revalidatePath("/");
  revalidatePath("/admin/site");
  redirect("/admin/site?success=faq");
}

export async function createCaseStudyEntryAction(formData: FormData) {
  await requireAdminUser();
  const parsed = caseStudySchema.parse({
    title: String(formData.get("title") ?? ""),
    niche: String(formData.get("niche") ?? ""),
    challenge: String(formData.get("challenge") ?? ""),
    solution: String(formData.get("solution") ?? ""),
    result: String(formData.get("result") ?? ""),
    featured: String(formData.get("featured") ?? ""),
    metrics: String(formData.get("metrics") ?? ""),
  });

  const caseStudy = await createCaseStudyEntry({
    title: parsed.title,
    niche: parsed.niche,
    challenge: parsed.challenge,
    solution: parsed.solution,
    result: parsed.result,
    featured: parsed.featured === "true",
    metrics: parseMetricsInput(parsed.metrics ?? ""),
  });

  await recordActivity({
    action: "cms.case_study.created",
    entityType: "CaseStudy",
    entityId: caseStudy.id,
    description: "Novo case publicado no site.",
  });

  revalidatePath("/");
  revalidatePath("/cases");
  revalidatePath("/cases/[slug]", "page");
  revalidatePath("/setores");
  revalidatePath("/setores/[slug]", "page");
  revalidatePath("/admin/site");
  redirect("/admin/site?success=case-study");
}

export async function updateCaseStudyEntryAction(id: string, formData: FormData) {
  await requireAdminUser();
  const parsed = caseStudySchema.parse({
    title: String(formData.get("title") ?? ""),
    niche: String(formData.get("niche") ?? ""),
    challenge: String(formData.get("challenge") ?? ""),
    solution: String(formData.get("solution") ?? ""),
    result: String(formData.get("result") ?? ""),
    featured: String(formData.get("featured") ?? ""),
    metrics: String(formData.get("metrics") ?? ""),
  });

  const caseStudy = await updateCaseStudyEntry(id, {
    title: parsed.title,
    niche: parsed.niche,
    challenge: parsed.challenge,
    solution: parsed.solution,
    result: parsed.result,
    featured: parsed.featured === "true",
    metrics: parseMetricsInput(parsed.metrics ?? ""),
  });

  await recordActivity({
    action: "cms.case_study.updated",
    entityType: "CaseStudy",
    entityId: id,
    description: "Case atualizado no CMS.",
  });

  revalidatePath("/");
  revalidatePath("/cases");
  revalidatePath(`/cases/${caseStudy?.slug ?? ""}`);
  revalidatePath("/cases/[slug]", "page");
  revalidatePath("/setores");
  revalidatePath("/setores/[slug]", "page");
  revalidatePath("/admin/site");
  redirect("/admin/site?success=case-study");
}

export async function deleteCaseStudyEntryAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");

  await deleteCaseStudyEntry(id);

  await recordActivity({
    action: "cms.case_study.deleted",
    entityType: "CaseStudy",
    entityId: id,
    description: "Case removido do CMS.",
  });

  revalidatePath("/");
  revalidatePath("/cases");
  revalidatePath("/cases/[slug]", "page");
  revalidatePath("/setores");
  revalidatePath("/setores/[slug]", "page");
  revalidatePath("/admin/site");
  redirect("/admin/site?success=case-study");
}

export async function createBlogPostEntryAction(formData: FormData) {
  await requireAdminUser();
  const parsed = blogPostSchema.parse({
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    category: String(formData.get("category") ?? ""),
    publishedAt: String(formData.get("publishedAt") ?? ""),
  });

  const post = await createBlogPostEntry({
    title: parsed.title,
    excerpt: parsed.excerpt,
    content: parsed.content,
    category: parsed.category,
    publishedAt: parsed.publishedAt || null,
  });

  await recordActivity({
    action: "cms.blog_post.created",
    entityType: "BlogPost",
    entityId: post.id,
    description: "Novo insight publicado no site.",
  });

  revalidatePath("/insights");
  revalidatePath("/insights/[slug]", "page");
  revalidatePath("/admin/site");
  redirect("/admin/site?success=blog-post");
}

export async function updateBlogPostEntryAction(id: string, formData: FormData) {
  await requireAdminUser();
  const parsed = blogPostSchema.parse({
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    category: String(formData.get("category") ?? ""),
    publishedAt: String(formData.get("publishedAt") ?? ""),
  });

  const post = await updateBlogPostEntry(id, {
    title: parsed.title,
    excerpt: parsed.excerpt,
    content: parsed.content,
    category: parsed.category,
    publishedAt: parsed.publishedAt || null,
  });

  await recordActivity({
    action: "cms.blog_post.updated",
    entityType: "BlogPost",
    entityId: id,
    description: "Insight atualizado no CMS.",
  });

  revalidatePath("/insights");
  revalidatePath(`/insights/${post?.slug ?? ""}`);
  revalidatePath("/insights/[slug]", "page");
  revalidatePath("/admin/site");
  redirect("/admin/site?success=blog-post");
}

export async function deleteBlogPostEntryAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");

  await deleteBlogPostEntry(id);

  await recordActivity({
    action: "cms.blog_post.deleted",
    entityType: "BlogPost",
    entityId: id,
    description: "Insight removido do CMS.",
  });

  revalidatePath("/insights");
  revalidatePath("/insights/[slug]", "page");
  revalidatePath("/admin/site");
  redirect("/admin/site?success=blog-post");
}

export async function updateMethodologyContentAction(formData: FormData) {
  await requireAdminUser();
  const parsed = methodologySchema.parse({
    heroEyebrow: String(formData.get("heroEyebrow") ?? ""),
    heroTitle: String(formData.get("heroTitle") ?? ""),
    heroDescription: String(formData.get("heroDescription") ?? ""),
    heroAside: String(formData.get("heroAside") ?? ""),
    processTitle: String(formData.get("processTitle") ?? ""),
    processDescription: String(formData.get("processDescription") ?? ""),
    impactEyebrow: String(formData.get("impactEyebrow") ?? ""),
    impactTitle: String(formData.get("impactTitle") ?? ""),
    impactBody: String(formData.get("impactBody") ?? ""),
    ctaTitle: String(formData.get("ctaTitle") ?? ""),
    ctaDescription: String(formData.get("ctaDescription") ?? ""),
    pillars: String(formData.get("pillars") ?? ""),
  });

  await updateMethodologyContent({
    ...parsed,
    impactBody: parseLines(parsed.impactBody),
    pillars: parseLines(parsed.pillars).map((line) => {
      const [title = "", description = ""] = line.split("|").map((item) => item.trim());
      return { title, description };
    }),
  });

  await recordActivity({
    action: "cms.methodology.updated",
    entityType: "SiteSetting",
    description: "Conteudo da pagina de metodologia atualizado.",
  });

  revalidatePath("/metodologia");
  revalidatePath("/admin/site");
  redirect("/admin/site?success=methodology");
}

export async function updateProofAssetsContentAction(formData: FormData) {
  await requireAdminUser();
  const parsed = proofAssetsSchema.parse({
    eyebrow: String(formData.get("eyebrow") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    logos: String(formData.get("logos") ?? ""),
    features: String(formData.get("features") ?? ""),
    mockupEyebrow: String(formData.get("mockupEyebrow") ?? ""),
    mockupTitle: String(formData.get("mockupTitle") ?? ""),
    mockupMetrics: String(formData.get("mockupMetrics") ?? ""),
    mockupBars: String(formData.get("mockupBars") ?? ""),
    creativeEyebrow: String(formData.get("creativeEyebrow") ?? ""),
    creativeTitle: String(formData.get("creativeTitle") ?? ""),
    creativeDescription: String(formData.get("creativeDescription") ?? ""),
    landingEyebrow: String(formData.get("landingEyebrow") ?? ""),
    landingHighlight: String(formData.get("landingHighlight") ?? ""),
  });

  await updateProofAssetsContent({
    ...parsed,
    logos: parseLines(parsed.logos),
    features: parseLines(parsed.features).map((line) => {
      const [title = "", description = ""] = line.split("|").map((item) => item.trim());
      return { title, description };
    }),
    mockupMetrics: parseLines(parsed.mockupMetrics).map((line) => {
      const [value = "", label = ""] = line.split("|").map((item) => item.trim());
      return { value, label };
    }),
    mockupBars: parseLines(parsed.mockupBars).map((line) => {
      const [label = "", width = ""] = line.split("|").map((item) => item.trim());
      return { label, width };
    }),
  });

  await recordActivity({
    action: "cms.proof_assets.updated",
    entityType: "SiteSetting",
    description: "Bloco de prova visual atualizado no CMS.",
  });

  revalidatePath("/");
  revalidatePath("/admin/site");
  redirect("/admin/site?success=proof-assets");
}

export async function updateSectorEntryAction(formData: FormData) {
  await requireAdminUser();
  const parsed = sectorSchema.parse({
    slug: String(formData.get("slug") ?? ""),
    name: String(formData.get("name") ?? ""),
    shortLabel: String(formData.get("shortLabel") ?? ""),
    audience: String(formData.get("audience") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
    heroTitle: String(formData.get("heroTitle") ?? ""),
    heroDescription: String(formData.get("heroDescription") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    keywords: String(formData.get("keywords") ?? ""),
    matchingNiches: String(formData.get("matchingNiches") ?? ""),
    metrics: String(formData.get("metrics") ?? ""),
    painPoints: String(formData.get("painPoints") ?? ""),
    serviceMix: String(formData.get("serviceMix") ?? ""),
    differentiators: String(formData.get("differentiators") ?? ""),
    playbook: String(formData.get("playbook") ?? ""),
    caseHighlights: String(formData.get("caseHighlights") ?? ""),
    ctaTitle: String(formData.get("ctaTitle") ?? ""),
    ctaDescription: String(formData.get("ctaDescription") ?? ""),
  });

  const sectorCatalog = await getSectorCmsCatalog();
  const nextSector: SectorPageContent = {
    slug: parsed.slug,
    name: parsed.name,
    shortLabel: parsed.shortLabel,
    audience: parsed.audience,
    seoDescription: parsed.seoDescription,
    heroTitle: parsed.heroTitle,
    heroDescription: parsed.heroDescription,
    summary: parsed.summary,
    keywords: parseLines(parsed.keywords),
    matchingNiches: parseLines(parsed.matchingNiches),
    metrics: parseJsonField(parsed.metrics, []),
    painPoints: parseLines(parsed.painPoints),
    serviceMix: parseJsonField(parsed.serviceMix, []),
    differentiators: parseLines(parsed.differentiators),
    playbook: parseJsonField(parsed.playbook, []),
    caseHighlights: parseJsonField(parsed.caseHighlights, []),
    ctaTitle: parsed.ctaTitle,
    ctaDescription: parsed.ctaDescription,
  };

  await updateSectorCatalog(
    sectorCatalog.map((item) => (item.slug === parsed.slug ? nextSector : item)),
  );

  await recordActivity({
    action: "cms.sector.updated",
    entityType: "SiteSetting",
    entityId: parsed.slug,
    description: `Pagina de setor ${parsed.name} atualizada no CMS.`,
  });

  revalidatePath("/setores");
  revalidatePath(`/setores/${parsed.slug}`);
  revalidatePath("/admin/site");
  redirect("/admin/site?success=sector");
}

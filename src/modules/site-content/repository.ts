import { Prisma } from "@prisma/client";

import {
  resolveAgencyName,
  resolveHeroSubtitle,
  resolveHeroTitle,
  resolvePrimaryCta,
  resolveSecondaryCta,
} from "@/lib/brand";
import { slugify } from "@/lib/utils";
import { demoStore } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { SectorPageContent } from "@/lib/sector-content";
import type {
  BlogPostRecord,
  CaseStudyRecord,
  FAQRecord,
  MethodologyContentRecord,
  ProofAssetsContentRecord,
  ServiceRecord,
  SiteContentBundle,
  SiteSettingsRecord,
  TestimonialRecord,
} from "@/lib/types";

function normalizeSiteSettings(settings?: Partial<SiteSettingsRecord> | null): SiteSettingsRecord {
  return {
    ...demoStore.settings,
    ...(settings ?? {}),
    agencyName: resolveAgencyName(settings?.agencyName ?? demoStore.settings.agencyName),
    heroTitle: resolveHeroTitle(settings?.heroTitle ?? demoStore.settings.heroTitle),
    heroSubtitle: resolveHeroSubtitle(settings?.heroSubtitle ?? demoStore.settings.heroSubtitle),
    primaryCta: resolvePrimaryCta(settings?.primaryCta ?? demoStore.settings.primaryCta),
    secondaryCta: resolveSecondaryCta(settings?.secondaryCta ?? demoStore.settings.secondaryCta),
  };
}

function normalizeMethodologyContent(settings?: Partial<MethodologyContentRecord> | null): MethodologyContentRecord {
  return {
    ...demoStore.methodology,
    ...(settings ?? {}),
    pillars: settings?.pillars ?? demoStore.methodology.pillars,
    impactBody: settings?.impactBody ?? demoStore.methodology.impactBody,
  };
}

function normalizeProofAssetsContent(settings?: Partial<ProofAssetsContentRecord> | null): ProofAssetsContentRecord {
  return {
    ...demoStore.proofAssets,
    ...(settings ?? {}),
    logos: settings?.logos ?? demoStore.proofAssets.logos,
    features: settings?.features ?? demoStore.proofAssets.features,
    mockupMetrics: settings?.mockupMetrics ?? demoStore.proofAssets.mockupMetrics,
    mockupBars: settings?.mockupBars ?? demoStore.proofAssets.mockupBars,
  };
}

function normalizeSectorCatalog(settings?: SectorPageContent[] | null): SectorPageContent[] {
  return settings?.length ? settings : demoStore.sectorCatalog;
}

async function upsertSiteSetting(key: string, value: Prisma.InputJsonValue) {
  if (!prisma) {
    throw new Error("No database client");
  }

  await prisma.siteSetting.upsert({
    where: { key },
    update: {
      value,
    },
    create: {
      key,
      value,
    },
  });
}

export async function getSiteContent(): Promise<SiteContentBundle> {
  return withFallback(
    async () => {
      if (!prisma) {
        return {
          settings: demoStore.settings,
          services: demoStore.services,
          testimonials: demoStore.testimonials,
          caseStudies: demoStore.caseStudies,
          faqs: demoStore.faqs,
          blogPosts: demoStore.blogPosts,
          methodology: demoStore.methodology,
          proofAssets: demoStore.proofAssets,
        };
      }

      const [settings, services, testimonials, caseStudies, faqs, blogPosts] = await Promise.all([
        prisma.siteSetting.findMany(),
        prisma.service.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "asc" }] }),
        prisma.testimonial.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "asc" }] }),
        prisma.caseStudy.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "asc" }] }),
        prisma.fAQ.findMany({ orderBy: { order: "asc" } }),
        prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } }),
      ]);

      const mappedSettings =
        settings.find((item) => item.key === "marketing.hero")?.value as SiteContentBundle["settings"] | undefined;
      const mappedMethodology = settings.find((item) => item.key === "marketing.methodology")?.value as
        | MethodologyContentRecord
        | undefined;
      const mappedProofAssets = settings.find((item) => item.key === "marketing.proofAssets")?.value as
        | ProofAssetsContentRecord
        | undefined;

      return {
        settings: normalizeSiteSettings(mappedSettings),
        services: services.length
          ? services.map((service) => ({
              id: service.id,
              name: service.name,
              slug: service.slug,
              description: service.description,
              benefit: service.benefit,
              featured: service.featured,
            }))
          : demoStore.services,
        testimonials: testimonials.length
          ? testimonials.map((testimonial) => ({
              id: testimonial.id,
              authorName: testimonial.authorName,
              role: testimonial.role,
              company: testimonial.company,
              quote: testimonial.quote,
              featured: testimonial.featured,
            }))
          : demoStore.testimonials,
        caseStudies: caseStudies.length
          ? caseStudies.map((caseStudy) => ({
              id: caseStudy.id,
              slug: slugify(caseStudy.title),
              title: caseStudy.title,
              niche: caseStudy.niche,
              challenge: caseStudy.challenge,
              solution: caseStudy.solution,
              result: caseStudy.result,
              metrics: (caseStudy.metrics ?? {}) as Record<string, string | number>,
              featured: caseStudy.featured,
            }))
          : demoStore.caseStudies,
        faqs: faqs.length
          ? faqs.map((faq) => ({
              id: faq.id,
              question: faq.question,
              answer: faq.answer,
              order: faq.order,
            }))
          : demoStore.faqs,
        blogPosts: blogPosts.length
          ? blogPosts.map((post) => ({
              id: post.id,
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: post.content,
              category: post.category,
              publishedAt: post.publishedAt?.toISOString(),
            }))
          : demoStore.blogPosts,
        methodology: normalizeMethodologyContent(mappedMethodology),
        proofAssets: normalizeProofAssetsContent(mappedProofAssets),
      };
    },
    () => ({
      settings: normalizeSiteSettings(demoStore.settings),
      services: demoStore.services,
      testimonials: demoStore.testimonials,
      caseStudies: demoStore.caseStudies,
      faqs: demoStore.faqs,
      blogPosts: demoStore.blogPosts,
      methodology: demoStore.methodology,
      proofAssets: demoStore.proofAssets,
    }),
  );
}

export async function getSectorCmsCatalog(): Promise<SectorPageContent[]> {
  return withFallback(
    async () => {
      if (!prisma) {
        return demoStore.sectorCatalog;
      }

      const setting = await prisma.siteSetting.findUnique({
        where: { key: "marketing.sectors" },
      });

      return normalizeSectorCatalog((setting?.value as SectorPageContent[] | null) ?? null);
    },
    () => demoStore.sectorCatalog,
  );
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyRecord | null> {
  const content = await getSiteContent();
  return content.caseStudies.find((caseStudy) => caseStudy.slug === slug) ?? null;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostRecord | null> {
  const content = await getSiteContent();
  return content.blogPosts.find((post) => post.slug === slug) ?? null;
}

export async function updateSiteSettings(settings: SiteSettingsRecord) {
  return withFallback(
    async () => {
      await upsertSiteSetting("marketing.hero", normalizeSiteSettings(settings));

      return normalizeSiteSettings(settings);
    },
    () => {
      demoStore.settings = normalizeSiteSettings(settings);
      return demoStore.settings;
    },
  );
}

export async function updateMethodologyContent(settings: MethodologyContentRecord) {
  const normalized = normalizeMethodologyContent(settings);

  return withFallback(
    async () => {
      await upsertSiteSetting("marketing.methodology", normalized);
      return normalized;
    },
    () => {
      demoStore.methodology = normalized;
      return demoStore.methodology;
    },
  );
}

export async function updateProofAssetsContent(settings: ProofAssetsContentRecord) {
  const normalized = normalizeProofAssetsContent(settings);

  return withFallback(
    async () => {
      await upsertSiteSetting("marketing.proofAssets", normalized);
      return normalized;
    },
    () => {
      demoStore.proofAssets = normalized;
      return demoStore.proofAssets;
    },
  );
}

export async function updateSectorCatalog(settings: SectorPageContent[]) {
  const normalized = normalizeSectorCatalog(settings);

  return withFallback(
    async () => {
      await upsertSiteSetting("marketing.sectors", normalized);
      return normalized;
    },
    () => {
      demoStore.sectorCatalog = normalized;
      return demoStore.sectorCatalog;
    },
  );
}

export async function createServiceEntry(input: Omit<ServiceRecord, "id" | "slug"> & { featured?: boolean }) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const service = await prisma.service.create({
        data: {
          name: input.name,
          slug: slugify(input.name),
          description: input.description,
          benefit: input.benefit,
          featured: input.featured ?? false,
        },
      });

      return {
        id: service.id,
        name: service.name,
        slug: service.slug,
        description: service.description,
        benefit: service.benefit,
        featured: service.featured,
      } satisfies ServiceRecord;
    },
    () => {
      const service = {
        id: `svc_${Math.random().toString(36).slice(2, 10)}`,
        name: input.name,
        slug: slugify(input.name),
        description: input.description,
        benefit: input.benefit,
        featured: input.featured ?? false,
      } satisfies ServiceRecord;

      demoStore.services.unshift(service);
      return service;
    },
  );
}

export async function createTestimonialEntry(input: Omit<TestimonialRecord, "id"> & { featured?: boolean }) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const testimonial = await prisma.testimonial.create({
        data: {
          authorName: input.authorName,
          role: input.role,
          company: input.company,
          quote: input.quote,
          featured: input.featured ?? false,
        },
      });

      return {
        id: testimonial.id,
        authorName: testimonial.authorName,
        role: testimonial.role,
        company: testimonial.company,
        quote: testimonial.quote,
        featured: testimonial.featured,
      } satisfies TestimonialRecord;
    },
    () => {
      const testimonial = {
        id: `test_${Math.random().toString(36).slice(2, 10)}`,
        authorName: input.authorName,
        role: input.role,
        company: input.company,
        quote: input.quote,
        featured: input.featured ?? false,
      } satisfies TestimonialRecord;

      demoStore.testimonials.unshift(testimonial);
      return testimonial;
    },
  );
}

export async function createFAQEntry(input: Omit<FAQRecord, "id" | "order"> & { order?: number }) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const faq = await prisma.fAQ.create({
        data: {
          question: input.question,
          answer: input.answer,
          order: input.order ?? demoStore.faqs.length + 1,
        },
      });

      return {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
      } satisfies FAQRecord;
    },
    () => {
      const faq = {
        id: `faq_${Math.random().toString(36).slice(2, 10)}`,
        question: input.question,
        answer: input.answer,
        order: input.order ?? demoStore.faqs.length + 1,
      } satisfies FAQRecord;

      demoStore.faqs.push(faq);
      return faq;
    },
  );
}

export async function createCaseStudyEntry(input: Omit<CaseStudyRecord, "id" | "slug">) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const caseStudy = await prisma.caseStudy.create({
        data: {
          title: input.title,
          niche: input.niche,
          challenge: input.challenge,
          solution: input.solution,
          result: input.result,
          metrics: input.metrics ?? {},
          featured: input.featured ?? false,
        },
      });

      return {
        id: caseStudy.id,
        slug: slugify(caseStudy.title),
        title: caseStudy.title,
        niche: caseStudy.niche,
        challenge: caseStudy.challenge,
        solution: caseStudy.solution,
        result: caseStudy.result,
        metrics: (caseStudy.metrics ?? {}) as Record<string, string | number>,
        featured: caseStudy.featured,
      } satisfies CaseStudyRecord;
    },
    () => {
      const caseStudy = {
        id: `case_${Math.random().toString(36).slice(2, 10)}`,
        slug: slugify(input.title),
        title: input.title,
        niche: input.niche,
        challenge: input.challenge,
        solution: input.solution,
        result: input.result,
        metrics: input.metrics ?? {},
        featured: input.featured ?? false,
      } satisfies CaseStudyRecord;

      demoStore.caseStudies.unshift(caseStudy);
      return caseStudy;
    },
  );
}

export async function updateCaseStudyEntry(id: string, input: Omit<CaseStudyRecord, "id" | "slug">) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const caseStudy = await prisma.caseStudy.update({
        where: { id },
        data: {
          title: input.title,
          niche: input.niche,
          challenge: input.challenge,
          solution: input.solution,
          result: input.result,
          metrics: input.metrics ?? {},
          featured: input.featured ?? false,
        },
      });

      return {
        id: caseStudy.id,
        slug: slugify(caseStudy.title),
        title: caseStudy.title,
        niche: caseStudy.niche,
        challenge: caseStudy.challenge,
        solution: caseStudy.solution,
        result: caseStudy.result,
        metrics: (caseStudy.metrics ?? {}) as Record<string, string | number>,
        featured: caseStudy.featured,
      } satisfies CaseStudyRecord;
    },
    () => {
      const caseStudy = demoStore.caseStudies.find((item) => item.id === id);

      if (caseStudy) {
        Object.assign(caseStudy, {
          ...input,
          slug: slugify(input.title),
        });
      }

      return caseStudy ?? null;
    },
  );
}

export async function deleteCaseStudyEntry(id: string) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      return prisma.caseStudy.delete({
        where: { id },
      });
    },
    () => {
      const index = demoStore.caseStudies.findIndex((item) => item.id === id);
      if (index >= 0) {
        demoStore.caseStudies.splice(index, 1);
      }
      return null;
    },
  );
}

export async function createBlogPostEntry(input: Omit<BlogPostRecord, "id" | "slug">) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const post = await prisma.blogPost.create({
        data: {
          title: input.title,
          slug: slugify(input.title),
          excerpt: input.excerpt,
          content: input.content,
          category: input.category,
          publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        },
      });

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        publishedAt: post.publishedAt?.toISOString(),
      } satisfies BlogPostRecord;
    },
    () => {
      const post = {
        id: `blog_${Math.random().toString(36).slice(2, 10)}`,
        title: input.title,
        slug: slugify(input.title),
        excerpt: input.excerpt,
        content: input.content,
        category: input.category,
        publishedAt: input.publishedAt ?? undefined,
      } satisfies BlogPostRecord;

      demoStore.blogPosts.unshift(post);
      return post;
    },
  );
}

export async function updateBlogPostEntry(id: string, input: Omit<BlogPostRecord, "id" | "slug">) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      const post = await prisma.blogPost.update({
        where: { id },
        data: {
          title: input.title,
          slug: slugify(input.title),
          excerpt: input.excerpt,
          content: input.content,
          category: input.category,
          publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        },
      });

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        publishedAt: post.publishedAt?.toISOString(),
      } satisfies BlogPostRecord;
    },
    () => {
      const post = demoStore.blogPosts.find((item) => item.id === id);

      if (post) {
        Object.assign(post, {
          ...input,
          slug: slugify(input.title),
        });
      }

      return post ?? null;
    },
  );
}

export async function deleteBlogPostEntry(id: string) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      return prisma.blogPost.delete({
        where: { id },
      });
    },
    () => {
      const index = demoStore.blogPosts.findIndex((item) => item.id === id);
      if (index >= 0) {
        demoStore.blogPosts.splice(index, 1);
      }
      return null;
    },
  );
}

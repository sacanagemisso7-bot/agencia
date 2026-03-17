import { slugify } from "@/lib/utils";
import { demoStore } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { FAQRecord, ServiceRecord, SiteContentBundle, SiteSettingsRecord, TestimonialRecord } from "@/lib/types";

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

      return {
        settings: mappedSettings ?? demoStore.settings,
        services: services.map((service) => ({
          id: service.id,
          name: service.name,
          slug: service.slug,
          description: service.description,
          benefit: service.benefit,
          featured: service.featured,
        })),
        testimonials: testimonials.map((testimonial) => ({
          id: testimonial.id,
          authorName: testimonial.authorName,
          role: testimonial.role,
          company: testimonial.company,
          quote: testimonial.quote,
          featured: testimonial.featured,
        })),
        caseStudies: caseStudies.map((caseStudy) => ({
          id: caseStudy.id,
          title: caseStudy.title,
          niche: caseStudy.niche,
          challenge: caseStudy.challenge,
          solution: caseStudy.solution,
          result: caseStudy.result,
          metrics: (caseStudy.metrics ?? {}) as Record<string, string | number>,
          featured: caseStudy.featured,
        })),
        faqs: faqs.map((faq) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          order: faq.order,
        })),
        blogPosts: blogPosts.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          category: post.category,
          publishedAt: post.publishedAt?.toISOString(),
        })),
      };
    },
    () => ({
      settings: demoStore.settings,
      services: demoStore.services,
      testimonials: demoStore.testimonials,
      caseStudies: demoStore.caseStudies,
      faqs: demoStore.faqs,
      blogPosts: demoStore.blogPosts,
    }),
  );
}

export async function updateSiteSettings(settings: SiteSettingsRecord) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      await prisma.siteSetting.upsert({
        where: { key: "marketing.hero" },
        update: {
          value: settings,
        },
        create: {
          key: "marketing.hero",
          value: settings,
        },
      });

      return settings;
    },
    () => {
      demoStore.settings = settings;
      return settings;
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

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  createFAQEntry,
  createServiceEntry,
  createTestimonialEntry,
  updateSiteSettings,
} from "@/modules/site-content/repository";
import { recordActivity } from "@/modules/shared/activity-log";

const settingsSchema = z.object({
  agencyName: z.string().min(2),
  heroTitle: z.string().min(8),
  heroSubtitle: z.string().min(8),
  primaryCta: z.string().min(2),
  secondaryCta: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  whatsapp: z.string().min(5),
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

export async function updateSiteSettingsAction(formData: FormData) {
  const parsed = settingsSchema.parse({
    agencyName: String(formData.get("agencyName") ?? ""),
    heroTitle: String(formData.get("heroTitle") ?? ""),
    heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
    primaryCta: String(formData.get("primaryCta") ?? ""),
    secondaryCta: String(formData.get("secondaryCta") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
  });

  await updateSiteSettings(parsed);

  await recordActivity({
    action: "cms.settings.updated",
    entityType: "SiteSetting",
    description: "Configuracoes principais do site atualizadas.",
  });

  revalidatePath("/");
  revalidatePath("/sobre");
  revalidatePath("/servicos");
  revalidatePath("/contato");
  revalidatePath("/admin/site");
  redirect("/admin/site?success=settings");
}

export async function createServiceEntryAction(formData: FormData) {
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

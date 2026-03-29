import type { Metadata } from "next";

import { getBrandDescription, getBrandName, replaceLegacyBrandReferences } from "@/lib/brand";
import { env } from "@/lib/env";

const siteName = getBrandName();
const defaultDescription = getBrandDescription();
const fallbackBaseUrl = "http://localhost:3000";
const baseUrlCandidates = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_URL,
  env.appUrl,
];

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function parseBaseUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const withProtocol = trimmed.includes("://")
    ? trimmed
    : trimmed.startsWith("localhost") || trimmed.startsWith("127.0.0.1")
      ? `http://${trimmed}`
      : `https://${trimmed}`;
  const candidate = normalizeBaseUrl(withProtocol);

  try {
    return new URL(candidate);
  } catch {
    return null;
  }
}

function resolveBaseUrl() {
  for (const candidate of baseUrlCandidates) {
    if (!candidate) {
      continue;
    }

    const parsed = parseBaseUrl(candidate);
    if (parsed) {
      return parsed;
    }
  }

  return new URL(fallbackBaseUrl);
}

export function getSiteName() {
  return siteName;
}

export function getMetadataBase() {
  return resolveBaseUrl();
}

export function getAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${getMetadataBase().origin}/`).toString();
}

type BuildMetadataInput = {
  title: string;
  description?: string;
  path?: string;
  imagePath?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  keywords?: string[];
};

export function buildPageMetadata({
  title,
  description = defaultDescription,
  path = "/",
  imagePath = "/opengraph-image",
  type = "website",
  noIndex = false,
  publishedTime,
  keywords,
}: BuildMetadataInput): Metadata {
  const canonical = getAbsoluteUrl(path);
  const image = getAbsoluteUrl(imagePath);
  const resolvedTitle = replaceLegacyBrandReferences(title);
  const resolvedDescription = replaceLegacyBrandReferences(description);

  return {
    metadataBase: getMetadataBase(),
    title: resolvedTitle,
    description: resolvedDescription,
    keywords,
    alternates: {
      canonical,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
          },
        },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      siteName,
      locale: "pt_BR",
      type,
      publishedTime,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${resolvedTitle} | ${siteName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [image],
    },
  };
}

export function buildNoIndexMetadata(title: string, description: string): Metadata {
  return buildPageMetadata({
    title,
    description,
    noIndex: true,
  });
}

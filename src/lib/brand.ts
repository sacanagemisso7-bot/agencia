export const BRAND_NAME = "Ameni";
export const BRAND_COMPANY_NAME = "Ameni Digital Marketing";
export const BRAND_SLOGAN = "Amenize a complexidade potencialize seus resultados";
export const BRAND_DESCRIPTION =
  "A Ameni assume estratégia, tráfego, conteúdo, social media, web e posicionamento para reduzir complexidade e acelerar resultado com mais clareza.";

const LEGACY_AGENCY_NAMES = new Set(["Atlas Growth Studio"]);
const LEGACY_HERO_TITLES = new Set([
  "Trafego, oferta e operacao comercial alinhados para escalar vendas de alto ticket.",
]);
const LEGACY_HERO_SUBTITLES = new Set([
  "Unimos estrategia, midia, CRO e IA comercial para transformar investimento em pipeline previsivel.",
  "Unimos trafego pago, organico, social, video, web e branding em uma experiencia de marca sofisticada e comercialmente incisiva.",
]);
const LEGACY_PRIMARY_CTAS = new Set(["Agendar diagnostico", "Solicitar diagnostico"]);
const LEGACY_SECONDARY_CTAS = new Set(["Ver cases", "Agendar reuniao"]);

export function getBrandName() {
  return BRAND_NAME;
}

export function getBrandCompanyName() {
  return BRAND_COMPANY_NAME;
}

export function getBrandSlogan() {
  return BRAND_SLOGAN;
}

export function getBrandDescription() {
  return BRAND_DESCRIPTION;
}

export function replaceLegacyBrandReferences(text: string) {
  return text
    .replaceAll("Atlas Growth Studio", BRAND_NAME)
    .replaceAll("Atlas OS", BRAND_COMPANY_NAME)
    .replaceAll("Atlas operating system", BRAND_COMPANY_NAME)
    .replaceAll("Ameni OS", BRAND_COMPANY_NAME)
    .replaceAll("Ameni Operating System", BRAND_COMPANY_NAME)
    .replaceAll("Ameni operating system", BRAND_COMPANY_NAME);
}

export function resolveAgencyName(value?: string | null) {
  const normalized = replaceLegacyBrandReferences(value?.trim() ?? "");
  if (!normalized || LEGACY_AGENCY_NAMES.has(normalized)) {
    return BRAND_NAME;
  }

  return normalized;
}

export function resolveHeroTitle(value?: string | null) {
  const normalized = replaceLegacyBrandReferences(value?.trim() ?? "");
  if (!normalized || LEGACY_HERO_TITLES.has(normalized)) {
    return BRAND_SLOGAN;
  }

  return normalized;
}

export function resolveHeroSubtitle(value?: string | null) {
  const normalized = replaceLegacyBrandReferences(value?.trim() ?? "");
  if (!normalized || LEGACY_HERO_SUBTITLES.has(normalized)) {
    return "A Ameni conduz tráfego pago, orgânico, social media, conteúdo, web e posicionamento para transformar marketing em uma operação mais clara, elegante e orientada a resultado.";
  }

  return normalized;
}

export function resolvePrimaryCta(value?: string | null) {
  const normalized = replaceLegacyBrandReferences(value?.trim() ?? "");
  if (!normalized || LEGACY_PRIMARY_CTAS.has(normalized)) {
    return "Solicitar diagnóstico";
  }

  return normalized;
}

export function resolveSecondaryCta(value?: string | null) {
  const normalized = replaceLegacyBrandReferences(value?.trim() ?? "");
  if (!normalized || LEGACY_SECONDARY_CTAS.has(normalized)) {
    return "Agendar reunião";
  }

  return normalized;
}

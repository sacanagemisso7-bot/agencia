export function toWhatsAppHref(value?: string | null) {
  const sanitized = value?.replace(/\D/g, "") ?? "";

  if (!sanitized) {
    return "/contato";
  }

  return `https://wa.me/${sanitized}`;
}

export function buildCalendarEmbedUrl(value?: string | null) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);
    url.searchParams.set("hide_gdpr_banner", "1");

    if (url.hostname.includes("calendly.com")) {
      url.searchParams.set("background_color", "060b14");
      url.searchParams.set("text_color", "ffffff");
      url.searchParams.set("primary_color", "34d399");
    }

    return url.toString();
  } catch {
    return value;
  }
}

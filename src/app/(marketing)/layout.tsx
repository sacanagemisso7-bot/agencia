import type { ReactNode } from "react";

import { FloatingContactRail } from "@/components/marketing/floating-contact-rail";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import {
  MarketingThemeProvider,
  marketingThemeInitScript,
} from "@/components/platform/marketing-theme-provider";
import { StructuredData } from "@/components/marketing/structured-data";
import { getAbsoluteUrl, getSiteName } from "@/lib/seo";
import { getSiteContent } from "@/modules/site-content/repository";

export default async function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const content = await getSiteContent();
  const agencyName = getSiteName();

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: marketingThemeInitScript }} />
      <MarketingThemeProvider>
        <div className="marketing-shell relative min-h-screen overflow-x-clip">
          <div className="marketing-shell-aurora pointer-events-none absolute inset-0" />
          <div className="marketing-shell-veil pointer-events-none absolute inset-0" />
          <div className="ambient-grid marketing-shell-grid pointer-events-none absolute inset-0" />
          <div className="noise-mask marketing-shell-noise pointer-events-none absolute inset-0" />
          <div className="marketing-shell-glow-a pointer-events-none absolute left-[-12rem] top-[-10rem] size-[36rem] rounded-full blur-[160px]" />
          <div className="marketing-shell-glow-b pointer-events-none absolute right-[-10rem] top-[10rem] size-[30rem] rounded-full blur-[150px]" />
          <div className="marketing-shell-glow-c pointer-events-none absolute bottom-[-12rem] left-1/2 size-[36rem] -translate-x-1/2 rounded-full blur-[180px]" />
          <div className="relative pb-28 xl:pb-0">
            <StructuredData
              data={[
                {
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: agencyName,
                  url: getAbsoluteUrl("/"),
                  email: content.settings.email,
                  telephone: content.settings.phone,
                  sameAs: [content.settings.instagramUrl, content.settings.linkedinUrl].filter(Boolean),
                  contactPoint: [
                    {
                      "@type": "ContactPoint",
                      telephone: content.settings.phone,
                      email: content.settings.email,
                      contactType: "sales",
                      availableLanguage: ["Portuguese"],
                    },
                  ],
                },
                {
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  name: agencyName,
                  url: getAbsoluteUrl("/"),
                },
              ]}
              id="marketing-organization-schema"
            />
            <SiteHeader agencyName={agencyName} />
            <FloatingContactRail calendarUrl={content.settings.calendarUrl} whatsapp={content.settings.whatsapp} />
            {children}
            <SiteFooter
              agencyName={agencyName}
              email={content.settings.email}
              phone={content.settings.phone}
              instagramUrl={content.settings.instagramUrl}
              linkedinUrl={content.settings.linkedinUrl}
              services={content.services}
              whatsapp={content.settings.whatsapp}
            />
          </div>
        </div>
      </MarketingThemeProvider>
    </>
  );
}

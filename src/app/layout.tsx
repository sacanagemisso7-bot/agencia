import type { ReactNode } from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";

import "@/app/globals.css";
import { Analytics } from "@/components/platform/analytics";
import { ClientObservability } from "@/components/platform/client-observability";
import { env } from "@/lib/env";
import { buildPageMetadata } from "@/lib/seo";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = buildPageMetadata({
  title: "Ameni | Amenize a complexidade potencialize seus resultados",
  description:
    "Ameni integra estrategia, performance, conteudo, web e automacao para reduzir complexidade, organizar a operacao e potencializar resultados.",
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      className={`${jakarta.variable} ${fraunces.variable}`}
      data-theme="light"
      lang="pt-BR"
      suppressHydrationWarning
    >
      <body className="font-sans text-ink-950 antialiased">
        <Suspense fallback={null}>
          <Analytics
            gaMeasurementId={env.gaMeasurementId}
            posthogHost={env.posthogHost}
            posthogKey={env.posthogKey}
          />
        </Suspense>
        <ClientObservability
          enabled={Boolean(env.observabilityWebhookUrl || env.publicSentryDsn || env.sentryDsn)}
        />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

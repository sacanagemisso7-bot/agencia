import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { Toaster } from "sonner";

import "@/app/globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atlas Growth Studio",
  description: "Agencia premium de trafego pago com CRM, operacao e IA comercial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className={`${manrope.variable} ${sora.variable}`} lang="pt-BR">
      <body className="font-sans text-ink-950 antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { ArrowUpRight, MoveUpRight } from "lucide-react";

import { AmeniLogo } from "@/components/branding/ameni-logo";
import { useMarketingTheme } from "@/components/platform/marketing-theme-provider";
import { getBrandSlogan, resolveAgencyName } from "@/lib/brand";
import { getMarketingServices } from "@/lib/marketing-content";
import { marketingNavigation } from "@/lib/navigation";
import type { ServiceRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SiteFooter({
  agencyName,
  email,
  phone,
  whatsapp,
  instagramUrl,
  linkedinUrl,
  services = [],
}: {
  agencyName: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagramUrl: string;
  linkedinUrl: string;
  services?: ServiceRecord[];
}) {
  const serviceLinks = getMarketingServices(services);
  const brandName = resolveAgencyName(agencyName);
  const { effectiveTheme } = useMarketingTheme();
  const light = effectiveTheme === "light";

  return (
    <footer className={cn("mt-24", light ? "border-t border-emerald-700/10 text-emerald-950" : "border-t border-mist-100/10 bg-[#030811] text-white")}>
      <div className="container-shell py-16 sm:py-20">
        <div
          className={cn(
            "relative overflow-hidden rounded-[40px] px-6 py-8 sm:px-8 sm:py-10",
            light
              ? "border border-emerald-700/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(241,250,245,0.94))] shadow-[0_30px_100px_rgba(15,66,53,0.08)]"
              : "border border-mist-100/10 bg-[linear-gradient(180deg,rgba(8,17,34,0.98),rgba(4,10,21,0.98))] shadow-[0_34px_120px_rgba(0,0,0,0.4)]",
          )}
        >
          <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent", light ? "via-emerald-500/55" : "via-mist-100/65")} />
          <div className={cn("pointer-events-none absolute left-[-6rem] top-[-6rem] size-56 rounded-full blur-[90px]", light ? "bg-emerald-400/14" : "bg-emerald-400/12")} />
          <div className={cn("pointer-events-none absolute right-[-6rem] bottom-[-8rem] size-72 rounded-full blur-[110px]", light ? "bg-emerald-500/12" : "bg-jade-400/12")} />
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.7fr_0.95fr_0.8fr]">
            <div>
              <p className="eyebrow-line">Ameni signature</p>
              <div className="mt-6">
                <AmeniLogo name={brandName} theme={light ? "light" : "dark"} />
              </div>
              <p className={cn("mt-5 max-w-md text-sm leading-8", light ? "text-emerald-950/64" : "text-mist-100/58")}>
                {getBrandSlogan()}. Estratégia, tráfego, conteúdo, social media, web e posicionamento em uma operação
                pensada para reduzir ruído, simplificar decisões e acelerar resultado.
              </p>
              <div className={cn("mt-7 flex flex-wrap gap-3 text-sm", light ? "text-emerald-950/64" : "text-mist-100/64")}>
                <Link className={cn("inline-flex items-center gap-2 transition", light ? "hover:text-emerald-950" : "hover:text-white")} href={instagramUrl} rel="noreferrer" target="_blank">
                  Instagram
                  <ArrowUpRight className="size-4" />
                </Link>
                <Link className={cn("inline-flex items-center gap-2 transition", light ? "hover:text-emerald-950" : "hover:text-white")} href={linkedinUrl} rel="noreferrer" target="_blank">
                  LinkedIn
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
              <Link
                className={cn(
                  "mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition",
                  light
                    ? "border border-emerald-700/10 bg-white/74 text-emerald-950 hover:border-emerald-500/20"
                    : "border border-mist-100/10 bg-[linear-gradient(135deg,rgba(16,31,56,0.96),rgba(8,15,29,0.94))] text-mist-50 hover:border-jade-300/30 hover:text-white",
                )}
                href="/contato"
              >
                Iniciar conversa estratégica
                <MoveUpRight className="size-4" />
              </Link>
            </div>

            <div>
              <p className={cn("text-[11px] font-semibold uppercase tracking-[0.3em]", light ? "text-emerald-950/34" : "text-mist-100/32")}>Navegação</p>
              <div className={cn("mt-6 flex flex-col gap-3 text-sm", light ? "text-emerald-950/64" : "text-mist-100/60")}>
                {marketingNavigation.map((item) => (
                  <Link className={cn("transition", light ? "hover:text-emerald-950" : "hover:text-white")} href={item.href} key={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className={cn("text-[11px] font-semibold uppercase tracking-[0.3em]", light ? "text-emerald-950/34" : "text-mist-100/32")}>Serviços</p>
              <div className={cn("mt-6 grid gap-3 text-sm", light ? "text-emerald-950/64" : "text-mist-100/60")}>
                {serviceLinks.map((service) => (
                  <Link className={cn("transition", light ? "hover:text-emerald-950" : "hover:text-white")} href={`/${service.slug}`} key={service.slug}>
                    {service.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className={cn("text-[11px] font-semibold uppercase tracking-[0.3em]", light ? "text-emerald-950/34" : "text-mist-100/32")}>Contato</p>
              <div className={cn("mt-6 space-y-3 text-sm", light ? "text-emerald-950/64" : "text-mist-100/60")}>
                <p>{email}</p>
                <p>{phone}</p>
                <p>{whatsapp}</p>
                <p>São Paulo, Brasil</p>
              </div>
            </div>
          </div>

          <div className={cn("mt-12 border-t pt-5 text-xs uppercase tracking-[0.24em]", light ? "border-emerald-700/10 text-emerald-950/34" : "border-mist-100/10 text-mist-100/32")}>
            {getBrandSlogan()}.
          </div>
        </div>
      </div>
    </footer>
  );
}

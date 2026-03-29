"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, MoonStar, MoveUpRight, SunMedium, X } from "lucide-react";

import { AmeniMark } from "@/components/branding/ameni-logo";
import { useMarketingTheme } from "@/components/platform/marketing-theme-provider";
import { Button } from "@/components/ui/button";
import { getBrandName, resolveAgencyName } from "@/lib/brand";
import { marketingNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader({ agencyName }: { agencyName: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const resolvedAgencyName = resolveAgencyName(agencyName);
  const brandName = resolvedAgencyName.toLowerCase().includes("ameni") ? getBrandName() : resolvedAgencyName;
  const { canToggle, effectiveTheme, setTheme, theme } = useMarketingTheme();
  const light = effectiveTheme === "light";

  return (
    <header className="sticky top-0 z-50 pt-4">
      <div className="container-shell">
        <div
          className={cn(
            "relative flex min-h-[78px] items-center justify-between gap-6 overflow-hidden rounded-[28px] px-4 backdrop-blur-2xl sm:px-6",
            light
              ? "border border-emerald-700/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.84),rgba(241,250,245,0.88))] shadow-[0_24px_80px_rgba(16,74,58,0.08)]"
              : "border border-mist-100/10 bg-[linear-gradient(135deg,rgba(10,20,39,0.92),rgba(4,10,22,0.88))] shadow-[0_24px_80px_rgba(0,0,0,0.3)]",
          )}
        >
          <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent", light ? "via-emerald-500/55" : "via-mist-100/70")} />
          <div className={cn("pointer-events-none absolute -left-16 top-0 size-40 rounded-full blur-[60px]", light ? "bg-emerald-400/18" : "bg-emerald-400/14")} />
          <div className={cn("pointer-events-none absolute right-0 top-0 size-40 rounded-full blur-[72px]", light ? "bg-emerald-500/12" : "bg-jade-400/12")} />
          <Link className="group flex shrink-0 items-center" href="/">
            <div className="flex shrink-0 items-center gap-3 pr-2">
              <div
                className={cn(
                  "relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full transition duration-300 group-hover:scale-[1.03]",
                  light
                    ? "bg-[radial-gradient(circle_at_30%_30%,rgba(40,199,165,0.18),rgba(255,255,255,0.96))] ring-1 ring-emerald-950/8"
                    : "bg-[radial-gradient(circle_at_30%_30%,rgba(48,226,188,0.16),rgba(9,18,34,0.94))] ring-1 ring-white/10",
                )}
              >
                <div className={cn("absolute inset-0 opacity-70", light ? "bg-[linear-gradient(135deg,transparent,rgba(40,199,165,0.12))]" : "bg-[linear-gradient(135deg,transparent,rgba(143,182,255,0.14))]")} />
                <AmeniMark className="relative h-8 w-auto" navy={light ? "#1B315B" : "#DDEBFF"} teal={light ? "#28C7A5" : "#30E2BC"} />
              </div>
              <div className="shrink-0">
                <p
                  className={cn(
                    "whitespace-nowrap font-display text-[1.7rem] leading-none tracking-[-0.06em] transition",
                    light
                      ? "text-[#17345D] group-hover:text-[#102747]"
                      : "bg-[linear-gradient(180deg,rgba(248,251,255,0.98),rgba(162,198,255,0.88))] bg-clip-text text-transparent",
                  )}
                >
                  {brandName}
                </p>
              </div>
            </div>
          </Link>

          <nav className={cn("hidden items-center gap-6 text-sm xl:flex", light ? "text-emerald-950/58" : "text-mist-100/60")}>
            {marketingNavigation.map((item) => (
              <Link
                className={cn(
                  "relative py-2 transition duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[linear-gradient(90deg,#30E2BC,#9AD8FF)] after:transition-all after:duration-300 hover:after:w-full",
                  light ? "hover:text-emerald-950" : "hover:text-white",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            {canToggle ? (
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full border p-1",
                  light
                    ? "border-emerald-700/10 bg-white/70"
                    : "border-mist-100/10 bg-[linear-gradient(180deg,rgba(12,23,43,0.92),rgba(7,14,28,0.92))]",
                )}
              >
                <button
                  aria-label="Ativar tema claro"
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition",
                    theme === "light"
                      ? light
                        ? "bg-[linear-gradient(135deg,#28C7A5,#7AE9D1)] text-emerald-950"
                        : "bg-white text-ink-950"
                      : light
                        ? "text-emerald-950/54 hover:text-emerald-950"
                        : "text-mist-100/56 hover:text-white",
                  )}
                  onClick={() => setTheme("light")}
                  type="button"
                >
                  <SunMedium className="size-4" />
                  Claro
                </button>
                <button
                  aria-label="Ativar tema escuro"
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition",
                    theme === "dark"
                      ? light
                        ? "bg-emerald-950 text-white"
                        : "bg-[linear-gradient(135deg,#30E2BC,#8FB6FF)] text-ink-950"
                      : light
                        ? "text-emerald-950/54 hover:text-emerald-950"
                        : "text-mist-100/56 hover:text-white",
                  )}
                  onClick={() => setTheme("dark")}
                  type="button"
                >
                  <MoonStar className="size-4" />
                  Escuro
                </button>
              </div>
            ) : null}
            <Link href="/contato">
              <Button
                className={cn(
                  "rounded-full px-5 transition hover:brightness-105",
                  light
                    ? "border border-emerald-700/10 bg-[linear-gradient(135deg,#28C7A5,#7AE9D1)] text-emerald-950 shadow-[0_16px_36px_rgba(40,199,165,0.2)]"
                    : "border border-white/10 bg-[linear-gradient(135deg,#30E2BC,#8FB6FF)] text-ink-950 shadow-[0_16px_36px_rgba(77,170,224,0.24)]",
                )}
                size="sm"
              >
                Solicitar diagnóstico
                <MoveUpRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>

          <button
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className={cn(
              "flex size-11 items-center justify-center rounded-full border xl:hidden",
              light
                ? "border-emerald-700/10 bg-white/72 text-emerald-950"
                : "border-mist-100/10 bg-[linear-gradient(180deg,rgba(14,28,49,0.9),rgba(8,15,30,0.88))] text-white",
            )}
            onClick={() => setMenuOpen((current) => !current)}
            type="button"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <div
          className={cn(
            "grid overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] xl:hidden",
            menuOpen ? "grid-rows-[1fr] pt-3 opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="min-h-0">
            <div
              className={cn(
                "rounded-[26px] border p-3 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-2xl",
                light
                  ? "border-emerald-700/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(241,250,245,0.94))]"
                  : "border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,20,39,0.96),rgba(5,11,24,0.96))]",
              )}
            >
              <div className="grid gap-2">
                {marketingNavigation.map((item) => (
                  <Link
                    className={cn(
                      "rounded-[18px] px-4 py-3 text-sm transition",
                      light
                        ? "text-emerald-950/68 hover:bg-emerald-500/8 hover:text-emerald-950"
                        : "text-mist-100/72 hover:bg-white/[0.05] hover:text-white",
                    )}
                    href={item.href}
                    key={item.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {canToggle ? (
                  <div className={cn("grid gap-2 sm:col-span-2 sm:grid-cols-2", light ? "text-emerald-950" : "text-white")}>
                    <button
                      className={cn(
                        "rounded-full border px-4 py-3 text-sm transition",
                        theme === "light"
                          ? light
                            ? "border-emerald-700/10 bg-[linear-gradient(135deg,#28C7A5,#7AE9D1)] text-emerald-950"
                            : "border-white/10 bg-white text-ink-950"
                          : light
                            ? "border-emerald-700/10 bg-white/72 text-emerald-950/72"
                            : "border-mist-100/10 bg-white/[0.04] text-mist-100/72",
                      )}
                      onClick={() => setTheme("light")}
                      type="button"
                    >
                      Tema claro
                    </button>
                    <button
                      className={cn(
                        "rounded-full border px-4 py-3 text-sm transition",
                        theme === "dark"
                          ? light
                            ? "border-emerald-950 bg-emerald-950 text-white"
                            : "border-white/10 bg-[linear-gradient(135deg,#30E2BC,#8FB6FF)] text-ink-950"
                          : light
                            ? "border-emerald-700/10 bg-white/72 text-emerald-950/72"
                            : "border-mist-100/10 bg-white/[0.04] text-mist-100/72",
                      )}
                      onClick={() => setTheme("dark")}
                      type="button"
                    >
                      Tema escuro
                    </button>
                  </div>
                ) : null}
                <Link href="/como-funciona" onClick={() => setMenuOpen(false)}>
                  <Button
                    className={cn(
                      "w-full rounded-full",
                      light
                        ? "border border-emerald-700/10 bg-white/78 text-emerald-950 hover:bg-white"
                        : "border border-mist-100/10 bg-[linear-gradient(180deg,rgba(13,25,45,0.96),rgba(8,14,28,0.94))] text-white hover:bg-[linear-gradient(180deg,rgba(16,30,53,0.98),rgba(9,17,33,0.96))]",
                    )}
                    size="sm"
                  >
                    Como funciona
                  </Button>
                </Link>
                <Link href="/contato" onClick={() => setMenuOpen(false)}>
                  <Button
                    className={cn(
                      "w-full rounded-full hover:brightness-105",
                      light
                        ? "border border-emerald-700/10 bg-[linear-gradient(135deg,#28C7A5,#7AE9D1)] text-emerald-950"
                        : "border border-white/10 bg-[linear-gradient(135deg,#30E2BC,#8FB6FF)] text-ink-950",
                    )}
                    size="sm"
                  >
                    Solicitar diagnóstico
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

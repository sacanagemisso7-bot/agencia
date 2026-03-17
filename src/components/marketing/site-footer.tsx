import Link from "next/link";

import { marketingNavigation } from "@/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink-950/8 bg-ink-950 text-white">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl">Atlas Growth Studio</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
            Performance, oferta e operacao comercial alinhados para marcas que querem crescer com previsibilidade.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">Navegacao</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            {marketingNavigation.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">Contato</p>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            <p>contato@atlasgrowth.studio</p>
            <p>+55 11 98888-0000</p>
            <p>Sao Paulo, Brasil</p>
          </div>
        </div>
      </div>
    </footer>
  );
}


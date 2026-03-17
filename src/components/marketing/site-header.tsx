import Link from "next/link";

import { Button } from "@/components/ui/button";
import { marketingNavigation } from "@/lib/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-sand-50/85 backdrop-blur">
      <div className="container-shell flex h-20 items-center justify-between">
        <Link className="font-display text-xl text-ink-950" href="/">
          Atlas Growth Studio
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink-950/70 md:flex">
          {marketingNavigation.map((item) => (
            <Link className="transition hover:text-ink-950" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/contato">
          <Button size="sm">Falar com a agencia</Button>
        </Link>
      </div>
    </header>
  );
}


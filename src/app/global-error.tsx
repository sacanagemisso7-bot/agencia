"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void fetch("/api/observability/client-error", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "react.global-error",
        message: error.message,
        digest: error.digest,
      }),
    }).catch(() => undefined);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="bg-[#060b14] text-white">
        <main className="container-shell flex min-h-screen items-center justify-center py-16">
          <div className="max-w-2xl rounded-[34px] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Erro inesperado</p>
            <h1 className="mt-5 font-display text-4xl text-white">A pagina encontrou um problema inesperado.</h1>
            <p className="mt-5 text-sm leading-7 text-white/62">
              O evento foi registrado na camada de observabilidade. Voce pode tentar novamente agora.
            </p>
            <div className="mt-8 flex justify-center">
              <Button className="border border-emerald-300/18 bg-emerald-400 text-ink-950 hover:bg-emerald-300" onClick={() => reset()}>
                Tentar novamente
              </Button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

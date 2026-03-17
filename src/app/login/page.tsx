import { LockKeyhole } from "lucide-react";

import { LoginForm } from "@/components/forms/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="grid w-full max-w-5xl overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-ink-950 p-10 text-white">
          <div className="inline-flex rounded-full bg-white/10 p-3">
            <LockKeyhole className="size-5" />
          </div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Admin login</p>
          <h1 className="mt-4 font-display text-4xl">Entre no sistema operacional da agencia.</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
            Acesse leads, clientes, propostas, mensagens, central IA e a visao executiva do negocio em um unico lugar.
          </p>
        </div>
        <div className="p-10">
          <p className="text-sm uppercase tracking-[0.18em] text-ink-950/45">Acesso seguro</p>
          <h2 className="mt-3 font-display text-3xl text-ink-950">Painel Atlas OS</h2>
          <p className="mt-3 text-sm leading-7 text-ink-950/65">
            Use as credenciais do admin configuradas no ambiente ou a seed inicial do projeto.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </Card>
    </main>
  );
}


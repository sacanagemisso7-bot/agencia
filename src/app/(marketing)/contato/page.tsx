import { LeadCaptureForm } from "@/components/marketing/lead-capture-form";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Card } from "@/components/ui/card";
import { PageToast } from "@/components/ui/page-toast";

export default async function ContatoPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  const query = await searchParams;

  return (
    <main className="container-shell py-20">
      <PageToast
        message={query?.success === "1" ? "Recebemos seu contato e o lead entrou no CRM." : undefined}
      />
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading
            eyebrow="Contato"
            title="Vamos mapear a operacao e identificar os gargalos de crescimento."
            description="Se preferir, nos chame pelo WhatsApp ou email. O formulario abaixo ja cria o lead diretamente no CRM."
          />
          <Card className="mt-8 space-y-4 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-500">Email</p>
              <p className="mt-1 text-sm text-ink-950/70">contato@atlasgrowth.studio</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-500">WhatsApp</p>
              <p className="mt-1 text-sm text-ink-950/70">+55 11 98888-0000</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-500">Agendamento</p>
              <p className="mt-1 text-sm text-ink-950/70">Resposta inicial em ate 1 dia util.</p>
            </div>
          </Card>
        </div>
        <Card className="p-8">
          <LeadCaptureForm />
        </Card>
      </div>
    </main>
  );
}

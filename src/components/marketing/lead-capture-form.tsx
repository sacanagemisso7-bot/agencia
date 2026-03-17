import { captureLeadFromSiteAction } from "@/modules/leads/actions";

import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function LeadCaptureForm() {
  return (
    <form action={captureLeadFromSiteAction} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="name" placeholder="Seu nome" required />
        <Input name="email" placeholder="Seu melhor email" required type="email" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="phone" placeholder="WhatsApp" />
        <Input name="company" placeholder="Empresa" />
      </div>
      <Input name="objective" placeholder="Objetivo principal" />
      <Textarea
        name="message"
        placeholder="Conte um pouco sobre o momento da sua empresa, ticket e meta de crescimento."
      />
      <SubmitButton className="w-full" size="lg">
        Solicitar diagnostico
      </SubmitButton>
    </form>
  );
}


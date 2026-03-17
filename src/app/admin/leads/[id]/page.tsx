import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { leadStatusOptions } from "@/lib/navigation";
import { convertLeadToClientAction, updateLeadAction } from "@/modules/leads/actions";
import { getLeadById } from "@/modules/leads/repository";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  return (
    <AdminShell title="Editar lead" description="Atualize os dados, o status do funil e as observacoes internas.">
      <Card className="max-w-3xl p-6">
        <form action={updateLeadAction.bind(null, lead.id)} className="grid gap-4">
          <Input defaultValue={lead.name} name="name" placeholder="Nome" required />
          <Input defaultValue={lead.email} name="email" placeholder="Email" required type="email" />
          <Input defaultValue={lead.phone ?? ""} name="phone" placeholder="Telefone" />
          <Input defaultValue={lead.company ?? ""} name="company" placeholder="Empresa" />
          <Input defaultValue={lead.niche ?? ""} name="niche" placeholder="Nicho" />
          <Input defaultValue={lead.objective ?? ""} name="objective" placeholder="Objetivo" />
          <Input defaultValue={lead.source} name="source" placeholder="Origem" />
          <Input defaultValue={lead.tags.join(", ")} name="tags" placeholder="Tags" />
          <Select defaultValue={lead.status} name="status">
            {leadStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Textarea defaultValue={lead.message ?? ""} name="message" placeholder="Mensagem original" />
          <Textarea defaultValue={lead.notes ?? ""} name="notes" placeholder="Observacoes internas" />
          <Button type="submit">Salvar alteracoes</Button>
        </form>
        {lead.status !== "WON" ? (
          <form action={convertLeadToClientAction} className="mt-4">
            <input name="id" type="hidden" value={lead.id} />
            <Button type="submit" variant="secondary">
              Converter este lead em cliente
            </Button>
          </form>
        ) : null}
      </Card>
    </AdminShell>
  );
}

import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { campaignPlatformOptions, campaignStatusOptions } from "@/lib/navigation";
import { updateCampaignAction } from "@/modules/campaigns/actions";
import { getCampaignById } from "@/modules/campaigns/repository";
import { listClients } from "@/modules/clients/repository";

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [campaign, clients] = await Promise.all([getCampaignById(id), listClients()]);

  if (!campaign) {
    notFound();
  }

  return (
    <AdminShell title="Editar campanha" description="Ajuste objetivo, budget, plataforma e status da campanha.">
      <Card className="max-w-4xl p-6">
        <form action={updateCampaignAction.bind(null, campaign.id)} className="grid gap-4">
          <Input defaultValue={campaign.name} name="name" placeholder="Nome" />
          <Textarea defaultValue={campaign.objective} name="objective" placeholder="Objetivo" />
          <Select defaultValue={campaign.platform} name="platform">
            {campaignPlatformOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select defaultValue={campaign.status} name="status">
            {campaignStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input defaultValue={campaign.budget?.toString() ?? ""} name="budget" placeholder="Budget" type="number" />
          <Select defaultValue={campaign.clientId} name="clientId">
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.companyName}
              </option>
            ))}
          </Select>
          <Textarea defaultValue={campaign.notes ?? ""} name="notes" placeholder="Observacoes" />
          <Button type="submit">Salvar alteracoes</Button>
        </form>
      </Card>
    </AdminShell>
  );
}

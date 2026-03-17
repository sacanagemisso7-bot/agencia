import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageToast } from "@/components/ui/page-toast";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { campaignPlatformOptions, campaignStatusOptions } from "@/lib/navigation";
import { createCampaignAction, deleteCampaignAction } from "@/modules/campaigns/actions";
import { listCampaigns } from "@/modules/campaigns/repository";
import { listClients } from "@/modules/clients/repository";

function getCampaignToast(success?: string) {
  switch (success) {
    case "created":
      return "Campanha criada com sucesso.";
    case "deleted":
      return "Campanha removida.";
    case "updated":
      return "Campanha atualizada.";
    default:
      return null;
  }
}

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  const [campaigns, clients] = await Promise.all([listCampaigns(), listClients()]);
  const query = await searchParams;

  return (
    <AdminShell title="Campanhas" description="Controle de contas ativas, objetivos, budget, plataforma e metricas basicas.">
      <PageToast message={getCampaignToast(query?.success)} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Nova campanha</h2>
          <form action={createCampaignAction} className="mt-6 grid gap-4">
            <Input name="name" placeholder="Nome da campanha" required />
            <Textarea name="objective" placeholder="Objetivo" />
            <Select defaultValue="META" name="platform">
              {campaignPlatformOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select defaultValue="PLANNING" name="status">
              {campaignStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Input name="budget" placeholder="Budget" type="number" />
            <Select defaultValue="" name="clientId">
              <option value="">Selecione o cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.companyName}
                </option>
              ))}
            </Select>
            <Textarea name="notes" placeholder="Observacoes" />
            <Button type="submit">Salvar campanha</Button>
          </form>
        </Card>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Campanha</TableHeaderCell>
                  <TableHeaderCell>Plataforma</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Budget</TableHeaderCell>
                  <TableHeaderCell className="text-right">Acoes</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <p className="font-medium text-ink-950">{campaign.name}</p>
                      <p className="text-xs text-ink-950/55">{campaign.clientName}</p>
                    </TableCell>
                    <TableCell>{campaign.platform}</TableCell>
                    <TableCell>
                      <Badge tone={campaign.status === "ACTIVE" || campaign.status === "OPTIMIZING" ? "success" : "neutral"}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(campaign.budget)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/campaigns/${campaign.id}`}>
                          <Button size="sm" variant="secondary">
                            Editar
                          </Button>
                        </Link>
                        <form action={deleteCampaignAction}>
                          <input name="id" type="hidden" value={campaign.id} />
                          <Button size="sm" type="submit" variant="ghost">
                            Excluir
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}

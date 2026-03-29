import { AdminShell } from "@/components/admin/admin-shell";
import { WorkHub, type WorkView } from "@/components/admin/work-hub";
import { PageToast } from "@/components/ui/page-toast";
import { listClients } from "@/modules/clients/repository";
import { listLeads } from "@/modules/leads/repository";
import { requireBackofficeUser } from "@/modules/auth/guards";
import { getWorkHubData } from "@/modules/work/repository";

function getWorkView(value?: string): WorkView {
  const allowedViews: WorkView[] = ["list", "board", "calendar", "table", "timeline", "my"];
  return allowedViews.includes(value as WorkView) ? (value as WorkView) : "list";
}

function getWorkToast(success?: string) {
  switch (success) {
    case "project-created":
      return "Projeto criado e conectado ao Work OS.";
    case "list-created":
      return "Lista operacional adicionada ao projeto.";
    case "task-created":
      return "Tarefa criada com sucesso.";
    case "subtask-created":
      return "Subtarefa criada e vinculada ao item pai.";
    case "template-created":
      return "Template operacional salvo.";
    case "custom-field-created":
      return "Campo customizado criado.";
    default:
      return null;
  }
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams?: Promise<{ view?: string; success?: string }>;
}) {
  const user = await requireBackofficeUser();
  const query = await searchParams;
  const view = getWorkView(query?.view);
  const [workHub, clients, leads] = await Promise.all([
    getWorkHubData(user.id),
    listClients(),
    listLeads(),
  ]);

  return (
    <AdminShell
      title="Work OS"
      description="Hierarquia real de trabalho, templates operacionais, custom fields e multiplas views sincronizadas para a operacao inteira da agencia."
    >
      <PageToast message={getWorkToast(query?.success)} />
      <WorkHub clients={clients} data={workHub} leads={leads} view={view} />
    </AdminShell>
  );
}

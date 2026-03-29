import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { WorkTaskDetail } from "@/components/admin/work-task-detail";
import { PageToast } from "@/components/ui/page-toast";
import { requireBackofficeUser } from "@/modules/auth/guards";
import { listActivityLogs } from "@/modules/logs/repository";
import { getWorkHubData, getWorkTaskById } from "@/modules/work/repository";

function getTaskToast(success?: string) {
  switch (success) {
    case "comment-created":
      return "Comentario registrado no historico da tarefa.";
    case "checklist-created":
      return "Novo item de checklist adicionado.";
    case "subtask-created":
      return "Subtarefa criada com sucesso.";
    case "custom-field-updated":
      return "Campo customizado atualizado.";
    default:
      return null;
  }
}

export default async function WorkTaskPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ success?: string }>;
}) {
  const user = await requireBackofficeUser();
  const route = await params;
  const query = await searchParams;
  const [task, workHub, activities] = await Promise.all([
    getWorkTaskById(route.id, user.id),
    getWorkHubData(user.id),
    listActivityLogs({ taskId: route.id, take: 14 }),
  ]);

  if (!task) {
    notFound();
  }

  const taskCustomFields = workHub.customFields.filter((field) => field.entityType === "TASK");

  return (
    <AdminShell
      title={task.title}
      description="Comentarios, subtarefas, checklist, dependencias e dados estruturados da task dentro da malha operacional do Agency OS."
    >
      <PageToast message={getTaskToast(query?.success)} />
      <WorkTaskDetail
        activities={activities}
        customFieldDefinitions={taskCustomFields}
        task={task}
        users={workHub.users}
      />
    </AdminShell>
  );
}

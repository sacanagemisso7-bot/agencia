import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { taskPriorityOptions, taskStatusOptions } from "@/lib/navigation";
import { listClients } from "@/modules/clients/repository";
import { listLeads } from "@/modules/leads/repository";
import { updateTaskAction } from "@/modules/tasks/actions";
import { getTaskById } from "@/modules/tasks/repository";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [task, clients, leads] = await Promise.all([getTaskById(id), listClients(), listLeads()]);

  if (!task) {
    notFound();
  }

  return (
    <AdminShell title="Editar tarefa" description="Atualize prioridade, prazo, relacionamento e andamento operacional.">
      <Card className="max-w-4xl p-6">
        <form action={updateTaskAction.bind(null, task.id)} className="grid gap-4">
          <Input defaultValue={task.title} name="title" placeholder="Titulo" />
          <Textarea defaultValue={task.description ?? ""} name="description" placeholder="Descricao" />
          <Select defaultValue={task.status} name="status">
            {taskStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select defaultValue={task.priority} name="priority">
            {taskPriorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input defaultValue={task.dueDate?.slice(0, 10) ?? ""} name="dueDate" type="date" />
          <Select defaultValue={task.clientId ?? ""} name="clientId">
            <option value="">Sem cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.companyName}
              </option>
            ))}
          </Select>
          <Select defaultValue={task.leadId ?? ""} name="leadId">
            <option value="">Sem lead</option>
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.name}
              </option>
            ))}
          </Select>
          <Button type="submit">Salvar alteracoes</Button>
        </form>
      </Card>
    </AdminShell>
  );
}


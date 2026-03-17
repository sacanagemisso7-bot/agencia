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
import { formatDate } from "@/lib/formatters";
import { taskPriorityOptions, taskStatusOptions } from "@/lib/navigation";
import { listClients } from "@/modules/clients/repository";
import { listLeads } from "@/modules/leads/repository";
import { createTaskAction, deleteTaskAction } from "@/modules/tasks/actions";
import { listTasks } from "@/modules/tasks/repository";

function getTaskToast(success?: string) {
  switch (success) {
    case "created":
      return "Tarefa criada com sucesso.";
    case "deleted":
      return "Tarefa removida.";
    case "updated":
      return "Tarefa atualizada.";
    default:
      return null;
  }
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  const [tasks, clients, leads] = await Promise.all([listTasks(), listClients(), listLeads()]);
  const query = await searchParams;

  return (
    <AdminShell title="Tarefas" description="Operacao, prazos, prioridades e associacao a leads ou clientes.">
      <PageToast message={getTaskToast(query?.success)} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Nova tarefa</h2>
          <form action={createTaskAction} className="mt-6 grid gap-4">
            <Input name="title" placeholder="Titulo" required />
            <Textarea name="description" placeholder="Descricao" />
            <Select defaultValue="TODO" name="status">
              {taskStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select defaultValue="MEDIUM" name="priority">
              {taskPriorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Input name="dueDate" type="date" />
            <Select defaultValue="" name="clientId">
              <option value="">Sem cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.companyName}
                </option>
              ))}
            </Select>
            <Select defaultValue="" name="leadId">
              <option value="">Sem lead</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name}
                </option>
              ))}
            </Select>
            <Button type="submit">Salvar tarefa</Button>
          </form>
        </Card>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Tarefa</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Prioridade</TableHeaderCell>
                  <TableHeaderCell>Prazo</TableHeaderCell>
                  <TableHeaderCell className="text-right">Acoes</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <p className="font-medium text-ink-950">{task.title}</p>
                      <p className="text-xs text-ink-950/55">{task.clientName ?? task.leadName ?? "-"}</p>
                    </TableCell>
                    <TableCell>
                      <Badge tone={task.status === "DONE" ? "success" : "neutral"}>{task.status}</Badge>
                    </TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>{formatDate(task.dueDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/tasks/${task.id}`}>
                          <Button size="sm" variant="secondary">
                            Editar
                          </Button>
                        </Link>
                        <form action={deleteTaskAction}>
                          <input name="id" type="hidden" value={task.id} />
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

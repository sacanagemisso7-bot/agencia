"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createTask, deleteTask, updateTask } from "@/modules/tasks/repository";
import { recordActivity } from "@/modules/shared/activity-log";

const taskSchema = z.object({
  title: z.string().min(3, "Titulo obrigatorio."),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().optional(),
  clientId: z.string().optional(),
  leadId: z.string().optional(),
});

export async function createTaskAction(formData: FormData) {
  const parsed = taskSchema.parse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: String(formData.get("status") ?? "TODO"),
    priority: String(formData.get("priority") ?? "MEDIUM"),
    dueDate: String(formData.get("dueDate") ?? ""),
    clientId: String(formData.get("clientId") ?? ""),
    leadId: String(formData.get("leadId") ?? ""),
  });

  const task = await createTask({
    ...parsed,
    dueDate: parsed.dueDate || undefined,
    clientId: parsed.clientId || undefined,
    leadId: parsed.leadId || undefined,
  });

  await recordActivity({
    action: "task.created",
    entityType: "Task",
    entityId: task.id,
    description: "Tarefa adicionada a operacao.",
    clientId: task.clientId,
    leadId: task.leadId,
    taskId: task.id,
  });

  revalidatePath("/admin/tasks");
  revalidatePath("/admin");
  revalidatePath("/admin/notifications");
  redirect("/admin/tasks?success=created");
}

export async function deleteTaskAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await deleteTask(id);

  await recordActivity({
    action: "task.deleted",
    entityType: "Task",
    entityId: id,
    description: "Tarefa removida.",
    taskId: id,
  });

  revalidatePath("/admin/tasks");
  revalidatePath("/admin/notifications");
  redirect("/admin/tasks?success=deleted");
}

export async function updateTaskAction(id: string, formData: FormData) {
  const parsed = taskSchema.parse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: String(formData.get("status") ?? "TODO"),
    priority: String(formData.get("priority") ?? "MEDIUM"),
    dueDate: String(formData.get("dueDate") ?? ""),
    clientId: String(formData.get("clientId") ?? ""),
    leadId: String(formData.get("leadId") ?? ""),
  });

  const task = await updateTask(id, {
    ...parsed,
    dueDate: parsed.dueDate || undefined,
    clientId: parsed.clientId || undefined,
    leadId: parsed.leadId || undefined,
  });

  await recordActivity({
    action: "task.updated",
    entityType: "Task",
    entityId: id,
    description: "Tarefa atualizada pela operacao.",
    clientId: task?.clientId,
    leadId: task?.leadId,
    taskId: id,
  });

  revalidatePath("/admin/tasks");
  revalidatePath("/admin/notifications");
  redirect("/admin/tasks?success=updated");
}

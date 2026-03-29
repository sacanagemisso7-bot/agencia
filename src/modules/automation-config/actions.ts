"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { runAutomationCycle } from "@/modules/automation/runner";
import { requireAdminUser } from "@/modules/auth/guards";
import { recordActivity } from "@/modules/shared/activity-log";

import { updateAutomationSettings } from "./repository";

const automationSchema = z.object({
  highIntentThreshold: z.coerce.number().min(20).max(100),
  leadSlaImmediateHours: z.coerce.number().min(1).max(72),
  leadSlaThirtyDaysHours: z.coerce.number().min(1).max(120),
  leadSlaSixtyToNinetyDaysHours: z.coerce.number().min(1).max(240),
  leadSlaPlanningHours: z.coerce.number().min(1).max(240),
  leadSlaDefaultHours: z.coerce.number().min(1).max(240),
  leadReminderDelayHours: z.coerce.number().min(1).max(120),
  proposalFollowUpAfterDays: z.coerce.number().min(1).max(30),
  proposalFollowUpChannel: z.enum(["EMAIL", "WHATSAPP", "INTERNAL", "SMS"]),
  internalAlertRecipients: z.string().min(5),
});

export async function updateAutomationSettingsAction(formData: FormData) {
  await requireAdminUser();
  const parsed = automationSchema.parse({
    highIntentThreshold: formData.get("highIntentThreshold"),
    leadSlaImmediateHours: formData.get("leadSlaImmediateHours"),
    leadSlaThirtyDaysHours: formData.get("leadSlaThirtyDaysHours"),
    leadSlaSixtyToNinetyDaysHours: formData.get("leadSlaSixtyToNinetyDaysHours"),
    leadSlaPlanningHours: formData.get("leadSlaPlanningHours"),
    leadSlaDefaultHours: formData.get("leadSlaDefaultHours"),
    leadReminderDelayHours: formData.get("leadReminderDelayHours"),
    proposalFollowUpAfterDays: formData.get("proposalFollowUpAfterDays"),
    proposalFollowUpChannel: String(formData.get("proposalFollowUpChannel") ?? "EMAIL"),
    internalAlertRecipients: String(formData.get("internalAlertRecipients") ?? ""),
  });

  await updateAutomationSettings(parsed);

  await recordActivity({
    action: "automation.settings.updated",
    entityType: "SiteSetting",
    description: "Regras de automacao comercial atualizadas pelo admin.",
    metadata: {
      highIntentThreshold: parsed.highIntentThreshold,
      proposalFollowUpAfterDays: parsed.proposalFollowUpAfterDays,
      proposalFollowUpChannel: parsed.proposalFollowUpChannel,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/automations");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/pipeline");
  revalidatePath("/admin/notifications");
  redirect("/admin/automations?success=saved");
}

export async function runAutomationCycleAction() {
  await requireAdminUser();
  const result = await runAutomationCycle();

  await recordActivity({
    action: "automation.cycle.manual_run",
    entityType: "System",
    description: "Ciclo assincrono de automacoes executado manualmente pelo admin.",
    metadata: result,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/automations");
  revalidatePath("/admin/messages");
  revalidatePath("/admin/notifications");
  revalidatePath("/admin/finance");
  redirect("/admin/automations?success=cycle");
}

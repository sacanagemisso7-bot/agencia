import { resolveAutomationSettings } from "@/lib/automation-config";
import { demoStore } from "@/lib/demo-store";
import { prisma, withFallback } from "@/lib/prisma";
import type { AutomationSettingsRecord } from "@/lib/types";

const AUTOMATION_SETTINGS_KEY = "automation.rules";

export async function getAutomationSettings(): Promise<AutomationSettingsRecord> {
  return withFallback(
    async () => {
      if (!prisma) {
        return resolveAutomationSettings(demoStore.automationSettings);
      }

      const setting = await prisma.siteSetting.findUnique({
        where: { key: AUTOMATION_SETTINGS_KEY },
      });

      return resolveAutomationSettings(setting?.value as Partial<AutomationSettingsRecord> | undefined);
    },
    () => resolveAutomationSettings(demoStore.automationSettings),
  );
}

export async function updateAutomationSettings(settings: AutomationSettingsRecord) {
  return withFallback(
    async () => {
      if (!prisma) {
        throw new Error("No database client");
      }

      await prisma.siteSetting.upsert({
        where: { key: AUTOMATION_SETTINGS_KEY },
        update: { value: settings },
        create: {
          key: AUTOMATION_SETTINGS_KEY,
          value: settings,
        },
      });

      return settings;
    },
    () => {
      demoStore.automationSettings = settings;
      return settings;
    },
  );
}

export async function getResolvedAutomationSummary() {
  const settings = await getAutomationSettings();

  return {
    settings,
    highIntentThreshold: settings.highIntentThreshold,
    followUpWindowDays: settings.proposalFollowUpAfterDays,
    internalRecipientsCount: settings.internalAlertRecipients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean).length,
    slaWindows: [
      { label: "Imediata", hours: settings.leadSlaImmediateHours },
      { label: "30 dias", hours: settings.leadSlaThirtyDaysHours },
      { label: "60-90 dias", hours: settings.leadSlaSixtyToNinetyDaysHours },
      { label: "Planejamento", hours: settings.leadSlaPlanningHours },
      { label: "Padrao", hours: settings.leadSlaDefaultHours },
    ],
  };
}

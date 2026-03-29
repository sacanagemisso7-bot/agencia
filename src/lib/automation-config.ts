import type { AutomationSettingsRecord } from "@/lib/types";

export const defaultAutomationSettings: AutomationSettingsRecord = {
  highIntentThreshold: 60,
  leadSlaImmediateHours: 2,
  leadSlaThirtyDaysHours: 6,
  leadSlaSixtyToNinetyDaysHours: 24,
  leadSlaPlanningHours: 48,
  leadSlaDefaultHours: 48,
  leadReminderDelayHours: 3,
  proposalFollowUpAfterDays: 3,
  proposalFollowUpChannel: "EMAIL",
  internalAlertRecipients: "admin@agencia-premium.com",
};

export function resolveAutomationSettings(
  value?: Partial<AutomationSettingsRecord> | null,
): AutomationSettingsRecord {
  return {
    ...defaultAutomationSettings,
    ...value,
  };
}

export function parseRecipientList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

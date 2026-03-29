import { logOperationalEvent } from "@/lib/logger";
import { syncFinancialOverdueEntries } from "@/modules/finance/service";
import { processQueuedMessages } from "@/modules/messages/queue";
import { runOperationalMonitors } from "@/modules/notifications/service";

export async function runAutomationCycle() {
  const financial = await syncFinancialOverdueEntries();
  const monitors = await runOperationalMonitors();
  const messages = await processQueuedMessages();

  const result = {
    financial,
    monitors,
    messages,
  };

  await logOperationalEvent({
    level: "info",
    event: "automation.cycle.completed",
    message: "Ciclo assincrono de automacoes executado.",
    metadata: result,
  });

  return result;
}

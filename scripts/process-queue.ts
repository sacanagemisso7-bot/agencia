import { runAutomationCycle } from "../src/modules/automation/runner";

async function main() {
  const result = await runAutomationCycle();
  console.log(
    JSON.stringify(
      {
        message: "Automation cycle processed",
        ...result,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { processQueuedMessages } from "../src/modules/messages/queue";

async function main() {
  const result = await processQueuedMessages();
  console.log(
    JSON.stringify(
      {
        message: "Queue processed",
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

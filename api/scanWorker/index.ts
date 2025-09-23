import { app, InvocationContext } from "@azure/functions";
import { QueueClient } from "@azure/storage-queue";

async function runOnce(ctx: InvocationContext) {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING!;
  const qName = process.env.SCAN_QUEUE_NAME || "scan-jobs";
  const queue = new QueueClient(conn, qName);
  const r = await queue.receiveMessages({ numberOfMessages: 16, visibilityTimeout: 30 });
  for (const m of r.receivedMessageItems) {
    try {
      const payload = JSON.parse(Buffer.from(m.messageText!, "base64").toString());
      // TODO: do your scan task here (e.g., fetch satellite tile, compute NDVI, or just schedule a field route)
      ctx.log("Scan point:", payload.point);
      await queue.deleteMessage(m.messageId!, m.popReceipt!);
    } catch (e:any) {
      ctx.error(e);
    }
  }
}

// Timer trigger every minute
app.timer("scanWorker", { schedule: "0 * * * * *", handler: runOnce });

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { classifyOpenAI, classifyAzureOpenAI, classifyAzureVision } from "../lib/providers.js";

function regionPrior(lat?: number, lon?: number) {
  // Bela‑Bela pegmatite bias for field accuracy
  const base = "Region: Bela‑Bela/Waterberg pegmatites; expect tourmaline (elbaite/schorl), beryl (aquamarine), garnet (spessartine), smoky quartz, amazonite; also fluorite; industrials: coltan, cassiterite, chromite.";
  if (lat == null || lon == null) return base;
  return `${base} GPS≈(${lat.toFixed(4)}, ${lon.toFixed(4)}).`;
}

export async function classify(req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const { imageUrl, gps, hints } = await req.json();
    if (!imageUrl) return { status: 400, jsonBody: { error: "imageUrl required" } };

    const provider = (process.env.CLASSIFIER_PROVIDER || "azure-openai").toLowerCase();
    const prior = `${regionPrior(gps?.lat, gps?.lon)} ${Array.isArray(hints) ? hints.join("; ") : ""}`;

    let out;
    if (provider === "openai") out = await classifyOpenAI(imageUrl, prior);
    else if (provider === "azure-vision") out = await classifyAzureVision(imageUrl, prior);
    else out = await classifyAzureOpenAI(imageUrl, prior); // default

    return { status: 200, jsonBody: out };
  } catch (e: any) {
    ctx.error(e);
    return { status: 500, jsonBody: { error: e.message } };
  }
}

app.http("classify", { methods: ["POST"], authLevel: "function", handler: classify });

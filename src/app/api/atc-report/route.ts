import { validateAtcReport } from "@/lib/atc-report";
import {
  ATC_REPORT_ENDPOINT,
  isReportConfirmed,
  toGoogleForm,
} from "@/lib/atc-report-delivery";

export async function POST(request: Request) {
  const json = (body: object, status: number) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (request.headers.get("sec-fetch-site") === "cross-site")
    return json({ error: "forbidden" }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return json({ error: "invalid_request" }, 415);
  let input: unknown;
  try {
    const body = await request.text();
    if (body.length > 20000) return json({ error: "too_large" }, 413);
    input = JSON.parse(body);
  } catch {
    return json({ error: "invalid_request" }, 400);
  }
  const { data, valid, errors } = validateAtcReport(input);
  if (!valid)
    return json({ error: "validation", fields: Object.keys(errors) }, 400);
  try {
    // One request only: retrying after an uncertain response could duplicate it.
    const response = await fetch(ATC_REPORT_ENDPOINT, {
      method: "POST",
      body: toGoogleForm(data),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok || !isReportConfirmed(await response.text()))
      return json({ error: "unconfirmed" }, 502);
    return json({ ok: true, receivedAt: new Date().toISOString() }, 200);
  } catch {
    // No personal information in logs. The client retains its draft on failure.
    return json({ error: "unconfirmed" }, 502);
  }
}

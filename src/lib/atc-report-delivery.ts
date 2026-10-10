import type { AtcReport } from "./atc-report";

// Same destination and field mapping as vatbrz_forms, authorised by the owner.
export const ATC_REPORT_ENDPOINT =
  "https://docs.google.com/forms/d/e/1FAIpQLSfg3W9ivSToH9wdz8RXPb082jBUBxnTP4vGq2tz0lsipvsm_w/formResponse?hl=en";

export function toGoogleForm(data: AtcReport) {
  const [year, month, day] = data.date.split("-");
  const [hour, minute] = data.time.split(":");
  return new URLSearchParams({
    "entry.1781118946": data.cid,
    "entry.420586714": data.name,
    "entry.1326481568": data.email,
    "entry.1304941585": data.controllerName,
    "entry.258151617": data.controllerCid,
    "entry.641875680": data.position,
    "entry.158787368_year": year,
    "entry.158787368_month": month,
    "entry.158787368_day": day,
    "entry.1751532403_hour": hour,
    "entry.1751532403_minute": minute,
    "entry.548207857": data.rating,
    "entry.1270383311": data.comments,
  });
}

export function isReportConfirmed(html: string) {
  // Google's form configuration also contains the success message. Only accept
  // visible confirmation text, never scripts or a form returned with errors.
  const visible = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  return (
    !/<form\b/i.test(visible) &&
    /Seu feedback foi registrado|Your feedback has been recorded/i.test(
      visible.replace(/<[^>]*>/g, " "),
    )
  );
}

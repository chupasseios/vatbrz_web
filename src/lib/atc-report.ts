export const ATC_RATINGS = [
  "Excelente / Excellent",
  "Bom / Good",
  "Regular",
  "Ruim / Bad",
] as const;
export type AtcReport = {
  cid: string;
  name: string;
  email: string;
  controllerName: string;
  controllerCid: string;
  position: string;
  date: string;
  time: string;
  rating: string;
  comments: string;
};
export type ReportErrors = Partial<Record<keyof AtcReport, string>>;
export const emptyReport: AtcReport = {
  cid: "",
  name: "",
  email: "",
  controllerName: "",
  controllerCid: "",
  position: "",
  date: "",
  time: "",
  rating: "",
  comments: "",
};

// Constraints verified against the official form on 2026-10-10.
export function validateAtcReport(input: unknown, lang = "pt-br") {
  const data = { ...emptyReport };
  const errors: ReportErrors = {};
  const text = (pt: string, en: string) => (lang === "en" ? en : pt);
  const source =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  for (const key of Object.keys(data) as (keyof AtcReport)[]) {
    data[key] = typeof source[key] === "string" ? source[key].trim() : "";
  }
  data.position = data.position.toUpperCase();
  const cidInRange = (value: string, max: number) =>
    /^\d{6,7}$/.test(value) && Number(value) >= 800000 && Number(value) <= max;
  if (!cidInRange(data.cid, 3000000))
    errors.cid = text(
      "Informe uma CID entre 800000 e 3000000, conforme o formulário oficial.",
      "Enter a CID between 800000 and 3000000, as required by the official form.",
    );
  if (data.name.length < 2 || data.name.length > 120)
    errors.name = text(
      "Informe seu nome (2 a 120 caracteres).",
      "Enter your name (2–120 characters).",
    );
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 254)
    errors.email = text(
      "Informe um e-mail válido.",
      "Enter a valid email address.",
    );
  if (data.controllerName.length > 120)
    errors.controllerName = text(
      "Use até 120 caracteres.",
      "Use up to 120 characters.",
    );
  if (data.controllerCid && !cidInRange(data.controllerCid, 2100000))
    errors.controllerCid = text(
      "O formulário oficial aceita CIDs entre 800000 e 2100000 neste campo.",
      "The official form accepts CIDs between 800000 and 2100000 in this field.",
    );
  if (!data.position.includes("_") || data.position.length > 40)
    errors.position = text(
      "Use o indicativo da posição, como SBSP_TWR ou SBGR_APP.",
      "Use the position callsign, such as SBSP_TWR or SBGR_APP.",
    );
  const date = new Date(data.date + "T00:00:00Z");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== data.date
  )
    errors.date = text("Selecione uma data válida.", "Select a valid date.");
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.time))
    errors.time = text(
      "Informe a hora UTC (00:00 a 23:59).",
      "Enter the UTC time (00:00–23:59).",
    );
  if (!ATC_RATINGS.some((value) => value === data.rating))
    errors.rating = text("Selecione uma avaliação.", "Select a rating.");
  if (data.comments.length < 3 || data.comments.length > 5000)
    errors.comments = text(
      "Descreva sua experiência em 3 a 5000 caracteres.",
      "Describe your experience in 3–5000 characters.",
    );
  return { data, errors, valid: Object.keys(errors).length === 0 };
}

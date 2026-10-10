/** Date-only values use YYYY-MM-DD, independently of the browser's time zone. */
export function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000"))
    return null;
  const date = new Date(value + "T00:00:00Z");
  return Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
    ? null
    : date;
}

export function dateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(value: string, amount: number) {
  const date = parseDate(value);
  if (!date) return value;
  date.setUTCDate(date.getUTCDate() + amount);
  if (date.getUTCFullYear() < 1) return "0001-01-01";
  if (date.getUTCFullYear() > 9999) return "9999-12-31";
  return dateValue(date);
}

export function addMonths(value: string, amount: number) {
  const date = parseDate(value);
  if (!date) return value;
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + amount);
  if (date.getUTCFullYear() < 1) return "0001-01-01";
  if (date.getUTCFullYear() > 9999) return "9999-12-31";
  const end = new Date(date);
  end.setUTCMonth(end.getUTCMonth() + 1, 0);
  date.setUTCDate(Math.min(day, end.getUTCDate()));
  return dateValue(date);
}

export function clampDate(value: string, min?: string, max?: string) {
  if (min && parseDate(min) && value < min) return min;
  if (max && parseDate(max) && value > max) return max;
  return value;
}

export function calendarDays(month: string, weekStartsOn: 0 | 1 = 0) {
  const first = parseDate(month.slice(0, 7) + "-01");
  if (!first) return [];
  const offset = (first.getUTCDay() - weekStartsOn + 7) % 7;
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(first);
    day.setUTCDate(day.getUTCDate() - offset + index);
    return day.getUTCFullYear() < 1 || day.getUTCFullYear() > 9999
      ? ""
      : dateValue(day);
  });
}

export function isTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

/** "Now" always uses the zone explicitly chosen by the caller (UTC by default). */
export function zonedNow(timeZone = "UTC", now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: string) =>
    parts.find((item) => item.type === type)?.value || "";
  return {
    date: `${part("year")}-${part("month")}-${part("day")}`,
    time: `${part("hour")}:${part("minute")}`,
  };
}

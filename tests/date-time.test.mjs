import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const exports = {};
const source = fs.readFileSync(
  new URL("../src/lib/date-time.ts", import.meta.url),
  "utf8",
);
vm.runInNewContext(
  ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText,
  { exports, Intl, Date },
);
const {
  parseDate,
  addDays,
  addMonths,
  calendarDays,
  clampDate,
  isTime,
  zonedNow,
} = exports;

test("date-only values reject impossible days and handle leap years", () => {
  assert.equal(parseDate("2026-02-29"), null);
  assert.equal(parseDate("2026-13-01"), null);
  assert.equal(parseDate("0000-01-01"), null);
  assert.equal(parseDate("10/10/2026"), null);
  assert.equal(
    parseDate("2024-02-29").toISOString(),
    "2024-02-29T00:00:00.000Z",
  );
});
test("calendar navigation crosses years and clamps the last day of a month", () => {
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addDays("2024-03-01", -1), "2024-02-29");
  assert.equal(addMonths("2024-01-31", 1), "2024-02-29");
  assert.equal(addMonths("2024-02-29", 12), "2025-02-28");
  assert.equal(addMonths("2026-01-31", -1), "2025-12-31");
  assert.equal(
    clampDate("2026-10-01", "2026-10-10", "2026-10-20"),
    "2026-10-10",
  );
  assert.equal(
    clampDate("2026-10-30", "2026-10-10", "2026-10-20"),
    "2026-10-20",
  );
});
test("calendar grids respect the configured start of week", () => {
  const sunday = calendarDays("2026-10", 0);
  const monday = calendarDays("2026-10", 1);
  assert.equal(sunday.length, 42);
  assert.equal(sunday[0], "2026-09-27");
  assert.equal(monday[0], "2026-09-28");
  assert.equal(sunday[41], "2026-11-07");
  assert.equal(calendarDays("invalid").length, 0);
});
test("midnight uses the chosen zone, never the machine's local zone or 12-hour time", () => {
  const instant = new Date("2026-10-11T01:05:00Z");
  assert.equal(zonedNow("UTC", instant).date, "2026-10-11");
  assert.equal(zonedNow("UTC", instant).time, "01:05");
  assert.equal(zonedNow("America/Sao_Paulo", instant).date, "2026-10-10");
  assert.equal(zonedNow("America/Sao_Paulo", instant).time, "22:05");
  assert.equal(zonedNow("UTC", new Date("2026-10-10T00:00:00Z")).time, "00:00");
  assert.equal(isTime("23:59"), true);
  assert.equal(isTime("24:00"), false);
  assert.equal(isTime("12:54 PM"), false);
});

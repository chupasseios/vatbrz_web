import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { fileURLToPath } from "node:url";
const testDirectory = path.dirname(fileURLToPath(import.meta.url));

// Execute the actual TypeScript modules with an isolated, mocked transport.
// No test in this file can reach the Google Forms service.
function load(
  file,
  fetchMock = () => {
    throw new Error("Network disabled in tests");
  },
) {
  const exports = {};
  const filename = path.resolve(testDirectory, "..", file);
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  vm.runInNewContext(
    code,
    {
      exports,
      Request,
      Response,
      URLSearchParams,
      AbortSignal,
      fetch: fetchMock,
      require: (name) => {
        if (name.startsWith("@/"))
          return load("src/" + name.slice(2) + ".ts", fetchMock);
        throw new Error("Unexpected import: " + name);
      },
    },
    { filename },
  );
  return exports;
}
const sample = {
  cid: "1234567",
  name: "Membro de Teste",
  email: "test@example.com",
  controllerName: "",
  controllerCid: "",
  position: "sbgr_app",
  date: "2026-10-10",
  time: "23:59",
  rating: "Bom / Good",
  comments: "Relato fictício; teste local, sem transmissão.",
};
const request = (data = sample, headers = {}) =>
  new Request("http://localhost/api/atc-report", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(data),
  });

test("validates official CID limits, real dates, UTC time, rating and optional fields", () => {
  const { validateAtcReport } = load("src/lib/atc-report.ts");
  assert.equal(validateAtcReport(sample).valid, true);
  assert.equal(validateAtcReport(sample).data.position, "SBGR_APP");
  for (const fields of [
    { cid: "799999" },
    { cid: "3000001" },
    { controllerCid: "2100001" },
    { date: "2026-02-30" },
    { time: "24:00" },
    { rating: "five stars" },
    { comments: " " },
    { position: "Controle Rio" },
  ]) {
    assert.equal(
      validateAtcReport({ ...sample, ...fields }).valid,
      false,
      JSON.stringify(fields),
    );
  }
  assert.equal(
    validateAtcReport({
      ...sample,
      date: "2024-02-29",
      controllerCid: "2100000",
    }).valid,
    true,
  );
});

test("maps every field to the authorised form, including UTC components", () => {
  const { toGoogleForm } = load("src/lib/atc-report-delivery.ts");
  assert.deepEqual(
    Object.fromEntries(toGoogleForm({ ...sample, position: "SBGR_APP" })),
    {
      "entry.1781118946": "1234567",
      "entry.420586714": sample.name,
      "entry.1326481568": sample.email,
      "entry.1304941585": "",
      "entry.258151617": "",
      "entry.641875680": "SBGR_APP",
      "entry.158787368_year": "2026",
      "entry.158787368_month": "10",
      "entry.158787368_day": "10",
      "entry.1751532403_hour": "23",
      "entry.1751532403_minute": "59",
      "entry.548207857": "Bom / Good",
      "entry.1270383311": sample.comments,
    },
  );
});

test("never mistakes embedded configuration or a validation page for success", () => {
  const { isReportConfirmed } = load("src/lib/atc-report-delivery.ts");
  assert.equal(
    isReportConfirmed(
      '<script>const message="Your feedback has been recorded";</script><div>Try again</div>',
    ),
    false,
  );
  assert.equal(
    isReportConfirmed("<form>Your feedback has been recorded</form>"),
    false,
  );
  assert.equal(isReportConfirmed("<div>Sign in to Google</div>"), false);
  assert.equal(
    isReportConfirmed(
      '<div class="vHW8K">Seu feedback foi registrado e encaminhado à liderança responsável.</div>',
    ),
    true,
  );
});

test("rejects invalid requests without contacting Google", async () => {
  let calls = 0;
  const { POST } = load("src/app/api/atc-report/route.ts", () => {
    calls++;
    throw new Error("Unexpected network");
  });
  assert.equal((await POST(request({ ...sample, cid: "bad" }))).status, 400);
  assert.equal(
    (await POST(request(sample, { "sec-fetch-site": "cross-site" }))).status,
    403,
  );
  assert.equal(
    (await POST(request(sample, { "content-type": "text/plain" }))).status,
    415,
  );
  assert.equal(
    (await POST(request({ ...sample, comments: "a".repeat(21000) }))).status,
    413,
  );
  assert.equal(calls, 0);
});

test("forwards once and returns a receipt only on confirmed success", async () => {
  const calls = [];
  const { POST } = load(
    "src/app/api/atc-report/route.ts",
    async (url, options) => {
      calls.push({ url, options });
      return new Response(
        '<div class="vHW8K">Your feedback has been recorded and forwarded to the responsible leadership.</div>',
      );
    },
  );
  const result = await POST(request());
  assert.equal(result.status, 200);
  assert.equal(result.headers.get("cache-control"), "no-store");
  const receipt = await result.json();
  assert.equal(receipt.ok, true);
  assert.equal(Number.isNaN(Date.parse(receipt.receivedAt)), false);
  assert.equal(calls.length, 1);
  assert.equal(
    calls[0].url,
    "https://docs.google.com/forms/d/e/1FAIpQLSfg3W9ivSToH9wdz8RXPb082jBUBxnTP4vGq2tz0lsipvsm_w/formResponse?hl=en",
  );
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.body.get("entry.641875680"), "SBGR_APP");
  assert(!JSON.stringify(receipt).includes(sample.email));
});

test("upstream failures and ambiguous replies never retry or claim success", async () => {
  for (const upstream of [
    async () => new Response("Unavailable", { status: 503 }),
    async () =>
      new Response(
        '<script>const message="Your feedback has been recorded";</script>',
      ),
    async () => {
      throw new Error("timeout");
    },
  ]) {
    let calls = 0;
    const { POST } = load("src/app/api/atc-report/route.ts", () => {
      calls++;
      return upstream();
    });
    const response = await POST(request());
    assert.equal(response.status, 502);
    assert.equal((await response.json()).error, "unconfirmed");
    assert.equal(calls, 1);
  }
});

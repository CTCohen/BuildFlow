// Design QA loop evals: pass, retry, escalate, logging, and each deterministic check on a crafted bundle.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { assert, baseClient, scratch, APP } from "./harness.mjs";
import { runWithQa, MAX_RETRIES, browserAvailable } from "../qa-loop.mjs";
import { renderSite } from "../design-agent.mjs";

const rows = (dir, f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), "utf8").trim().split("\n").map((l) => JSON.parse(l)) : []);

/** Fake renderer: the nth call returns results[n] (last one repeats). Records the corrections it was given. */
function fakeRender(results) {
  const calls = [];
  const fn = async (client, { corrections }) => {
    calls.push([...corrections]);
    const r = results[Math.min(calls.length - 1, results.length - 1)];
    return { ...r, client: r.client ?? client, design: {}, ms: { total: 5 } };
  };
  fn.calls = calls;
  return fn;
}
const bad = { ok: false, stage: "schema", error: "content.en.about: placeholder text" };

/** Run app/scripts/qa.mjs directly against a bundle we built and then tampered with. */
async function qaCli(mutate, { client = baseClient() } = {}) {
  const root = scratch("qacli");
  const out = join(root, "o");
  const r = await renderSite(client, { outDir: out });
  assert.ok(r.ok, r.error);
  mutate?.(out);
  writeFileSync(join(root, "c.json"), JSON.stringify(r.client));
  const p = spawnSync("node", ["scripts/qa.mjs", "--client", r.client.slug, "--client-file", join(root, "c.json"), "--out-dir", out, "--skip-build", "--skip-browser", "--json"], { cwd: APP, encoding: "utf8" });
  const line = p.stdout.trim().split("\n").reverse().find((l) => l.startsWith("{"));
  return JSON.parse(line);
}
const patch = (out, file, fn) => writeFileSync(join(out, file), fn(readFileSync(join(out, file), "utf8")));

export default [
  { id: "q01", slow: true, desc: "clean input passes first time, no retries", async run() {
    const logs = scratch("q01");
    const r = await runWithQa(baseClient(), { outDir: join(scratch("q01o"), "o"), logDir: logs, browser: "skip" });
    assert.equal(r.status, "passed");
    assert.equal(r.firstPass, true);
    assert.equal(r.attempts.length, 1);
    assert.equal(rows(logs, "rejections.jsonl").length, 0);
  } },
  { id: "q02", desc: "bad input escalates on the 3rd failure (initial + 2 retries)", async run() {
    const logs = scratch("q02");
    const render = fakeRender([bad]);
    const r = await runWithQa(baseClient(), { outDir: join(scratch("q02o"), "o"), logDir: logs, render, browser: "skip" });
    assert.equal(r.status, "escalated");
    assert.equal(render.calls.length, MAX_RETRIES + 1);
    assert.equal(rows(logs, "escalations.jsonl").length, 1);
  } },
  { id: "q03", slow: true, desc: "a real placeholder-laden client escalates and logs each rejection", async run() {
    const logs = scratch("q03");
    const c = baseClient(); c.content.en.about = "FILL_en about paragraph";
    const r = await runWithQa(c, { outDir: join(scratch("q03o"), "o"), logDir: logs, browser: "skip" });
    assert.equal(r.status, "escalated");
    const rej = rows(logs, "rejections.jsonl");
    assert.equal(rej.length, 3);
    assert.ok(rej.every((x) => x.category === "input-data" && /placeholder/.test(x.reason)));
    assert.deepEqual(rej.map((x) => x.attempt), [1, 2, 3]);
  } },
  { id: "q04", slow: true, desc: "fails once, then a real render passes: status passed, not first-pass, 2 attempts", async run() {
    let n = 0;
    const render = async (c, o) => (n++ === 0 ? { ...bad, client: c, design: {} } : renderSite(c, o));
    const r = await runWithQa(baseClient(), { outDir: join(scratch("q04o"), "o"), logDir: scratch("q04"), render, browser: "skip" });
    assert.equal(r.status, "passed");
    assert.equal(r.firstPass, false);
    assert.equal(r.attempts.length, 2);
    assert.deepEqual(r.attempts[0].failed, ["schema"]);
  } },
  { id: "q05", desc: "corrections accumulate across attempts", async run() {
    const render = fakeRender([{ ok: false, stage: "schema", error: "x" }, { ok: false, stage: "build", error: "y" }, { ok: false, stage: "build", error: "y" }]);
    await runWithQa(baseClient(), { outDir: join(scratch("q05o"), "o"), logDir: scratch("q05"), render, browser: "skip" });
    assert.deepEqual(render.calls[0], []);
    assert.deepEqual(render.calls[1], ["schema"]);
    assert.deepEqual(render.calls[2], ["schema", "build"]);
  } },
  { id: "q06", desc: "a build failure is categorised build-error and escalates", async run() {
    const logs = scratch("q06");
    const r = await runWithQa(baseClient(), { outDir: join(scratch("q06o"), "o"), logDir: logs, render: fakeRender([{ ok: false, stage: "build", error: "astro exploded" }]), browser: "skip" });
    assert.equal(r.status, "escalated");
    const rej = rows(logs, "rejections.jsonl");
    assert.equal(rej[0].category, "build-error");
    assert.match(rej[0].reason, /astro exploded/);
  } },
  { id: "q07", desc: "rejection rows carry slug, tier, stage, attempt, check, category, reason", async run() {
    const logs = scratch("q07");
    await runWithQa(baseClient({ tier: "micro" }), { outDir: join(scratch("q07o"), "o"), logDir: logs, render: fakeRender([bad]), browser: "skip", stage: "live" });
    const row = rows(logs, "rejections.jsonl")[0];
    for (const k of ["ts", "slug", "tier", "stage", "attempt", "check", "category", "reason"]) assert.ok(k in row, k);
    assert.equal(row.stage, "live");
  } },
  { id: "q08", desc: "runs.jsonl records zero LLM tokens and dollars (deterministic)", async run() {
    const logs = scratch("q08");
    await runWithQa(baseClient(), { outDir: join(scratch("q08o"), "o"), logDir: logs, render: fakeRender([bad]), browser: "skip" });
    const run = rows(logs, "runs.jsonl")[0];
    assert.equal(run.llmTokens, 0);
    assert.equal(run.usd, 0);
    assert.equal(run.status, "escalated");
  } },
  { id: "q09", slow: true, desc: "a too-pale brand color fails contrast on attempt 1 and is fixed by the retry", async run() {
    const logs = scratch("q09");
    const c = baseClient(); c.media = { source: "existing-identity", logo: "https://logo.test/l.png" }; c.brand.primary = "#f2d24b";
    const r = await runWithQa(c, { outDir: join(scratch("q09o"), "o"), logDir: logs, browser: "skip" });
    assert.equal(r.status, "passed");
    assert.equal(r.firstPass, false);
    assert.deepEqual(r.attempts[0].failed, ["brand-contrast"]);
    assert.ok(r.attempts[1].corrections.includes("brand-contrast"));
    assert.equal(rows(logs, "rejections.jsonl")[0].category, "contrast");
  } },
  { id: "q10", desc: "browser probe returns a boolean and never throws", async run() {
    assert.equal(typeof (await browserAvailable()), "boolean");
  } },

  // ---- each deterministic check, on a real bundle that was then tampered with
  { id: "q11", slow: true, desc: "clean bundle: every non-browser check passes", async run() {
    const qa = await qaCli();
    assert.deepEqual(qa.failed, []);
  } },
  { id: "q12", slow: true, desc: "a broken internal link is caught", async run() {
    const qa = await qaCli((o) => patch(o, "index.html", (h) => h.replace("</body>", '<a href="/no-such-page">x</a></body>')));
    assert.deepEqual(qa.failed, ["internal-links"]);
  } },
  { id: "q13", slow: true, desc: "visible placeholder text in the HTML is caught", async run() {
    const qa = await qaCli((o) => patch(o, "contact/index.html", (h) => h.replace("</body>", "<p>Lorem ipsum dolor</p></body>")));
    assert.ok(qa.failed.includes("placeholders"));
  } },
  { id: "q14", slow: true, desc: "a missing title is caught", async run() {
    const qa = await qaCli((o) => patch(o, "index.html", (h) => h.replace(/<title>[\s\S]*?<\/title>/, "")));
    assert.ok(qa.failed.includes("required-content"));
  } },
  { id: "q15", slow: true, desc: "a missing tel: link on the home page is caught", async run() {
    const qa = await qaCli((o) => patch(o, "index.html", (h) => h.replaceAll("tel:", "phone:")));
    assert.ok(qa.failed.includes("required-content"));
  } },
  { id: "q16", slow: true, desc: "the scaffold FILL_ marker is caught in rendered text", async run() {
    const qa = await qaCli((o) => patch(o, "index.html", (h) => h.replace("</body>", "<p>FILL_service name</p></body>")));
    assert.ok(qa.failed.includes("placeholders"));
  } },
  { id: "q17", slow: true, desc: "a Micro bundle passes with no About or area pages", async run() {
    const qa = await qaCli(null, { client: baseClient({ tier: "micro", slug: "q17-micro" }) });
    assert.deepEqual(qa.failed, []);
  } },
];

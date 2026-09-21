#!/usr/bin/env node
/**
 * Smoke test: 4 verticals x 2 tiers x 2-3 styling profiles, each through the QA loop.
 *   node agents/design/smoke.mjs [--out <dir>] [--concurrency 4] [--browser skip|auto|require]
 * Micro has one locked profile, so its "profiles" are requested ones that must be overridden.
 * Writes <out>/<slug>/ per site and <out>/index.html linking them all.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { makeClient, VERTICAL_IDS } from "./fixtures.mjs";
import { runWithQa } from "./qa-loop.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const out = resolve(opt("--out", join(HERE, "out/smoke")));
const concurrency = Number(opt("--concurrency", 4));
const browser = opt("--browser", "auto");

const PROFILES = { smb: ["professional-service", "energetic-bold", "eco-conscious"], micro: ["professional-service", "luxury-premium"] };
const jobs = VERTICAL_IDS.flatMap((vertical) => Object.entries(PROFILES).flatMap(([tier, ps]) => ps.map((profile) => makeClient({ vertical, tier, profile }))));
mkdirSync(out, { recursive: true });

const results = new Array(jobs.length);
let next = 0;
const t0 = performance.now();
await Promise.all(Array.from({ length: concurrency }, async () => {
  while (next < jobs.length) {
    const i = next++;
    results[i] = await runWithQa(jobs[i], { outDir: join(out, jobs[i].slug), browser, logDir: join(out, "logs") });
  }
}));
const wall = Math.round(performance.now() - t0);

console.log(`\nsmoke: ${jobs.length} sites in ${wall}ms (concurrency ${concurrency}, browser checks ${results[0].browserChecked ? "on" : "off"})\n`);
let bad = 0;
results.forEach((r, i) => {
  const c = jobs[i];
  if (r.status !== "passed") bad++;
  console.log(`${r.status === "passed" ? "✓" : "✗"} ${c.slug.padEnd(42)} ${r.status.padEnd(9)} attempts=${r.attempts.length} ${r.design ? `theme=${r.design.theme} hero=${r.design.heroStyle}` : `reasons=${r.reasons}`}`);
});
writeFileSync(join(out, "index.html"), `<!doctype html><meta charset="utf-8"><title>Smoke sites</title><body style="font:16px system-ui;max-width:52rem;margin:2rem auto"><h1>Smoke sites</h1><ul>${jobs.map((c, i) => `<li>${results[i].status === "passed" ? `<a href="${c.slug}/index.html">${c.slug}</a>` : `${c.slug} (${results[i].status})`}</li>`).join("")}</ul>`);
console.log(`\n${jobs.length - bad}/${jobs.length} passed. Gallery: ${join(out, "index.html")}`);
process.exit(bad ? 1 : 0);

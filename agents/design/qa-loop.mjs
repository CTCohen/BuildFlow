/**
 * Design QA loop (agents/AGENT_REGISTRY.md #3): render, check, feed failures back, retry, escalate.
 *
 *   runWithQa(client, { outDir, stage })  ->  { status: "passed" | "escalated", attempts, ... }
 *
 * Initial render + 2 retries. Each retry passes the failed check names to the Design Agent as
 * `corrections`. A 3rd failure escalates to Tyler (escalations.jsonl, the System 18 feedback queue
 * reads it). Every failed check is logged to rejections.jsonl (the monthly failure-mode job reads it).
 * The checks themselves are app/scripts/qa.mjs; this file only wraps them.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { existsSync, mkdirSync, appendFileSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderSite, APP_ROOT } from "./design-agent.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_LOG_DIR = join(HERE, "logs");
export const MAX_RETRIES = 2;

/** Failure categories logged for the monthly top-3 failure-mode review. */
const CATEGORY = {
  schema: "input-data",
  placeholders: "placeholder-leak",
  "required-content": "missing-content",
  "internal-links": "broken-links",
  "brand-contrast": "contrast",
  "lighthouse-budget": "lighthouse",
  "layout-sanity": "layout",
  build: "build-error",
  html: "build-error",
};

function log(logDir, file, row) {
  mkdirSync(logDir, { recursive: true });
  appendFileSync(join(logDir, file), JSON.stringify({ ts: new Date().toISOString(), ...row }) + "\n");
}

/** Lighthouse and layout checks need Chrome and a local port. Probe so a sandbox without them skips instead of failing. */
export async function browserAvailable() {
  try {
    await new Promise((ok, no) => {
      const s = createServer();
      s.once("error", no);
      s.listen(0, "127.0.0.1", () => s.close(ok));
    });
    const { chromium } = await import(join(APP_ROOT, "node_modules/playwright/index.mjs")).catch(() => import("playwright"));
    if (!existsSync(chromium.executablePath())) return false;
    const { Launcher } = await import(join(APP_ROOT, "node_modules/chrome-launcher/dist/index.js")).catch(() => ({}));
    return Boolean(Launcher?.getFirstInstallation?.());
  } catch {
    return false;
  }
}

function runQa({ slug, clientFile, outDir, stage, skipBrowser }) {
  const args = ["scripts/qa.mjs", "--client", slug, "--client-file", clientFile, "--out-dir", outDir, "--skip-build", "--json", "--stage", stage];
  if (skipBrowser) args.push("--skip-browser");
  return new Promise((res) => {
    const p = spawn("node", args, { cwd: APP_ROOT, stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("close", () => {
      const line = out.trim().split("\n").reverse().find((l) => l.startsWith("{"));
      try { res(JSON.parse(line)); } catch { res({ results: [{ name: "qa", status: "fail", detail: out.slice(-300) }], failed: ["qa"] }); }
    });
  });
}

/**
 * @param {object} client
 * @param {{outDir: string, stage?: "demo"|"live", browser?: "auto"|"skip"|"require", logDir?: string, render?: Function}} opts
 *   `render` lets tests swap the renderer; it must match renderSite's signature.
 */
export async function runWithQa(client, { outDir, stage = "demo", browser = "auto", logDir = DEFAULT_LOG_DIR, render = renderSite } = {}) {
  const t0 = performance.now();
  const slug = client.slug ?? "unknown";
  const out = resolve(outDir);
  const clientFile = `${out}.client.json`;
  const useBrowser = browser === "require" || (browser === "auto" && (await browserAvailable()));
  const attempts = [];
  let corrections = [];

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    const r = await render(client, { outDir: out, corrections });
    let failed = [];
    let detail = {};

    if (!r.ok) {
      failed = [r.stage === "build" ? "build" : r.stage];
      detail = { [failed[0]]: r.error };
    } else {
      mkdirSync(dirname(clientFile), { recursive: true });
      writeFileSync(clientFile, JSON.stringify(r.client, null, 2));
      const qa = await runQa({ slug, clientFile, outDir: out, stage, skipBrowser: !useBrowser });
      failed = qa.failed ?? [];
      detail = Object.fromEntries((qa.results ?? []).filter((x) => x.status === "fail").map((x) => [x.name, x.detail]));
    }

    attempts.push({ attempt, ok: failed.length === 0, failed, corrections: [...corrections], ms: r.ms?.total ?? null });
    for (const name of failed) {
      log(logDir, "rejections.jsonl", { slug, tier: r.client?.tier ?? client.tier, stage, attempt, check: name, category: CATEGORY[name] ?? "other", reason: String(detail[name] ?? "").slice(0, 400) });
    }

    if (failed.length === 0) {
      const result = { status: "passed", slug, outDir: out, attempts, firstPass: attempt === 1, browserChecked: useBrowser, design: r.design, ms: Math.round(performance.now() - t0) };
      log(logDir, "runs.jsonl", { slug, status: "passed", attempts: attempt, ms: result.ms, llmTokens: 0, usd: 0 });
      return result;
    }
    corrections = [...new Set([...corrections, ...failed])];
  }

  const last = attempts[attempts.length - 1];
  const result = { status: "escalated", slug, attempts, reasons: last.failed, browserChecked: useBrowser, ms: Math.round(performance.now() - t0) };
  log(logDir, "escalations.jsonl", { slug, stage, reasons: last.failed, attempts: attempts.length, action: "tyler: reject / manual fix / accept with warning" });
  log(logDir, "runs.jsonl", { slug, status: "escalated", attempts: attempts.length, ms: result.ms, llmTokens: 0, usd: 0 });
  return result;
}

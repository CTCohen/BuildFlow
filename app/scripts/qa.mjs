#!/usr/bin/env node
/**
 * BuildFlow per-client QA gate.
 *
 *   node scripts/qa.mjs --client demo-plumbing [--skip-build] [--skip-browser]
 *
 * Implemented:
 *   1. client data schema validation (schema.mjs)
 *   2. production build for that client
 *   3. placeholder-leakage scan of rendered HTML
 *   4. required-content presence (phone, CTA, title, h1, meta description, JSON-LD)
 *   5. internal link check across built pages
 *   6. EN/ES parity (from schema warnings/errors)
 *   7. Lighthouse budget (perf >= 90, a11y >= 95, SEO >= 95) — headless Chrome via `lighthouse`
 *   8. layout sanity (horizontal scroll, broken images, console errors) — Playwright, mobile + desktop
 *
 * Still stubbed — needs a real decision before wiring it in:
 *   9. LLM rubric review (credibility / copy specificity / polish / completeness). This would
 *      call the Anthropic API, which bills pay-per-token separately from the Claude Code
 *      subscription (see ~/.claude/CLAUDE.md — ANTHROPIC_API_KEY is deliberately not
 *      auto-exported). Don't wire this to run unattended in the gate until that's a decision
 *      someone's made on purpose, not a side effect of "finish the QA checks."
 *
 * `--skip-browser` skips 7 and 8 (schema/build/content checks only, no Chrome launch).
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { validateClient } from "../src/data/schema.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const slug = valueOf("--client");
const skipBuild = args.includes("--skip-build");
const skipBrowser = args.includes("--skip-browser");

if (!slug) {
  console.error("usage: node scripts/qa.mjs --client <slug> [--skip-build]");
  process.exit(2);
}

function valueOf(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

const results = []; // { name, status: 'pass'|'fail'|'warn'|'skip', detail }
const add = (name, status, detail = "") => results.push({ name, status, detail });

// ---------------------------------------------------------------- 1. schema
const clientPath = join(ROOT, "src/data/clients", `${slug}.json`);
if (!existsSync(clientPath)) {
  console.error(`✗ no client file at ${relative(ROOT, clientPath)}`);
  process.exit(2);
}
const data = JSON.parse(readFileSync(clientPath, "utf8"));
const v = validateClient(data);
if (v.ok) add("schema", "pass", `${v.warnings.length} warning(s)`);
else add("schema", "fail", v.errors.join("; "));
for (const w of v.warnings) add("schema:warn", "warn", w);

// ---------------------------------------------------------------- 2. build
const dist = join(ROOT, "dist");
if (!skipBuild) {
  try {
    execFileSync("npx", ["astro", "build"], {
      cwd: ROOT,
      env: { ...process.env, CLIENT: slug },
      stdio: "pipe",
    });
    add("build", "pass");
  } catch (e) {
    add("build", "fail", String(e.stdout || e.message).split("\n").slice(-8).join("\n"));
  }
} else {
  add("build", "skip", "--skip-build");
}

// ---------------------------------------------------------------- gather HTML
function htmlFiles(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...htmlFiles(p));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}
const pages = htmlFiles(dist).map((f) => ({ file: f, html: readFileSync(f, "utf8") }));

if (pages.length === 0) {
  add("html", "fail", "no built HTML found");
} else {
  // ------------------------------------------------------------ 3. placeholders
  const PATTERNS = [
    ["lorem ipsum", /lorem\s+ipsum/i],
    ["TODO/FIXME", /\bTODO\b|\bFIXME\b|\bTBD\b/],
    ["mustache", /\{\{|\}\}/],
    ["bracket token", /\[(business|name|city|phone|trade|company|insert)[^\]]*\]/i],
    ["example.com", /example\.com/i],
    ["xxxx", /x{4,}/i],
  ];
  // scan VISIBLE TEXT only: drop scripts/styles/head, then strip all tags.
  // (example.com etc. in canonical/og tags is the build's SITE_URL default,
  //  not a content placeholder — a real client build sets SITE_URL.)
  const leaks = [];
  for (const { file, html } of pages) {
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<head[\s\S]*?<\/head>/gi, "")
      .replace(/<[^>]+>/g, " ");
    for (const [label, re] of PATTERNS) {
      if (re.test(text)) leaks.push(`${relative(dist, file)}: ${label}`);
    }
  }
  add("placeholders", leaks.length ? "fail" : "pass", leaks.join("; "));

  // ------------------------------------------------------------ 4. required content
  const reqIssues = [];
  const phone = data.business.phone.replace(/[^+0-9]/g, "");
  for (const { file, html } of pages) {
    const name = relative(dist, file);
    if (!/<title>[^<]{5,}<\/title>/i.test(html)) reqIssues.push(`${name}: missing <title>`);
    if (!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']{20,}/i.test(html))
      reqIssues.push(`${name}: weak/missing meta description`);
    if (!/<h1[\s>]/i.test(html)) reqIssues.push(`${name}: no <h1>`);
    if (name === "index.html") {
      if (!html.includes(`tel:${phone}`)) reqIssues.push(`${name}: no tel: link to business phone`);
      if (!/application\/ld\+json/.test(html)) reqIssues.push(`${name}: no LocalBusiness JSON-LD`);
      for (const area of data.business.serviceAreas.slice(0, 2))
        if (!html.includes(area)) reqIssues.push(`${name}: service area "${area}" not rendered`);
    }
  }
  add("required-content", reqIssues.length ? "fail" : "pass", reqIssues.join("; "));

  // ------------------------------------------------------------ 5. internal links
  const have = new Set(
    pages.map((p) => "/" + relative(dist, p.file).replace(/index\.html$/, "").replace(/\.html$/, "")),
  );
  have.add("/");
  const linkIssues = [];
  for (const { file, html } of pages) {
    const name = relative(dist, file);
    const hrefs = [...html.matchAll(/href=["']([^"']+)["']/g)].map((m) => m[1]);
    for (const h of hrefs) {
      if (/^(https?:|tel:|mailto:|#|data:)/.test(h)) continue;
      if (/^\/_astro\//.test(h)) continue;
      if (/\.(css|js|mjs|png|jpe?g|svg|webp|avif|ico|woff2?|xml|txt|pdf)$/i.test(h.split("?")[0])) continue;
      const path = h.split("#")[0].replace(/\/$/, "") || "/";
      if (path === "/404" || path === "/sitemap.xml" || path === "/robots.txt") continue;
      const norm = path.endsWith("/") ? path : path + "/";
      if (!have.has(path) && !have.has(norm) && !have.has(path + "/")) {
        linkIssues.push(`${name} → ${h}`);
      }
    }
  }
  add("internal-links", linkIssues.length ? "fail" : "pass", linkIssues.join("; "));
}

// ------------------------------------------------------ 7-8. Lighthouse + layout sanity
if (skipBrowser || pages.length === 0) {
  add("lighthouse-budget", "skip", skipBrowser ? "--skip-browser" : "no built pages");
  add("layout-sanity", "skip", skipBrowser ? "--skip-browser" : "no built pages");
} else {
  await runBrowserChecks();
}

async function serveDist() {
  const mime = {
    ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
    ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".webp": "image/webp", ".avif": "image/avif", ".ico": "image/x-icon", ".json": "application/json",
    ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain",
  };
  const server = createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    const candidates = [join(dist, p), join(dist, p + ".html"), join(dist, p, "index.html")];
    let full = candidates.find((c) => c.startsWith(dist) && existsSync(c));
    if (!full) {
      res.writeHead(404).end("not found");
      return;
    }
    const ext = full.slice(full.lastIndexOf("."));
    res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
    res.end(readFileSync(full));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  return { server, base: `http://127.0.0.1:${port}` };
}

async function runBrowserChecks() {
  const { server, base } = await serveDist();
  try {
    await runLighthouse(base);
    await runLayoutSanity(base);
  } finally {
    server.close();
  }
}

async function runLighthouse(base) {
  try {
    const { default: lighthouse } = await import("lighthouse");
    const { launch } = await import("chrome-launcher");
    const chrome = await launch({ chromeFlags: ["--headless=new", "--no-sandbox"] });
    try {
      const url = pages.some((p) => relative(dist, p.file) === "index.html") ? base + "/" : base;
      const result = await lighthouse(url, {
        port: chrome.port,
        output: "json",
        onlyCategories: ["performance", "accessibility", "seo"],
        logLevel: "silent",
      });
      const cats = result.lhr.categories;
      const perf = Math.round(cats.performance.score * 100);
      const a11y = Math.round(cats.accessibility.score * 100);
      const seo = Math.round(cats.seo.score * 100);
      const BUDGET = { perf: 90, a11y: 95, seo: 95 };
      const misses = [];
      if (perf < BUDGET.perf) misses.push(`performance ${perf} < ${BUDGET.perf}`);
      if (a11y < BUDGET.a11y) misses.push(`accessibility ${a11y} < ${BUDGET.a11y}`);
      if (seo < BUDGET.seo) misses.push(`seo ${seo} < ${BUDGET.seo}`);
      add(
        "lighthouse-budget",
        misses.length ? "fail" : "pass",
        `perf ${perf} · a11y ${a11y} · seo ${seo}${misses.length ? "  (" + misses.join("; ") + ")" : ""}`,
      );
    } finally {
      await chrome.kill();
    }
  } catch (e) {
    add("lighthouse-budget", "fail", `lighthouse run error: ${String(e.message || e).slice(0, 200)}`);
  }
}

async function runLayoutSanity(base) {
  try {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch();
    const issues = [];
    const VIEWPORTS = [
      { name: "mobile", width: 375, height: 812 },
      { name: "desktop", width: 1280, height: 800 },
    ];
    try {
      for (const { file } of pages) {
        const routePath = "/" + relative(dist, file).replace(/index\.html$/, "").replace(/\.html$/, "");
        const url = base + routePath;
        for (const vp of VIEWPORTS) {
          const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
          const consoleErrors = [];
          page.on("console", (msg) => {
            if (msg.type() === "error") consoleErrors.push(msg.text());
          });
          page.on("pageerror", (err) => consoleErrors.push(String(err)));
          try {
            await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
            const { scrollWidth, clientWidth } = await page.evaluate(() => ({
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
            }));
            if (scrollWidth > clientWidth + 2) {
              issues.push(`${routePath} @ ${vp.name}: horizontal scroll (${scrollWidth}px content in ${clientWidth}px viewport)`);
            }
            const broken = await page.evaluate(() =>
              Array.from(document.images)
                .filter((img) => img.src && img.complete && img.naturalWidth === 0)
                .map((img) => img.src),
            );
            for (const src of broken) issues.push(`${routePath} @ ${vp.name}: broken image ${src}`);
            if (consoleErrors.length) {
              issues.push(`${routePath} @ ${vp.name}: console error(s): ${consoleErrors.slice(0, 2).join(" | ")}`);
            }
          } catch (e) {
            issues.push(`${routePath} @ ${vp.name}: navigation error — ${String(e.message || e).slice(0, 150)}`);
          } finally {
            await page.close();
          }
        }
      }
    } finally {
      await browser.close();
    }
    add("layout-sanity", issues.length ? "fail" : "pass", issues.join("; "));
  } catch (e) {
    add("layout-sanity", "fail", `playwright run error: ${String(e.message || e).slice(0, 200)}`);
  }
}

// ---------------------------------------------------------------- 9. LLM rubric (deliberately not automated — see header)
add("llm-rubric", "skip", "not wired: would call the metered Anthropic API — see header note");

// ---------------------------------------------------------------- report
const icon = { pass: "✓", fail: "✗", warn: "!", skip: "·" };
console.log(`\nBuildFlow QA — client: ${slug}\n${"─".repeat(48)}`);
for (const r of results) {
  console.log(`${icon[r.status]} ${r.name}${r.detail ? "  — " + r.detail : ""}`);
}
const failed = results.filter((r) => r.status === "fail");
const warned = results.filter((r) => r.status === "warn");
const skipped = results.filter((r) => r.status === "skip");
console.log("─".repeat(48));
console.log(
  `${failed.length ? "FAIL" : "PASS"} · ${failed.length} failed · ${warned.length} warnings · ${skipped.length} not-yet-implemented`,
);
process.exit(failed.length ? 1 : 0);

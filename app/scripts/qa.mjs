#!/usr/bin/env node
/**
 * BuildFlow per-client QA gate.
 *
 *   node scripts/qa.mjs --client demo-plumbing [--skip-build]
 *
 * Implemented tonight (static, zero extra deps):
 *   1. client data schema validation (schema.mjs)
 *   2. production build for that client
 *   3. placeholder-leakage scan of rendered HTML
 *   4. required-content presence (phone, CTA, title, h1, meta description, JSON-LD)
 *   5. internal link check across built pages
 *   6. EN/ES parity (from schema warnings/errors)
 *
 * Stubbed — wired next (need Playwright + Lighthouse + a browser):
 *   7. Lighthouse budget (perf >= 90, a11y >= 95, SEO >= 95)
 *   8. layout sanity (no horizontal scroll, no broken images, no overlap)
 *   9. LLM rubric review (credibility / copy specificity / polish / completeness)
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { validateClient } from "../src/data/schema.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const slug = valueOf("--client");
const skipBuild = args.includes("--skip-build");

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

// ---------------------------------------------------------------- 7-9 stubs
add("lighthouse-budget", "skip", "TODO: needs lighthouse + chrome");
add("layout-sanity", "skip", "TODO: needs playwright");
add("llm-rubric", "skip", "TODO: run Claude rubric on rendered pages/screenshots");

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

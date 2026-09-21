// Tiny eval harness: a suite is a list of { id, desc, run }. run() throws on failure. No dependencies.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

export { assert };
const HERE = dirname(fileURLToPath(import.meta.url));
export const APP = join(HERE, "../../../app");

export function scratch(label) {
  const root = process.env.EVAL_TMP || tmpdir();
  mkdirSync(root, { recursive: true });
  return mkdtempSync(join(root, `bf-eval-${label}-`));
}

/** A valid SMB client to derive cases from. */
export function baseClient(over = {}) {
  const c = JSON.parse(readFileSync(join(APP, "src/data/clients/demo-plumbing.json"), "utf8"));
  return { ...structuredClone(c), slug: "eval-client", tier: "smb", styleProfile: "professional-service", ...over };
}

export async function runSuite(name, cases, { filter, fast } = {}) {
  let pass = 0, fail = 0, skip = 0;
  console.log(`\n${name}  (${cases.length} cases)`);
  for (const c of cases) {
    if ((filter && !c.id.includes(filter)) || (fast && c.slow)) { skip++; continue; }
    const t0 = performance.now();
    try {
      await c.run();
      pass++;
      console.log(`  ✓ ${c.id}  ${c.desc}  (${Math.round(performance.now() - t0)}ms)`);
    } catch (e) {
      fail++;
      console.log(`  ✗ ${c.id}  ${c.desc}\n      ${String(e.message).split("\n").slice(0, 4).join("\n      ")}`);
    }
  }
  console.log(`  -> ${pass} passed, ${fail} failed${skip ? `, ${skip} skipped` : ""}`);
  return { pass, fail, skip };
}

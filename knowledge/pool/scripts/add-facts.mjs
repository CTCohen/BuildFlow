#!/usr/bin/env node
/**
 * One-time content patch: adds a `facts` array to every service in the copy pool,
 * satisfying SPEC-16 Layer 1 "fact density" (ai-seo-setup.md step 3: each service
 * page carries >= 3 concrete numbers/facts). Facts use the same merge-field and
 * `requires`-gating pattern as headlines, so nothing is fabricated — a fact only
 * renders when the business has confirmed it (or is always-true, like years/license).
 *
 * Run once: `node knowledge/pool/scripts/add-facts.mjs`. Idempotent (skips services
 * that already have a `facts` array).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const VERTICALS = ["hvac", "plumbing", "electrical", "roofing"];

// Always-true facts (no `requires` — business's own confirmed onboarding fields).
const UNGATED = [
  "{years} years serving {areas}.",
  "Licensed and insured, license {license}.",
];

// Confirmed-only facts, gated exactly like the existing headline `requires` flags.
const GATED = {
  warranty: "Workmanship on this service is covered by a written warranty.",
  same_day: "Same-day appointments are available in {areas}.",
  emergency_24_7: "Available 24/7, including nights and weekends.",
  free_estimate: "Free, no-obligation estimates before any work starts.",
  financing: "Financing options are available for larger jobs.",
};

// Which gated facts make sense per service id (install/replace jobs lean on
// estimate+financing; repair/maintenance jobs lean on warranty; emergency-* on 24/7).
function gatedFor(id) {
  if (id.startsWith("emergency")) return ["emergency_24_7", "warranty"];
  if (/install|replacement|repiping|panel-upgrade|ev-charger/.test(id)) return ["free_estimate", "financing", "warranty"];
  if (/maintenance|inspection/.test(id)) return ["same_day", "warranty"];
  return ["warranty", "same_day"];
}

function factsFor(id) {
  return [
    ...UNGATED.map((text) => ({ text })),
    ...gatedFor(id).map((flag) => ({ text: GATED[flag], requires: [flag] })),
  ];
}

let changed = 0;
for (const vertical of VERTICALS) {
  const file = join(DIR, `${vertical}.json`);
  const data = JSON.parse(readFileSync(file, "utf8"));
  for (const s of data.services) {
    if (s.facts) continue;
    s.facts = factsFor(s.id);
    changed++;
  }
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}
console.log(`Added facts to ${changed} services across ${VERTICALS.length} verticals.`);

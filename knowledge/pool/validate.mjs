#!/usr/bin/env node
/**
 * Validates the copy pool (knowledge/pool/*.json) and self-tests the checks.
 *   node knowledge/pool/validate.mjs
 * Exit code 1 on any failure. This is Track D's eval: real-data checks plus deliberate bad-input cases.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const VERTICALS = ["hvac", "plumbing", "electrical", "roofing"];
const TONES = ["practical", "urgent", "reassuring", "premium", "friendly", "direct"];
const FIELDS = new Set(["business", "city", "metro", "phone", "years", "license", "areas"]);
const REQUIRES = new Set(["emergency_24_7", "same_day", "free_estimate", "financing", "warranty"]);
const BANNED = ["unparalleled", "unmatched", "world-class", "trusted partner", "in today's", "look no further", "we pride ourselves", "second to none", "top-notch", "cutting-edge solutions", "we've got you covered"];
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

// ---- checks: each takes a text and returns a list of problems ----
export function textProblems(text) {
  text = String(text);
  const p = [];
  const low = text.toLowerCase();
  for (const b of BANNED) if (low.includes(b)) p.push(`banned phrase "${b}"`);
  if (/[—]/.test(text)) p.push("em dash");
  if (/\$/.test(text)) p.push("dollar amount (no invented prices)");
  if (/\d\s?%/.test(text)) p.push("percentage claim");
  if (/\[[^\]]*\]/.test(text)) p.push("bracket placeholder");
  for (const m of text.matchAll(/\{([a-z_]+)\}/g)) if (!FIELDS.has(m[1])) p.push(`unknown merge field {${m[1]}}`);
  if (/\{|\}/.test(text.replace(/\{[a-z_]+\}/g, ""))) p.push("malformed merge field");
  return p;
}
export function serviceProblems(s) {
  const p = [];
  const gated = (s.requires || []).includes("emergency_24_7");
  if (s.id.startsWith("emergency") && !gated) p.push("emergency service must require emergency_24_7");
  if (!s.symptoms || s.symptoms.length < 4) p.push("needs at least 4 symptoms");
  if (!s.headlines || s.headlines.length < 3) p.push("needs at least 3 headlines");
  else {
    if (new Set(s.headlines.map((h) => h.tone)).size < 2) p.push("headlines need at least 2 tones");
    for (const h of s.headlines) {
      if (!TONES.includes(h.tone)) p.push(`unknown tone ${h.tone}`);
      if (h.text.length > 75) p.push(`headline too long (${h.text.length}): ${h.text}`);
      for (const r of h.requires || []) if (!REQUIRES.has(r)) p.push(`unknown requires ${r}`);
      if (/24\/7|any time|after-hours/i.test(h.text) && !(h.requires || []).includes("emergency_24_7")) p.push(`ungated availability claim: ${h.text}`);
    }
    if (!gated && !s.headlines.some((h) => h.tone === "practical" && !(h.requires || []).length)) p.push("needs an ungated practical headline (fallback)");
  }
  if (!s.heroSub || s.heroSub.length < 1) p.push("needs a heroSub");
  if (!s.blurb || words(s.blurb) < 8) p.push("blurb too short");
  const da = words(s.directAnswer || "");
  if (da < 30 || da > 90) p.push(`directAnswer is ${da} words (want 30-90)`);
  if (!s.process || s.process.length < 3 || s.process.length > 5) p.push("process needs 3-5 steps");
  if (!s.faq || s.faq.length < 3) p.push("needs at least 3 FAQ entries");
  // SPEC-16 Layer 1 "fact density" (ai-seo-setup.md step 3): >=3 concrete facts per
  // service, and at least 2 must be ungated (always true) so fact density never
  // depends on the business confirming anything.
  if (!s.facts || s.facts.length < 3) p.push("needs at least 3 facts (fact density, SPEC-16 Layer 1)");
  else {
    for (const f of s.facts) for (const r of f.requires || []) if (!REQUIRES.has(r)) p.push(`unknown requires ${r} in fact "${f.text}"`);
    const ungated = s.facts.filter((f) => !(f.requires || []).length).length;
    if (ungated < 2) p.push(`needs at least 2 ungated facts (has ${ungated})`);
  }
  const all = [...(s.symptoms || []), ...(s.headlines || []).map((h) => h.text), ...(s.heroSub || []).map((h) => h.text), s.blurb, s.directAnswer, ...(s.process || []), ...(s.faq || []).flatMap((f) => [f.q, f.a]), ...(s.facts || []).map((f) => f.text)].filter(Boolean);
  for (const t of all) for (const x of textProblems(t)) p.push(`${x} in "${t.slice(0, 60)}"`);
  return p;
}
// pick a headline for a profile given what the business has confirmed
export function pickHeadline(service, profile, profiles, confirmed = []) {
  const ok = (h) => (h.requires || []).every((r) => confirmed.includes(r));
  for (const tone of profiles.find((x) => x.id === profile).tones)
    { const h = service.headlines.find((x) => x.tone === tone && ok(x)); if (h) return h; }
  return service.headlines.find((x) => x.tone === "practical" && ok(x)) || null;
}

let failed = 0, passed = 0;
const check = (name, cond, detail = "") => { if (cond) passed++; else { failed++; console.log(`  FAIL ${name} ${detail}`); } };

// ---- self-tests: the checker must catch deliberately bad input ----
console.log("Self-tests (bad input must be caught)");
check("catches banned phrase", textProblems("We are your trusted partner").length > 0);
check("catches em dash", textProblems("Fast — and honest").length > 0);
check("catches dollar amount", textProblems("Only $99 today").length > 0);
check("catches percentage", textProblems("Saves 30% on bills").length > 0);
check("catches unknown merge field", textProblems("Call {fax}").length > 0);
check("catches bracket placeholder", textProblems("[City] plumbing").length > 0);
check("accepts clean text", textProblems("{business} repairs drains across {areas}. Call {phone}.").length === 0);
check("catches ungated 24/7 claim", serviceProblems({ id: "x", symptoms: [1,2,3,4], headlines: [{tone:"urgent",text:"Open 24/7 in {city}"},{tone:"practical",text:"Repair in {city}"},{tone:"direct",text:"Call {phone}"}], heroSub:[{tone:"practical",text:"a"}], blurb:"one two three four five six seven eight nine", directAnswer: Array(40).fill("word").join(" "), process:["a","b","c"], faq:[1,2,3].map(()=>({q:"q?",a:"a."})) }).some((m) => m.includes("ungated")));
check("catches emergency service without gate", serviceProblems({ id: "emergency-x", symptoms:[1,2,3,4], headlines:[], heroSub:[], blurb:"", directAnswer:"", process:[], faq:[] }).some((m) => m.includes("must require")));
check("catches missing facts", serviceProblems({ id: "x", symptoms:[1,2,3,4], headlines:[{tone:"practical",text:"a"}], heroSub:[{tone:"practical",text:"a"}], blurb:"one two three four five six seven eight nine", directAnswer: Array(40).fill("word").join(" "), process:["a","b","c"], faq:[1,2,3].map(()=>({q:"q?",a:"a."})), facts:[] }).some((m) => m.includes("fact density")));
check("catches under-ungated facts", serviceProblems({ id: "x", symptoms:[1,2,3,4], headlines:[{tone:"practical",text:"a"}], heroSub:[{tone:"practical",text:"a"}], blurb:"one two three four five six seven eight nine", directAnswer: Array(40).fill("word").join(" "), process:["a","b","c"], faq:[1,2,3].map(()=>({q:"q?",a:"a."})), facts:[{text:"a"},{text:"b",requires:["warranty"]},{text:"c",requires:["same_day"]}] }).some((m) => m.includes("ungated facts")));
check("accepts valid facts", !serviceProblems({ id: "x", symptoms:[1,2,3,4], headlines:[{tone:"practical",text:"a"},{tone:"urgent",text:"b"}], heroSub:[{tone:"practical",text:"a"}], blurb:"one two three four five six seven eight nine", directAnswer: Array(40).fill("word").join(" "), process:["a","b","c"], faq:[1,2,3].map(()=>({q:"q?",a:"a."})), facts:[{text:"{years} years serving {areas}."},{text:"Licensed and insured, license {license}."},{text:"Written warranty on this service.",requires:["warranty"]}] }).some((m) => m.includes("fact")));

// ---- real data ----
console.log("Pool data");
const profilesFile = JSON.parse(readFileSync(join(DIR, "profiles.json"), "utf8"));
check("profiles: 10 profiles", profilesFile.profiles.length === 10);
check("profiles: tones valid", profilesFile.profiles.every((x) => x.tones.every((t) => TONES.includes(t))));
const styleProfiles = JSON.parse(readFileSync(join(DIR, "../../app/src/data/styleProfiles.json"), "utf8")).profiles.map((x) => x.id).sort();
check("profiles match app/src/data/styleProfiles.json", JSON.stringify(styleProfiles) === JSON.stringify(profilesFile.profiles.map((x) => x.id).sort()));
const summary = [];
for (const v of VERTICALS) {
  const d = JSON.parse(readFileSync(join(DIR, `${v}.json`), "utf8"));
  check(`${v}: has 6 services`, d.services.length >= 6, `(${d.services.length})`);
  check(`${v}: unique service ids`, new Set(d.services.map((s) => s.id)).size === d.services.length);
  let resolved = 0, cells = 0;
  for (const s of d.services) {
    const probs = serviceProblems(s);
    check(`${v}/${s.id}`, probs.length === 0, "\n    " + probs.join("\n    "));
    for (const pr of profilesFile.profiles) {
      if ((s.requires || []).length) continue; // gated services are skipped unless the business confirms
      cells++; if (pickHeadline(s, pr.id, profilesFile.profiles, [])) resolved++;
    }
  }
  check(`${v}: every profile resolves a headline for every ungated service`, resolved === cells, `(${resolved}/${cells})`);
  summary.push(`${v}: ${d.services.length} services, ${d.services.reduce((n, s) => n + s.headlines.length, 0)} headlines, ${d.services.reduce((n, s) => n + s.faq.length, 0)} FAQs, ${d.services.reduce((n, s) => n + (s.facts?.length || 0), 0)} facts, profile coverage ${resolved}/${cells}`);
}
const ph = JSON.parse(readFileSync(join(DIR, "cities/phoenix.json"), "utf8"));
check("phoenix facts are marked unverified", ph.facts.every((f) => f.verified === false));
console.log(summary.join("\n"));
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);

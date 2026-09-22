#!/usr/bin/env node
// node agents/design/evals/run.mjs [--fast] [--only design|qa|discovery|smoke] [--filter <id-substring>]
import { runSuite } from "./harness.mjs";
import design from "./design.eval.mjs";
import qa from "./qa.eval.mjs";
import discovery from "./discovery.eval.mjs";

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const only = opt("--only");
const opts = { fast: args.includes("--fast"), filter: opt("--filter") };
const suites = { design, qa, discovery };

let failed = 0, passed = 0;
for (const [name, cases] of Object.entries(suites)) {
  if (only && only !== name) continue;
  const r = await runSuite(`${name} agent`, cases, opts);
  failed += r.fail; passed += r.pass;
}
console.log(`\nTOTAL: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);

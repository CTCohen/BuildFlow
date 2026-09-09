#!/usr/bin/env node
/**
 * Knowledge-graph engineering for the KB.
 *
 *   node knowledge/graph.mjs            # print coverage report + write graph.json / graph.mmd
 *   node knowledge/graph.mjs --strict   # exit 1 if any stub cards or missing Check blocks
 *
 * Nodes:  card · reference · task
 * Edges:  card --links--> card   |   card --cites--> reference   |   card --in--> task
 *
 * The report is what drives the learning loop: it lists exactly what is unbuilt or
 * unconnected — stub cards, cards with no Check, dangling [[links]], orphan cards,
 * references nothing has synthesised yet, manifest entries with no file.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const KROOT = dirname(fileURLToPath(import.meta.url));
const strict = process.argv.includes("--strict");

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

function parse(file) {
  const raw = readFileSync(file, "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const fm = {};
  if (m) {
    for (const line of m[1].split("\n")) {
      const mm = line.match(/^([a-z_]+):\s*(.*)$/i);
      if (!mm) continue;
      let v = mm[2].trim();
      if (v.startsWith("[") && v.endsWith("]")) {
        v = v.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      }
      fm[mm[1]] = v;
    }
  }
  const body = m ? raw.slice(m[0].length) : raw;
  return { fm, body };
}

const files = walk(KROOT).filter((f) => !/\/(README|LEARNING-LOG)\.md$/.test(f));
const cards = new Map();       // id -> {id, type, status, path, links[], cites[], hasCheck, stub}
const refs = new Map();        // refId -> {id, path?, citedBy:Set}

for (const f of files) {
  const rel = relative(KROOT, f).replace(/\.md$/, "");
  const isRefFile = rel.startsWith("references/") && rel !== "references/_index";
  const { fm, body } = parse(f);
  if (isRefFile) {
    const id = "ref:" + rel.split("/").pop();
    refs.set(id, refs.get(id) || { id, path: rel, citedBy: new Set() });
    continue;
  }
  if (rel === "references/_index") continue;
  const id = fm.id || rel.split("/").pop();
  const links = [...body.matchAll(/\[\[([a-z0-9-]+)\]\]/gi)].map((x) => x[1]);
  const cites = Array.isArray(fm.source) ? fm.source : fm.source ? [fm.source] : [];
  cards.set(id, {
    id, path: rel,
    type: fm.type || "?",
    status: fm.status || "?",
    applies_to: Array.isArray(fm.applies_to) ? fm.applies_to : fm.applies_to ? [fm.applies_to] : [],
    links, cites,
    hasCheck: /^##\s+Check\b/m.test(body),
    stub: /TODO: card not written/.test(body) || body.trim().length < 120,
  });
  for (const c of cites) {
    if (!c.startsWith("ref:")) continue;
    refs.set(c, refs.get(c) || { id: c, citedBy: new Set() });
    refs.get(c).citedBy.add(id);
  }
}

// manifest — entries are paths relative to knowledge/ (matches compile.mjs)
const byPath = new Map([...cards.values()].map((c) => [c.path, c]));
const manifest = JSON.parse(readFileSync(join(KROOT, "manifest.json"), "utf8"));
const taskOf = new Map(); // cardId -> Set(task)
const manifestMissing = [];
for (const [task, block] of Object.entries(manifest)) {
  if (task.startsWith("_")) continue;
  const paths = [...(block.always || []), ...Object.values(block.byTrade || {}).flat()];
  for (const p of paths) {
    const card = byPath.get(p);
    if (!card && !existsSync(join(KROOT, p + ".md"))) { manifestMissing.push(`${task}: ${p}`); continue; }
    const id = card ? card.id : p.split("/").pop();
    if (!taskOf.has(id)) taskOf.set(id, new Set());
    taskOf.get(id).add(task);
  }
}

// analysis
const A = {
  stubs: [], noCheck: [], drafts: [], danglingLinks: [], orphans: [], unusedRefs: [], manifestMissing,
};
const ids = new Set(cards.keys());
for (const c of cards.values()) {
  if (c.stub) A.stubs.push(c.id);
  else if (!c.hasCheck && c.type !== "reference") A.noCheck.push(c.id);
  if (c.status === "draft") A.drafts.push(c.id);
  for (const l of c.links) if (!ids.has(l)) A.danglingLinks.push(`${c.id} -> [[${l}]]`);
  const inTask = taskOf.has(c.id);
  const linkedTo = [...cards.values()].some((o) => o.links.includes(c.id));
  if (!inTask && !linkedTo && c.type !== "reference") A.orphans.push(c.id);
}
for (const r of refs.values()) if (r.citedBy.size === 0) A.unusedRefs.push(r.id);

// outputs
const graph = {
  generated: new Date().toISOString(),
  nodes: [
    ...[...cards.values()].map((c) => ({ id: c.id, kind: "card", type: c.type, status: c.status, stub: c.stub, hasCheck: c.hasCheck })),
    ...[...refs.values()].map((r) => ({ id: r.id, kind: "reference" })),
    ...Object.keys(manifest).filter((k) => !k.startsWith("_")).map((t) => ({ id: `task:${t}`, kind: "task" })),
  ],
  edges: [
    ...[...cards.values()].flatMap((c) => c.links.filter((l) => ids.has(l)).map((l) => ({ from: c.id, to: l, rel: "links" }))),
    ...[...cards.values()].flatMap((c) => c.cites.filter((x) => x.startsWith("ref:")).map((x) => ({ from: c.id, to: x, rel: "cites" }))),
    ...[...taskOf.entries()].flatMap(([id, ts]) => [...ts].map((t) => ({ from: id, to: `task:${t}`, rel: "in" }))),
  ],
};
writeFileSync(join(KROOT, "graph.json"), JSON.stringify(graph, null, 2) + "\n");

const mmd = ["graph LR"];
for (const n of graph.nodes) {
  if (n.kind === "card") mmd.push(`  ${n.id}["${n.id}${n.stub ? " ⚠stub" : n.status === "draft" ? " ·draft" : ""}"]`);
  if (n.kind === "task") mmd.push(`  ${n.id.replace(":", "_")}(("${n.id}"))`);
}
for (const e of graph.edges) {
  const to = e.to.startsWith("task:") ? e.to.replace(":", "_") : e.to;
  mmd.push(`  ${e.from} --> ${to}`);
}
writeFileSync(join(KROOT, "graph.mmd"), mmd.join("\n") + "\n");

// report
const line = (label, arr) =>
  console.log(`\n${label} (${arr.length})${arr.length ? ":\n  - " + arr.join("\n  - ") : ""}`);
console.log(`KB graph — ${cards.size} cards, ${refs.size} references, ${graph.edges.length} edges`);
const active = [...cards.values()].filter((c) => !c.stub && c.status === "active").length;
console.log(`active: ${active}/${cards.size}  ·  with Check: ${[...cards.values()].filter((c) => c.hasCheck).length}/${cards.size}`);
line("STUB cards (write these)", A.stubs);
line("cards missing a ## Check block", A.noCheck);
line("still draft (promote when validated)", A.drafts);
line("dangling [[links]]", A.danglingLinks);
line("orphan cards (no task, nothing links here)", A.orphans);
line("references not yet synthesised into a card", A.unusedRefs);
line("manifest entries with no card file", A.manifestMissing);
console.log(`\nwrote knowledge/graph.json · knowledge/graph.mmd`);

if (strict && (A.stubs.length || A.noCheck.length || A.manifestMissing.length)) {
  console.error(`\n✗ strict: ${A.stubs.length} stubs, ${A.noCheck.length} missing Check, ${A.manifestMissing.length} manifest gaps`);
  process.exit(1);
}

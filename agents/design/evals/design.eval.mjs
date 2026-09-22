// Design Agent evals: obvious, edge and failure cases. `slow` cases run a real Astro build.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { assert, baseClient, scratch } from "./harness.mjs";
import { resolveDesign, renderSite, pickTheme } from "../design-agent.mjs";
import { contrast } from "../lib/color.mjs";
import styleProfiles from "../../../app/src/data/styleProfiles.json" with { type: "json" };

const themesOf = (id) => styleProfiles.profiles.find((p) => p.id === id).themes;
const html = (dir, f = "index.html") => readFileSync(join(dir, f), "utf8");
const dirSize = (d) => readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? dirSize(join(d, e.name)) : statSync(join(d, e.name)).size), 0);

export default [
  // ---- obvious
  { id: "d01", desc: "SMB generated identity takes a theme from its profile", run() {
    const { client, design } = resolveDesign(baseClient({ styleProfile: "eco-conscious" }));
    assert.ok(themesOf("eco-conscious").includes(design.theme));
    assert.equal(client.brand.primary, JSON.parse(readFileSync(new URL("../../../app/src/data/themes-30.json", import.meta.url))).find((t) => t.themeId === design.theme).colors.primary);
  } },
  { id: "d02", desc: "all 10 profiles resolve to one of their own themes", run() {
    for (const p of styleProfiles.profiles) {
      const { design } = resolveDesign(baseClient({ styleProfile: p.id, slug: "x-" + p.id }));
      assert.ok(p.themes.includes(design.theme), `${p.id} -> ${design.theme}`);
    }
  } },
  { id: "d03", desc: "same input gives identical output (deterministic)", run() {
    const a = resolveDesign(baseClient());
    const b = resolveDesign(baseClient());
    assert.deepEqual(a, b);
  } },
  { id: "d04", desc: "emergency trade gets the full-bleed hero", run() {
    assert.equal(resolveDesign(baseClient()).design.heroStyle, "full-bleed");
  } },
  { id: "d05", desc: "portfolio trade gets the photo-left hero", run() {
    const c = baseClient(); c.business.trade = "roofing";
    assert.equal(resolveDesign(c).design.heroStyle, "photo-left");
  } },
  { id: "d06", desc: "luxury profile overrides to the minimal hero", run() {
    assert.equal(resolveDesign(baseClient({ styleProfile: "luxury-premium" })).design.heroStyle, "minimal");
  } },
  { id: "d07", desc: "profile sets type pairing and density", run() {
    const { design } = resolveDesign(baseClient({ styleProfile: "established-authority" }));
    assert.equal(design.typePairing, "classic");
    assert.equal(design.density, "spacious");
  } },
  { id: "d08", desc: "6+ services switch to the list-sidebar layout", run() {
    const c = baseClient();
    while (c.content.en.services.length < 6) c.content.en.services.push({ name: "Extra " + c.content.en.services.length, blurb: "A real extra service." });
    assert.equal(resolveDesign(c).design.servicesLayout, "list-sidebar");
  } },

  // ---- tiers
  { id: "d09", desc: "Micro locks profile, hero, type and density whatever the input asks", run() {
    const { client } = resolveDesign(baseClient({ tier: "micro", styleProfile: "luxury-premium" }));
    assert.equal(client.styleProfile, "professional-service");
    assert.deepEqual([client.brand.heroStyle, client.brand.typePairing, client.brand.density], ["split", "grotesk-serif", "comfortable"]);
  } },
  { id: "d10", desc: "Micro drops customer sliders", run() {
    const { client, design } = resolveDesign(baseClient({ tier: "micro", customization: { radius: 20, primary: "#123456" } }));
    assert.equal(client.customization, undefined);
    assert.ok(design.decisions.some((d) => d.includes("customization ignored")));
  } },
  { id: "d11", desc: "paused Mid-Market builds as SMB, with a note", run() {
    const { client, design } = resolveDesign(baseClient({ tier: "mid-market" }));
    assert.equal(client.tier, "smb");
    assert.ok(design.decisions.some((d) => d.includes("mid-market")));
  } },
  { id: "d12", desc: "SMB slider colors override the profile theme", run() {
    const { client } = resolveDesign(baseClient({ customization: { primary: "#0a4d8c", accent: "#ff8800" } }));
    assert.equal(client.brand.primary, "#0a4d8c");
    assert.equal(client.brand.accent, "#ff8800");
  } },

  // ---- identity
  { id: "d13", desc: "existing-identity keeps the logo colors (no theme overwrite)", run() {
    const c = baseClient(); c.media = { source: "existing-identity", logo: "https://x.test/l.png" }; c.brand.primary = "#7a1f3d"; c.brand.accent = "#e0b04c";
    const { client } = resolveDesign(c);
    assert.equal(client.brand.primary, "#7a1f3d");
    assert.equal(client.brand.accent, "#e0b04c");
    assert.ok(client.brand.primaryDark && client.brand.primaryLight);
  } },

  // ---- edge / repair
  { id: "d14", desc: "missing tier and profile get safe defaults", run() {
    const c = baseClient(); delete c.tier; delete c.styleProfile;
    const { client } = resolveDesign(c);
    assert.equal(client.tier, "smb");
    assert.equal(client.styleProfile, "professional-service");
  } },
  { id: "d15", desc: "unknown profile falls back to the default theme pool", run() {
    const { design } = resolveDesign(baseClient({ styleProfile: "no-such-profile" }));
    assert.ok(themesOf("professional-service").includes(design.theme));
  } },
  { id: "d16", desc: "correction brand-contrast darkens a pale primary to 4.5:1", run() {
    const c = baseClient(); c.media = { source: "existing-identity", logo: "https://x.test/l.png" }; c.brand.primary = "#f2d24b";
    const { client } = resolveDesign(c, { corrections: ["brand-contrast"] });
    assert.ok(contrast(client.brand.primary, "#ffffff") >= 4.5);
  } },
  { id: "d17", desc: "correction layout-sanity falls back to the minimal hero, compact density", run() {
    const { client } = resolveDesign(baseClient(), { corrections: ["layout-sanity"] });
    assert.deepEqual([client.brand.heroStyle, client.brand.density], ["minimal", "compact"]);
  } },
  { id: "d18", desc: "an unfixable correction is recorded, not silently dropped", run() {
    const { design } = resolveDesign(baseClient(), { corrections: ["placeholders"] });
    assert.ok(design.decisions.some((d) => d.includes("no automatic fix")));
  } },
  { id: "d19", desc: "resolveDesign does not mutate its input", run() {
    const c = baseClient(); const before = JSON.stringify(c);
    resolveDesign(c, { corrections: ["layout-sanity"] });
    assert.equal(JSON.stringify(c), before);
  } },

  // ---- failure
  { id: "d20", desc: "invalid input fails at the schema, before any build", async run() {
    const c = baseClient(); c.business.phone = "nope";
    const r = await renderSite(c, { outDir: join(scratch("d20"), "o") });
    assert.equal(r.ok, false);
    assert.equal(r.stage, "schema");
    assert.match(r.error, /phone/);
  } },
  { id: "d21", desc: "scaffold FILL_ text is rejected as a placeholder", async run() {
    const c = baseClient(); c.content.en.about = "FILL_en about paragraph";
    const r = await renderSite(c, { outDir: join(scratch("d21"), "o") });
    assert.equal(r.stage, "schema");
    assert.match(r.error, /placeholder/);
  } },

  // ---- real builds
  { id: "d22", slow: true, desc: "SMB build produces the full page set with the business name", async run() {
    const out = join(scratch("d22"), "o");
    const r = await renderSite(baseClient(), { outDir: out });
    assert.equal(r.ok, true, r.error);
    for (const f of ["index.html", "about/index.html", "services/index.html", "contact/index.html", "sitemap.xml"]) assert.ok(existsSync(join(out, f)), f);
    assert.ok(html(out).includes(baseClient().business.name));
  } },
  { id: "d23", slow: true, desc: "Micro build has no About page and no area pages", async run() {
    const out = join(scratch("d23"), "o");
    const r = await renderSite(baseClient({ tier: "micro" }), { outDir: out });
    assert.equal(r.ok, true, r.error);
    assert.equal(existsSync(join(out, "about")), false);
    assert.equal(existsSync(join(out, "areas")), false);
    assert.ok(existsSync(join(out, "services/index.html")) && existsSync(join(out, "contact/index.html")));
    assert.ok(!html(out).includes('href="/about"'));
  } },
  { id: "d24", slow: true, desc: "home page stays small (~50KB target; 120KB ceiling here)", async run() {
    const out = join(scratch("d24"), "o");
    await renderSite(baseClient(), { outDir: out });
    const kb = statSync(join(out, "index.html")).size / 1024;
    assert.ok(kb < 120, `index.html is ${kb.toFixed(0)}KB`);
  } },
  { id: "d25", slow: true, desc: "SMB spacing and radius sliders reach the HTML; Micro ignores them", async run() {
    const custom = { spacing: 1.2, radius: 4 };
    const smb = join(scratch("d25a"), "o");
    await renderSite(baseClient({ customization: custom }), { outDir: smb });
    assert.match(html(smb), /--radius-lg:4px/);
    assert.match(html(smb), /--density-section:6\.60rem/);
    const micro = join(scratch("d25b"), "o");
    await renderSite(baseClient({ tier: "micro", customization: custom }), { outDir: micro });
    assert.doesNotMatch(html(micro), /--radius-lg:4px/);
  } },
  { id: "d26", slow: true, desc: "two builds can run in parallel without clobbering each other", async run() {
    const root = scratch("d26");
    const [a, b] = await Promise.all([
      renderSite(baseClient({ slug: "par-a" }), { outDir: join(root, "a") }),
      renderSite(baseClient({ slug: "par-b", tier: "micro", business: { ...baseClient().business, name: "Parallel Plumbing B" } }), { outDir: join(root, "b") }),
    ]);
    assert.ok(a.ok && b.ok, a.error || b.error);
    assert.ok(html(join(root, "b")).includes("Parallel Plumbing B"));
    assert.ok(!html(join(root, "a")).includes("Parallel Plumbing B"));
  } },
];

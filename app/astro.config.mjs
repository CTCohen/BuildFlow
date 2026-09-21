// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// One client per build. Select with:  CLIENT=<slug> npm run build
// Falls back to the demo client so `npm run dev` always works.
const CLIENT = process.env.CLIENT || "demo-plumbing";

// Design Agent hooks (agents/design/): OUT_DIR isolates parallel builds, CLIENT_DATA passes
// a resolved client inline so no file has to be written into src/data/clients/.
const OUT_DIR = process.env.OUT_DIR || "dist";
const CLIENT_DATA = process.env.CLIENT_DATA || "";

export default defineConfig({
  outDir: OUT_DIR,
  cacheDir: process.env.CACHE_DIR || "node_modules/.astro",
  site: process.env.SITE_URL || "https://example.com",
  vite: {
    // per-build vite dep cache so parallel builds do not fight over node_modules/.vite
    ...(process.env.VITE_CACHE_DIR ? { cacheDir: process.env.VITE_CACHE_DIR } : {}),
    // cast: @tailwindcss/vite ships a slightly newer Vite Plugin type than the
    // one bundled with Astro; harmless at runtime.
    plugins: [/** @type {any} */ (tailwindcss())],
    define: {
      "import.meta.env.CLIENT": JSON.stringify(CLIENT),
      "import.meta.env.CLIENT_DATA": JSON.stringify(CLIENT_DATA),
    },
  },
});

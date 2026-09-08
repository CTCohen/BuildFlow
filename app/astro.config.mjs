// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// One client per build. Select with:  CLIENT=<slug> npm run build
// Falls back to the demo client so `npm run dev` always works.
const CLIENT = process.env.CLIENT || "demo-plumbing";

export default defineConfig({
  site: process.env.SITE_URL || "https://example.com",
  vite: {
    // cast: @tailwindcss/vite ships a slightly newer Vite Plugin type than the
    // one bundled with Astro; harmless at runtime.
    plugins: [/** @type {any} */ (tailwindcss())],
    define: {
      "import.meta.env.CLIENT": JSON.stringify(CLIENT),
    },
  },
});

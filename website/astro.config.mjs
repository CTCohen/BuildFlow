import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://buildflow.com',
  integrations: [],
  output: 'static',
  vite: {
    ssr: {
      external: ['svgo'],
    },
  },
});

// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Production origin. The canonical link, og:/twitter: URLs, the JSON-LD ids
  // and the sitemap are all built from it. Without it a static build bakes
  // http://localhost:4321 into the HTML.
  site: 'https://victorolave.dev',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});

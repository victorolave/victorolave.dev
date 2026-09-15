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
  // Spanish is the default at "/"; English lives at "/en/". No auto-redirect
  // between them — the language switcher is the only way to cross.
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false
    }
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es', en: 'en' }
      },
      // Adds x-default -> /en/ to every entry's alternates. Builds a NEW
      // array per item — the lib caches one `links` array per path shared
      // between the es/en pair, so `push`ing onto it writes x-default twice.
      serialize(item) {
        if (item.links) {
          item.links = [...item.links, { url: 'https://victorolave.dev/en/', lang: 'x-default' }];
        }
        return item;
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});

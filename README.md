# victorolave.dev

Personal portfolio of Victor Olave — a bilingual, single-page editorial site
built with Astro.

**Live:** [victorolave.dev](https://victorolave.dev) (Spanish) ·
[victorolave.dev/en/](https://victorolave.dev/en/) (English)

_Leer en [español](README.es.md)._

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro 6 (static output) | One page, zero client framework, ships almost no JS |
| Styles | Tailwind CSS v4 (via `@tailwindcss/vite`) | No separate design build step |
| Motion | `motion` + `lenis` | Scroll reveals, pinned case studies, smooth scroll |
| Graphics | `ogl` | The WebGL grain gradient behind the manifesto panel |
| Hosting | Cloudflare Workers static assets | No adapter, no Worker script — `dist/` is served at the edge |
| Package manager | pnpm, Node `>=22.12.0` | Pinned in `engines` and `.node-version` |

## Commands

| Command | Action |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Dev server on `localhost:4321` |
| `pnpm build` | Static build into `./dist/` |
| `pnpm preview` | Serve the build locally |

## Languages

Spanish is the default locale at `/`; English lives at `/en/`
(`astro.config.mjs`). There is no automatic redirect between them — the
language switcher is the only way to cross.

- **`src/i18n/en.ts`** defines the `Dictionary` type; **`src/i18n/es.ts`** must
  match it, so a missing or extra Spanish key fails typecheck instead of
  shipping silently.
- **`src/pages/index.astro`** and **`src/pages/en/index.astro`** render the same
  page for each locale.
- The sitemap emits `hreflang` alternates for both locales plus an
  `x-default` pointing to `/en/`.

## Where the content lives

There is no CMS. The pieces worth knowing:

- **`src/i18n/{es,en}.ts`** — all interface copy: hero, about, experience,
  manifesto, process, skills, the "now" logbook, contact and footer.
- **`src/data/projects.ts`** — the single source for projects, featured case
  studies and testimonials. Fields that differ per language use
  `Localized<T>`; proper nouns stay as plain strings. Every entry must be
  backed by the CV (`public/victor-olave-cv-2026.pdf`) or by a public
  repository on [github.com/victorolave](https://github.com/victorolave). No
  filler entries, no metrics that cannot be defended.
- **The "now" logbook** carries a `lastUpdated` date in both dictionaries. It
  needs a pass every couple of months, or the section should be removed.
- **`public/work/*.webp`** — real screenshots of the live products, referenced
  from the `image` field in `projects.ts`. A project without a screenshot
  renders a typographic plate instead; there is deliberately no illustrated
  mock-UI fallback, because a fabricated interface implies a product that does
  not exist.
- **`public/og-image-{es,en}.jpg`** — 1200×630 social cards, one per locale.

## Deploying

The site deploys to Cloudflare as Workers static assets (`wrangler.jsonc`):
`pnpm build` writes `dist/`, and Cloudflare serves it directly.
`html_handling: auto-trailing-slash` makes `/en` redirect to `/en/`, the form
used by the canonical and `hreflang` links.

`site` in `astro.config.mjs` is set to `https://victorolave.dev`. The canonical
link, every `og:`/`twitter:` URL, the JSON-LD ids and the sitemap are built from
it, so change it there if the domain changes — a build without it bakes the
dev-server origin into the HTML.

`public/_headers` sets the cache policy: hashed output (`/_astro/*`) and fonts
are cached as immutable; screenshots, social cards and favicons are not hashed,
so they get a one-day cache with revalidation. Fonts carry a content hash in
their filename — rename the file when you replace one.

`@astrojs/sitemap` writes `sitemap-index.xml` at build time, and
`public/robots.txt` points crawlers to it.

## Accessibility and motion

Every animated surface honours `prefers-reduced-motion`. The preloader resolves
immediately under reduced motion, and reveal animations fall back to static
content. Note that browsers throttle `requestAnimationFrame` in background
tabs, so a page opened in an unfocused tab holds on the preloader until it is
focused.

## License

This repository is split into two parts, and they are licensed differently:

- **Code** — the source code (components, layouts, scripts, styles and
  configuration) is released under the [MIT License](LICENSE). Use it as a
  reference or a starting point for your own site.
- **Content** — my name and logo, written copy, CV, photos, screenshots,
  social cards and testimonials are **not** covered by the MIT License. All
  rights reserved. See [CONTENT-LICENSE.md](CONTENT-LICENSE.md) for the exact
  list.

If you build on this code, please replace the content with your own.

The self-hosted fonts (Fraunces, Inter, JetBrains Mono) are licensed under the
SIL Open Font License 1.1; their licenses ship in
[`public/licenses/fonts/`](public/licenses/fonts/).

# victorolave

Personal portfolio — a single-page editorial site built with Astro.

**Live:** _not yet configured — see [Deploying](#deploying)_

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro 6 (static output) | One page, zero client framework, ships almost no JS |
| Styles | Tailwind CSS v4 (via `@tailwindcss/vite`) | No separate design build step |
| Motion | `motion` + `lenis` | Scroll reveals, pinned case studies, smooth scroll |
| Graphics | `ogl` | The WebGL grain gradient behind the manifesto panel |
| Package manager | pnpm (`>=22.12.0` Node) | Pinned in `engines` |

## Commands

| Command | Action |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Dev server on `localhost:4321` |
| `pnpm build` | Static build into `./dist/` |
| `pnpm preview` | Serve the build locally |

## Where the content lives

All copy is authored in components; there is no CMS. The pieces worth knowing:

- **`src/data/projects.ts`** — the single source for projects, featured case
  studies and the About stack list. Every entry must be backed by the CV
  (`public/victor-olave-cv-2026.pdf`) or by a public repository on
  [github.com/victorolave](https://github.com/victorolave). No filler entries,
  no metrics that cannot be defended.
- **`src/components/ExperienceSection.astro`** — employment history and
  education, validated against the same CV.
- **`src/components/TestimonialsSection.astro`** — quotes, names and roles.
- **`src/components/NowSection.astro`** — the "logbook"; it carries a
  last-updated date, so it needs a pass every couple of months or it should be
  removed.
- **`public/work/*.webp`** — real screenshots of the live products, referenced
  from the `image` field in `projects.ts`. A project without a screenshot
  renders a typographic plate instead; there is deliberately no illustrated
  mock-UI fallback, because a fabricated interface implies a product that does
  not exist.
- **`public/og-image.jpg`** — 1200×630 social card.

## Deploying

`astro.config.mjs` has no `site` set. Until it does, `astro build` bakes the
dev-server origin into `<link rel="canonical">` and every `og:`/`twitter:` URL,
which breaks link previews. Set it before the first deploy:

```js
export default defineConfig({
  site: "https://your-domain.example",
  // …
});
```

## Accessibility and motion

Every animated surface honours `prefers-reduced-motion`. The preloader resolves
immediately under reduced motion, and reveal animations fall back to static
content. Note that browsers throttle `requestAnimationFrame` in background
tabs, so a page opened in an unfocused tab holds on the preloader until it is
focused.

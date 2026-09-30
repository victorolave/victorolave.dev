# victorolave.dev

Portafolio personal de Victor Olave — un sitio editorial bilingüe de una sola
página, construido con Astro.

**En vivo:** [victorolave.dev](https://victorolave.dev) (español) ·
[victorolave.dev/en/](https://victorolave.dev/en/) (inglés)

_Read in [English](README.md)._

## Stack

| Capa | Elección | Por qué |
|---|---|---|
| Framework | Astro 6 (salida estática) | Una página, sin framework de cliente, casi nada de JS |
| Estilos | Tailwind CSS v4 (vía `@tailwindcss/vite`) | Sin un paso de build aparte para el diseño |
| Movimiento | `motion` + `lenis` | Revelados al hacer scroll, casos de estudio fijados, scroll suave |
| Gráficos | `ogl` | El degradado WebGL con grano detrás del panel del manifiesto |
| Hosting | Cloudflare Workers static assets | Sin adapter ni script de Worker — `dist/` se sirve desde el edge |
| Gestor de paquetes | pnpm, Node `>=22.12.0` | Fijado en `engines` y `.node-version` |

## Comandos

| Comando | Acción |
|---|---|
| `pnpm install` | Instala las dependencias |
| `pnpm dev` | Servidor de desarrollo en `localhost:4321` |
| `pnpm build` | Build estático en `./dist/` |
| `pnpm preview` | Sirve el build localmente |

## Idiomas

El español es el idioma por defecto en `/`; el inglés vive en `/en/`
(`astro.config.mjs`). No hay redirección automática entre ambos — el selector
de idioma es la única forma de cambiar.

- **`src/i18n/en.ts`** define el tipo `Dictionary`; **`src/i18n/es.ts`** debe
  cumplirlo, así que una clave faltante o sobrante en español rompe el
  typecheck en lugar de publicarse en silencio.
- **`src/pages/index.astro`** y **`src/pages/en/index.astro`** renderizan la
  misma página para cada idioma.
- El sitemap emite alternativas `hreflang` para ambos idiomas y un
  `x-default` que apunta a `/en/`.

## Dónde vive el contenido

No hay CMS. Lo que conviene saber:

- **`src/i18n/{es,en}.ts`** — todos los textos de la interfaz: hero, sobre mí,
  experiencia, manifiesto, proceso, habilidades, la bitácora "ahora",
  contacto y footer.
- **`src/data/projects.ts`** — la única fuente de proyectos, casos de estudio
  destacados y testimonios. Los campos que cambian por idioma usan
  `Localized<T>`; los nombres propios quedan como strings simples. Cada entrada
  debe estar respaldada por el CV (`public/victor-olave-cv-2026.pdf`) o por un
  repositorio público en [github.com/victorolave](https://github.com/victorolave).
  Nada de relleno ni métricas que no se puedan defender.
- **La bitácora "ahora"** tiene una fecha `lastUpdated` en ambos diccionarios.
  Necesita una revisión cada par de meses, o la sección debería eliminarse.
- **`public/work/*.webp`** — capturas reales de los productos en producción,
  referenciadas desde el campo `image` de `projects.ts`. Un proyecto sin
  captura muestra una placa tipográfica; a propósito no existe un mock de
  interfaz ilustrado como respaldo, porque una interfaz inventada sugiere un
  producto que no existe.
- **`public/og-image-{es,en}.jpg`** — tarjetas sociales de 1200×630, una por
  idioma.

## Despliegue

El sitio se despliega en Cloudflare como Workers static assets
(`wrangler.jsonc`): `pnpm build` genera `dist/` y Cloudflare lo sirve
directamente. `html_handling: auto-trailing-slash` hace que `/en` redirija a
`/en/`, la forma que usan los enlaces canónicos y `hreflang`.

`site` en `astro.config.mjs` está configurado como `https://victorolave.dev`.
El enlace canónico, todas las URLs `og:`/`twitter:`, los ids de JSON-LD y el
sitemap se construyen a partir de él; cámbialo ahí si cambia el dominio — un
build sin él incrusta el origen del servidor de desarrollo en el HTML.

`public/_headers` define la política de caché: la salida con hash
(`/_astro/*`) y las fuentes se cachean como inmutables; las capturas, las
tarjetas sociales y los favicons no llevan hash, así que tienen caché de un día
con revalidación. Las fuentes llevan un hash de su contenido en el nombre del
archivo — renómbralo cuando reemplaces una.

`@astrojs/sitemap` genera `sitemap-index.xml` en el build, y
`public/robots.txt` indica a los crawlers dónde encontrarlo.

## Accesibilidad y movimiento

Toda superficie animada respeta `prefers-reduced-motion`. El preloader se
resuelve de inmediato con movimiento reducido, y las animaciones de revelado
caen a contenido estático. Los navegadores limitan `requestAnimationFrame` en
pestañas en segundo plano, así que una página abierta en una pestaña sin foco
se queda en el preloader hasta que recibe el foco.

## Licencia

Este repositorio tiene dos partes con licencias distintas:

- **Código** — el código fuente (componentes, layouts, scripts, estilos y
  configuración) se publica bajo la [Licencia MIT](LICENSE). Úsalo como
  referencia o punto de partida para tu propio sitio.
- **Contenido** — mi nombre y logo, los textos, el CV, las fotos, las
  capturas, las tarjetas sociales y los testimonios **no** están cubiertos por
  la Licencia MIT. Todos los derechos reservados. Consulta
  [CONTENT-LICENSE.md](CONTENT-LICENSE.md) para la lista exacta.

Si construyes sobre este código, reemplaza el contenido con el tuyo.

Las fuentes autoalojadas (Fraunces, Inter, JetBrains Mono) están bajo la SIL
Open Font License 1.1; sus licencias se incluyen en
[`public/licenses/fonts/`](public/licenses/fonts/).

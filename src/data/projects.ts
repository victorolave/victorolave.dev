// Portfolio content — every entry here is real and verifiable.
// Sources of truth:
//   · public/victor-olave-cv-2026.pdf  (employment, client projects)
//   · github.com/victorolave           (open-source repositories)
// Do not add a project, metric or link that cannot be backed by one of those.
import type { Locale } from "../i18n";

/** A value that differs per locale. */
export type Localized<T> = { en: T; es: T };
/** Either a plain string (same in both locales — proper nouns, brand names)
 *  or a per-locale pair. */
export type Text = string | Localized<string>;

/** Resolves a `Text`/`Localized<T>` value for a locale. Plain values pass
 *  through unchanged, so most Project fields need no wrapping. */
export function pick<T>(value: T | Localized<T>, locale: Locale): T {
  if (
    value !== null &&
    typeof value === "object" &&
    "en" in (value as Record<string, unknown>) &&
    "es" in (value as Record<string, unknown>)
  ) {
    return (value as Localized<T>)[locale];
  }
  return value as T;
}

export type ProjectStatus =
  | "Live"
  | "In progress"
  | "Archived"
  | "Featured"
  | "Open source";

export interface Project {
  /** Plain string for proper nouns/brand names (most entries); `Localized`
   *  only where the title itself is descriptive English text. */
  title: Text;
  /** Not rendered anywhere today (grep confirms it) — kept as plain `string`
   *  on purpose. If this ever becomes visible copy, promote it to `Text`. */
  desc: string;
  stack: string[];
  statuses: ProjectStatus[];
  year: string;
  /** Bare domain — WorkSection prefixes it with https://. null = no public URL. */
  link: string | null;
  /** Real screenshot under /public/work/. Preferred over the abstract preview. */
  image: string | null;
  /** Intrinsic pixel size of `image`, or null when there is none. Drives the
   *  tile's aspect-ratio so the screenshot is never cropped. */
  imageW: number | null;
  imageH: number | null;
}

/** One surface of a case study. */
export interface CaseShot {
  src: string;
  /** Intrinsic pixel size. Drives the media box's aspect-ratio so the shot
   *  fits with no crop and no letterbox, and reserves the space before it
   *  loads. Keep in sync when a screenshot is replaced. */
  w: number;
  h: number;
  /** What this surface proves. Required on purpose: a shot you cannot caption
   *  has not earned its place. Rendered as the image's alt text. */
  caption: Text;
}

/** A named endorsement from someone who used the thing.
 *
 *  These are the only words on this site that belong to somebody else, so the
 *  rule is stricter than anywhere else: `quote` may TRIM and translate, never
 *  rephrase. `sourceEs` holds the author's own Spanish, verbatim, so the trim
 *  can be audited against what was actually said. If a claim is not in
 *  `sourceEs`, it does not go in `quote`. `quoteEs` is the ES-facing excerpt:
 *  one or more CONTIGUOUS fragments of `sourceEs`, joined with "[…]" where
 *  fragments are non-adjacent. Only the first letter's case and the final
 *  punctuation may be adjusted — never rephrased, never a fresh translation
 *  back into Spanish. */
export interface Testimonial {
  /** Trimmed, translated excerpt. Cut for length, not for message. */
  quote: string;
  /** ES-facing excerpt, cut directly from `sourceEs`. See interface doc. */
  quoteEs: string;
  /** The author's own words. Never edit this to fit the layout. */
  sourceEs: string;
  name: string;
  /** Their role at the company. Left empty until confirmed — inventing a
   *  title for a real person is worse than showing none. */
  role: string;
  company: string;
}

/** Resolves a testimonial's quote for a locale: EN reads `quote`, ES reads
 *  `quoteEs` (never `sourceEs` directly — see the interface doc). */
export function quoteOf(testimonial: Testimonial, locale: Locale): string {
  return locale === "es" ? testimonial.quoteEs : testimonial.quote;
}

/** Every endorsement on the site, in one place. Both the Words section and the
 *  featured case that a quote corroborates read from here, so a wording fix
 *  lands in both.
 *
 *  Two entries is the whole list, and that is correct. This array previously
 *  held six invented people at invented companies; one verifiable quote is
 *  worth more than six that collapse the moment somebody searches the name. */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Our previous site was for internal use only. Clients could not use it, nor track their shipments. Now they manage shipments and pay quickly and securely, even linking Apple Pay.",
    quoteEs:
      "Nuestra página anterior […] era de uso interno de la empresa y no estaba disponible para que los clientes la utilizaran, ni pudieran hacer el rastreo de sus envíos. […] los usuarios pueden gestionar sus envíos y realizar pagos de forma ágil y segura, incluso enlazando su cuenta con Apple Pay.",
    sourceEs:
      "Cosa que con nuestra página anterior no se podía, pues era de uso interno de la empresa y no estaba disponible para que los clientes la utilizaran, ni pudieran hacer el rastreo de sus envíos. […] los usuarios pueden gestionar sus envíos y realizar pagos de forma ágil y segura, incluso enlazando su cuenta con Apple Pay.",
    name: "David Vásquez",
    role: "",
    company: "EYP Logistic",
  },
  {
    quote:
      "We used to enter every client's information by hand. Now the clients feed the system themselves: they register, request and pay, which freed us to focus on what grows the business.",
    quoteEs:
      "Antes teníamos que ingresar manualmente nosotros mismos toda la información de cada cliente. Ahora, son los clientes quienes individualmente nutren el sistema, realizan solicitudes, pagos etc. Ha permitido incluso que los clientes se registren por sí solos y eso nos ha permitido a nosotros enfocarnos en otras cosas que son también críticas para el crecimiento del negocio.",
    sourceEs:
      "Antes teníamos que ingresar manualmente nosotros mismos toda la información de cada cliente. Ahora, son los clientes quienes individualmente nutren el sistema, realizan solicitudes, pagos etc. Ha permitido incluso que los clientes se registren por sí solos y eso nos ha permitido a nosotros enfocarnos en otras cosas que son también críticas para el crecimiento del negocio.",
    name: "Natalia Jaramillo",
    role: "",
    company: "EYP Logistic",
  },
  {
    // His own closing summary, not the mechanics from the middle of the letter.
    // It says what the platform did to his working day rather than which
    // feature does what, and the hour at the end is his own measure of it.
    //
    // Attribution stays honest by accident of his wording: the part he credits
    // is "el trabajo repetitivo de carga", and bulk loading IS the platform's
    // half. The planner that feeds it is scheduler-api, which he built himself
    // ("es la combinación de ambas"). Do not rewrite this into a claim that the
    // platform alone produced the hour.
    quote:
      "The platform took the repetitive data entry off me and gave me the autonomy to resolve directly what used to need long manual processes. The hour that once scheduled a single day now schedules the whole week.",
    quoteEs:
      "La plataforma me quitó el trabajo repetitivo de carga y me dio autonomía para resolver directamente lo que antes exigía procesos manuales largos. La hora que antes me alcanzaba para programar un solo día, hoy me alcanza para programar la semana completa.",
    sourceEs:
      "La plataforma me quitó el trabajo repetitivo de carga y me dio autonomía para resolver directamente lo que antes exigía procesos manuales largos. La hora que antes me alcanzaba para programar un solo día, hoy me alcanza para programar la semana completa en las dos plataformas.",
    name: "Julián Villanueva",
    role: "",
    company: "Dev Senior Code",
  },
];

export interface FeaturedCase {
  index: string; // "01" — editorial chapter marker
  kicker: Text; // short label, e.g. "Education platform"
  /** [0] is the hero and sets the media box's ratio; [1] is laid over its
   *  bottom-left corner as a second surface. Two is the cap — a third stops
   *  reading as depth and starts reading as clutter in a box this size. */
  shots: CaseShot[];
  title: Text;
  desc: Text;
  year: Text;
  role: Text;
  /** Tech stack — proper nouns/brand names, unlocalized in both locales. */
  tags: string[];
  /** One `Localized` entry per bullet (not `Localized<string[]>`) so each
   *  highlight's translation sits next to its English source. */
  highlights: Localized<string>[];
  /** Only numbers that can be defended in an interview. Empty is fine. */
  metrics: { value: Text; label: Text }[];
  /** Corroboration from the client's own side. Empty is fine — an invented or
   *  padded testimonial is worth less than none. */
  testimonials?: Testimonial[];
}

export const PROJECTS: Project[] = [
  {
    title: "Dev Senior Code Platform",
    desc: "Full-stack platform for a programming academy: student portal, admin dashboard, program management and scheduling, replacing an operation that ran on WhatsApp.",
    stack: ["Next.js", "NestJS", "PostgreSQL", "MongoDB", "Redis", "n8n"],
    statuses: ["Live", "Featured"],
    year: "2023",
    link: "devseniorcode.com",
    image: "/work/devseniorcode.webp",
    imageW: 1200,
    imageH: 880,
  },
  {
    title: "EYP Logistics",
    desc: "Self-service logistics product: marketing site, client portal, admin platform and integrated payments. Customers track, request and pay without messaging support.",
    stack: ["Next.js", "NestJS", "PostgreSQL"],
    statuses: ["Live", "Featured"],
    year: "",
    link: "eyplogistic.com",
    image: "/work/eyp.webp",
    imageW: 1200,
    imageH: 656,
  },
  {
    title: "Acopio Colombia",
    desc: "National site to find nearby relief collection centres after the 7.4 earthquake of 10 August 2026. It lists 144 centres across 27 departments, each showing what it accepts, when it was verified and its source.",
    stack: ["Next.js 16", "TypeScript", "Supabase", "MapLibre", "Tailwind"],
    statuses: ["Live", "Open source"],
    year: "2026",
    link: "emergency-rosy.vercel.app",
    image: "/work/acopio.webp",
    imageW: 1200,
    imageH: 606,
  },
  {
    title: "JQRACE4",
    desc: "Manager console for an event valet parking operation: staff, vehicles and event-day flow run from a single panel, with role-based access and per-organization MFA.",
    stack: ["React", "Vite", "TypeScript", "Tailwind", "Railway"],
    statuses: ["Live"],
    year: "2026",
    link: null,
    image: "/work/jqrace4.webp",
    imageW: 1200,
    imageH: 605,
  },
  {
    title: "Plinto",
    desc: "Open-source household finance manager built to replace the family spreadsheet with something structured and maintainable. Spec-driven, developed in the open.",
    stack: ["TypeScript", "Turborepo", "pnpm"],
    statuses: ["In progress", "Open source"],
    year: "2026",
    link: "github.com/victorolave/plinto",
    image: "/work/plinto.webp",
    imageW: 1200,
    imageH: 605,
  },
  {
    title: "Dev Senior Code Junior",
    desc: "Site for the academy's teen track: a game design and development career built on Unity, Blender and C#, laid out as four progressive programs over 16 months.",
    stack: ["Astro", "React", "TypeScript", "Tailwind", "Vercel"],
    statuses: ["In progress"],
    year: "2026",
    link: null,
    image: "/work/devseniorcode-junior.webp",
    imageW: 1200,
    imageH: 673,
  },
  {
    title: "Pumas de Antioquia",
    desc: "Site for Envigado's first basketball club: its story, training schedules across two venues and open enrolment for children, teens and adults.",
    stack: ["Astro", "React", "GSAP", "Tailwind", "Vercel"],
    statuses: ["Live"],
    year: "2025",
    link: "pumas-de-antioquia.vercel.app",
    image: "/work/pumas.webp",
    imageW: 1200,
    imageH: 605,
  },
  {
    // Plinto's public face, alongside the app panel above. Same project, a
    // second tile on purpose: the landing is what a household sees first.
    title: "Plinto",
    desc: "Public landing for Plinto: what it does for a household, how to self-host it with Docker Compose, and the AGPL-3.0 licence, shown over demo data.",
    stack: ["Astro", "Tailwind", "Cloudflare"],
    statuses: ["Live", "Open source"],
    year: "2026",
    link: "plintoapp.com",
    image: "/work/plinto-landing.webp",
    imageW: 1200,
    imageH: 605,
  },
  {
    // Client software, shown anonymised by choice: no product name, no
    // logo, no link. The screenshot has the institution's logo and copyright
    // line hidden. Do not put the product or university name back.
    title: { en: "University lab platform", es: "Plataforma de laboratorios universitaria" },
    desc: "Laboratory management for a university engineering faculty: reservations, resources, spaces and users, on a web app backed by its own API.",
    stack: ["Next.js", "Mantine", "TanStack Query", "NestJS", "Prisma"],
    statuses: ["In progress"],
    year: "2024",
    link: null,
    image: "/work/labs-login.webp",
    imageW: 1200,
    imageH: 675,
  },
];

export const FEATURED: FeaturedCase[] = [
  {
    index: "01",
    kicker: { en: "Education platform", es: "Plataforma educativa" },
    // The student portal, not the marketing site: the case claims a platform
    // replaced the chat threads, and this is that platform. Only the two
    // instructor names are substituted; the programs are the public catalogue
    // and the account is my own.
    shots: [
      {
        src: "/work/devseniorcode-academy.webp",
        w: 1200,
        h: 571,
        caption: {
          en: "Student dashboard: active programs and the day's agenda, with sessions and instructors scheduled",
          es: "Panel del estudiante: programas activos y la agenda del día, con sesiones e instructores programados",
        },
      },
      {
        src: "/work/devseniorcode-program.webp",
        w: 647,
        h: 470,
        caption: {
          en: "Program detail: modules, live and recorded progress, and every session with its date, length and instructor",
          es: "Detalle del programa: módulos, progreso en vivo y grabado, y cada sesión con su fecha, duración e instructor",
        },
      },
    ],
    title: { en: "An academy that outgrew WhatsApp", es: "Una academia que superó WhatsApp" },
    desc: {
      en: "Dev Senior Code ran its whole operation through chat threads. I led the build of the platform underneath it: student portal, admin dashboard, program management and scheduling, automated where it made sense and with humans kept in the loop where it mattered.",
      es: "Dev Senior Code operaba por completo desde hilos de chat. Lideré la construcción de la plataforma que lo reemplazó: portal de estudiantes, panel administrativo, gestión de programas y horarios, automatizada donde tenía sentido y con supervisión humana donde importaba.",
    },
    year: { en: "2023 – Present", es: "2023 – Presente" },
    role: { en: "Lead engineer", es: "Líder técnico" },
    tags: ["Next.js", "NestJS", "React", "PostgreSQL", "MongoDB", "Redis", "n8n"],
    highlights: [
      {
        en: "Student portal and admin dashboard replacing WhatsApp-based operations",
        es: "Portal de estudiantes y panel administrativo que reemplazan la operación por WhatsApp",
      },
      {
        en: "Program management and scheduling automated end to end",
        es: "Gestión de programas y horarios automatizada de principio a fin",
      },
    ],
    metrics: [{ value: "1,500+", label: { en: "developers", es: "desarrolladores" } }],
    testimonials: TESTIMONIALS.filter((t) => t.company === "Dev Senior Code"),
  },
  {
    index: "02",
    kicker: { en: "Logistics product", es: "Producto de logística" },
    // The admin platform, not the marketing site: the case claims the legacy
    // system and manual customer ops were replaced, and this is where that is
    // visible. Names, avatars and volumes are substituted — the client's real
    // customer data never leaves their platform.
    shots: [
      {
        src: "/work/eyp-admin.webp",
        w: 1200,
        h: 636,
        caption: {
          en: "Admin dashboard: weekly volume, load per responsable and top clients, replacing the chat threads",
          es: "Panel administrativo: volumen semanal, carga por responsable y principales clientes, en reemplazo de los hilos de chat",
        },
      },
      {
        src: "/work/eyp-trackings.webp",
        w: 754,
        h: 490,
        caption: {
          en: "Tracking register: every shipment logged with its carrier and date, searchable, filterable and exportable",
          es: "Registro de rastreo: cada envío registrado con su transportadora y fecha, buscable, filtrable y exportable",
        },
      },
    ],
    title: { en: "The operation, out of the chat threads", es: "La operación, fuera de los hilos de chat" },
    desc: {
      en: "A legacy logistics platform plus customer operations over WhatsApp, replaced by one product: marketing site, client portal, admin platform and integrated payments. Customers now track, request and pay without messaging anyone.",
      es: "Una plataforma heredada y la atención a clientes por WhatsApp, reemplazadas por un solo producto: sitio, portal de clientes, panel administrativo y pagos integrados. Ahora los clientes rastrean, solicitan y pagan sin escribir a nadie.",
    },
    year: { en: "", es: "" },
    role: { en: "Product designer & engineer", es: "Diseñador de producto e ingeniero" },
    tags: ["Next.js", "NestJS", "PostgreSQL"],
    highlights: [
      {
        en: "Admin platform replacing the legacy system and manual customer ops",
        es: "Plataforma administrativa que reemplaza el sistema heredado y la operación manual",
      },
      {
        en: "Client portal with tracking, requests and integrated payments",
        es: "Portal de clientes con rastreo, solicitudes y pagos integrados",
      },
    ],
    metrics: [],
    // Two voices from the same client, deliberately kept: one speaks for the
    // business, the other for the people who ran the old process by hand.
    // Together they corroborate the two halves of this case's claim — which is
    // what fills the gap left by `metrics: []`.
    // Los dos son de EYP, así que el caso muestra la lista completa.
    // Se leen de TESTIMONIALS para que no haya dos copias del mismo texto.
    testimonials: TESTIMONIALS.filter((t) => t.company === "EYP Logistic"),
  },
];

// "What I reach for" — About section. Ordered by where the work is going,
// matching the positioning of the 2026 CV. `cat`/`items` localize only where
// the English word isn't already the common Spanish dev term (Frontend,
// Backend, tech proper nouns stay as plain values, resolved via `pick`).
export const STACK: { cat: Text; items: string[] | Localized<string[]> }[] = [
  {
    cat: { en: "AI engineering", es: "Ingeniería de IA" },
    items: {
      en: ["LLM integration", "Agents & MCP", "RAG", "Prompt engineering"],
      es: ["Integración de LLMs", "Agentes y MCP", "RAG", "Ingeniería de prompts"],
    },
  },
  { cat: "Frontend", items: ["React", "TypeScript", "Next.js", "Angular"] },
  { cat: "Backend", items: ["Node.js", "NestJS", "Express", "REST"] },
  { cat: { en: "Data", es: "Datos" }, items: ["PostgreSQL", "MongoDB", "Redis"] },
];

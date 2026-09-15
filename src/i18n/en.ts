// English dictionary — the type source. `Dictionary = typeof en`, so `es.ts`
// must implement exactly this shape; a missing or extra key fails typecheck.
//
// Covers all sections wired across SDD tasks Phase 1-5: head/meta, nav/side-
// rail labels, loader, section dividers, hero, work, featured case, cursor
// labels, about, experience, manifesto, process, skills, now, contact and
// footer.
export const en = {
  meta: {
    title: "Victor Olave · Senior Fullstack Developer · Medellín, Colombia",
    description:
      "Senior fullstack developer in Envigado, Medellín area, Colombia. Nine years of React, TypeScript and Node.js, now building AI products: LLMs, MCP, RAG.",
    // Visually hidden <h1> in Hero — the strongest on-page signal for search
    // engines, kept as real text rather than baked into the split name art.
    ogImageAlt: "Victor Olave · Senior Fullstack Developer",
    heroHeading: "Victor Olave, senior fullstack developer in the Medellín area, Colombia",
  },
  a11y: {
    language: "Language",
    homeLabel: "Victor Olave, home",
    email: "Email",
    viewProject: (title: string) => `View ${title}`,
    clientWords: (title: string) => `${title}: in the client's words`,
    screenshotAlt: (title: string) => `${title}: screenshot of the live product`,
  },
  // Shared by Nav (work/about/experience/process/words/contact) and SideRails
  // (process/work/about/skills/contact) — one dictionary entry per section id
  // so a wording fix lands everywhere that id is used.
  sections: {
    work: "Work",
    about: "About",
    experience: "Experience",
    process: "Process",
    words: "Words",
    skills: "Skills",
    contact: "Contact",
  },
  loader: {
    words: ["Design", "Detail", "Restraint"],
    loading: "Loading folio",
    tagline: "Senior Fullstack · Envigado, Colombia",
  },
  // One entry per SectionDivider instance in PageBody, in page order.
  dividers: {
    work: { label: "Selected work", word: "The work." },
    about: { label: "About", word: "Nine years." },
    experience: { label: "Experience", word: "Where I've been." },
    process: { label: "Process", word: "How I work." },
    words: { label: "In their words", word: "What changed." },
    skills: { label: "Skills", word: "What I use." },
    now: { label: "Right now", word: "Currently." },
  },
  hero: {
    descPre: "Quiet builder,",
    descItalic: "turning ideas into systems,",
    descPost: "through design, detail and restraint.",
    statementPre: "Nine years turning ambiguous problems into software that",
    statementItalic: "simply works",
    statementPost: ". And keeps working.",
  },
  work: {
    shelfEyebrow: "The full shelf",
    shelfMeta: "Selected work · 2023–2026",
    moreStatementPre: "Far more than",
    moreStatementItalic: "fits here.",
    sourceAvailable: "Source available",
  },
  featuredCase: {
    caseLabel: "CASE",
  },
  cursor: {
    view: "View",
    top: "Top",
    send: "Send",
    download: "Download",
    sayHi: "Say hi",
    connect: "Connect",
    book: "Book",
  },
  about: {
    eyebrow: "A short biography",
    heading: [
      { text: "Nine years of", italic: false },
      { text: "considered", italic: true },
      { text: "engineering.", italic: false },
    ],
    bio: [
      "I design and build the systems behind useful products. Nine years shipping end-to-end, with React and TypeScript on the front and Node and NestJS on the back. Now leaning hard into AI-powered product engineering: LLMs, agents with MCP, RAG, prompt engineering as a product discipline.",
      "What I care about, in order: clarity of intent, predictability under load, and giving the next person on the codebase a fair chance. I question requirements before writing code and ship small, opinionated things. Responsible AI by default: guardrails, honest limits, humans in the loop where it counts.",
      "Based in Envigado, in the Medellín metro area of Colombia, working with teams across the Aburrá Valley and remotely. Available now for select engagements: contract work, lead-engineer roles, technical advisory.",
    ],
    stackEyebrow: "Stack",
    stackHeadline: "What I reach for.",
  },
  experience: {
    eyebrow: "Employment history",
    headingPre: "The track",
    headingItalic: "record",
    available: "Available for work",
    cvLabel: "Download CV",
    now: "now",
    // Job titles keyed by a stable id — org/period/current and proper nouns
    // (city names) stay as component data. UI phrases embedded in
    // location/note ("Remote", "Full-time → part-time", "Concurrent") are
    // dictionary-sourced below so they localize; company names stay literal.
    jobs: {
      leanTech: "Senior Fullstack Developer",
      izeven: "Full Stack Engineer",
      freelance: "Freelance Full Stack Developer",
      securitic: "Full Stack Developer",
      creazion: "Full Stack Developer",
    },
    remote: "Remote",
    present: "Present",
    noteFullTimeToPartTime: "Full-time → part-time (2022)",
    noteConcurrent: "Concurrent",
    // Open item: official Spanish name unconfirmed — kept identical both
    // locales on purpose, do not invent a translation (flagged for user).
    educationDegree: "Systems Engineer in Software Development",
    closingNote: "Selected roles · nine years in software since 2017",
  },
  manifesto: {
    lines: [
      { word: "Software", italic: false, accent: false },
      { word: "is just", italic: true, accent: false },
      { word: "opinions,", italic: false, accent: false },
      { word: "encoded.", italic: false, accent: true },
    ],
    lines2: [
      { word: "I try", italic: false, accent: false },
      { word: "to encode", italic: true, accent: false },
      { word: "good", italic: false, accent: true },
      { word: "ones.", italic: false, accent: false },
    ],
    colophon: "Manifesto · On craft · 2026",
  },
  process: {
    stepOf: (n: number) => `Step ${n} / 4`,
    steps: [
      { title: "Listen", desc: "Map the territory before drawing the map." },
      { title: "Frame", desc: "One user, one outcome, one week of work." },
      { title: "Build", desc: "Ship small and pointed. Deploy day one." },
      { title: "Refine", desc: "Harden the seams, document, hand off clean." },
    ],
  },
  skills: {
    eyebrow: "Skills",
    headingPre: "I build software that",
    scales: "scales",
    and: "and",
    endures: "endures",
    contactCta: "Contact me",
    categories: [
      {
        name: "AI engineering",
        items: [
          "LLM integration (Claude, OpenAI)",
          "Agentic systems & MCP",
          "RAG architectures",
          "Prompt engineering",
          "Responsible AI",
        ],
      },
      {
        name: "Frontend",
        items: ["React", "TypeScript", "Next.js", "Angular", "Astro", "Tailwind CSS"],
      },
      {
        name: "Animation & 3D",
        items: ["Motion One", "GSAP", "Three.js", "WebGL", "Lenis", "Canvas"],
      },
      {
        name: "Backend",
        items: ["Node.js", "NestJS", "Express", "REST", "GraphQL", "WebSockets"],
      },
      {
        name: "Databases",
        items: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Drizzle"],
      },
      {
        name: "DevOps & Tools",
        items: ["Docker", "GitHub Actions", "Vercel", "Railway", "AWS", "Git"],
      },
      {
        name: "System & Security",
        items: ["OAuth / JWT", "Hexagonal Arch.", "Testing", "CI/CD", "Observability"],
      },
      {
        name: "Design",
        items: ["Figma", "Design Systems", "Atomic Design", "Accessibility"],
      },
    ],
  },
  now: {
    headingPre: "A small",
    headingItalic: "logbook",
    intro:
      "Where my attention is, this season. Updated when something genuinely shifts, about every six weeks.",
    lastUpdated: "Last updated · May 2026",
    lines: [
      { label: "Reading", value: '"A Pattern Language" by Christopher Alexander' },
      { label: "Building", value: "A small CLI for ergonomic Postgres migrations" },
      { label: "Listening", value: "Sufjan Stevens, Caetano Veloso, lots of Bach" },
      { label: "Watching", value: "Severance S3, and the Mubi back catalog" },
      { label: "City", value: "Envigado, Colombia · GMT-5" },
      { label: "Status", value: "Available for new engagements" },
    ],
  },
  contact: {
    eyebrow: "Get in touch",
    statementPre: "Let’s",
    statementItalic: "talk",
    soon: "Soon",
    calendarAria: "Calendar booking, coming soon",
    availableNow: "Available now",
  },
  footer: {
    letsTalk: "Let's talk",
    menu: "MENU",
    elsewhere: "ELSEWHERE",
  },
};

export type Dictionary = typeof en;

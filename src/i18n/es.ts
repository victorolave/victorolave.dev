// Spanish dictionary. Typed against `Dictionary` (from en.ts) so a missing or
// extra key fails typecheck.
//
// Neutral, professional Colombian Spanish throughout: no slang, no regional
// markers beyond what the English copy already carries (Envigado, Colombia).
import type { Dictionary } from "./en";

export const es: Dictionary = {
  meta: {
    title: "Victor Olave · Desarrollador Fullstack Senior · Medellín",
    description:
      "Desarrollador fullstack senior en Envigado, área de Medellín. Nueve años con React y Node.js; hoy creo productos y agentes con inteligencia artificial.",
    ogImageAlt: "Victor Olave · Desarrollador Fullstack Senior",
    heroHeading: "Victor Olave, desarrollador fullstack senior en el área de Medellín, Colombia",
  },
  a11y: {
    language: "Idioma",
    homeLabel: "Victor Olave, inicio",
    email: "Correo",
    viewProject: (title: string) => `Ver ${title}`,
    clientWords: (title: string) => `${title}: en palabras del cliente`,
    screenshotAlt: (title: string) => `${title}: captura del producto en vivo`,
  },
  sections: {
    work: "Proyectos",
    about: "Perfil",
    experience: "Experiencia",
    process: "Proceso",
    words: "Voces",
    skills: "Habilidades",
    contact: "Contacto",
  },
  loader: {
    words: ["Diseño", "Detalle", "Mesura"],
    loading: "Cargando folio",
    tagline: "Fullstack Senior · Envigado, Colombia",
  },
  dividers: {
    work: { label: "Trabajo seleccionado", word: "El trabajo." },
    about: { label: "Sobre mí", word: "Nueve años." },
    experience: { label: "Experiencia", word: "Mi recorrido." },
    process: { label: "Proceso", word: "Cómo trabajo." },
    words: { label: "En sus palabras", word: "Qué cambió." },
    skills: { label: "Habilidades", word: "Lo que uso." },
    now: { label: "Ahora mismo", word: "Actualmente." },
  },
  hero: {
    descPre: "Constructor silencioso,",
    descItalic: "convierto ideas en sistemas,",
    descPost: "con diseño, detalle y mesura.",
    statementPre: "Nueve años convirtiendo problemas ambiguos en software que",
    statementItalic: "simplemente funciona",
    statementPost: ". Y sigue funcionando.",
  },
  work: {
    shelfEyebrow: "La vitrina completa",
    shelfMeta: "Trabajo seleccionado · 2023–2026",
    moreStatementPre: "Mucho más de lo que",
    moreStatementItalic: "cabe aquí.",
    sourceAvailable: "Código disponible",
  },
  featuredCase: {
    caseLabel: "CASO",
  },
  cursor: {
    view: "Ver",
    top: "Inicio",
    send: "Escribir",
    download: "Descargar",
    sayHi: "Saludar",
    connect: "Conectar",
    book: "Agendar",
  },
  about: {
    eyebrow: "Una breve biografía",
    heading: [
      { text: "Nueve años de", italic: false },
      { text: "ingeniería", italic: false },
      { text: "con criterio.", italic: true },
    ],
    bio: [
      "Diseño y construyo los sistemas detrás de productos útiles. Nueve años construyendo productos completos, de principio a fin, con React y TypeScript en el frontend y Node y NestJS en el backend. Ahora enfocado de lleno en ingeniería de producto con IA: LLMs, agentes con MCP, RAG, ingeniería de prompts como disciplina de producto.",
      "Lo que me importa, en orden: claridad de intención, predictibilidad bajo carga y dejarle el código fácil a quien venga después. Cuestiono los requerimientos antes de escribir código y entrego cosas pequeñas y con criterio. IA responsable por defecto: límites claros, honestidad sobre sus alcances y supervisión humana donde realmente importa.",
      "Con base en Envigado, en el área metropolitana de Medellín, Colombia, trabajando con equipos de todo el Valle de Aburrá y de forma remota. Disponible ahora para proyectos seleccionados: contratos, roles de líder técnico, asesoría técnica.",
    ],
    stackEyebrow: "Stack",
    stackHeadline: "Con qué trabajo.",
  },
  experience: {
    eyebrow: "Trayectoria laboral",
    headingPre: "La trayectoria",
    headingItalic: "profesional",
    available: "Disponible para trabajar",
    cvLabel: "Descargar CV (inglés)",
    now: "ahora",
    jobs: {
      leanTech: "Desarrollador Fullstack Senior",
      izeven: "Ingeniero Full Stack",
      freelance: "Desarrollador Full Stack Freelance",
      securitic: "Desarrollador Full Stack",
      creazion: "Desarrollador Full Stack",
    },
    remote: "Remoto",
    present: "Presente",
    noteFullTimeToPartTime: "Tiempo completo → medio tiempo (2022)",
    noteConcurrent: "Simultáneo",
    // The degree's name as the owner gives it, not a translation of the English
    // line. Change it only with his confirmation.
    educationDegree: "Ingeniería de Sistemas",
    closingNote: "Roles seleccionados · nueve años en software desde 2017",
  },
  manifesto: {
    lines: [
      { word: "El software", italic: false, accent: false },
      { word: "es solo", italic: true, accent: false },
      { word: "opinión", italic: false, accent: false },
      { word: "codificada.", italic: false, accent: true },
    ],
    lines2: [
      { word: "Intento", italic: false, accent: false },
      { word: "codificar", italic: true, accent: false },
      { word: "la", italic: false, accent: false },
      { word: "buena.", italic: false, accent: true },
    ],
    colophon: "Manifiesto · Sobre el oficio · 2026",
  },
  process: {
    stepOf: (n: number) => `Paso ${n} / 4`,
    steps: [
      { title: "Escuchar", desc: "Mapea el territorio antes de dibujar el mapa." },
      { title: "Enfocar", desc: "Un usuario, un resultado, una semana de trabajo." },
      {
        title: "Construir",
        desc: "Entrega en partes pequeñas y precisas. Despliega desde el día uno.",
      },
      { title: "Refinar", desc: "Refuerza las costuras, documenta y entrega limpio." },
    ],
  },
  skills: {
    eyebrow: "Habilidades",
    headingPre: "Construyo software que",
    scales: "escala",
    and: "y",
    endures: "perdura",
    contactCta: "Contáctame",
    categories: [
      {
        name: "Ingeniería de IA",
        items: [
          "Integración de LLMs (Claude, OpenAI)",
          "Sistemas agénticos y MCP",
          "Arquitecturas RAG",
          "Ingeniería de prompts",
          "IA responsable",
        ],
      },
      {
        name: "Frontend",
        items: ["React", "TypeScript", "Next.js", "Angular", "Astro", "Tailwind CSS"],
      },
      {
        name: "Animación y 3D",
        items: ["Motion One", "GSAP", "Three.js", "WebGL", "Lenis", "Canvas"],
      },
      {
        name: "Backend",
        items: ["Node.js", "NestJS", "Express", "REST", "GraphQL", "WebSockets"],
      },
      {
        name: "Bases de datos",
        items: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Drizzle"],
      },
      {
        name: "DevOps y herramientas",
        items: ["Docker", "GitHub Actions", "Vercel", "Railway", "AWS", "Git"],
      },
      {
        name: "Sistemas y seguridad",
        items: ["OAuth / JWT", "Arq. Hexagonal", "Testing", "CI/CD", "Observabilidad"],
      },
      {
        name: "Diseño",
        items: ["Figma", "Sistemas de diseño", "Diseño atómico", "Accesibilidad"],
      },
    ],
  },
  now: {
    headingPre: "Una pequeña",
    headingItalic: "bitácora",
    intro:
      "Dónde está mi atención esta temporada. Se actualiza cuando algo cambia de verdad, cada seis semanas aproximadamente.",
    lastUpdated: "Última actualización · Mayo 2026",
    lines: [
      { label: "Leyendo", value: '"A Pattern Language" de Christopher Alexander' },
      { label: "Creando", value: "Un pequeño CLI para migraciones ergonómicas de Postgres" },
      { label: "Escuchando", value: "Sufjan Stevens, Caetano Veloso y mucho Bach" },
      { label: "Viendo", value: "Severance T3, y el catálogo de Mubi" },
      { label: "Ciudad", value: "Envigado, Colombia · GMT-5" },
      { label: "Estado", value: "Disponible para nuevos proyectos" },
    ],
  },
  contact: {
    eyebrow: "Ponte en contacto",
    statementPre: "",
    statementItalic: "Hablemos",
    soon: "Pronto",
    calendar: "Agenda",
    calendarAria: "Reserva de calendario, próximamente",
    availableNow: "Disponible ahora",
  },
  footer: {
    letsTalk: "Hablemos",
    menu: "MENÚ",
    elsewhere: "EN LA RED",
  },
};

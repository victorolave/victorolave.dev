export type ProjectStatus =
  | "Live"
  | "In progress"
  | "Archived"
  | "Featured"
  | "Open source";

export type PreviewKey =
  | "api-gateway"
  | "design-cli"
  | "pg-migrate"
  | "analytics"
  | "auth"
  | "ecommerce";

export interface Project {
  title: string;
  desc: string;
  stack: string[];
  statuses: ProjectStatus[];
  year: string;
  link: string | null;
  previewKey: PreviewKey;
}

export interface FeaturedCase {
  index: string; // "01" — editorial chapter marker
  kicker: string; // short label, e.g. "API gateway"
  previewKey: PreviewKey;
  title: string;
  desc: string;
  year: string;
  role: string;
  tags: string[];
  highlights: string[];
  metrics: { value: string; label: string }[];
}

export const PROJECTS: Project[] = [
  {
    title: "API gateway service",
    desc: "High-throughput routing layer with circuit-breaker pattern, dynamic rate limiting, and distributed tracing.",
    stack: ["Node.js", "TypeScript", "Redis", "Docker"],
    statuses: ["Live", "Featured"],
    year: "2024",
    link: "github.com/volave/api-gw",
    previewKey: "api-gateway",
  },
  {
    title: "Design system CLI",
    desc: "Token extraction and component scaffolding tool for React monorepos. Outputs typed CSS variables and stories.",
    stack: ["React", "Vite", "TypeScript"],
    statuses: ["In progress"],
    year: "2025",
    link: null,
    previewKey: "design-cli",
  },
  {
    title: "pg-migrate-ts",
    desc: "Type-safe migration runner for PostgreSQL with zero-downtime strategies and rollback support.",
    stack: ["PostgreSQL", "TypeScript"],
    statuses: ["Open source"],
    year: "2023",
    link: "github.com/volave/pg-migrate-ts",
    previewKey: "pg-migrate",
  },
  {
    title: "Real-time analytics dashboard",
    desc: "WebSocket-driven analytics UI with configurable widgets, alerting rules and data export pipelines.",
    stack: ["React", "WebSockets", "Node.js"],
    statuses: ["Live"],
    year: "2023",
    link: null,
    previewKey: "analytics",
  },
  {
    title: "Auth microservice",
    desc: "JWT and RBAC authentication service with OAuth2 provider integrations and audit logging.",
    stack: ["Node.js", "PostgreSQL", "Redis"],
    statuses: ["Live", "Open source"],
    year: "2022",
    link: "github.com/volave/auth-svc",
    previewKey: "auth",
  },
  {
    title: "E-commerce platform",
    desc: "Multi-tenant e-commerce system with inventory management, checkout flows and payment integrations.",
    stack: ["React", "Node.js", "Stripe"],
    statuses: ["Archived"],
    year: "2021",
    link: null,
    previewKey: "ecommerce",
  },
];

export const FEATURED: FeaturedCase[] = [
  {
    index: "01",
    kicker: "API gateway",
    previewKey: "api-gateway",
    title: "A routing layer that breathes",
    desc: "Replaced a brittle monolith ingress with an opinionated gateway: circuit breakers, dynamic rate limiting, and tracing baked in. Six months later, on-call pages are down 70%.",
    year: "2024",
    role: "Lead backend engineer",
    tags: ["Node.js", "TypeScript", "Redis", "Docker"],
    highlights: [
      "Circuit breakers and dynamic rate limiting enforced at the edge",
      "End-to-end distributed tracing across every downstream hop",
    ],
    metrics: [
      { value: "2.4k", label: "req / sec" },
      { value: "18ms", label: "p99 latency" },
      { value: "70%", label: "fewer pages" },
    ],
  },
  {
    index: "02",
    kicker: "Analytics",
    previewKey: "analytics",
    title: "Real-time, without the noise",
    desc: "A live dashboard for ops teams who hated dashboards. Configurable widgets, sober colour, ruthless prioritisation of what matters in the first six inches of screen.",
    year: "2023",
    role: "Product engineer",
    tags: ["React", "WebSockets", "Node.js"],
    highlights: [
      "Configurable widget grid with first-screen priority by default",
      "Sub-second freshness streamed over a single WebSocket channel",
    ],
    metrics: [
      { value: "42", label: "live widgets" },
      { value: "<1s", label: "data freshness" },
      { value: "9k", label: "daily users" },
    ],
  },
];

export const STACK = [
  { cat: "Frontend", items: ["React", "TypeScript", "Next.js", "Astro"] },
  { cat: "Backend", items: ["Node.js", "Express", "NestJS", "GraphQL"] },
  { cat: "Data", items: ["PostgreSQL", "Redis", "Prisma"] },
  { cat: "Infra", items: ["Docker", "AWS", "Terraform"] },
] as const;

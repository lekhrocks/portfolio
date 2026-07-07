"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ScrollText,
  Server,
  MessageSquare,
  ShoppingCart,
  BriefcaseBusiness,
  LayoutDashboard,
  Bot,
} from "lucide-react";
import { GithubIcon } from "@/components/icons";
import SectionHeader from "@/components/console/SectionHeader";
import StatusPill from "@/components/console/StatusPill";
import { getCaseStudyByProjectId } from "@/lib/case-studies";

type Service = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  status: "ok" | "info" | "muted";
  statusLabel: string;
  githubUrl: string;
  tags: string[];
  metrics: { label: string; value: string }[];
};

const services: Service[] = [
  {
    id: "router",
    title: "router-service",
    subtitle: "High-Performance request router & load balancer",
    description:
      "Java 21 + Spring Boot router with regex routing, three balancing strategies, hand-rolled circuit breaker, token-bucket rate limiter, and live WebSocket telemetry. Validated at 10K+ RPS, p99 < 20 ms, ~210 MB resident.",
    icon: Server,
    status: "ok",
    statusLabel: "stable",
    githubUrl: "https://github.com/lekhrocks/router-service",
    tags: ["Java 21", "Spring Boot 3.5", "Docker", "Prometheus", "WebSockets"],
    metrics: [
      { label: "sustained", value: "10K+ RPS" },
      { label: "p99",        value: "<20ms" },
      { label: "memory",     value: "210MB" },
    ],
  },
  {
    id: "chat",
    title: "realtime-chat",
    subtitle: "WebSocket chat backend with Kafka audit pipeline",
    description:
      "Production-shaped real-time chat with JWT/RBAC, S3-backed file sharing with antivirus scanning, transactional Kafka outbox for audit, and per-conversation ordering. Sync delivery and async fan-out fail independently.",
    icon: MessageSquare,
    status: "ok",
    statusLabel: "stable",
    githubUrl: "https://github.com/lekhrocks/realtime-chat",
    tags: ["Java 21", "Spring Boot", "GraphQL", "Kafka", "WebSockets", "AWS S3"],
    metrics: [
      { label: "ack p99",    value: "<80ms" },
      { label: "audit lag",  value: "<2s p95" },
      { label: "ordering",   value: "per-conv" },
    ],
  },
  {
    id: "ecommerce",
    title: "ecommerce-backend",
    subtitle: "RESTful e-commerce backend with Stripe payments",
    description:
      "Layered Spring Boot service for users, catalog, carts, and orders with Stripe payments, robust validation, standardised error handling, and full Swagger docs. Pragmatic foundation for an e-commerce MVP.",
    icon: ShoppingCart,
    status: "info",
    statusLabel: "active",
    githubUrl: "https://github.com/lekhrocks/Ecommerce_BE",
    tags: ["Java 11", "Spring Boot 2.7", "JPA", "MySQL", "Stripe", "Swagger"],
    metrics: [
      { label: "payment", value: "Stripe" },
      { label: "schema",  value: "MySQL" },
      { label: "docs",    value: "Swagger" },
    ],
  },
  {
    id: "interview-tracker-api",
    title: "interview-tracker-api",
    subtitle: "Full-featured job-search backend — Spring Boot 4 / Java 25",
    description:
      "Production-grade REST API for tracking job applications, interviews, notes, and reminders. Spring Boot 4, Java 25, Spring Modulith, Redis caching, Flyway migrations (41 versions), AI CV tailoring via Groq, WebAuthn passkeys, TOTP 2FA, Pro tier billing with Lemon Squeezy webhooks, and full OpenAPI codegen for the companion Next.js frontend.",
    icon: BriefcaseBusiness,
    status: "ok",
    statusLabel: "stable",
    githubUrl: "https://github.com/lekhrocks/interview-tracker-backend",
    tags: [
      "Java 25", "Spring Boot 4", "Spring Modulith", "PostgreSQL",
      "Redis", "Flyway", "Spring AI", "WebAuthn", "JWT", "Docker",
    ],
    metrics: [
      { label: "migrations", value: "41 versions" },
      { label: "modules",    value: "9 domain" },
      { label: "coverage",   value: "≥55% lines" },
    ],
  },
  {
    id: "interview-tracker-ui",
    title: "interview-tracker-ui",
    subtitle: "Next.js 14 App Router frontend with SSR, React Query, and Pro paywall",
    description:
      "Full-stack companion frontend for the interview-tracker API. App Router with server-side prefetch + HydrationBoundary, drag-and-drop Kanban, recharts analytics, AI JD analysis, cover-letter generation, CSV/JSON bulk import, PWA install prompt, TOTP + passkey login flows, Playwright smoke tests, and a Pro paywall wired to the 402-response pattern.",
    icon: LayoutDashboard,
    status: "ok",
    statusLabel: "stable",
    githubUrl: "https://github.com/lekhrocks/interview-tracker",
    tags: [
      "Next.js 14", "React 18", "TypeScript", "Tailwind CSS",
      "React Query", "Zod", "Playwright", "PWA",
    ],
    metrics: [
      { label: "pages",    value: "15+ routes" },
      { label: "e2e",      value: "Playwright" },
      { label: "SSR",      value: "HydrationBoundary" },
    ],
  },
  {
    id: "eka-backend",
    title: "eka-backend",
    subtitle: "AI-powered engineering knowledge assistant — API backend",
    description:
      "Spring Boot reactive backend for an LLM-powered knowledge assistant: retrieves and reasons over indexed engineering docs, code repos, APIs, and production systems. Supports semantic + hybrid search, multi-provider LLM routing (Anthropic, OpenAI, Ollama), ingestion pipelines (GitHub, GitLab, Confluence, web), Neo4j knowledge graphs, and JWT+OAuth2 auth with email-password fallback.",
    icon: Bot,
    status: "ok",
    statusLabel: "stable",
    githubUrl: "https://github.com/lekhrocks/eka-backend",
    tags: [
      "Java 21", "Spring Boot 3.4", "Spring WebFlux", "PostgreSQL+pgvector",
      "Apache Kafka", "Redis", "Neo4j", "Docker",
    ],
    metrics: [
      { label: "tests",     value: "60+ unit" },
      { label: "migrations",value: "8 versions" },
      { label: "audit",     value: "91 fix items" },
    ],
  },
  {
    id: "eka-frontend",
    title: "eka-frontend",
    subtitle: "EKA chat UI & analytics dashboard — Next.js App Router",
    description:
      "Full Next.js 16 App Router frontend for the EKA knowledge assistant. Features LLM chat with SSE streaming, hybrid code search, ingestion source management, interactive Neo4j knowledge graph, usage analytics, observability dashboards, admin user management, and email+OAuth2 auth. Radix UI primitives, TanStack Query server state, Zustand client state, Tailwind v4 theming.",
    icon: LayoutDashboard,
    status: "ok",
    statusLabel: "stable",
    githubUrl: "https://github.com/lekhrocks/eka-frontend",
    tags: [
      "Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4",
      "TanStack Query 5", "Zustand 5", "SSE", "Radix UI",
    ],
    metrics: [
      { label: "routes",    value: "12 pages" },
      { label: "real-time", value: "SSE chat" },
      { label: "auth",      value: "3 channels" },
    ],
  },
];

function ServiceCard({ s, index }: { s: Service; index: number }) {
  const Icon = s.icon;
  const cs = getCaseStudyByProjectId(s.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="panel panel-interactive p-5 flex flex-col"
    >
      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-md border border-[var(--panel-border)] bg-[var(--bg-primary)] flex items-center justify-center flex-shrink-0">
          <Icon size={15} className="text-[var(--accent)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-mono text-sm font-medium text-white truncate">
              {s.title}
            </h3>
            <StatusPill tone={s.status}>{s.statusLabel}</StatusPill>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">{s.subtitle}</p>
        </div>
        <a
          href={s.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${s.title} on GitHub`}
          className="text-slate-500 hover:text-white transition-colors flex-shrink-0"
        >
          <GithubIcon size={14} />
        </a>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed mb-4">{s.description}</p>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-px bg-[var(--panel-border)] border border-[var(--panel-border)] rounded-md overflow-hidden mb-4">
        {s.metrics.map((m) => (
          <div key={m.label} className="bg-[var(--panel-bg)] px-2 py-2">
            <div className="mono-label text-[9px] mb-0.5 truncate">{m.label}</div>
            <div className="text-[13px] font-mono text-white truncate">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {s.tags.map((t) => (
          <span
            key={t}
            className="mono-tag px-1.5 py-0.5 rounded border border-[var(--panel-border)] text-slate-400"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Footer actions */}
      <div className="mt-auto pt-3 panel-divider flex flex-wrap gap-x-4 gap-y-2 text-xs">
        {cs && (
          <Link
            href={`/case-studies/${cs.slug}`}
            className="inline-flex items-center gap-1 console-link font-medium"
          >
            <ScrollText size={11} /> Read case study
          </Link>
        )}
        <a
          href="#architecture"
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById("architecture");
            if (el) {
              window.scrollTo({
                top: el.getBoundingClientRect().top + window.scrollY - 72,
                behavior: "smooth",
              });
            }
          }}
          className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200"
        >
          <ArrowUpRight size={11} /> Topology
        </a>
        <a
          href={s.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 ml-auto"
        >
          <GithubIcon size={11} /> Source
        </a>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section-padding scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="04.services"
          title="Owned services"
          subtitle="Production-grade systems built with performance and reliability as first principles. Each card is a service this engineer designed and shipped end-to-end."
          meta={
            <span className="mono-tag text-[var(--text-chrome)]">
              {services.length} services · all healthy
            </span>
          }
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((s, i) => (
            <ServiceCard key={s.id} s={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

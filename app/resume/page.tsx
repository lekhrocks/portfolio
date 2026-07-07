import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { caseStudies } from "@/lib/case-studies";
import PrintButton from "./print-button";

export const metadata: Metadata = {
  title: "Resume — Lekhraj Kumar",
  description: "ATS-friendly resume for Lekhraj Kumar — Senior Software Engineer",
  robots: { index: true, follow: true },
};

const skillGroups = [
  { name: "Languages", items: ["Java (8+ yrs)", "Golang", "JavaScript", "TypeScript", "SQL"] },
  { name: "Backend & APIs", items: ["Spring Boot / Spring AI", "Spring WebFlux / Reactive", "Spring Security", "Hibernate / JPA", "REST, GraphQL, WebSockets", "OAuth2 / JWT"] },
  { name: "AI & LLMs", items: ["Spring AI", "OpenAI / GPT", "Anthropic / Claude", "Cohere", "Groq", "Ollama", "RAG", "Prompt Engineering"] },
  { name: "Architecture", items: ["Microservices", "Event-Driven Architecture", "Domain-Driven Design", "System Design (HLD / LLD)", "SaaS Platforms"] },
  { name: "Messaging & Streaming", items: ["Apache Kafka (Kafka Streams)", "RabbitMQ", "Transactional Outbox", "Event Sourcing"] },
  { name: "Data & Caching", items: ["PostgreSQL / pgvector", "MySQL", "MongoDB", "Redis (Reactive + Blocking)", "Flyway Migrations"] },
  { name: "Frontend", items: ["Next.js (App Router)", "React / TypeScript", "Tailwind CSS", "TanStack Query", "Zustand", "SSE / WebSocket"] },
  { name: "Cloud & DevOps", items: ["AWS (S3, EC2, IAM)", "Docker / Docker Compose", "Kubernetes / Helm", "GitHub Actions", "Jenkins"] },
  { name: "Observability", items: ["Prometheus / Grafana", "Micrometer / Actuator", "OpenTelemetry / OTLP", "Datadog APM", "Centralized Logging"] },
  { name: "Testing & Quality", items: ["JUnit 5", "Mockito", "Testcontainers", "Integration / Contract Tests", "JaCoCo", "TDD"] },
];

const experience: { role: string; company: string; location: string; period: string; bullets: string[] }[] = [
  {
    role: "Senior Software Engineer",
    company: "CP Axtra",
    location: "Remote",
    period: "Jun 2025 – Present",
    bullets: [
      "Building invoice management backend — reactive WebFlux, Kafka event pipelines, Keycloak OAuth2, distributed ShedLock schedulers.",
      "Driving integration test framework with Testcontainers targeting 75% instruction coverage.",
      "Designing high-throughput document processing pipeline with async chunking and storage.",
    ],
  },
  {
    role: "Senior Software Engineer II",
    company: "AppDirect",
    location: "Gurgaon, India",
    period: "Jun 2022 – Jun 2025",
    bullets: [
      "Designed and owned high-availability microservices for Billing, Checkout, Notifications, and Payments — supporting thousands of concurrent requests with sub-200ms p99 latency.",
      "Led RabbitMQ-to-Kafka migration achieving 4× throughput improvement for billing workflows processing millions of events per day.",
      "Built transactional outbox with DLQ for durable async message delivery across payment and notification pipelines.",
      "Implemented circuit breakers, rate limiting, and bulkhead patterns to isolate failure domains in payment processing.",
      "Reduced p99 checkout latency by 40% through connection pool tuning, read-replica routing, and cache layering.",
      "Drove test automation strategy raising line coverage by 20 percentage points across 4 core services.",
      "Mentored 3 junior engineers through structured code reviews, architecture walkthroughs, and incident post-mortems.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Eka Software Solutions",
    location: "Bangalore, India",
    period: "Jan 2021 – Jun 2022",
    bullets: [
      "Built RESTful microservices for commodity trading platform handling trade contracts, settlements, and invoicing.",
      "Designed real-time position tracking system using WebSocket push, reducing screen refresh latency from 30s to sub-second.",
      "Implemented complex event processing pipelines for market data feeds with rule-based alerting.",
      "Optimized Hibernate query performance reducing critical report generation from 8 minutes to under 30 seconds.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Infosys",
    location: "Bangalore, India",
    period: "Nov 2019 – Jan 2021",
    bullets: [
      "Developed REST APIs and database layers for a large-scale retail management system serving 500+ stores.",
      "Built inventory forecasting module using time-series analysis reducing stockout incidents by 25%.",
      "Led migration of legacy monolith to Spring Boot microservices with PostgreSQL and Redis caching.",
    ],
  },
];

export default function ResumePage() {
  return (
    <>
      {/* Download / Back controls — hidden on print */}
      <nav className="print:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[var(--bg-primary)] border-b border-[var(--panel-border)]">
        <Link href="/#skills" className="text-xs font-mono text-slate-400 hover:text-white transition-colors">
          ← back to portfolio
        </Link>
        <div className="flex items-center gap-2">
          <PrintButton />
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="print:hidden h-12" />

      <main className="max-w-[900px] mx-auto px-6 py-8 text-[var(--text-primary)]">
        {/* ═══ Header ═══ */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-white">{siteConfig.name}</h1>
          <p className="text-lg text-slate-300 mt-1">{siteConfig.jobTitle}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400 mt-2">
            <span>{siteConfig.location.city}, {siteConfig.location.country}</span>
            <span>{siteConfig.email}</span>
            <a href={siteConfig.social.linkedin} className="text-[var(--accent)] hover:underline">{siteConfig.social.linkedin.replace("https://", "")}</a>
            <a href={siteConfig.social.github} className="text-[var(--accent)] hover:underline">{siteConfig.social.github.replace("https://", "")}</a>
          </div>
        </header>

        {/* ═══ Professional Summary ═══ */}
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--panel-border)] pb-1 mb-2">Professional Summary</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Software Engineer with 8+ years building and scaling high-throughput distributed systems in payments, SaaS, and retail-tech. Deep expertise in Java, Spring Boot, Kafka, microservices architecture, and event-driven systems. Proven track record of leading critical migrations, reducing latency, and driving engineering excellence through observability, resilience patterns, and disciplined testing.
          </p>
        </section>

        {/* ═══ Skills ═══ */}
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--panel-border)] pb-1 mb-2">Technical Skills</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            {skillGroups.map((g) => (
              <div key={g.name} className="flex gap-2">
                <span className="text-slate-500 font-medium whitespace-nowrap min-w-[100px]">{g.name}:</span>
                <span className="text-slate-300">{g.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ Work Experience ═══ */}
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--panel-border)] pb-1 mb-3">Experience</h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={`${exp.company}-${exp.period}`}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">{exp.role}</h3>
                    <p className="text-sm text-slate-400">{exp.company} — {exp.location}</p>
                  </div>
                  <p className="text-sm text-slate-500 whitespace-nowrap">{exp.period}</p>
                </div>
                <ul className="mt-1.5 space-y-1">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="text-sm text-slate-300 leading-relaxed flex gap-2">
                      <span className="text-slate-600 mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ Projects (Portfolio Case Studies) ═══ */}
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--panel-border)] pb-1 mb-2">Notable Projects</h2>
          <div className="space-y-3">
            {caseStudies.map((cs) => (
              <div key={cs.slug}>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold text-white">{cs.title}</h3>
                  <span className="text-xs text-slate-500">{cs.duration}</span>
                </div>
                <p className="text-sm text-slate-400 mt-0.5">{cs.subtitle}</p>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">{cs.summary}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {cs.stack.slice(0, 8).map((s) => (
                    <span key={s} className="text-[11px] text-slate-500 font-mono">{s}{cs.stack.indexOf(s) < Math.min(7, cs.stack.length - 1) ? " · " : ""}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ Education ═══ */}
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--panel-border)] pb-1 mb-2">Education</h2>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">National Institute of Technology (NIT), Hamirpur</h3>
              <p className="text-sm text-slate-400">B.Tech + M.Tech · Electronics &amp; Communication Engineering</p>
            </div>
            <p className="text-sm text-slate-500">2015 – 2020 · GPA: 8.65/10</p>
          </div>
        </section>

        {/* ═══ Certifications / Open Source ═══ */}
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--panel-border)] pb-1 mb-2">Additional</h2>
          <ul className="space-y-1">
            <li className="text-sm text-slate-300 flex gap-2">
              <span className="text-slate-600 mt-0.5">•</span>
              <span>LeetCode: <a href={siteConfig.social.leetcode} className="text-[var(--accent)] hover:underline">729+ problems solved</a> · Top 10%</span>
            </li>
            <li className="text-sm text-slate-300 flex gap-2">
              <span className="text-slate-600 mt-0.5">•</span>
              <span>Open source: Personal projects on <a href={siteConfig.social.github} className="text-[var(--accent)] hover:underline">GitHub</a> — Router Service (10K+ RPS), Real-Time Chat with Kafka audit pipeline, EKA Knowledge Assistant (Spring AI + pgvector + Neo4j)</span>
            </li>
            <li className="text-sm text-slate-300 flex gap-2">
              <span className="text-slate-600 mt-0.5">•</span>
              <span>Languages: English (fluent), Hindi (native)</span>
            </li>
          </ul>
        </section>

        <p className="text-xs text-slate-500 text-center mt-8 print:mt-4">
          Generated from <a href={siteConfig.url} className="text-[var(--accent)] hover:underline">lekhrajkumar.vercel.app</a> — always up to date.
        </p>
      </main>

      {/* ═══ Print styles ═══ */}
      <style>{`
        @media print {
          @page { margin: 0.6in 0.7in; size: letter; }
          * { background: #fff !important; color: #000 !important; box-shadow: none !important; }
          body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
          h1, h2, h3 { color: #000 !important; }
          a { color: #000 !important; text-decoration: none !important; }
          .print\\:hidden { display: none !important; }
          nav { display: none !important; }
          main { padding-top: 0 !important; }
          .text-\\[var\\(--accent\\)\\] { color: #0369a1 !important; }
          .text-slate-300 { color: #333 !important; }
          .text-slate-400 { color: #555 !important; }
          .text-slate-500 { color: #777 !important; }
          .text-slate-600 { color: #999 !important; }
          .text-white { color: #000 !important; }
          h1 { font-size: 22pt; font-weight: 700; }
          h2 { font-size: 11pt; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #ccc !important; }
          p, li { font-size: 9.5pt; line-height: 1.4; }
          .gap-x-4 { column-gap: 8px; }
          .gap-x-6 { column-gap: 12px; }
          .space-y-5 > * + * { margin-top: 10px; }
          .space-y-3 > * + * { margin-top: 6px; }
          .space-y-1 > * + * { margin-top: 2px; }
          .mb-6 { margin-bottom: 12px; }
          .mb-3 { margin-bottom: 8px; }
          .mb-2 { margin-bottom: 6px; }
          .mb-1 { margin-bottom: 4px; }
          .mt-1 { margin-top: 3px; }
          .mt-2 { margin-top: 5px; }
          .mt-8 { margin-top: 12px; }
          .pb-1 { padding-bottom: 2px; }
          .py-8 { padding-top: 0; padding-bottom: 0; }
          .grid { display: block; }
          .grid > div { margin-bottom: 3px; }
          .flex { display: flex; }
          .min-w-\\[100px\\] { min-width: 80px; }
        }
      `}</style>
    </>
  );
}

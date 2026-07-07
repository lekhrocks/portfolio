import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { caseStudies } from "@/lib/case-studies";
import { experience } from "@/lib/experience";
import PrintButton from "./print-button";

export const metadata: Metadata = {
  title: "Resume — Lekhraj Kumar",
  description: "Resume for Lekhraj Kumar — Senior Software Engineer",
  robots: { index: true, follow: true },
};

const skillGroups = [
  { name: "Languages", items: ["Java", "Golang", "JavaScript", "TypeScript", "SQL"] },
  { name: "Backend & APIs", items: ["Spring Boot / Spring AI", "Spring WebFlux", "Spring Security", "Hibernate / JPA", "REST, GraphQL, WebSockets", "OAuth2 / JWT"] },
  { name: "AI & LLMs", items: ["Spring AI", "OpenAI / GPT", "Anthropic / Claude", "Cohere", "Groq", "Ollama", "RAG", "Prompt Engineering"] },
  { name: "Architecture", items: ["Microservices", "Event-Driven Architecture", "Domain-Driven Design", "System Design (HLD / LLD)", "SaaS Platforms"] },
  { name: "Messaging & Streaming", items: ["Apache Kafka", "RabbitMQ", "Transactional Outbox"] },
  { name: "Data & Caching", items: ["PostgreSQL / pgvector", "MySQL", "MongoDB", "Redis", "Flyway Migrations"] },
  { name: "Frontend", items: ["Next.js (App Router)", "React / TypeScript", "Tailwind CSS", "TanStack Query", "Zustand", "SSE / WebSocket"] },
  { name: "Cloud & DevOps", items: ["AWS (S3, EC2, IAM)", "Docker", "Kubernetes / Helm", "GitHub Actions", "Jenkins"] },
  { name: "Observability", items: ["Prometheus / Grafana", "Micrometer / Actuator", "OpenTelemetry", "Datadog APM"] },
  { name: "Testing & Quality", items: ["JUnit 5", "Mockito", "Testcontainers", "Integration / Contract Tests", "JaCoCo", "TDD"] },
];

export default function ResumePage() {
  return (
    <>
      <nav className="print:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[var(--bg-primary)] border-b border-[var(--panel-border)]">
        <Link href="/#skills" className="text-xs font-mono text-slate-400 hover:text-white transition-colors">
          ← back to portfolio
        </Link>
        <div className="flex items-center gap-2">
          <PrintButton />
        </div>
      </nav>
      <div className="print:hidden h-12" />

      <main className="max-w-[900px] mx-auto px-6 py-8 text-[var(--text-primary)]">
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

        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--panel-border)] pb-1 mb-2">Professional Summary</h2>
          <p className="text-sm leading-relaxed text-slate-300">{siteConfig.bio}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--panel-border)] pb-1 mb-2">Technical Skills</h2>
          <div className="space-y-1 text-sm">
            {skillGroups.map((g) => (
              <div key={g.name} className="flex gap-2">
                <span className="text-slate-500 font-medium whitespace-nowrap w-[160px] shrink-0">{g.name}:</span>
                <span className="text-slate-300">{g.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--panel-border)] pb-1 mb-3">Experience</h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.hash}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">{exp.role}</h3>
                    <p className="text-sm text-slate-400">{exp.company} — {exp.location}</p>
                  </div>
                  <p className="text-sm text-slate-500 whitespace-nowrap">{exp.period}</p>
                </div>
                <ul className="mt-1.5 space-y-1">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="text-sm text-slate-300 leading-relaxed flex gap-2">
                      <span className="text-slate-600 mt-0.5">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1 mt-2">
                  {exp.tags.map((t) => (
                    <span key={t} className="text-[11px] text-slate-500 font-mono">{t}{exp.tags.indexOf(t) < exp.tags.length - 1 ? " · " : ""}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

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

        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--panel-border)] pb-1 mb-2">Additional</h2>
          <ul className="space-y-1">
            <li className="text-sm text-slate-300 flex gap-2">
              <span className="text-slate-600 mt-0.5">•</span>
              <span>LeetCode: <a href={siteConfig.social.leetcode} className="text-[var(--accent)] hover:underline">{siteConfig.social.leetcodeUser}</a></span>
            </li>
            <li className="text-sm text-slate-300 flex gap-2">
              <span className="text-slate-600 mt-0.5">•</span>
              <span>Open source: <a href={siteConfig.social.github} className="text-[var(--accent)] hover:underline">{siteConfig.social.githubUser}</a></span>
            </li>
          </ul>
        </section>

        <p className="text-xs text-slate-500 text-center mt-8 print:mt-4">
          Generated from <a href={siteConfig.url} className="text-[var(--accent)] hover:underline">{siteConfig.url.replace("https://", "")}</a>
        </p>
      </main>

      <style>{`
        @media print {
          @page { margin: 0.6in 0.7in; size: letter; }
          * { background: #fff !important; color: #000 !important; box-shadow: none !important; }
          body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 10pt; }
          h1 { font-size: 20pt; font-weight: 700; margin-bottom: 2pt; }
          h2 { font-size: 10pt; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #ccc !important; padding-bottom: 2pt; margin-bottom: 6pt; }
          h3 { font-size: 10pt; font-weight: 600; }
          p, li { font-size: 9pt; line-height: 1.35; }
          .print\\:hidden { display: none !important; }
          nav { display: none !important; }
          main { padding-top: 0 !important; max-width: 100% !important; }
          .text-\\[var\\(--accent\\)\\] { color: #0369a1 !important; }
          .text-slate-300, .text-slate-400 { color: #333 !important; }
          .text-slate-500, .text-slate-600 { color: #666 !important; }
          .text-white, .text-slate-200 { color: #000 !important; }
          .mb-6 { margin-bottom: 10pt; }
          .mb-3 { margin-bottom: 6pt; }
          .mb-2 { margin-bottom: 4pt; }
          .space-y-5 > * + * { margin-top: 10pt; }
          .space-y-3 > * + * { margin-top: 6pt; }
          .space-y-1 > * + * { margin-top: 2pt; }
          .gap-x-4 { column-gap: 8pt; }
          .gap-2 { gap: 4pt; }
          .flex { display: flex; }
          .w-\\[160px\\] { width: 130px; }
          .mt-1 { margin-top: 3pt; }
          .mt-2 { margin-top: 4pt; }
          .mt-8 { margin-top: 10pt; }
          .py-8 { padding-top: 0; padding-bottom: 0; }
          a { color: #000 !important; text-decoration: none !important; }
        }
      `}</style>
    </>
  );
}

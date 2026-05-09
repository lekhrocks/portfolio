import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Lightbulb,
  ScrollText,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatusPill from "@/components/console/StatusPill";
import { GithubIcon } from "@/components/icons";
import { caseStudies, getCaseStudyBySlug } from "@/lib/case-studies";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) return { title: "Case study not found" };

  const url = `${siteConfig.url.replace(/\/$/, "")}/case-studies/${cs.slug}`;
  return {
    title: cs.title,
    description: cs.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${cs.title} — Case Study by ${siteConfig.name}`,
      description: cs.summary,
    },
    twitter: {
      card: "summary_large_image",
      title: cs.title,
      description: cs.summary,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) notFound();

  const idx = caseStudies.findIndex((c) => c.slug === cs.slug);
  const next = caseStudies[(idx + 1) % caseStudies.length];

  return (
    <>
      <Navbar />
      <main id="main" className="flex flex-col">
        <article className="section-padding pt-28">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb / back */}
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={12} /> back to /services
            </Link>

            {/* Console header */}
            <header className="mb-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[var(--accent)]" aria-hidden>§</span>
                <span className="mono-label">case-study / {cs.slug}</span>
                <StatusPill tone="info" pulse>shipped</StatusPill>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight mb-3">
                {cs.title}
              </h1>
              <p className="text-base text-slate-400 leading-relaxed mb-6 max-w-2xl">
                {cs.subtitle}
              </p>

              {/* Quick facts strip */}
              <div className="grid sm:grid-cols-3 gap-2 mb-5">
                <FactRow icon={<Users size={12} />} label="role" value={cs.team} />
                <FactRow icon={<Clock size={12} />} label="duration" value={cs.duration} />
                <FactRow
                  icon={<GithubIcon size={12} />}
                  label="source"
                  value="github.com/lekhrocks"
                  href={cs.githubUrl}
                />
              </div>

              {/* Stack chips */}
              <div className="flex flex-wrap gap-1 mb-6">
                {cs.stack.map((s) => (
                  <span
                    key={s}
                    className="mono-tag px-2 py-0.5 rounded border border-[var(--panel-border)] text-slate-400"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* TL;DR */}
              <div className="panel p-5">
                <div className="flex items-center gap-2 mb-2">
                  <ScrollText size={12} className="text-[var(--accent)]" />
                  <span className="mono-label text-[var(--accent)]">tl;dr</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {cs.summary}
                </p>
                <div className="panel-divider mt-4 pt-3">
                  <p className="text-xs text-slate-500 font-mono">
                    <span className="text-slate-400">role: </span>
                    {cs.role}
                  </p>
                </div>
              </div>
            </header>

            {/* Outcome metrics — front-loaded so skim-readers see results first */}
            <Section id="01.outcome" icon={<TrendingUp size={14} />} title="Outcome">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 not-prose">
                {cs.outcome.map((m) => (
                  <div key={m.label} className="panel p-4">
                    <div className="text-2xl font-bold font-mono text-[var(--accent)]">
                      {m.value}
                    </div>
                    <div className="mono-label mt-1.5 text-slate-300">
                      {m.label}
                    </div>
                    {m.hint && (
                      <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {m.hint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            {/* Problem */}
            <Section id="02.problem" icon={<Target size={14} />} title={cs.problem.heading}>
              {cs.problem.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </Section>

            {/* Constraints */}
            <Section
              id="03.constraints"
              icon={<CheckCircle2 size={14} />}
              title={cs.constraints.heading}
            >
              {cs.constraints.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {cs.constraints.bullets && (
                <ul className="not-prose space-y-2 mt-4">
                  {cs.constraints.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-slate-300 font-mono"
                    >
                      <span className="text-[var(--accent)] mt-0.5 flex-shrink-0">
                        ›
                      </span>
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            {/* Approach */}
            <Section id="04.approach" icon={<Wrench size={14} />} title={cs.approach.heading}>
              {cs.approach.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {cs.approach.bullets && (
                <ul className="not-prose space-y-2 mt-4">
                  {cs.approach.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-slate-300 font-mono"
                    >
                      <span className="text-[var(--accent)] mt-0.5 flex-shrink-0">
                        ›
                      </span>
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Architecture link */}
              <div className="not-prose mt-6">
                <Link
                  href="/#architecture"
                  className="inline-flex items-center gap-2 text-sm font-mono text-[var(--accent)] hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink size={12} />
                  view full topology →
                </Link>
              </div>
            </Section>

            {/* Tradeoffs */}
            <Section id="05.tradeoffs" icon={<Sparkles size={14} />} title="Tradeoffs">
              <p>
                Engineering is the act of choosing what to give up. These are the
                deliberate tradeoffs I made and why.
              </p>
              <div className="not-prose space-y-2 mt-4">
                {cs.tradeoffs.map((t, i) => (
                  <div key={i} className="panel p-4">
                    <div className="mono-label mb-2 text-slate-400">
                      decision · {t.decision}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-mono">
                      <span
                        className="px-2 py-0.5 rounded border"
                        style={{
                          background: "rgba(34, 211, 238, 0.08)",
                          borderColor: "rgba(34, 211, 238, 0.30)",
                          color: "var(--accent)",
                        }}
                      >
                        chose · {t.chose}
                      </span>
                      <span className="text-slate-500">over</span>
                      <span className="px-2 py-0.5 rounded border border-[var(--panel-border)] text-slate-400">
                        {t.over}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{t.why}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Lessons */}
            <Section
              id="06.lessons"
              icon={<Lightbulb size={14} />}
              title="What I'd take with me"
            >
              <ul className="not-prose space-y-2.5">
                {cs.lessons.map((l, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed"
                  >
                    <span
                      className="mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold font-mono"
                      style={{
                        background: "rgba(34, 211, 238, 0.10)",
                        border: "1px solid rgba(34, 211, 238, 0.35)",
                        color: "var(--accent)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {l}
                  </li>
                ))}
              </ul>
            </Section>

            {/* CTA Footer */}
            <div className="mt-16 panel p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                <div className="mono-label mb-1">on-call</div>
                <div className="text-white text-sm font-medium mb-0.5">
                  Want to walk through this in an interview?
                </div>
                <p className="text-xs text-slate-400">
                  Happy to discuss tradeoffs, run the code live, or whiteboard the next iteration.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/#contact"
                  className="px-3 py-1.5 rounded-md text-xs font-mono bg-[var(--accent)] text-black hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
                >
                  page on-call →
                </Link>
                <Link
                  href={`/case-studies/${next.slug}`}
                  className="px-3 py-1.5 rounded-md text-xs font-mono border border-[var(--panel-border)] text-slate-300 hover:text-white hover:border-[var(--panel-border-hover)] transition-colors inline-flex items-center gap-1.5"
                >
                  next: {next.title}
                  <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

/* ─────────────── Subcomponents ─────────────── */

function FactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="panel p-3 flex items-start gap-2.5 hover:border-[var(--panel-border-hover)] transition-colors h-full">
      <div className="text-[var(--accent)] mt-0.5 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <div className="mono-label text-[10px]">{label}</div>
        <div className="text-xs text-slate-200 truncate font-mono">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}

function Section({
  id,
  icon,
  title,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[var(--accent)] flex items-center" aria-hidden>
          {icon}
        </span>
        <span className="mono-label">{id}</span>
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3">
        {title}
      </h2>
      <div className="panel-divider mb-4" />
      <div className="case-prose text-slate-400">{children}</div>
    </section>
  );
}

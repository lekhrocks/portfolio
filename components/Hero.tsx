"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Download,
  Globe,
  Mail,
  MapPin,
  Server,
  Terminal,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, LeetcodeIcon } from "@/components/icons";
import StatusPill from "@/components/console/StatusPill";

/**
 * Hero rebuilt as a "Service Overview" panel — the visual model is a Datadog
 * service detail page, not a marketing landing. Left-justified, monospace
 * chrome, single accent. No 3D, no typewriter, no centered avatar.
 */

type Health = {
  status: string;
  region: string;
  runtime: string;
  uptime_ms: number;
  version: string;
};

const TAGS = [
  "java",
  "spring-boot",
  "kafka",
  "microservices",
  "aws",
  "react",
  "distributed-systems",
];

const METRICS = [
  { label: "RPS sustained",   value: "10K+",   sub: "router-service" },
  { label: "p99 latency",     value: "<20ms",  sub: "router-service" },
  { label: "Kafka throughput",value: "4×",     sub: "billing pipeline" },
  { label: "SLA achieved",    value: "99.9%",  sub: "appdirect prod" },
  { label: "LeetCode solved", value: "729+",   sub: "@lekh_nith" },
  { label: "Years shipping",  value: "5+",     sub: "since 2020" },
];

const RECENT_ACTIVITY = [
  { kind: "deploy",  ref: "appdirect/billing",   note: "Migrated RabbitMQ → Kafka (4× throughput)", when: "2024" },
  { kind: "ship",    ref: "router-service",      note: "10K+ RPS sustained, p99 < 20ms",            when: "2025" },
  { kind: "publish", ref: "case-studies/router-service", note: "Wrote up tradeoffs and outcome",   when: "2026" },
];

export default function Hero() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    let cancel = false;
    fetch("/api/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: Health) => !cancel && setHealth(d))
      .catch(() => {});
    return () => {
      cancel = true;
    };
  }, []);

  const region = health?.region && health.region !== "local" ? health.region : "ap-south-1";

  return (
    <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-dot-grid">
      <div className="max-w-6xl mx-auto">
        {/* ───── 1. Service identity row ───── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="min-w-0">
            <div className="mono-label mb-2 flex items-center gap-2">
              <Server size={11} />
              service / personal
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-none mb-2">
              <span className="text-white">lekhraj</span>
              <span className="text-[var(--accent)]">kumar</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-xl leading-relaxed">
              Backend Software Engineer. 5+ years owning high-throughput distributed
              systems in payments &amp; SaaS. Hands-on with React when the UI is the
              bottleneck.
            </p>
          </div>

          {/* Status cluster */}
          <div className="flex flex-col items-start sm:items-end gap-2 sm:min-w-[230px]">
            <StatusPill tone="ok" pulse>
              healthy · serving traffic
            </StatusPill>
            <StatusPill tone="info">
              open to senior backend roles
            </StatusPill>
            <a
              href="/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="mono-tag text-[var(--text-chrome)] hover:text-slate-300 transition-colors flex items-center gap-1.5 mt-1"
              title="Live edge health endpoint"
            >
              <Globe size={10} />
              <span>{region}</span>
              <span className="text-[var(--text-chrome)]">·</span>
              <span>{health?.runtime ?? "edge"}</span>
            </a>
          </div>
        </div>

        {/* ───── 2. Owner / tags strip ───── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="panel p-4 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
            {/* Owner */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-md overflow-hidden border border-[var(--panel-border)] flex-shrink-0">
                <Image
                  src="/lekhraj.png"
                  alt="Lekhraj Kumar"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover object-top"
                  priority
                />
              </div>
              <div className="min-w-0">
                <div className="mono-label">owner</div>
                <div className="text-sm text-white truncate">Lekhraj Kumar</div>
              </div>
            </div>

            <Divider />

            <div className="min-w-0">
              <div className="mono-label">role</div>
              <div className="text-sm text-white">Sr. SWE · CP Axtra</div>
            </div>

            <Divider />

            <div className="min-w-0">
              <div className="mono-label">location</div>
              <div className="text-sm text-white flex items-center gap-1.5">
                <MapPin size={12} className="text-slate-500" />
                Pune, India · remote-friendly
              </div>
            </div>

            <Divider />

            <div className="min-w-0 flex-1">
              <div className="mono-label mb-1.5">tags</div>
              <div className="flex flex-wrap gap-1.5">
                {TAGS.map((t) => (
                  <span
                    key={t}
                    className="mono-tag px-1.5 py-0.5 rounded border border-[var(--panel-border)] text-slate-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ───── 3. Metrics grid ───── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[var(--panel-border)] border border-[var(--panel-border)] rounded-xl overflow-hidden mb-6"
        >
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="bg-[var(--panel-bg)] p-4 transition-colors hover:bg-[var(--panel-bg-hover)]"
            >
              <div className="mono-label mb-1 truncate">{m.label}</div>
              <div className="text-xl sm:text-2xl font-semibold text-white font-mono leading-none mb-1">
                {m.value}
              </div>
              <div className="text-[11px] text-slate-500 truncate">{m.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* ───── 4. Two columns: actions + recent activity ───── */}
        <div className="grid lg:grid-cols-3 gap-4 mb-10">
          {/* Actions panel */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="panel p-5 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="mono-label">actions</span>
              <span className="mono-tag text-[var(--text-chrome)]">primary &amp; links</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <PrimaryAction href="/Lekhraj_Kumar_Resume.pdf" download>
                <Download size={13} /> Resume
              </PrimaryAction>
              <SecondaryAction href="#projects">
                <Terminal size={13} /> See owned services
              </SecondaryAction>
              <SecondaryAction href="https://github.com/lekhrocks" external>
                <GithubIcon size={13} /> GitHub
              </SecondaryAction>
              <SecondaryAction href="https://linkedin.com/in/lekhrajkumar" external>
                <LinkedinIcon size={13} /> LinkedIn
              </SecondaryAction>
              <SecondaryAction href="mailto:lekh.nith@gmail.com">
                <Mail size={13} /> Email
              </SecondaryAction>
              <SecondaryAction href="https://leetcode.com/u/lekh_nith/" external>
                <LeetcodeIcon size={13} /> LeetCode
              </SecondaryAction>
            </div>
            <div className="mt-4 pt-4 panel-divider">
              <p className="text-xs text-slate-500 leading-relaxed">
                <span className="text-slate-400">Note:</span> this portfolio ships
                live edge endpoints —{" "}
                <a href="/api/health" target="_blank" rel="noopener noreferrer" className="console-link">
                  /api/health
                </a>{" "}
                and{" "}
                <a href="/api/stats" target="_blank" rel="noopener noreferrer" className="console-link">
                  /api/stats
                </a>
                . Open them.
              </p>
            </div>
          </motion.div>

          {/* Recent activity */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="panel p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="mono-label">recent activity</span>
              <span className="dot dot-pulse" style={{ background: "var(--accent)" }} />
            </div>
            <ul className="space-y-3">
              {RECENT_ACTIVITY.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mono-tag text-[var(--accent)] uppercase shrink-0 mt-0.5 w-12">
                    {a.kind}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-slate-300 truncate">{a.ref}</div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {a.note}
                    </div>
                  </div>
                  <span className="mono-tag text-[var(--text-chrome)] shrink-0">
                    {a.when}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ───── 5. Subtle scroll cue ───── */}
        <motion.button
          onClick={() => {
            const el = document.getElementById("about");
            if (el)
              window.scrollTo({
                top: el.getBoundingClientRect().top + window.scrollY - 72,
                behavior: "smooth",
              });
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 mono-label flex items-center gap-2 text-[var(--text-chrome)] hover:text-slate-300 transition-colors"
          aria-label="Scroll to owner section"
        >
          <ArrowDown size={11} className="animate-bounce" />
          continue · owner
        </motion.button>
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div
      className="hidden lg:block h-8 w-px"
      style={{ background: "var(--panel-border)" }}
      aria-hidden
    />
  );
}

function PrimaryAction({
  href,
  download,
  children,
}: {
  href: string;
  download?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      download={download}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--accent)] text-black hover:bg-[#67e8f9] transition-colors"
    >
      {children}
    </a>
  );
}

function SecondaryAction({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--panel-border)] text-slate-300 hover:text-white hover:border-[var(--panel-border-hover)] transition-colors"
    >
      {children}
    </a>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, Building2, Star, Quote } from "lucide-react";
import SectionHeader from "@/components/console/SectionHeader";
import { LeetcodeIcon } from "@/components/icons";

function NitLogo() {
  const [failed, setFailed] = useState(false);
  if (!failed) {
    return (
      <img
        src="https://www.google.com/s2/favicons?domain=nith.ac.in&sz=128"
        alt="NIT Hamirpur"
        className="w-6 h-6 object-contain"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6" aria-hidden="true">
      <rect width="40" height="40" rx="6" fill="#003399" />
      <text x="20" y="18" textAnchor="middle" fill="white" fontSize="9" fontWeight="800">NIT</text>
      <text x="20" y="29" textAnchor="middle" fill="#FFD700" fontSize="6" fontWeight="600">HAMIRPUR</text>
    </svg>
  );
}

const FACTS = [
  { label: "current",  value: "CP Axtra — Sr. SWE" },
  { label: "since",    value: "Jun 2026" },
  { label: "location", value: "Remote" },
  { label: "open to",  value: "Senior · Staff" },
];

export default function About() {
  return (
    <section id="about" className="section-padding scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="01.owner"
          title="Owner"
          subtitle="Who runs this service. Bio, education, signals, and the engineering principle I keep coming back to."
        />

        {/* Bento grid — 4 cols on lg, varied row spans */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 auto-rows-[minmax(120px,auto)]">
          {/* ── Bio (large, 3 cols × 2 rows) ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="panel p-6 md:col-span-3 md:row-span-2"
          >
            <div className="mono-label mb-3">summary.md</div>
            <p className="text-slate-300 text-sm leading-relaxed">
              I&apos;m a Software Engineer with{" "}
              <span className="text-white font-medium">5+ years</span> building and scaling
              high-throughput distributed systems in{" "}
              <span className="text-[var(--accent)]">payments, SaaS, and retail-tech</span>.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed mt-3">
              At <span className="text-white font-medium">CP Axtra</span>, I&apos;m building
              backend microservices for a payment-related invoice processing system — reactive
              WebFlux, Kafka event pipelines, Keycloak OAuth2, distributed ShedLock schedulers,
              and a Testcontainers integration framework targeting 75% instruction coverage.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed mt-3">
              Previously at <span className="text-white font-medium">AppDirect</span> I designed
              and owned high-availability microservices for Billing, Checkout, Notifications, and
              Payments — supporting thousands of concurrent requests with sub-200ms p99 latency.
              I led the migration from{" "}
              <span className="text-white font-medium">RabbitMQ to Kafka</span>, achieving a{" "}
              <span className="text-white font-medium">4× throughput improvement</span> for billing
              workflows processing millions of events per day.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed mt-3">
              My core expertise spans microservices architecture, event-driven systems, JVM
              performance tuning, and building production-grade observability stacks with
              Prometheus and Datadog APM.
            </p>

            {/* facts grid */}
            <div className="mt-5 pt-5 panel-divider grid grid-cols-2 sm:grid-cols-4 gap-4">
              {FACTS.map((f) => (
                <div key={f.label}>
                  <div className="mono-label mb-0.5">{f.label}</div>
                  <div className="text-sm text-white">{f.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── LeetCode ── */}
          <motion.a
            href="https://leetcode.com/u/lekh_nith/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="panel panel-interactive p-5 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="mono-label">leetcode</span>
              <LeetcodeIcon size={14} className="text-[#FFA116]" />
            </div>
            <div className="text-3xl font-semibold font-mono text-white leading-none">729+</div>
            <div className="text-xs text-slate-400 mt-1">problems solved</div>
            <div className="text-[11px] text-slate-500 mt-2 truncate">@lekh_nith · Top 10%</div>
          </motion.a>

          {/* ── Education ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="panel p-5 md:col-span-2"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="mono-label">education</span>
              <GraduationCap size={13} className="text-slate-500" />
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                <NitLogo />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-sm font-medium">NIT Hamirpur</span>
                  <span className="inline-flex items-center gap-1 mono-tag px-1.5 py-0.5 rounded border border-yellow-500/30 text-yellow-400">
                    <Star size={9} className="fill-yellow-400" /> 8.65 GPA
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  B.Tech + M.Tech · Electronics &amp; Communication
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">2015 – 2020</p>
              </div>
            </div>
          </motion.div>

          {/* ── Location pill ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="panel p-5 flex flex-col justify-between"
          >
            <div className="mono-label flex items-center gap-1.5">
              <MapPin size={11} /> location
            </div>
            <div>
              <div className="text-sm text-white">Pune, IN</div>
              <div className="text-[11px] text-slate-500 mt-0.5">UTC+5:30 · remote-friendly</div>
            </div>
          </motion.div>

          {/* ── Engineering Principle ── */}
          <motion.blockquote
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="panel p-6 md:col-span-3"
          >
            <div className="flex items-start gap-3">
              <Quote size={18} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed italic">
                  Great systems aren&apos;t just fast — they&apos;re observable, resilient,
                  and maintainable. I build for the 3am incident, not just the happy path.
                </p>
                <div className="mono-label mt-3">— principle</div>
              </div>
            </div>
          </motion.blockquote>

          {/* ── Currently ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="panel p-5"
          >
            <div className="mono-label mb-3 flex items-center gap-1.5">
              <Building2 size={11} /> currently
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-0.5">›</span>
                <span>Building Invoice Management System at CP Axtra</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-0.5">›</span>
                <span>Writing case studies for shipped systems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-0.5">›</span>
                <span>Senior Software Engineer · CP Axtra</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

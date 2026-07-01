"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/console/SectionHeader";
import StatusPill from "@/components/console/StatusPill";

type Deployment = {
  hash: string;
  company: string;
  role: string;
  period: string;
  location: string;
  current: boolean;
  logoUrl: string;
  highlights: string[];
  tags: string[];
};

const deployments: Deployment[] = [
  {
    hash: "f1a9e03",
    company: "CP Axtra",
    role: "Senior Software Engineer",
    period: "Jun 2026 — Present",
    location: "Remote",
    current: true,
    logoUrl: "https://www.google.com/s2/favicons?domain=cpaxtra.com&sz=128",
    highlights: [
      "Developing backend microservices for a payment-related invoice processing system using Java 21, Spring Boot 3.5, Spring WebFlux, and PostgreSQL.",
      "Built event-driven Kafka consumers handling multiple event types with header-based routing, DLQ fan-out, and structured error recovery.",
      "Implemented distributed ShedLock batch schedulers for timed invoice submission workflows, with partial-failure handling and audit logging.",
      "Designed dual-chain Spring Security: static Bearer-token auth for internal service-to-service calls and Keycloak OAuth2 JWT for external consumers.",
      "Built a Testcontainers-based integration testing framework with a reusable base class (real PostgreSQL, WebTestClient, FK-safe teardown) — raising the JaCoCo instruction coverage gate to 75%.",
      "Modernised Gradle build: Boot BOM as platform(), separate unit/integration test tasks, Allure 2.39 + JaCoCo Cobertura wired into GitLab CI.",
      "Integrated Tencent Cloud COS for cloud object storage and built external API clients for downstream services using Spring WebClient.",
      "Collaborating with product, QA, and cross-functional teams to deliver payment-related backend features.",
    ],
    tags: ["Java 21", "Spring Boot 3.5", "WebFlux", "Kafka", "PostgreSQL", "Testcontainers", "ShedLock", "Keycloak", "Tencent Cloud", "GitLab CI", "Docker"],
  },
  {
    hash: "a8f3c12",
    company: "AppDirect",
    role: "Software Development Engineer II",
    period: "Sep 2022 — Jun 2026",
    location: "Pune, IN",
    current: false,
    logoUrl: "https://www.google.com/s2/favicons?domain=appdirect.com&sz=128",
    highlights: [
      "Designed and own multiple high-availability microservices for Billing, Checkout, Notifications, and Payments — supporting thousands of concurrent requests with p99 < 200ms and 99.9%+ availability.",
      "Built integrations with PayPal, Stripe, and Billpay via custom connectors ensuring secure, reliable payment processing.",
      "Migrated legacy RabbitMQ event pipelines to Kafka — improving event throughput by ~4×, enabling horizontal scalability and replayable, fault-tolerant processing for workflows handling millions of events/day.",
      "Decomposed a monolithic system into domain-aligned microservices using event-driven architecture, enabling independent scaling, faster deployments, and improved fault isolation.",
      "Developed MicroUI components using React and Mantine for real-time user features and operational visibility.",
      "Practiced TDD with JUnit and Mockito; delivered CI/CD pipelines using GitHub Actions.",
      "On-call rotations: debugging production incidents, performing RCA, and implementing long-term reliability fixes.",
    ],
    tags: ["Java", "Spring Boot", "Kafka", "Microservices", "React", "Docker", "K8s", "Prometheus"],
  },
  {
    hash: "1d92b07",
    company: "Infosys",
    role: "Senior Systems Engineer",
    period: "Nov 2020 — Sep 2022",
    location: "Pune, IN",
    current: false,
    logoUrl: "https://www.google.com/s2/favicons?domain=infosys.com&sz=128",
    highlights: [
      "Customized and extended core banking modules using Java and JavaScript to meet client-specific regulatory requirements in mission-critical banking systems.",
      "Migrated legacy Finacle scripts to modern Java-based microservices, improving maintainability, testability, and deployment reliability.",
      "Built and maintained EOD/BOD automation workflows, reducing manual effort and operational risk.",
      "Delivered scalable solutions across CASA, Loans, and Term Deposit modules, ensuring transactional integrity and data consistency.",
      "Investigated and resolved production issues, performed RCA, and implemented stabilising fixes.",
    ],
    tags: ["Java", "JavaScript", "Finacle", "Banking", "Microservices", "MySQL"],
  },
];

function CompanyAvatar({ d }: { d: Deployment }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src={d.logoUrl}
        alt={`${d.company} logo`}
        className="w-7 h-7 object-contain rounded"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <span className="font-mono text-[10px] font-bold text-slate-300">
      {d.company.slice(0, 2).toUpperCase()}
    </span>
  );
}

export default function Experience() {
  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <section id="experience" className="section-padding scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          id="03.deployments"
          title="Deployment history"
          subtitle="Where this engineer has shipped. Newest deploy first. Click a row to expand the changelog."
          meta={
            <span className="mono-tag text-[var(--text-chrome)]">
              {deployments.length} deploys · main
            </span>
          }
        />

        {/* Deploy log */}
        <div className="panel overflow-hidden">
          {deployments.map((d, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={d.hash}
                className={i > 0 ? "panel-divider" : ""}
              >
                {/* Row header */}
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  className="w-full text-left px-5 py-4 hover:bg-[var(--panel-bg-hover)] transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-4">
                    {/* commit hash + dot */}
                    <div className="flex flex-col items-center pt-1">
                      <span
                        className="dot"
                        style={{
                          background: d.current ? "var(--status-ok)" : "var(--text-chrome)",
                        }}
                      />
                      <span className="mono-tag text-[var(--text-chrome)] mt-2 text-[10px]">
                        {d.hash}
                      </span>
                    </div>

                    {/* logo */}
                    <div className="hidden sm:flex w-10 h-10 rounded-md bg-white items-center justify-center flex-shrink-0">
                      <CompanyAvatar d={d} />
                    </div>

                    {/* content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-base text-white font-medium">
                          {d.company}
                        </span>
                        <span className="text-[var(--text-chrome)]">/</span>
                        <span className="text-sm text-slate-300">{d.role}</span>
                        {d.current && (
                          <StatusPill tone="ok" pulse>
                            current
                          </StatusPill>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 mono-tag text-[var(--text-chrome)]">
                        <span>{d.period}</span>
                        <span>·</span>
                        <span>{d.location}</span>
                      </div>
                    </div>

                    {/* expand chevron */}
                    <span
                      className={`mono-tag text-[var(--text-chrome)] transition-transform ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    >
                      ›
                    </span>
                  </div>
                </button>

                {/* Expanded changelog */}
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5 pl-[68px]"
                  >
                    <div className="mono-label mb-3">changelog</div>
                    <ul className="space-y-2 mb-4">
                      {d.highlights.map((h, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-[13px] text-slate-300 leading-relaxed"
                        >
                          <span className="mono-tag text-[var(--accent)] flex-shrink-0 pt-0.5">
                            +
                          </span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5 pt-3 panel-divider">
                      {d.tags.map((t) => (
                        <span
                          key={t}
                          className="mono-tag px-1.5 py-0.5 rounded border border-[var(--panel-border)] text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

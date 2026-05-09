"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/console/SectionHeader";

type Skill = { name: string; primary?: boolean };
type Group = { id: string; title: string; skills: Skill[] };

const GROUPS: Group[] = [
  {
    id: "lang",
    title: "languages",
    skills: [
      { name: "Java", primary: true },
      { name: "Golang" },
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "SQL" },
    ],
  },
  {
    id: "backend",
    title: "backend & APIs",
    skills: [
      { name: "Spring Boot", primary: true },
      { name: "Spring Security" },
      { name: "Hibernate / JPA" },
      { name: "RESTful APIs" },
      { name: "GraphQL" },
      { name: "WebSockets" },
      { name: "OAuth2" },
    ],
  },
  {
    id: "arch",
    title: "architecture",
    skills: [
      { name: "Microservices", primary: true },
      { name: "Event-Driven" },
      { name: "Domain-Driven Design" },
      { name: "System Design (HLD/LLD)" },
      { name: "SaaS Platforms" },
    ],
  },
  {
    id: "msg",
    title: "messaging & streaming",
    skills: [
      { name: "Apache Kafka", primary: true },
      { name: "RabbitMQ" },
    ],
  },
  {
    id: "data",
    title: "data & caching",
    skills: [
      { name: "PostgreSQL", primary: true },
      { name: "MySQL" },
      { name: "MongoDB" },
      { name: "Redis" },
    ],
  },
  {
    id: "infra",
    title: "cloud & devops",
    skills: [
      { name: "AWS" },
      { name: "Docker", primary: true },
      { name: "Kubernetes" },
      { name: "Helm" },
      { name: "GitHub Actions" },
      { name: "Jenkins" },
    ],
  },
  {
    id: "obs",
    title: "observability",
    skills: [
      { name: "Prometheus", primary: true },
      { name: "Datadog APM" },
      { name: "Spring Actuator" },
      { name: "Elasticsearch" },
      { name: "Logstash" },
      { name: "Centralized Logging" },
    ],
  },
  {
    id: "test",
    title: "testing & quality",
    skills: [
      { name: "JUnit", primary: true },
      { name: "Mockito" },
      { name: "Integration" },
      { name: "Contract" },
      { name: "TDD" },
      { name: "CI/CD Pipelines" },
    ],
  },
];

const RUNTIME_FACTS = [
  { label: "JVM tuning",          value: "Memory · GC · thread pools" },
  { label: "Resilience patterns", value: "Circuit-break · retry · rate-limit" },
  { label: "Observability",       value: "Prometheus · Actuator · Datadog" },
  { label: "Load testing",        value: "10K+ RPS · 1M+ requests" },
];

export default function Skills() {
  return (
    <section id="skills" className="section-padding scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="02.stack"
          title="Stack & tooling"
          subtitle="What this service runs on. Primary tags marked with a leading dot."
          meta={
            <span className="mono-tag text-[var(--text-chrome)]">
              {GROUPS.length} groups · {GROUPS.reduce((n, g) => n + g.skills.length, 0)} entries
            </span>
          }
        />

        {/* Stack groups */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {GROUPS.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="panel p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="mono-label">{g.title}</span>
                <span className="mono-tag text-[var(--text-chrome)]">{g.skills.length}</span>
              </div>
              <ul className="space-y-1">
                {g.skills.map((s) => (
                  <li
                    key={s.name}
                    className="flex items-center gap-2 text-[13px] text-slate-300"
                  >
                    <span
                      className={`w-1 h-1 rounded-full flex-shrink-0 ${
                        s.primary ? "bg-[var(--accent)]" : "bg-slate-700"
                      }`}
                    />
                    <span className={s.primary ? "text-white" : ""}>{s.name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Runtime characteristics strip */}
        <div className="panel mt-3 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="mono-label">runtime characteristics</span>
            <span className="mono-tag text-[var(--text-chrome)]">production patterns</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {RUNTIME_FACTS.map((r) => (
              <div key={r.label}>
                <div className="text-xs text-[var(--accent)] font-mono mb-1">
                  {r.label}
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">{r.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

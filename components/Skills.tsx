"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Code2,
  Server,
  Network,
  Send,
  Database,
  Cloud,
  LineChart,
  CheckCircle2,
} from "lucide-react";
import TiltCard from "@/components/TiltCard";

/* Devicon brand-icon helper (CDN, no install needed) */
function brandIcon(name: string) {
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`;
}

const skillCategories = [
  {
    title: "Languages",
    Icon: Code2,
    color: "from-yellow-500 to-orange-500",
    borderColor: "border-yellow-500/20",
    pillColor: "bg-yellow-500/10 border-yellow-500/20 text-yellow-300",
    skills: [
      { name: "Java (Primary)", icon: brandIcon("java/java") },
      { name: "Golang",          icon: brandIcon("go/go") },
      { name: "JavaScript",      icon: brandIcon("javascript/javascript") },
    ],
  },
  {
    title: "Backend Frameworks",
    Icon: Server,
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/20",
    pillColor: "bg-blue-500/10 border-blue-500/20 text-blue-300",
    skills: [
      { name: "Spring Boot",     icon: brandIcon("spring/spring") },
      { name: "Spring Security", icon: brandIcon("spring/spring") },
      { name: "Hibernate/JPA",   icon: brandIcon("hibernate/hibernate") },
      { name: "RESTful APIs",    icon: null },
      { name: "GraphQL",         icon: brandIcon("graphql/graphql") },
      { name: "WebSockets",      icon: null },
      { name: "OAuth2",          icon: null },
    ],
  },
  {
    title: "Architecture",
    Icon: Network,
    color: "from-purple-500 to-violet-500",
    borderColor: "border-purple-500/20",
    pillColor: "bg-purple-500/10 border-purple-500/20 text-purple-300",
    skills: [
      { name: "Microservices",            icon: null },
      { name: "Event-Driven Architecture", icon: null },
      { name: "Domain-Driven Design",     icon: null },
      { name: "System Design (HLD/LLD)",  icon: null },
      { name: "SaaS Platforms",           icon: null },
    ],
  },
  {
    title: "Messaging & Streaming",
    Icon: Send,
    color: "from-pink-500 to-rose-500",
    borderColor: "border-pink-500/20",
    pillColor: "bg-pink-500/10 border-pink-500/20 text-pink-300",
    skills: [
      { name: "Apache Kafka", icon: brandIcon("apachekafka/apachekafka") },
      { name: "RabbitMQ",     icon: brandIcon("rabbitmq/rabbitmq") },
    ],
  },
  {
    title: "Databases & Caching",
    Icon: Database,
    color: "from-green-500 to-emerald-500",
    borderColor: "border-green-500/20",
    pillColor: "bg-green-500/10 border-green-500/20 text-green-300",
    skills: [
      { name: "MySQL",      icon: brandIcon("mysql/mysql") },
      { name: "PostgreSQL", icon: brandIcon("postgresql/postgresql") },
      { name: "MongoDB",    icon: brandIcon("mongodb/mongodb") },
      { name: "Redis",      icon: brandIcon("redis/redis") },
    ],
  },
  {
    title: "Cloud, DevOps & Infrastructure",
    Icon: Cloud,
    color: "from-cyan-500 to-sky-500",
    borderColor: "border-cyan-500/20",
    pillColor: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
    skills: [
      { name: "Docker",         icon: brandIcon("docker/docker") },
      { name: "Kubernetes",     icon: brandIcon("kubernetes/kubernetes") },
      { name: "Helm",           icon: brandIcon("helm/helm") },
      { name: "GitHub Actions", icon: brandIcon("githubactions/githubactions") },
      { name: "Jenkins",        icon: brandIcon("jenkins/jenkins") },
      { name: "AWS",            icon: brandIcon("amazonwebservices/amazonwebservices-original-wordmark") },
    ],
  },
  {
    title: "Observability & Reliability",
    Icon: LineChart,
    color: "from-indigo-500 to-blue-500",
    borderColor: "border-indigo-500/20",
    pillColor: "bg-indigo-500/10 border-indigo-500/20 text-indigo-300",
    skills: [
      { name: "Prometheus",       icon: brandIcon("prometheus/prometheus") },
      { name: "Datadog APM",      icon: null },
      { name: "Elasticsearch",    icon: brandIcon("elasticsearch/elasticsearch") },
      { name: "Logstash",         icon: null },
      { name: "Spring Actuator",  icon: brandIcon("spring/spring") },
      { name: "Centralized Logging", icon: null },
    ],
  },
  {
    title: "Testing & Quality",
    Icon: CheckCircle2,
    color: "from-teal-500 to-green-500",
    borderColor: "border-teal-500/20",
    pillColor: "bg-teal-500/10 border-teal-500/20 text-teal-300",
    skills: [
      { name: "JUnit",                icon: brandIcon("junit/junit") },
      { name: "Mockito",              icon: null },
      { name: "Integration Testing",  icon: null },
      { name: "Contract Testing",     icon: null },
      { name: "TDD",                  icon: null },
      { name: "CI/CD Pipelines",      icon: brandIcon("githubactions/githubactions") },
    ],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="section-padding">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-blue-500/20 text-blue-400 text-xs font-mono mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            02 / Skills
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-title text-white mb-4"
          >
            Technical Arsenal
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 max-w-xl mx-auto"
          >
            A deep stack built for high-performance backend systems
          </motion.p>
        </div>

        {/* Skills Grid */}
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          style={{ perspective: 1500 }}
        >
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
            >
              <TiltCard
                maxTilt={8}
                scale={1.03}
                className={`glass glass-hover rounded-2xl p-5 border ${category.borderColor} group relative overflow-hidden h-full shadow-3d`}
              >
                <div
                  className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${category.color} opacity-10 blur-2xl group-hover:opacity-30 transition-opacity`}
                />

                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${category.color} bg-opacity-15 flex items-center justify-center shadow-md`}
                  >
                    <category.Icon size={14} className="text-white" />
                  </div>
                  <h3
                    className={`text-xs font-semibold uppercase tracking-wider bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}
                  >
                    {category.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill) => {
                    const FallbackIcon = category.Icon;
                    return (
                      <span
                        key={skill.name}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${category.pillColor} transition-all duration-200 hover:scale-105`}
                      >
                        <span className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
                          {skill.icon ? (
                            <img
                              src={skill.icon}
                              alt=""
                              className="w-full h-full object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <FallbackIcon size={11} className="opacity-80" />
                          )}
                        </span>
                        {skill.name}
                      </span>
                    );
                  })}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Performance Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 glass rounded-2xl p-6 border border-blue-500/10 bg-gradient-to-br from-blue-950/20 to-purple-950/10"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="text-base">🚀</span>
            System Performance & Reliability
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "JVM Optimization", desc: "Memory, GC tuning, thread pool management" },
              { label: "Resilience Patterns", desc: "Circuit breakers, retries, rate limiting, backoff" },
              { label: "Observability Stack", desc: "Prometheus, Actuator, Datadog APM, centralized logging" },
              { label: "Load Testing", desc: "Validated up to 10K+ RPS, 1M+ requests stress tests" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="text-blue-400 text-xs font-semibold">{item.label}</span>
                <span className="text-slate-500 text-xs">{item.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

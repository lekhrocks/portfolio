"use client";

import { useRef, useState } from "react";
import type React from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ExternalLink, Server, MessageSquare, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import TiltCard from "@/components/TiltCard";

type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  borderColor: string;
  glowColor: string;
  accentColor: string;
  githubUrl: string;
  tags: string[];
  highlights: string[];
  metrics: { label: string; value: string }[];
  architectureId: string | null;
};

const projects: Project[] = [
  {
    id: "router",
    title: "Router Service",
    subtitle: "High-Performance Request Router / Load Balancer",
    description:
      "Enterprise-grade request router inspired by API gateways, focusing on low-latency routing, fault tolerance, and horizontal scalability. Validated performance at 10K+ RPS and 1M+ requests under stress.",
    icon: Server,
    color: "from-blue-500 to-cyan-400",
    borderColor: "border-blue-500/20",
    glowColor: "rgba(59,130,246,0.12)",
    accentColor: "#3b82f6",
    githubUrl: "https://github.com/lekhrocks/router-service",
    tags: ["Java 21", "Spring Boot 3.5", "Docker", "WebSockets", "Prometheus"],
    highlights: [
      "Regex-based routing rules with Round Robin, Random, and Least Connections load balancing",
      "Resilience patterns: circuit breakers, retries with exponential backoff, token-bucket rate limiting",
      "Real-time metrics streaming via WebSockets with live traffic monitoring dashboard",
      "Full observability: Spring Actuator, Prometheus metrics, centralized logging",
      "JVM optimized with multi-stage Docker builds; validated at 10K+ RPS and 1M+ requests",
    ],
    metrics: [
      { label: "Max RPS", value: "10K+" },
      { label: "Latency", value: "<5ms" },
      { label: "Stress Test", value: "1M+ req" },
    ],
    architectureId: "router",
  },
  {
    id: "chat",
    title: "Real-Time Chat & File-Sharing",
    subtitle: "Production-Ready Backend with WebSockets + AWS S3",
    description:
      "Scalable, secure real-time chat and file-sharing backend with JWT authentication, RBAC, antivirus scanning, persistent notifications, and full observability stack.",
    icon: MessageSquare,
    color: "from-purple-500 to-pink-400",
    borderColor: "border-purple-500/20",
    glowColor: "rgba(139,92,246,0.12)",
    accentColor: "#8b5cf6",
    githubUrl: "https://github.com/lekhrocks/realtime-chat",
    tags: ["Java 21", "Spring Boot 3.x", "GraphQL", "WebSockets", "AWS S3", "Docker", "Flyway"],
    highlights: [
      "JWT-based authentication, role-based access control (RBAC), and email verification",
      "Real-time messaging via WebSockets; GraphQL API for flexible client queries",
      "S3-backed file management with antivirus scanning, admin dashboard",
      "Persistent notifications, user preferences, Prometheus observability",
      "Automated DB migrations with Flyway and full CI/CD pipelines",
    ],
    metrics: [
      { label: "Auth", value: "JWT+RBAC" },
      { label: "Storage", value: "AWS S3" },
      { label: "API", value: "GraphQL" },
    ],
    architectureId: "chat",
  },
  {
    id: "ecommerce",
    title: "E-Commerce Backend",
    subtitle: "Production-Ready RESTful Platform with Stripe Payments",
    description:
      "Full-featured e-commerce backend with user authentication, product/category management, cart/order workflows, and Stripe payment integration. Clean layered architecture with Swagger docs.",
    icon: ShoppingCart,
    color: "from-green-500 to-emerald-400",
    borderColor: "border-green-500/20",
    glowColor: "rgba(16,185,129,0.12)",
    accentColor: "#10b981",
    githubUrl: "https://github.com/lekhrocks/Ecommerce_BE",
    tags: ["Java 11", "Spring Boot 2.7", "Spring Data JPA", "MySQL", "Stripe", "Swagger"],
    highlights: [
      "Secure token-based authentication with robust validation and standardized error handling",
      "Product catalog, category management, cart and order workflow APIs",
      "Stripe-based payment processing integration",
      "Layered architecture (Controller–Service–Repository) with clean separation of concerns",
      "Comprehensive API documentation with Swagger",
    ],
    metrics: [
      { label: "Payment", value: "Stripe" },
      { label: "DB", value: "MySQL" },
      { label: "Docs", value: "Swagger" },
    ],
    architectureId: "ecommerce",
  },
];

function ProjectCard({ project, index, isInView }: {
  project: Project;
  index: number;
  isInView: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = project.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.15 }}
      style={{ perspective: 1500 }}
    >
    <TiltCard
      maxTilt={5}
      scale={1.01}
      glare
      className={`glass glass-hover rounded-2xl border ${project.borderColor} p-6 relative overflow-hidden group`}
      style={{ boxShadow: `0 0 40px ${project.glowColor}` }}
    >
      {/* BG Glow */}
      <div
        className={`absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br ${project.color} opacity-5 blur-3xl group-hover:opacity-10 transition-opacity pointer-events-none`}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
            style={{ boxShadow: `0 0 15px ${project.glowColor}` }}
          >
            <Icon size={18} className="text-white" />
          </div>
          <div>
            <h3
              className={`font-bold text-base bg-gradient-to-r ${project.color} bg-clip-text text-transparent`}
            >
              {project.title}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">{project.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg glass border border-white/8 text-slate-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <GithubIcon size={15} />
          </motion.a>
          <motion.a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg glass border border-white/8 text-slate-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ExternalLink size={15} />
          </motion.a>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.description}</p>

      {/* Metrics Row */}
      <div className="flex gap-3 mb-4">
        {project.metrics.map((m) => (
          <div
            key={m.label}
            className="flex-1 glass rounded-xl p-2.5 text-center border border-white/5"
          >
            <div
              className={`text-sm font-bold font-mono bg-gradient-to-r ${project.color} bg-clip-text text-transparent`}
            >
              {m.value}
            </div>
            <div className="text-slate-600 text-xs mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Expandable Highlights */}
      <AnimatePresence>
        {expanded && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1.5 mb-4 overflow-hidden"
          >
            {project.highlights.map((h, j) => (
              <motion.li
                key={j}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: j * 0.05 }}
                className="flex items-start gap-2 text-slate-400 text-xs"
              >
                <span
                  className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: project.accentColor }}
                />
                {h}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Expand Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-4"
      >
        {expanded ? (
          <>
            <ChevronUp size={13} /> Less details
          </>
        ) : (
          <>
            <ChevronDown size={13} /> More details
          </>
        )}
      </button>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full text-xs font-mono glass border border-white/8 text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Architecture Link */}
      {project.architectureId && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <button
            onClick={() => {
              const el = document.getElementById("architecture");
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
            }}
            className={`flex items-center gap-1.5 text-xs font-medium bg-gradient-to-r ${project.color} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
          >
            <ExternalLink size={12} style={{ color: project.accentColor }} />
            View System Architecture Diagram →
          </button>
        </div>
      )}
    </TiltCard>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="section-padding">
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
            04 / Projects
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-title text-white mb-4"
          >
            Featured Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 max-w-xl mx-auto"
          >
            Production-grade systems built with performance and reliability as first principles
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

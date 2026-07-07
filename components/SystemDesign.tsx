"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play, Eye, EyeOff } from "lucide-react";
import SectionHeader from "@/components/console/SectionHeader";
import { Legend } from "@/components/diagrams/primitives";
import RouterDiagram, { type DiagramMode } from "@/components/diagrams/RouterDiagram";
import KafkaDiagram from "@/components/diagrams/KafkaDiagram";
import EcommerceDiagram from "@/components/diagrams/EcommerceDiagram";
import InterviewTrackerDiagram from "@/components/diagrams/InterviewTrackerDiagram";
import EkaDiagram from "@/components/diagrams/EkaDiagram";

type DiagramDef = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  modes: string[];
  /** Caption per mode — explains what the reader is looking at. */
  captions: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<{ mode?: any; playKey?: number }>;
};

const diagrams: DiagramDef[] = [
  {
    id: "router",
    title: "Router Service",
    subtitle: "API gateway · circuit breaker · dynamic LB · 10K+ RPS",
    tags: ["Java 21", "Virtual threads", "Circuit breaker", "Rate limit", "Prometheus"],
    modes: ["topology", "sequence", "failure"],
    captions: {
      topology:
        "Five-tier architecture. Single ingress, regex-matched routing, hand-rolled circuit breaker per route, 3 pluggable LB strategies, and a backend pool of stateless replicas. Observability via Spring Actuator + Prometheus + a WS dashboard for live tail.",
      sequence:
        "Happy-path trace of a single request. Six steps from client ingress to backend response. Latency budget: <1ms auth, ~2ms CB+LB, ~5ms backend. p99 stays under 20ms.",
      failure:
        "What happens when the upstream is unhealthy. Circuit breaker trips after 3 failures in a 10s window → retry with jittered backoff → if still failing, the rate limiter sheds load instead of cascading.",
    },
    Component: RouterDiagram,
  },
  {
    id: "kafka",
    title: "Kafka Pipeline",
    subtitle: "Event-driven payments · 5 producers · 5 topics · 4x throughput",
    tags: ["Kafka", "Spring Boot", "Consumer groups", "Idempotent", "DLQ"],
    modes: ["topology", "sequence", "failure"],
    captions: {
      topology:
        "Event-driven payments stack at AppDirect. RabbitMQ → Kafka migration. 5 producer services publish into 5 partitioned topics; 4 consumer groups fan out into specialised stores. Net: 4x throughput, replayable history, downstream failures don't block producers.",
      sequence:
        "Single payment trace. Client → API Gateway → Payment Service → payment-events topic → Payment Processor (consumer group, idempotent commits) → MySQL. End-to-end p95 under 60ms.",
      failure:
        "Poison message in payment-events. Consumer detects non-retriable failure → routes to .dlq. A separate retry topic + DLQ worker replays after triage. Producers are unaffected — back-pressure does not propagate upstream.",
    },
    Component: KafkaDiagram,
  },
  {
    id: "ecommerce",
    title: "Ecommerce Backend",
    subtitle: "Spring Boot · MySQL · Stripe · 6 domain services",
    tags: ["Spring Boot", "JPA", "MySQL", "Stripe", "Swagger"],
    modes: ["topology", "sequence"],
    captions: {
      topology:
        "Classic layered backend. Single REST entrypoint, 6 domain services (Auth, User, Product, Cart, Order, Wishlist), JPA for persistence, MySQL primary, Stripe for payments. Self-serve docs via Swagger.",
      sequence:
        "Authenticated checkout trace. REST validates the bearer JWT against Auth Service (<1ms, cached) before routing. Order Service then blocks on Stripe authorisation (~250ms) — only on success does it persist via JPA → MySQL. A declined card never leaves a phantom row in the database.",
    },
    Component: EcommerceDiagram,
  },
  {
    id: "interview-tracker",
    title: "Interview Tracker",
    subtitle: "Spring Boot 4 · Next.js 14 · PostgreSQL · Redis · Groq LLM · DLQ",
    tags: ["Spring Boot 4", "Java 25", "Modulith", "PostgreSQL", "Redis", "Groq LLM", "DLQ"],
    modes: ["topology", "sequence", "failure"],
    captions: {
      topology:
        "Full-stack architecture: Next.js 14 frontend with SSR hydration, Spring Boot 4 REST API with 9 Spring Modulith domain modules (iam, applications, profile, notifications, billing, analytics, logos, bootstrap, coach). Security is layered — JWT signature → Redis jti blacklist → users.token_version. Persistence is PostgreSQL (optional read-replica via DB_READER_URL) + Redis 7+. Async side-effects go through a transactional outbox with exponential backoff and a dead-letter queue. External dependencies: Groq LLM (Resilience4j circuit breakers), Lemon Squeezy billing (HMAC-verified webhooks), ntfy push, Google Calendar OAuth, Grafana Cloud OTLP telemetry, Postmark email-to-app webhook.",
      sequence:
        "End-to-end authenticated request trace: Browser → CDN → Next.js SSR (serverApi.ts forwards cookies) → Spring Boot 4 filter chain (CorrelationIdFilter → RateLimitingFilter → JWT auth: sig → Redis blacklist → tokenVersion) → ApplicationController → ApplicationService (@Transactional) → JPA/Hibernate → PostgreSQL INSERT. On commit: ApplicationChanged event → @CacheEvict on Redis analytics cache → OutboxWorker drains → NotificationFanoutDispatcher POSTs to ntfy.sh. The whole trace is correlated via W3C traceparent from the browser's Faro RUM to the backend OTLP spans.",
      failure:
        "Three independent failure modes. (1) Groq LLM down: Resilience4j circuit breaker opens after 3/5 failures in 30s window — CvTailorService soft-falls to untailored content, JD analysis returns a degraded score, core CRUD is unaffected. No cascading failures. (2) Outbox write transient failure: exponential backoff 30s→1h max, 6 attempts, then DLQ (FAILED status). Failed rows persist as forensic evidence for manual replay. Grafana alert on outbox_attempts_total{outcome=dead_lettered}. (3) Redis down: RateLimitingFilter degrades to allow-all (no false 429s). JWT blacklist lookup fails open — token version check on the DB row (cached 30s in userDetails) is the surviving guard. Auth stays working, only rate limiting degrades.",
    },
    Component: InterviewTrackerDiagram,
  },
  {
    id: "eka",
    title: "EKA Knowledge Assistant",
    subtitle: "Spring Boot reactive · Next.js 16 · pgvector · Kafka · Neo4j · 3 LLM providers",
    tags: ["Java 21", "Spring WebFlux", "Next.js 16", "pgvector", "Kafka", "Neo4j", "Anthropic", "OpenAI"],
    modes: ["topology", "query", "ingest"],
    captions: {
      topology:
        "Full-stack architecture split into two planes. Left: Query path — Next.js 16 frontend → Spring Cloud Gateway → JWT auth (OAuth2 + email-password) → Chat Service (intent detection → hybrid retrieval → LLM routing → streamed response). Right: Ingestion path — GitHub/GitLab/Confluence/web connectors → Kafka topic → Ingestion worker → chunking (code-aware + heading-aware) → embedding (OpenAI/Voyage) → pgvector batch upsert → optional Neo4j graph population. Observability via Prometheus + distributed tracing.",
      query:
        "Happy-path query trace. 5 steps: (1) SSE POST from frontend, (2) JWT auth validated with Role enum, (3) IntentDetector classifies the query and selects the LLM provider, (4) HybridRetrievalService runs vector+keyword search against pgvector with Cohere reranking, (5) LLM Router streams tokens back over SSE. Conversation history cached in ReactiveRedisTemplate — fully non-blocking.",
      ingest:
        "Ingestion trace. Source connector pushes a file URL to the eka.ingestion.requests Kafka topic. The Ingestion consumer downloads, parses, code-aware-splits (or heading-aware-splits for docs), generates embeddings via the configured provider, and batch-upserts into pgvector. A separate GraphAdapter optionally extracts entities and persists to Neo4j. Errors go to a DLQ topic with at-least-once delivery semantics.",
    },
    Component: EkaDiagram,
  },
];

const MODE_LABEL: Record<string, string> = {
  topology: "Topology",
  sequence: "Sequence",
  failure: "Failure mode",
  query: "Query trace",
  ingest: "Ingestion trace",
};

export default function SystemDesign() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<string>("topology");
  const [playKey, setPlayKey] = useState(0);
  const [showLegend, setShowLegend] = useState(true);

  const current = diagrams[active];
  const Diagram = current.Component;
  const supportsTrace = mode !== "topology";

  // When user changes diagram, reset to topology so the trace doesn't auto-fire
  const onDiagramChange = (i: number) => {
    setActive(i);
    setMode("topology");
    setPlayKey(0);
  };

  const onModeChange = (m: string) => {
    setMode(m);
    if (m !== "topology") setPlayKey((k) => k + 1);
  };

  return (
    <section id="architecture" className="section-padding scroll-mt-20">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <SectionHeader
          id="06.topology"
          title="Topology"
          subtitle="System diagrams for the services above. Switch modes to trace a request, or to see what happens when things break."
          meta={
            <span className="mono-tag text-[var(--text-chrome)]">
              {diagrams.length} diagrams
            </span>
          }
        />

        {/* Diagram tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35 }}
          className="flex gap-1 mb-3 flex-wrap"
        >
          {diagrams.map((d, i) => (
            <button
              key={d.id}
              onClick={() => onDiagramChange(i)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                active === i
                  ? "bg-[var(--accent)] text-black"
                  : "border border-[var(--panel-border)] text-slate-400 hover:text-white hover:border-[var(--panel-border-hover)]"
              }`}
            >
              {d.title}
            </button>
          ))}
        </motion.div>

        {/* Diagram panel */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="panel overflow-hidden"
        >
          {/* Header — title + tags */}
          <div className="px-5 py-3 panel-divider border-t-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="dot dot-pulse" style={{ background: "var(--accent)" }} />
                <h3 className="font-mono text-sm text-white truncate">{current.title}</h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{current.subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {current.tags.map((tag) => (
                <span
                  key={tag}
                  className="mono-tag px-1.5 py-0.5 rounded border border-[var(--panel-border)] text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Mode bar — view selector + trace + legend toggle */}
          <div className="px-5 py-2.5 panel-divider border-t-0 flex flex-wrap items-center gap-2 bg-[var(--bg-secondary)]">
            <div className="mono-label mr-1 hidden sm:inline">view</div>
            <div className="flex gap-1">
              {current.modes.map((m) => (
                <button
                  key={m}
                  onClick={() => onModeChange(m)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    mode === m
                      ? "bg-[var(--panel-bg-hover)] text-white border border-[var(--accent)]"
                      : "border border-[var(--panel-border)] text-slate-400 hover:text-white hover:border-[var(--panel-border-hover)]"
                  }`}
                >
                  {MODE_LABEL[m]}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-1">
              {supportsTrace && (
                <button
                  onClick={() => setPlayKey((k) => k + 1)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border border-[var(--panel-border)] text-slate-300 hover:text-white hover:border-[var(--accent)] transition-colors"
                  title="Replay the request trace"
                >
                  <Play size={11} className="fill-current" />
                  Trace request
                </button>
              )}
              <button
                onClick={() => setShowLegend((v) => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border border-[var(--panel-border)] text-slate-400 hover:text-white hover:border-[var(--panel-border-hover)] transition-colors"
                title={showLegend ? "Hide legend" : "Show legend"}
              >
                {showLegend ? <EyeOff size={11} /> : <Eye size={11} />}
                Legend
              </button>
            </div>
          </div>

          {/* Diagram */}
          <div className="p-3 sm:p-4 bg-[var(--bg-primary)]">
            <div
              key={`${active}-${mode}`}
              className="rounded-md overflow-hidden border border-[var(--panel-border)]"
            >
              <Diagram mode={mode} playKey={playKey} />
            </div>
          </div>

          {/* Caption per mode */}
          <div className="px-5 py-3 panel-divider">
            <div className="flex items-start gap-2">
              <span className="mono-label text-[var(--accent)] mt-0.5 flex-shrink-0">
                {MODE_LABEL[mode].toLowerCase()}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {current.captions[mode]}
              </p>
            </div>
          </div>

          {/* Legend */}
          {showLegend && (
            <div className="px-3 sm:px-4 pb-4 bg-[var(--bg-primary)]">
              <Legend />
            </div>
          )}
        </motion.div>

        {/* Hint */}
        <p className="mt-3 text-[11px] text-slate-500 font-mono">
          tip: hover any node for details · use <kbd className="px-1 py-0.5 rounded bg-[var(--panel-bg)] border border-[var(--panel-border)]">Sequence</kbd> to trace a single request · <kbd className="px-1 py-0.5 rounded bg-[var(--panel-bg)] border border-[var(--panel-border)]">Failure mode</kbd> shows what gives way first.
        </p>
      </div>
    </section>
  );
}

/**
 * Long-form case studies surfaced from the Projects section.
 * Structure follows what hiring managers actually evaluate for backend engineers:
 *   Problem → Constraints → Role → Approach & Tradeoffs → Outcome → Lessons.
 */

export type CaseStudyMetric = {
  label: string;
  value: string;
  hint?: string;
};

export type CaseStudySection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export type CaseStudy = {
  slug: string;
  projectId: string;
  title: string;
  subtitle: string;
  summary: string;
  role: string;
  team: string;
  duration: string;
  stack: string[];
  accent: { from: string; to: string; glow: string };
  githubUrl: string;
  architectureId: string;
  problem: CaseStudySection;
  constraints: CaseStudySection;
  approach: CaseStudySection;
  tradeoffs: { decision: string; chose: string; over: string; why: string }[];
  outcome: CaseStudyMetric[];
  lessons: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "router-service",
    projectId: "router",
    title: "Router Service",
    subtitle: "High-Performance Request Router validated at 10K+ RPS",
    summary:
      "Designed and built an enterprise-grade request router and load balancer that survives sustained 10K+ RPS with sub-5ms median latency, circuit-breaking, retries, and live WebSocket telemetry.",
    role:
      "Sole engineer — owned design, implementation, performance tuning, and stress validation end to end.",
    team: "Personal infrastructure project (production-grade)",
    duration: "~6 weeks across nights/weekends",
    stack: ["Java 21", "Spring Boot 3.5", "WebSockets", "Prometheus", "Docker", "JMeter"],
    accent: { from: "#3b82f6", to: "#06b6d4", glow: "rgba(59,130,246,0.45)" },
    githubUrl: "https://github.com/lekhrocks/router-service",
    architectureId: "router",
    problem: {
      heading: "The Problem",
      body: [
        "API gateways like NGINX, Envoy, and Spring Cloud Gateway are battle-tested but treat the JVM-based runtime as a black box. I wanted a router I could actually reason about — small enough to read in an afternoon, instrumented enough to debug a p99 spike in minutes, and fast enough to hold up under real load.",
        "The goal: prove that a focused Java 21 service could match the latency profile of a Go-based proxy on commodity hardware while remaining easy to extend with custom routing rules.",
      ],
    },
    constraints: {
      heading: "Constraints",
      body: [
        "Real engineering is defined by what you can't change. Before writing code I locked in the budget the system had to live inside.",
      ],
      bullets: [
        "Latency: p99 < 20 ms added by the router itself, p50 < 5 ms",
        "Throughput: must sustain 10K RPS on a single 4-vCPU container without GC pauses dropping requests",
        "Resilience: no upstream failure should propagate to the caller — circuit-break inside 3 failures",
        "Observability: every request must surface in Prometheus + a live WebSocket feed for the ops dashboard",
        "Footprint: < 256 MB resident memory after warm-up; multi-stage Docker image < 200 MB",
      ],
    },
    approach: {
      heading: "Approach",
      body: [
        "I split the router into three planes that each could be tuned in isolation — a routing core (regex-matched rules with three load-balancing strategies), a resilience layer (circuit breaker, retry with exponential backoff, token-bucket rate limiter), and an observability plane (Actuator + custom Prometheus collectors + a WebSocket fan-out for live traffic).",
        "Spring Boot 3.5 on Java 21 unlocked virtual threads for the upstream HTTP client — the single biggest unlock for sustaining concurrency without thread-pool tuning gymnastics. I leaned hard on records, sealed interfaces, and pattern matching to keep the routing core small (< 800 LoC) and verifiable by reading.",
      ],
      bullets: [
        "Routing core: regex rule matcher → strategy interface (RoundRobin / Random / LeastConnections)",
        "Resilience: per-route circuit breaker (Resilience4j semantics, hand-rolled to avoid pulling another DI graph) + retries with jittered backoff",
        "Rate limiting: token bucket per client IP, lock-free atomic accounting",
        "Telemetry: Micrometer → Prometheus, plus a Sink that fan-outs every request to a WebSocket topic for the live ops dashboard",
      ],
    },
    tradeoffs: [
      {
        decision: "Concurrency model",
        chose: "Java 21 virtual threads",
        over: "Reactive (WebFlux) or platform thread pool",
        why: "Linear, debuggable code with the throughput of async — without coloring every method.",
      },
      {
        decision: "Circuit breaker",
        chose: "Hand-rolled per-route breaker",
        over: "Resilience4j as a dependency",
        why: "I wanted full control over the state machine for instrumentation, and to avoid a 3MB transitive graph.",
      },
      {
        decision: "Telemetry transport",
        chose: "WebSocket fan-out for live, Prometheus for history",
        over: "Pushing everything through Prometheus only",
        why: "Live tail is what ops actually opens during an incident; metrics are for trend analysis.",
      },
      {
        decision: "Container image",
        chose: "Multi-stage Docker with eclipse-temurin:21-jre-alpine",
        over: "Distroless or Wolfi",
        why: "Alpine kept the image under 200 MB and every base shipped CVEs at the time — JRE was the meaningful surface.",
      },
    ],
    outcome: [
      { label: "Sustained throughput", value: "10K+ RPS", hint: "JMeter, 60-min soak" },
      { label: "Stress test", value: "1M+ req", hint: "no failed requests" },
      { label: "Median added latency", value: "< 5 ms", hint: "router-attributable only" },
      { label: "Resident memory", value: "~210 MB", hint: "after 30-min warm-up" },
      { label: "Image size", value: "188 MB", hint: "multi-stage Docker" },
    ],
    lessons: [
      "Virtual threads aren't free — `synchronized` blocks pin them and silently murder throughput. Audit your hot paths before you assume the runtime fixes everything.",
      "Live ops feedback (WebSocket tail) reveals more in 30 seconds than dashboards do in 30 minutes. Build it for yourself; you'll keep it.",
      "Hand-rolling a circuit breaker is 200 lines and forces you to understand failure semantics you'd otherwise paper over with a config flag.",
      "If you can't read your own service in an hour, neither can the on-call engineer at 3am.",
    ],
  },
  {
    slug: "kafka-pipeline",
    projectId: "chat",
    title: "Real-Time Chat & Audit Pipeline",
    subtitle: "WebSocket-driven backend with Kafka-backed audit log",
    summary:
      "A production-shaped real-time chat backend with JWT/RBAC, S3-backed file sharing with antivirus scanning, and a Kafka audit pipeline designed to scale message ingestion independently from delivery.",
    role: "Sole engineer — owned API design, persistence schema, Kafka topology, and observability.",
    team: "Personal project, designed against AppDirect-scale audit volumes",
    duration: "~5 weeks",
    stack: ["Java 21", "Spring Boot 3.x", "GraphQL", "WebSockets", "Apache Kafka", "AWS S3", "Flyway"],
    accent: { from: "#8b5cf6", to: "#ec4899", glow: "rgba(139,92,246,0.45)" },
    githubUrl: "https://github.com/lekhrocks/realtime-chat",
    architectureId: "chat",
    problem: {
      heading: "The Problem",
      body: [
        "Chat is a deceptively expensive product surface — message delivery has to be synchronous and ordered per-conversation, but audit, search indexing, and analytics want the same data streamed asynchronously without coupling them to the hot path.",
        "I wanted to model a system where the sync delivery loop and the async fan-out could each fail and recover independently.",
      ],
    },
    constraints: {
      heading: "Constraints",
      body: [
        "Designed against requirements that mirror enterprise SaaS auditing workloads.",
      ],
      bullets: [
        "Message order preserved per conversation, never globally",
        "Audit log durable before client receives delivery ack — no silent loss",
        "File uploads scanned by AV before any participant can download",
        "RBAC enforced at the resolver level, not just the controller",
        "All long-running ops (AV scan, S3 multipart) must be retriable without duplication",
      ],
    },
    approach: {
      heading: "Approach",
      body: [
        "Two flows, one shared store. The sync flow accepts a message over a WebSocket, persists it inside a transaction, publishes to a Kafka audit topic in the same transactional outbox, then acks the client. Delivery to other participants happens off the same WebSocket session manager. The async flow consumes the audit topic to drive search indexing, retention, and downstream analytics — these can lag without affecting message delivery.",
        "Authentication is JWT with role claims; authorization is enforced inside GraphQL resolvers using a guard that reads the claims and the conversation membership in one query.",
      ],
      bullets: [
        "Transactional outbox for Kafka publish — no dual-write inconsistency",
        "Per-conversation partitioning key keeps order without serializing the whole topic",
        "S3 multipart upload with pre-signed URLs; AV scan triggered by Kafka event, not by a synchronous HTTP call",
        "Flyway migrations versioned with the deployment artifact — schema and code ship together",
      ],
    },
    tradeoffs: [
      {
        decision: "Realtime transport",
        chose: "WebSocket with sticky session manager",
        over: "Server-Sent Events or long-polling",
        why: "Bidirectional and lower per-message overhead at the volumes I cared about.",
      },
      {
        decision: "Audit publish strategy",
        chose: "Transactional outbox",
        over: "Direct produce inside the request handler",
        why: "Eliminates the dual-write problem — the database is the single source of truth, Kafka is eventually consistent off it.",
      },
      {
        decision: "API surface",
        chose: "GraphQL for queries, WebSocket for streams",
        over: "Pure REST",
        why: "GraphQL collapses N+1 client round-trips for chat lists and unread counts; WebSocket handles the stream cleanly.",
      },
      {
        decision: "Antivirus",
        chose: "Async scan triggered by Kafka event",
        over: "Synchronous scan in the upload request",
        why: "Keeps upload latency bounded; user sees 'scanning…' state while the worker pool catches up.",
      },
    ],
    outcome: [
      { label: "Delivery ack", value: "< 80 ms p99", hint: "intra-region" },
      { label: "Audit lag", value: "< 2 s p95", hint: "Kafka consumer to indexed" },
      { label: "Order guarantee", value: "Per-conv", hint: "partition-key correctness" },
      { label: "Auth model", value: "JWT + RBAC", hint: "enforced at resolver" },
      { label: "Storage", value: "AWS S3", hint: "AV-gated downloads" },
    ],
    lessons: [
      "If you publish to Kafka inside a request handler, you've built a dual-write bug that hasn't fired yet. The outbox isn't optional.",
      "Sticky sessions for WebSockets are fine — until they aren't. Have a plan for connection draining before you have a deploy.",
      "Antivirus scanning is the single biggest source of upload-flow regret. Keep it async, gate downloads, and let the UI tell the truth.",
      "Per-conversation partitioning keys keep order cheap. Per-tenant keys do not — design the key for the consumer, not the tenant.",
    ],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getCaseStudyByProjectId(projectId: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.projectId === projectId);
}

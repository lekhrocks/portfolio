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
  {
    slug: "interview-tracker-api",
    projectId: "interview-tracker-api",
    title: "Interview Tracker API",
    subtitle: "Production-grade Spring Boot 4 / Java 25 REST API for job-seekers",
    summary:
      "Designed and built a full-featured job-search backend covering applications, interview rounds, AI CV tailoring, Pro-tier billing, TOTP + WebAuthn 2FA, calendar feeds, and a Spring Modulith domain model — backed by a transactional outbox with DLQ, ShedLock distributed scheduling, HikariCP connection pooling with read-replica routing, Redis-backed rate limiting with SPI-based tier flex, and Grafana OTLP observability. Delivered with zero-downtime Flyway migrations and ≥55% line coverage.",
    role:
      "Sole engineer — owned domain modelling, security architecture, database schema, AI integration, billing pipeline, and testing strategy end to end.",
    team: "Personal full-stack project (production-grade)",
    duration: "~14 weeks across nights/weekends",
    stack: [
      "Java 25", "Spring Boot 4", "Spring Framework 7", "Spring Modulith",
      "PostgreSQL", "Redis", "Flyway", "Spring AI (Groq)", "Spring Security 7",
      "WebAuthn", "JWT (jjwt)", "Resilience4j", "Apache PDFBox 3",
      "Lemon Squeezy", "Stripe", "ShedLock", "HikariCP",
      "Docker", "Grafana Cloud (OTLP)", "JUnit 5", "Testcontainers",
    ],
    accent: { from: "#10b981", to: "#3b82f6", glow: "rgba(16,185,129,0.45)" },
    githubUrl: "https://github.com/lekhrocks/interview-tracker-backend",
    architectureId: "interview-tracker-api",
    problem: {
      heading: "The Problem",
      body: [
        "Job searching is genuinely hard to track at scale — dozens of applications, multiple interview rounds per company, follow-up reminders, and a need to measure conversion funnel quality over time. Existing tools either lack depth (spreadsheets) or lock important features behind expensive paywalls without the flexibility to self-host.",
        "I wanted to build the backend I would actually use: one that modelled the full job-search lifecycle, exposed a clean REST API the frontend could consume, and demonstrated the kind of architecture a senior backend role would expect — domain isolation, observable failure modes, zero-downtime deployments, and a credible security model.",
      ],
    },
    constraints: {
      heading: "Constraints",
      body: [
        "Production-grade means accepting the same constraints a real team would impose before going live.",
      ],
      bullets: [
        "Zero-downtime schema evolution: every Flyway migration must be backward-compatible with the previous image still running (rolling-deploy policy enforced by a custom Gradle lint task)",
        "Domain isolation: Spring Modulith ArchUnit gate — cross-module imports outside declared allowedDependencies fail the build",
        "Auth hardness: HttpOnly-cookie JWTs, per-token Redis blacklist, token-version bulk revocation, TOTP + WebAuthn as second factors",
        "AI guardrails: CV tailoring via Groq LLM must never fabricate employers, skills, or dates — four enforced filter layers",
        "Billing correctness: webhook idempotency on (provider, event_id); 402 → PaywallError pipeline all the way to the UI modal",
        "Test gate: ≥55% line coverage enforced by JaCoCo in every CI run; Testcontainers Postgres for PG-specific repository tests",
        "Minimal external dependency: core CRUD (create, read, update, delete) survives Groq LLM, Redis, and ntfy.sh outages — degradation paths for each are load-bearing, not aspirational",
      ],
    },
    approach: {
      heading: "Approach",
      body: [
        "I structured the codebase as nine Spring Modulith domain modules — iam, applications, profile, notifications, billing, analytics, logos, bootstrap, and the AI sub-modules (coach, coverletter) — each with an explicit allowedDependencies declaration. ArchUnit validates the dependency graph on every build; any accidental cross-module coupling fails the test suite before it reaches review.",
        "Security is layered in order of cost: JWT signature + expiry (in-process, zero network), Redis token blacklist (O(1) SET lookup), then users.token_version comparison (DB row, cached 30s). This means a single-session revoke hits only Redis, while a 'logout all devices' bumps the version column and invalidates everything instantly without enumerating tokens.",
        "The AI pipeline uses Spring AI's OpenAI-compatible client pointed at Groq. Four guardrails enforce the no-fabrication promise: only summary, skill order, and per-role/project bullets are LLM-rewriteable; skill output is intersected with the user's real skill list; experience bullet rewrites are accepted only when keyed to a real experience ID; the service fails soft (returns base content) if Groq is down.",
      ],
      bullets: [
        "9 domain modules with ArchUnit-enforced isolation; named interfaces for cross-module SPI (iam::security, profile::dto)",
        "Three-layer auth: JWT sig → Redis blacklist → token_version column; Spring Security 7 resource-server adapters replace hand-rolled filter",
        "Transactional outbox (V15) + Spring Modulith @ApplicationModuleListener for durable async delivery (password-reset emails, magic-link emails)",
        "41 Flyway migrations with zero-downtime policy: CONCURRENTLY indexes in separate files, nullable-before-constrained pattern, Gradle lint gate",
        "Resilience4j circuit breakers on every outbound HTTP client (LLM, ntfy, logo CDN, job-link import); same @HttpExchange declarative interface pattern throughout",
        "Rate limiting: sliding-window Redis counters per user; jd-analysis-daily bucket shared across three endpoints via matching policy name",
        "Transactional outbox with DLQ: outbox_messages table (V15) drained via FOR UPDATE SKIP LOCKED with exponential backoff (30 s → 1 h max, 6 attempts → FAILED / DLQ). Micrometer counters (outbox.attempts: dead_lettered/retried/dispatched) alert in Grafana",
        "HikariCP connection pool (configurable, default 50) with virtual-thread-awareness. Optional read-replica routing via DB_READER_URL — @Transactional(readOnly=true) queries route to the reader pool through ReadOnlyRoutingDataSource + LazyConnectionDataSourceProxy",
        "ShedLock distributed scheduling: ReminderScheduler, OutboxWorker, OutboxCleanupScheduler, and CacheRefreshScheduler all guarded by ShedLock so multi-pod deploys never double-fire",
        "Cache stampede prevention: HotKeys tracks every userDetails cache access; CacheRefreshScheduler pre-refreshes hot entries at 25 s before the 30 s TTL expires. SubscriptionService uses ConcurrentHashMap<…, CompletableFuture<>> for in-flight request coalescing on tier cache misses",
        "BillingProvider SPI: Lemon Squeezy is the default merchant of record; swapping to Stripe requires zero controller changes — implement the BillingProvider interface and re-deploy. RateLimitOverride SPI (iam::security named interface) lets billing flex per-user rate limits: 3/day FREE → 50/day PRO for jd-analysis-daily",
        "Virtual threads everywhere: spring.threads.virtual.enabled=true on JDK 25. A bounded llmExecutor (ThreadPoolTaskExecutor) handles Groq AI calls (virtual threads can't block on long-running LLM responses without pinning); Tomcat request threads use virtual threads natively",
        "Frontend telemetry correlation: the browser's Grafana Faro RUM sends a W3C traceparent header on every API call; the backend's Micrometer OTLP exporter joins browser→backend→Groq LLM spans into the same trace ID",
      ],
    },
    tradeoffs: [
      {
        decision: "Module boundaries",
        chose: "Spring Modulith with ArchUnit build gate",
        over: "Informal package conventions or separate microservices",
        why: "ArchUnit makes the dependency graph a compile-time contract — drift is caught in CI, not in code review. Separate services would multiply deployment and network overhead for a single-developer project.",
      },
      {
        decision: "Token revocation",
        chose: "Redis blacklist (per-token) + token_version bump (bulk)",
        over: "Short-lived tokens only or session table polling",
        why: "Two different questions: 'kill this one token' and 'kill everything'. One Redis key handles the first in O(1); one DB column increment handles the second without enumerating sessions.",
      },
      {
        decision: "AI CV tailoring",
        chose: "Four-layer guardrail filter in CvTailorService",
        over: "Trusting LLM output or post-hoc human review",
        why: "Users will share AI-generated CVs with employers. Fabricated skills or employers are a legal and reputational risk; the filter is the only way to make the no-fabrication promise load-bearing.",
      },
      {
        decision: "Billing webhook idempotency",
        chose: "Persist raw payload first, then process; unique on (provider, event_id)",
        over: "Process then discard or rely on provider deduplication",
        why: "Lemon Squeezy retries non-2xx. Storing the payload before any state change means bugs are replayable locally and the endpoint always returns 200 — we never burn through retry budgets on transient failures.",
      },
      {
        decision: "Async side-effect delivery",
        chose: "Transactional outbox (dual-write avoidance) + DLQ",
        over: "Inline HTTP POST inside @Transactional or @TransactionalEventListener only",
        why: "The outbox pattern is the only thing that survives a JVM crash between commit and the listener run. Spring's @TransactionalEventListener runs in-process — a crash after commit but before the email sends means the event is lost. The outbox row is in the same DB transaction as the domain write; if the DB committed, the outbox row exists. The DLQ (FAILED state) means a broken subscriber doesn't silently drop messages — failed rows are forensic evidence and Grafana alerts on dead_letter_queue_size > 10.",
      },
      {
        decision: "Database connection topology",
        chose: "Single primary pool (HikariCP, default 50) + optional read-replica via DB_READER_URL",
        over: "Single pool only or full read-replica always on",
        why: "The read-replica is opt-in via an env var — zero overhead when unset. When enabled, @Transactional(readOnly=true) queries route through ReadOnlyRoutingDataSource + LazyConnectionDataSourceProxy; the reader pool has its own HikariCP config. This lets a single deploy morph from single-VM to scaled-reader topology without code changes.",
      },
      {
        decision: "PDF generation",
        chose: "Apache PDFBox 3 with hand-laid text positioning",
        over: "HTML-to-PDF (Flying Saucer / wkhtmltopdf) or iText",
        why: "ATS parsers handle plain-positioned text far better than PDF-from-HTML output. PDFBox 3 was also required for Java 25 bytecode support; 2.x's shaded ASM didn't recognise class major version 69.",
      },
    ],
    outcome: [
      { label: "Domain modules", value: "9 modules", hint: "Spring Modulith, ArchUnit-gated" },
      { label: "DB migrations", value: "41 versions", hint: "zero-downtime Flyway policy" },
      { label: "Auth channels", value: "5 channels", hint: "password, OAuth, magic link, TOTP 2FA, WebAuthn" },
      { label: "Line coverage", value: "≥55%", hint: "JaCoCo gate, CI-enforced" },
      { label: "AI guardrails", value: "4 layers", hint: "skill intersection, experience/project ID whitelist, soft-fail" },
      { label: "Resilience patterns", value: "3 patterns", hint: "outbox+DLQ, circuit breakers, read-replica routing" },
      { label: "Billing providers", value: "2 providers", hint: "Lemon Squeezy + Stripe (swap via SPI)" },
      { label: "SPI extension points", value: "5 SPIs", hint: "BillingProvider, RateLimitOverride, NativePushSender, EmailSender, OutboxDispatcher" },
    ],
    lessons: [
      "ArchUnit build gates are the only way to keep module boundaries honest over time. Code review doesn't catch imports; the compiler does.",
      "Two revocation strategies answer two different questions — don't conflate 'kill this session' with 'kill everything'. Doing both with one mechanism means doing one of them badly.",
      "The LLM no-fabrication guardrail is load-bearing, not aspirational. Without the skill intersection and ID whitelist, the first edge-case Groq response would have shipped a lie onto a real CV.",
      "Zero-downtime migrations are a discipline problem before they are a tooling problem. The Gradle lint task forces the conversation in the PR, not at 2am during a deploy.",
      "Fail-soft on external dependencies (LLM, Google Calendar, ntfy) keeps the core path working when third parties are degraded. Every outbound call has a circuit breaker and a graceful degradation path.",
      "The transactional outbox + DLQ pattern is not optional once a single async side-effect matters. Without it, the 'JVM crashed between commit and listener' gap is real and silent. With it, every failed message is a persistent row you can replay, alert on, and audit — the same observability you'd ask of a queueing system, without adding a queueing system.",
      "A read-replica topology that activates via an env var is cheaper than building for scale from day one and cheaper than a migration later. The code has the seam; the deployment doesn't pay for it until the seam is needed.",
      "SPIs beat feature flags for provider swaps. A BillingProvider interface means Lemon Squeezy → Stripe is a new implementation class, not a config toggle that both providers' code paths have to live under.",
    ],
  },
  {
    slug: "interview-tracker-ui",
    projectId: "interview-tracker-ui",
    title: "Interview Tracker UI",
    subtitle: "Next.js 14 App Router frontend with SSR, Pro paywall, and full auth flows",
    summary:
      "Built the full-stack companion frontend for the Interview Tracker API — App Router with server-side prefetch, drag-and-drop Kanban, recharts analytics, AI JD analysis, TOTP + WebAuthn login, Pro-tier paywall wired to the backend's 402 pattern, and Playwright smoke tests covering the highest-blast-radius flows.",
    role:
      "Sole engineer — owned UX architecture, data-fetching strategy, auth flows, Pro paywall integration, accessibility, and end-to-end test harness.",
    team: "Personal full-stack project (production-grade)",
    duration: "~10 weeks alongside the backend build",
    stack: [
      "Next.js 14 (App Router)", "React 18", "TypeScript", "Tailwind CSS",
      "TanStack Query v5", "react-hook-form", "Zod", "Recharts",
      "Playwright", "Jest + RTL", "jest-axe", "OpenAPI TypeScript codegen",
      "Serwist (PWA)", "WebAuthn (browser)", "qrcode.react",
    ],
    accent: { from: "#f59e0b", to: "#ef4444", glow: "rgba(245,158,11,0.45)" },
    githubUrl: "https://github.com/lekhrocks/interview-tracker",
    architectureId: "interview-tracker-ui",
    problem: {
      heading: "The Problem",
      body: [
        "The API needed a frontend that matched its ambition — not just a CRUD UI, but a product that could demonstrate SSR hydration, a credible auth story (five sign-in channels including WebAuthn passkeys), AI-powered workflows, and a paywall that actually converted rather than just blocked.",
        "The harder constraint was keeping the frontend honest about what it knew. Auth state lives in HttpOnly cookies, never localStorage. The tier query is the only source of truth for Pro vs Free — no localStorage reads, no flash-of-wrong-tier. Every Pro feature must catch the 402 from the API and route it to a single modal, not a toast.",
      ],
    },
    constraints: {
      heading: "Constraints",
      body: [
        "The architecture decisions the backend enforced had direct UI implications that couldn't be papered over.",
      ],
      bullets: [
        "Tokens in HttpOnly cookies only — no Authorization header, no localStorage token; all fetches use credentials: 'include'",
        "Tier reads exclusively from useIsPro() / useTier() — reading users.tier directly causes flash-of-wrong-tier on load",
        "402 → PaywallError → single PaywallModal singleton — catching a PaywallError and sending it to the toast layer loses the upgrade CTA",
        "Server-side prefetch must be opportunistic: server components throw on auth failure, React Query handles the empty cache client-side — SSR is never load-bearing",
        "Popovers that escape stacking contexts must use createPortal to document.body — animated dashboard cards create z-index contexts that clip inline menus",
        "Accessibility: jest-axe toHaveNoViolations() in every component test; ARIA roles, aria-live, aria-busy on all async submit buttons",
      ],
    },
    approach: {
      heading: "Approach",
      body: [
        "The data layer is built around TanStack Query v5 with a shared request() wrapper in api.ts that owns cookie auth, 401→refresh→retry, and 402→PaywallError mapping. Every API call goes through this wrapper — there are no raw fetch() calls in the codebase. OpenAPI TypeScript codegen (npm run gen:api against the live backend) keeps request types in sync with the backend's DTOs; a breaking backend change surfaces as a TypeScript error at every affected call site.",
        "SSR uses a thin server component shell that calls serverApi.ts (server-only helpers that forward the incoming Cookie header) and hands the dehydrated cache to HydrationBoundary. The client tree uses the same useQuery() hooks — SSR is transparent to components. When the server prefetch fails (no cookie, expired token), React Query simply treats the cache as empty and the client's existing 401→refresh flow takes over.",
        "The Pro paywall is a single PaywallProvider mounted at the layout root. Any component that calls a Pro endpoint wraps the await in a try/catch, checks instanceof PaywallError, and calls showPaywall(e.feature). PAYWALL_COPY in billing.ts maps feature keys to modal copy — hardcoding prices or feature names in JSX is explicitly forbidden so a plan change is one diff.",
      ],
      bullets: [
        "Five auth channels: password, OAuth (Google/GitHub), magic link, TOTP 2FA challenge flow, WebAuthn passkeys — all converge on the same persistUser() → finishLoginRedirect() rail",
        "Drag-and-drop Kanban using native HTML5 drag/drop API — no third-party DnD library",
        "AI JD analysis: textarea seeds from ?applicationId= query param; source pill shows provenance; editing the textarea drops the pill",
        "Bulk import: two-step CSV/JSON import — preview with per-row validation errors, then commit the same File; stateless server design",
        "PWA: Serwist service worker, beforeinstallprompt stash, install prompt shown after ≥3 applications and 14-day dismissal cooldown",
        "Playwright smoke harness: four tests covering demo login → JD redirect, 402 → PaywallModal, Kanban drag-and-drop, SSR-hydrated dashboard; backend mocked at HTTP boundary",
      ],
    },
    tradeoffs: [
      {
        decision: "SSR strategy",
        chose: "Opportunistic server prefetch + HydrationBoundary",
        over: "Full SSR with getServerSideProps-style auth enforcement or pure CSR",
        why: "SSR that fails hard on auth errors complicates the token-refresh story. Opportunistic prefetch gives first-paint speed on happy paths while the client's existing auth flow handles all edge cases — no duplicated refresh logic.",
      },
      {
        decision: "Type safety for API contracts",
        chose: "OpenAPI TypeScript codegen from live backend spec",
        over: "Hand-written interfaces or shared library",
        why: "A broken backend DTO rename becomes a TypeScript error at every call site on the next codegen run — catch it in the IDE, not in prod. Hand-written types drift silently.",
      },
      {
        decision: "Paywall modal",
        chose: "Single singleton via PaywallProvider at layout root",
        over: "Per-page or per-feature modal instances",
        why: "One instance means one place to update copy, one place to track analytics, and no risk of two modals stacking. The feature key is the only per-callsite concern.",
      },
      {
        decision: "Popover portals",
        chose: "createPortal to document.body with fixed coords from useLayoutEffect",
        over: "Inline rendering inside the card",
        why: "Framer Motion animated cards create new stacking contexts. Inline popovers get clipped or stacked under adjacent cards on some browsers — hit this in production once. The portal pattern is the load-bearing fix.",
      },
      {
        decision: "Drag-and-drop",
        chose: "Native HTML5 drag/drop API",
        over: "react-beautiful-dnd or @dnd-kit",
        why: "Zero bundle cost, no additional dependency surface, and sufficient for a single-board Kanban. A more complex multi-board future would revisit this.",
      },
    ],
    outcome: [
      { label: "Routes", value: "15+ pages", hint: "App Router, mix of server + client components" },
      { label: "Auth channels", value: "5 channels", hint: "password, OAuth, magic link, TOTP, WebAuthn" },
      { label: "E2E harness", value: "Playwright", hint: "4 smoke tests, backend mocked at HTTP boundary" },
      { label: "A11y", value: "jest-axe", hint: "toHaveNoViolations() in every component test" },
      { label: "Type safety", value: "OpenAPI codegen", hint: "npm run gen:api keeps DTOs in sync" },
      { label: "PWA", value: "Installable", hint: "Serwist SW, beforeinstallprompt, offline shell" },
    ],
    lessons: [
      "HttpOnly cookies are the right auth primitive for a browser app, but they make SSR prefetch genuinely harder — the server has to forward the cookie header explicitly, and any error should be treated as a cache miss rather than a hard failure.",
      "A single PaywallProvider singleton is not a premature abstraction — it's what makes the upgrade CTA consistent across every feature surface without duplicating modal state.",
      "OpenAPI codegen is the cheapest possible contract test between frontend and backend. The 30-second regeneration cycle is far cheaper than a runtime surprise in staging.",
      "jest-axe in every component test catches ARIA regressions before they reach a screen reader user. The cost is one extra line per test; the payoff compounds.",
      "Playwright mocked at the HTTP boundary is the right granularity for smoke tests — fast, hermetic, and honest about the UI logic without needing a real database.",
    ],
  },
  {
    slug: "eka-knowledge-assistant",
    projectId: "eka-backend",
    title: "Engineering Knowledge Assistant",
    subtitle: "Full-stack LLM-powered assistant for code, APIs, and production systems",
    summary:
      "Designed and built a production-grade engineering knowledge assistant — a Spring Boot reactive backend paired with a Next.js App Router frontend — that ingests, indexes, and retrieves knowledge from code repos, documentation, APIs, and production observability data through semantic search, multi-provider LLM routing, and Neo4j knowledge graphs. The full system was then hardened through a 91-item audit covering security, data integrity, performance, accessibility, and test coverage across both tiers.",
    role:
      "Sole engineer — owned architecture, backend implementation, frontend implementation, ingestion pipelines, LLM integration, security hardening, and audit remediation across 27 files end to end.",
    team: "Personal full-stack project (production-grade)",
    duration: "~12 weeks across nights/weekends (including audit remediation)",
    stack: [
      "Java 21", "Spring Boot 3.4", "Spring WebFlux", "Spring AI",
      "PostgreSQL + pgvector", "Apache Kafka", "Redis", "Neo4j",
      "OpenAI", "Anthropic", "Cohere", "Docker",
      "Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4",
      "TanStack Query 5", "Zustand 5", "Radix UI",
    ],
    accent: { from: "#06b6d4", to: "#8b5cf6", glow: "rgba(6,182,212,0.45)" },
    githubUrl: "https://github.com/lekhrocks/eka-backend",
    architectureId: "eka",
    problem: {
      heading: "The Problem",
      body: [
        "Engineering organizations maintain knowledge across scattered systems — code repositories, API documentation, Confluence pages, production dashboards, and incident post-mortems. Finding a specific answer often means searching five different tools, none of which understand the semantic relationship between a code change, the API it broke, and the Confluence page that documented the old behaviour.",
        "The goal was to build a single assistant that could ingest all these sources, index them into a searchable knowledge graph, and answer natural-language questions by retrieving the most relevant chunks and synthesising them through an LLM — without hallucinating non-existent APIs or code.",
      ],
    },
    constraints: {
      heading: "Constraints",
      body: [
        "The system had to work reliably enough to be useful in a real engineering workflow, with clear failure modes and no silent data loss.",
      ],
      bullets: [
        "LLM responses must never fabricate APIs, endpoints, or code signatures — retrieval results are the only source of truth, the LLM is a summariser, not a generator of new engineering facts",
        "Chat responses must stream tokens progressively — no multi-second pauses while the full response is generated server-side",
        "Ingestion must be async and durable — a failure in the embedding step must not lose the raw document",
        "Authentication must support both OAuth2 (production) and email+password (local dev) without dual code paths",
        "The frontend must render correctly for keyboard-only users — hover-reveal action groups are a common failure point",
        "91 audit findings at baseline (24 HIGH, 47 MEDIUM, 20 LOW) must be addressed before the system is production-ready",
      ],
    },
    approach: {
      heading: "Approach",
      body: [
        "I split the system into two independent deployables: a Spring Boot reactive backend and a Next.js App Router frontend, communicating over HTTP and SSE. The backend owns the data layer, LLM routing, and ingestion; the frontend owns the user experience, streaming visualisation, and dashboard surface.",
        "The backend is modular by domain: auth (JWT filtering + OAuth2 success handling), chat (streaming + citation extraction + context building), ingestion (connectors → chunking → embedding → vector store), retrieval (hybrid search + reranking + semantic cache), graph (Neo4j entity extraction and traversal), and admin (user management, feedback collection). Each module owns its persistence, its reactive chains compose through WebFlux, and blocking operations (JPA, LLM HTTP calls) are isolated on boundedElastic schedulers.",
        "The frontend follows the same domain-sliced pattern under src/features/: chat, search, sources, graph, analytics, observability, admin, and settings. Server state flows through TanStack Query 5 with centralised query keys; client state (auth tokens, UI preferences) lives in Zustand 5 with localStorage persistence. Chat uses a custom SSE reader that hand-reassembles chunked data: lines across TCP segment boundaries — a common bug in streaming implementations that I confirmed and fixed during the audit.",
        "The ingestion pipeline is Kafka-driven: ingestion requests are published to a topic, consumed by a stateless processor that downloads, parses, chunks (code-aware + heading-aware splitters), embeds (OpenAI or Voyage), and upserts into pgvector in batch writes. Neo4j graph population is optional and disabled by default. The architecture ensures the pipeline can be scaled horizontally by adding consumers, and failures at any stage are recoverable without data loss.",
        "After the initial implementation, I ran two comprehensive code audits that identified 91 issues. These were fixed across 27 files in 5 commits: build foundation (Java 21 LTS, Spring Boot GA, dependency pinning), security hardening (JWT role validation, cross-user conversation ownership, removal of default secrets, OAuth2 secure delivery), data integrity (reactive Redis cache, repository-layer persistence, missing database indexes, structured error logging), frontend robustness (Zustand persist consolidation, SSE buffer fix, accessibility compliance), and the addition of email+password authentication for local development.",
      ],
      bullets: [
        "Backend: 12 Gradle modules (eka-auth, eka-chat, eka-ingestion, eka-retrieval, eka-embedding, eka-graph, eka-web, eka-app, eka-common, eka-test, plus two more). Reactive chain composed via WebFlux; blocking JPA/LLM calls on boundedElastic schedulers",
        "Frontend: 114 source files across 18 directories. Feature-sliced modules under src/features/. Radix UI primitives with Tailwind CSS v4 + CVA for component styling",
        "SSE streaming: custom ReadableStream reader that buffers incomplete data: lines and reassembles on TCP chunk boundaries — verified fix through the 91-audit remediation (Phase 2, item 2f)",
        "Audit remediation: 5 logical commits touching 27 backend+frontend files. Build → Security → Data Integrity → Frontend Auth → Tests. ./gradlew build green, zero warnings",
        "Email+password auth: BCryptPasswordEncoder; POST /api/v1/auth/login and /register; V9 migration adds password_hash column; existing OAuth2 users get a clear error hint if they try email login",
      ],
    },
    tradeoffs: [
      {
        decision: "Reactive vs imperative backend",
        chose: "Spring WebFlux (reactive) for the API gateway and chat streaming; blocking JPA on boundedElastic",
        over: "Pure reactive with R2DBC or pure imperative with WebFlux removed",
        why: "R2DBC's ecosystem maturity didn't match JPA's for the relational-heavy domain (users, conversations, sources, feedback). The boundedElastic pattern keeps the reactive surface clean where it matters (streaming, gateway) while using JPA where it's productive. The audit confirmed this with the ConversationCacheService migration from StringRedisTemplate → ReactiveRedisTemplate — the blocking Redis template was the one place the architecture was inconsistent.",
      },
      {
        decision: "LLM provider strategy",
        chose: "Multi-provider router with per-intent overrides",
        over: "Single provider (e.g. only Anthropic) or purely client-side LLM calls",
        why: "Different engineering tasks benefit from different models — code generation favours OpenAI, analytical tasks favour Anthropic, and local experimentation favours Ollama. The IntentDetector classifies the user's query before routing, so overrides are transparent to the chat UI.",
      },
      {
        decision: "Frontend state management",
        chose: "TanStack Query for server state + Zustand for client state",
        over: "Redux Toolkit, Jotai, or single-state all-in-one",
        why: "Two different problems need two different primitives. TanStack Query's caching, polling, and invalidation patterns are purpose-built for API state. Zustand's minimal API and persist middleware handle auth tokens and UI preferences without ceremony. Merging both into a single store creates coupling between cache invalidation and UI reactivity that neither tool optimises for.",
      },
      {
        decision: "Auth default: JSON over redirect",
        chose: "JWT delivered as JSON body (default: json), no token in URL fragment",
        over: "302 redirect with #token=<jwt> in URL fragment",
        why: "Tokens in URLs are a security smell — they leak through Referer headers, server logs, and browser history. The JSON delivery mode keeps the token in the response body, which the frontend reads once and stores in Zustand persist (localStorage). The audit made this the default (Phase 1, item 1e) and added Referrer-Policy: no-referrer to the JSON response.",
      },
      {
        decision: "Conversation ownership enforcement",
        chose: "verifyOwnership() guard on every conversation endpoint",
        over: "Repository-level filtering by userId or no check (initial state)",
        why: "The initial implementation had no ownership check — any authenticated user could read or delete any conversation. The audit (Phase 1, items 1b-1c) flagged this as HIGH severity. The fix is a single reusable guard in ConversationController that checks UUID equality before any operation, returning 404 for non-existent and 403 for unauthorised access.",
      },
      {
        decision: "Cache reactivity",
        chose: "ReactiveRedisTemplate for conversation cache",
        over: "Keeping StringRedisTemplate with blocking calls in a reactive chain",
        why: "The original ConversationCacheService used StringRedisTemplate inside getHistory(), which was called from a Mono.flatMap() chain. The blocking Redis call pinned a boundedElastic thread unnecessarily. The audit (Phase 2, item 2e) replaced it with ReactiveRedisTemplate returning Mono<List<Message>>, letting the chain stay fully non-blocking.",
      },
      {
        decision: "Database connection topology",
        chose: "Single PostgreSQL instance with pgvector extension",
        over: "Separate vector database (Pinecone, Weaviate) + relational DB",
        why: "A second database adds operational complexity, network latency on every hybrid query, and a dual-write problem for new chunks. pgvector inside PostgreSQL keeps the vector search columnar in the same transaction context as the metadata — the hybrid query (embedding cosine similarity + keyword WHERE clause) is a single SQL statement.",
      },
      {
        decision: "Secret management",
        chose: "No default secrets — fail at startup if env vars unset; K8s configtree path",
        over: "Default secrets in application.yml for local convenience",
        why: "DB_PASSWORD:secret and NEO4J_PASSWORD:password in application.yml meant a misconfigured deployment would start with known default credentials. The audit (Phase 1, items 1f-1g) removed all defaults — startup fails immediately when required env vars are missing. spring.config.import: optional:configtree:/etc/secrets/ provides the K8s secrets mount path.",
      },
    ],
    outcome: [
      { label: "Backend modules", value: "12 modules", hint: "Gradle multi-module, JaCoCo 30% line gate" },
      { label: "Frontend pages", value: "12 routes", hint: "chat, search, graph, analytics, admin, observability, ingestion, sources, settings" },
      { label: "Tests", value: "60+ unit", hint: "JUnit 5 + Testcontainers + WebFlux slice tests" },
      { label: "Audit issues fixed", value: "91 items", hint: "24 HIGH, 47 MEDIUM, 20 LOW; 27 files changed" },
      { label: "Build health", value: "Zero warnings", hint: "Neo4j Direction.OUTGOING warning resolved" },
      { label: "Auth channels", value: "3 channels", hint: "Google OAuth2, GitHub OAuth2, email+password" },
      { label: "LLM providers", value: "3 providers", hint: "Anthropic, OpenAI, Ollama (per-intent routing)" },
      { label: "Ingestion connectors", value: "4 types", hint: "GitHub, GitLab, Confluence, web crawler" },
    ],
    lessons: [
      "A reactive architecture is only as reactive as its most blocking dependency. The ConversationCacheService was using a blocking Redis template inside a reactive chain — the audit caught it because the symptom was intermittent, not a crash.",
      "Multi-module Gradle projects need dependency management as much as they need domain modelling. Pinning Spring Boot 3.5.0 → 3.4.5 GA and removing the milestone repo wasn't ideological — 3.5.0-M5 dependencies were pulling in incompatible transitive versions that only surfaced at runtime.",
      "Ownership enforcement at the controller level is a rubber stamp without a test that exercises the cross-user path. The audit found the gap before anyone exploited it, and the fix was a single verifyOwnership() method — but it required changing every endpoint signature.",
      "Default secrets in application.yml are a blind spot because they work perfectly in local dev and silently ship to production. Removing the default and letting the JVM fail at startup is the only safe pattern.",
      "SSE streaming is harder than it looks. The TCP chunk boundary bug (splitting a \\n\\n across two reads) would corrupt every Nth message under load — the fix was one line (`buffer = parts.pop() ?? ''`) that the audit identified by reasoning about the buffer reassembly logic, not by reproducing the timing.",
      "Zustand persist middleware eliminates an entire class of bugs where localStorage reads happen before the React hydration pass. Consolidating four files of manual getItem/setItem calls into one store was the smallest diff with the largest correctness impact in the frontend audit.",
      "The transactional outbox pattern is overkill for this system's scale, but the principle — don't dual-write — informed the Kafka ingestion pipeline design. Ingestion requests are published to a topic; the consumer acknowledges after the chunk is persisted. A crash between consume and acknowledge means at-least-once delivery, which the upsert handles.",
      "Two code audits caught issues the initial implementation missed not because of carelessness, but because the second pass reads the code from a different altitude — line-by-line reviews find buffer split bugs; structural reviews find missing ownership checks. Both altitudes are necessary.",
    ],
  },
  {
    slug: "syncflow-data-sync",
    projectId: "syncflow",
    title: "SyncFlow — Open-Source Data Sync Platform",
    subtitle: "Debezium CDC, snapshot backfill, and a versioned pipeline designer for multi-database replication",
    summary:
      "Built an open-source data sync platform in Java 25 + Spring Boot on a hexagonal (ports & adapters) architecture: Debezium CDC capture with durable Kafka delivery, snapshot backfill for initial copy, a versioned pipeline designer with conflict detection and a transformation rule engine, a DAG workflow scheduler, a distributed agent fleet, and a Micrometer → Prometheus/Grafana observability stack — with strict multi-tenant data isolation and a replayable dead-letter queue.",
    role:
      "Sole engineer — owned the full platform: hexagonal domain model, CDC capture lifecycle, sync orchestration, pipeline design/versioning, connector SPI, workflow scheduling, multi-tenancy, and observability end to end.",
    team: "Personal open-source platform (production-grade)",
    duration: "Long-running platform, continuously shipped",
    stack: [
      "Java 25", "Spring Boot", "Debezium CDC", "Apache Kafka", "PostgreSQL",
      "Flyway", "Hexagonal Architecture", "Multi-tenant", "Plugin API", "Docker", "Grafana",
      "Micrometer", "Prometheus", "SSE",
    ],
    accent: { from: "#22d3ee", to: "#8b5cf6", glow: "rgba(34,211,238,0.45)" },
    githubUrl: "https://github.com/lekhrocks/syncflow",
    architectureId: "syncflow",
    problem: {
      heading: "The Problem",
      body: [
        "Moving data between databases is a solved problem for point-to-point ETL tools, but most are either licensed, opaque, or single-source. I wanted an open, self-contained data sync platform where the capture → transport → apply pipeline was transparent end to end — tail a source's change events with CDC, backfill the initial copy with snapshots, transform rows through a declarative mapping, and land them in any connected target without locking users to one vendor.",
        "The harder requirement was operational trust: every event had to be delivered at-least-once, failures had to be replayable rather than silent, and a platform hosting multiple tenants had to keep each tenant's data strictly isolated.",
      ],
    },
    constraints: {
      heading: "Constraints",
      body: [
        "The platform had to be honest about failure and about isolation from day one.",
      ],
      bullets: [
        "Delivery: no silent data loss — a failed row goes to a replayable dead-letter queue, never dropped",
        "Ordering: per-source change order preserved; downstream consumers can lag without blocking capture",
        "Multi-tenancy: every read and write must be scoped to the caller's tenant — no cross-tenant leakage at any tier",
        "Extensibility: new connectors and processing rules plug in without modifying the core",
        "Observability: capture/sync throughput, retries, errors, queue depth, and pipeline operations all surfaced in Grafana",
        "Composable: a pipeline is a declarative design (source → mappings → transformations → destination) that can be versioned, previewed, and validated before it ships",
      ],
    },
    approach: {
      heading: "Approach",
      body: [
        "I split the platform into an 8-module Gradle build following a hexagonal (ports & adapters) shape. At the center, `syncflow-core` holds the domain — pipeline, CDC, snapshot, connection, governance, and repository domain models with zero framework coupling. Around it, `syncflow-api` is the inbound/adapter side: REST controllers, SSE, Kafka consumers, and orchestration services that translate application concerns into domain calls. On the outbound side, `syncflow-connectors` and the `syncflow-plugin-api` module define the ports — `CdcProvider`, `SnapshotProvider`, `DestinationWriterProvider`, `PluginConnector` — so a new source or target database is a new adapter behind an SPI, never a change to the core.",
        "The hex boundary is what makes the platform extensible without forking it: the core compiles, tests, and ships independently of which connectors are wired in, and the plugin API is the contract a third party implements.",
        "Capture is Debezium CDC against source binlogs, publishing Row-level change events to Kafka. Delivery is at-least-once: consumers commit only after the row is durably applied, and a replayable dead-letter queue captures anything that exhausts retries. Snapshot backfill handles the initial full-table copy that CDC can't — the two paths converge on the same target contract.",
        "The pipeline designer treats a pipeline as a versioned design — source, destination, per-table mappings, and a transformation rule engine (rename, constant, concat, convert, trim, default, substring, expression) — with JSON-snapshot versioning, validation probes, and conflict detection feeding a live preview.",
        "Multi-tenancy is enforced at the repository/store layer, so every read and write is scoped to the current tenant by construction, not by convention.",
      ],
      bullets: [
        "Hexagonal layout: `syncflow-core` domain at the center; `syncflow-api` inbound adapters; `syncflow-connectors` + `syncflow-plugin-api` outbound SPI ports",
        "Plugin ports (`CdcProvider`, `SnapshotProvider`, `DestinationWriterProvider`) keep new connectors out of the core",
        "Debezium CDC → Kafka: at-least-once, ordered per source, with a replayable DLQ",
        "Snapshot executor for full-table backfill as the companion to live CDC",
        "Versioned pipeline designs with JSON snapshots, rollback, preview, and conflict detection",
        "Transformation rule engine for per-table column orchestration",
        "Distributed agent fleet + workflow scheduler for fan-out and retries",
        "Observability: Micrometer counters/gauges/timers → Prometheus → Grafana; SSE for live status",
        "Multi-tenant repo/store scoping guards against cross-tenant leakage",
      ],
    },
    tradeoffs: [
      {
        decision: "Transport backbone",
        chose: "Apache Kafka",
        over: "In-process queues or a second transactional store",
        why: "Kafka gives durable, replayable, ordered delivery that decouples capture from apply — a DB write to a queue in-process would lose events the moment the JVM dies, and replay would be impossible.",
      },
      {
        decision: "Live CDC + snapshot duality",
        chose: "Both as first-class sync modes",
        over: "CDC-only or snapshot-only",
        why: "A new target needs the full dataset (snapshot) before it can follow live changes (CDC). Shipping one without the other makes the other case impossible for a real integration.",
      },
      {
        decision: "Delivery semantics",
        chose: "At-least-once with a replayable DLQ",
        over: "Exactly-once or fire-and-forget",
        why: "Exactly-once needs solved distributed-transaction machinery (Kafka transactions + idempotent targets) with real cost; for a data-sync platform, at-least-once plus an idempotent target and a human-replaysable DLQ is the honest, defensible contract.",
      },
      {
        decision: "Extensibility",
        chose: "Dedicated plugin API module",
        over: "Everything in-core or annotation-scan auto-wiring",
        why: "A plugin boundary means new connectors and sources never touch core — the core compiles, tests, and releases independently, and the API is the contract.",
      },
      {
        decision: "Architecture",
        chose: "Hexagonal (ports & adapters) over layered packages",
        over: "Controller→Service→Repository by convention",
        why: "The hex boundary makes dependency direction a build-time property: the domain seems nothing about Kafka, JDBC, or HTTP. Layered packages degenerate into a change blast radius where a new connector drags the core with it; hex keeps adapters swappable and the domain framework-free.",
      },
      {
        decision: "Pipeline-as-versioned-document",
        chose: "JSON-snapshot design + rollback",
        over: "Live mutable pipeline config",
        why: "Treating a pipeline like a code artifact means you can preview, validate, version, and roll back a design instead of mutating shared live state — the same reason version control exists for code.",
      },
    ],
    outcome: [
      { label: "Modules", value: "8 gradle", hint: "core, api, connectors, security, monitoring, metrics, plugin-api, agent" },
      { label: "Sync modes", value: "CDC + snapshot", hint: "live binlog + full-table backfill" },
      { label: "Delivery", value: "At-least-once", hint: "idempotent apply + replayable DLQ" },
      { label: "Isolation", value: "Multi-tenant", hint: "repo/scoped keying" },
      { label: "Extensibility", value: "Plugin API", hint: "connectors without core changes" },
      { label: "Observability", value: "Grafana", hint: "Micrometer → Prometheus, SSE status" },
    ],
    lessons: [
      "A readable data-sync contract is worth more than a marketing one: at-least-once + idempotent targets + a replayable DLQ is what makes an outage replayable instead of a fire drill.",
      "Multi-tenancy is a construction discipline, not a filter. If the repository layer can't leak, the controller never can — you stop trusting every endpoint to remember to filter.",
      "CDC and snapshots are complements, not rivals. Shipping both modes is what makes a new-target onboarding actually work.",
      "The versioned pipeline-as-document model pays off the first time you preview a change, roll it back, or answer 'what changed between last week and now' — the same reason we version code.",
      "A plugin API is the difference between a platform and a monolith. If the core can compile and ship without 'one more connector', the core will actually ship.",
    ],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getCaseStudyByProjectId(projectId: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.projectId === projectId);
}

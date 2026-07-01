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
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getCaseStudyByProjectId(projectId: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.projectId === projectId);
}

"use client";

import {
  Band,
  Datastore,
  DiagramFrame,
  External,
  FlowArrow,
  Gateway,
  Queue,
  Service,
  TraceParticle,
} from "./primitives";
import type { DiagramMode } from "./RouterDiagram";

/**
 * Interview Tracker — full-stack topology.
 *
 * Spring Boot 4 / Java 25 backend, Next.js 14 frontend, PostgreSQL + Redis,
 * with a transactional outbox (DLQ), ShedLock scheduling, Resilience4j circuit
 * breakers, and Spring Modulith domain isolation.
 *
 * Sequence trace (happy path):
 *   Browser → Next.js → API (JWT auth → controller → @Transactional)
 *   → JPA → PostgreSQL → ApplicationChanged event → @CacheEvict
 *   → OutboxWorker → NotificationFanoutDispatcher → ntfy / WebPush
 *
 * Failure mode:
 *   Groq LLM down → circuit breaker OPEN → soft-fall back to base content.
 *   Outbox write fails → exponential backoff → DLQ (manual replay).
 *   Redis down → rate limiter degrades to allow-all (no false 429s).
 */
export default function InterviewTrackerDiagram({
  mode = "topology",
  playKey = 0,
}: {
  mode?: DiagramMode;
  playKey?: number;
}) {
  const seq = mode === "sequence";
  const fail = mode === "failure";

  const onPrimary = (id: string) =>
    [
      "webApp", "cdn", "nginx", "rateLimiter", "jwt", "appMod",
      "appMod", "postgres", "redis", "outbox", "ntfy",
    ].includes(id);

  const onFailure = (id: string) =>
    [
      "webApp", "cdn", "appMod",
      "groq", "cb",
    ].includes(id);

  const dim = (id: string) => {
    if (mode === "topology") return false;
    if (seq)  return !onPrimary(id);
    if (fail) return !onFailure(id);
    return false;
  };
  const dimEdge = (...ids: string[]) =>
    mode === "topology" ? false : ids.some((id) => dim(id));

  return (
    <DiagramFrame viewBox="0 0 920 660" height={660}>
      {/* Layer bands */}
      <Band y={0}   width={920} height={96}  label="clients" />
      <Band y={96}  width={920} height={100} label="ingress & delivery" />
      <Band y={196} width={920} height={196} label="api & domain layer" />
      <Band y={392} width={920} height={120} label="infrastructure & persistence" />
      <Band y={512} width={920} height={148} label="external services" />

      {/* ── 1. Clients ────────────────────────────── */}
      <External x={50}  y={30} w={200} h={50}
        label="Next.js Web App" sublabel=":3000 · SSR · PWA"
        tone={seq || fail ? "accent" : "default"}
        dim={dim("webApp")}
        info="Next.js 14 App Router. React Query client. HttpOnly cookie auth."
      />
      <External x={350} y={30} w={200} h={50}
        label="Chrome Extension" sublabel="MV3 · addFromUrl"
        tone="default"
        dim={mode !== "topology"}
        info="Deep-links scraped job postings to the web app. No API keys stored."
      />
      <External x={650} y={30} w={200} h={50}
        label="Calendar Apps" sublabel="ICS feed (RFC 5545)"
        tone="default"
        dim={mode !== "topology"}
        info="Google · Apple · Outlook poll /api/v1/calendar/feed/{token}.ics"
      />

      {/* ── 2. Ingress ────────────────────────────── */}
      <Gateway x={350} y={118} w={220} h={52}
        label="CDN / Nginx LB" sublabel="TLS · rate · static"
        tone={seq || fail ? "accent" : "default"}
        dim={dim("cdn")}
        info="Cloudflare CDN. Nginx reverse proxy. Terminates TLS. Serves static assets."
      />
      <Service x={650} y={118} w={170} h={52}
        label="Next.js SSR" sublabel="serverApi.ts"
        tone={seq || fail ? "accent" : "default"}
        dim={dim("nginx")}
        info="Server-component prefetch via serverApi.ts. Forwards cookies to backend. Non-load-bearing (opportunistic)."
      />

      {/* Clients → CDN */}
      {[150, 450, 750].map((x, i) => (
        <FlowArrow key={x}
          x1={x} y1={80} x2={460} y2={118}
          tone={i === 0 && (seq || fail) ? "accent" : "default"}
          primary={i === 0 && (seq || fail)}
          animated={i === 0 && (seq || fail)}
          step={i === 0 && (seq || fail) ? 1 : undefined}
          latency={i === 0 && (seq || fail) ? "<5ms" : undefined}
          dim={i !== 0 && mode !== "topology"}
        />
      ))}
      {/* CDN → Next.js */}
      <FlowArrow x1={570} y1={145} x2={650} y2={145}
        tone={seq || fail ? "accent" : "default"}
        primary={seq || fail}
        animated={seq || fail}
        step={seq || fail ? 2 : undefined}
        dim={dimEdge("cdn", "nginx")}
      />

      {/* ── 3. API & Domain Layer ──────────────────── */}

      {/* Row 1 — Security filters */}
      <Service x={50}  y={218} w={160} h={48}
        label="Rate Limiter" sublabel="Redis FIXED/SLIDING"
        tone={seq ? "accent" : "default"}
        dim={dim("rateLimiter")}
        info="FIXED window for api/auth (2 Redis ops/Lua). SLIDING for others. Per-user jd-analysis-daily bucket flexed by tier via RateLimitOverride SPI."
      />
      <Service x={240} y={218} w={160} h={48}
        label="JWT Auth" sublabel="sig → blacklist → ver"
        tone={seq || fail ? "accent" : "default"}
        dim={dim("jwt")}
        info="Spring Security 7 BearerTokenAuthenticationFilter. 3 validators: JWT sig+exp, Redis jti blacklist, users.token_version (DB)."
      />
      <Service x={430} y={218} w={160} h={48}
        label="API Key Auth" sublabel="itk_… SHA-256"
        tone="default" dim={mode !== "topology"}
        info="ApiKeyAuthenticationFilter runs before JWT filter. itk_ prefix → SHA-256 lookup in api_keys table."
      />
      <Service x={620} y={218} w={160} h={48}
        label="Idempotency" sublabel="Redis body cache 1h"
        tone="default" dim={mode !== "topology"}
        info="Idempotency-Key header. Caches response body keyed by userId + key. 1h TTL."
      />
      <Service x={810} y={218} w={90} h={48}
        label="2FA" sublabel="TOTP"
        tone="default" dim={mode !== "topology"}
        info="RFC 6238 TOTP. Challenge JWT (5min). Recovery codes (10 single-use, SHA-256 hashed)."
      />

      {/* Row 2 — Domain modules (9 Spring Modulith modules in a horizontal row) */}
      {[
        { id: "iam",    x: 20,  label: "iam",    sub: "User · Auth · Sessions" },
        { id: "appMod", x: 155, label: "applications", sub: "Tracker · Rounds · Calendar" },
        { id: "profile",x: 310, label: "profile", sub: "CV · JD Analysis · Photos" },
        { id: "notif",  x: 465, label: "notifications", sub: "Feed · WebPush · Email" },
        { id: "bill",   x: 620, label: "billing", sub: "Tier · Entitlements · LS/Stripe" },
        { id: "analyt", x: 775, label: "analytics", sub: "Aggregator · Insights" },
      ].map((m) => (
        <Service
          key={m.id}
          x={m.x} y={296} w={125} h={44}
          label={m.label} sublabel={m.sub}
          tone={(m.id === "appMod" && seq) ? "accent" : "default"}
          dim={dim(m.id)}
          info={`Spring Modulith domain module. ${m.sub}. ArchUnit-gated boundaries.`}
        />
      ))}

      {/* NGINX → API row 1 (security → domain) */}
      <FlowArrow x1={735} y1={170} x2={460} y2={218}
        tone={seq || fail ? "accent" : "default"}
        primary={seq}
        animated={seq}
        step={seq ? 3 : undefined}
        dim={dimEdge("nginx", "rateLimiter")}
      />

      {/* Security filters → domain module row — only JWT→applications matters for the trace */}
      <FlowArrow x1={320} y1={266} x2={217} y2={296}
        tone={seq ? "accent" : "default"}
        primary={seq}
        animated={seq}
        step={seq ? 4 : undefined}
        dim={dimEdge("jwt", "appMod")}
      />

      {/* ── 4. Infrastructure & Persistence ────────── */}
      <Queue x={70} y={410} w={180} h={44}
        label="Outbox Worker" sublabel="DLQ · retry · backoff"
        tone={seq || fail ? "accent" : "async"}
        dim={dim("outbox")}
        info="Transactional outbox (V15). FOR UPDATE SKIP LOCKED drain. Exponential backoff 30s→1h, 6 attempts → DLQ (FAILED). Micrometer counters."
      />
      <Queue x={300} y={410} w={160} h={44}
        label="ShedLock" sublabel="distributed scheduling"
        tone="default" dim={mode !== "topology"}
        info="Prevents double-firing on multi-pod. Guards ReminderScheduler, OutboxWorker, OutboxCleanupScheduler, CacheRefreshScheduler."
      />

      {/* Domain applications → PostgreSQL (persist — both domain row + outbox_messages in one @Transactional) */}
      <FlowArrow x1={217} y1={340} x2={600} y2={408}
        tone={seq ? "accent" : "default"}
        primary={seq}
        animated={seq}
        step={seq ? 5 : undefined}
        latency={seq ? "<8ms" : undefined}
        label={seq ? "INSERT" : undefined}
        dim={dimEdge("appMod", "postgres")}
      />

      {/* ApplicationChanged event → @CacheEvict (in-process AFTER_COMMIT, off the particle path) */}
      <FlowArrow x1={217} y1={340} x2={800} y2={408}
        tone={seq ? "accent" : "default"}
        primary={seq}
        animated={seq}
        label={seq ? "evict" : undefined}
        dim={dimEdge("appMod", "redis")}
      />

      <Datastore x={520} y={408} w={160} h={56}
        label="PostgreSQL 16+" sublabel="primary + read-replica"
        tone={seq ? "accent" : "default"}
        dim={dim("postgres")}
        info="Primary OLTP store. Optional read-replica via DB_READER_URL. HikariCP pool (default 50). 41 Flyway migrations with zero-downtime policy."
      />
      <Datastore x={720} y={408} w={160} h={56}
        label="Redis 7+" sublabel="blacklist · cache · rate"
        tone="default"
        dim={dim("redis")}
        info="Token blacklist (jti SET). Rate limit counters. Analytics cache (evicted by ApplicationChanged event). Idempotency cache (1h TTL). HotKeys pre-refresh at 25s."
      />

      {/* Arrows from domain to outbox — only applications module publishes events */}
      <FlowArrow x1={217} y1={340} x2={160} y2={410}
        tone={seq ? "accent" : "async"}
        primary={seq}
        animated={seq}
        step={seq ? 7 : undefined}
        label={seq ? "publish" : undefined}
        dim={dimEdge("appMod", "outbox")}
      />

      {/* ── 5. External Services ───────────────────── */}
      <External x={20}  y={540} w={160} h={52}
        label="Groq LLM" sublabel="Spring AI · OpenAI-compat"
        tone={fail ? "failure" : "default"}
        dim={dim("groq")}
        info="LLM provider for CV tailoring, JD analysis, interview coach. Resilience4j circuit breaker + retry (3 attempts, 100ms backoff)."
      />
      <Service x={20} y={600} w={160} h={40}
        label="Circuit Breaker" sublabel="CLOSED · OPEN · HALF"
        tone="failure"
        dim={!fail}
        info="Resilience4j per-client breaker. OPEN when Groq fails 3/5 in 30s. Soft-fails to base content."
      />
      <External x={210} y={540} w={160} h={52}
        label="ntfy.sh" sublabel="push notifications"
        tone="default"
        dim={dim("ntfy")}
        info="Reminder push. POST /{topic} via NotificationFanoutDispatcher after outbox commit. Configurable NTFY_BASE_URL."
      />
      <External x={400} y={540} w={160} h={52}
        label="Lemon Squeezy" sublabel="billing · merchant of record"
        tone="default"
        dim={mode !== "topology"}
        info="Hosted checkout. HMAC-SHA256 webhook verification. BillingProvider SPI — swap to Stripe without touching controllers."
      />
      <External x={590} y={540} w={160} h={52}
        label="Google Calendar" sublabel="OAuth 2.0 · AES-GCM"
        tone="default"
        dim={mode !== "topology"}
        info="One-way OAuth push of interview rounds. Refresh token encrypted at rest (AES-GCM, fresh IV per encrypt). @HttpExchange interfaces."
      />
      <External x={780} y={540} w={130} h={52}
        label="Grafana Cloud" sublabel="OTLP · Faro"
        tone="default"
        dim={mode !== "topology"}
        info="Metrics + traces (Micrometer → OTLP). Logs (Logback JSON). Frontend Faro RUM. W3C traceparent correlated across browser→backend."
      />

      {/* Groq → Circuit Breaker (failure branch) */}
      <FlowArrow x1={100} y1={592} x2={100} y2={600}
        tone="failure" animated={fail} primary={fail}
        step={fail ? 4 : undefined}
        label={fail ? "fail" : undefined}
        dim={!fail && mode !== "topology"}
      />

      {/* Domain → External arrows */}
      {/* Applications domain → Groq LLM (AI features) */}
      <FlowArrow x1={217} y1={340} x2={100} y2={540}
        tone={fail ? "failure" : "default"}
        dim={dimEdge("appMod", "groq")}
        label={fail ? "timeout" : undefined}
      />
      {/* Outbox → ntfy (push delivery) */}
      <FlowArrow x1={160} y1={454} x2={290} y2={540}
        tone={seq ? "accent" : "async"}
        primary={seq}
        animated={seq}
        step={seq ? 9 : undefined}
        label={seq ? "POST" : undefined}
        dim={dimEdge("outbox", "ntfy")}
      />

      {/* Trace — happy path */}
      {seq && (
        <TraceParticle
          playKey={playKey}
          duration={7}
          tone="accent"
          path={[
            "M 150 55",    // 1. browser
            "L 460 143",   // 2. → CDN
            "L 735 143",   // 3. → Next.js SSR
            "L 320 242",   // 4. → JWT Auth
            "L 217 340",   // 5. → applications module (@Transactional)
            "L 600 436",   // 6. → PostgreSQL (INSERT domain row + outbox_messages)
            "L 160 436",   // 7. → OutboxWorker (FOR UPDATE SKIP LOCKED drain)
            "L 290 566",   // 8. → ntfy push
          ].join(" ")}
        />
      )}

      {/* Trace — failure path */}
      {fail && (
        <TraceParticle
          playKey={playKey}
          duration={5}
          tone="failure"
          path={[
            "M 150 55",    // 1. browser
            "L 460 143",   // 2. → CDN
            "L 460 280",   // 3. → (through API filter chain, dimmed — passes through silently)
            "L 217 340",   // 4. → applications module (still processes the request)
            "L 100 566",   // 5. → Groq LLM call — timeout / circuit opens
            "L 100 620",   // 6. → circuit breaker OPEN (CLOSED→OPEN→HALF)
          ].join(" ")}
        />
      )}
    </DiagramFrame>
  );
}

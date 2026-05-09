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
 * Microservices + Kafka pipeline.
 *
 * Primary trace path (sequence mode):
 *   Client → Gateway → Payment Service → payment-events topic →
 *   Payment Processor → MySQL  (also fans out → Audit + Notification)
 *
 * Failure mode:
 *   Payment Processor crashes / lags →
 *   Consumer Group rebalances + DLQ catches the bad message → retry topic
 */
export default function KafkaDiagram({
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
      "client", "gateway", "payment", "kafka", "tPayment",
      "cPayment", "mysql", "tAudit", "cAudit", "esLog", "tNotif", "cNotif",
    ].includes(id);

  const onFailure = (id: string) =>
    [
      "client", "gateway", "payment", "kafka", "tPayment",
      "cPayment", "dlq", "retry",
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
    <DiagramFrame viewBox="0 0 920 600" height={600}>
      {/* Layer bands */}
      <Band y={0}   width={920} height={92}  label="ingress" />
      <Band y={92}  width={920} height={114} label="producer services" />
      <Band y={206} width={920} height={172} label="kafka event bus" />
      <Band y={378} width={920} height={114} label="consumer services" />
      <Band y={492} width={920} height={108} label="datastores" />

      {/* ── 1. Ingress ────────────────────────────── */}
      <External x={50}  y={28} w={130} h={48}
        label="Web / Mobile" sublabel="HTTPS"
        dim={dim("client")}
        info="External clients sending order/payment requests."
      />
      <Gateway x={230} y={28} w={170} h={48}
        label="API Gateway" sublabel="auth · rate · route"
        tone={seq || fail ? "accent" : "default"}
        dim={dim("gateway")}
        info="Single ingress for all client traffic."
      />
      <Gateway x={440} y={28} w={170} h={48}
        label="K8s Load Balancer" sublabel="ingress · helm"
        tone="default" dim={mode !== "topology"}
        info="Kubernetes ingress + Helm-managed deployments."
      />
      <Service x={650} y={28} w={150} h={48}
        label="CI / CD" sublabel="GitHub Actions"
        tone="default" dim={mode !== "topology"}
        info="Automated build, scan, deploy pipeline."
      />
      <FlowArrow x1={180} y1={52} x2={230} y2={52}
        tone={seq || fail ? "accent" : "default"}
        primary={seq || fail} animated={seq || fail}
        step={seq || fail ? 1 : undefined}
        latency={seq || fail ? "<2ms" : undefined}
        dim={dimEdge("client", "gateway")}
      />
      <FlowArrow x1={400} y1={52} x2={440} y2={52}
        tone="default" dim={mode !== "topology"} />

      {/* ── 2. Producer services ──────────────────── */}
      {[
        { id: "billing",  x: 30,  label: "Billing",  sub: "PayPal · Stripe" },
        { id: "payment",  x: 200, label: "Payment",  sub: "Stripe · Billpay" },
        { id: "checkout", x: 370, label: "Checkout", sub: "Cart · Orders" },
        { id: "auth",     x: 540, label: "Auth",     sub: "OAuth2 · JWT" },
        { id: "user",     x: 710, label: "User",     sub: "Profile · Prefs" },
      ].map((s) => (
        <Service
          key={s.id}
          x={s.x} y={114} w={150} h={50}
          label={s.label} sublabel={s.sub}
          tone={s.id === "payment" && (seq || fail) ? "accent" : "default"}
          dim={dim(s.id)}
          info={`${s.label} service · Spring Boot · publishes to ${s.id}-events`}
        />
      ))}

      {/* Gateway → Payment (primary) */}
      <FlowArrow x1={315} y1={76} x2={275} y2={114}
        tone={seq || fail ? "accent" : "default"}
        primary={seq || fail} animated={seq || fail}
        step={seq || fail ? 2 : undefined}
        dim={dimEdge("gateway", "payment")}
      />
      {/* Gateway → other producers (topology only) */}
      {[105, 445, 615, 785].map((x, i) => (
        <FlowArrow key={x}
          x1={315} y1={76} x2={x} y2={114}
          tone="default"
          dim={mode !== "topology"}
        />
      ))}

      {/* ── 3. Kafka cluster ──────────────────────── */}
      <rect x={40} y={236} width={840} height={130} rx={8}
        fill="#0a0e14" stroke={dim("kafka") ? "#1f2937" : "#22d3ee"} strokeWidth={1.25}
        opacity={dim("kafka") ? 0.5 : 1}
        style={{ transition: "opacity 0.25s ease" }}
      />
      <text x={460} y={258} textAnchor="middle"
        fill={dim("kafka") ? "#475569" : "#22d3ee"}
        fontSize={12} fontWeight={700}
        style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace", letterSpacing: 1.5 }}>
        APACHE KAFKA · partitioned · replicated · replayable
      </text>

      {/* Topics */}
      {[
        { id: "tBilling", x: 60,  label: "billing-events" },
        { id: "tPayment", x: 220, label: "payment-events" },
        { id: "tCheckout",x: 380, label: "checkout-events" },
        { id: "tNotif",   x: 540, label: "notification-events" },
        { id: "tAudit",   x: 700, label: "audit-events" },
      ].map((t) => (
        <Queue
          key={t.id}
          x={t.x} y={282} w={160} h={36}
          label={t.label}
          tone={
            (t.id === "tPayment" && (seq || fail)) ||
            (t.id === "tAudit" && seq) ||
            (t.id === "tNotif" && seq)
              ? "accent"
              : "async"
          }
          dim={dim(t.id)}
          info={`Kafka topic '${t.label}' · 12 partitions · RF=3`}
        />
      ))}

      {/* DLQ + retry topic — visible mainly in failure mode */}
      <Queue
        x={220} y={328} w={160} h={32}
        label="payment-events.dlq"
        tone="failure"
        dim={!fail}
        info="Dead-letter queue for malformed or non-retriable events."
      />
      <Queue
        x={400} y={328} w={160} h={32}
        label="payment-events.retry"
        tone="failure"
        dim={!fail}
        info="Retry topic re-consumed by a separate worker with backoff."
      />

      {/* Producers → topics */}
      <FlowArrow x1={105} y1={164} x2={140} y2={282} tone="async" dim={mode !== "topology"} />
      <FlowArrow x1={275} y1={164} x2={300} y2={282}
        tone={seq || fail ? "accent" : "async"}
        primary={seq || fail} animated={seq || fail}
        step={seq || fail ? 3 : undefined}
        latency={seq || fail ? "<10ms" : undefined}
        dim={dimEdge("payment", "tPayment")}
      />
      <FlowArrow x1={445} y1={164} x2={460} y2={282} tone="async" dim={mode !== "topology"} />
      <FlowArrow x1={615} y1={164} x2={620} y2={282} tone="async" dim={mode !== "topology"} />
      <FlowArrow x1={785} y1={164} x2={780} y2={282} tone="async" dim={mode !== "topology"} />

      {/* Payment topic → DLQ + retry (failure mode) */}
      <FlowArrow x1={300} y1={318} x2={300} y2={328}
        tone="failure" animated={fail} primary={fail}
        step={fail ? 5 : undefined} label={fail ? "poison" : undefined}
        dim={!fail}
      />
      <FlowArrow x1={380} y1={343} x2={400} y2={343}
        tone="failure" animated={fail} primary={fail}
        step={fail ? 6 : undefined} label={fail ? "retry" : undefined}
        dim={!fail}
      />

      {/* ── 4. Consumer services ──────────────────── */}
      {[
        { id: "cBilling", x: 30,  label: "Billing Consumer",  sub: "DLQ · Retry" },
        { id: "cPayment", x: 220, label: "Payment Processor", sub: "Idempotent · Exactly-once" },
        { id: "cNotif",   x: 410, label: "Notification Worker", sub: "Email · SMS · Push" },
        { id: "cAudit",   x: 600, label: "Audit Service",     sub: "Compliance · Log" },
      ].map((c) => (
        <Service
          key={c.id}
          x={c.x} y={400} w={180} h={50}
          label={c.label} sublabel={c.sub}
          tone={
            (c.id === "cPayment" && (seq || fail)) ||
            (c.id === "cAudit" && seq) ||
            (c.id === "cNotif" && seq)
              ? "accent"
              : "default"
          }
          dim={dim(c.id)}
          info={`${c.label} · consumer group with auto-commit off`}
        />
      ))}

      {/* DLQ retry consumer (failure mode) */}
      <Service
        x={780} y={400} w={120} h={50}
        label="DLQ Worker" sublabel="manual replay"
        tone="failure" dim={!fail}
        info="On-call replays after triage. Backoff-aware retry consumer."
      />

      {/* Topics → Consumers */}
      <FlowArrow x1={140} y1={318} x2={120} y2={400} tone="async" dim={mode !== "topology"} />
      <FlowArrow x1={300} y1={318} x2={310} y2={400}
        tone={seq || fail ? "accent" : "async"}
        primary={seq || fail} animated={seq || fail}
        step={seq ? 4 : fail ? 4 : undefined}
        latency={seq ? "<20ms" : undefined}
        dim={dimEdge("tPayment", "cPayment")}
      />
      <FlowArrow x1={460} y1={318} x2={500} y2={400}
        tone={seq ? "accent" : "async"}
        primary={seq} animated={seq}
        dim={dimEdge("tCheckout", "cNotif")}
      />
      <FlowArrow x1={620} y1={318} x2={500} y2={400}
        tone={seq ? "accent" : "async"}
        primary={seq} animated={seq}
        dim={dimEdge("tNotif", "cNotif")}
      />
      <FlowArrow x1={780} y1={318} x2={690} y2={400}
        tone={seq ? "accent" : "async"}
        primary={seq} animated={seq}
        dim={dimEdge("tAudit", "cAudit")}
      />
      {/* Retry topic → DLQ worker */}
      <FlowArrow x1={560} y1={343} x2={840} y2={400}
        tone="failure" animated={fail} primary={fail}
        step={fail ? 7 : undefined}
        dim={!fail}
      />

      {/* ── 5. Datastores ─────────────────────────── */}
      {[
        { id: "pg",     x: 30,  label: "PostgreSQL", sub: "Billing DB" },
        { id: "mysql",  x: 160, label: "MySQL",      sub: "Payment DB" },
        { id: "mongo",  x: 290, label: "MongoDB",    sub: "Orders" },
        { id: "redis",  x: 420, label: "Redis",      sub: "Cache · Session" },
        { id: "esLog",  x: 550, label: "Elastic",    sub: "Audit · Search" },
        { id: "prom",   x: 680, label: "Prometheus", sub: "Metrics" },
        { id: "ddog",   x: 800, label: "Datadog",    sub: "APM · Traces" },
      ].map((d) => (
        <Datastore
          key={d.id}
          x={d.x} y={510} w={110} h={56}
          label={d.label} sublabel={d.sub}
          tone={
            (d.id === "mysql" && (seq || fail)) ||
            (d.id === "esLog" && seq) ? "accent" : "default"
          }
          dim={dim(d.id)}
          info={`${d.label} · ${d.sub}`}
        />
      ))}

      {/* Consumers → Datastores */}
      <FlowArrow x1={120} y1={450} x2={85}  y2={510} tone="muted" dim={mode !== "topology"} />
      <FlowArrow x1={310} y1={450} x2={215} y2={510}
        tone={seq || fail ? "accent" : "muted"}
        primary={seq || fail} animated={seq || fail}
        step={seq || fail ? 5 : undefined}
        latency={seq || fail ? "<8ms" : undefined}
        dim={dimEdge("cPayment", "mysql")}
      />
      <FlowArrow x1={690} y1={450} x2={605} y2={510}
        tone={seq ? "accent" : "muted"}
        primary={seq} animated={seq}
        dim={dimEdge("cAudit", "esLog")}
      />

      {/* Trace particle — happy path */}
      {seq && (
        <TraceParticle
          playKey={playKey}
          duration={6}
          tone="accent"
          path={[
            "M 115 52",   // client
            "L 315 52",   // gateway
            "L 275 138",  // payment service
            "L 300 300",  // payment topic
            "L 310 425",  // payment processor
            "L 215 538",  // mysql
          ].join(" ")}
        />
      )}
      {/* Trace particle — failure path */}
      {fail && (
        <TraceParticle
          playKey={playKey}
          duration={5}
          tone="failure"
          path={[
            "M 275 138",   // payment
            "L 300 300",   // topic
            "L 300 343",   // dlq
            "L 480 343",   // retry topic
            "L 840 425",   // dlq worker
          ].join(" ")}
        />
      )}
    </DiagramFrame>
  );
}

"use client";

import {
  Band,
  Datastore,
  DiagramFrame,
  External,
  FlowArrow,
  Gateway,
  Router,
  Service,
  TraceParticle,
} from "./primitives";

export type DiagramMode = "topology" | "sequence" | "failure";

export default function RouterDiagram({
  mode = "topology",
  playKey = 0,
}: {
  mode?: DiagramMode;
  playKey?: number;
}) {
  const seq = mode === "sequence";
  const fail = mode === "failure";

  // Dim everything that isn't on the current narrative path.
  // Primary path: Client → Gateway → Auth → Router → Circuit Breaker → LB → Service B
  // Failure path: same up to CB, then CB OPEN → Retry → still fails → fallback / 503

  const onPrimary = (id: string) =>
    [
      "client", "gateway", "auth", "router", "cb", "lb", "svcB",
      "prom", // observability participates passively
    ].includes(id);

  const onFailure = (id: string) =>
    ["client", "gateway", "auth", "router", "cb", "retry", "rate"].includes(id);

  const dim = (id: string) => {
    if (mode === "topology") return false;
    if (seq) return !onPrimary(id);
    if (fail) return !onFailure(id);
    return false;
  };

  const dimEdge = (...ids: string[]) =>
    mode === "topology" ? false : ids.some((id) => dim(id));

  return (
    <DiagramFrame viewBox="0 0 880 540" height={540}>
      {/* Layer bands */}
      <Band y={0}   width={880} height={86}  label="client tier" />
      <Band y={86}  width={880} height={94}  label="ingress" />
      <Band y={180} width={880} height={150} label="routing core" />
      <Band y={330} width={880} height={104} label="backend tier" />
      <Band y={434} width={880} height={106} label="observability" />

      {/* ── 1. Clients ─────────────────────────────── */}
      {[
        { x: 80,  label: "Web",      sub: "Browser" },
        { x: 250, label: "Mobile",   sub: "iOS / Android" },
        { x: 420, label: "Partner",  sub: "3rd-party API" },
        { x: 600, label: "Internal", sub: "Microservice" },
      ].map((c, i) => (
        <External
          key={c.label}
          x={c.x} y={26} w={130} h={48}
          label={c.label} sublabel={c.sub}
          dim={dim("client") && i !== 0}
          info={`${c.label} client · sends HTTPS / WebSocket`}
        />
      ))}

      {/* Clients → Gateway */}
      {[145, 315, 485, 665].map((x, i) => (
        <FlowArrow
          key={x}
          x1={x} y1={74} x2={440} y2={108}
          tone="default"
          dim={dimEdge("client") && i !== 0}
        />
      ))}

      {/* ── 2. Gateway / Ingress ──────────────────── */}
      <Gateway
        x={350} y={108} w={180} h={50}
        label="API Gateway" sublabel="HTTPS · WS · gRPC"
        tone={seq || fail ? "accent" : "default"}
        dim={dim("gateway")}
        info="Single ingress for all clients. TLS terminates here."
      />

      <Service
        x={50} y={112} w={150} h={42}
        label="Rate Limiter" sublabel="token bucket"
        tone={fail ? "failure" : "default"}
        dim={dim("rate")}
        info="Token-bucket rate limiter, per-IP. 1000 req/s burst, 100 r/s sustained."
      />
      <Service
        x={680} y={112} w={150} h={42}
        label="Auth Middleware" sublabel="JWT · API key"
        tone={seq || fail ? "accent" : "default"}
        dim={dim("auth")}
        info="Validates JWT or API key. Adds tenant claim to request context."
      />

      {/* Gateway → Auth */}
      <FlowArrow x1={530} y1={133} x2={680} y2={133}
        tone="accent" primary={seq || fail}
        animated={seq || fail}
        step={seq || fail ? 1 : undefined}
        latency={seq || fail ? "<1ms" : undefined}
        dim={dimEdge("gateway", "auth")}
      />
      {/* Gateway → Rate Limiter (alt path) */}
      <FlowArrow x1={350} y1={133} x2={200} y2={133}
        tone={fail ? "failure" : "default"}
        dim={dimEdge("rate", "gateway")}
        label={fail ? "throttle" : undefined}
      />

      {/* ── 3. Routing Core ───────────────────────── */}
      <Router
        x={70} y={208} w={160} h={70}
        label="Router Engine" sublabel="regex · path · header"
        tone={seq || fail ? "accent" : "default"}
        dim={dim("router")}
        info="Regex-matched routing rules. ~800 LoC core, virtual-thread powered."
      />
      <Service
        x={310} y={208} w={170} h={48}
        label="Circuit Breaker" sublabel="CLOSED · OPEN · HALF"
        tone={fail ? "failure" : seq ? "accent" : "default"}
        dim={dim("cb")}
        info="Hand-rolled per-route breaker. Trips after 3 failures in 10s window."
      />
      <Service
        x={310} y={268} w={170} h={42}
        label="Retry + Backoff" sublabel="exponential · jitter"
        tone={fail ? "failure" : "default"}
        dim={dim("retry")}
        info="Retries idempotent failures with jittered exponential backoff."
      />
      <Gateway
        x={560} y={208} w={170} h={50}
        label="Load Balancer" sublabel="RR · Random · LeastConn"
        tone={seq ? "accent" : "default"}
        dim={dim("lb")}
        info="3 strategies pluggable per-route. Default: LeastConnections."
      />

      {/* Auth → Router */}
      <FlowArrow x1={755} y1={154} x2={210} y2={208}
        tone={seq || fail ? "accent" : "default"}
        primary={seq || fail}
        animated={seq || fail}
        step={seq || fail ? 2 : undefined}
        dim={dimEdge("auth", "router")}
      />
      {/* Router → CB */}
      <FlowArrow x1={230} y1={243} x2={310} y2={232}
        tone={seq || fail ? "accent" : "default"}
        primary={seq || fail}
        animated={seq || fail}
        step={seq || fail ? 3 : undefined}
        dim={dimEdge("router", "cb")}
      />
      {/* CB → Retry (failure branch) */}
      <FlowArrow x1={395} y1={256} x2={395} y2={268}
        tone="failure"
        animated={fail}
        primary={fail}
        step={fail ? 4 : undefined}
        label={fail ? "fail" : undefined}
        dim={!fail && mode !== "topology"}
      />
      {/* CB → LB (happy branch) */}
      <FlowArrow x1={480} y1={232} x2={560} y2={232}
        tone={seq ? "accent" : "default"}
        primary={seq}
        animated={seq}
        step={seq ? 4 : undefined}
        label={seq ? "allow" : undefined}
        latency={seq ? "<2ms" : undefined}
        dim={dimEdge("cb", "lb")}
      />

      {/* ── 4. Backend Services ───────────────────── */}
      {[
        { id: "svcA", x: 60,  port: ":8081", label: "svc A" },
        { id: "svcB", x: 220, port: ":8082", label: "svc B" },
        { id: "svcC", x: 380, port: ":8083", label: "svc C" },
        { id: "svcD", x: 540, port: ":8084", label: "svc D" },
        { id: "svcE", x: 700, port: ":8085", label: "svc E" },
      ].map((s) => (
        <Service
          key={s.id}
          x={s.x} y={356} w={120} h={48}
          label={s.label} sublabel={s.port}
          tone={s.id === "svcB" && seq ? "accent" : "default"}
          dim={dim(s.id)}
          info={`Backend instance on port ${s.port}`}
        />
      ))}

      {/* LB → Services */}
      {[120, 280, 440, 600, 760].map((x, i) => {
        const ids = ["svcA", "svcB", "svcC", "svcD", "svcE"];
        return (
          <FlowArrow
            key={x}
            x1={645} y1={258} x2={x} y2={356}
            tone={ids[i] === "svcB" && seq ? "accent" : "default"}
            primary={ids[i] === "svcB" && seq}
            animated={ids[i] === "svcB" && seq}
            step={ids[i] === "svcB" && seq ? 5 : undefined}
            latency={ids[i] === "svcB" && seq ? "<5ms" : undefined}
            dim={dimEdge("lb", ids[i])}
          />
        );
      })}

      {/* ── 5. Observability ──────────────────────── */}
      <Service
        x={60}  y={460} w={140} h={48}
        label="Prometheus" sublabel="metrics · alerts"
        tone="default" dim={dim("prom")}
        info="Scrapes /actuator/prometheus every 15s."
      />
      <Service
        x={220} y={460} w={140} h={48}
        label="Actuator" sublabel="health · info"
        tone="default" dim={mode === "failure"}
        info="Spring Boot Actuator exposes /health, /info, /metrics."
      />
      <Service
        x={380} y={460} w={140} h={48}
        label="WS Dashboard" sublabel="live traffic tail"
        tone="default" dim={mode === "failure"}
        info="WebSocket fan-out — live request tail used during incidents."
      />
      <Service
        x={540} y={460} w={140} h={48}
        label="Centralized Log" sublabel="ELK / Loki"
        tone="default" dim={mode === "failure"}
        info="Structured JSON logs shipped via Filebeat to ELK."
      />
      <Datastore
        x={710} y={458} w={130} h={52}
        label="Load test" sublabel="JMeter · k6"
        tone="default" dim={mode === "failure"}
        info="JMeter & k6 scripts validate 10K+ RPS soak."
      />

      {/* Backend → Observability (always thin & dashed) */}
      {[120, 280, 440].map((x, i) => (
        <FlowArrow
          key={x}
          x1={x} y1={404} x2={[130, 290, 450][i]} y2={460}
          tone="muted"
          dim={mode === "failure"}
        />
      ))}

      {/* Trace particle — animates the full happy path during sequence mode */}
      {seq && (
        <TraceParticle
          playKey={playKey}
          duration={5}
          tone="accent"
          path={[
            "M 440 108",                 // gateway top
            "L 765 133",                 // → auth
            "L 150 243",                 // → router
            "L 395 232",                 // → CB
            "L 645 232",                 // → LB
            "L 280 380",                 // → svc B
          ].join(" ")}
        />
      )}

      {/* Trace particle — failure path: CB trips → retry → still fails → rate limiter sheds */}
      {fail && (
        <TraceParticle
          playKey={playKey}
          duration={6}
          tone="failure"
          path={[
            "M 440 108",                 // gateway
            "L 200 133",                 // → rate limiter
            "L 395 232",                 // → CB
            "L 395 289",                 // → retry (fails)
            "L 530 133",                 // → back to gateway / shed
          ].join(" ")}
        />
      )}
    </DiagramFrame>
  );
}

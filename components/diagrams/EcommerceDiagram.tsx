"use client";

import {
  Band,
  Datastore,
  DiagramFrame,
  External,
  FlowArrow,
  Gateway,
  Service,
  TraceParticle,
} from "./primitives";
import type { DiagramMode } from "./RouterDiagram";

/**
 * Ecommerce backend (Spring Boot · MySQL · Stripe).
 *
 * Primary trace: Web → REST API → Order Service → Stripe + JPA → MySQL
 *
 * No failure mode (the system has no resilience layer worth highlighting —
 * showing a fake one would mislead).
 */
export default function EcommerceDiagram({
  mode = "topology",
  playKey = 0,
}: {
  mode?: DiagramMode;
  playKey?: number;
}) {
  const seq = mode === "sequence";

  const onPrimary = (id: string) =>
    ["web", "restApi", "auth", "order", "jpa", "mysql", "stripe"].includes(id);

  const dim = (id: string) => (seq ? !onPrimary(id) : false);
  const dimEdge = (...ids: string[]) => (seq ? ids.some((id) => dim(id)) : false);

  return (
    <DiagramFrame viewBox="0 0 880 540" height={540}>
      <Band y={0}   width={880} height={86}  label="client applications" />
      <Band y={86}  width={880} height={94}  label="api gateway" />
      <Band y={180} width={880} height={150} label="business logic" />
      <Band y={330} width={880} height={94}  label="data access layer" />
      <Band y={424} width={880} height={116} label="infrastructure" />

      {/* ── 1. Clients ─────────────────────────────── */}
      <External x={130} y={26} w={170} h={50}
        label="Web Frontend" sublabel="React · Browser"
        tone={seq ? "accent" : "default"}
        dim={dim("web")}
        info="Customer-facing storefront."
      />
      <External x={355} y={26} w={170} h={50}
        label="Mobile App" sublabel="iOS · Android"
        dim={seq && !dim("web")}
        info="Native mobile clients."
      />
      <External x={580} y={26} w={170} h={50}
        label="Admin Dashboard" sublabel="Management UI"
        dim={seq && !dim("web")}
        info="Internal admin console."
      />

      {/* ── 2. API Gateway ────────────────────────── */}
      <Gateway x={210} y={108} w={230} h={52}
        label="Spring Boot REST API" sublabel="token · CORS · exceptions"
        tone={seq ? "accent" : "default"}
        dim={dim("restApi")}
        info="Single REST entrypoint. Token auth + CORS + global exception handler."
      />
      <Service x={490} y={108} w={180} h={52}
        label="Swagger UI" sublabel="OpenAPI · self-serve"
        tone="default" dim={seq}
        info="Self-serve API docs auto-generated from controllers."
      />
      {/* Clients → REST */}
      {[215, 440, 665].map((x, i) => (
        <FlowArrow key={x}
          x1={x} y1={76} x2={325} y2={108}
          tone={i === 0 && seq ? "accent" : "default"}
          primary={i === 0 && seq} animated={i === 0 && seq}
          step={i === 0 && seq ? 1 : undefined}
          latency={i === 0 && seq ? "<3ms" : undefined}
          dim={i !== 0 && seq}
        />
      ))}
      <FlowArrow x1={440} y1={134} x2={490} y2={134}
        tone="default" dim={seq} label="docs" />

      {/* ── 3. Business logic services ────────────── */}
      {[
        { id: "auth",    x: 30,  label: "Auth Service",    sub: "JWT · Validate" },
        { id: "user",    x: 174, label: "User Service",    sub: "Profile · Prefs" },
        { id: "product", x: 318, label: "Product Service", sub: "CRUD · Category" },
        { id: "cart",    x: 462, label: "Cart Service",    sub: "Add · Remove" },
        { id: "order",   x: 606, label: "Order Service",   sub: "Checkout · Pay" },
        { id: "wishlist",x: 750, label: "Wishlist Svc",    sub: "Save · Manage" },
      ].map((s) => (
        <Service
          key={s.id}
          x={s.x} y={210} w={120} h={56}
          label={s.label} sublabel={s.sub}
          tone={(s.id === "order" || s.id === "auth") && seq ? "accent" : "default"}
          dim={dim(s.id)}
          info={`${s.label} · Spring Boot · JPA`}
        />
      ))}
      {/* REST → 6 services. In sequence mode, both Auth (validate JWT) and
          Order (handle checkout) participate in the request path. */}
      {[90, 234, 378, 522, 666, 810].map((x, i) => {
        const ids = ["auth", "user", "product", "cart", "order", "wishlist"];
        const isAuth  = ids[i] === "auth";
        const isOrder = ids[i] === "order";
        const inFlow  = (isAuth || isOrder) && seq;
        return (
          <FlowArrow key={x}
            x1={325} y1={160} x2={x} y2={210}
            tone={inFlow ? "accent" : "default"}
            primary={inFlow} animated={inFlow}
            step={isAuth && seq ? 2 : isOrder && seq ? 3 : undefined}
            label={isAuth && seq ? "validate" : isOrder && seq ? "route" : undefined}
            latency={isAuth && seq ? "<1ms" : undefined}
            dim={dimEdge("restApi", ids[i])}
          />
        );
      })}

      {/* ── 4. Data access ────────────────────────── */}
      <Service
        x={170} y={350} w={500} h={50}
        label="Spring Data JPA / Hibernate"
        sublabel="entities · repositories · transactions"
        tone={seq ? "accent" : "default"}
        dim={dim("jpa")}
        info="ORM layer. Connection pooling via HikariCP."
      />
      {/* 6 Services → JPA — Order persists AFTER Stripe authorises payment */}
      {[90, 234, 378, 522, 666, 810].map((x, i) => {
        const ids = ["auth", "user", "product", "cart", "order", "wishlist"];
        const isOrder = ids[i] === "order";
        return (
          <FlowArrow key={x}
            x1={x} y1={266} x2={420} y2={350}
            tone={isOrder && seq ? "accent" : "default"}
            primary={isOrder && seq} animated={isOrder && seq}
            step={isOrder && seq ? 5 : undefined}
            label={isOrder && seq ? "persist" : undefined}
            dim={dimEdge(ids[i], "jpa")}
          />
        );
      })}

      {/* ── 5. Infrastructure ─────────────────────── */}
      <Datastore
        x={140} y={444} w={180} h={70}
        label="MySQL 8.0" sublabel="primary DB · schema: ecommerce"
        tone={seq ? "accent" : "default"}
        dim={dim("mysql")}
        info="Primary OLTP store. Backups via mysqldump nightly."
      />
      <External
        x={520} y={444} w={210} h={70}
        label="Stripe API" sublabel="Payments · Checkout Sessions"
        tone={seq ? "accent" : "default"}
        dim={dim("stripe")}
        info="Payment processor. Webhooks → Order Service for fulfillment."
      />
      {/* JPA → MySQL */}
      <FlowArrow x1={300} y1={400} x2={230} y2={444}
        tone={seq ? "accent" : "default"}
        primary={seq} animated={seq}
        step={seq ? 6 : undefined}
        latency={seq ? "<6ms" : undefined}
        dim={dimEdge("jpa", "mysql")}
      />
      {/* Order → Stripe — payment authorisation happens BEFORE persistence.
          Synchronous external call; if it fails the order is never persisted. */}
      <FlowArrow x1={666} y1={266} x2={625} y2={444}
        tone={seq ? "accent" : "async"}
        primary={seq} animated={seq}
        step={seq ? 4 : undefined}
        latency={seq ? "~250ms" : undefined}
        label="authorise"
        dim={dimEdge("order", "stripe")}
      />

      {/* Trace — full authenticated checkout.
          REST validates the JWT against Auth Service, then forwards to Order.
          Order blocks on Stripe authorisation before touching JPA. */}
      {seq && (
        <TraceParticle
          playKey={playKey}
          duration={7}
          tone="accent"
          path={[
            "M 215 51",   // 1. Web Frontend
            "L 325 134",  // 2. → REST API (with JWT in header)
            "L 90 238",   // 3. → Auth Service (validate JWT)
            "L 666 238",  // 4. → Order Service (route)
            "L 625 479",  // 5. → Stripe (authorise payment)
            "L 666 238",  // 6. → back to Order (on Stripe success)
            "L 420 375",  // 7. → JPA (persist)
            "L 230 479",  // 8. → MySQL (write)
          ].join(" ")}
        />
      )}
    </DiagramFrame>
  );
}

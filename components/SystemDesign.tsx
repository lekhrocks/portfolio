"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ─────────────────────────────────────────────────────────
   Shared SVG helpers
───────────────────────────────────────────────────────── */

function Node({
  x, y, w = 120, h = 40, label, sublabel, fill = "#1e293b", stroke = "#3b82f6", textColor = "#f0f4ff",
}: {
  x: number; y: number; w?: number; h?: number;
  label: string; sublabel?: string; fill?: string;
  stroke?: string; textColor?: string;
}) {
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h}
        rx={8} fill={fill} stroke={stroke} strokeWidth={1}
        style={{ filter: `drop-shadow(0 0 8px ${stroke}44)` }}
      />
      <text
        x={x + w / 2} y={y + (sublabel ? h / 2 - 4 : h / 2 + 1)}
        textAnchor="middle" fill={textColor}
        fontSize={11} fontWeight={600} fontFamily="monospace"
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={x + w / 2} y={y + h / 2 + 10}
          textAnchor="middle" fill="#64748b"
          fontSize={9} fontFamily="monospace"
        >
          {sublabel}
        </text>
      )}
    </g>
  );
}

function Arrow({
  x1, y1, x2, y2, color = "#3b82f6", label,
}: {
  x1: number; y1: number; x2: number; y2: number;
  color?: string; label?: string;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <defs>
        <marker
          id={`arrow-${color.replace("#", "")}`}
          markerWidth="8" markerHeight="8"
          refX="6" refY="3" orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={1.5} strokeDasharray="4 3"
        markerEnd={`url(#arrow-${color.replace("#", "")})`}
        opacity={0.7}
      />
      {label && (
        <text
          x={mx} y={my - 5}
          textAnchor="middle" fill={color}
          fontSize={8} fontFamily="monospace" opacity={0.8}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/* ─────────────────────────────────────────────────────────
   Diagram 1: Router Service Architecture (Redesigned)
───────────────────────────────────────────────────────── */
function RouterServiceDiagram() {
  return (
    <svg viewBox="0 0 860 540" className="w-full h-auto" style={{ maxHeight: 540 }}>
      <defs>
        <marker id="arr-blue"   markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" /></marker>
        <marker id="arr-cyan"   markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#06b6d4" /></marker>
        <marker id="arr-purple" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#8b5cf6" /></marker>
        <marker id="arr-green"  markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#10b981" /></marker>
        <marker id="arr-red"    markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#ef4444" /></marker>
        <marker id="arr-orange" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#f97316" /></marker>
      </defs>

      {/* Background */}
      <rect width="860" height="540" fill="#050510" rx={12} />

      {/* ── Layer bands — separators at 95, 195, 335, 435 ── */}
      <rect x={0} y={0}   width={860} height={95}  fill="rgba(59,130,246,0.04)"  />
      <rect x={0} y={95}  width={860} height={100} fill="rgba(6,182,212,0.04)"   />
      <rect x={0} y={195} width={860} height={140} fill="rgba(139,92,246,0.04)"  />
      <rect x={0} y={335} width={860} height={100} fill="rgba(16,185,129,0.04)"  />
      <rect x={0} y={435} width={860} height={105} fill="rgba(59,130,246,0.03)"  />

      {[95, 195, 335, 435].map(y => (
        <line key={y} x1={0} y1={y} x2={860} y2={y} stroke="#1e293b" strokeWidth={1} />
      ))}

      {/* Layer labels — 14px below each band top */}
      <text x={14} y={14}  fill="#3b82f6" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">CLIENT TIER</text>
      <text x={14} y={109} fill="#06b6d4" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">INGRESS LAYER</text>
      <text x={14} y={209} fill="#8b5cf6" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">ROUTING CORE</text>
      <text x={14} y={349} fill="#10b981" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">BACKEND TIER</text>
      <text x={14} y={449} fill="#3b82f6" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">OBSERVABILITY</text>

      {/* ── TIER 1: Clients ── */}
      {[
        { x: 100, label: "Web Client",       sub: "Browser" },
        { x: 290, label: "Mobile Client",    sub: "iOS / Android" },
        { x: 480, label: "API Consumer",     sub: "3rd Party" },
        { x: 665, label: "Internal Service", sub: "Microservice" },
      ].map(({ x, label, sub }) => (
        <g key={label}>
          <rect x={x} y={22} width={130} height={44} rx={8} fill="#0f172a" stroke="#3b82f6" strokeWidth={1} style={{ filter: "drop-shadow(0 0 6px #3b82f644)" }} />
          <text x={x+65} y={40} textAnchor="middle" fill="#e2e8f0" fontSize={11} fontWeight={600} fontFamily="monospace">{label}</text>
          <text x={x+65} y={55} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">{sub}</text>
        </g>
      ))}

      {/* Clients → Rate Limiter */}
      {[165, 355, 545, 730].map(x => (
        <line key={x} x1={x} y1={66} x2={430} y2={110} stroke="#3b82f6" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.5} markerEnd="url(#arr-blue)" />
      ))}
      <text x={560} y={90} fill="#3b82f644" fontSize={8} fontFamily="monospace">HTTP / WebSocket / gRPC</text>

      {/* ── TIER 2: Ingress ── */}
      <rect x={190} y={112} width={150} height={52} rx={8} fill="#0a1a2e" stroke="#06b6d4" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #06b6d444)" }} />
      <text x={265} y={133} textAnchor="middle" fill="#06b6d4" fontSize={12} fontWeight={700} fontFamily="monospace">Rate Limiter</text>
      <text x={265} y={150} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">Token Bucket Algorithm</text>

      <rect x={500} y={112} width={160} height={52} rx={8} fill="#0a1a2e" stroke="#06b6d4" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #06b6d444)" }} />
      <text x={580} y={133} textAnchor="middle" fill="#06b6d4" fontSize={12} fontWeight={700} fontFamily="monospace">Auth Middleware</text>
      <text x={580} y={150} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">JWT / API Key / OAuth2</text>

      <line x1={340} y1={138} x2={500} y2={138} stroke="#06b6d4" strokeWidth={1.5} markerEnd="url(#arr-cyan)" />
      <text x={420} y={132} textAnchor="middle" fill="#06b6d4" fontSize={8} fontFamily="monospace">pass</text>

      {/* ── TIER 3: Routing Core ── */}
      {/* Router Engine */}
      <rect x={60} y={222} width={165} height={52} rx={8} fill="#130f2d" stroke="#8b5cf6" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #8b5cf644)" }} />
      <text x={143} y={243} textAnchor="middle" fill="#c4b5fd" fontSize={12} fontWeight={700} fontFamily="monospace">Router Engine</text>
      <text x={143} y={259} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">Regex Rule Matching</text>
      <text x={143} y={269} textAnchor="middle" fill="#374151" fontSize={8} fontFamily="monospace">Path · Header · Method</text>

      {/* Circuit Breaker */}
      <rect x={295} y={218} width={145} height={50} rx={8} fill="#1a0f0f" stroke="#ef4444" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #ef444444)" }} />
      <text x={368} y={239} textAnchor="middle" fill="#fca5a5" fontSize={12} fontWeight={700} fontFamily="monospace">Circuit Breaker</text>
      <text x={368} y={255} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">CLOSED · OPEN · HALF</text>

      {/* Retry + Backoff */}
      <rect x={295} y={282} width={145} height={44} rx={8} fill="#1a1200" stroke="#f97316" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #f9731644)" }} />
      <text x={368} y={301} textAnchor="middle" fill="#fdba74" fontSize={12} fontWeight={700} fontFamily="monospace">Retry + Backoff</text>
      <text x={368} y={316} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">Exponential · Jitter</text>

      {/* Load Balancer */}
      <rect x={510} y={228} width={165} height={52} rx={8} fill="#130f2d" stroke="#8b5cf6" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #8b5cf644)" }} />
      <text x={593} y={249} textAnchor="middle" fill="#c4b5fd" fontSize={12} fontWeight={700} fontFamily="monospace">Load Balancer</text>
      <text x={593} y={265} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">Round Robin · Random</text>
      <text x={593} y={275} textAnchor="middle" fill="#374151" fontSize={8} fontFamily="monospace">Least Connections</text>

      {/* Auth → Router Engine */}
      <line x1={500} y1={160} x2={210} y2={222} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#arr-purple)" />
      <text x={340} y={183} textAnchor="middle" fill="#8b5cf6" fontSize={8} fontFamily="monospace">route</text>

      {/* Router → Circuit Breaker */}
      <line x1={225} y1={248} x2={295} y2={243} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#arr-purple)" />

      {/* Circuit Breaker → Retry */}
      <line x1={368} y1={268} x2={368} y2={282} stroke="#ef4444" strokeWidth={1.2} strokeDasharray="3 2" markerEnd="url(#arr-red)" />
      <text x={382} y={277} fill="#ef4444" fontSize={8} fontFamily="monospace">fail</text>

      {/* Circuit Breaker → Load Balancer */}
      <line x1={440} y1={243} x2={510} y2={252} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#arr-purple)" />
      <text x={475} y={241} textAnchor="middle" fill="#8b5cf6" fontSize={8} fontFamily="monospace">allow</text>

      {/* ── TIER 4: Backend Services ── */}
      {[
        { x: 80,  port: ":8081", label: "Service A" },
        { x: 240, port: ":8082", label: "Service B" },
        { x: 400, port: ":8083", label: "Service C" },
        { x: 560, port: ":8084", label: "Service D" },
        { x: 720, port: ":8085", label: "Service E" },
      ].map(({ x, port, label }) => (
        <g key={label}>
          <rect x={x} y={358} width={110} height={44} rx={8} fill="#0a1f14" stroke="#10b981" strokeWidth={1} style={{ filter: "drop-shadow(0 0 6px #10b98133)" }} />
          <text x={x+55} y={377} textAnchor="middle" fill="#6ee7b7" fontSize={11} fontWeight={600} fontFamily="monospace">{label}</text>
          <text x={x+55} y={392} textAnchor="middle" fill="#374151" fontSize={9} fontFamily="monospace">{port}</text>
        </g>
      ))}

      {/* Load Balancer → Services */}
      {[135, 295, 455, 615, 775].map((x, i) => (
        <line key={i} x1={593} y1={280} x2={x} y2={358} stroke="#10b981" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.6} markerEnd="url(#arr-green)" />
      ))}

      {/* ── TIER 5: Observability ── */}
      {[
        { x: 60,  label: "Prometheus",     sub: "Metrics / Alerts",  color: "#f97316" },
        { x: 210, label: "Spring Actuator", sub: "Health / Info",    color: "#06b6d4" },
        { x: 365, label: "WS Dashboard",   sub: "Live Traffic View", color: "#8b5cf6" },
        { x: 515, label: "Centralized Log", sub: "ELK / Loki",       color: "#10b981" },
        { x: 665, label: "Load Testing",   sub: "10K+ RPS · 1M+ req", color: "#f59e0b" },
      ].map(({ x, label, sub, color }) => (
        <g key={label}>
          <rect x={x} y={458} width={130} height={44} rx={8} fill="#0a0a1a" stroke={color} strokeWidth={1} opacity={0.9} />
          <text x={x+65} y={477} textAnchor="middle" fill={color} fontSize={10} fontWeight={600} fontFamily="monospace">{label}</text>
          <text x={x+65} y={491} textAnchor="middle" fill="#475569" fontSize={8} fontFamily="monospace">{sub}</text>
        </g>
      ))}

      {/* Services → Observability */}
      {[135, 295, 455].map((x, i) => (
        <line key={i} x1={x} y1={402} x2={[125, 275, 430][i]} y2={458} stroke="#1e293b" strokeWidth={1} strokeDasharray="3 3" opacity={0.4} />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   Diagram 2: Microservices + Kafka Event Pipeline (Redesigned)
───────────────────────────────────────────────────────── */
function MicroservicesKafkaDiagram() {
  // Band separators at: 90, 205, 355, 465 — total height 565
  // Each label sits at bandTop+13; each first node at bandTop+25 (12px breathing room below label)
  return (
    <svg viewBox="0 0 900 580" className="w-full h-auto" style={{ maxHeight: 580 }}>
      <defs>
        <marker id="mk-blue"   markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" /></marker>
        <marker id="mk-cyan"   markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#06b6d4" /></marker>
        <marker id="mk-purple" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#8b5cf6" /></marker>
        <marker id="mk-green"  markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#10b981" /></marker>
        <marker id="mk-orange" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#f97316" /></marker>
        <marker id="mk-slate"  markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569" /></marker>
      </defs>

      {/* Background */}
      <rect width="900" height="580" fill="#050510" rx={12} />

      {/* ── Layer bands — separators at 90, 205, 370, 480 ── */}
      <rect x={0} y={0}   width={900} height={90}  fill="rgba(6,182,212,0.04)"   />
      <rect x={0} y={90}  width={900} height={115} fill="rgba(139,92,246,0.04)"  />
      <rect x={0} y={205} width={900} height={165} fill="rgba(16,185,129,0.05)"  />
      <rect x={0} y={370} width={900} height={110} fill="rgba(249,115,22,0.04)"  />
      <rect x={0} y={480} width={900} height={100} fill="rgba(59,130,246,0.03)"  />

      {/* Separators */}
      {[90, 205, 370, 480].map(y => (
        <line key={y} x1={0} y1={y} x2={900} y2={y} stroke="#1e293b" strokeWidth={1} />
      ))}

      {/* Layer labels — 13px below band top */}
      <text x={14} y={13}  fill="#06b6d4" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">INGRESS</text>
      <text x={14} y={103} fill="#8b5cf6" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">PRODUCER SERVICES</text>
      <text x={14} y={218} fill="#10b981" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">KAFKA EVENT BUS</text>
      <text x={14} y={383} fill="#f97316" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">CONSUMER SERVICES</text>
      <text x={14} y={493} fill="#3b82f6" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">DATASTORES &amp; OBSERVABILITY</text>

      {/* ── INGRESS ROW — nodes start at y=22 ── */}
      <rect x={80}  y={22} width={170} height={48} rx={8} fill="#0a1a2e" stroke="#06b6d4" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #06b6d444)" }} />
      <text x={165} y={42} textAnchor="middle" fill="#06b6d4" fontSize={12} fontWeight={700} fontFamily="monospace">API Gateway</text>
      <text x={165} y={58} textAnchor="middle" fill="#475569" fontSize={9}  fontFamily="monospace">Auth · Rate Limit · Route</text>

      <rect x={310} y={22} width={160} height={48} rx={8} fill="#0a1a2e" stroke="#06b6d4" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #06b6d444)" }} />
      <text x={390} y={42} textAnchor="middle" fill="#06b6d4" fontSize={12} fontWeight={700} fontFamily="monospace">Load Balancer</text>
      <text x={390} y={58} textAnchor="middle" fill="#475569" fontSize={9}  fontFamily="monospace">K8s Ingress · Helm</text>

      <rect x={540} y={22} width={150} height={48} rx={8} fill="#0a1a2e" stroke="#06b6d4" strokeWidth={1.2} />
      <text x={615} y={42} textAnchor="middle" fill="#67e8f9" fontSize={12} fontWeight={700} fontFamily="monospace">CI / CD Pipeline</text>
      <text x={615} y={58} textAnchor="middle" fill="#475569" fontSize={9}  fontFamily="monospace">GitHub Actions · Jenkins</text>

      <rect x={760} y={22} width={120} height={48} rx={8} fill="#0a1a2e" stroke="#06b6d4" strokeWidth={1.2} />
      <text x={820} y={42} textAnchor="middle" fill="#67e8f9" fontSize={12} fontWeight={700} fontFamily="monospace">Docker</text>
      <text x={820} y={58} textAnchor="middle" fill="#475569" fontSize={9}  fontFamily="monospace">Container Registry</text>

      <line x1={250} y1={46} x2={310} y2={46} stroke="#06b6d4" strokeWidth={1.5} markerEnd="url(#mk-cyan)" />
      <line x1={470} y1={46} x2={540} y2={46} stroke="#06b6d4" strokeWidth={1} strokeDasharray="3 3" markerEnd="url(#mk-cyan)" />
      <line x1={690} y1={46} x2={760} y2={46} stroke="#06b6d4" strokeWidth={1} strokeDasharray="3 3" markerEnd="url(#mk-cyan)" />

      {/* ── PRODUCER SERVICES — nodes start at y=112 ── */}
      {[
        { x: 30,  label: "Billing",      sub: "PayPal · Stripe",  color: "#8b5cf6" },
        { x: 205, label: "Payment",      sub: "Stripe · Billpay", color: "#8b5cf6" },
        { x: 380, label: "Checkout",     sub: "Cart · Orders",    color: "#8b5cf6" },
        { x: 555, label: "Auth Service", sub: "OAuth2 · JWT",     color: "#ec4899" },
        { x: 730, label: "User Service", sub: "Profile · Prefs",  color: "#8b5cf6" },
      ].map(({ x, label, sub, color }) => (
        <g key={label}>
          <rect x={x} y={112} width={145} height={52} rx={8} fill="#130f2d" stroke={color} strokeWidth={1.5} style={{ filter: `drop-shadow(0 0 6px ${color}33)` }} />
          <text x={x+72} y={134} textAnchor="middle" fill="#e2e8f0" fontSize={11} fontWeight={700} fontFamily="monospace">{label}</text>
          <text x={x+72} y={150} textAnchor="middle" fill="#475569" fontSize={9}  fontFamily="monospace">{sub}</text>
          <text x={x+72} y={160} textAnchor="middle" fill="#374151" fontSize={8}  fontFamily="monospace">Spring Boot · JPA</text>
        </g>
      ))}

      {/* LB → Producers */}
      {[102, 277, 452, 627, 802].map((x, i) => (
        <line key={i} x1={390} y1={70} x2={x} y2={112} stroke="#8b5cf6" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.5} markerEnd="url(#mk-purple)" />
      ))}

      {/* ── KAFKA CLUSTER — rect starts at y=240, well below label at y=218 ── */}
      <rect x={50} y={240} width={800} height={105} rx={10} fill="#060f06" stroke="#10b981" strokeWidth={2} style={{ filter: "drop-shadow(0 0 16px #10b98133)" }} />
      <text x={450} y={263} textAnchor="middle" fill="#10b981" fontSize={14} fontWeight={700} fontFamily="monospace">Apache Kafka Cluster</text>
      <text x={450} y={279} textAnchor="middle" fill="#374151" fontSize={9}  fontFamily="monospace">Partitioned · Replicated · Fault-Tolerant · Horizontally Scalable · Replayable</text>

      {/* Topic pills — 5 × 140px with 20px gaps, starting at x=60 (all inside rect x=50…850) */}
      {[
        { x: 60,  label: "billing-events",      color: "#8b5cf6" },
        { x: 220, label: "payment-events",      color: "#3b82f6" },
        { x: 380, label: "checkout-events",     color: "#06b6d4" },
        { x: 540, label: "notification-events", color: "#f97316" },
        { x: 700, label: "audit-events",        color: "#10b981" },
      ].map(({ x, label, color }) => (
        <g key={label}>
          <rect x={x} y={288} width={140} height={30} rx={15} fill="rgba(0,0,0,0.4)" stroke={color} strokeWidth={1} />
          <text x={x+70} y={308} textAnchor="middle" fill={color} fontSize={9} fontWeight={600} fontFamily="monospace">{label}</text>
        </g>
      ))}

      {/* Producers → Kafka */}
      {[102, 277, 452, 627, 802].map((x, i) => (
        <line key={i} x1={x} y1={164} x2={[147, 317, 487, 652, 815][i]} y2={240} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#mk-green)" />
      ))}
      <text x={90}  y={207} fill="#10b98188" fontSize={8} fontFamily="monospace">publish</text>
      <text x={600} y={207} fill="#10b98188" fontSize={8} fontFamily="monospace">publish</text>

      {/* ── CONSUMER SERVICES — nodes start at y=390 ── */}
      {[
        { x: 30,  label: "Billing Consumer",    sub: "DLQ · Retry",        color: "#f97316" },
        { x: 225, label: "Payment Processor",   sub: "Idempotent",         color: "#f97316" },
        { x: 420, label: "Notification Worker", sub: "Email · SMS · Push", color: "#f97316" },
        { x: 615, label: "Audit Service",       sub: "Compliance · Log",   color: "#f97316" },
      ].map(({ x, label, sub, color }) => (
        <g key={label}>
          <rect x={x} y={390} width={165} height={52} rx={8} fill="#1a1000" stroke={color} strokeWidth={1.5} style={{ filter: `drop-shadow(0 0 6px ${color}33)` }} />
          <text x={x+82} y={412} textAnchor="middle" fill="#fed7aa" fontSize={11} fontWeight={700} fontFamily="monospace">{label}</text>
          <text x={x+82} y={428} textAnchor="middle" fill="#475569" fontSize={9}  fontFamily="monospace">{sub}</text>
          <text x={x+82} y={438} textAnchor="middle" fill="#374151" fontSize={8}  fontFamily="monospace">Consumer Group</text>
        </g>
      ))}

      {/* Kafka → Consumers */}
      {[[147, 112], [317, 307], [487, 502], [652, 697]].map(([kx, cx], i) => (
        <line key={i} x1={kx} y1={345} x2={cx} y2={390} stroke="#f97316" strokeWidth={1.5} markerEnd="url(#mk-orange)" />
      ))}
      <text x={200} y={370} fill="#f9731688" fontSize={8} fontFamily="monospace">consume</text>
      <text x={580} y={370} fill="#f9731688" fontSize={8} fontFamily="monospace">consume</text>

      {/* ── DATASTORES & OBSERVABILITY — nodes start at y=500 ── */}
      {[
        { x: 30,  label: "PostgreSQL", sub: "Billing DB",      color: "#3b82f6" },
        { x: 155, label: "MySQL",      sub: "Payment DB",      color: "#3b82f6" },
        { x: 280, label: "MongoDB",    sub: "Orders",          color: "#22c55e" },
        { x: 395, label: "Redis",      sub: "Cache · Session", color: "#ef4444" },
        { x: 510, label: "Elastic",    sub: "Logs · Search",   color: "#f59e0b" },
        { x: 630, label: "Prometheus", sub: "Metrics",         color: "#f97316" },
        { x: 750, label: "Datadog",    sub: "APM · Traces",    color: "#8b5cf6" },
      ].map(({ x, label, sub, color }) => (
        <g key={label}>
          <rect x={x} y={500} width={108} height={44} rx={8} fill="#0a0a1a" stroke={color} strokeWidth={1} />
          <text x={x+54} y={519} textAnchor="middle" fill={color}    fontSize={10} fontWeight={600} fontFamily="monospace">{label}</text>
          <text x={x+54} y={534} textAnchor="middle" fill="#374151"  fontSize={8}  fontFamily="monospace">{sub}</text>
        </g>
      ))}

      {/* Consumers → DBs */}
      <line x1={112} y1={442} x2={84}  y2={500} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" markerEnd="url(#mk-slate)" />
      <line x1={307} y1={442} x2={209} y2={500} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" markerEnd="url(#mk-slate)" />
      <line x1={502} y1={442} x2={450} y2={500} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" markerEnd="url(#mk-slate)" />
      <line x1={697} y1={442} x2={684} y2={500} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" markerEnd="url(#mk-slate)" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   Diagram 3: Ecommerce Backend Architecture
───────────────────────────────────────────────────────── */
function EcommerceArchDiagram() {
  // 5 bands — separators at 90, 195, 345, 440 — total height 540
  // Service box width=120, gap=24 → 6 boxes starting at x=20
  // Service centers: 80, 224, 368, 512, 656, 800
  return (
    <svg viewBox="0 0 880 540" className="w-full h-auto" style={{ maxHeight: 540 }}>
      <defs>
        <marker id="ec-blue"   markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" /></marker>
        <marker id="ec-cyan"   markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#06b6d4" /></marker>
        <marker id="ec-purple" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#8b5cf6" /></marker>
        <marker id="ec-green"  markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#10b981" /></marker>
        <marker id="ec-orange" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#f97316" /></marker>
        <marker id="ec-pink"   markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#ec4899" /></marker>
      </defs>

      <rect width="880" height="540" fill="#050510" rx={12} />

      {/* ── Layer bands ── */}
      <rect x={0} y={0}   width={880} height={90}  fill="rgba(59,130,246,0.04)"  />
      <rect x={0} y={90}  width={880} height={105} fill="rgba(6,182,212,0.04)"   />
      <rect x={0} y={195} width={880} height={150} fill="rgba(139,92,246,0.04)"  />
      <rect x={0} y={345} width={880} height={95}  fill="rgba(16,185,129,0.04)"  />
      <rect x={0} y={440} width={880} height={100} fill="rgba(59,130,246,0.03)"  />

      {[90, 195, 345, 440].map(y => (
        <line key={y} x1={0} y1={y} x2={880} y2={y} stroke="#1e293b" strokeWidth={1} />
      ))}

      {/* Layer labels — 13px below band top */}
      <text x={14} y={13}  fill="#3b82f6" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">CLIENT APPLICATIONS</text>
      <text x={14} y={103} fill="#06b6d4" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">API GATEWAY</text>
      <text x={14} y={208} fill="#8b5cf6" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">BUSINESS LOGIC LAYER</text>
      <text x={14} y={358} fill="#10b981" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">DATA ACCESS LAYER</text>
      <text x={14} y={453} fill="#3b82f6" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">INFRASTRUCTURE</text>

      {/* ── CLIENT APPLICATIONS — y=22, h=48 ── */}
      {[
        { x: 145, label: "Web Frontend",    sub: "React / Browser" },
        { x: 360, label: "Mobile App",      sub: "iOS / Android" },
        { x: 575, label: "Admin Dashboard", sub: "Management UI" },
      ].map(({ x, label, sub }) => (
        <g key={label}>
          <rect x={x} y={22} width={160} height={48} rx={8} fill="#0f172a" stroke="#3b82f6" strokeWidth={1} style={{ filter: "drop-shadow(0 0 6px #3b82f644)" }} />
          <text x={x+80} y={42} textAnchor="middle" fill="#e2e8f0" fontSize={11} fontWeight={600} fontFamily="monospace">{label}</text>
          <text x={x+80} y={58} textAnchor="middle" fill="#475569" fontSize={9}  fontFamily="monospace">{sub}</text>
        </g>
      ))}

      {/* ── API GATEWAY — y=112, h=52 ── */}
      <rect x={195} y={112} width={215} height={52} rx={8} fill="#0a1a2e" stroke="#06b6d4" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #06b6d444)" }} />
      <text x={302} y={133} textAnchor="middle" fill="#06b6d4" fontSize={12} fontWeight={700} fontFamily="monospace">Spring Boot REST API</text>
      <text x={302} y={149} textAnchor="middle" fill="#475569" fontSize={9}  fontFamily="monospace">Token Auth · CORS · Exception Handler</text>

      <rect x={495} y={112} width={170} height={52} rx={8} fill="#0a1a2e" stroke="#06b6d4" strokeWidth={1.2} />
      <text x={580} y={133} textAnchor="middle" fill="#67e8f9" fontSize={12} fontWeight={700} fontFamily="monospace">Swagger UI</text>
      <text x={580} y={149} textAnchor="middle" fill="#475569" fontSize={9}  fontFamily="monospace">OpenAPI · Self-serve Docs</text>

      {/* Clients → Spring Boot */}
      {[225, 440, 655].map((x, i) => (
        <line key={i} x1={x} y1={70} x2={302} y2={112} stroke="#3b82f6" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.6} markerEnd="url(#ec-blue)" />
      ))}
      {/* Spring Boot → Swagger */}
      <line x1={410} y1={138} x2={495} y2={138} stroke="#06b6d4" strokeWidth={1.2} strokeDasharray="3 3" markerEnd="url(#ec-cyan)" />
      <text x={453} y={132} textAnchor="middle" fill="#06b6d488" fontSize={8} fontFamily="monospace">docs</text>

      {/* ── BUSINESS LOGIC — 6 services, y=222, h=52 ── */}
      {[
        { x: 20,  label: "Auth Service",    sub: "Token · Validate", color: "#ec4899" },
        { x: 164, label: "User Service",    sub: "Profile · Prefs",  color: "#8b5cf6" },
        { x: 308, label: "Product Service", sub: "CRUD · Category",  color: "#8b5cf6" },
        { x: 452, label: "Cart Service",    sub: "Add · Remove",     color: "#8b5cf6" },
        { x: 596, label: "Order Service",   sub: "Checkout · Pay",   color: "#f97316" },
        { x: 740, label: "Wishlist Svc",    sub: "Save · Manage",    color: "#8b5cf6" },
      ].map(({ x, label, sub, color }) => (
        <g key={label}>
          <rect x={x} y={222} width={120} height={52} rx={8} fill="#130f2d" stroke={color} strokeWidth={1.5} style={{ filter: `drop-shadow(0 0 6px ${color}33)` }} />
          <text x={x+60} y={243} textAnchor="middle" fill="#e2e8f0" fontSize={10} fontWeight={700} fontFamily="monospace">{label}</text>
          <text x={x+60} y={258} textAnchor="middle" fill="#475569" fontSize={8.5} fontFamily="monospace">{sub}</text>
          <text x={x+60} y={269} textAnchor="middle" fill="#374151" fontSize={8}   fontFamily="monospace">Spring Boot · JPA</text>
        </g>
      ))}

      {/* Spring Boot → 6 services */}
      {[80, 224, 368, 512, 656, 800].map((x, i) => (
        <line key={i} x1={302} y1={164} x2={x} y2={222} stroke="#8b5cf6" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.5} markerEnd="url(#ec-purple)" />
      ))}

      {/* ── DATA ACCESS — y=368, h=44 ── */}
      <rect x={165} y={368} width={500} height={44} rx={8} fill="#0a1f14" stroke="#10b981" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #10b98133)" }} />
      <text x={415} y={387} textAnchor="middle" fill="#10b981" fontSize={12} fontWeight={700} fontFamily="monospace">Spring Data JPA / Hibernate</text>
      <text x={415} y={403} textAnchor="middle" fill="#475569" fontSize={9}  fontFamily="monospace">Entities · Repositories · Transactions · ORM</text>

      {/* 6 Services → JPA (converge) */}
      {[80, 224, 368, 512, 656, 800].map((x, i) => (
        <line key={i} x1={x} y1={274} x2={415} y2={368} stroke="#10b981" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.45} markerEnd="url(#ec-green)" />
      ))}

      {/* ── INFRASTRUCTURE — y=460, h=52 ── */}
      <rect x={130} y={460} width={210} height={52} rx={8} fill="#0a0a1a" stroke="#3b82f6" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #3b82f633)" }} />
      <text x={235} y={481} textAnchor="middle" fill="#60a5fa" fontSize={12} fontWeight={700} fontFamily="monospace">MySQL 8.0</text>
      <text x={235} y={497} textAnchor="middle" fill="#475569" fontSize={9}  fontFamily="monospace">Primary DB · Schema: ecommerce</text>

      <rect x={520} y={460} width={220} height={52} rx={8} fill="#0a0a1a" stroke="#8b5cf6" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #8b5cf633)" }} />
      <text x={630} y={481} textAnchor="middle" fill="#c4b5fd" fontSize={12} fontWeight={700} fontFamily="monospace">Stripe API</text>
      <text x={630} y={497} textAnchor="middle" fill="#475569" fontSize={9}  fontFamily="monospace">Payments · Checkout Sessions</text>

      {/* JPA → MySQL */}
      <line x1={340} y1={412} x2={235} y2={460} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#ec-blue)" />

      {/* Order Service → Stripe (direct, bypasses JPA) */}
      <line x1={656} y1={274} x2={630} y2={460} stroke="#f97316" strokeWidth={1.5} strokeDasharray="5 3" markerEnd="url(#ec-orange)" />
      <text x={672} y={375} fill="#f9731699" fontSize={8} fontFamily="monospace">payment</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Section
───────────────────────────────────────────────────────── */
const diagrams = [
  {
    id: "router",
    title: "Router Service Architecture",
    subtitle: "API Gateway · Load Balancer · Circuit Breaker · Rate Limiter",
    description:
      "End-to-end architecture of the high-performance request router. Showcases multi-layer design with ingress controls, resilience patterns, dynamic load balancing, and real-time observability.",
    component: RouterServiceDiagram,
    color: "from-blue-500 to-cyan-400",
    borderColor: "border-blue-500/20",
    tags: ["API Gateway", "Load Balancing", "Circuit Breaker", "Rate Limiting", "Observability", "10K+ RPS"],
  },
  {
    id: "microservices",
    title: "Microservices + Kafka Pipeline",
    subtitle: "Event-Driven Architecture · Distributed Payments System",
    description:
      "Production architecture at AppDirect. Kafka-powered event pipeline replacing RabbitMQ — achieving 4x throughput. Shows service decomposition, topic strategy, consumer groups, and data stores.",
    component: MicroservicesKafkaDiagram,
    color: "from-green-500 to-cyan-400",
    borderColor: "border-green-500/20",
    tags: ["Kafka", "Event-Driven", "Microservices", "Payments", "4x Throughput", "Fault Tolerance"],
  },
  {
    id: "ecommerce",
    title: "Ecommerce Backend Architecture",
    subtitle: "Spring Boot · MySQL · Stripe · REST API",
    description:
      "Full-stack ecommerce backend built with Spring Boot. Covers client-to-database request flow across 6 domain services — Auth, User, Product, Cart, Order, and Wishlist — with Stripe payment integration and JPA data access.",
    component: EcommerceArchDiagram,
    color: "from-purple-500 to-pink-400",
    borderColor: "border-purple-500/20",
    tags: ["Spring Boot", "MySQL", "Stripe", "REST API", "JPA/Hibernate", "Swagger"],
  },
];

export default function SystemDesign() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  const ActiveDiagram = diagrams[active].component;

  return (
    <section id="architecture" className="section-padding bg-gradient-to-b from-transparent to-[#0a0a1a]/40">
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
            05 / System Design
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-title text-white mb-4"
          >
            Architecture Diagrams
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto"
          >
            Deep-dive into the systems I&apos;ve designed and built — from API gateways to
            event-driven microservices handling millions of events per day
          </motion.p>
        </div>

        {/* Tab Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-3 mb-8 justify-center flex-wrap"
        >
          {diagrams.map((d, i) => (
            <button
              key={d.id}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                active === i
                  ? `bg-gradient-to-r ${d.color} text-white shadow-lg`
                  : "glass border border-white/8 text-slate-400 hover:text-white hover:border-white/15"
              }`}
            >
              {d.title}
            </button>
          ))}
        </motion.div>

        {/* Diagram Card */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`glass rounded-2xl border ${diagrams[active].borderColor} overflow-hidden`}
          style={{ boxShadow: "0 0 60px rgba(59,130,246,0.06)" }}
        >
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className={`font-bold text-base bg-gradient-to-r ${diagrams[active].color} bg-clip-text text-transparent`}>
                  {diagrams[active].title}
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">{diagrams[active].subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {diagrams[active].tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-xs font-mono glass border border-white/8 text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SVG Diagram */}
          <div className="p-4 sm:p-6 bg-gradient-to-br from-[#050510] to-[#0a0a1a]">
            <div className="rounded-xl overflow-hidden border border-white/5">
              <ActiveDiagram />
            </div>
          </div>

          {/* Description */}
          <div className="px-6 py-4 border-t border-white/5">
            <p className="text-slate-400 text-sm leading-relaxed">{diagrams[active].description}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

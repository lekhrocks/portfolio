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
    <svg viewBox="0 0 860 500" className="w-full h-auto" style={{ maxHeight: 500 }}>
      <defs>
        <marker id="arr-blue" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" />
        </marker>
        <marker id="arr-cyan" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#06b6d4" />
        </marker>
        <marker id="arr-purple" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#8b5cf6" />
        </marker>
        <marker id="arr-green" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
        </marker>
        <marker id="arr-red" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#ef4444" />
        </marker>
        <marker id="arr-orange" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#f97316" />
        </marker>
      </defs>

      {/* Background */}
      <rect width="860" height="500" fill="#050510" rx={12} />

      {/* ── Layer bands ── */}
      <rect x={0} y={0}   width={860} height={90}  fill="rgba(59,130,246,0.04)"  />
      <rect x={0} y={90}  width={860} height={100} fill="rgba(6,182,212,0.04)"   />
      <rect x={0} y={190} width={860} height={120} fill="rgba(139,92,246,0.04)"  />
      <rect x={0} y={310} width={860} height={100} fill="rgba(16,185,129,0.04)"  />
      <rect x={0} y={410} width={860} height={90}  fill="rgba(59,130,246,0.03)"  />

      {/* Layer labels */}
      <text x={14} y={20}  fill="#3b82f6" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">CLIENT TIER</text>
      <text x={14} y={108} fill="#06b6d4" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">INGRESS LAYER</text>
      <text x={14} y={208} fill="#8b5cf6" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">ROUTING CORE</text>
      <text x={14} y={328} fill="#10b981" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">BACKEND TIER</text>
      <text x={14} y={428} fill="#3b82f6" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">OBSERVABILITY</text>

      {/* Separators */}
      {[90, 190, 310, 410].map(y => (
        <line key={y} x1={0} y1={y} x2={860} y2={y} stroke="#1e293b" strokeWidth={1} />
      ))}

      {/* ── TIER 1: Clients (evenly spaced) ── */}
      {[
        { x: 100, label: "Web Client",       sub: "Browser" },
        { x: 290, label: "Mobile Client",    sub: "iOS / Android" },
        { x: 480, label: "API Consumer",     sub: "3rd Party" },
        { x: 665, label: "Internal Service", sub: "Microservice" },
      ].map(({ x, label, sub }) => (
        <g key={label}>
          <rect x={x} y={25} width={130} height={44} rx={8} fill="#0f172a" stroke="#3b82f6" strokeWidth={1} style={{ filter: "drop-shadow(0 0 6px #3b82f644)" }} />
          <text x={x + 65} y={44} textAnchor="middle" fill="#e2e8f0" fontSize={11} fontWeight={600} fontFamily="monospace">{label}</text>
          <text x={x + 65} y={58} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">{sub}</text>
        </g>
      ))}

      {/* Clients → Rate Limiter (straight down to center) */}
      {[165, 355, 545, 730].map(x => (
        <line key={x} x1={x} y1={69} x2={430} y2={100} stroke="#3b82f6" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.5} markerEnd="url(#arr-blue)" />
      ))}
      <text x={440} y={88} fill="#3b82f644" fontSize={8} fontFamily="monospace">HTTP / WebSocket / gRPC</text>

      {/* ── TIER 2: Ingress ── */}
      {/* Rate Limiter */}
      <rect x={190} y={103} width={150} height={48} rx={8} fill="#0a1a2e" stroke="#06b6d4" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #06b6d444)" }} />
      <text x={265} y={123} textAnchor="middle" fill="#06b6d4" fontSize={12} fontWeight={700} fontFamily="monospace">Rate Limiter</text>
      <text x={265} y={140} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">Token Bucket Algorithm</text>

      {/* Auth Middleware */}
      <rect x={500} y={103} width={160} height={48} rx={8} fill="#0a1a2e" stroke="#06b6d4" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #06b6d444)" }} />
      <text x={580} y={123} textAnchor="middle" fill="#06b6d4" fontSize={12} fontWeight={700} fontFamily="monospace">Auth Middleware</text>
      <text x={580} y={140} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">JWT / API Key / OAuth2</text>

      {/* Rate Limiter → Auth */}
      <line x1={340} y1={127} x2={500} y2={127} stroke="#06b6d4" strokeWidth={1.5} markerEnd="url(#arr-cyan)" />
      <text x={420} y={121} textAnchor="middle" fill="#06b6d4" fontSize={8} fontFamily="monospace">pass</text>

      {/* ── TIER 3: Routing Core ── */}
      {/* Router Engine — left */}
      <rect x={60} y={205} width={165} height={52} rx={8} fill="#130f2d" stroke="#8b5cf6" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #8b5cf644)" }} />
      <text x={143} y={226} textAnchor="middle" fill="#c4b5fd" fontSize={12} fontWeight={700} fontFamily="monospace">Router Engine</text>
      <text x={143} y={242} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">Regex Rule Matching</text>
      <text x={143} y={252} textAnchor="middle" fill="#374151" fontSize={8} fontFamily="monospace">Path · Header · Method</text>

      {/* Circuit Breaker */}
      <rect x={295} y={200} width={145} height={48} rx={8} fill="#1a0f0f" stroke="#ef4444" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #ef444444)" }} />
      <text x={368} y={221} textAnchor="middle" fill="#fca5a5" fontSize={12} fontWeight={700} fontFamily="monospace">Circuit Breaker</text>
      <text x={368} y={237} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">CLOSED · OPEN · HALF</text>

      {/* Retry + Backoff */}
      <rect x={295} y={260} width={145} height={44} rx={8} fill="#1a1200" stroke="#f97316" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #f9731644)" }} />
      <text x={368} y={279} textAnchor="middle" fill="#fdba74" fontSize={12} fontWeight={700} fontFamily="monospace">Retry + Backoff</text>
      <text x={368} y={294} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">Exponential · Jitter</text>

      {/* Load Balancer */}
      <rect x={510} y={215} width={165} height={52} rx={8} fill="#130f2d" stroke="#8b5cf6" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #8b5cf644)" }} />
      <text x={593} y={236} textAnchor="middle" fill="#c4b5fd" fontSize={12} fontWeight={700} fontFamily="monospace">Load Balancer</text>
      <text x={593} y={252} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">Round Robin · Random</text>
      <text x={593} y={262} textAnchor="middle" fill="#374151" fontSize={8} fontFamily="monospace">Least Connections</text>

      {/* Auth → Router Engine */}
      <line x1={500} y1={145} x2={200} y2={205} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#arr-purple)" />
      <text x={330} y={168} textAnchor="middle" fill="#8b5cf6" fontSize={8} fontFamily="monospace">route</text>

      {/* Router → Circuit Breaker */}
      <line x1={225} y1={231} x2={295} y2={224} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#arr-purple)" />

      {/* Circuit Breaker → Retry */}
      <line x1={368} y1={248} x2={368} y2={260} stroke="#ef4444" strokeWidth={1.2} strokeDasharray="3 2" markerEnd="url(#arr-red)" />
      <text x={380} y={256} fill="#ef4444" fontSize={8} fontFamily="monospace">fail</text>

      {/* Circuit Breaker → Load Balancer */}
      <line x1={440} y1={224} x2={510} y2={235} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#arr-purple)" />
      <text x={475} y={224} textAnchor="middle" fill="#8b5cf6" fontSize={8} fontFamily="monospace">allow</text>

      {/* ── TIER 4: Backend Services ── */}
      {[
        { x: 80,  port: ":8081", label: "Service A" },
        { x: 240, port: ":8082", label: "Service B" },
        { x: 400, port: ":8083", label: "Service C" },
        { x: 560, port: ":8084", label: "Service D" },
        { x: 720, port: ":8085", label: "Service E" },
      ].map(({ x, port, label }) => (
        <g key={label}>
          <rect x={x} y={325} width={110} height={44} rx={8} fill="#0a1f14" stroke="#10b981" strokeWidth={1} style={{ filter: "drop-shadow(0 0 6px #10b98133)" }} />
          <text x={x + 55} y={344} textAnchor="middle" fill="#6ee7b7" fontSize={11} fontWeight={600} fontFamily="monospace">{label}</text>
          <text x={x + 55} y={358} textAnchor="middle" fill="#374151" fontSize={9} fontFamily="monospace">{port}</text>
        </g>
      ))}

      {/* Load Balancer → Services */}
      {[135, 295, 455, 615, 775].map((x, i) => (
        <line key={i} x1={593} y1={267} x2={x} y2={325} stroke="#10b981" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.6} markerEnd="url(#arr-green)" />
      ))}

      {/* ── TIER 5: Observability ── */}
      {[
        { x: 60,  label: "Prometheus",    sub: "Metrics / Alerts",    color: "#f97316" },
        { x: 210, label: "Spring Actuator", sub: "Health / Info",      color: "#06b6d4" },
        { x: 365, label: "WS Dashboard",  sub: "Live Traffic View",    color: "#8b5cf6" },
        { x: 515, label: "Centralized Log", sub: "ELK / Loki",         color: "#10b981" },
        { x: 665, label: "Load Testing",  sub: "10K+ RPS · 1M+ req",  color: "#f59e0b" },
      ].map(({ x, label, sub, color }) => (
        <g key={label}>
          <rect x={x} y={425} width={130} height={44} rx={8} fill="#0a0a1a" stroke={color} strokeWidth={1} opacity={0.9} />
          <text x={x + 65} y={444} textAnchor="middle" fill={color} fontSize={10} fontWeight={600} fontFamily="monospace">{label}</text>
          <text x={x + 65} y={458} textAnchor="middle" fill="#475569" fontSize={8} fontFamily="monospace">{sub}</text>
        </g>
      ))}

      {/* Services → Observability arrows */}
      {[125, 295, 455].map((x, i) => (
        <line key={i} x1={x} y1={369} x2={[125, 275, 430][i]} y2={425} stroke="#1e293b" strokeWidth={1} strokeDasharray="3 3" opacity={0.4} />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   Diagram 2: Microservices + Kafka Event Pipeline (Redesigned)
───────────────────────────────────────────────────────── */
function MicroservicesKafkaDiagram() {
  return (
    <svg viewBox="0 0 900 540" className="w-full h-auto" style={{ maxHeight: 540 }}>
      <defs>
        <marker id="mk-blue"   markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" /></marker>
        <marker id="mk-cyan"   markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#06b6d4" /></marker>
        <marker id="mk-purple" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#8b5cf6" /></marker>
        <marker id="mk-green"  markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#10b981" /></marker>
        <marker id="mk-orange" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#f97316" /></marker>
        <marker id="mk-slate"  markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569" /></marker>
      </defs>

      {/* Background */}
      <rect width="900" height="540" fill="#050510" rx={12} />

      {/* Layer bands */}
      <rect x={0} y={0}   width={900} height={80}  fill="rgba(6,182,212,0.04)"   />
      <rect x={0} y={80}  width={900} height={110} fill="rgba(139,92,246,0.04)"  />
      <rect x={0} y={190} width={900} height={130} fill="rgba(16,185,129,0.05)"  />
      <rect x={0} y={320} width={900} height={110} fill="rgba(249,115,22,0.04)"  />
      <rect x={0} y={430} width={900} height={110} fill="rgba(59,130,246,0.03)"  />

      {/* Separators */}
      {[80, 190, 320, 430].map(y => (
        <line key={y} x1={0} y1={y} x2={900} y2={y} stroke="#1e293b" strokeWidth={1} />
      ))}

      {/* Layer Labels */}
      <text x={14} y={18}  fill="#06b6d4" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">INGRESS</text>
      <text x={14} y={98}  fill="#8b5cf6" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">PRODUCER SERVICES</text>
      <text x={14} y={208} fill="#10b981" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">KAFKA EVENT BUS</text>
      <text x={14} y={338} fill="#f97316" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">CONSUMER SERVICES</text>
      <text x={14} y={448} fill="#3b82f6" fontSize={9} fontFamily="monospace" fontWeight={700} letterSpacing="2">DATASTORES &amp; OBSERVABILITY</text>

      {/* ── INGRESS ROW ── */}
      {/* API Gateway */}
      <rect x={80} y={18} width={170} height={48} rx={8} fill="#0a1a2e" stroke="#06b6d4" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #06b6d444)" }} />
      <text x={165} y={38} textAnchor="middle" fill="#06b6d4" fontSize={12} fontWeight={700} fontFamily="monospace">API Gateway</text>
      <text x={165} y={54} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">Auth · Rate Limit · Route</text>

      {/* K8s Load Balancer */}
      <rect x={310} y={18} width={160} height={48} rx={8} fill="#0a1a2e" stroke="#06b6d4" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 8px #06b6d444)" }} />
      <text x={390} y={38} textAnchor="middle" fill="#06b6d4" fontSize={12} fontWeight={700} fontFamily="monospace">Load Balancer</text>
      <text x={390} y={54} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">K8s Ingress · Helm</text>

      {/* CI/CD */}
      <rect x={540} y={18} width={150} height={48} rx={8} fill="#0a1a2e" stroke="#06b6d4" strokeWidth={1.2} />
      <text x={615} y={38} textAnchor="middle" fill="#67e8f9" fontSize={12} fontWeight={700} fontFamily="monospace">CI / CD Pipeline</text>
      <text x={615} y={54} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">GitHub Actions · Jenkins</text>

      {/* Docker Registry */}
      <rect x={760} y={18} width={120} height={48} rx={8} fill="#0a1a2e" stroke="#06b6d4" strokeWidth={1.2} />
      <text x={820} y={38} textAnchor="middle" fill="#67e8f9" fontSize={12} fontWeight={700} fontFamily="monospace">Docker</text>
      <text x={820} y={54} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">Container Registry</text>

      <line x1={250} y1={42} x2={310} y2={42} stroke="#06b6d4" strokeWidth={1.5} markerEnd="url(#mk-cyan)" />
      <line x1={470} y1={42} x2={540} y2={42} stroke="#06b6d4" strokeWidth={1} strokeDasharray="3 3" markerEnd="url(#mk-cyan)" />
      <line x1={690} y1={42} x2={760} y2={42} stroke="#06b6d4" strokeWidth={1} strokeDasharray="3 3" markerEnd="url(#mk-cyan)" />

      {/* ── PRODUCER SERVICES ROW ── */}
      {[
        { x: 30,  label: "Billing",      sub: "PayPal · Stripe",   color: "#8b5cf6" },
        { x: 205, label: "Payment",      sub: "Stripe · Billpay",  color: "#8b5cf6" },
        { x: 380, label: "Checkout",     sub: "Cart · Orders",     color: "#8b5cf6" },
        { x: 555, label: "Auth Service", sub: "OAuth2 · JWT",      color: "#ec4899" },
        { x: 730, label: "User Service", sub: "Profile · Prefs",   color: "#8b5cf6" },
      ].map(({ x, label, sub, color }) => (
        <g key={label}>
          <rect x={x} y={95} width={145} height={52} rx={8} fill="#130f2d" stroke={color} strokeWidth={1.5} style={{ filter: `drop-shadow(0 0 6px ${color}33)` }} />
          <text x={x + 72} y={117} textAnchor="middle" fill="#e2e8f0" fontSize={11} fontWeight={700} fontFamily="monospace">{label}</text>
          <text x={x + 72} y={133} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">{sub}</text>
          <text x={x + 72} y={144} textAnchor="middle" fill="#374151" fontSize={8} fontFamily="monospace">Spring Boot · JPA</text>
        </g>
      ))}

      {/* LB → Producer Services */}
      {[102, 277, 452, 627, 802].map((x, i) => (
        <line key={i} x1={390} y1={66} x2={x} y2={95} stroke="#8b5cf6" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.5} markerEnd="url(#mk-purple)" />
      ))}

      {/* ── KAFKA CLUSTER ── */}
      <rect x={50} y={208} width={800} height={95} rx={10} fill="#060f06" stroke="#10b981" strokeWidth={2} style={{ filter: "drop-shadow(0 0 16px #10b98133)" }} />

      {/* Kafka header */}
      <text x={450} y={230} textAnchor="middle" fill="#10b981" fontSize={14} fontWeight={700} fontFamily="monospace">Apache Kafka Cluster</text>
      <text x={450} y={246} textAnchor="middle" fill="#374151" fontSize={9} fontFamily="monospace">Partitioned · Replicated · Fault-Tolerant · Horizontally Scalable · Replayable</text>

      {/* Topic pills */}
      {[
        { x: 70,  label: "billing-events",      color: "#8b5cf6" },
        { x: 240, label: "payment-events",      color: "#3b82f6" },
        { x: 410, label: "checkout-events",     color: "#06b6d4" },
        { x: 575, label: "notification-events", color: "#f97316" },
        { x: 738, label: "audit-events",        color: "#10b981" },
      ].map(({ x, label, color }) => (
        <g key={label}>
          <rect x={x} y={255} width={155} height={30} rx={15} fill="rgba(0,0,0,0.4)" stroke={color} strokeWidth={1} />
          <text x={x + 77} y={275} textAnchor="middle" fill={color} fontSize={9} fontWeight={600} fontFamily="monospace">{label}</text>
        </g>
      ))}

      {/* Producers → Kafka */}
      {[102, 277, 452, 627, 802].map((x, i) => (
        <line key={i} x1={x} y1={147} x2={[147, 317, 487, 652, 815][i]} y2={208} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#mk-green)" />
      ))}
      {/* publish labels */}
      <text x={90}  y={183} fill="#10b98188" fontSize={8} fontFamily="monospace">publish</text>
      <text x={600} y={183} fill="#10b98188" fontSize={8} fontFamily="monospace">publish</text>

      {/* ── CONSUMER SERVICES ROW ── */}
      {[
        { x: 30,  label: "Billing Consumer",      sub: "DLQ · Retry",      color: "#f97316" },
        { x: 225, label: "Payment Processor",     sub: "Idempotent",       color: "#f97316" },
        { x: 420, label: "Notification Worker",   sub: "Email · SMS · Push", color: "#f97316" },
        { x: 615, label: "Audit Service",         sub: "Compliance · Log", color: "#f97316" },
      ].map(({ x, label, sub, color }) => (
        <g key={label}>
          <rect x={x} y={333} width={165} height={52} rx={8} fill="#1a1000" stroke={color} strokeWidth={1.5} style={{ filter: `drop-shadow(0 0 6px ${color}33)` }} />
          <text x={x + 82} y={355} textAnchor="middle" fill="#fed7aa" fontSize={11} fontWeight={700} fontFamily="monospace">{label}</text>
          <text x={x + 82} y={370} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="monospace">{sub}</text>
          <text x={x + 82} y={381} textAnchor="middle" fill="#374151" fontSize={8} fontFamily="monospace">Consumer Group</text>
        </g>
      ))}

      {/* Kafka → Consumers */}
      {[
        [147, 112], [317, 307], [487, 502], [652, 697],
      ].map(([kx, cx], i) => (
        <line key={i} x1={kx} y1={303} x2={cx} y2={333} stroke="#f97316" strokeWidth={1.5} markerEnd="url(#mk-orange)" />
      ))}
      <text x={200} y={320} fill="#f9731688" fontSize={8} fontFamily="monospace">consume</text>
      <text x={580} y={320} fill="#f9731688" fontSize={8} fontFamily="monospace">consume</text>

      {/* ── DATASTORES & OBSERVABILITY ── */}
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
          <rect x={x} y={447} width={108} height={44} rx={8} fill="#0a0a1a" stroke={color} strokeWidth={1} />
          <text x={x + 54} y={466} textAnchor="middle" fill={color} fontSize={10} fontWeight={600} fontFamily="monospace">{label}</text>
          <text x={x + 54} y={481} textAnchor="middle" fill="#374151" fontSize={8} fontFamily="monospace">{sub}</text>
        </g>
      ))}

      {/* Consumers → DBs */}
      <line x1={112} y1={385} x2={84}  y2={447} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" markerEnd="url(#mk-slate)" />
      <line x1={307} y1={385} x2={209} y2={447} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" markerEnd="url(#mk-slate)" />
      <line x1={502} y1={385} x2={450} y2={447} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" markerEnd="url(#mk-slate)" />
      <line x1={697} y1={385} x2={684} y2={447} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" markerEnd="url(#mk-slate)" />
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

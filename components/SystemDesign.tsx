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
   Diagram 1: Router Service Architecture
───────────────────────────────────────────────────────── */
function RouterServiceDiagram() {
  return (
    <svg viewBox="0 0 800 420" className="w-full h-auto" style={{ maxHeight: 420 }}>
      {/* Background */}
      <rect width="800" height="420" fill="#050510" rx={12} />

      {/* Layer labels */}
      {[
        { x: 10, y: 25, text: "CLIENT TIER", color: "#3b82f6" },
        { x: 10, y: 125, text: "INGRESS LAYER", color: "#06b6d4" },
        { x: 10, y: 225, text: "ROUTING CORE", color: "#8b5cf6" },
        { x: 10, y: 325, text: "BACKEND TIER", color: "#10b981" },
      ].map((l) => (
        <text key={l.text} x={l.x} y={l.y} fill={l.color} fontSize={8} fontFamily="monospace" fontWeight={700} letterSpacing="1">
          {l.text}
        </text>
      ))}

      {/* Separator lines */}
      {[100, 200, 300].map((y) => (
        <line key={y} x1={0} y1={y} x2={800} y2={y} stroke="#1e293b" strokeWidth={1} />
      ))}

      {/* CLIENT TIER */}
      <Node x={60} y={35} w={100} h={36} label="Web Client" fill="#0f172a" stroke="#3b82f6" />
      <Node x={200} y={35} w={100} h={36} label="Mobile Client" fill="#0f172a" stroke="#3b82f6" />
      <Node x={340} y={35} w={120} h={36} label="3rd Party Service" fill="#0f172a" stroke="#3b82f6" />

      {/* Arrows: clients → Rate Limiter */}
      <Arrow x1={110} y1={71} x2={290} y2={110} color="#3b82f6" />
      <Arrow x1={250} y1={71} x2={310} y2={110} color="#3b82f6" />
      <Arrow x1={400} y1={71} x2={330} y2={110} color="#3b82f6" label="HTTP/WS" />

      {/* INGRESS LAYER */}
      <Node x={190} y={108} w={110} h={36} label="Rate Limiter" sublabel="Token Bucket" fill="#1e293b" stroke="#06b6d4" />
      <Node x={370} y={108} w={120} h={36} label="Auth Middleware" sublabel="JWT / API Key" fill="#1e293b" stroke="#06b6d4" />
      <Arrow x1={300} y1={126} x2={370} y2={126} color="#06b6d4" />
      <Arrow x1={490} y1={126} x2={540} y2={200} color="#06b6d4" label="allowed" />
      <Arrow x1={245} y1={144} x2={245} y2={200} color="#06b6d4" />

      {/* ROUTING CORE */}
      <Node x={170} y={208} w={130} h={36} label="Router Engine" sublabel="Regex Rule Matching" fill="#1a1035" stroke="#8b5cf6" />
      <Node x={380} y={195} w={100} h={28} label="Circuit Breaker" fill="#1a1035" stroke="#ef4444" />
      <Node x={520} y={195} w={100} h={28} label="Retry + Backoff" fill="#1a1035" stroke="#f97316" />
      <Node x={380} y={235} w={100} h={28} label="Load Balancer" sublabel="RR / Random / LC" fill="#1a1035" stroke="#8b5cf6" />

      <Arrow x1={300} y1={226} x2={380} y2={226} color="#8b5cf6" />
      <Arrow x1={480} y1={209} x2={520} y2={209} color="#ef4444" />
      <Arrow x1={430} y1={223} x2={430} y2={235} color="#8b5cf6" />

      {/* BACKEND TIER */}
      <Node x={60} y={322} w={100} h={36} label="Service A" sublabel=":8081" fill="#0f2d1f" stroke="#10b981" />
      <Node x={195} y={322} w={100} h={36} label="Service B" sublabel=":8082" fill="#0f2d1f" stroke="#10b981" />
      <Node x={330} y={322} w={100} h={36} label="Service C" sublabel=":8083" fill="#0f2d1f" stroke="#10b981" />
      <Node x={465} y={322} w={100} h={36} label="Service D" sublabel=":8084" fill="#0f2d1f" stroke="#10b981" />

      {/* LB → Services */}
      <Arrow x1={420} y1={263} x2={110} y2={322} color="#10b981" />
      <Arrow x1={430} y1={263} x2={245} y2={322} color="#10b981" />
      <Arrow x1={440} y1={263} x2={380} y2={322} color="#10b981" />
      <Arrow x1={450} y1={263} x2={515} y2={322} color="#10b981" />

      {/* Observability Panel */}
      <rect x={590} y={108} width={185} height={200} rx={10} fill="#0a1628" stroke="#1e3a5f" strokeWidth={1} />
      <text x={682} y={128} textAnchor="middle" fill="#3b82f6" fontSize={9} fontFamily="monospace" fontWeight={700}>
        OBSERVABILITY
      </text>
      {[
        { y: 148, label: "Prometheus Metrics", color: "#f97316" },
        { y: 168, label: "Spring Actuator", color: "#06b6d4" },
        { y: 188, label: "Centralized Logging", color: "#10b981" },
        { y: 208, label: "WS Metrics Stream", color: "#8b5cf6" },
        { y: 228, label: "Live Traffic Dashboard", color: "#ec4899" },
        { y: 248, label: "Health Endpoints", color: "#3b82f6" },
        { y: 268, label: "Load Test: 10K+ RPS", color: "#f59e0b" },
        { y: 288, label: "Stress: 1M+ Requests", color: "#ef4444" },
      ].map(({ y, label, color }) => (
        <g key={label}>
          <circle cx={605} cy={y - 4} r={2.5} fill={color} />
          <text x={614} y={y} fill="#94a3b8" fontSize={9} fontFamily="monospace">{label}</text>
        </g>
      ))}

      {/* Arrow to Observability */}
      <Arrow x1={580} y1={209} x2={590} y2={209} color="#1e3a5f" />

      {/* Title */}
      <text x={400} y={400} textAnchor="middle" fill="#334155" fontSize={10} fontFamily="monospace">
        Router Service — High-Performance API Gateway Architecture
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   Diagram 2: Microservices + Kafka Event Pipeline
───────────────────────────────────────────────────────── */
function MicroservicesKafkaDiagram() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-auto" style={{ maxHeight: 450 }}>
      <rect width="800" height="450" fill="#050510" rx={12} />

      {/* Section separators */}
      <line x1="0" y1="80" x2="800" y2="80" stroke="#1e293b" strokeWidth={1} />
      <line x1="0" y1="360" x2="800" y2="360" stroke="#1e293b" strokeWidth={1} />

      {/* API GATEWAY */}
      <text x={12} y={25} fill="#06b6d4" fontSize={8} fontFamily="monospace" fontWeight={700} letterSpacing="1">INGRESS</text>
      <Node x={90} y={28} w={140} h={36} label="API Gateway" sublabel="Auth / Rate Limit / Route" fill="#0a1a2e" stroke="#06b6d4" />
      <Node x={290} y={28} w={100} h={36} label="Load Balancer" sublabel="K8s Ingress" fill="#0a1a2e" stroke="#06b6d4" />
      <Arrow x1={230} y1={46} x2={290} y2={46} color="#06b6d4" />

      {/* Microservices Row */}
      <text x={12} y={108} fill="#8b5cf6" fontSize={8} fontFamily="monospace" fontWeight={700} letterSpacing="1">MICROSERVICES</text>
      <Node x={30} y={115} w={110} h={38} label="Billing Service" sublabel="PayPal · Stripe" fill="#130f2d" stroke="#8b5cf6" />
      <Node x={175} y={115} w={110} h={38} label="Payment Service" sublabel="Stripe · Billpay" fill="#130f2d" stroke="#8b5cf6" />
      <Node x={320} y={115} w={110} h={38} label="Checkout Service" sublabel="Cart · Order" fill="#130f2d" stroke="#8b5cf6" />
      <Node x={465} y={115} w={120} h={38} label="Notification Service" sublabel="Email · SMS · Push" fill="#130f2d" stroke="#8b5cf6" />
      <Node x={620} y={115} w={110} h={38} label="Auth Service" sublabel="OAuth2 · JWT" fill="#130f2d" stroke="#ec4899" />

      {/* LB → Services */}
      <Arrow x1={340} y1={64} x2={85} y2={115} color="#3b82f6" />
      <Arrow x1={360} y1={64} x2={230} y2={115} color="#3b82f6" />
      <Arrow x1={380} y1={64} x2={375} y2={115} color="#3b82f6" />
      <Arrow x1={395} y1={64} x2={500} y2={115} color="#3b82f6" />

      {/* KAFKA CLUSTER — center */}
      <rect x={140} y={200} width={440} height={65} rx={10} fill="#0d1a0d" stroke="#10b981" strokeWidth={1.5} style={{ filter: "drop-shadow(0 0 12px #10b98144)" }} />
      <text x={360} y={220} textAnchor="middle" fill="#10b981" fontSize={11} fontFamily="monospace" fontWeight={700}>Apache Kafka Cluster</text>
      <text x={360} y={237} textAnchor="middle" fill="#6b7280" fontSize={9} fontFamily="monospace">billing-events · payment-events · notification-events · audit-events</text>
      {[170, 230, 290, 350, 410, 470, 530].map((x) => (
        <rect key={x} x={x} y={248} width={50} height={14} rx={3} fill="#0a2a0a" stroke="#10b98166" strokeWidth={1} />
      ))}
      <text x={360} y={258} textAnchor="middle" fill="#374151" fontSize={7.5} fontFamily="monospace">Partitioned Topics — Horizontal Scale — Replay — Fault Tolerant</text>

      {/* Services → Kafka (Producers) */}
      <Arrow x1={85} y1={153} x2={200} y2={200} color="#10b981" label="publish" />
      <Arrow x1={230} y1={153} x2={280} y2={200} color="#10b981" label="publish" />
      <Arrow x1={375} y1={153} x2={360} y2={200} color="#10b981" />
      <Arrow x1={520} y1={153} x2={450} y2={200} color="#10b981" label="publish" />

      {/* Kafka → Services (Consumers) */}
      <Arrow x1={220} y1={265} x2={85} y2={285} color="#f97316" label="consume" />
      <Arrow x1={320} y1={265} x2={230} y2={285} color="#f97316" label="consume" />
      <Arrow x1={400} y1={265} x2={520} y2={285} color="#f97316" label="consume" />

      {/* Consumer Services */}
      <Node x={30} y={285} w={115} h={34} label="Billing Consumer" sublabel="Retry + DLQ" fill="#1a1000" stroke="#f97316" />
      <Node x={175} y={285} w={115} h={34} label="Payment Processor" sublabel="Idempotent" fill="#1a1000" stroke="#f97316" />
      <Node x={460} y={285} w={120} h={34} label="Notification Consumer" sublabel="Email · SMS" fill="#1a1000" stroke="#f97316" />

      {/* Datastores Row */}
      <text x={12} y={378} fill="#3b82f6" fontSize={8} fontFamily="monospace" fontWeight={700} letterSpacing="1">DATASTORES</text>
      <Node x={30} y={385} w={90} h={34} label="PostgreSQL" sublabel="Billing DB" fill="#0a1628" stroke="#3b82f6" />
      <Node x={150} y={385} w={90} h={34} label="MySQL" sublabel="Payment DB" fill="#0a1628" stroke="#3b82f6" />
      <Node x={270} y={385} w={80} h={34} label="MongoDB" sublabel="Orders" fill="#0a1628" stroke="#22c55e" />
      <Node x={375} y={385} w={80} h={34} label="Redis" sublabel="Cache / Session" fill="#0a1628" stroke="#ef4444" />
      <Node x={480} y={385} w={90} h={34} label="Elasticsearch" sublabel="Logs / Search" fill="#0a1628" stroke="#f59e0b" />
      <Node x={595} y={385} w={90} h={34} label="Prometheus" sublabel="Metrics" fill="#0a1628" stroke="#f97316" />
      <Node x={700} y={385} w={80} h={34} label="Datadog" sublabel="APM / Traces" fill="#0a1628" stroke="#8b5cf6" />

      {/* Consumer → DB arrows */}
      <Arrow x1={85} y1={319} x2={75} y2={385} color="#475569" />
      <Arrow x1={232} y1={319} x2={195} y2={385} color="#475569" />

      {/* Title */}
      <text x={400} y={435} textAnchor="middle" fill="#334155" fontSize={10} fontFamily="monospace">
        AppDirect — Microservices + Kafka Event-Driven Architecture
      </text>
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

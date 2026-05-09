"use client";

import { createContext, useContext, useState } from "react";

/**
 * Diagram primitives shared by every architecture diagram.
 *
 * Design language:
 *   - Single accent color (cyan) for primary flow
 *   - Amber for async/event flow (Kafka, queues)
 *   - Red for failure paths (only visible in failure mode)
 *   - Slate for everything else (the "background" of the system)
 *
 * Component shapes encode component type — the reader can tell at a glance
 * whether something is a service, a datastore, a queue, or an external party
 * without having to read every label.
 *
 * Mode-awareness:
 *   - "topology"  → all nodes equal weight; flows visible at neutral intensity
 *   - "sequence"  → primary path highlighted, step numbers shown, flow animated
 *   - "failure"   → failure path highlighted, resilience patterns glowing
 *
 * Each shape supports a `dim` prop so the parent diagram can fade out
 * components that don't participate in the current mode.
 *
 * Tooltips:
 *   Shapes accept an `info` prop. On hover, a React-managed tooltip is
 *   positioned near the cursor (DiagramFrame provides the context).
 *   A `<title>` is also rendered for screen readers.
 */

export type Tone = "default" | "accent" | "async" | "failure" | "muted";

const TONE: Record<Tone, { stroke: string; fill: string; text: string; sub: string }> = {
  default: { stroke: "#475569", fill: "#11161e", text: "#e2e8f0", sub: "#94a3b8" },
  accent:  { stroke: "#22d3ee", fill: "#0b1620", text: "#a7f3d0", sub: "#67e8f9" },
  async:   { stroke: "#f59e0b", fill: "#1a140a", text: "#fde68a", sub: "#fbbf24" },
  failure: { stroke: "#ef4444", fill: "#1a0e0e", text: "#fecaca", sub: "#fca5a5" },
  muted:   { stroke: "#334155", fill: "#0f141b", text: "#64748b", sub: "#475569" },
};

const FONT = "var(--font-geist-mono), ui-monospace, monospace";

function withDim(t: Tone, dim?: boolean): Tone {
  return dim ? "muted" : t;
}

function Title({ children }: { children?: string }) {
  if (!children) return null;
  return <title>{children}</title>;
}

/* ─────────────── Tooltip context ─────────────── */

type TooltipState = { info: string; x: number; y: number } | null;

const TooltipContext = createContext<{
  show: (info: string, e: React.MouseEvent<SVGElement>) => void;
  hide: () => void;
} | null>(null);

/** Hook bundle for shape <g>'s — pass `info` to enable hover tooltip. */
function useHoverHandlers(info?: string) {
  const ctx = useContext(TooltipContext);
  if (!info || !ctx) return {};
  return {
    onMouseEnter: (e: React.MouseEvent<SVGElement>) => ctx.show(info, e),
    onMouseMove:  (e: React.MouseEvent<SVGElement>) => ctx.show(info, e),
    onMouseLeave: () => ctx.hide(),
    style: { cursor: "help" as const },
  };
}

/* ─────────────── Shapes ─────────────── */

export function Service({
  x, y, w = 140, h = 50, label, sublabel, tone = "default", dim, info,
}: {
  x: number; y: number; w?: number; h?: number;
  label: string; sublabel?: string;
  tone?: Tone; dim?: boolean; info?: string;
}) {
  const c = TONE[withDim(tone, dim)];
  const hover = useHoverHandlers(info);
  return (
    <g
      className="diagram-shape"
      style={{ transition: "opacity 0.25s ease", opacity: dim ? 0.45 : 1, ...hover.style }}
      onMouseEnter={hover.onMouseEnter}
      onMouseMove={hover.onMouseMove}
      onMouseLeave={hover.onMouseLeave}
    >
      <Title>{info}</Title>
      <rect x={x} y={y} width={w} height={h} rx={6}
        fill={c.fill} stroke={c.stroke} strokeWidth={1.25} />
      <text x={x + w / 2} y={y + (sublabel ? h / 2 - 3 : h / 2 + 3)}
        textAnchor="middle" fill={c.text} fontSize={11.5} fontWeight={600} fontFamily={FONT}>
        {label}
      </text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 11}
          textAnchor="middle" fill={c.sub} fontSize={9} fontFamily={FONT}>
          {sublabel}
        </text>
      )}
    </g>
  );
}

/** Cylinder = datastore */
export function Datastore({
  x, y, w = 100, h = 56, label, sublabel, tone = "default", dim, info,
}: {
  x: number; y: number; w?: number; h?: number;
  label: string; sublabel?: string;
  tone?: Tone; dim?: boolean; info?: string;
}) {
  const c = TONE[withDim(tone, dim)];
  const ry = 7;
  const hover = useHoverHandlers(info);
  return (
    <g
      className="diagram-shape"
      style={{ transition: "opacity 0.25s ease", opacity: dim ? 0.45 : 1, ...hover.style }}
      onMouseEnter={hover.onMouseEnter}
      onMouseMove={hover.onMouseMove}
      onMouseLeave={hover.onMouseLeave}
    >
      <Title>{info}</Title>
      <path
        d={`M ${x} ${y + ry} a ${w / 2} ${ry} 0 1 0 ${w} 0 V ${y + h - ry} a ${w / 2} ${ry} 0 1 1 -${w} 0 Z`}
        fill={c.fill} stroke={c.stroke} strokeWidth={1.25}
      />
      <ellipse cx={x + w / 2} cy={y + ry} rx={w / 2} ry={ry}
        fill="none" stroke={c.stroke} strokeWidth={1.25} />
      <text x={x + w / 2} y={y + (sublabel ? h / 2 + 1 : h / 2 + 4)}
        textAnchor="middle" fill={c.text} fontSize={10.5} fontWeight={600} fontFamily={FONT}>
        {label}
      </text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 12}
          textAnchor="middle" fill={c.sub} fontSize={8.5} fontFamily={FONT}>
          {sublabel}
        </text>
      )}
    </g>
  );
}

/** Hexagon = queue / topic / message bus */
export function Queue({
  x, y, w = 140, h = 44, label, sublabel, tone = "async", dim, info,
}: {
  x: number; y: number; w?: number; h?: number;
  label: string; sublabel?: string;
  tone?: Tone; dim?: boolean; info?: string;
}) {
  const c = TONE[withDim(tone, dim)];
  const tip = h * 0.38;
  const hover = useHoverHandlers(info);
  return (
    <g
      className="diagram-shape"
      style={{ transition: "opacity 0.25s ease", opacity: dim ? 0.45 : 1, ...hover.style }}
      onMouseEnter={hover.onMouseEnter}
      onMouseMove={hover.onMouseMove}
      onMouseLeave={hover.onMouseLeave}
    >
      <Title>{info}</Title>
      <path
        d={`M ${x + tip} ${y} L ${x + w - tip} ${y} L ${x + w} ${y + h / 2} L ${x + w - tip} ${y + h} L ${x + tip} ${y + h} L ${x} ${y + h / 2} Z`}
        fill={c.fill} stroke={c.stroke} strokeWidth={1.25}
      />
      <text x={x + w / 2} y={y + (sublabel ? h / 2 - 1 : h / 2 + 4)}
        textAnchor="middle" fill={c.text} fontSize={10.5} fontWeight={600} fontFamily={FONT}>
        {label}
      </text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 11}
          textAnchor="middle" fill={c.sub} fontSize={8.5} fontFamily={FONT}>
          {sublabel}
        </text>
      )}
    </g>
  );
}

/**
 * External = 3rd-party / external party.
 * Rendered as a dashed-border rounded rect with a small ↗ badge in the corner.
 * (A literal cloud shape distorts at our aspect ratios; this reads as
 *  "outside the system boundary" much more reliably.)
 */
export function External({
  x, y, w = 130, h = 52, label, sublabel, tone = "default", dim, info,
}: {
  x: number; y: number; w?: number; h?: number;
  label: string; sublabel?: string;
  tone?: Tone; dim?: boolean; info?: string;
}) {
  const c = TONE[withDim(tone, dim)];
  const hover = useHoverHandlers(info);
  return (
    <g
      className="diagram-shape"
      style={{ transition: "opacity 0.25s ease", opacity: dim ? 0.45 : 1, ...hover.style }}
      onMouseEnter={hover.onMouseEnter}
      onMouseMove={hover.onMouseMove}
      onMouseLeave={hover.onMouseLeave}
    >
      <Title>{info}</Title>
      <rect x={x} y={y} width={w} height={h} rx={6}
        fill={c.fill} stroke={c.stroke} strokeWidth={1.5}
        strokeDasharray="5 3" />
      {/* External badge — small arrow in the top-right corner */}
      <g transform={`translate(${x + w - 14}, ${y + 3})`}>
        <rect x={-9} y={0} width={18} height={12} rx={2.5}
          fill={c.fill} stroke={c.stroke} strokeWidth={1} />
        <text x={0} y={9.5} textAnchor="middle" fill={c.text}
          fontSize={9} fontFamily={FONT} fontWeight={700}>↗</text>
      </g>
      <text x={x + w / 2} y={y + (sublabel ? h / 2 - 2 : h / 2 + 4)}
        textAnchor="middle" fill={c.text} fontSize={11} fontWeight={600} fontFamily={FONT}>
        {label}
      </text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 11}
          textAnchor="middle" fill={c.sub} fontSize={9} fontFamily={FONT}>
          {sublabel}
        </text>
      )}
    </g>
  );
}

/** Trapezoid = gateway / load balancer */
export function Gateway({
  x, y, w = 160, h = 50, label, sublabel, tone = "default", dim, info,
}: {
  x: number; y: number; w?: number; h?: number;
  label: string; sublabel?: string;
  tone?: Tone; dim?: boolean; info?: string;
}) {
  const c = TONE[withDim(tone, dim)];
  const inset = 12;
  const hover = useHoverHandlers(info);
  return (
    <g
      className="diagram-shape"
      style={{ transition: "opacity 0.25s ease", opacity: dim ? 0.45 : 1, ...hover.style }}
      onMouseEnter={hover.onMouseEnter}
      onMouseMove={hover.onMouseMove}
      onMouseLeave={hover.onMouseLeave}
    >
      <Title>{info}</Title>
      <path
        d={`M ${x} ${y} L ${x + w} ${y} L ${x + w - inset} ${y + h} L ${x + inset} ${y + h} Z`}
        fill={c.fill} stroke={c.stroke} strokeWidth={1.25}
      />
      <text x={x + w / 2} y={y + (sublabel ? h / 2 - 2 : h / 2 + 4)}
        textAnchor="middle" fill={c.text} fontSize={11} fontWeight={600} fontFamily={FONT}>
        {label}
      </text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 11}
          textAnchor="middle" fill={c.sub} fontSize={9} fontFamily={FONT}>
          {sublabel}
        </text>
      )}
    </g>
  );
}

/** Diamond = router / decision */
export function Router({
  x, y, w = 130, h = 70, label, sublabel, tone = "default", dim, info,
}: {
  x: number; y: number; w?: number; h?: number;
  label: string; sublabel?: string;
  tone?: Tone; dim?: boolean; info?: string;
}) {
  const c = TONE[withDim(tone, dim)];
  const hover = useHoverHandlers(info);
  return (
    <g
      className="diagram-shape"
      style={{ transition: "opacity 0.25s ease", opacity: dim ? 0.45 : 1, ...hover.style }}
      onMouseEnter={hover.onMouseEnter}
      onMouseMove={hover.onMouseMove}
      onMouseLeave={hover.onMouseLeave}
    >
      <Title>{info}</Title>
      <path
        d={`M ${x + w / 2} ${y} L ${x + w} ${y + h / 2} L ${x + w / 2} ${y + h} L ${x} ${y + h / 2} Z`}
        fill={c.fill} stroke={c.stroke} strokeWidth={1.25}
      />
      <text x={x + w / 2} y={y + (sublabel ? h / 2 - 2 : h / 2 + 4)}
        textAnchor="middle" fill={c.text} fontSize={10.5} fontWeight={600} fontFamily={FONT}>
        {label}
      </text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 11}
          textAnchor="middle" fill={c.sub} fontSize={8.5} fontFamily={FONT}>
          {sublabel}
        </text>
      )}
    </g>
  );
}

/* ─────────────── Flow arrow ─────────────── */

const ARROW_COLOR: Record<Tone, string> = {
  default: "#64748b",
  accent:  "#22d3ee",
  async:   "#f59e0b",
  failure: "#ef4444",
  muted:   "#334155",
};

export function FlowArrow({
  x1, y1, x2, y2,
  tone = "default",
  label, latency, step,
  dim, animated, primary,
}: {
  x1: number; y1: number; x2: number; y2: number;
  tone?: Tone;
  label?: string;
  latency?: string;
  step?: number;
  dim?: boolean;
  animated?: boolean;
  primary?: boolean;
}) {
  const t = withDim(tone, dim);
  const color = ARROW_COLOR[t];
  const id = `m-${color.replace("#", "")}`;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const opacity = dim ? 0.25 : primary ? 1 : 0.7;
  const width = primary ? 1.8 : 1.2;

  // Combined pill at midpoint: [step] [latency]
  const showStep = typeof step === "number" && !dim;
  const showLat  = !!latency && !dim;
  const stepW = showStep ? 18 : 0;
  const latW  = showLat ? Math.max(36, (latency!.length * 6) + 10) : 0;
  const pillW = stepW + latW;
  const pillH = 16;

  // For very short arrows the pill won't fit between the two nodes —
  // offset perpendicular so it sits beside the arrow instead of overlapping.
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const needsPerpOffset = pillW > 0 && len < pillW + 16;
  const perpX = needsPerpOffset ? -uy * (pillH / 2 + 8) : 0;
  const perpY = needsPerpOffset ?  ux * (pillH / 2 + 8) : 0;

  return (
    <g style={{ transition: "opacity 0.25s ease" }}>
      <defs>
        <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={width}
        strokeDasharray="6 4"
        markerEnd={`url(#${id})`}
        opacity={opacity}
        className={animated && !dim ? "flow-march" : undefined}
      />
      {label && !dim && (
        <text
          x={mx + (needsPerpOffset ? -perpX : 0)}
          y={my + (needsPerpOffset ? -perpY : 0) - (pillW > 0 && !needsPerpOffset ? 14 : 6)}
          textAnchor="middle"
          fill={color} fontSize={9.5} fontFamily={FONT} opacity={0.9}
          fontWeight={500}>
          {label}
        </text>
      )}
      {pillW > 0 && (
        <g transform={`translate(${mx + perpX - pillW / 2}, ${my + perpY - pillH / 2})`}>
          <rect x={0} y={0} width={pillW} height={pillH} rx={pillH / 2}
            fill="#0a0e14" stroke={color} strokeWidth={1.1} />
          {showStep && (
            <>
              <circle cx={9} cy={pillH / 2} r={6} fill={color} />
              <text x={9} y={pillH / 2 + 3} textAnchor="middle" fill="#0a0e14"
                fontSize={9} fontWeight={700} fontFamily={FONT}>
                {step}
              </text>
            </>
          )}
          {showLat && (
            <text x={stepW + latW / 2} y={pillH / 2 + 3} textAnchor="middle"
              fill={color} fontSize={9} fontWeight={600} fontFamily={FONT}>
              {latency}
            </text>
          )}
        </g>
      )}
    </g>
  );
}

/* ─────────────── Layer band (replaces colored band overlays) ─────────────── */

export function Band({
  x = 0, y, width, height, label, dim,
}: {
  x?: number; y: number; width: number; height: number; label: string; dim?: boolean;
}) {
  return (
    <g style={{ transition: "opacity 0.25s ease", opacity: dim ? 0.4 : 1 }}>
      <rect x={x} y={y} width={width} height={height}
        fill="rgba(34,211,238,0.015)" stroke="none" />
      <line x1={x} y1={y} x2={x + width} y2={y} stroke="#334155" strokeWidth={1} />
      <text x={x + 14} y={y + 14} fill="#94a3b8"
        fontSize={9.5} fontFamily={FONT} fontWeight={700} letterSpacing="2">
        {label.toUpperCase()}
      </text>
    </g>
  );
}

/* ─────────────── Trace particle (animated dot along a path) ─────────────── */

export function TraceParticle({
  path, duration = 4, tone = "accent", playKey,
}: {
  path: string;
  duration?: number;
  tone?: Tone;
  /** Change to remount and replay the animation. */
  playKey: number;
}) {
  const color = ARROW_COLOR[tone];
  return (
    <g key={playKey}>
      <circle r={5} fill={color}>
        <animateMotion dur={`${duration}s`} repeatCount="1" path={path} fill="freeze" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.05;0.95;1"
          dur={`${duration}s`} repeatCount="1" />
      </circle>
      <circle r={9} fill="none" stroke={color} strokeWidth={1.2} opacity={0.4}>
        <animateMotion dur={`${duration}s`} repeatCount="1" path={path} fill="freeze" />
        <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.05;0.95;1"
          dur={`${duration}s`} repeatCount="1" />
      </circle>
    </g>
  );
}

/* ─────────────── Frame wrapper (consistent svg dressing) ─────────────── */

export function DiagramFrame({
  children, viewBox, height,
}: {
  children: React.ReactNode;
  viewBox: string;
  height: number;
}) {
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const ctx = {
    show: (info: string, e: React.MouseEvent<SVGElement>) => {
      const container = (e.currentTarget.closest(
        "[data-diagram-container]"
      ) as HTMLElement) ?? null;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      setTooltip({
        info,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    hide: () => setTooltip(null),
  };

  // Tooltip layout: prefer above-and-right of cursor, but flip to fit
  // within the container so it never escapes the diagram panel.
  const TOOLTIP_W = 260;
  const TOOLTIP_OFFSET_X = 14;
  const TOOLTIP_OFFSET_Y = 18;

  return (
    <TooltipContext.Provider value={ctx}>
      <div className="relative overflow-x-auto" data-diagram-container>
        <svg viewBox={viewBox} className="w-full h-auto block"
          style={{ minWidth: 720, maxHeight: height, background: "#0a0e14" }}>
          {children}
        </svg>
        {tooltip && (
          <div
            className="absolute pointer-events-none z-20 px-3 py-2 rounded-md
              bg-[#0a0e14]/98 border border-[var(--accent)] text-[11.5px]
              font-mono text-slate-200 leading-relaxed shadow-xl
              shadow-cyan-500/10 backdrop-blur-sm"
            style={{
              left: tooltip.x + TOOLTIP_OFFSET_X,
              top:  Math.max(0, tooltip.y - TOOLTIP_OFFSET_Y - 8),
              maxWidth: TOOLTIP_W,
              transform: "translateZ(0)",
            }}
          >
            {tooltip.info}
          </div>
        )}
      </div>
    </TooltipContext.Provider>
  );
}

/* ─────────────── Legend ─────────────── */

const SHAPE_KEYS = [
  { kind: "service",   label: "Service" },
  { kind: "datastore", label: "Datastore" },
  { kind: "queue",     label: "Queue / Topic" },
  { kind: "external",  label: "External" },
  { kind: "gateway",   label: "Gateway / LB" },
  { kind: "router",    label: "Router / Decision" },
] as const;

const TONE_KEYS: { tone: Tone; label: string }[] = [
  { tone: "accent",  label: "Primary flow" },
  { tone: "async",   label: "Async / event" },
  { tone: "failure", label: "Failure path" },
  { tone: "muted",   label: "Dimmed (out of view)" },
];

export function Legend() {
  return (
    <div className="panel p-4">
      <div className="mono-label mb-3">legend</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {SHAPE_KEYS.map(({ kind, label }) => (
          <div key={kind} className="flex items-center gap-2">
            <svg viewBox="0 0 40 24" className="w-10 h-6 flex-shrink-0">
              <LegendShape kind={kind} />
            </svg>
            <span className="text-[11px] text-slate-400 truncate">{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 panel-divider grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TONE_KEYS.map(({ tone, label }) => (
          <div key={tone} className="flex items-center gap-2">
            <span className="block w-6 h-px" style={{ background: ARROW_COLOR[tone] }} />
            <span className="text-[11px] text-slate-400 truncate">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegendShape({ kind }: { kind: typeof SHAPE_KEYS[number]["kind"] }) {
  const stroke = "#64748b";
  const fill = "#11161e";
  switch (kind) {
    case "service":
      return <rect x={4} y={6} width={32} height={12} rx={2} fill={fill} stroke={stroke} />;
    case "datastore":
      return (
        <g>
          <path d={`M 8 8 a 12 3 0 1 0 24 0 V 16 a 12 3 0 1 1 -24 0 Z`} fill={fill} stroke={stroke} />
          <ellipse cx={20} cy={8} rx={12} ry={3} fill="none" stroke={stroke} />
        </g>
      );
    case "queue":
      return <path d="M 10 6 L 30 6 L 36 12 L 30 18 L 10 18 L 4 12 Z" fill={fill} stroke={stroke} />;
    case "external":
      return (
        <g>
          <rect x={4} y={6} width={32} height={12} rx={2}
            fill={fill} stroke={stroke} strokeDasharray="2 1.5" />
          <text x={32} y={11} fontSize={6} fontWeight={700}
            fontFamily="ui-monospace, monospace" fill={stroke}>↗</text>
        </g>
      );
    case "gateway":
      return <path d="M 4 6 L 36 6 L 32 18 L 8 18 Z" fill={fill} stroke={stroke} />;
    case "router":
      return <path d="M 20 4 L 36 12 L 20 20 L 4 12 Z" fill={fill} stroke={stroke} />;
  }
}

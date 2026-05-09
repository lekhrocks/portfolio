type Tone = "ok" | "warn" | "err" | "info" | "muted";

const COLORS: Record<Tone, { dot: string; text: string; border: string; bg: string }> = {
  ok:    { dot: "#22c55e", text: "#86efac", border: "rgba(34,197,94,0.30)", bg: "rgba(34,197,94,0.08)" },
  warn:  { dot: "#f59e0b", text: "#fcd34d", border: "rgba(245,158,11,0.30)", bg: "rgba(245,158,11,0.08)" },
  err:   { dot: "#ef4444", text: "#fca5a5", border: "rgba(239,68,68,0.30)",  bg: "rgba(239,68,68,0.08)" },
  info:  { dot: "#22d3ee", text: "#67e8f9", border: "rgba(34,211,238,0.30)", bg: "rgba(34,211,238,0.08)" },
  muted: { dot: "#64748b", text: "#94a3b8", border: "rgba(100,116,139,0.30)", bg: "rgba(100,116,139,0.06)" },
};

export default function StatusPill({
  tone = "ok",
  pulse = false,
  children,
}: {
  tone?: Tone;
  pulse?: boolean;
  children: React.ReactNode;
}) {
  const c = COLORS[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider whitespace-nowrap"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
      }}
    >
      <span
        className={`dot ${pulse ? "dot-pulse" : ""}`}
        style={{ background: c.dot, width: 6, height: 6 }}
      />
      {children}
    </span>
  );
}

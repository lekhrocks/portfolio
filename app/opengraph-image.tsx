import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(ellipse at top left, #1e293b 0%, #050510 55%, #000 100%)",
          color: "#f0f4ff",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* corner glow */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(59,130,246,0.45) 0%, rgba(6,182,212,0.18) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            left: -200,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(139,92,246,0.30) 0%, rgba(236,72,153,0.10) 40%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        {/* top: monogram + status pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 26,
                color: "#0a0a18",
              }}
            >
              {"</>"}
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>
              lekhrajkumar.dev
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              borderRadius: 9999,
              background: "rgba(34,197,94,0.10)",
              border: "1px solid rgba(34,197,94,0.30)",
              color: "#4ade80",
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                background: "#4ade80",
              }}
            />
            Open to Senior Backend Roles
          </div>
        </div>

        {/* center: name + role + tags */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 110,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -3,
              display: "flex",
              gap: 24,
            }}
          >
            <span style={{ color: "#f0f4ff" }}>Lekhraj</span>
            <span
              style={{
                background: "linear-gradient(135deg,#3b82f6 0%,#06b6d4 50%,#8b5cf6 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Kumar
            </span>
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#94a3b8",
              fontWeight: 500,
              maxWidth: 1000,
              lineHeight: 1.2,
            }}
          >
            Backend Software Engineer · Distributed Systems · 5+ yrs
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            {["Java", "Spring Boot", "Kafka", "Microservices", "React"].map((t) => (
              <div
                key={t}
                style={{
                  padding: "10px 20px",
                  borderRadius: 9999,
                  border: "1px solid rgba(148,163,184,0.25)",
                  background: "rgba(15,23,42,0.6)",
                  color: "#cbd5e1",
                  fontSize: 22,
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* bottom: stats strip */}
        <div
          style={{
            display: "flex",
            gap: 32,
            paddingTop: 24,
            borderTop: "1px solid rgba(148,163,184,0.15)",
          }}
        >
          {[
            { v: "10K+", l: "RPS sustained" },
            { v: "99.9%", l: "SLA achieved" },
            { v: "729+", l: "LeetCode solved" },
            { v: "5+", l: "Years experience" },
          ].map((s) => (
            <div key={s.l} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 700,
                  background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
                  backgroundClip: "text",
                  color: "transparent",
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                {s.v}
              </div>
              <div style={{ fontSize: 18, color: "#64748b" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}

"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

type Health = {
  status: string;
  region: string;
  runtime: string;
  uptime_ms: number;
  version: string;
  timestamp: string;
};

export default function Footer() {
  const year = new Date().getFullYear();
  const [h, setH] = useState<Health | null>(null);

  useEffect(() => {
    let cancel = false;
    fetch("/api/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: Health) => !cancel && setH(d))
      .catch(() => {});
    return () => {
      cancel = true;
    };
  }, []);

  const region = h?.region && h.region !== "local" ? h.region : "ap-south-1";
  const version = (h?.version ?? "dev").slice(0, 7);

  return (
    <footer className="mt-12">
      {/* Mid block — brand + socials */}
      <div className="border-t border-[var(--panel-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[var(--accent)] text-black font-mono font-bold text-[12px] flex items-center justify-center">
              LK
            </div>
            <div className="leading-tight">
              <div className="text-xs font-mono text-white">lekhrajkumar</div>
              <div className="mono-tag text-[var(--text-chrome)] text-[10px]">
                © {year} Lekhraj Kumar · built with Next.js · deployed on Vercel
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <iframe
              src="https://github.com/sponsors/lekhrocks/button"
              title="Sponsor lekhrocks"
              height="32"
              width="114"
              style={{ border: 0, borderRadius: 6 }}
            />
            {[
              { icon: GithubIcon, href: "https://github.com/lekhrocks", label: "GitHub" },
              { icon: LinkedinIcon, href: "https://linkedin.com/in/lekhrajkumar", label: "LinkedIn" },
              { icon: Mail, href: "mailto:lekh.nith@gmail.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-md border border-[var(--panel-border)] flex items-center justify-center text-slate-400 hover:text-white hover:border-[var(--panel-border-hover)] transition-colors"
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Status bar — terminal style */}
      <div className="status-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5">
            <span
              className="dot dot-pulse"
              style={{
                width: 6,
                height: 6,
                background: h ? "var(--status-ok)" : "var(--text-chrome)",
              }}
            />
            <span className="text-slate-300">
              {h ? "200 OK" : "checking…"}
            </span>
          </span>
          <span>region={region}</span>
          <span>runtime={h?.runtime ?? "edge"}</span>
          <span>v={version}</span>
          <span className="ml-auto hidden sm:inline">
            <a
              href="/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="console-link"
            >
              GET /api/health
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

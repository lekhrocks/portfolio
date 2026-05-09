"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Star, Code2 } from "lucide-react";
import SectionHeader from "@/components/console/SectionHeader";
import StatusPill from "@/components/console/StatusPill";
import { GithubIcon, LeetcodeIcon } from "@/components/icons";

type StatsPayload = {
  generatedAt: string;
  github: {
    user: string;
    publicRepos: number;
    followers: number;
    totalStars: number;
    topLanguages: { language: string; repos: number }[];
    sinceYear: number;
    profileUrl: string;
  } | null;
  leetcode: { user: string; solved: number; profileUrl: string };
  experience: { yearsAtCompany: number; yearsTotal: number };
};

const LANG_COLOR: Record<string, string> = {
  Java: "#ed8b00",
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3776ab",
  Go: "#00add8",
  HTML: "#e34c26",
  CSS: "#264de4",
  Shell: "#89e051",
  Dockerfile: "#384d54",
};

export default function LiveStats() {
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancel = false;
    fetch("/api/stats", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => !cancel && setStats(d))
      .catch(() => !cancel && setError(true));
    return () => {
      cancel = true;
    };
  }, []);

  return (
    <section className="section-padding scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="05.telemetry"
          title="Live telemetry"
          subtitle="Pulled live from GitHub and LeetCode by an edge route handler this portfolio ships. Cached at the edge for 6 hours; falls back gracefully on rate-limit."
          meta={
            <a
              href="/api/stats"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <StatusPill tone={error ? "warn" : "ok"} pulse={!error}>
                {error ? "rate-limited" : "GET /api/stats"}
              </StatusPill>
            </a>
          }
        />

        {/* Stat tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[var(--panel-border)] border border-[var(--panel-border)] rounded-xl overflow-hidden mb-3">
          <Tile
            icon={<Star size={11} className="text-yellow-400" />}
            label="github stars"
            value={stats?.github ? String(stats.github.totalStars) : "—"}
            sub={
              stats?.github
                ? `across ${stats.github.publicRepos} repos`
                : "loading…"
            }
            href={stats?.github?.profileUrl}
          />
          <Tile
            icon={<GitBranch size={11} className="text-cyan-400" />}
            label="public repos"
            value={stats?.github ? String(stats.github.publicRepos) : "—"}
            sub={stats?.github ? `since ${stats.github.sinceYear}` : "loading…"}
            href={stats?.github?.profileUrl}
          />
          <Tile
            icon={<LeetcodeIcon size={11} className="text-orange-400" />}
            label="leetcode solved"
            value={String(stats?.leetcode.solved ?? 729)}
            sub={`@${stats?.leetcode.user ?? "lekh_nith"}`}
            href={stats?.leetcode.profileUrl}
          />
          <Tile
            icon={<Code2 size={11} className="text-purple-400" />}
            label="years shipping"
            value={String(stats?.experience.yearsTotal ?? 5)}
            sub="distributed systems · payments · saas"
          />
        </div>

        {/* Top languages bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.35 }}
          className="panel p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GithubIcon size={12} className="text-slate-500" />
              <span className="mono-label">top languages on github</span>
            </div>
            {stats?.generatedAt && (
              <span className="mono-tag text-[var(--text-chrome)]">
                generated {new Date(stats.generatedAt).toISOString().slice(0, 16)}Z
              </span>
            )}
          </div>
          {stats?.github && stats.github.topLanguages.length > 0 ? (
            <>
              <div
                className="flex h-1.5 w-full rounded-full overflow-hidden"
                style={{ background: "var(--panel-border)" }}
              >
                {stats.github.topLanguages.map((l) => {
                  const total = stats.github!.topLanguages.reduce(
                    (s, x) => s + x.repos,
                    0,
                  );
                  const pct = (l.repos / total) * 100;
                  return (
                    <div
                      key={l.language}
                      style={{
                        width: `${pct}%`,
                        background: LANG_COLOR[l.language] ?? "#475569",
                      }}
                      title={`${l.language} · ${l.repos} repos · ${pct.toFixed(0)}%`}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                {stats.github.topLanguages.map((l) => (
                  <div
                    key={l.language}
                    className="flex items-center gap-1.5 text-xs text-slate-400 font-mono"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: LANG_COLOR[l.language] ?? "#475569" }}
                    />
                    {l.language}
                    <span className="text-[var(--text-chrome)]">{l.repos}</span>
                  </div>
                ))}
              </div>
            </>
          ) : error ? (
            <p className="text-xs text-slate-500">
              GitHub API rate-limited right now. Refresh in a bit, or set{" "}
              <code className="font-mono text-slate-300">GITHUB_TOKEN</code> on the deploy.
            </p>
          ) : (
            <div
              className="h-1.5 w-full rounded-full animate-pulse"
              style={{ background: "var(--panel-border)" }}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Tile({
  icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  href?: string;
}) {
  const inner = (
    <div className="bg-[var(--panel-bg)] hover:bg-[var(--panel-bg-hover)] transition-colors p-4 h-full">
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="mono-label">{label}</span>
      </div>
      <div className="text-2xl font-semibold font-mono text-white mb-0.5">{value}</div>
      <div className="text-[11px] text-slate-500 truncate">{sub}</div>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
      {inner}
    </a>
  ) : (
    inner
  );
}

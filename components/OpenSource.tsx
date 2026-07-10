"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitPullRequest, GitMerge, CircleDot, CheckCircle2, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import SectionHeader from "@/components/console/SectionHeader";
import StatusPill from "@/components/console/StatusPill";

type RawEntry = {
  id: string;
  type: "pr" | "issue";
  repoUrl: string;
  link: string;
};

type FetchedItem = {
  url: string;
  ok: boolean;
  data: {
    number: number;
    title: string;
    state: "open" | "closed";
    merged: boolean;
    labels: string[];
    body: string;
  } | null;
};

type Contribution = RawEntry & {
  title: string;
  state: "open" | "closed";
  merged: boolean;
  labels: string[];
  body: string;
  project: string;
};

const SOURCE: RawEntry[] = [
  { id: "debezium-pr-7632", type: "pr",    repoUrl: "https://github.com/debezium/debezium", link: "https://github.com/debezium/debezium/pull/7632" },
  { id: "dbz-2209",         type: "issue", repoUrl: "https://github.com/debezium/dbz",       link: "https://github.com/debezium/dbz/issues/2209" },
  { id: "dbz-2210",         type: "issue", repoUrl: "https://github.com/debezium/dbz",       link: "https://github.com/debezium/dbz/issues/2210" },
  { id: "dbz-2214",         type: "issue", repoUrl: "https://github.com/debezium/dbz",       link: "https://github.com/debezium/dbz/issues/2214" },
];

const PER_PAGE = 5;

function TypeIcon({ type, merged, state }: { type: "pr" | "issue"; merged: boolean; state: "open" | "closed" }) {
  if (type === "pr") {
    return merged ? <GitMerge size={13} className="text-purple-400" />
      : <GitPullRequest size={13} className="text-[var(--accent)]" />;
  }
  return state === "closed"
    ? <CheckCircle2 size={13} className="text-emerald-400" />
    : <CircleDot size={13} className="text-orange-400" />;
}

function StatusBadge({ type, merged, state }: { type: "pr" | "issue"; merged: boolean; state: "open" | "closed" }) {
  if (type === "pr" && merged) return <StatusPill tone="ok">merged</StatusPill>;
  if (state === "closed") return <StatusPill tone="ok">closed</StatusPill>;
  return <StatusPill tone="info">open</StatusPill>;
}

function shortId(id: string) {
  return id.replace("debezium-pr", "PR").replace("dbz", "#");
}

function projectFromUrl(url: string) {
  const m = url.match(/github\.com\/([^/]+\/[^/]+)/);
  return m ? m[1] : url;
}

export default function OpenSource() {
  const [items, setItems] = useState<Contribution[] | null>(null);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<"all" | "pr" | "issue">("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancel = false;
    fetch("/api/contributions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: SOURCE.map((s) => ({ url: s.link })) }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((res) => {
        if (cancel) return;
        const merged: Contribution[] = SOURCE.map((s, i) => {
          const f = res.items[i] as FetchedItem;
          return {
            ...s,
            title: f.ok ? f.data!.title : s.id,
            state: f.ok ? f.data!.state : "open",
            merged: f.ok ? f.data!.merged : false,
            labels: f.ok ? f.data!.labels : [],
            body: f.ok ? f.data!.body : "",
            project: projectFromUrl(s.repoUrl),
          };
        });
        setItems(merged);
      })
      .catch(() => !cancel && setError(true));
    return () => { cancel = true; };
  }, []);

  const display = items ?? [];
  const filtered = display.filter((c) => filter === "all" || c.type === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const count = (type: "all" | "pr" | "issue") =>
    type === "all" ? display.length : display.filter((c) => c.type === type).length;

  const FILTERS = [
    { key: "all",   label: "All",   count: count("all") },
    { key: "pr",    label: "PRs",   count: count("pr") },
    { key: "issue", label: "Issues", count: count("issue") },
  ] as const;

  return (
    <section id="opensource" className="section-padding scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="05.contributions"
          title="Open source"
          subtitle="Contributions to the broader ecosystem — PRs merged, issues filed, and projects maintained outside my own repos."
          meta={
            <span className="mono-tag text-[var(--text-chrome)]">
              {display.length} contributions
            </span>
          }
        />

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-4">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                filter === f.key
                  ? "text-white bg-[var(--panel-bg)]"
                  : "text-slate-400 hover:text-white hover:bg-[var(--panel-bg)]"
              }`}
            >
              {f.label}
              <span className="text-[var(--text-chrome)]">{f.count}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        {error ? (
          <div className="panel p-6 text-center">
            <p className="text-xs text-slate-500">GitHub API rate-limited. Contributions will reload next time.</p>
          </div>
        ) : !items ? (
          <div className="panel p-6 text-center">
            <div className="h-4 w-24 mx-auto rounded animate-pulse" style={{ background: "var(--panel-border)" }} />
          </div>
        ) : paged.length > 0 ? (
          <>
            <div className="border border-[var(--panel-border)] rounded-xl overflow-hidden">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-[var(--panel-border)] bg-[var(--bg-primary)]">
                    <th className="text-left px-4 py-2.5 text-[var(--text-chrome)] font-normal w-10" />
                    <th className="text-left px-0 py-2.5 text-[var(--text-chrome)] font-normal">Project</th>
                    <th className="text-left px-3 py-2.5 text-[var(--text-chrome)] font-normal hidden sm:table-cell">Description</th>
                    <th className="text-left px-3 py-2.5 text-[var(--text-chrome)] font-normal w-24">Status</th>
                    <th className="text-left px-3 py-2.5 text-[var(--text-chrome)] font-normal hidden md:table-cell w-10" />
                  </tr>
                </thead>
                <tbody>
                  {paged.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                      className="border-b border-[var(--panel-border)] last:border-b-0 hover:bg-[var(--panel-bg-hover)] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <a href={c.link} target="_blank" rel="noopener noreferrer" className="block">
                          <TypeIcon type={c.type} merged={c.merged} state={c.state} />
                        </a>
                      </td>
                      <td className="px-0 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-white">{c.project}</span>
                          <span className="text-[var(--text-chrome)]">{shortId(c.id)}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-400 hidden sm:table-cell max-w-xs truncate">
                        {c.title}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge type={c.type} merged={c.merged} state={c.state} />
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                          <ExternalLink size={12} />
                        </a>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px] text-slate-500 font-mono">page {safePage} of {totalPages}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage <= 1}
                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[var(--panel-bg)] disabled:opacity-30 disabled:pointer-events-none transition-colors">
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-md text-xs font-mono transition-colors ${
                        p === safePage ? "text-white bg-[var(--panel-bg)]" : "text-slate-400 hover:text-white hover:bg-[var(--panel-bg)]"
                      }`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage >= totalPages}
                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[var(--panel-bg)] disabled:opacity-30 disabled:pointer-events-none transition-colors">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="panel p-8 text-center">
            <GitPullRequest size={20} className="mx-auto mb-3 text-slate-500" />
            <p className="text-sm text-slate-400 font-mono">No {filter === "pr" ? "PRs" : filter === "issue" ? "issues" : "contributions"} yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

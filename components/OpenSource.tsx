"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitPullRequest, GitMerge, CircleDot, CheckCircle2, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import SectionHeader from "@/components/console/SectionHeader";
import StatusPill from "@/components/console/StatusPill";

export type Contribution = {
  id: string;
  type: "pr" | "issue";
  project: string;
  repoUrl: string;
  description: string;
  status: "merged" | "open" | "closed" | "active" | "wip";
  tags: string[];
  link?: string;
};

const contributions: Contribution[] = [
  {
    id: "debezium-pr-7632",
    type: "pr",
    project: "debezium/debezium",
    repoUrl: "https://github.com/debezium/debezium",
    description:
      "Fixed hardcoded MySQL connector type in CdcSourceTaskContext.temporaryLoggingContext.",
    status: "merged",
    tags: ["Java", "Kafka Connect", "Debezium"],
    link: "https://github.com/debezium/debezium/pull/7632",
  },
  {
    id: "dbz-2209",
    type: "issue",
    project: "debezium/dbz",
    repoUrl: "https://github.com/debezium/dbz",
    description:
      "Migrate connectors from deprecated dispatchHeartbeatEvent to alwaysDispatchHeartbeatEvent as part of DBZ-9176 ScheduledHeartbeat.",
    status: "open",
    tags: ["core-library", "task"],
    link: "https://github.com/debezium/dbz/issues/2209",
  },
  {
    id: "dbz-2210",
    type: "issue",
    project: "debezium/dbz",
    repoUrl: "https://github.com/debezium/dbz",
    description:
      "Identified hardcoded MySQL connector type in CdcSourceTaskContext. Fixed via debezium/debezium#7632.",
    status: "closed",
    tags: ["bug"],
    link: "https://github.com/debezium/dbz/issues/2210",
  },
  {
    id: "dbz-2214",
    type: "issue",
    project: "debezium/dbz",
    repoUrl: "https://github.com/debezium/dbz",
    description:
      "Expose queue fill ratio in ChangeEventQueue so sources can preemptively throttle before blocking.",
    status: "open",
    tags: ["enhancement"],
    link: "https://github.com/debezium/dbz/issues/2214",
  },
];

const PER_PAGE = 5;

function TypeIcon({ type, status }: { type: Contribution["type"]; status: Contribution["status"] }) {
  if (type === "pr") {
    return status === "merged"
      ? <GitMerge size={13} className="text-purple-400" />
      : <GitPullRequest size={13} className="text-[var(--accent)]" />;
  }
  return status === "closed"
    ? <CheckCircle2 size={13} className="text-emerald-400" />
    : <CircleDot size={13} className="text-orange-400" />;
}

function StatusBadge({ type, status }: { type: Contribution["type"]; status: Contribution["status"] }) {
  const tone =
    (type === "pr" && status === "merged") || (type === "issue" && status === "closed")
      ? "ok" as const
      : status === "open"
        ? "info" as const
        : "muted" as const;

  const label =
    (type === "pr" && status === "merged") || (type === "issue" && status === "closed")
      ? status
      : status;

  return <StatusPill tone={tone}>{label}</StatusPill>;
}

function shortId(id: string) {
  return id.replace("debezium-pr", "PR").replace("dbz", "#");
}

export default function OpenSource() {
  const [filter, setFilter] = useState<"all" | "pr" | "issue">("all");
  const [page, setPage] = useState(1);

  const filtered = contributions.filter(
    (c) => filter === "all" || c.type === filter,
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const FILTERS = [
    { key: "all", label: "All", count: contributions.length },
    { key: "pr", label: "PRs", count: contributions.filter((c) => c.type === "pr").length },
    { key: "issue", label: "Issues", count: contributions.filter((c) => c.type === "issue").length },
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
              {contributions.length} contributions
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
        {paged.length > 0 ? (
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
                        <a
                          href={c.link || c.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <TypeIcon type={c.type} status={c.status} />
                        </a>
                      </td>
                      <td className="px-0 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-white">{c.project}</span>
                          <span className="text-[var(--text-chrome)]">{shortId(c.id)}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-400 hidden sm:table-cell max-w-xs truncate">
                        {c.description}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge type={c.type} status={c.status} />
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        {c.link && (
                          <a
                            href={c.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-white transition-colors"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px] text-slate-500 font-mono">
                  page {safePage} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(Math.max(1, safePage - 1))}
                    disabled={safePage <= 1}
                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[var(--panel-bg)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-md text-xs font-mono transition-colors ${
                        p === safePage
                          ? "text-white bg-[var(--panel-bg)]"
                          : "text-slate-400 hover:text-white hover:bg-[var(--panel-bg)]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                    disabled={safePage >= totalPages}
                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[var(--panel-bg)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="panel p-8 text-center">
            <GitPullRequest size={20} className="mx-auto mb-3 text-slate-500" />
            <p className="text-sm text-slate-400 font-mono">
              No {filter === "pr" ? "PRs" : filter === "issue" ? "issues" : "contributions"} yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

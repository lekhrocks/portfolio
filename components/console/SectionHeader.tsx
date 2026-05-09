"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Props = {
  /** Mono-style id like `01.about` displayed at the top */
  id: string;
  /** Big section title */
  title: string;
  /** Subtitle / one-line description */
  subtitle?: string;
  /** Optional right-side meta nodes (status pill, link, kbd, etc.) */
  meta?: React.ReactNode;
};

/**
 * Console-style section header. Left-aligned, monospace id, slim divider.
 * Replaces the centered "01 / About" badge + centered title pattern.
 */
export default function SectionHeader({ id, title, subtitle, meta }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.header
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-end justify-between gap-4 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[var(--accent)]" aria-hidden>
              §
            </span>
            <span className="mono-label">{id}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
            {title}
          </h2>
        </div>
        {meta && <div className="shrink-0 flex items-center gap-2">{meta}</div>}
      </div>
      {subtitle && (
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">{subtitle}</p>
      )}
      <div className="panel-divider mt-6" />
    </motion.header>
  );
}

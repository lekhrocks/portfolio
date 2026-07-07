"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-1.5 rounded-md text-xs font-mono bg-[var(--accent)] text-black hover:opacity-90 transition-opacity"
    >
      Download PDF (Ctrl+P → Save as PDF)
    </button>
  );
}

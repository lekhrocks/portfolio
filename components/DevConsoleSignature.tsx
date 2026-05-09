"use client";

import { useEffect } from "react";

/**
 * Dev easter egg — anyone who pops the DevTools console gets a friendly
 * greeting + recruiter contact. Costs nothing, signals personality.
 */
export default function DevConsoleSignature() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as unknown as { __lk_signed?: boolean }).__lk_signed) return;
    (window as unknown as { __lk_signed?: boolean }).__lk_signed = true;

    const banner = `
%c
   __         __    __                 _
  / /  ___ __/ /__ / /_  _______ _____(_)
 / /__/ -_) /  '_// __ \\/ __/ _ \`/ __ /
/____/\\__/_/_/\\_\\/_/ /_/_/  \\_,_/\\_,_/
                                            
%cBackend Software Engineer · Distributed Systems · 5+ yrs
`;

    const styles = [
      "color:#06b6d4; font-family:ui-monospace,Menlo,monospace; font-size:12px; line-height:1;",
      "color:#94a3b8; font-family:ui-sans-serif,system-ui,sans-serif; font-size:13px; padding-top:6px;",
    ];

    // eslint-disable-next-line no-console
    console.log(banner, ...styles);
    // eslint-disable-next-line no-console
    console.log(
      "%cHiring? %cReach me at lekh.nith@gmail.com — open to Senior/Staff Backend roles.",
      "color:#22c55e; font-weight:600;",
      "color:#cbd5e1;",
    );
    // eslint-disable-next-line no-console
    console.log(
      "%cThis portfolio ships live APIs — try /api/health and /api/stats.",
      "color:#a78bfa;",
    );
  }, []);

  return null;
}

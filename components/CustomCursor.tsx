"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicked, setClicked] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 30, mass: 0.4 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect users on touch devices and those who prefer reduced motion.
    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!supportsHover || reducedMotion) return;

    // Defer the cursor until the browser is idle so hydration isn't blocked —
    // it's a visual nicety, not something the first interaction needs.
    let cancelled = false;
    let idle: number | undefined;
    const mount = () => {
      if (cancelled) return;
      setEnabled(true);
      document.documentElement.classList.add("custom-cursor");
    };
    if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(mount, { timeout: 1500 });
    } else {
      idle = window.setTimeout(mount, 0);
    }

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'a, button, input, textarea, [role="button"], [data-cursor-hover]'
      );
      setHovering(!!interactive);
    };
    const handleDown = () => setClicked(true);
    const handleUp = () => setClicked(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      cancelled = true;
      if (idle !== undefined) {
        if (typeof window.requestIdleCallback === "function") {
          window.cancelIdleCallback?.(idle);
        } else {
          window.clearTimeout(idle);
        }
      }
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[200] mix-blend-difference"
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: hovering ? 1.6 : clicked ? 0.7 : 1,
            opacity: hovering ? 0.5 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="w-8 h-8 rounded-full border border-white"
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[200]"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: clicked ? 1.4 : 1,
            backgroundColor: hovering ? "#06b6d4" : "#3b82f6",
          }}
          transition={{ duration: 0.15 }}
          className="w-2 h-2 rounded-full"
          style={{ boxShadow: "0 0 12px currentColor" }}
        />
      </motion.div>
    </>
  );
}

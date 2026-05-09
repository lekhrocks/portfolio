"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

type Props = {
  value: string;
  duration?: number;
  className?: string;
};

function parseValue(value: string) {
  const match = value.match(/^([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return { num: 0, suffix: value, isFloat: false };
  return {
    num: parseFloat(match[1]),
    suffix: match[2],
    isFloat: match[1].includes("."),
  };
}

export default function AnimatedNumber({
  value,
  duration = 2,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const { num, suffix, isFloat } = parseValue(value);

  const motionVal = useMotionValue(0);
  const [displayed, setDisplayed] = useState("0" + suffix);

  useEffect(() => {
    const unsubscribe = motionVal.on("change", (latest) => {
      if (isFloat) {
        setDisplayed(latest.toFixed(1) + suffix);
      } else {
        setDisplayed(Math.round(latest).toString() + suffix);
      }
    });
    return unsubscribe;
  }, [motionVal, suffix, isFloat]);

  useEffect(() => {
    if (inView) {
      const controls = animate(motionVal, num, { duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, num, duration, motionVal]);

  return (
    <span ref={ref} className={className}>
      {displayed}
    </span>
  );
}

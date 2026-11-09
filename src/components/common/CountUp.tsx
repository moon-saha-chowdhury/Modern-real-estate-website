"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE_MERIDIAN } from "@/lib/animations/eases";
import type { CountUpProps } from "@/types/sections";

const formatter = new Intl.NumberFormat("en");

/**
 * Counts up once when scrolled into view. Writes to the DOM directly (no React re-render per
 * frame). Server-renders the final value, so the number is correct without JavaScript.
 */
export function CountUp({ to, suffix = "", className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduced) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: EASE_MERIDIAN,
      onUpdate: (value) => {
        el.textContent = `${formatter.format(Math.round(value))}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduced, suffix, to]);

  return (
    <span ref={ref} className={className}>
      {formatter.format(to)}
      {suffix}
    </span>
  );
}

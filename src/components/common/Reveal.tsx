"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { DURATION, EASE_MERIDIAN } from "@/lib/animations/eases";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance in px to travel upward. */
  y?: number;
  immediate?: boolean;
}

/** Quiet fade-and-rise for supporting content (paragraphs, CTAs, metadata). */
export function Reveal({ children, className, delay = 0, y = 24, immediate = false }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...(immediate
        ? { animate: { opacity: 1, y: 0 } }
        : {
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "0px 0px -10% 0px" },
          })}
      transition={{ duration: DURATION.reveal, ease: EASE_MERIDIAN, delay }}
    >
      {children}
    </motion.div>
  );
}

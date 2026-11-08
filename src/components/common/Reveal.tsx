"use client";

import { motion } from "motion/react";
import { DURATION, EASE_MERIDIAN } from "@/lib/animations/eases";
import { VIEWPORT_BLOCK } from "@/lib/animations/presets";
import type { RevealProps } from "@/types/ui";

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
            viewport: VIEWPORT_BLOCK,
          })}
      transition={{ duration: DURATION.reveal, ease: EASE_MERIDIAN, delay }}
    >
      {children}
    </motion.div>
  );
}

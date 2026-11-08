"use client";

import { motion } from "motion/react";
import type { ElementType, ReactNode } from "react";
import { DURATION, EASE_MERIDIAN, STAGGER } from "@/lib/animations/eases";
import { cn } from "@/lib/utils/cn";

interface TextRevealProps {
  /** Each entry is one deliberately controlled line. Supports inline markup (e.g. <em>). */
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Animate on mount instead of when scrolled into view (hero). */
  immediate?: boolean;
}

/**
 * Line-by-line masked reveal. Each line slides up from behind its own mask.
 * Reduced motion: MotionConfig (reducedMotion="user") drops the transform; content stays readable.
 */
export function TextReveal({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  delay = 0,
  immediate = false,
}: TextRevealProps) {
  const viewport = { once: true, margin: "0px 0px -12% 0px" } as const;

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={cn("-mb-[0.08em] block overflow-hidden pb-[0.08em]", lineClassName)}
        >
          <motion.span
            className="block will-change-transform"
            initial={{ y: "105%" }}
            {...(immediate ? { animate: { y: "0%" } } : { whileInView: { y: "0%" }, viewport })}
            transition={{
              duration: DURATION.reveal,
              ease: EASE_MERIDIAN,
              delay: delay + i * STAGGER * 1.5,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

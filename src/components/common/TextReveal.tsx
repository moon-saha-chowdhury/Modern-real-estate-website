"use client";

import { motion } from "motion/react";
import { DURATION, EASE_MERIDIAN, STAGGER } from "@/lib/animations/eases";
import { LINE_STAGGER_MULTIPLIER, VIEWPORT_TEXT } from "@/lib/animations/presets";
import { cn } from "@/lib/utils/cn";
import type { TextRevealProps } from "@/types/ui";

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
  id,
}: TextRevealProps) {
  return (
    <Tag id={id} className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={cn("-mb-[0.08em] block overflow-hidden pb-[0.08em]", lineClassName)}
        >
          <motion.span
            className="block will-change-transform"
            initial={{ y: "105%" }}
            {...(immediate
              ? { animate: { y: "0%" } }
              : { whileInView: { y: "0%" }, viewport: VIEWPORT_TEXT })}
            transition={{
              duration: DURATION.reveal,
              ease: EASE_MERIDIAN,
              delay: delay + i * STAGGER * LINE_STAGGER_MULTIPLIER,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

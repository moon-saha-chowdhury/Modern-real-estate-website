"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ElementType } from "react";
import { DURATION, EASE_MERIDIAN, STAGGER } from "@/lib/animations/eases";
import { LINE_STAGGER_MULTIPLIER, VIEWPORT_TEXT } from "@/lib/animations/presets";
import { EMPHASIS_CLASS } from "@/lib/constants/ui";
import { cn } from "@/lib/utils/cn";
import { splitEmphasis } from "@/lib/utils/emphasis";
import type { TextRevealProps } from "@/types/ui";

/**
 * Line-by-line masked reveal. Each line slides up from behind its own mask.
 *
 * Visibility is observed on the heading itself, never on the masked lines: a line that starts
 * fully below its overflow-hidden mask is clipped to zero and would never register as in view.
 *
 * Lines are plain strings; wrap words in *asterisks* to set them as emphasis (slanted, champagne
 * on dark surfaces, sage on ivory). Strings keep the server → client props key-free.
 * Reduced motion: MotionConfig (reducedMotion="user") drops the transform; content stays readable.
 */
export function TextReveal({
  lines,
  as = "h2",
  className,
  lineClassName,
  delay = 0,
  immediate = false,
  id,
  flowBelowLg = false,
}: TextRevealProps) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, VIEWPORT_TEXT);
  const shown = immediate || inView;

  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((line, i) => (
        <span
          key={`${i}-${line}`}
          className={cn(
            flowBelowLg
              ? "inline lg:-mb-[0.08em] lg:block lg:overflow-hidden lg:pb-[0.08em]"
              : "-mb-[0.08em] block overflow-hidden pb-[0.08em]",
            lineClassName,
          )}
        >
          {/* Inline elements ignore transforms, so below lg the flowing text simply appears. */}
          <motion.span
            className={cn("will-change-transform", flowBelowLg ? "inline lg:block" : "block")}
            initial={{ y: "105%" }}
            animate={{ y: shown ? "0%" : "105%" }}
            transition={{
              duration: DURATION.reveal,
              ease: EASE_MERIDIAN,
              delay: delay + i * STAGGER * LINE_STAGGER_MULTIPLIER,
            }}
          >
            {splitEmphasis(line).map((part, j) =>
              part.emphasis ? (
                <em key={j} className={EMPHASIS_CLASS}>
                  {part.text}
                </em>
              ) : (
                part.text
              ),
            )}
            {flowBelowLg && i < lines.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

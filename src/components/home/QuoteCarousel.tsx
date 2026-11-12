"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SPRING } from "@/lib/animations/presets";
import { displayIndex } from "@/lib/utils/projects";
import type { QuoteCarouselProps } from "@/types/sections";

/**
 * One large quote at a time. Every quote sits in the same grid cell, so the block is as tall as
 * the longest and nothing below it jumps; the chosen one springs in (critically damped, from the
 * side it came from) and the others step back. Springs can be redirected mid-flight, so quick
 * clicks never queue. Nothing advances by itself. Inactive quotes are inert (not focusable, not
 * read out); the live region announces the new one. Reduced motion: a plain cross-fade.
 */
export function QuoteCarousel({ quotes }: QuoteCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduced = usePrefersReducedMotion();

  const go = (step: number) => {
    setDirection(step);
    setIndex((current) => (current + step + quotes.length) % quotes.length);
  };

  return (
    <div
      className="flex flex-col gap-12"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") go(-1);
        if (event.key === "ArrowRight") go(1);
      }}
    >
      <div className="grid" aria-live="polite">
        {quotes.map((quote, i) => {
          const active = i === index;
          return (
            <motion.figure
              key={quote.id}
              inert={!active}
              aria-hidden={!active}
              initial={false}
              animate={{
                opacity: active ? 1 : 0,
                x: reduced || active ? 0 : -direction * 28,
              }}
              transition={reduced ? { duration: 0.2 } : SPRING.DEFAULT}
              style={{ gridArea: "1 / 1" }}
              className="flex flex-col gap-10"
            >
              <blockquote className="font-display text-display-md">
                <p>&ldquo;{quote.quote}&rdquo;</p>
              </blockquote>
              <figcaption className="label-mono text-fg-muted">
                {quote.author} · {quote.role}
              </figcaption>
            </motion.figure>
          );
        })}
      </div>

      {quotes.length > 1 && (
        <div className="flex items-center gap-6 border-t border-rule pt-6">
          <p className="label-mono text-fg-muted tabular-nums" aria-hidden="true">
            {displayIndex(index)} / {displayIndex(quotes.length - 1)}
          </p>
          <div className="ml-auto flex gap-px">
            {(
              [
                ["Previous quote", -1, ArrowLeft],
                ["Next quote", 1, ArrowRight],
              ] as const
            ).map(([label, step, Icon]) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                onClick={() => go(step)}
                className="flex size-12 cursor-pointer items-center justify-center border border-rule transition-[background-color,scale] duration-300 ease-meridian hover:bg-fg/5 active:scale-95 active:duration-100"
              >
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-4" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

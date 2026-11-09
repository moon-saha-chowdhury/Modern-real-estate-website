"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import { displayIndex } from "@/lib/utils/projects";
import type { ProcessTimelineProps } from "@/types/sections";

/**
 * The connecting line is scrubbed by ScrollTrigger (scaleX on desktop, scaleY on mobile);
 * stage markers light up as the line reaches them. Reduced motion: line drawn, markers lit.
 */
export function ProcessTimeline({ stages }: ProcessTimelineProps) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const desktop = Boolean(ctx.conditions?.desktop);
          const line = root.current?.querySelector<HTMLElement>("[data-line]");
          const markers = gsap.utils.toArray<HTMLElement>("[data-marker]", root.current);
          if (!line) return;

          gsap.set(line, desktop ? { scaleX: 0, scaleY: 1 } : { scaleY: 0, scaleX: 1 });
          gsap.set(markers, { backgroundColor: "var(--color-line-light)" });

          gsap.to(line, {
            [desktop ? "scaleX" : "scaleY"]: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: desktop ? "top 75%" : "top 70%",
              end: desktop ? "bottom 55%" : "bottom 60%",
              scrub: 0.6,
              onUpdate: (self) => {
                const reached = Math.floor(self.progress * (markers.length - 1) + 0.0001);
                markers.forEach((marker, i) => {
                  marker.style.backgroundColor =
                    i <= reached ? "var(--color-brand)" : "var(--color-line-light)";
                });
              },
            },
          });
        },
      );

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <ol
      ref={root}
      className="relative grid grid-cols-1 gap-y-12 pl-10 lg:grid-cols-6 lg:gap-x-6 lg:pt-12 lg:pl-0"
    >
      {/* Track + drawn line */}
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[5px] w-px bg-rule lg:inset-x-0 lg:top-[5px] lg:bottom-auto lg:h-px lg:w-auto"
      />
      <span
        data-line
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-brand lg:inset-x-0 lg:top-[5px] lg:bottom-auto lg:h-px lg:w-auto lg:origin-left"
      />

      {stages.map((stage, i) => (
        <li key={stage.id} className="relative flex flex-col gap-4">
          <span
            data-marker
            aria-hidden="true"
            className="absolute top-1.5 -left-10 size-[11px] bg-brand lg:-top-12 lg:left-0"
          />
          <span className="font-display text-display-sm text-sage tabular-nums">
            {displayIndex(i)}
          </span>
          <h3 className="text-lead font-medium text-fg">{stage.title}</h3>
          <p className="max-w-xs text-small text-fg-muted">{stage.description}</p>
        </li>
      ))}
    </ol>
  );
}

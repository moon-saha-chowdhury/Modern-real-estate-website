"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import { displayIndex } from "@/lib/utils/projects";
import type { ProcessTimelineProps } from "@/types/sections";

const MARKER_OFF = "var(--color-line-light)";
const MARKER_ON = "var(--color-brand)";

/**
 * Six stages like floors: from lg each column is one storey (4.5rem) taller than the one to its
 * left, standing on a common ground line, so the row rises to the right like the tower in the
 * hero. A scrubbed line fills each column bottom to top in turn, and its marker lights as it
 * starts. Below lg: a vertical list with one drawn line. Reduced motion: lines drawn, markers lit.
 */
export function ProcessTimeline({ stages }: ProcessTimelineProps) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      const markers = gsap.utils.toArray<HTMLElement>("[data-marker]", el);

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const floors = gsap.utils.toArray<HTMLElement>("[data-floor]", el);
        gsap.set(floors, { scaleY: 0 });
        gsap.set(markers, { backgroundColor: MARKER_OFF });
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          end: "bottom 65%",
          scrub: 0.6,
          onUpdate: (self) => {
            floors.forEach((floor, i) => {
              const local = gsap.utils.clamp(0, 1, self.progress * floors.length - i);
              gsap.set(floor, { scaleY: local });
              markers[i].style.backgroundColor = local > 0 ? MARKER_ON : MARKER_OFF;
            });
          },
        });
      });

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        const line = el.querySelector<HTMLElement>("[data-line]");
        if (!line) return;
        gsap.set(line, { scaleY: 0 });
        gsap.set(markers, { backgroundColor: MARKER_OFF });
        ScrollTrigger.create({
          trigger: el,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.6,
          onUpdate: (self) => {
            gsap.set(line, { scaleY: self.progress });
            const reached = Math.floor(self.progress * (markers.length - 1) + 0.0001);
            markers.forEach((marker, i) => {
              marker.style.backgroundColor = i <= reached ? MARKER_ON : MARKER_OFF;
            });
          },
        });
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <ol
      ref={root}
      className="relative grid grid-cols-1 gap-y-12 pl-10 lg:grid-cols-6 lg:items-end lg:gap-x-8 lg:gap-y-0 lg:border-b lg:border-rule lg:pl-0"
    >
      {/* Small screens: one track + drawn line down the left */}
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[5px] w-px bg-rule lg:hidden"
      />
      <span
        data-line
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-brand lg:hidden"
      />

      {stages.map((stage, i) => (
        <li
          key={stage.id}
          style={{ "--floor": i } as CSSProperties}
          className="relative flex flex-col gap-4 lg:pb-[calc(var(--floor)*4.5rem)] lg:pl-6"
        >
          {/* lg+: this column's own line, from its top down to the ground line */}
          <span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-0 hidden w-px bg-rule lg:block"
          />
          <span
            data-floor
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-0 hidden w-px origin-bottom bg-brand lg:block"
          />
          <span
            data-marker
            aria-hidden="true"
            className="absolute top-1.5 -left-10 size-[11px] bg-brand lg:top-0 lg:-left-[5px]"
          />
          <span className="font-display text-display-md text-sage tabular-nums">
            {displayIndex(i)}
          </span>
          <h3 className="text-lead font-medium text-fg">{stage.title}</h3>
          <p className="max-w-xs text-small text-fg-muted">{stage.description}</p>
        </li>
      ))}
    </ol>
  );
}

"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  DRAWING_LAYERS,
  DRAWING_SCROLL_OFFSET,
  DRAWING_SIZE,
  DRAWING_SPRING,
} from "@/lib/constants/process-drawing";
import { displayIndex } from "@/lib/utils/projects";
import type { ProcessDrawingProps } from "@/types/sections";
import type { DrawingLight, DrawingPath } from "@/types/process";

/** Each stage owns a sixth of the scroll; its lines are drawn in the first 85% of that. */
const STEPS = DRAWING_LAYERS.length;
const SPAN = 0.85 / STEPS;

/** One stroke: drawn from its start (solid) or faded in (dashed), over `range` of the progress. */
function Stroke({
  path,
  progress,
  range,
}: {
  path: DrawingPath;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const amount = useTransform(progress, range, [0, 1], { clamp: true });
  const faded = useTransform(amount, (value) => value * (path.opacity ?? 1));
  return (
    <motion.path
      d={path.d}
      fill="none"
      stroke={path.tone === "brand" ? "var(--color-brand)" : "currentColor"}
      strokeWidth={path.width ?? 1}
      strokeDasharray={path.dash}
      strokeLinecap="square"
      vectorEffect="non-scaling-stroke"
      style={path.dash ? { opacity: faded } : { pathLength: amount, opacity: path.opacity ?? 1 }}
    />
  );
}

/** One window that lights up, a little after the one before it. */
function Light({
  light,
  progress,
  range,
}: {
  light: DrawingLight;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0, 1], { clamp: true });
  return (
    <motion.rect
      x={light.x}
      y={light.y}
      width={light.width}
      height={light.height}
      fill="var(--color-bronze)"
      style={{ opacity }}
    />
  );
}

/**
 * Six stages beside the elevation of a building that they draw. The drawing sits pinned on the
 * left (CSS sticky) and each stage adds a layer of lines as its row comes up the list: the plot,
 * the massing, the facade, the structure, a crane, and finally the windows lighting. The list
 * drives the drawing through scroll progress, smoothed by a critically damped spring, so there is
 * nothing to time and nothing that overshoots; one property per mark (its line length or its
 * opacity). The row crossing the middle of the screen is read at full strength.
 * Below lg and with reduced motion the drawing is shown complete and the rows simply stack.
 */
export function ProcessDrawing({ stages }: ProcessDrawingProps) {
  const list = useRef<HTMLOListElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduced = usePrefersReducedMotion();
  const live = desktop && !reduced;

  const { scrollYProgress } = useScroll({
    target: list,
    offset: [...DRAWING_SCROLL_OFFSET],
  });
  const smooth = useSpring(scrollYProgress, DRAWING_SPRING);
  const complete = useMotionValue(1);
  const progress = live ? smooth : complete;

  // The row crossing the middle of the viewport is the active one.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const rows = [...el.querySelectorAll<HTMLElement>("[data-row]")];
    const count = el.querySelector<HTMLElement>("[data-count]");
    const name = el.querySelector<HTMLElement>("[data-name]");
    const activate = (index: number) => {
      rows.forEach((row, i) => (row.dataset.active = String(i === index)));
      if (count) count.textContent = `${displayIndex(index)} / ${displayIndex(rows.length - 1)}`;
      if (name) name.textContent = stages[index]?.title ?? "";
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activate(rows.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [stages]);

  return (
    <div ref={root} className="grid-editorial gap-y-12">
      <figure className="col-span-full lg:col-span-5">
        <div className="mx-auto max-w-sm lg:sticky lg:top-[calc(var(--spacing-nav)+2rem)] lg:max-w-none">
          <svg
            viewBox={`0 0 ${DRAWING_SIZE.width} ${DRAWING_SIZE.height}`}
            preserveAspectRatio="xMidYMax meet"
            role="img"
            aria-label="An elevation drawing of a twenty-storey residential tower, built up in six layers: the plot, the massing, the facade, the structure, a crane and lit windows."
            className="h-auto max-h-[calc(100svh-var(--spacing-nav)-9rem)] w-full text-fg"
          >
            {DRAWING_LAYERS.map((layer, i) => {
              const start = (i / STEPS) * 0.97;
              return (
                <g key={layer.stageId}>
                  {layer.paths.map((path, j) => {
                    const from = start + (j / Math.max(layer.paths.length, 1)) * SPAN * 0.35;
                    return (
                      <Stroke
                        key={j}
                        path={path}
                        progress={progress}
                        range={[from, from + SPAN * 0.65]}
                      />
                    );
                  })}
                  {layer.lights?.map((light, j) => {
                    const from = start + (j / (layer.lights?.length ?? 1)) * SPAN * 0.6;
                    return (
                      <Light
                        key={j}
                        light={light}
                        progress={progress}
                        range={[from, from + SPAN * 0.3]}
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>
          <figcaption className="mt-4 flex items-center justify-between gap-4 border-t border-rule pt-4 label-mono text-fg-muted">
            <span className="tabular-nums">
              <span data-count>01 / {displayIndex(stages.length - 1)}</span>
              {" · "}
              <span data-name className="text-fg">
                {stages[0]?.title}
              </span>
            </span>
            <span className="hidden sm:inline">Illustrative drawing</span>
          </figcaption>
        </div>
      </figure>

      <ol ref={list} className="col-span-full lg:col-span-6 lg:col-start-7">
        {stages.map((stage, i) => (
          <li
            key={stage.id}
            data-row
            data-active={i === 0}
            className="group/row flex items-center border-t border-rule last:border-b lg:min-h-[56svh]"
          >
            <div className="grid w-full grid-cols-[3rem_1fr] gap-x-6 gap-y-3 py-9 transition-opacity duration-700 ease-meridian motion-reduce:transition-none lg:py-12 lg:opacity-30 lg:group-data-[active=true]/row:opacity-100">
              <span className="pt-2 label-mono text-accent tabular-nums">{displayIndex(i)}</span>
              <h3 className="font-display text-display-sm">{stage.title}</h3>
              <p className="col-start-2 max-w-sm text-fg-muted">{stage.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DRAWING_LAYERS, DRAWING_SIZE, DRAWING_SPRING } from "@/lib/constants/process-drawing";
import { cn } from "@/lib/utils/cn";
import { displayIndex } from "@/lib/utils/projects";
import type { DrawingLabel, DrawingLight, DrawingPath } from "@/types/process";
import type { ProcessSheetProps } from "@/types/sections";

const STEPS = DRAWING_LAYERS.length;
/** Each stage owns a sixth of the scroll; its lines are drawn within the first 80% of that. */
const SPAN = 0.8 / STEPS;
/** The last layer is finished by the time 94% of the scroll has passed. */
const START_SCALE = 0.94;

/** One stroke: drawn from its start (solid) or faded in (dashed). */
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
      className="[stroke:var(--stroke)] transition-[stroke] duration-700 ease-meridian motion-reduce:transition-none"
      strokeWidth={path.width ?? 1}
      strokeDasharray={path.dash}
      strokeLinecap="square"
      vectorEffect="non-scaling-stroke"
      style={path.dash ? { opacity: faded } : { pathLength: amount, opacity: path.opacity ?? 1 }}
    />
  );
}

/** A window that lights up. */
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

/** A level mark, fading in with its layer. */
function Label({
  label,
  progress,
  range,
}: {
  label: DrawingLabel;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0, 0.7], { clamp: true });
  return (
    <motion.text
      x={label.x}
      y={label.y}
      fill="currentColor"
      fontSize={13}
      letterSpacing={1.6}
      fontFamily="var(--font-mono)"
      style={{ opacity }}
    >
      {label.text}
    </motion.text>
  );
}

/** A hairline that fills, in the brand colour, as the stage `index` is drawn, and stays full after. */
function StageFill({
  progress,
  index,
  className,
}: {
  progress: MotionValue<number>;
  index: number;
  className?: string;
}) {
  const start = (index / STEPS) * START_SCALE;
  const scaleX = useTransform(progress, [start, start + SPAN], [0, 1], { clamp: true });
  return (
    <motion.span
      aria-hidden="true"
      style={{ scaleX }}
      className={cn("pointer-events-none absolute inset-x-0 origin-left bg-brand", className)}
    />
  );
}

/**
 * Six stages on one drawing sheet. On lg+ the sheet is pinned (a CSS sticky scene inside a tall
 * track, so the scroll distance is reserved before JavaScript runs) while the stages play out:
 * each adds its layer of lines to the elevation (the plot and its neighbours, the massing, the
 * facade and level marks, the structure, a crane, the lit windows), and the stage that is
 * being drawn is named beneath it in type. Scroll progress drives everything through a
 * critically damped spring: nothing to time, nothing that overshoots, one property per mark.
 *
 * Below lg and with reduced motion nothing is pinned: the finished drawing, then the six stages
 * as a plain list.
 */
export function ProcessSheet({ stages }: ProcessSheetProps) {
  const track = useRef<HTMLDivElement>(null);
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduced = usePrefersReducedMotion();
  const live = desktop && !reduced;

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, DRAWING_SPRING);
  const complete = useMotionValue(1);
  const progress = live ? smooth : complete;

  // Name the stage being drawn: written to data attributes (no React state per frame).
  const activate = (value: number) => {
    const el = track.current;
    if (!el) return;
    const index = Math.min(STEPS - 1, Math.floor((value / START_SCALE) * STEPS));
    for (const node of el.querySelectorAll<HTMLElement>("[data-stage]")) {
      node.dataset.active = String(Number(node.dataset.stage) === index);
    }
    for (const node of el.querySelectorAll<SVGGElement>("[data-layer]")) {
      const layer = Number(node.dataset.layer);
      node.dataset.state = layer < index ? "done" : layer === index ? "active" : "todo";
    }
  };
  useMotionValueEvent(smooth, "change", (value) => {
    if (live) activate(value);
  });
  // Pinned: start at the first stage. Not pinned: every layer is finished (ink).
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (live) activate(smooth.get());
    else {
      for (const node of el.querySelectorAll<SVGGElement>("[data-layer]")) {
        node.dataset.state = "done";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live]);

  return (
    <div ref={track} data-process-track className="relative lg:h-[420svh] motion-reduce:lg:h-auto">
      <div className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--spacing-nav)+1rem)] lg:h-[calc(100svh-var(--spacing-nav)-2rem)] motion-reduce:lg:static motion-reduce:lg:h-auto">
        <figure className="relative flex min-h-0 flex-1 flex-col border-y border-rule">
          <svg
            viewBox={`0 0 ${DRAWING_SIZE.width} ${DRAWING_SIZE.height}`}
            preserveAspectRatio="xMidYMax meet"
            role="img"
            aria-label="An elevation drawing of a twenty-storey residential tower between two neighbouring buildings, built up in six layers: the plot, the massing, the facade, the structure, a crane and lit windows."
            className="min-h-0 w-full flex-1 text-fg max-lg:aspect-[1500/720] max-lg:flex-none"
          >
            <g>
              {DRAWING_LAYERS.map((layer, i) => {
                const start = (i / STEPS) * START_SCALE;
                return (
                  <g
                    key={layer.stageId}
                    data-layer={i}
                    data-state="done"
                    className="[--stroke:currentColor] data-[state=active]:[--stroke:var(--color-brand)]"
                  >
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
                    {layer.labels?.map((label) => (
                      <Label
                        key={label.text}
                        label={label}
                        progress={progress}
                        range={[start + SPAN * 0.3, start + SPAN]}
                      />
                    ))}
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
            </g>
          </svg>
          <figcaption className="absolute top-4 right-0 label-mono text-fg-muted max-lg:static max-lg:self-end max-lg:py-3">
            Illustrative drawing
          </figcaption>
        </figure>

        <div className="grid-editorial gap-y-8">
          {/* The stage being drawn, in large type. Stacked in one cell on lg+; a plain list below. */}
          <div className="col-span-full grid gap-y-10 lg:col-span-7 lg:gap-y-0 lg:[&>*]:[grid-area:1/1]">
            {stages.map((stage, i) => (
              <div
                key={stage.id}
                data-stage={i}
                data-active={i === 0}
                className="flex flex-col gap-3 transition-opacity duration-700 ease-meridian motion-reduce:transition-none lg:pointer-events-none lg:opacity-0 lg:data-[active=true]:pointer-events-auto lg:data-[active=true]:opacity-100"
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-display text-display-sm text-brand tabular-nums">
                    {displayIndex(i)}
                  </span>
                  <h3 className="font-display text-display-md lg:text-[clamp(2rem,1.2rem+2.2vw,3.25rem)]">
                    {stage.title}
                  </h3>
                </div>
                <div className="relative h-px bg-rule lg:max-w-lg">
                  <StageFill progress={progress} index={i} className="h-px" />
                </div>
                <p className="max-w-md text-lead text-fg-muted">{stage.description}</p>
              </div>
            ))}
          </div>

          {/* A quiet index of the six stages (lg+): the one being drawn is in full strength */}
          <ol
            aria-hidden="true"
            className="hidden lg:col-span-5 lg:col-start-8 lg:grid lg:grid-cols-2 lg:gap-x-8"
          >
            {stages.map((stage, i) => (
              <li
                key={stage.id}
                data-stage={i}
                data-active={i === 0}
                className="relative flex items-baseline gap-4 py-3 text-small text-fg-muted/50 transition-colors duration-700 ease-meridian data-[active=true]:text-fg motion-reduce:transition-none"
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-rule" />
                <StageFill progress={progress} index={i} className="top-0 h-0.5" />
                <span className="label-mono tabular-nums">{displayIndex(i)}</span>
                {stage.title}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

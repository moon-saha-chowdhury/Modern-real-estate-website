"use client";

import Image, { getImageProps } from "next/image";
import { useRef, type CSSProperties } from "react";
import { TextReveal } from "@/components/common/TextReveal";
import {
  computeFrameRect,
  createFrameLoader,
  frameUrl,
  type FrameLoader,
} from "@/lib/animations/frame-sequence";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import {
  HERO_CALLOUT_X,
  HERO_CAMERA_START,
  HERO_CALLOUTS,
  HERO_FRAME_SCALE,
  HERO_MAX_DPR,
  HERO_MEDIA,
  HERO_SCROLL,
  HERO_STAGES,
} from "@/lib/constants/hero";
import { HERO_SEQUENCE } from "@/lib/constants/hero-sequence";
import { cn } from "@/lib/utils/cn";
import { displayIndex } from "@/lib/utils/projects";
import type { BuildingTransformationProps, HeroFrameSet } from "@/types/sections";

/**
 * 01 — Signature hero: full-bleed, scroll-scrubbed building transformation.
 * A "blue" surface (white text over the twilight scene) on an otherwise light-theme site.
 *
 * Rendering: a pre-extracted IMAGE SEQUENCE drawn on a <canvas>, not a <video>. Video scrubbing
 * waits on the decoder for every seek (~10–15 fps, jerky); drawing decoded frames is instant, so
 * scrolling stays at the display's frame rate.
 *
 * - The frame is drawn at HERO_FRAME_SCALE of the covering size (static zoom-out) with feathered
 *   edges over a sky → horizon → water backdrop sampled from the frames themselves.
 * - The title and stage indicator stay put; only the building changes.
 * - From 1024 px (lg): floor callouts (dot · leader line · chip) appear beside the tower as each part is
 *   built. They live in an overlay sized exactly like the canvas, so they stay on the facade.
 * - Camera rise (after the lights come on): the footage pushes in and tilts up into open sky,
 *   the frame grows to full cover and the backdrop crossfades to sky, so the hero hands over
 *   from the tower to the page below like the end of a film shot.
 * - Frames load progressively (every 8th first); until a frame arrives the nearest one is drawn.
 * - Phones use a tall centre crop of the tower at full source resolution.
 * - Reduced motion: only the finished-tower frame is loaded and shown; the track collapses to one
 *   screen and nothing sticks.
 */
export function BuildingTransformation({ title }: BuildingTransformationProps) {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  // Server-rendered first frame (see the <picture> below). `unoptimized` serves the exact frame
  // files, so the frame loader's first request is a cache hit.
  const { desktop: desktopSet, mobile: mobileSet } = HERO_SEQUENCE;
  const { props: posterProps } = getImageProps({
    src: frameUrl(desktopSet, 0),
    width: desktopSet.width,
    height: desktopSet.height,
    alt: "",
    loading: "eager",
    unoptimized: true,
  });
  const {
    props: { src: posterMobileSrc },
  } = getImageProps({
    src: frameUrl(mobileSet, 0),
    width: mobileSet.width,
    height: mobileSet.height,
    alt: "",
    unoptimized: true,
  });
  const posterVars = {
    "--frame-ar-d": `${desktopSet.width} / ${desktopSet.height}`,
    "--frame-ar-m": `${mobileSet.width} / ${mobileSet.height}`,
    "--frame-scale-d": HERO_FRAME_SCALE.desktop,
    "--frame-scale-m": HERO_FRAME_SCALE.mobile,
  } as CSSProperties;

  useGSAP(
    () => {
      const section = root.current;
      const canvas = canvasRef.current;
      const overlay = overlayRef.current;
      const ctx = canvas?.getContext("2d");
      if (!section || !canvas || !overlay || !ctx) return;

      const poster = posterRef.current;
      const callouts = gsap.utils.toArray<HTMLElement>("[data-callout]", section);
      const stageItems = gsap.utils.toArray<HTMLElement>("[data-stage]", section);
      const stageLabel = section.querySelector<HTMLElement>("[data-stage-label]");
      const stageIndex = section.querySelector<HTMLElement>("[data-stage-index]");
      const progressLine = section.querySelector<HTMLElement>("[data-progress]");
      const skyBackdrop = section.querySelector<HTMLElement>("[data-sky-backdrop]");
      const bottomShade = section.querySelector<HTMLElement>("[data-bottom-shade]");
      const leaving = gsap.utils.toArray<HTMLElement>("[data-hero-copy], [data-hero-hud]", section);

      const setStage = (t: number) => {
        let current = 0;
        HERO_STAGES.forEach((stage, i) => {
          if (t >= stage.at) current = i;
        });
        stageItems.forEach((item, i) => (item.dataset.active = String(i <= current)));
        if (stageLabel) stageLabel.textContent = HERO_STAGES[current].label;
        if (stageIndex) stageIndex.textContent = displayIndex(current);
        if (progressLine) gsap.set(progressLine, { scaleX: t });
        callouts.forEach((item, i) => {
          const { from, to } = HERO_CALLOUTS[i];
          const active = String(t >= from && t < to);
          if (item.dataset.active !== active) item.dataset.active = active;
        });
      };

      /** Sets up loading, layout and drawing for one frame set; returns a cleanup. */
      const mount = (set: HeroFrameSet, scale: number, indices?: number[]) => {
        /** Fractional frame position: 12.4 = frame 12 with 40% of frame 13 blended over it. */
        let position = indices ? indices[0] : 0;
        let drawnKey = "";
        let loader: FrameLoader | null = null;

        // Sub-frame blending: the sequence has ~11 px of scroll per frame, so stepping whole
        // frames reads as ~20 fps stutter under smooth scrolling. Cross-fading the two
        // neighbouring frames makes every rendered frame different, so the build glides.
        const draw = (force = false) => {
          if (!loader) return;
          const base = Math.floor(position);
          const mix = position - base;
          const a = loader.images[base];
          const b = mix > 0.01 ? loader.images[base + 1] : null;
          // Until both exact frames are loaded, fall back to the nearest loaded frame.
          const first = a ?? loader.nearest(Math.round(position));
          if (!first) return;
          const blend = a && b ? mix : 0;
          const key = `${first.src}|${blend.toFixed(2)}`;
          if (key === drawnKey && !force) return;
          ctx.globalAlpha = 1;
          ctx.drawImage(first, 0, 0, canvas.width, canvas.height);
          if (b && blend > 0) {
            ctx.globalAlpha = blend;
            ctx.drawImage(b, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;
          }
          drawnKey = key;
          // The server-rendered first frame sits under the canvas at the same geometry; once the
          // canvas has painted, hide it so its feathered edges never show behind a later frame.
          if (poster) poster.style.visibility = "hidden";
        };

        const layout = () => {
          const rect = computeFrameRect(
            section.clientWidth,
            section.clientHeight,
            set.width,
            set.height,
            scale,
          );
          const dpr = Math.min(window.devicePixelRatio || 1, HERO_MAX_DPR);
          const box = {
            left: `${rect.x}px`,
            top: `${rect.y}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
          };
          Object.assign(canvas.style, box);
          Object.assign(overlay.style, box);
          canvas.width = Math.round(rect.width * dpr);
          canvas.height = Math.round(rect.height * dpr);
          ctx.imageSmoothingQuality = "high";
          draw(true);
        };

        // Start fetching frames only after the page's load event: images requested before it
        // hold it back until the whole sequence has arrived (minutes on a slow connection).
        // Until then the server-rendered first frame is on screen.
        const start = () => {
          loader = createFrameLoader(set, set.count, () => draw(), indices);
        };
        if (document.readyState === "complete") start();
        else window.addEventListener("load", start, { once: true });

        const observer = new ResizeObserver(layout);
        observer.observe(section);
        layout();

        return {
          /** Scroll progress (0–1) → fractional frame position in this set. */
          setProgress: (t: number) => {
            const value = t * (set.count - 1);
            if (value === position) return;
            position = value;
            draw();
          },
          cleanup: () => {
            window.removeEventListener("load", start);
            observer.disconnect();
            loader?.cancel();
          },
        };
      };

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: `${HERO_MEDIA.mobileQuery} and (prefers-reduced-motion: no-preference)`,
        },
        (ctxMedia) => {
          const desktop = Boolean(ctxMedia.conditions?.desktop);
          const view = mount(
            desktop ? HERO_SEQUENCE.desktop : HERO_SEQUENCE.mobile,
            desktop ? HERO_FRAME_SCALE.desktop : HERO_FRAME_SCALE.mobile,
          );
          const state = { t: 0 };

          // Camera rise: the frame grows from the static zoom-out to full cover (amplifying the
          // push-in and hiding the feathered edges), while the backdrop turns from the blurred
          // finished tower to blurred open sky, so the edges match what the camera now sees.
          const coverScale = 1 / (desktop ? HERO_FRAME_SCALE.desktop : HERO_FRAME_SCALE.mobile);
          const easeScale = gsap.parseEase("power2.inOut");
          const setCamera = (t: number) => {
            const c = gsap.utils.clamp(0, 1, (t - HERO_CAMERA_START) / (1 - HERO_CAMERA_START));
            gsap.set([canvas, overlay], { scale: 1 + (coverScale - 1) * easeScale(c) });
            if (skyBackdrop) {
              gsap.set(skyBackdrop, { opacity: gsap.utils.clamp(0, 1, (c - 0.2) / 0.6) });
            }
            // Lift the bottom shade as the frame fills with sky, so the hero meets the About
            // section (which continues the sky) without a dark band between them.
            if (bottomShade) {
              gsap.set(bottomShade, { opacity: 1 - gsap.utils.clamp(0, 1, (c - 0.75) / 0.25) });
            }
            // The title and stage indicator leave with the tower: About takes over on the sky.
            gsap.set(leaving, { opacity: 1 - gsap.utils.clamp(0, 1, (c - 0.78) / 0.18) });
          };

          gsap
            .timeline({
              defaults: { ease: "none" },
              // The track (the section's parent) reserves the scroll distance in CSS; the
              // section is sticky inside it, so progress runs over the track's full length.
              scrollTrigger: {
                trigger: section.parentElement ?? section,
                start: "top top",
                end: "bottom bottom",
                scrub: HERO_SCROLL.scrub,
                onRefresh: () => ScrollTrigger.update(),
              },
            })
            .to(state, {
              t: 1,
              duration: 1,
              onUpdate: () => {
                view.setProgress(state.t);
                setStage(state.t);
                setCamera(state.t);
              },
            });

          setStage(0);
          setCamera(0);
          return () => {
            view.cleanup();
            gsap.set([canvas, overlay], { clearProps: "transform" });
            gsap.set([skyBackdrop, bottomShade, ...leaving].filter(Boolean), {
              clearProps: "opacity",
            });
          };
        },
      );

      // Reduced motion: the finished building only, no sticky track, no scrubbing.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const mobile = window.matchMedia(HERO_MEDIA.mobileQuery).matches;
        const set = mobile ? HERO_SEQUENCE.mobile : HERO_SEQUENCE.desktop;
        const view = mount(set, mobile ? HERO_FRAME_SCALE.mobile : HERO_FRAME_SCALE.desktop, [
          set.finishedFrame,
        ]);
        return () => view.cleanup();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    // The track reserves the hero's scroll distance in CSS from the first paint; the section
    // sticks to the top while it scrolls past (no GSAP pin spacer, no shift on hydration).
    <div data-hero-root data-nav-blue className={cn("relative", HERO_SCROLL.trackClass)}>
      <section
        ref={root}
        data-surface="blue"
        aria-labelledby="hero-title"
        className="group/hero sticky top-0 isolate h-svh overflow-hidden bg-twilight hero-backdrop text-fg motion-reduce:relative"
      >
        {/* Backdrop: the first frame, blurred (the same file as the poster below). Sky, skyline
            and water barely change during the build, so the feathered canvas edges melt into
            matching colour; unlike the finished tower it has no warm lobby reflection to bleed
            through the bottom edge. The open-sky layer fades in during the camera rise. */}
        <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
          <Image
            src={frameUrl(desktopSet, 0)}
            alt=""
            fill
            sizes="25vw"
            className="scale-110 object-cover blur-2xl"
          />
          <div data-sky-backdrop className="absolute inset-0 opacity-0">
            <Image
              src={HERO_MEDIA.posterSky}
              alt=""
              fill
              sizes="25vw"
              className="scale-110 object-cover blur-2xl"
            />
          </div>
        </div>
        {/* First frame, server-rendered (art-directed: phone crop / desktop frame), so the
            sharp podium is on screen before JavaScript runs. Same geometry as the canvas: sized
            to the frame's aspect ratio to cover the hero, then scaled to HERO_FRAME_SCALE. It
            is the very file the frame loader fetches first, so it is not downloaded twice. */}
        <picture>
          <source media={HERO_MEDIA.mobileQuery} srcSet={posterMobileSrc} />
          <img
            ref={posterRef}
            {...posterProps}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            style={posterVars}
            className="pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-(--frame-ar) w-[max(100%,calc(100svh*var(--frame-ar)))] max-w-none -translate-1/2 scale-(--frame-scale) hero-feather [--frame-ar:var(--frame-ar-m)] [--frame-scale:var(--frame-scale-m)] md:[--frame-ar:var(--frame-ar-d)] md:[--frame-scale:var(--frame-scale-d)]"
          />
        </picture>
        <canvas ref={canvasRef} aria-hidden="true" className="absolute -z-10 hero-feather" />

        {/* Floor callouts, positioned in frame space (the overlay matches the canvas rect) */}
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute hidden motion-reduce:hidden lg:block"
        >
          {HERO_CALLOUTS.map((callout) => (
            <div
              key={`${callout.tag}-${callout.label}`}
              data-callout
              data-active="false"
              className="group/callout absolute flex -translate-y-1/2 items-center"
              style={{ left: `${HERO_CALLOUT_X * 100}%`, top: `${callout.y * 100}%` }}
            >
              <span className="size-1.5 rounded-full bg-accent opacity-0 shadow-[0_0_0_4px_rgb(255_255_255/0.15)] transition-opacity duration-300 ease-meridian group-data-[active=true]/callout:opacity-100" />
              <span className="h-px w-10 origin-left scale-x-0 bg-fg/60 transition-transform duration-500 ease-meridian group-data-[active=true]/callout:scale-x-100 lg:w-16" />
              <span className="flex -translate-x-2 items-baseline gap-2 rounded-full border border-fg/20 bg-ink/35 px-3 py-1.5 whitespace-nowrap opacity-0 backdrop-blur-md transition-[opacity,translate] duration-500 ease-meridian group-data-[active=true]/callout:translate-x-0 group-data-[active=true]/callout:opacity-100 group-data-[active=true]/callout:delay-150">
                <span className="label-mono text-accent">{callout.tag}</span>
                <span className="label-mono text-fg">{callout.label}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Legibility: soft shade under the navbar and behind the stage indicator */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-ink/30 to-transparent"
        />
        <div
          data-bottom-shade
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-ink/45 to-transparent"
        />

        <p className="sr-only">
          As you scroll, a glass residential tower beside the water is built floor by floor: the
          concrete frame rises, the blue glass facade is installed, and the lights come on.
        </p>

        {/* Copy: stays in place over the sky */}
        <div
          data-hero-copy
          className="pointer-events-none absolute inset-x-0 top-[calc(var(--spacing-nav)+clamp(1.5rem,6vh,5rem))] flex flex-col items-center gap-6 px-gutter text-center [text-shadow:0_2px_28px_rgb(0_0_0/0.35)] lg:top-[calc(var(--spacing-nav)+clamp(3rem,14vh,9rem))] lg:items-start lg:text-left"
        >
          <TextReveal
            as="h1"
            id="hero-title"
            immediate
            delay={0.15}
            className="font-display text-display-hero"
            lines={title}
          />
        </div>

        {/* Construction stage + progress */}
        <div
          data-hero-hud
          aria-hidden="true"
          className="absolute inset-x-0 bottom-6 flex items-end justify-between gap-6 px-gutter text-fg-muted motion-reduce:hidden"
        >
          <div className="flex w-full max-w-sm flex-col gap-3">
            <p className="flex items-baseline gap-3 label-mono">
              <span data-stage-index className="text-accent">
                01
              </span>
              <span data-stage-label className="text-fg">
                {HERO_STAGES[0].label}
              </span>
            </p>
            <div className="relative h-px w-full bg-fg/25">
              <span data-progress className="absolute inset-0 origin-left scale-x-0 bg-accent" />
            </div>
            <ol className="flex justify-between gap-3 label-mono text-[0.625rem]">
              {HERO_STAGES.map((stage) => (
                <li
                  key={stage.label}
                  data-stage
                  className="text-fg-muted transition-colors duration-300 data-[active=true]:text-fg"
                >
                  {stage.label}
                </li>
              ))}
            </ol>
          </div>
          {/* The tower and its callout figures are an illustrative concept (docs/ASSETS.md:
              invented content is labelled) */}
          <p className="hidden flex-col items-end gap-2 label-mono md:flex">
            <span className="text-fg-muted">Illustrative concept</span>
            <span className="text-fg">Scroll to build</span>
          </p>
        </div>
      </section>
    </div>
  );
}

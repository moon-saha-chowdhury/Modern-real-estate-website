"use client";

import Image from "next/image";
import { useRef } from "react";
import { Eyebrow } from "@/components/common/Eyebrow";
import { TextReveal } from "@/components/common/TextReveal";
import {
  computeFrameRect,
  createFrameLoader,
  type FrameLoader,
} from "@/lib/animations/frame-sequence";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import {
  HERO_FRAME_SCALE,
  HERO_MAX_DPR,
  HERO_MEDIA,
  HERO_SCROLL,
  HERO_STAGES,
} from "@/lib/constants/hero";
import { HERO_SEQUENCE } from "@/lib/constants/hero-sequence";
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
 * - Frames load progressively (every 8th first); until a frame arrives the nearest one is drawn.
 * - Phones use a tall centre crop of the tower at full source resolution.
 * - Reduced motion: only the final frame is loaded and shown; nothing is pinned.
 */
export function BuildingTransformation({ eyebrow, title }: BuildingTransformationProps) {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!section || !canvas || !ctx) return;

      const { count } = HERO_SEQUENCE;
      const stageItems = gsap.utils.toArray<HTMLElement>("[data-stage]", section);
      const stageLabel = section.querySelector<HTMLElement>("[data-stage-label]");
      const stageIndex = section.querySelector<HTMLElement>("[data-stage-index]");
      const progressLine = section.querySelector<HTMLElement>("[data-progress]");

      const setStage = (t: number) => {
        let current = 0;
        HERO_STAGES.forEach((stage, i) => {
          if (t >= stage.at) current = i;
        });
        stageItems.forEach((item, i) => (item.dataset.active = String(i <= current)));
        if (stageLabel) stageLabel.textContent = HERO_STAGES[current].label;
        if (stageIndex) stageIndex.textContent = displayIndex(current);
        if (progressLine) gsap.set(progressLine, { scaleX: t });
      };

      /** Sets up loading, layout and drawing for one frame set; returns a cleanup. */
      const mount = (set: HeroFrameSet, scale: number, indices?: number[]) => {
        let frame = indices ? indices[0] : 0;
        let drawn: HTMLImageElement | null = null;

        const draw = (force = false) => {
          const img = loader.nearest(frame);
          if (!img || (img === drawn && !force)) return;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          drawn = img;
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
          Object.assign(canvas.style, {
            left: `${rect.x}px`,
            top: `${rect.y}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
          });
          canvas.width = Math.round(rect.width * dpr);
          canvas.height = Math.round(rect.height * dpr);
          ctx.imageSmoothingQuality = "high";
          draw(true);
        };

        const loader: FrameLoader = createFrameLoader(set, count, () => draw(), indices);

        const observer = new ResizeObserver(layout);
        observer.observe(section);
        layout();

        return {
          setFrame: (index: number) => {
            if (index === frame) return;
            frame = index;
            draw();
          },
          cleanup: () => {
            observer.disconnect();
            loader.cancel();
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

          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: desktop ? HERO_SCROLL.pinDesktop : HERO_SCROLL.pinMobile,
                pin: true,
                scrub: HERO_SCROLL.scrub,
                anticipatePin: 1,
                onRefresh: () => ScrollTrigger.update(),
              },
            })
            .to(state, {
              t: 1,
              duration: 1,
              onUpdate: () => {
                view.setFrame(Math.round(state.t * (count - 1)));
                setStage(state.t);
              },
            });

          setStage(0);
          return () => view.cleanup();
        },
      );

      // Reduced motion: the finished building only, no pin, no scrubbing.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const mobile = window.matchMedia(HERO_MEDIA.mobileQuery).matches;
        const view = mount(
          mobile ? HERO_SEQUENCE.mobile : HERO_SEQUENCE.desktop,
          mobile ? HERO_FRAME_SCALE.mobile : HERO_FRAME_SCALE.desktop,
          [count - 1],
        );
        return () => view.cleanup();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    // React owns this wrapper; ScrollTrigger inserts its pin-spacer *inside* it, so unmounting
    // on navigation never asks React to remove a node GSAP has moved.
    <div data-hero-root>
      <section
        ref={root}
        data-surface="blue"
        aria-labelledby="hero-title"
        className="group/hero relative isolate h-svh overflow-hidden bg-twilight hero-backdrop text-fg"
      >
        {/* Backdrop: the final frame, blurred. Sky, skyline and water never change during the build,
            so the feathered canvas edges melt into exactly matching colour. */}
        <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
          <Image
            src={HERO_MEDIA.posterEnd}
            alt=""
            fill
            sizes="50vw"
            className="scale-110 object-cover blur-2xl"
          />
        </div>
        <canvas ref={canvasRef} aria-hidden="true" className="absolute -z-10 hero-feather" />

        {/* Legibility: soft shade under the navbar and behind the stage indicator */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-ink/30 to-transparent"
        />
        <div
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
          <Eyebrow index="01" className="text-accent">
            {eyebrow}
          </Eyebrow>
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
          aria-hidden="true"
          className="absolute inset-x-0 bottom-6 flex items-end justify-between gap-6 px-gutter text-fg-muted motion-reduce:hidden"
        >
          <div className="flex w-full max-w-xs flex-col gap-3">
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
            <ol className="flex justify-between label-mono text-[0.625rem]">
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
          <span className="hidden label-mono text-fg md:block">Scroll to build</span>
        </div>
      </section>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useRef } from "react";
import { Eyebrow } from "@/components/common/Eyebrow";
import { TextReveal } from "@/components/common/TextReveal";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import { HERO_MEDIA, HERO_SCROLL, HERO_STAGES } from "@/lib/constants/hero";
import { displayIndex } from "@/lib/utils/projects";
import type { BuildingTransformationProps } from "@/types/sections";

/**
 * 01 — Signature hero: full-bleed, scroll-scrubbed building transformation (light theme).
 *
 * One pinned ScrollTrigger timeline. Video time follows scroll from the first movement;
 * scrolling up reverses the build; the final frame holds. The title and its soft paper wash
 * fade early so the whole building is revealed.
 *
 * Performance: scroll writes only to refs/DOM. A single callback on GSAP's shared ticker
 * seeks the video, and only when the previous seek has finished. No React state per frame.
 * Fallbacks: reduced motion or a failed video → static final frame, no pin.
 * Mobile: the browser picks the 720p file via <source media>, no JS involved.
 */
export function BuildingTransformation({ eyebrow, title }: BuildingTransformationProps) {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      const video = videoRef.current;
      if (!section || !video) return;

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

      const onError = () => (section.dataset.videoFailed = "true");
      video.addEventListener("error", onError);

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const desktop = Boolean(ctx.conditions?.desktop);
          const state = { t: 0 };
          let duration = 0;
          let target = 0;

          const onMetadata = () => {
            duration = video.duration;
            video.pause();
            ScrollTrigger.refresh();
          };
          if (video.readyState >= 1) onMetadata();
          else video.addEventListener("loadedmetadata", onMetadata, { once: true });

          // iOS Safari only decodes frames for seeking after the video has played once.
          const unlock = () => {
            video
              .play()
              .then(() => video.pause())
              .catch(() => undefined);
          };
          window.addEventListener("touchstart", unlock, { once: true, passive: true });

          const seek = () => {
            if (!duration || video.seeking) return;
            const time = Math.min(duration - 0.04, target * duration);
            if (Math.abs(video.currentTime - time) > HERO_SCROLL.seekThreshold) {
              video.currentTime = time;
            }
          };
          gsap.ticker.add(seek);

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: desktop ? HERO_SCROLL.pinDesktop : HERO_SCROLL.pinMobile,
              pin: true,
              scrub: HERO_SCROLL.scrub,
              anticipatePin: 1,
            },
          });

          timeline
            // Opacity only (not autoAlpha): the h1 must stay in the accessibility tree.
            .to("[data-hero-copy]", { opacity: 0, y: -40, duration: HERO_SCROLL.titleOut }, 0)
            .to("[data-hero-wash]", { opacity: 0, duration: HERO_SCROLL.titleOut }, 0)
            .fromTo("[data-hero-hud]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.04)
            .to(
              state,
              {
                t: 1,
                duration: 1,
                onUpdate: () => {
                  target = state.t;
                  setStage(state.t);
                },
              },
              0,
            );

          setStage(0);

          return () => {
            gsap.ticker.remove(seek);
            video.removeEventListener("loadedmetadata", onMetadata);
            window.removeEventListener("touchstart", unlock);
          };
        },
      );

      return () => {
        mm.revert();
        video.removeEventListener("error", onError);
      };
    },
    { scope: root },
  );

  return (
    // React owns this wrapper; ScrollTrigger inserts its pin-spacer *inside* it, so unmounting
    // on navigation never asks React to remove a node GSAP has moved.
    <div data-hero-root>
      <section
        ref={root}
        data-surface="light"
        data-tone="paper"
        aria-labelledby="hero-title"
        className="group/hero relative isolate h-svh overflow-hidden bg-paper text-fg"
      >
        {/* Media layer */}
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            tabIndex={-1}
            poster={HERO_MEDIA.posterStart}
            className="absolute inset-0 h-full w-full object-cover group-data-[video-failed=true]/hero:hidden motion-reduce:hidden"
          >
            <source src={HERO_MEDIA.mobile} media={HERO_MEDIA.mobileQuery} type="video/mp4" />
            <source src={HERO_MEDIA.desktop} type="video/mp4" />
          </video>
          {/* Static final frame: reduced motion or video failure */}
          <Image
            src={HERO_MEDIA.posterEnd}
            alt=""
            fill
            sizes="100vw"
            className="hidden object-cover group-data-[video-failed=true]/hero:block motion-reduce:block"
          />
        </div>

        {/* Soft paper wash behind the title; fades with it to reveal the full building */}
        <div
          data-hero-wash
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[62%] bg-linear-to-b from-paper via-paper/70 to-transparent"
        />
        {/* Fade into the page below */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-36 bg-linear-to-t from-paper to-transparent"
        />

        <p className="sr-only">
          As you scroll, a brick-and-concrete residential building is constructed: the concrete
          frame rises, the brick facade and planting are added, and the lights come on.
        </p>

        {/* Copy: centred in the sky */}
        <div
          data-hero-copy
          className="pointer-events-none absolute inset-x-0 top-[calc(var(--spacing-nav)+clamp(1.5rem,6vh,5rem))] flex flex-col items-center gap-6 px-gutter text-center"
        >
          <Eyebrow index="01" className="text-accent">
            {eyebrow}
          </Eyebrow>
          <TextReveal
            as="h1"
            id="hero-title"
            immediate
            delay={0.15}
            className="font-display text-display-xl"
            lines={title}
          />
        </div>

        {/* HUD: construction stage + progress (appears once the build starts) */}
        <div
          data-hero-hud
          aria-hidden="true"
          className="invisible absolute inset-x-0 bottom-6 flex items-end justify-between gap-6 px-gutter text-fg-muted motion-reduce:hidden"
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
            <div className="relative h-px w-full bg-fg/15">
              <span data-progress className="absolute inset-0 origin-left scale-x-0 bg-brand" />
            </div>
            <ol className="flex justify-between label-mono text-[0.625rem]">
              {HERO_STAGES.map((stage) => (
                <li
                  key={stage.label}
                  data-stage
                  className="text-fg/45 transition-colors duration-300 data-[active=true]:text-fg"
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

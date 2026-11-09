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
 * 01 — Signature hero: full-bleed, scroll-scrubbed building transformation.
 *
 * Choreography (one pinned ScrollTrigger timeline):
 *   zoomEnd → pullBackEnd  camera eases back to 1× while the tower rises, framing it whole
 *   0 → zoomEnd   camera pushes in on the tower; title rises and fades
 *   zoomEnd → 1   video time follows scroll; scrolling up reverses; final frame holds
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

          gsap.set("[data-hero-media]", { transformOrigin: HERO_SCROLL.zoomOrigin });
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
            .to(
              "[data-hero-media]",
              {
                scale: desktop ? HERO_SCROLL.zoomScaleDesktop : HERO_SCROLL.zoomScaleMobile,
                duration: HERO_SCROLL.zoomEnd,
                ease: "power1.inOut",
              },
              0,
            )
            .to(
              "[data-hero-media]",
              {
                scale: 1,
                duration: HERO_SCROLL.pullBackEnd - HERO_SCROLL.zoomEnd,
                ease: "power1.inOut",
              },
              HERO_SCROLL.zoomEnd,
            )
            // Opacity only (not autoAlpha): the h1 must stay in the accessibility tree.
            .to("[data-hero-copy]", { opacity: 0, y: -48, duration: HERO_SCROLL.titleOut }, 0.02)
            .fromTo("[data-hero-hud]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.08)
            .to(
              state,
              {
                t: 1,
                duration: 1 - HERO_SCROLL.zoomEnd,
                onUpdate: () => {
                  target = state.t;
                  setStage(state.t);
                },
              },
              HERO_SCROLL.zoomEnd,
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
        data-surface="dark"
        data-tone="obsidian"
        aria-labelledby="hero-title"
        className="group/hero relative isolate h-svh overflow-hidden bg-obsidian text-ivory"
      >
        {/* Media layer */}
        <div
          data-hero-media
          aria-hidden="true"
          className="absolute inset-0 -z-10 will-change-transform"
        >
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
            priority={false}
            sizes="100vw"
            className="hidden object-cover group-data-[video-failed=true]/hero:block motion-reduce:block"
          />
        </div>

        {/* Legibility: darken under the navbar and fade into the page below */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-linear-to-b from-obsidian/80 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-obsidian to-transparent"
        />

        <p className="sr-only">
          As you scroll, a residential tower beside a lake is built floor by floor, from its
          foundations to the finished, lit building.
        </p>

        {/* Copy: centred in the empty sky above the (still unbuilt) tower */}
        <div
          data-hero-copy
          className="pointer-events-none absolute inset-x-0 top-[calc(var(--spacing-nav)+clamp(2rem,9vh,7rem))] flex flex-col items-center gap-6 px-gutter text-center"
        >
          <Eyebrow index="01" className="text-champagne">
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
          className="invisible absolute inset-x-0 bottom-8 flex items-end justify-between gap-6 px-gutter text-mist motion-reduce:hidden"
        >
          <div className="flex w-full max-w-xs flex-col gap-3">
            <p className="flex items-baseline gap-3 label-mono">
              <span data-stage-index className="text-champagne">
                01
              </span>
              <span data-stage-label className="text-ivory">
                {HERO_STAGES[0].label}
              </span>
            </p>
            <div className="relative h-px w-full bg-ivory/20">
              <span data-progress className="absolute inset-0 origin-left scale-x-0 bg-brand" />
            </div>
            <ol className="flex justify-between label-mono text-[0.625rem]">
              {HERO_STAGES.map((stage) => (
                <li
                  key={stage.label}
                  data-stage
                  className="text-ivory/40 transition-colors duration-300 data-[active=true]:text-ivory/80"
                >
                  {stage.label}
                </li>
              ))}
            </ol>
          </div>
          <span className="hidden label-mono md:block">Scroll to build</span>
        </div>
      </section>
    </div>
  );
}

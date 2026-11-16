"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { residences } from "@/data/residences";
import { REEL_HERO } from "@/lib/constants/reel-hero";
import type { BuildingTransformationProps } from "@/types/sections";

const PanoramaViewer = dynamic(() => import("@/components/virtual-tour/PanoramaViewer"), {
  ssr: false,
});

const { stops, images, copy } = REEL_HERO;
const residence = residences[0];

/**
 * The hero as a scroll film. One pinned stage, four moments driven by scroll alone:
 * the building by day → its floors lifting apart on black → the floor as a clay plan →
 * the camera dives into the plan and the room opens in 360°.
 */
export function ReelHero({ title }: BuildingTransformationProps) {
  const track = useRef<HTMLDivElement>(null);
  const [inRoom, setInRoom] = useState(false);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });

  useMotionValueEvent(p, "change", (v) => setInRoom(v >= stops.room));

  const { exploded, plan, zoom, room } = stops;
  const buildingOpacity = useTransform(p, [0, exploded * 0.6, exploded], [1, 1, 0]);
  const buildingScale = useTransform(p, [0, exploded], [1, 1.12]);
  const explodedOpacity = useTransform(p, [exploded * 0.6, exploded, plan * 0.8, plan], [0, 1, 1, 0]);
  const explodedScale = useTransform(p, [exploded * 0.6, plan], [0.92, 1.05]);
  const planOpacity = useTransform(p, [plan * 0.8, plan, zoom, room], [0, 1, 1, 0]);
  const planScale = useTransform(p, [plan * 0.8, plan, room], [0.9, 1, 3.6]);
  const headlineOpacity = useTransform(p, [0, exploded * 0.5], [1, 0]);
  const planCopyOpacity = useTransform(p, [plan * 0.9, plan, zoom - 0.04, zoom], [0, 1, 1, 0]);
  const hintOpacity = useTransform(p, [0, 0.06], [1, 0]);
  const roomOpacity = useTransform(p, [zoom, room], [0, 1]);

  return (
    <section
      ref={track}
      data-hero-root
      data-view={inRoom ? "room" : "film"}
      aria-labelledby="hero-title"
      className="relative bg-[#050505]"
      style={{ height: `${REEL_HERO.trackVh}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
        <motion.div style={{ opacity: buildingOpacity, scale: buildingScale }} className="absolute inset-0">
          <Image src={images.building.src} alt={images.building.alt} fill priority sizes="100vw" className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40" />
        </motion.div>

        <motion.div style={{ opacity: explodedOpacity, scale: explodedScale }} className="absolute inset-0">
          <Image src={images.exploded.src} alt={images.exploded.alt} fill sizes="100vw" className="object-contain" />
        </motion.div>

        <motion.div style={{ opacity: planOpacity, scale: planScale }} className="absolute inset-0">
          <Image src={images.plan.src} alt={images.plan.alt} fill sizes="100vw" className="object-contain" />
        </motion.div>

        <motion.div
          style={{ opacity: headlineOpacity }}
          className="pointer-events-none absolute right-6 top-28 max-w-[22rem] text-right text-white md:right-14 md:top-36 md:max-w-xl"
        >
          <h1 id="hero-title" className="font-display text-4xl leading-[1.02] tracking-tight md:text-6xl">
            {title.map((line) =>
              line.startsWith("*") ? (
                <em key={line} className="block not-italic text-white/70">
                  {line.replace(/\*/g, "")}
                </em>
              ) : (
                <span key={line} className="block">
                  {line}
                </span>
              ),
            )}
          </h1>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/70">{copy.buildingLabel}</p>
        </motion.div>

        <motion.div
          style={{ opacity: planCopyOpacity }}
          className="pointer-events-none absolute bottom-10 left-6 text-white md:bottom-14 md:left-14"
        >
          <p className="font-display text-3xl tracking-tight md:text-5xl">{copy.planLabel}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/60">{copy.planNote}</p>
        </motion.div>

        <motion.p
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-white/80"
        >
          {copy.scroll}
        </motion.p>

        <motion.div
          style={{ opacity: roomOpacity }}
          className="absolute inset-0 bg-[#101b2f]"
          aria-hidden={!inRoom}
        >
          {inRoom ? (
            <div className="h-full pt-nav">
              <PanoramaViewer
                scenes={residence.scenes}
                plan={residence.image}
                label={`${residence.name}, 360° view`}
                syncUrl={false}
                exitLabel={copy.exitTour}
                onExit={() =>
                  window.scrollTo({
                    top: (track.current?.offsetTop ?? 0) + window.innerHeight * 2.1,
                    behavior: "smooth",
                  })
                }
              />
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}

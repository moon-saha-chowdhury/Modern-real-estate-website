"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, useState } from "react";
import { residences } from "@/data/residences";
import { REEL_HERO } from "@/lib/constants/reel-hero";
import type { BuildingTransformationProps } from "@/types/sections";

const PanoramaViewer = dynamic(() => import("@/components/virtual-tour/PanoramaViewer"), {
  ssr: false,
});

const { stops, images, copy, slices, sliceTravel, buildingBox, planBackdrop } = REEL_HERO;
const residence = residences[0];

/** One horizontal band of the building photo; the bands slide apart as the page scrolls. */
function Slice({
  index,
  p,
  vh,
  vw,
}: {
  index: number;
  p: MotionValue<number>;
  vh: number;
  vw: number;
}) {
  const { top, bottom, left, right } = buildingBox;
  const band = (bottom - top) / slices;
  const clip = `inset(${(top + index * band) * 100}% ${(1 - right) * 100}% ${(1 - top - (index + 1) * band) * 100}% ${left * 100}%)`;
  const offset = (index - (slices - 1) / 2) / ((slices - 1) / 2); // -1 (top) … 1 (bottom)
  const y = useTransform(p, [stops.split, stops.apart], [0, offset * sliceTravel * vh]);
  const scale = useTransform(p, [stops.split, stops.apart], [1, 0.8]);
  // The bands also drift to the middle of the screen, where the slab model will stand.
  const centre = (left + right) / 2;
  const x = useTransform(p, [stops.split, stops.apart], [0, (0.5 - centre) * vw]);
  return (
    <motion.div
      style={{
        x,
        y,
        scale,
        clipPath: clip,
        transformOrigin: `${centre * 100}% ${((top + bottom) / 2) * 100}%`,
      }}
      className="absolute inset-0"
    >
      <Image
        src={images.building.src}
        alt={index === 0 ? images.building.alt : ""}
        aria-hidden={index !== 0}
        fill
        priority={index === 0}
        sizes="100vw"
        className="object-cover"
      />
    </motion.div>
  );
}

/**
 * The hero as a scroll film. One pinned stage, driven by scroll alone: the building by day,
 * its floors slide apart, settle into a slab model on black, the cutaway home appears, and the
 * camera dives in until a room opens in 360°.
 */
export function ReelHero({ title }: BuildingTransformationProps) {
  const track = useRef<HTMLDivElement>(null);
  const [inRoom, setInRoom] = useState(false);
  const [{ vh, vw }] = useState(() =>
    typeof window === "undefined"
      ? { vh: 900, vw: 1440 }
      : { vh: window.innerHeight, vw: window.innerWidth },
  );
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });

  useMotionValueEvent(p, "change", (v) => setInRoom(v >= stops.room));

  const { split, apart, exploded, plan, zoom, room } = stops;
  const slicesOpacity = useTransform(p, [apart, exploded], [1, 0]);
  const backdropOpacity = useTransform(p, [split, apart * 0.7], [1, 0]);
  const explodedOpacity = useTransform(p, [apart, exploded, plan * 0.9, plan], [0, 1, 1, 0]);
  const explodedScale = useTransform(p, [apart, plan], [0.94, 1.08]);
  const planOpacity = useTransform(p, [plan * 0.9, plan, zoom, room], [0, 1, 1, 0]);
  const planScale = useTransform(p, [plan * 0.9, plan, room], [0.88, 1, 3.4]);
  const headlineOpacity = useTransform(p, [0, split], [1, 0]);
  const planCopyOpacity = useTransform(p, [plan, plan + 0.04, zoom - 0.05, zoom], [0, 1, 1, 0]);
  const hintOpacity = useTransform(p, [0, 0.04], [1, 0]);
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
        <motion.div style={{ opacity: slicesOpacity }} className="absolute inset-0">
          <motion.div style={{ opacity: backdropOpacity }} className="absolute inset-0">
            <Image
              src={images.building.src}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
          {Array.from({ length: slices }, (_, i) => (
            <Slice key={i} index={i} p={p} vh={vh} vw={vw} />
          ))}
          <div
            aria-hidden
            className="from-black/25 to-black/35 absolute inset-0 bg-linear-to-b via-transparent"
          />
        </motion.div>

        <motion.div
          style={{ opacity: explodedOpacity, scale: explodedScale }}
          className="absolute inset-0"
        >
          <Image
            src={images.exploded.src}
            alt={images.exploded.alt}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </motion.div>

        <motion.div
          style={{ opacity: planOpacity, scale: planScale, backgroundColor: planBackdrop }}
          className="absolute inset-0"
        >
          <Image
            src={images.plan.src}
            alt={images.plan.alt}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </motion.div>

        <motion.div
          style={{ opacity: headlineOpacity }}
          className="pointer-events-none absolute top-28 right-6 max-w-88 text-right text-white md:top-36 md:right-14 md:max-w-xl"
        >
          <h1
            id="hero-title"
            className="font-display text-4xl leading-[1.02] tracking-tight md:text-6xl"
          >
            {title.map((line) =>
              line.startsWith("*") ? (
                <em key={line} className="block text-white/70 not-italic">
                  {line.replace(/\*/g, "")}
                </em>
              ) : (
                <span key={line} className="block">
                  {line}
                </span>
              ),
            )}
          </h1>
          <p className="mt-4 text-xs tracking-[0.3em] text-white/70 uppercase">
            {copy.buildingLabel}
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: planCopyOpacity }}
          className="pointer-events-none absolute bottom-10 left-6 text-white md:bottom-14 md:left-14"
        >
          <p className="font-display text-3xl tracking-tight md:text-5xl">{copy.planLabel}</p>
          <p className="mt-2 text-xs tracking-[0.25em] text-white/60 uppercase">{copy.planNote}</p>
        </motion.div>

        <motion.p
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] text-white/80 uppercase"
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
                    top: (track.current?.offsetTop ?? 0) + window.innerHeight * 2.4,
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

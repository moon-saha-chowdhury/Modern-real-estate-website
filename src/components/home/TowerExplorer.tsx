"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { buttonClasses } from "@/components/common/Button";
import { SampleBadge } from "@/components/common/SampleBadge";
import { TextReveal } from "@/components/common/TextReveal";
import { residences, towerFloors } from "@/data/residences";
import {
  EXPLORER_COPY,
  EXPLORER_GEOMETRY,
  EXPLORER_TOUR_HREF,
  EXPLORER_TOWER,
  EXPLORER_UNIT_BACKDROP,
  EXPLORER_ZOOM,
} from "@/lib/constants/explorer";
import { cn } from "@/lib/utils/cn";
import type { BuildingTransformationProps } from "@/types/sections";

const price = (value: number) => `$${(value / 1_000_000).toFixed(2)}M`;
const pct = (value: number) => `${value * 100}%`;

/**
 * 01 — Hero as a tower explorer (after the client's reference reel).
 *
 * The finished tower fills the screen. Each residential floor is a button laid over the still:
 * hovering (or focusing) one marks it and shows its card; choosing it pushes the camera into
 * that floor and hands over to an isometric cutaway of the residence, with a details panel and
 * a hotspot per room. Rooms link on to the sample 360° tour.
 *
 * The floor buttons live in a box with the still's aspect ratio that covers the hero, so they
 * stay on the facade at any screen size. All figures are samples and labelled as such.
 * Reduced motion: no camera push, the two views simply swap.
 */
export function TowerExplorer({ title }: BuildingTransformationProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [lastOpen, setLastOpen] = useState(0);
  const [room, setRoom] = useState<string | null>(null);
  const floorRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const backRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const isOpen = open !== null;
  const { left, right, top, bottom } = EXPLORER_GEOMETRY;
  const band = (bottom - top) / towerFloors.length;
  /** Vertical centre of a floor on the still (index 0 is the lowest floor). */
  const centreOf = (index: number) => bottom - band * (index + 0.5);

  // The panel keeps showing the last residence while it fades out.
  const shown = towerFloors[open ?? lastOpen];
  const residence = residences.find((item) => item.id === shown.residenceId) ?? residences[0];
  const activeRoom = residence.rooms.find((item) => item.id === room) ?? null;
  const preview = hovered === null ? null : towerFloors[hovered];
  const previewResidence = preview
    ? (residences.find((item) => item.id === preview.residenceId) ?? residences[0])
    : null;

  // Move focus with the view: to "Back to tower" on entering, back to the floor on leaving.
  useEffect(() => {
    if (isOpen) backRef.current?.focus({ preventScroll: true });
    else if (wasOpen.current) floorRefs.current[lastOpen]?.focus({ preventScroll: true });
    wasOpen.current = isOpen;
  }, [isOpen, lastOpen]);

  const enter = (index: number) => {
    setLastOpen(index);
    setOpen(index);
    setHovered(null);
    setRoom(null);
  };
  const leave = () => setOpen(null);

  const focusY = centreOf(open ?? lastOpen);
  const cameraStyle: CSSProperties = {
    transformOrigin: `50% ${pct(focusY)}`,
    transform: isOpen ? `translateY(${pct(0.5 - focusY)}) scale(${EXPLORER_ZOOM})` : "none",
  };

  return (
    <section
      data-surface="blue"
      data-nav-blue
      data-hero-root
      data-view={isOpen ? "residence" : "tower"}
      aria-labelledby="hero-title"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) leave();
      }}
      className="relative isolate h-svh min-h-[36rem] overflow-hidden bg-twilight text-fg"
    >
      {/* ---------- Tower view ---------- */}
      <div
        inert={isOpen}
        className={cn(
          "absolute inset-0 transition-opacity duration-500 ease-meridian motion-reduce:transition-none",
          isOpen ? "opacity-0 delay-500 motion-reduce:delay-0" : "opacity-100",
        )}
      >
        {/* Frame box: the still's aspect ratio, sized to cover the hero. The camera push scales it. */}
        <div
          style={cameraStyle}
          className="absolute top-1/2 left-1/2 aspect-[2752/1536] w-[max(100%,calc(100svh*2752/1536))] max-w-none -translate-1/2 transition-transform duration-[1100ms] ease-meridian will-change-transform motion-reduce:transition-none"
        >
          <Image
            src={EXPLORER_TOWER.src}
            alt={EXPLORER_TOWER.alt}
            fill
            priority
            sizes="(max-width: 767px) 400vw, (max-aspect-ratio: 16/9) 180vw, 100vw"
            quality={90}
            className="object-cover"
          />

          {/* Floors, lowest first in the DOM so Tab climbs the tower */}
          <ul
            aria-label="Floors"
            className="absolute flex flex-col-reverse"
            style={{
              left: pct(left),
              width: pct(right - left),
              top: pct(top),
              height: pct(bottom - top),
            }}
            onPointerLeave={() => setHovered(null)}
          >
            {towerFloors.map((floor, index) => {
              const active = hovered === index;
              return (
                <li key={floor.level} className="relative flex-1">
                  <button
                    ref={(node) => {
                      floorRefs.current[index] = node;
                    }}
                    type="button"
                    aria-label={`Floor ${floor.level}, ${residences.find((item) => item.id === floor.residenceId)?.name}, sample price from ${price(floor.priceFrom)}`}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") setHovered(index);
                    }}
                    onFocus={() => setHovered(index)}
                    onBlur={() => setHovered(null)}
                    onClick={() => enter(index)}
                    className={cn(
                      "absolute inset-0 block w-full cursor-pointer border-y transition-colors duration-200 outline-none focus-visible:border-accent",
                      active ? "border-fg/80 bg-fg/15" : "border-transparent bg-transparent",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute top-1/2 left-1/2 size-3 -translate-1/2 rounded-full bg-accent shadow-[0_0_0_5px_rgb(255_255_255/0.2)] transition-[opacity,scale] duration-300 ease-meridian",
                        active ? "scale-100 opacity-100" : "scale-50 opacity-0",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Floor card (lg+): beside the tower, level with the floor it describes */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute hidden -translate-y-1/2 items-center transition-[opacity,top] duration-300 ease-meridian lg:flex",
              preview ? "opacity-100" : "opacity-0",
            )}
            style={{ left: pct(right), top: pct(centreOf(hovered ?? lastOpen)) }}
          >
            <span className="h-px w-10 bg-fg/60 xl:w-16" />
            {preview && previewResidence && (
              <span className="flex items-center gap-4 border border-fg/20 bg-ink/70 px-4 py-3 whitespace-nowrap backdrop-blur-md">
                <span className="flex flex-col items-center">
                  <span className="label-mono text-[0.5625rem] text-fg-muted">Floor</span>
                  <span className="font-display text-2xl leading-none">{preview.level}</span>
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-display text-base leading-tight">
                    {previewResidence.name}
                  </span>
                  <span className="label-mono text-[0.625rem] text-fg-muted">
                    {previewResidence.bedrooms} bed · {previewResidence.bathrooms} bath ·{" "}
                    {previewResidence.areaSqft.toLocaleString("en")} sq ft
                  </span>
                  <span className="label-mono text-[0.625rem] text-accent">
                    Available · from {price(preview.priceFrom)}
                  </span>
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Legibility under the navbar and behind the footer line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-ink/35 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-ink/60 to-transparent"
        />

        {/* Title: over the open sky on desktop, over the water on phones (the tower fills the middle) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-20 flex flex-col px-gutter [text-shadow:0_2px_28px_rgb(0_0_0/0.4)] lg:top-[calc(var(--spacing-nav)+clamp(3rem,14vh,9rem))] lg:bottom-auto">
          <TextReveal
            as="h1"
            id="hero-title"
            immediate
            delay={0.15}
            className="font-display text-display-md lg:text-display-hero"
            lines={title}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-end justify-between gap-6 px-gutter label-mono">
          <p className="flex items-center gap-3 text-fg">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            <span className="lg:hidden">{EXPLORER_COPY.hintTap}</span>
            <span className="hidden lg:inline">{EXPLORER_COPY.hintHover}</span>
          </p>
          <p className="hidden text-fg-muted md:block">{EXPLORER_COPY.sample}</p>
        </div>
      </div>

      {/* ---------- Residence view ---------- */}
      <div
        inert={!isOpen}
        aria-label={`${residence.name}, floor ${shown.level}`}
        role="group"
        style={{ backgroundColor: EXPLORER_UNIT_BACKDROP }}
        className={cn(
          "absolute inset-0 flex flex-col overflow-x-hidden overflow-y-auto pt-nav transition-opacity duration-700 ease-meridian motion-reduce:transition-none lg:flex-row lg:items-center lg:overflow-hidden",
          isOpen ? "opacity-100 delay-500 motion-reduce:delay-0" : "pointer-events-none opacity-0",
        )}
      >
        {/* Cutaway with a hotspot per room. Wider than a phone screen, so the plan fills it. */}
        <div className="relative shrink-0 lg:min-w-0 lg:flex-1">
          <div
            className={cn(
              "relative left-1/2 aspect-[16/9] w-[140%] -translate-x-1/2 transition-[scale] duration-[1200ms] ease-meridian motion-reduce:transition-none sm:w-full lg:w-[112%]",
              isOpen ? "scale-100" : "scale-90",
            )}
          >
            <Image
              src={residence.image.src}
              alt={residence.image.alt}
              fill
              sizes="(max-width: 639px) 140vw, (max-width: 1023px) 100vw, 75vw"
              quality={90}
              className="object-contain"
            />
            {residence.rooms.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                aria-pressed={room === item.id}
                onClick={() => setRoom(room === item.id ? null : item.id)}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setRoom(item.id);
                }}
                style={{ left: pct(item.x), top: pct(item.y) }}
                className="group/spot absolute grid size-11 -translate-1/2 cursor-pointer place-items-center rounded-full outline-offset-2"
              >
                <span
                  className={cn(
                    "size-3 rounded-full border-2 border-white transition-[scale,background-color] duration-300 ease-meridian group-hover/spot:scale-125",
                    room === item.id
                      ? "scale-125 bg-accent shadow-[0_0_0_6px_rgb(255_255_255/0.25)]"
                      : "bg-brand shadow-[0_0_0_4px_rgb(255_255_255/0.18)]",
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="relative z-10 flex w-full shrink-0 flex-col gap-6 px-gutter pt-2 pb-10 lg:w-[24rem] lg:py-8 lg:pl-0 xl:w-[27rem]">
          <div className="flex flex-col gap-3">
            <p className="label-mono text-fg-muted">
              Floor {shown.level} · <span className="text-accent">Available</span>
            </p>
            <h2 className="font-display text-display-sm">{residence.name}</h2>
            <SampleBadge label="Sample residence" className="self-start text-fg-muted" />
          </div>

          <dl className="grid grid-cols-3 gap-4 border-y border-rule py-4">
            {[
              ["Bedrooms", residence.bedrooms],
              ["Bathrooms", residence.bathrooms],
              ["Sq ft", residence.areaSqft.toLocaleString("en")],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col-reverse gap-1">
                <dt className="label-mono text-[0.625rem] text-fg-muted">{label}</dt>
                <dd className="font-display text-xl">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="flex items-baseline gap-3">
            <span className="label-mono text-fg-muted">From</span>
            <span className="font-display text-2xl">{price(shown.priceFrom)}</span>
          </p>

          {/* The room's note replaces the summary while a room is chosen */}
          <p className="min-h-[4.5rem] text-small text-fg-muted" aria-live="polite">
            {activeRoom ? activeRoom.note : residence.summary}
          </p>

          <ul className="flex flex-col">
            {residence.rooms.map((item) => {
              const pressed = room === item.id;
              return (
                <li key={item.id} className="flex items-center border-t border-rule last:border-b">
                  <button
                    type="button"
                    aria-pressed={pressed}
                    onClick={() => setRoom(pressed ? null : item.id)}
                    className={cn(
                      "flex flex-1 cursor-pointer items-center gap-3 py-2.5 text-left text-small transition-colors duration-300",
                      pressed ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 rounded-full transition-colors duration-300",
                        pressed ? "bg-accent" : "bg-fg/40",
                      )}
                    />
                    {item.label}
                  </button>
                  {pressed && item.tourRoom && (
                    <Link
                      href={`${EXPLORER_TOUR_HREF}?room=${item.tourRoom}`}
                      className="flex items-center gap-1.5 label-mono text-[0.625rem] text-accent hover:text-fg"
                    >
                      {EXPLORER_COPY.tour}
                      <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-3.5" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              ref={backRef}
              type="button"
              onClick={leave}
              className="flex h-12 cursor-pointer items-center gap-2 label-mono text-fg-muted transition-colors duration-300 hover:text-fg"
            >
              <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-4" />
              {EXPLORER_COPY.back}
            </button>
            <Link href="/contact" className={buttonClasses("primary", "dark")}>
              {EXPLORER_COPY.request}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

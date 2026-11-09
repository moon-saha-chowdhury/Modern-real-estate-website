import type { HeroStage } from "@/types/sections";

/** Encoded by scripts/encode-hero.mjs from references/hero/start.mp4 + end.mp4 (blue glass tower). */
export const HERO_MEDIA = {
  desktop: "/media/hero/hero-1080.mp4",
  mobile: "/media/hero/hero-720.mp4",
  /** Matches the <source media> switch. */
  mobileQuery: "(max-width: 767px)",
  posterStart: "/media/hero/poster-start.webp",
  posterEnd: "/media/hero/poster-end.webp",
} as const;

/**
 * Scroll choreography, as fractions of the pinned timeline.
 * 0 → titleOut: the title fades. Video time follows the whole timeline (0 → 1). No zoom.
 */
export const HERO_SCROLL = {
  pinDesktop: "+=240%",
  pinMobile: "+=160%",
  titleOut: 0.14,
  /** ScrollTrigger scrub smoothing (seconds). */
  scrub: 0.6,
  /** Ignore seeks smaller than this (seconds) to avoid decoder churn. */
  seekThreshold: 0.02,
} as const;

/**
 * Construction phases of the blue tower (12.2 s after retiming), keyed to video progress (0–1).
 * 0–1 s foundation · 1–6 s concrete frame · 6–9 s glass facade · 9 s+ lights on.
 */
export const HERO_STAGES: HeroStage[] = [
  { at: 0, label: "Foundation" },
  { at: 0.08, label: "Structure" },
  { at: 0.5, label: "Glass facade" },
  { at: 0.75, label: "Lights on" },
];

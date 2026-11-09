import type { HeroStage } from "@/types/sections";

/** Encoded by scripts/encode-hero.mjs from references/hero/optionA.mp4. */
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
 * 0 → titleOut: title and its paper wash fade. Video time follows the whole timeline (0 → 1).
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
 * Construction phases of optionA (8.5 s after retiming), keyed to video progress (0–1).
 * 0–3.5 s concrete frame · 3.5–5 s brick facade · 5–6 s planting · 6 s+ lights on.
 */
export const HERO_STAGES: HeroStage[] = [
  { at: 0, label: "Structure" },
  { at: 0.4, label: "Facade" },
  { at: 0.58, label: "Greenery" },
  { at: 0.7, label: "Lights on" },
];

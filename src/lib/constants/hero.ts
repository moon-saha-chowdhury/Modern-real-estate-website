import type { HeroStage } from "@/types/sections";

/** Encoded by scripts/encode-hero.mjs from references/hero/final1.mp4 + final2.mp4. */
export const HERO_MEDIA = {
  desktop: "/media/hero/hero-1080.mp4",
  mobile: "/media/hero/hero-720.mp4",
  /** Matches the <source media> switch below. */
  mobileQuery: "(max-width: 767px)",
  posterStart: "/media/hero/poster-start.webp",
  posterEnd: "/media/hero/poster-end.webp",
  /** Natural size of the encoded frames (16:9). */
  width: 1920,
  height: 1080,
} as const;

/**
 * Scroll choreography, as fractions of the pinned timeline.
 * 0 → ZOOM_END: camera push-in + title exit. ZOOM_END → 1: construction plays.
 */
export const HERO_SCROLL = {
  pinDesktop: "+=260%",
  pinMobile: "+=170%",
  zoomEnd: 0.16,
  /** As the tower rises the camera pulls back to 1×, so the finished building is framed whole. */
  pullBackEnd: 0.9,
  titleOut: 0.12,
  zoomScaleDesktop: 1.35,
  zoomScaleMobile: 1.12,
  /** Where the tower sits in the frame, so the push-in moves towards it. */
  zoomOrigin: "50% 62%",
  /** ScrollTrigger scrub smoothing (seconds). */
  scrub: 0.6,
  /** Ignore seeks smaller than this (seconds) to avoid decoder churn. */
  seekThreshold: 0.02,
} as const;

/** Construction phases, keyed to video progress (0–1). Shown bottom-left. */
export const HERO_STAGES: HeroStage[] = [
  { at: 0, label: "Foundation" },
  { at: 0.1, label: "Structure" },
  { at: 0.48, label: "Envelope" },
  { at: 0.9, label: "Completion" },
];

import type { HeroStage } from "@/types/sections";

/** Static images produced by scripts/encode-hero.mjs (frame counts live in hero-sequence.ts). */
export const HERO_MEDIA = {
  /** Phones get the tall centre crop of the tower. */
  mobileQuery: "(max-width: 767px)",
  posterStart: "/media/hero/poster-start.webp",
  posterEnd: "/media/hero/poster-end.webp",
  frameExtension: "webp",
  /** Frame files are numbered 0001, 0002 … */
  framePad: 4,
} as const;

/** Scroll choreography for the pinned hero. No zoom animation and the title never moves. */
export const HERO_SCROLL = {
  pinDesktop: "+=240%",
  pinMobile: "+=170%",
  /** ScrollTrigger scrub smoothing (seconds): eases between frames on fast scrolls. */
  scrub: 0.5,
} as const;

/**
 * Static zoom-out: the frame is drawn at this fraction of the size that would fill the hero, so
 * the tower sits further away. The frame's edges are feathered into the sky/water gradient.
 */
export const HERO_FRAME_SCALE = { desktop: 0.86, mobile: 0.94 } as const;

/** Never render the canvas above this device-pixel ratio (memory and fill-rate). */
export const HERO_MAX_DPR = 2;

/**
 * Progressive loading order: every 8th frame first (the sequence works immediately), then every
 * 4th, 2nd and finally all. Until a frame arrives, the nearest loaded frame is drawn.
 */
export const HERO_LOAD_STRIDES = [8, 4, 2, 1] as const;

/** Parallel image requests while loading the sequence. */
export const HERO_LOAD_CONCURRENCY = 6;

/**
 * Construction phases of the blue tower (12.2 s after retiming), keyed to progress (0–1).
 * 0–1 s foundation · 1–6 s concrete frame · 6–9 s glass facade · 9 s+ lights on.
 */
export const HERO_STAGES: HeroStage[] = [
  { at: 0, label: "Foundation" },
  { at: 0.08, label: "Structure" },
  { at: 0.5, label: "Glass facade" },
  { at: 0.75, label: "Lights on" },
];

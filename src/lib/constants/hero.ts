import type { HeroCallout, HeroStage } from "@/types/sections";
import { HERO_SEQUENCE } from "./hero-sequence";

/** Static images produced by scripts/encode-hero.mjs (frame counts live in hero-sequence.ts). */
export const HERO_MEDIA = {
  /** Phones get the tall centre crop of the tower. */
  mobileQuery: "(max-width: 767px)",
  /** Last frame of the sequence: open twilight sky. Backdrop for the camera rise. */
  posterSky: "/media/hero/poster-sky.webp",
  frameExtension: "webp",
  /** Frame files are numbered 0001, 0002 … */
  framePad: 4,
} as const;

/** Scroll choreography for the pinned hero. The title never moves. */
export const HERO_SCROLL = {
  /**
   * The scroll distance is reserved in CSS from the first paint: a tall track (1 screen of hero
   * plus 4.4 screens of scroll on md+, 3.1 on phones) with the hero sticky inside it. A GSAP
   * pin inserted its spacer only on hydration, shifting everything below the hero by thousands
   * of pixels (and the targets of early clicks). Reduced motion: one screen, nothing sticks.
   */
  trackClass: "h-[410svh] md:h-[540svh] motion-reduce:h-auto",
  /** ScrollTrigger scrub smoothing (seconds): eases between frames on fast scrolls. */
  scrub: 0.5,
} as const;

/**
 * Static zoom-out: the frame is drawn at this fraction of the size that would fill the hero, so
 * the tower sits further away. The frame's edges are feathered into the sky/water gradient.
 * During the camera rise the frame grows back to full size (scale 1 / HERO_FRAME_SCALE).
 */
export const HERO_FRAME_SCALE = { desktop: 0.86, mobile: 0.94 } as const;

/** Never render the canvas above this device-pixel ratio (memory and fill-rate). */
export const HERO_MAX_DPR = 2;

/**
 * Progressive loading order: every 8th frame first (the sequence works immediately), then every
 * 4th, 2nd and finally all. Until a frame arrives, the nearest loaded frame is drawn.
 */
export const HERO_LOAD_STRIDES = [8, 4, 2, 1] as const;

/**
 * Parallel image requests while loading the sequence. Below Chrome's 6-connections-per-origin
 * limit on HTTP/1.1, so a click's navigation request and other assets never queue behind frames.
 */
export const HERO_LOAD_CONCURRENCY = 4;

/** Length of the sequence in seconds of source footage. */
const SEQUENCE_SECONDS = HERO_SEQUENCE.seconds;

/** Converts a time in the source footage (seconds) to scroll progress (0–1). */
const at = (seconds: number) => Math.min(1, seconds / SEQUENCE_SECONDS);

/**
 * Footage timeline (seconds), from scripts/encode-hero.mjs:
 *   0–0.8 podium · 0.8–7 concrete frame floor by floor · 7–8 roof structure ·
 *   8.3–12.8 glass facade bottom-up · 13.6 rooftop pavilion · 14+ window lights ·
 *   16+ camera rise: push-in and tilt up the facade into open sky.
 */
export const HERO_CAMERA_START = at(HERO_SEQUENCE.finishedSeconds);

/** Construction phases shown in the stage indicator, keyed to progress (0–1). */
export const HERO_STAGES: HeroStage[] = [
  { at: 0, label: "Foundation" },
  { at: at(0.8), label: "Structure" },
  { at: at(8.3), label: "Facade" },
  { at: at(13.8), label: "Lights" },
  { at: HERO_CAMERA_START, label: "Skyline" },
];

/** Horizontal anchor of the callout dots: the tower's right-hand facade, as a fraction of the frame. */
export const HERO_CALLOUT_X = 0.605;

/**
 * Floor callouts (lg+ only: on portrait tablets the chips run off the edge), timed to the frames:
 * each appears as that part of the tower is built. Structure callouts give way to finish callouts
 * so no more than three show at once, and all leave as the camera starts to move (their positions
 * are only valid for the locked-off shot).
 *
 * ILLUSTRATIVE content for a concept tower (labelled as such in the hero), matching what the
 * footage shows: a two-storey podium, residential levels 2–20 and a glass sky pavilion on 21.
 * Replace with the real project's programme when it is available.
 */
export const HERO_CALLOUTS: HeroCallout[] = [
  // Structure: the frame rises
  { tag: "Podium", label: "Lobby, lounge & gym", y: 0.72, from: at(0.5), to: at(9) },
  { tag: "Level 10", label: "One floor a week", y: 0.45, from: at(3.5), to: at(9) },
  { tag: "Level 20", label: "Topping out", y: 0.11, from: at(6.7), to: at(9) },
  // Finish: what the residents get
  { tag: "Ground", label: "Double-height lobby", y: 0.72, from: at(9.9), to: HERO_CAMERA_START },
  { tag: "L2–20", label: "84 homes, 1–3 bedrooms", y: 0.45, from: at(11.2), to: HERO_CAMERA_START },
  {
    tag: "Level 21",
    label: "Sky pavilion & pool",
    y: 0.1,
    from: at(13.8),
    to: HERO_CAMERA_START,
  },
];

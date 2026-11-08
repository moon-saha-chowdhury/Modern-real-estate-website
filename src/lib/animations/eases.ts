/**
 * Motion vocabulary — one house ease, three durations.
 * Mirrors --ease-meridian in tokens.css so CSS, Motion and GSAP feel identical.
 */
export const EASE_MERIDIAN = [0.22, 1, 0.36, 1] as const;
export const EASE_MERIDIAN_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** GSAP equivalents (CustomEase not required — expo-ish out curve). */
export const GSAP_EASE = "expo.out";
export const GSAP_EASE_IN_OUT = "power3.inOut";

export const DURATION = {
  ui: 0.5,
  reveal: 0.9,
  hero: 1.2,
} as const;

export const STAGGER = 0.06;

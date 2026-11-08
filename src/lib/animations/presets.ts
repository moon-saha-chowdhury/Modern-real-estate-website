import type { RevealDirection } from "@/types/ui";

/** In-view trigger margins: elements reveal slightly before they are fully on screen. */
export const VIEWPORT_TEXT = { once: true, margin: "0px 0px -12% 0px" } as const;
export const VIEWPORT_BLOCK = { once: true, margin: "0px 0px -10% 0px" } as const;
export const VIEWPORT_IMAGE = { once: true, margin: "0px 0px -15% 0px" } as const;

/** Clip-path start states for image mask reveals. */
export const CLIP_HIDDEN: Record<RevealDirection, string> = {
  bottom: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};
export const CLIP_VISIBLE = "inset(0% 0% 0% 0%)";

/** Image settle: starts slightly enlarged and eases to 1. */
export const IMAGE_SETTLE_SCALE = 1.12;

/** Delay between text lines, relative to the base stagger. */
export const LINE_STAGGER_MULTIPLIER = 1.5;

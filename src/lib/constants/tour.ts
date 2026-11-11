import type { PanoramaRules } from "@/types/tour";

/** Panorama tour viewer settings (see components/virtual-tour). */
export const TOUR = {
  /** Phones load the 2048 px panorama, everything else the 4096 px one. */
  mobileQuery: "(max-width: 767px)",
  /** Start zoom, 0 = widest field of view, 100 = closest. */
  defaultZoom: 10,
  /** Seconds the cross-fade between rooms takes (none with reduced motion). */
  transitionMs: 1000,
} as const;

/**
 * What a 360° panorama upload must look like, and the files made from it. Used by the upload
 * checks and by scripts/prepare-panorama.mjs. Keep this file free of runtime imports: Node
 * loads it directly from the script.
 */
export const PANORAMA_RULES: PanoramaRules = {
  formats: ["jpeg", "png", "webp", "tiff"],
  ratioTolerance: 0.02,
  minWidth: 2048,
  recommendedWidth: 8192,
  maxWidth: 16384,
  maxBytes: 80 * 1024 * 1024,
  seamWarnAt: 2.5,
  outputs: [
    { suffix: "", width: 4096 },
    { suffix: "-2k", width: 2048 },
  ],
  quality: 82,
};

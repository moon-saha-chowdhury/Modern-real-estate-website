/** Types for preparing and checking 360° panorama uploads (see src/lib/tour). */

export interface PanoramaMeta {
  width: number;
  height: number;
  bytes: number;
  /** sharp's format name: "jpeg", "png", "webp", "tiff" … */
  format: string;
}

export interface PanoramaRules {
  formats: readonly string[];
  /** Width / height must be 2 within this fraction (0.02 = 2%). */
  ratioTolerance: number;
  /** Narrower than this is rejected. */
  minWidth: number;
  /** Narrower than half of this gets a "will look soft" warning. */
  recommendedWidth: number;
  maxWidth: number;
  maxBytes: number;
  /** Seam score (edge difference ÷ typical neighbouring-column difference) above this is reported. */
  seamWarnAt: number;
  /** Files written for each panorama: desktop first, then phones. */
  outputs: readonly { suffix: string; width: number }[];
  /** WebP quality, 1–100. */
  quality: number;
}

export interface PanoramaCheck {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export interface PanoramaInspection extends PanoramaCheck {
  meta: PanoramaMeta;
  /** About 1 for a panorama that wraps; well above it means a visible seam. */
  seamScore: number;
}

export interface PanoramaOutput {
  suffix: string;
  width: number;
  height: number;
  buffer: Buffer;
}

/** A flat (ordinary) view looking into a panorama, for posters and gallery images. */
export interface FlatViewOptions {
  /** Degrees, 0 = the centre of the panorama, positive = to the right. */
  yaw: number;
  /** Degrees, 0 = the horizon, positive = up. */
  pitch: number;
  /** Horizontal field of view in degrees. */
  hFov: number;
  width: number;
  height: number;
}

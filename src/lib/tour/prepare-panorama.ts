import sharp from "sharp";
import type {
  FlatViewOptions,
  PanoramaInspection,
  PanoramaOutput,
  PanoramaRules,
} from "@/types/tour";
import { validatePanorama } from "./validate-panorama.ts";

/**
 * Server-side panorama preparation (needs `sharp`). Used by scripts/prepare-panorama.mjs today
 * and by an admin upload handler later. This file must stay "erasable" TypeScript with no path
 * aliases, because Node runs it directly (type stripping) from the script.
 */

const CHANNELS = 3;
const SEAM_STRIP = 16; // px averaged at each edge when fixing a seam
const SEAM_SMOOTH_ROWS = 96; // vertical smoothing of the edge difference (avoids banding)
const SEAM_BAND = 96; // px blended across the seam on each side (at 4096 px wide)
const INSPECT_WIDTH = 1024;
const FLAT_SOURCE_WIDTH = 2048;

interface Raw {
  data: Buffer;
  width: number;
  height: number;
}

async function toRaw(input: Buffer, width: number): Promise<Raw> {
  const { data, info } = await sharp(input)
    .removeAlpha()
    .resize(width, width / 2, { kernel: "lanczos3", fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

/**
 * How visible the wrap-around seam is: the difference between the left and right edge columns,
 * divided by the typical difference between neighbouring columns. About 1 = it wraps; much
 * higher = a visible vertical line in the viewer.
 */
export function measureSeam({ data, width, height }: Raw): number {
  const at = (x: number, y: number, c: number) => (y * width + x) * CHANNELS + c;
  let edge = 0;
  let steps = 0;
  let stepCount = 0;
  for (let y = 0; y < height; y++) {
    for (let c = 0; c < CHANNELS; c++) {
      edge += Math.abs(data[at(0, y, c)] - data[at(width - 1, y, c)]);
      for (let x = 0; x < width - 1; x += 4) {
        steps += Math.abs(data[at(x, y, c)] - data[at(x + 1, y, c)]);
        stepCount++;
      }
    }
  }
  const edgeMean = edge / (height * CHANNELS);
  const stepMean = steps / stepCount;
  return edgeMean / Math.max(stepMean, 1);
}

/**
 * Makes the left and right edges meet (in place): a smooth ramp, spread over the whole width,
 * shifts each row so the right edge matches the left edge in colour, then a narrow band at each
 * edge is blended with the mirrored pixels of the other side. Invisible on plain walls and sky.
 */
export function fixSeam({ data, width, height }: Raw): void {
  const at = (x: number, y: number, c: number) => (y * width + x) * CHANNELS + c;
  const diff = new Float32Array(height * CHANNELS);
  for (let y = 0; y < height; y++) {
    for (let c = 0; c < CHANNELS; c++) {
      let left = 0;
      let right = 0;
      for (let k = 0; k < SEAM_STRIP; k++) {
        left += data[at(k, y, c)];
        right += data[at(width - 1 - k, y, c)];
      }
      diff[y * CHANNELS + c] = (right - left) / SEAM_STRIP;
    }
  }
  const smooth = new Float32Array(height * CHANNELS);
  const half = SEAM_SMOOTH_ROWS >> 1;
  const clampRow = (y: number) => Math.min(height - 1, Math.max(0, y));
  for (let c = 0; c < CHANNELS; c++) {
    let sum = 0;
    for (let y = -half; y <= half; y++) sum += diff[clampRow(y) * CHANNELS + c];
    for (let y = 0; y < height; y++) {
      smooth[y * CHANNELS + c] = sum / (SEAM_SMOOTH_ROWS + 1);
      sum += diff[clampRow(y + half + 1) * CHANNELS + c];
      sum -= diff[clampRow(y - half) * CHANNELS + c];
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = x / (width - 1);
      for (let c = 0; c < CHANNELS; c++) {
        const v = data[at(x, y, c)] - smooth[y * CHANNELS + c] * t;
        data[at(x, y, c)] = v < 0 ? 0 : v > 255 ? 255 : v;
      }
    }
  }
  const band = Math.max(4, Math.round((SEAM_BAND * width) / 4096));
  const copy = Buffer.from(data);
  for (let y = 0; y < height; y++) {
    for (let d = 0; d < band; d++) {
      const w = 0.5 * (1 - d / band) ** 2;
      for (let c = 0; c < CHANNELS; c++) {
        const a = copy[at(d, y, c)];
        const b = copy[at(width - 1 - d, y, c)];
        data[at(d, y, c)] = a * (1 - w) + b * w;
        data[at(width - 1 - d, y, c)] = b * (1 - w) + a * w;
      }
    }
  }
}

/** Checks a panorama file against the rules and reports how visible its seam is. */
export async function inspectPanorama(
  input: Buffer,
  rules: PanoramaRules,
): Promise<PanoramaInspection> {
  const meta = await sharp(input).metadata();
  const facts = {
    width: meta.width ?? 0,
    height: meta.height ?? 0,
    bytes: input.byteLength,
    format: meta.format ?? "unknown",
  };
  const check = validatePanorama(facts, rules);
  if (!check.ok) return { ...check, meta: facts, seamScore: 0 };
  const seamScore = measureSeam(await toRaw(input, INSPECT_WIDTH));
  if (seamScore > rules.seamWarnAt) {
    check.warnings.push(
      "The left and right edges do not meet, which shows as a vertical line when visitors look round. Turning on the seam fix will smooth it.",
    );
  }
  return { ...check, meta: facts, seamScore };
}

/**
 * Turns an uploaded panorama into the web files: one WebP per output width (desktop, phones).
 * Throws with the reasons if the file breaks the rules. `seam` runs fixSeam first.
 */
export async function preparePanorama(
  input: Buffer,
  rules: PanoramaRules,
  options: { seam?: boolean } = {},
): Promise<PanoramaOutput[]> {
  const inspection = await inspectPanorama(input, rules);
  if (!inspection.ok) throw new Error(inspection.errors.join(" "));

  const largest = Math.max(...rules.outputs.map((output) => output.width));
  const base = await toRaw(input, largest);
  if (options.seam) fixSeam(base);

  const outputs: PanoramaOutput[] = [];
  for (const { suffix, width } of rules.outputs) {
    const buffer = await sharp(base.data, {
      raw: { width: base.width, height: base.height, channels: CHANNELS },
    })
      .resize(width, width / 2, { kernel: "lanczos3" })
      .webp({ quality: rules.quality })
      .toBuffer();
    outputs.push({ suffix, width, height: width / 2, buffer });
  }
  return outputs;
}

/**
 * An ordinary rectilinear view into the panorama, for the tour poster or gallery images.
 * Coordinates match the viewer: the centre of the panorama is yaw 0, positive yaw is to the right.
 */
export async function renderFlatView(
  input: Buffer,
  view: FlatViewOptions,
  quality = 82,
): Promise<Buffer> {
  const source = await toRaw(input, FLAT_SOURCE_WIDTH);
  const { width: sw, height: sh, data: src } = source;
  const out = Buffer.alloc(view.width * view.height * CHANNELS);
  const rad = Math.PI / 180;
  const focal = view.width / 2 / Math.tan((view.hFov * rad) / 2);
  const [sinP, cosP] = [Math.sin(view.pitch * rad), Math.cos(view.pitch * rad)];
  const [sinY, cosY] = [Math.sin(view.yaw * rad), Math.cos(view.yaw * rad)];

  for (let y = 0; y < view.height; y++) {
    for (let x = 0; x < view.width; x++) {
      const dx = x + 0.5 - view.width / 2;
      const dy = view.height / 2 - y - 0.5;
      // Pitch (about the x axis), then yaw (about the y axis).
      const y1 = dy * cosP + focal * sinP;
      const z1 = -dy * sinP + focal * cosP;
      const x2 = dx * cosY + z1 * sinY;
      const z2 = -dx * sinY + z1 * cosY;
      const length = Math.hypot(x2, y1, z2);
      const u = Math.atan2(x2, z2) / (2 * Math.PI) + 0.5;
      const v = 0.5 - Math.asin(y1 / length) / Math.PI;
      // Bilinear sample, wrapping horizontally.
      const fx = u * sw - 0.5;
      const fy = Math.min(sh - 1, Math.max(0, v * sh - 0.5));
      const x0 = Math.floor(fx);
      const y0 = Math.floor(fy);
      const tx = fx - x0;
      const ty = fy - y0;
      const xa = ((x0 % sw) + sw) % sw;
      const xb = (xa + 1) % sw;
      const ya = y0;
      const yb = Math.min(sh - 1, y0 + 1);
      for (let c = 0; c < CHANNELS; c++) {
        const top =
          src[(ya * sw + xa) * CHANNELS + c] * (1 - tx) + src[(ya * sw + xb) * CHANNELS + c] * tx;
        const bottom =
          src[(yb * sw + xa) * CHANNELS + c] * (1 - tx) + src[(yb * sw + xb) * CHANNELS + c] * tx;
        out[(y * view.width + x) * CHANNELS + c] = top * (1 - ty) + bottom * ty;
      }
    }
  }
  return sharp(out, { raw: { width: view.width, height: view.height, channels: CHANNELS } })
    .webp({ quality })
    .toBuffer();
}

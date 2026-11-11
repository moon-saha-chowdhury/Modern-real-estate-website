#!/usr/bin/env node
/**
 * Prepares an equirectangular (2:1) panorama for the virtual tour.
 *
 *   node scripts/prepare-panorama.mjs <input.png> <out-dir> <name> [--seam]
 *
 * Writes <out-dir>/<name>.webp (4096 px wide, desktop) and <name>-2k.webp (2048 px, phones).
 *
 * --seam  Make the left and right edges meet (for AI-generated panoramas, whose wrap-around
 *         seam usually has a visible colour step and broken lines):
 *           1. a smooth horizontal ramp, spread over the whole width, shifts each row so the
 *              right edge matches the left edge in colour;
 *           2. a narrow band at each edge is blended with the mirrored pixels from the other
 *              side, so both edges end on the same values (invisible on plain walls).
 *         Real panoramas from a 360 camera or a renderer already wrap; leave --seam off.
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [input, outDir, name, ...flags] = process.argv.slice(2);
if (!input || !outDir || !name) {
  console.error("usage: prepare-panorama.mjs <input> <out-dir> <name> [--seam]");
  process.exit(1);
}
const SEAM = flags.includes("--seam");
const STRIP = 16; // px averaged at each edge
const SMOOTH_ROWS = 96; // vertical smoothing of the edge difference (avoids horizontal banding)
const BAND = 96; // px blended across the seam on each side

const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
if (W !== H * 2) console.warn(`warning: ${W}x${H} is not 2:1`);
const px = Buffer.from(data);

if (SEAM) {
  const at = (x, y, c) => (y * W + x) * C + c;
  // Per row and channel: how much brighter/darker the right edge is than the left edge.
  const diff = new Float32Array(H * C);
  for (let y = 0; y < H; y++) {
    for (let c = 0; c < C; c++) {
      let l = 0;
      let r = 0;
      for (let k = 0; k < STRIP; k++) {
        l += px[at(k, y, c)];
        r += px[at(W - 1 - k, y, c)];
      }
      diff[y * C + c] = (r - l) / STRIP;
    }
  }
  // Box-smooth the difference down the rows.
  const smooth = new Float32Array(H * C);
  for (let c = 0; c < C; c++) {
    let sum = 0;
    const half = SMOOTH_ROWS >> 1;
    for (let y = -half; y <= half; y++) sum += diff[Math.min(H - 1, Math.max(0, y)) * C + c];
    for (let y = 0; y < H; y++) {
      smooth[y * C + c] = sum / (SMOOTH_ROWS + 1);
      sum += diff[Math.min(H - 1, y + half + 1) * C + c];
      sum -= diff[Math.max(0, y - half) * C + c];
    }
  }
  // 1. Ramp: 0 at the left edge, the full difference at the right edge.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const t = x / (W - 1);
      for (let c = 0; c < C; c++) {
        const v = px[at(x, y, c)] - smooth[y * C + c] * t;
        px[at(x, y, c)] = v < 0 ? 0 : v > 255 ? 255 : v;
      }
    }
  }
  // 2. Blend each edge with the mirrored pixels of the opposite edge (weight 0.5 at the seam).
  const left = Buffer.from(px);
  for (let y = 0; y < H; y++) {
    for (let d = 0; d < BAND; d++) {
      const w = 0.5 * (1 - d / BAND) ** 2;
      for (let c = 0; c < C; c++) {
        const a = left[at(d, y, c)];
        const b = left[at(W - 1 - d, y, c)];
        px[at(d, y, c)] = a * (1 - w) + b * w;
        px[at(W - 1 - d, y, c)] = b * (1 - w) + a * w;
      }
    }
  }
}

mkdirSync(outDir, { recursive: true });
const base = sharp(px, { raw: { width: W, height: H, channels: C } });
for (const [suffix, width] of [
  ["", 4096],
  ["-2k", 2048],
]) {
  const file = path.join(outDir, `${name}${suffix}.webp`);
  const out = await base
    .clone()
    .resize(width, width / 2, { kernel: "lanczos3" })
    .webp({ quality: 82 })
    .toFile(file);
  console.log(`${file}  ${Math.round(out.size / 1024)} KB`);
}

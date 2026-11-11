#!/usr/bin/env node
/**
 * Prepares an equirectangular (2:1) 360° panorama for the virtual tour.
 *
 *   npm run media:panorama -- <input> <out-dir> <name> [--seam] [--check] [--poster yaw,pitch,fov]
 *
 * Writes <out-dir>/<name>.webp (4096 px wide, desktop) and <name>-2k.webp (2048 px, phones).
 *
 *   --check                  only inspect the file: format, 2:1, size, seam; write nothing
 *   --seam                   make the left and right edges meet (for AI-generated panoramas,
 *                            whose wrap-around seam shows as a vertical line). Real panoramas
 *                            from a 360 camera or a renderer already wrap: leave it off
 *   --poster yaw,pitch,fov   also write <name>-poster.webp, a flat 1600x900 view of the panorama
 *                            (degrees; e.g. --poster -8,-6,100) for the tour's still
 *
 * The work is done by src/lib/tour (also used by the future admin upload), which Node runs
 * directly as TypeScript.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

// Node warns that the .ts files have no package "type"; the output is only noise here.
process.removeAllListeners("warning");

const { PANORAMA_RULES } = await import("../src/lib/constants/tour.ts");
const { inspectPanorama, preparePanorama, renderFlatView } =
  await import("../src/lib/tour/prepare-panorama.ts");

const args = process.argv.slice(2);
const flags = new Set(args.filter((arg) => arg.startsWith("--")));
const posterAt = args.indexOf("--poster");
const posterArg = posterAt >= 0 ? args[posterAt + 1] : undefined;
const positional = args.filter((arg, i) => !arg.startsWith("--") && args[i - 1] !== "--poster");
const [input, outDir, name] = positional;

if (!input || (!flags.has("--check") && (!outDir || !name))) {
  console.error(
    "usage: npm run media:panorama -- <input> <out-dir> <name> [--seam] [--check] [--poster yaw,pitch,fov]",
  );
  process.exit(1);
}

const file = readFileSync(input);
const inspection = await inspectPanorama(file, PANORAMA_RULES);
const { width, height, format } = inspection.meta;
console.log(
  `${path.basename(input)}: ${width}x${height} ${format}, seam score ${inspection.seamScore.toFixed(2)}`,
);
for (const error of inspection.errors) console.error(`  error:   ${error}`);
for (const warning of inspection.warnings) console.warn(`  warning: ${warning}`);
if (!inspection.ok) process.exit(1);
if (flags.has("--check")) process.exit(0);

mkdirSync(outDir, { recursive: true });
const outputs = await preparePanorama(file, PANORAMA_RULES, { seam: flags.has("--seam") });
for (const output of outputs) {
  const target = path.join(outDir, `${name}${output.suffix}.webp`);
  writeFileSync(target, output.buffer);
  console.log(`${target}  ${Math.round(output.buffer.byteLength / 1024)} KB`);
}

if (posterArg) {
  const [yaw, pitch, hFov] = posterArg.split(",").map(Number);
  if ([yaw, pitch, hFov].some(Number.isNaN)) {
    console.error("--poster needs three numbers: yaw,pitch,fov (e.g. -8,-6,100)");
    process.exit(1);
  }
  const buffer = await renderFlatView(file, { yaw, pitch, hFov, width: 1600, height: 900 });
  const target = path.join(outDir, `${name}-poster.webp`);
  writeFileSync(target, buffer);
  console.log(`${target}  ${Math.round(buffer.byteLength / 1024)} KB`);
}

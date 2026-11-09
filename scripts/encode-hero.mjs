#!/usr/bin/env node
/**
 * Encodes the hero building-transformation video for scroll scrubbing.
 *
 *   npm run media:hero
 *
 * Input  (not committed): references/hero/  (see SEGMENTS)
 * Output (committed):     public/media/hero/
 *   hero-1080.mp4   desktop, H.264, keyframe every 4 frames (smooth reverse seeking)
 *   hero-720.mp4    mobile
 *   poster-start.webp / poster-end.webp (+ -1280 variants)
 *
 * SEGMENTS lists the source clips in order. Each segment can be trimmed and sped up, so slow
 * passages don't waste scroll distance. Audio is always removed.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

const SRC = "references/hero";
const OUT = "public/media/hero";
const FPS = 24;

/**
 * Current source: optionA.mp4 (brick-and-concrete mid-rise, chosen by the client).
 * 0–6 s: structure → envelope → greenery at natural speed.
 * 6 s–end: lights switching on; played 1.6× so the finale doesn't drag.
 */
const SEGMENTS = [
  { file: "optionA.mp4", start: 0, end: 6, speed: 1 },
  { file: "optionA.mp4", start: 6, end: null, speed: 1.6 },
];

mkdirSync(OUT, { recursive: true });
const run = (args) => execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args]);

// 1. Trim / retime / join into a high-quality intermediate.
const files = [...new Set(SEGMENTS.map((s) => s.file))];
const inputs = files.flatMap((f) => ["-i", path.join(SRC, f)]);
const chains = SEGMENTS.map((s, i) => {
  const input = files.indexOf(s.file);
  const range = s.end == null ? `start=${s.start}` : `start=${s.start}:end=${s.end}`;
  return `[${input}:v]trim=${range},setpts=(PTS-STARTPTS)/${s.speed}[s${i}]`;
});
const labels = SEGMENTS.map((_, i) => `[s${i}]`).join("");
const filter = `${chains.join(";")};${labels}concat=n=${SEGMENTS.length}:v=1:a=0,fps=${FPS},format=yuv420p[v]`;

const joined = path.join(OUT, ".joined.mp4");
run([...inputs, "-filter_complex", filter, "-map", "[v]", "-an", "-c:v", "libx264", "-crf", "12", "-preset", "medium", joined]);

// 2. Web encodes: dense keyframes so seeking backwards never decodes long GOPs.
const encode = (height, crf, file) =>
  run([
    "-i", joined,
    "-vf", `scale=-2:${height}:flags=lanczos`,
    "-an",
    "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-crf", String(crf), "-preset", "slow",
    "-g", "4", "-keyint_min", "1", "-sc_threshold", "0", "-bf", "0",
    "-movflags", "+faststart",
    path.join(OUT, file),
  ]);
encode(1080, 27, "hero-1080.mp4");
encode(720, 28, "hero-720.mp4");

// 3. Posters (first and last frame).
for (const [width, suffix] of [[1920, ""], [1280, "-1280"]]) {
  run(["-i", joined, "-frames:v", "1", "-vf", `scale=${width}:-2`, "-q:v", "68", path.join(OUT, `poster-start${suffix}.webp`)]);
  run(["-sseof", "-0.2", "-i", joined, "-update", "1", "-vf", `scale=${width}:-2`, "-q:v", "68", path.join(OUT, `poster-end${suffix}.webp`)]);
}

rmSync(joined);

for (const file of ["hero-1080.mp4", "hero-720.mp4", "poster-start.webp", "poster-end.webp"]) {
  const kb = Math.round(statSync(path.join(OUT, file)).size / 1024);
  console.log(`${file.padEnd(20)} ${kb} KB`);
}

#!/usr/bin/env node
/**
 * Encodes the hero building-transformation video for scroll scrubbing.
 *
 *   node scripts/encode-hero.mjs            (or: npm run media:hero)
 *
 * Input  (not committed): references/hero/final1.mp4, references/hero/final2.mp4
 * Output (committed):     public/media/hero/
 *   hero-1080.mp4   desktop, H.264, keyframe every 4 frames (smooth reverse seeking)
 *   hero-720.mp4    mobile
 *   poster-start.webp / poster-end.webp (1920 + 1280 variants)
 *
 * Retiming: both clips build actively for ~5.5 s, then hold nearly still. The still tails are
 * played 4× faster so every part of the scroll shows construction. The duplicate frame at the
 * join (final1's last frame ≈ final2's first frame) is dropped.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

const SRC = "references/hero";
const OUT = "public/media/hero";
const ACTIVE = 5.5; // seconds of real construction at the start of each clip
const TAIL_SPEED = 4; // speed-up for the near-static tail
const FPS = 24;

mkdirSync(OUT, { recursive: true });

const run = (args) => execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args]);

// 1. Retime + join into a lossless-ish intermediate.
const joined = path.join(OUT, ".joined.mp4");
const seg = (input, label, skipFirstFrame) => {
  const start = skipFirstFrame ? 1 / FPS : 0;
  return [
    `[${input}:v]trim=start=${start}:end=${ACTIVE},setpts=PTS-STARTPTS[${label}a]`,
    `[${input}:v]trim=start=${ACTIVE},setpts=(PTS-STARTPTS)/${TAIL_SPEED}[${label}b]`,
  ];
};
const filter = [
  ...seg(0, "f1", false),
  ...seg(1, "f2", true),
  `[f1a][f1b][f2a][f2b]concat=n=4:v=1:a=0,fps=${FPS},format=yuv420p[v]`,
].join(";");
run([
  "-i",
  path.join(SRC, "final1.mp4"),
  "-i",
  path.join(SRC, "final2.mp4"),
  "-filter_complex",
  filter,
  "-map",
  "[v]",
  "-an",
  "-c:v",
  "libx264",
  "-crf",
  "12",
  "-preset",
  "medium",
  joined,
]);

// 2. Web encodes: dense keyframes so seeking backwards never decodes long GOPs.
const encode = (height, crf, file) =>
  run([
    "-i",
    joined,
    "-vf",
    `scale=-2:${height}:flags=lanczos`,
    "-an",
    "-c:v",
    "libx264",
    "-profile:v",
    "high",
    "-pix_fmt",
    "yuv420p",
    "-crf",
    String(crf),
    "-preset",
    "slow",
    "-g",
    "4",
    "-keyint_min",
    "1",
    "-sc_threshold",
    "0",
    "-bf",
    "0",
    "-movflags",
    "+faststart",
    path.join(OUT, file),
  ]);
encode(1080, 25, "hero-1080.mp4");
encode(720, 26, "hero-720.mp4");

// 3. Posters (first and last frame).
for (const [width, suffix] of [
  [1920, ""],
  [1280, "-1280"],
]) {
  run([
    "-i",
    joined,
    "-frames:v",
    "1",
    "-vf",
    `scale=${width}:-2`,
    "-q:v",
    "82",
    path.join(OUT, `poster-start${suffix}.webp`),
  ]);
  run([
    "-sseof",
    "-0.2",
    "-i",
    joined,
    "-update",
    "1",
    "-vf",
    `scale=${width}:-2`,
    "-q:v",
    "82",
    path.join(OUT, `poster-end${suffix}.webp`),
  ]);
}

execFileSync(
  process.platform === "win32" ? "cmd" : "rm",
  process.platform === "win32" ? ["/c", "del", path.normalize(joined)] : [joined],
);

for (const file of ["hero-1080.mp4", "hero-720.mp4", "poster-start.webp", "poster-end.webp"]) {
  const kb = Math.round(statSync(path.join(OUT, file)).size / 1024);
  console.log(`${file.padEnd(20)} ${kb} KB`);
}

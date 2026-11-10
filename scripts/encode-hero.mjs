#!/usr/bin/env node
/**
 * Builds the hero building-transformation IMAGE SEQUENCE for scroll scrubbing.
 *
 *   npm run media:hero
 *
 * Why frames instead of a video: scrubbing a <video> means seeking, and every seek waits for the
 * decoder, so playback lands at ~10–15 fps and feels jerky. Pre-extracted frames drawn on a
 * <canvas> update every animation frame (up to 60 fps).
 *
 * Input  (not committed): references/hero/  (see SEGMENTS)
 * Output (committed):
 *   public/media/hero/frames/desktop/0001.webp …  full frame, 1600 px wide
 *   public/media/hero/frames/mobile/0001.webp  …  centre crop 608×1080 (the tower, full height)
 *   public/media/hero/poster-start.webp / poster-end.webp / poster-sky.webp (+ -1280)
 *   src/lib/constants/hero-sequence.ts            generated: frame count, sizes, paths
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import ffmpegStatic from "ffmpeg-static";

/** ffmpeg-static's binary is only present when its install script ran; else use ffmpeg on PATH. */
const ffmpeg = ffmpegStatic && existsSync(ffmpegStatic) ? ffmpegStatic : "ffmpeg";

const SRC = "references/hero";
const OUT = "public/media/hero";
const FPS = 24; // working frame rate of the joined intermediate
const SEQ_FPS = 15; // frames per second of the delivered sequence
const QUALITY = 74; // WebP quality

/**
 * Current source: three AI-generated (Magnific · Seedance 2.5) start/end-frame clips, 1920×1072,
 * built from the client's keyframes start-frame.jpg → middle-frame.jpg → end-frame.jpg:
 *   build-structure.mp4  podium + core → full concrete frame, floor by floor (8 s)
 *   build-facade.mp4     concrete frame → glass facade bottom-up → lobby + window lights (8 s)
 *   camera-rise.mp4      from the facade clip's last frame (camera-start.jpg) to open sky
 *                        (camera-end-sky.jpg): push-in and tilt up the facade into the sky (8 s)
 * Each clip's first frame duplicates the previous clip's last frame, so it is skipped (1/24 s).
 * `finished` marks the segment that ends on the completed, lit tower: its end becomes
 * HERO_SEQUENCE.finishedFrame (reduced-motion still, poster-end) and the camera phase starts there.
 */
const SEGMENTS = [
  { file: "build-structure.mp4", start: 0, end: null, speed: 1 },
  { file: "build-facade.mp4", start: 1 / 24, end: null, speed: 1, finished: true },
  { file: "camera-rise.mp4", start: 1 / 24, end: null, speed: 1 },
];

/** Duration of a source clip in seconds (parsed from ffmpeg's banner; it exits 1 without output). */
const probeSeconds = (file) => {
  const { stderr } = spawnSync(ffmpeg, ["-hide_banner", "-i", path.join(SRC, file)], {
    encoding: "utf8",
  });
  const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(stderr);
  if (!m) throw new Error(`Cannot read duration of ${file}`);
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
};

/** Seconds of joined footage up to the end of the `finished` segment. */
let finishedSeconds = 0;
for (const s of SEGMENTS) {
  finishedSeconds += ((s.end ?? probeSeconds(s.file)) - s.start) / s.speed;
  if (s.finished) break;
}

const SETS = {
  desktop: { vf: "scale=1600:-2:flags=lanczos", width: 1600, height: 894 },
  // The tower sits in the centre of the frame: a full-height 9:16 crop is exactly what a phone
  // shows, at full source resolution (sharper than scaling the whole frame).
  mobile: { vf: "crop=604:1072:(iw-604)/2:0", width: 604, height: 1072 },
};

const run = (args) => execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args]);
mkdirSync(OUT, { recursive: true });

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
run([
  ...inputs,
  "-filter_complex",
  filter,
  "-map",
  "[v]",
  "-an",
  "-c:v",
  "libx264",
  "-crf",
  "10",
  "-preset",
  "medium",
  joined,
]);

// 2. Frame sequences.
const summary = {};
for (const [name, set] of Object.entries(SETS)) {
  const dir = path.join(OUT, "frames", name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  run([
    "-i",
    joined,
    "-vf",
    `fps=${SEQ_FPS},${set.vf}`,
    "-c:v",
    "libwebp",
    "-quality",
    String(QUALITY),
    path.join(dir, "%04d.webp"),
  ]);
  const frames = readdirSync(dir).filter((f) => f.endsWith(".webp"));
  const kb = frames.reduce((sum, f) => sum + statSync(path.join(dir, f)).size, 0) / 1024;
  summary[name] = { count: frames.length, kb: Math.round(kb) };
}

// 3. Posters: first frame, the finished tower, and the last frame (open sky).
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
    "72",
    path.join(OUT, `poster-start${suffix}.webp`),
  ]);
  run([
    "-ss",
    String(Math.max(0, finishedSeconds - 0.1)),
    "-i",
    joined,
    "-frames:v",
    "1",
    "-vf",
    `scale=${width}:-2`,
    "-q:v",
    "72",
    path.join(OUT, `poster-end${suffix}.webp`),
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
    "72",
    path.join(OUT, `poster-sky${suffix}.webp`),
  ]);
}
rmSync(joined);

// 4. Generated constants (frame counts must match the files on disk).
if (summary.desktop.count !== summary.mobile.count) throw new Error("Frame counts differ");
const ts = `// GENERATED by scripts/encode-hero.mjs — do not edit by hand. Re-run \`npm run media:hero\`.
import type { HeroSequence } from "@/types/sections";

export const HERO_SEQUENCE: HeroSequence = {
  count: ${summary.desktop.count},
  fps: ${SEQ_FPS},
  finishedFrame: ${Math.min(summary.desktop.count - 1, Math.floor(finishedSeconds * SEQ_FPS))},
  desktop: { dir: "/media/hero/frames/desktop", width: ${SETS.desktop.width}, height: ${SETS.desktop.height} },
  mobile: { dir: "/media/hero/frames/mobile", width: ${SETS.mobile.width}, height: ${SETS.mobile.height} },
};
`;
writeFileSync("src/lib/constants/hero-sequence.ts", ts);

for (const [name, s] of Object.entries(summary))
  console.log(`${name.padEnd(8)} ${s.count} frames, ${s.kb} KB`);

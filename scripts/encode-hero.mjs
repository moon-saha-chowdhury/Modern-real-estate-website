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
 *   public/media/hero/frames/mobile/0001.webp  …  centre crop 604×1072 (the tower, full height)
 *   public/media/hero/poster-sky.webp              blurred backdrop for the camera rise
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

/**
 * Current source: three AI-generated (Magnific · Seedance 2.5) start/end-frame clips, 1920×1072,
 * built from the client's keyframes start-frame.jpg → middle-frame.jpg → end-frame.jpg:
 *   build-structure.mp4  podium + core → full concrete frame, floor by floor (8 s)
 *   build-facade.mp4     concrete frame → glass facade bottom-up → lobby + window lights (8 s)
 *   camera-rise.mp4      from the facade clip's last frame (camera-start.jpg) to open sky
 *                        (camera-end-sky.jpg): push-in and tilt up the facade into the sky (8 s)
 * Each clip's first frame duplicates the previous clip's last frame, so it is skipped (1/24 s).
 * `finished` marks the segment that ends on the completed, lit tower: its end becomes
 * each set's finishedFrame (the reduced-motion still) and the camera phase starts there.
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

/** Seconds of joined footage in total, and up to the end of the `finished` segment. */
let totalSeconds = 0;
let finishedSeconds = 0;
for (const s of SEGMENTS) {
  totalSeconds += ((s.end ?? probeSeconds(s.file)) - s.start) / s.speed;
  if (s.finished) finishedSeconds = totalSeconds;
}

/**
 * Each set has its own frame rate and quality. The canvas cross-fades neighbouring frames, so a
 * lower rate still scrubs smoothly; phones get 10 fps at a lower quality (small screen, cellular
 * data) to stay near the 4 MB mobile media budget.
 */
const SETS = {
  desktop: { vf: "scale=1600:-2:flags=lanczos", width: 1600, height: 894, fps: 15, quality: 74 },
  // The tower sits in the centre of the frame: a full-height 9:16 crop is exactly what a phone
  // shows, at full source resolution (sharper than scaling the whole frame).
  mobile: { vf: "crop=604:1072:(iw-604)/2:0", width: 604, height: 1072, fps: 10, quality: 66 },
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
// Deband: the AI footage is 8-bit H.264, so the twilight sky carries 16 px compression blocks and
// banding that become obvious full screen. `deband` flattens the blocks, `gradfun` re-dithers the
// gradient, before the WebP encode quantises it again.
const DEBAND = "deband=1thr=0.03:2thr=0.03:3thr=0.03:range=24:blur=1,gradfun=strength=1:radius=16";
const filter = `${chains.join(";")};${labels}concat=n=${SEGMENTS.length}:v=1:a=0,fps=${FPS},format=yuv420p,${DEBAND}[v]`;
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
    `fps=${set.fps},${set.vf}`,
    "-c:v",
    "libwebp",
    "-quality",
    String(set.quality),
    path.join(dir, "%04d.webp"),
  ]);
  const frames = readdirSync(dir).filter((f) => f.endsWith(".webp"));
  const kb = frames.reduce((sum, f) => sum + statSync(path.join(dir, f)).size, 0) / 1024;
  summary[name] = { count: frames.length, kb: Math.round(kb) };
}

// 3. Sky poster: the last frame (open sky), blurred behind the camera rise. (The build-phase
//    backdrop and the server-rendered poster reuse frame 0001, so they need no extra file.)
run([
  "-sseof",
  "-0.2",
  "-i",
  joined,
  "-update",
  "1",
  "-vf",
  "scale=1920:-2",
  "-q:v",
  "72",
  path.join(OUT, "poster-sky.webp"),
]);
rmSync(joined);

// 4. Generated constants (frame counts must match the files on disk).
const setLiteral = (name) => {
  const set = SETS[name];
  const { count } = summary[name];
  const finishedFrame = Math.min(count - 1, Math.floor(finishedSeconds * set.fps));
  return `{
    dir: "/media/hero/frames/${name}",
    width: ${set.width},
    height: ${set.height},
    count: ${count},
    fps: ${set.fps},
    finishedFrame: ${finishedFrame},
  }`;
};
const ts = `// GENERATED by scripts/encode-hero.mjs — do not edit by hand. Re-run \`npm run media:hero\`.
import type { HeroSequence } from "@/types/sections";

export const HERO_SEQUENCE: HeroSequence = {
  seconds: ${totalSeconds.toFixed(3)},
  finishedSeconds: ${finishedSeconds.toFixed(3)},
  desktop: ${setLiteral("desktop")},
  mobile: ${setLiteral("mobile")},
};
`;
writeFileSync("src/lib/constants/hero-sequence.ts", ts);

for (const [name, s] of Object.entries(summary))
  console.log(`${name.padEnd(8)} ${s.count} frames, ${s.kb} KB`);

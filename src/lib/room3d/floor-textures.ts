import * as THREE from "three";
import type { FloorKey } from "@/types/room3d";

/**
 * Floors are drawn on a canvas, not loaded: three finishes, each a square that covers
 * `FLOOR_TILE` metres and repeats. A fixed sequence of random numbers makes every visit see the
 * same boards and veins.
 */
export const FLOOR_TILE = 2.4;

const SIZE = 1024;

/** A small deterministic random number generator (mulberry32). */
function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
const rgb = (r: number, g: number, b: number) => `rgb(${r} ${g} ${b})`;

function oak(ctx: CanvasRenderingContext2D) {
  const rand = random(11);
  const boards = 8;
  const board = SIZE / boards;
  for (let row = 0; row < boards; row++) {
    // Each board is a long run with a joint or two, each piece a touch lighter or darker.
    let x = -rand() * 400;
    while (x < SIZE) {
      const length = 420 + rand() * 420;
      const tone = rand();
      ctx.fillStyle = rgb(mix(176, 200, tone), mix(134, 158, tone), mix(92, 112, tone));
      ctx.fillRect(x, row * board, length, board);
      // Grain: long, faint, slightly wavering lines.
      for (let g = 0; g < 16; g++) {
        const y = row * board + rand() * board;
        ctx.strokeStyle = `rgba(90 60 30 / ${0.04 + rand() * 0.07})`;
        ctx.lineWidth = 0.6 + rand() * 1.1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
          x + length * 0.3,
          y + rand() * 5 - 2.5,
          x + length * 0.7,
          y + rand() * 5 - 2.5,
          x + length,
          y,
        );
        ctx.stroke();
      }
      // The joint at the end of the piece.
      ctx.fillStyle = "rgba(60 40 20 / 0.55)";
      ctx.fillRect(x + length - 1, row * board, 1.5, board);
      x += length;
    }
    ctx.fillStyle = "rgba(60 40 20 / 0.6)";
    ctx.fillRect(0, row * board, SIZE, 1.5);
  }
}

function travertine(ctx: CanvasRenderingContext2D) {
  const rand = random(23);
  ctx.fillStyle = rgb(217, 205, 184);
  ctx.fillRect(0, 0, SIZE, SIZE);
  const columns = 2;
  const rows = 4;
  const w = SIZE / columns;
  const h = SIZE / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tone = rand();
      ctx.fillStyle = rgb(mix(212, 226, tone), mix(199, 213, tone), mix(176, 192, tone));
      ctx.fillRect(c * w, r * h, w, h);
      // The long, pale and dark streaks that make travertine what it is.
      for (let s = 0; s < 60; s++) {
        const y = r * h + rand() * h;
        const x = c * w + rand() * w * 0.6;
        ctx.strokeStyle =
          rand() > 0.5
            ? `rgba(255 250 240 / ${0.1 + rand() * 0.2})`
            : `rgba(150 125 95 / ${0.06 + rand() * 0.12})`;
        ctx.lineWidth = 0.5 + rand() * 2.2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 60 + rand() * w * 0.7, y + rand() * 3 - 1.5);
        ctx.stroke();
      }
    }
  }
  ctx.fillStyle = "rgba(120 100 75 / 0.5)";
  for (let c = 0; c <= columns; c++) ctx.fillRect(c * w - 1, 0, 2, SIZE);
  for (let r = 0; r <= rows; r++) ctx.fillRect(0, r * h - 1, SIZE, 2);
}

function marble(ctx: CanvasRenderingContext2D) {
  const rand = random(37);
  ctx.fillStyle = rgb(238, 236, 233);
  ctx.fillRect(0, 0, SIZE, SIZE);
  const half = SIZE / 2;
  for (let q = 0; q < 4; q++) {
    const ox = (q % 2) * half;
    const oy = Math.floor(q / 2) * half;
    const tone = rand();
    ctx.fillStyle = rgb(mix(232, 244, tone), mix(230, 242, tone), mix(228, 240, tone));
    ctx.fillRect(ox, oy, half, half);
    // Veins: slow random walks, grey with an occasional warm one.
    for (let v = 0; v < 5; v++) {
      let x = ox + rand() * half;
      let y = oy + rand() * half;
      let angle = rand() * Math.PI * 2;
      ctx.strokeStyle =
        rand() > 0.8 ? `rgba(176 150 110 / 0.28)` : `rgba(120 124 130 / ${0.2 + rand() * 0.25})`;
      ctx.lineWidth = 0.6 + rand() * 1.6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let step = 0; step < 90; step++) {
        angle += (rand() - 0.5) * 0.7;
        x += Math.cos(angle) * 7;
        y += Math.sin(angle) * 7;
        ctx.lineTo(Math.min(Math.max(x, ox), ox + half), Math.min(Math.max(y, oy), oy + half));
      }
      ctx.stroke();
    }
  }
  ctx.fillStyle = "rgba(150 150 150 / 0.45)";
  ctx.fillRect(half - 1, 0, 2, SIZE);
  ctx.fillRect(0, half - 1, SIZE, 2);
}

const DRAW: Record<FloorKey, (ctx: CanvasRenderingContext2D) => void> = { oak, travertine, marble };

const cache = new Map<FloorKey, THREE.CanvasTexture>();

/** The texture of a floor finish (drawn once, shared by every room that uses it). */
export function floorTexture(key: FloorKey, anisotropy: number): THREE.CanvasTexture {
  const cached = cache.get(key);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("A 2D canvas is needed to draw the floors");
  DRAW[key](ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  cache.set(key, texture);
  return texture;
}

/** Roughness of each finish: oiled oak is soft, honed travertine matte, marble a little polished. */
export const FLOOR_ROUGHNESS: Record<FloorKey, number> = {
  oak: 0.62,
  travertine: 0.7,
  marble: 0.28,
};

import { HERO_LOAD_CONCURRENCY, HERO_LOAD_STRIDES, HERO_MEDIA } from "@/lib/constants/hero";
import type { FrameRect, HeroFrameSet } from "@/types/sections";

/** URL of frame `index` (0-based) in a set. */
export function frameUrl(set: HeroFrameSet, index: number): string {
  const n = String(index + 1).padStart(HERO_MEDIA.framePad, "0");
  return `${set.dir}/${n}.${HERO_MEDIA.frameExtension}`;
}

/**
 * Loading order: frame 0 and the last frame first, then every 8th, 4th, 2nd and finally every
 * frame, so the whole scroll range has coverage almost immediately.
 */
export function loadOrder(count: number): number[] {
  const order: number[] = [0, count - 1];
  const seen = new Set(order);
  for (const stride of HERO_LOAD_STRIDES) {
    for (let i = 0; i < count; i += stride) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  return order;
}

export interface FrameLoader {
  images: (HTMLImageElement | null)[];
  /** Nearest frame that has finished loading and decoding, searching outward from `index`. */
  nearest: (index: number) => HTMLImageElement | null;
  cancel: () => void;
}

/**
 * Loads a frame sequence progressively with limited concurrency. Each image is decoded before it
 * is marked ready, so drawing it later never blocks the main thread.
 */
export function createFrameLoader(
  set: HeroFrameSet,
  count: number,
  onReady: (index: number) => void,
  indices: number[] = loadOrder(count),
): FrameLoader {
  const images: (HTMLImageElement | null)[] = new Array(count).fill(null);
  const queue = [...indices];
  let cancelled = false;
  let active = 0;

  const next = () => {
    while (!cancelled && active < HERO_LOAD_CONCURRENCY && queue.length > 0) {
      const index = queue.shift()!;
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(set, index);
      active++;
      img
        .decode()
        .then(() => {
          if (cancelled) return;
          images[index] = img;
          onReady(index);
        })
        .catch(() => undefined)
        .finally(() => {
          active--;
          next();
        });
    }
  };
  next();

  return {
    images,
    nearest: (index) => {
      for (let d = 0; d < count; d++) {
        const before = images[index - d];
        if (before) return before;
        const after = images[index + d];
        if (after) return after;
      }
      return null;
    },
    cancel: () => {
      cancelled = true;
      queue.length = 0;
    },
  };
}

/**
 * Where to draw the frame: centred, at `scale` × the size that would cover the container.
 * scale < 1 is the static zoom-out; the uncovered edges show the sky/water backdrop.
 */
export function computeFrameRect(
  containerWidth: number,
  containerHeight: number,
  frameWidth: number,
  frameHeight: number,
  scale: number,
): FrameRect {
  const cover = Math.max(containerWidth / frameWidth, containerHeight / frameHeight);
  const width = frameWidth * cover * scale;
  const height = frameHeight * cover * scale;
  return {
    x: (containerWidth - width) / 2,
    y: (containerHeight - height) / 2,
    width,
    height,
  };
}

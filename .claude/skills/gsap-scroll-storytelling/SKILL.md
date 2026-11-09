---
name: gsap-scroll-storytelling
description: Use when implementing scroll-driven sequences with GSAP ScrollTrigger on the Meridian site, including the hero building-transformation video scrub, pinned sections and the process timeline.
---

# GSAP scroll storytelling — Meridian

## Setup (already in place)

- Import from `@/lib/animations/gsap`. It registers `ScrollTrigger` and `useGSAP` exactly once.
- Lenis (`components/layout/SmoothScroll.tsx`) runs on `gsap.ticker` and calls `ScrollTrigger.update` on scroll. Don't create other rAF loops for scrolling.

## Pattern

```tsx
"use client";
const root = useRef<HTMLDivElement>(null);
useGSAP(
  () => {
    const mm = gsap.matchMedia();
    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1024px)" },
      (ctx) => {
        if (!ctx.conditions?.motion) return; // static end state
        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            progress.current = self.progress;
          },
        });
      },
    );
    return () => mm.revert();
  },
  { scope: root },
);
```

- `useGSAP` handles cleanup. Use `gsap.matchMedia` for breakpoint and reduced-motion branches.
- Call `ScrollTrigger.refresh()` after images or video metadata load if layout height changes.

## Hero building transformation: image sequence (current implementation)

The hero no longer scrubs a <video>: seeking waited on the decoder and stuttered (~10-15 fps). It draws pre-extracted WebP frames on a <canvas> (see src/components/home/BuildingTransformation.tsx and src/lib/animations/frame-sequence.ts): progressive loading (strides 8/4/2/1), nearest-loaded-frame fallback, draw only when the frame index changes, DPR capped at 2. Rebuild frames with npm run media:hero.

## Video scrub (legacy notes)

1. `<video muted playsInline preload="auto" poster>`. Never `autoplay` and never `loop`.
2. Wait for `loadedmetadata` before reading `duration`.
3. Store ScrollTrigger progress in a ref. A single rAF loop eases `currentTime` towards `progress * duration` and only seeks when `|delta| > 1/30` and `!video.seeking`.
4. The encoding must have dense keyframes (`-g 2` or all-intra), otherwise reverse scrubbing stutters. Use the `ffmpeg-static` script.
5. Keep the final frame at progress 1. Scrolling up reverses it.
6. Fallbacks:
   - **Reduced motion:** final-frame poster, no pin.
   - **Small screens:** shorter pin with the 720p source.
   - **Load error or Save-Data:** static image.
7. If Safari/iOS seeking is janky, switch to a canvas image-sequence. Tell the user first.

## Don'ts

- No React state per scroll tick. No `scrub` on more than one pinned section in the same viewport.
- Don't pin on touch devices unless it has been tested on a real device.

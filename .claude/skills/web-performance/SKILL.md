---
name: web-performance
description: Use when adding heavy media, 3D, animation or third-party embeds to the Meridian site, or when checking Core Web Vitals, bundle size and scroll smoothness.
---

# Web performance — Meridian

## Budgets

- LCP < 2.5s on mid-range mobile. CLS < 0.05. INP < 200ms.
- Homepage JS: no three.js, no R3F, no map SDKs.
- Hero video: 720p mobile variant ≤ 4 MB and 1080p ≤ 10 MB. Poster preloaded.

## Rules

- **Images:** always `next/image` with accurate `sizes`. Only the LCP image gets `priority`. Allowed qualities are `[75, 90]` (see `next.config.ts`).
- **Server first:** components are Server Components unless they need state, effects or browser APIs. Keep `"use client"` at the leaves.
- **Cache Components:** data loaders use `'use cache'` + `cacheLife`. Synchronous IO (`new Date()`, `Math.random()`) never goes in the prerendered shell.
- **3D / heavy viewers:** load with `next/dynamic(..., { ssr: false })` from a client component, triggered by user intent (click). Never on route load.
- **Maps / iframes:** use a click-to-load facade.
- **Scroll:** no React state on scroll. One rAF loop (GSAP ticker). Use `passive` listeners. Only animate transform, opacity and clip-path.
- **Fonts:** next/font only (self-hosted). Three families, with weights limited to what's used.

## Measuring

- `npm run build`: check route sizes and that routes stay static (○) where expected.
- Use the Playwright trace / Chrome performance panel for scroll jank on the hero.
- Lighthouse (mobile) on the production build before merging M8.

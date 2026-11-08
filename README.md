# Meridian Developments

Premium architectural real-estate website for **Meridian Developments**. The visual identity is
**Midnight Forest — Architectural Luxury**.

|           |                                                                                          |
| --------- | ---------------------------------------------------------------------------------------- |
| Framework | Next.js 16.4 (App Router, Turbopack, Cache Components, Partial Prefetching)              |
| Language  | TypeScript 5 (strict)                                                                    |
| Styling   | Tailwind CSS v4: tokens in [`src/styles/tokens.css`](src/styles/tokens.css)              |
| Motion    | GSAP + ScrollTrigger (scroll storytelling), Motion for React (UI), Lenis (smooth scroll) |
| 3D        | React Three Fiber / three.js, loaded only on demand for the room tour (Milestone 6)      |
| QA        | Playwright: behavioural tests and screenshots at 1440 / 1024 / 390 px                    |

> **Next.js 16 note.** This version differs from older Next.js. Read the bundled docs in
> `node_modules/next/dist/docs/` before using an API. In particular:
> `new Date()` and other synchronous IO in server components must sit behind `'use cache'` or `<Suspense>`.
> The images config needs an `images.qualities` allowlist.
> `middleware` has been renamed to `proxy`.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script                        | Purpose                                                   |
| ----------------------------- | --------------------------------------------------------- |
| `npm run dev`                 | Development server                                        |
| `npm run build` / `npm start` | Production build / serve                                  |
| `npm run lint`                | ESLint (Next core-web-vitals + TypeScript)                |
| `npm run typecheck`           | `tsc --noEmit`                                            |
| `npm run format`              | Prettier, with Tailwind class sorting                     |
| `npm run test:e2e`            | Playwright behavioural tests (run `npm run build` first)  |
| `npm run qa:screens`          | Writes visual QA screenshots to `.artifacts/screenshots/` |

Playwright uses the locally installed Google Chrome (`channel: "chrome"`). To use the bundled Chromium instead, run `npx playwright install chromium` and set `PW_CHANNEL=""`.

## Project structure

```
src/
  app/                    Routes (App Router). Pages compose sections; no business logic here.
    styleguide/           Internal design-system reference (noindex, not in nav)
  components/
    layout/               Navbar, MobileNavigation, Footer, Providers, SmoothScroll, Wordmark
    common/               Button, Container, Section, SectionHeading, Eyebrow, TextReveal,
                          Reveal, ImageReveal, PageIntro, SampleBadge
    home/ projects/ virtual-tour/   (added in later milestones)
  data/                   Company + project content (typed). Placeholder content is flagged.
  lib/
    animations/           eases.ts (shared motion vocabulary), gsap.ts (registers plugins once)
    constants/            Site config and navigation
    utils/                cn(), nav helpers
    fonts.ts              next/font: Instrument Serif · Manrope · IBM Plex Mono
  hooks/                  useMediaQuery, usePrefersReducedMotion
  types/                  company.ts, project.ts (project data model)
  styles/tokens.css       Design tokens (colour, type scale, spacing, motion)
tests/                    Playwright: e2e/ and visual/
docs/                     Design system, asset requirements, workflow
.claude/skills/           Project-specific Claude Code skills
```

## Content integrity

This site must never present invented company information as fact.

- Records in `src/data/` carry `isPlaceholder: true` until real data replaces them.
- Any UI that renders placeholder content must show a `<SampleBadge />`.
- Stock photography (Unsplash) is marked `isSample: true` with a `credit`, and is labelled in the UI.
- Statistics, testimonials, contact details and locations stay hidden until real data is supplied.

## Documentation

- [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md): Midnight Forest tokens, typography, layout and motion rules
- [docs/ASSETS.md](docs/ASSETS.md): assets and information needed from Meridian
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md): Git branching, commits and milestone workflow
- [docs/ROADMAP.md](docs/ROADMAP.md): milestones and status

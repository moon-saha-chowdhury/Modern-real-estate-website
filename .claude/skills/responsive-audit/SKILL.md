---
name: responsive-audit
description: Use when verifying layouts on the Meridian site across large desktop, desktop, laptop, tablet and mobile, including touch, overflow and reduced-motion behaviour.
---

# Responsive audit — Meridian

## Breakpoints to check

| Width       | Device                    | Notes                                                              |
| ----------- | ------------------------- | ------------------------------------------------------------------ |
| 1920        | Large desktop             | Content capped at 1440. Check full-bleed images and edge alignment |
| 1440        | Desktop                   | Primary design width                                               |
| 1280 / 1024 | Laptop / tablet landscape | Navbar switches to mobile menu below 1024 (`lg`)                   |
| 768         | Tablet portrait           | 8-column grid                                                      |
| 390 / 360   | Mobile                    | 4-column grid, 16px gutter                                         |

## Checklist

- [ ] No horizontal scroll: `document.documentElement.scrollWidth === innerWidth`.
- [ ] Touch targets are at least 44×44px. Mobile menu links are full width.
- [ ] Headlines break well with no orphans. `text-wrap: balance` is on headings.
- [ ] Mobile compositions are intentional: reorder, crop or drop decorative elements rather than shrinking them.
- [ ] Images use correct `sizes` so mobile doesn't download desktop resolutions.
- [ ] Pinned and scrubbed sections degrade on small screens and under reduced motion.
- [ ] Mobile menu: opens, traps focus, closes on Escape and on navigation, and locks scrolling.
- [ ] Use `100svh` / `100dvh`, not `100vh`, for full-height sections.

## Tooling

- Playwright viewports in `tests/routes.ts`. Add widths there.
- Emulate reduced motion with `page.emulateMedia({ reducedMotion: "reduce" })`.

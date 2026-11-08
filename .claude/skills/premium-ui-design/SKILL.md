---
name: premium-ui-design
description: Use when designing or building any visual section, page or component for the Meridian Developments site, so it follows the Midnight Forest art direction instead of generic template patterns.
---

# Premium UI design — Meridian / Midnight Forest

Read `docs/DESIGN-SYSTEM.md` and `src/styles/tokens.css` first. Use the tokens and never hard-code hex values.

## Composition rules

1. **Asymmetry over symmetry.** Lay out on `grid-editorial` with uneven spans (7+4, 5+6 offset, 8 + 3 stacked). Use equal thirds only with a stated reason.
2. **Each section gets its own composition.** Before building, write one sentence describing the layout and check it differs from the sections either side of it.
3. **Image-led.** Photography carries the emotion. Crop deliberately: tall portrait (4:5, 3:4) against wide (16:9, 21:9). Let images bleed to one edge of the screen.
4. **Hairlines, not boxes.** Separate content with `border-line` / `border-line-light` rules and whitespace. No rounded cards, shadows, glassmorphism or gradient fills.
5. **Type does the work.** Use serif display with one italic emphasis in champagne, mono labels as annotations, and body text in mist / ink-soft.
6. **Surface rhythm.** Follow the section sequence in DESIGN-SYSTEM.md. Two adjacent sections never share a tone.
7. **Green is rare.** `brand` is only for active markers, progress lines and links on ivory. Never put brand on forest.

## Banned patterns

- Three equal icon cards. Rows of features with icons. Pill badges everywhere. Glowing buttons.
- Centred hero text over a darkened stock photo.
- Floating decorative blobs, particles, gradient meshes.
- Invented statistics, testimonials, addresses or company history (see Content integrity in README).

## Components to reach for

`Section(tone)`, `Container(grid)`, `SectionHeading`, `Eyebrow(index)`, `TextReveal(lines)`, `ImageReveal`, `Reveal`, `Button(variant, surface)`, `SampleBadge`.

## Self-check before finishing

- Would this section look at home on an international architecture studio's site?
- Remove one element. Is it better? If so, leave it out.
- Is placeholder content visibly labelled?

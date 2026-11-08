---
name: motion-design
description: Use when adding or changing any animation, transition or hover interaction on the Meridian site, to keep timing, easing and tool choice consistent and accessible.
---

# Motion design — Meridian

Motion should be purposeful, controlled and quiet. It reveals the architecture and never decorates.

## Vocabulary (src/lib/animations/eases.ts)

- Ease: `EASE_MERIDIAN` [0.22, 1, 0.36, 1]. CSS: `ease-meridian`. GSAP: `expo.out`.
- Durations: UI 0.5s · reveal 0.9s · hero 1.2s. Nothing over 1.6s except scroll-scrubbed sequences.
- Stagger: 60ms for items, 90ms between text lines.

## Which tool

| Need                                                  | Tool                                           |
| ----------------------------------------------------- | ---------------------------------------------- |
| In-view reveal, hover, menu, dialog, filter change    | Motion (`motion/react`)                        |
| Scroll-linked progress, pinning, scrubbing, timelines | GSAP + ScrollTrigger (`@/lib/animations/gsap`) |
| Simple hover colour or underline                      | CSS transitions with `ease-meridian`           |

## Rules

- Animate only `transform`, `opacity` and `clip-path`. Never animate width, height, top or left during scroll.
- Never set React state on scroll. Write to refs or data-attributes inside rAF.
- Reveal once (`viewport={{ once: true }}`). Don't replay on scroll-up, except scrubbed sequences.
- Reduced motion: `MotionConfig reducedMotion="user"` already removes transforms. GSAP code must check `usePrefersReducedMotion()` or `gsap.matchMedia()` and show the end state.
- Use one signature motion per section at most. Text mask, image mask and a stat count-up don't all go in the same viewport.
- Banned: bounce or spring overshoot on content, parallax stacks, floating elements, particle effects.

## Primitives

`TextReveal` (line masks), `ImageReveal` (clip-path open + settle), `Reveal` (fade-rise), `Button` (label roll).

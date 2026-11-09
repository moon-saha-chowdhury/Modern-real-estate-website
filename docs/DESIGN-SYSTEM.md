# Meridian Design System (light theme)

An architect's drawing set on warm paper. Light sections alternate between paper, stone and white.
Fine 1px lines echo the drafting grid. Technical mono labels read like annotations on a drawing.
**Green is used rarely**, like a surveyor's mark. **Bronze** (a deep champagne) is the editorial
highlight. Photography carries the emotion and the interface stays quiet.

The site switched from the original dark "Midnight Forest" scheme to this light theme at the
client's request. The palette keeps the same brand colours; only the surfaces changed.

Source of truth: [`src/styles/tokens.css`](../src/styles/tokens.css). Live reference: `/styleguide` (noindex).

## Colour

### Palette

| Token                                    | Hex     | Use                                                          |
| ---------------------------------------- | ------- | ------------------------------------------------------------ |
| `paper`                                  | #F1EFE7 | Primary background                                           |
| `stone`                                  | #E7E1D5 | Alternate sections                                           |
| `white`                                  | #FFFFFF | Alternate sections, form panels                              |
| `ink`                                    | #101713 | Primary text, primary buttons                                |
| `ink-soft`                               | #4A5249 | Secondary text                                               |
| `bronze`                                 | #6E5D3B | Eyebrows and emphasis (deep champagne)                       |
| `brand`                                  | #337418 | Marks, progress lines, focus ring, links on paper/white      |
| `sage`                                   | #647C62 | Decorative / large type only                                 |
| `rule-light`                             | #D6D0C2 | Hairlines                                                    |
| `rule-strong`                            | #8C877C | Form field underlines                                        |
| `forest`                                 | #1E3027 | Primary button hover; optional dark band                     |
| `champagne`, `ivory`, `mist`, `obsidian` |         | Dark surfaces only (labels over photos, optional dark bands) |

### Semantic colours (use these in components)

| Utility                   | Light surface                | Dark surface                 |
| ------------------------- | ---------------------------- | ---------------------------- |
| `text-fg`                 | ink                          | ivory                        |
| `text-fg-muted`           | ink-soft                     | mist                         |
| `text-accent`             | bronze                       | champagne                    |
| `border-rule` / `bg-rule` | rule-light                   | line-dark                    |
| `bg-surface`              | the section's own background | the section's own background |
| `text-danger`             | danger-ink                   | danger-light                 |

They resolve from the nearest `data-surface` ("light" by default; "dark" and "blue" also exist). The **blue** surface is the hero: white text, `sky-mist` #D6E2F0 muted text and `champagne-light` #EAE3CF accents, all at least 4.9:1 over the video. The navbar switches to blue while over the hero. `Section` sets it from its `tone`,
so components never hard-code a theme.

### Contrast rules (computed, WCAG 2.2)

| On    | ink  | ink-soft | bronze | brand   | sage |
| ----- | ---- | -------- | ------ | ------- | ---- |
| paper | 15.8 | 7.0      | 5.5    | 5.0     | 4.0  |
| stone | 14.0 | 6.2      | 4.9    | **4.4** | 3.5  |
| white | 18.2 | 8.1      | 6.4    | 5.8     | 4.6  |

- Small text uses ink, ink-soft or bronze only. Never put small text at reduced opacity.
- `brand` is not a text colour on stone (4.4:1). Use it there only for marks.
- Form underlines use `rule-strong` on white panels (3.6:1, meets the 3:1 non-text rule).
- Labels on photographs keep a dark chip (`bg-obsidian/75 text-ivory`), since photos vary.

### Section sequence (homepage)

| Section      | Tone                                                      |
| ------------ | --------------------------------------------------------- |
| Hero         | full-bleed blue video, `data-surface="blue"` (white text) |
| Intro        | paper                                                     |
| Projects     | white                                                     |
| Expertise    | stone                                                     |
| Stats        | paper                                                     |
| Process      | white                                                     |
| Why Meridian | stone                                                     |
| Testimonials | paper                                                     |
| Contact      | stone (form on a white panel)                             |
| Footer       | paper, with a top rule                                    |

## Typography

| Role    | Font                                                    | Utility                                         |
| ------- | ------------------------------------------------------- | ----------------------------------------------- |
| Display | Google Sans Flex (variable: `opsz`, `slnt`), weight 340 | `font-display text-display-{xl,lg,md,sm}`       |
| Body    | Manrope (variable)                                      | `text-lead`, `text-body`, `text-small`          |
| Labels  | IBM Plex Mono 400/500                                   | `label-mono` (11px, uppercase, 0.14em tracking) |

- Emphasis is `<em>`: a −10° slant (`slnt` axis; the family has no italic) at weight 300, in bronze (`text-accent`). Use it at most once per heading.
- Break heading lines deliberately: pass `lines={["Line one", "line *two*"]}` to `TextReveal` / `SectionHeading`. Asterisks mark the emphasised words.
- Only the hero uses `display-xl`. Page openers use `display-lg` and section headings use `display-md`.
- Cap body measure near 70ch (`max-w-prose`).

## Layout

- `Container`: max 1440px with fluid gutters (`px-gutter`, 16 → 48px).
- `grid-editorial`: 4 / 8 / 12 columns. Prefer asymmetric spans (e.g. 7 + 4 with a 1-column gap) over equal thirds.
- `Section`: `tone` sets surface and text colour, plus `data-surface` / `data-tone`. Default padding is `py-section` (96 → 192px).
- Corners are square (0–2px). There are no pill shapes, glassmorphism or drop shadows.

## Motion

|           | Value                                                                                      |
| --------- | ------------------------------------------------------------------------------------------ |
| Ease      | `cubic-bezier(0.22, 1, 0.36, 1)`: CSS `ease-meridian`, JS `EASE_MERIDIAN`, GSAP `expo.out` |
| Durations | UI 0.5s · reveal 0.9s · hero 1.2s                                                          |
| Stagger   | 60ms (90ms between text lines)                                                             |

Primitives:

- `TextReveal` masks text and reveals it line by line.
- `ImageReveal` opens a clip-path inset while the image settles from a 1.12 scale.
- `Reveal` handles quiet fade-ups.

Tool choice:

- Use **GSAP + ScrollTrigger** for scroll-linked storytelling: the hero building, the process timeline and pinning.
- Use **Motion** for UI state and in-view reveals.
- Lenis and ScrollTrigger share GSAP's ticker.

Reduced motion:

- `MotionConfig reducedMotion="user"` removes transforms.
- Lenis is disabled.
- CSS transitions drop to ~0ms.

Never animate layout properties during scroll.

## Buttons

`Button` takes `variant`: `primary` | `outline` | `text`, and `surface`: `dark` | `light`.

- Labels use mono uppercase.
- On hover the label rolls vertically and the arrow nudges diagonally.
- Height is 48px, or 40px in the navbar.

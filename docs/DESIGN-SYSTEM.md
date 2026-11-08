# Midnight Forest — Design System

An architect's drawing set at night. Dark sections alternate with warm ivory "paper" sections.
Fine 1px lines echo the drafting grid. Technical mono labels read like annotations on a drawing.
**Green is used rarely**, like a surveyor's mark. **Champagne** is the editorial highlight.
Photography carries the emotion and the interface stays quiet.

Source of truth: [`src/styles/tokens.css`](../src/styles/tokens.css). Live reference: `/styleguide` (noindex).

## Colour

| Token                    | Hex     | Use                                                           |
| ------------------------ | ------- | ------------------------------------------------------------- |
| `obsidian`               | #101713 | Primary dark: hero, projects, stats, contact                  |
| `forest`                 | #1E3027 | Expertise, testimonials                                       |
| `charcoal`               | #141914 | Footer, trust section, image placeholders                     |
| `sage`                   | #647C62 | Decorative / large type only (4.0:1 on obsidian)              |
| `brand`                  | #337418 | Accent: active marks, progress lines, focus on light surfaces |
| `champagne`              | #C2B99F | Slanted emphasis, numerals, eyebrows on dark                  |
| `ivory`                  | #F1EFE7 | Light sections; primary text on dark                          |
| `mist`                   | #A5AAA1 | Secondary text on dark                                        |
| `line`                   | #303A32 | Hairlines on dark                                             |
| `line-light`, `ink-soft` | derived | Hairlines / secondary text on ivory                           |

### Contrast rules (computed, WCAG 2.2)

- Body text on dark surfaces uses ivory (15.8), champagne (9.3) or mist (7.7) only.
- `brand` on obsidian is 3.2:1, which is fine for non-text marks and large type. **Never put `brand` on `forest` (2.4:1).**
- `brand` on ivory is 5.0:1, which is fine for links and text.
- The focus ring is brand green by default and champagne inside `[data-surface="dark"]`.

### Section sequence (homepage)

| Section      | Surface  |
| ------------ | -------- |
| Hero         | obsidian |
| Intro        | ivory    |
| Projects     | obsidian |
| Expertise    | forest   |
| Stats        | obsidian |
| Process      | ivory    |
| Why Meridian | charcoal |
| Testimonials | forest   |
| Contact      | obsidian |
| Footer       | charcoal |

## Typography

| Role    | Font                                                    | Utility                                         |
| ------- | ------------------------------------------------------- | ----------------------------------------------- |
| Display | Google Sans Flex (variable: `opsz`, `slnt`), weight 340 | `font-display text-display-{xl,lg,md,sm}`       |
| Body    | Manrope (variable)                                      | `text-lead`, `text-body`, `text-small`          |
| Labels  | IBM Plex Mono 400/500                                   | `label-mono` (11px, uppercase, 0.14em tracking) |

- Emphasis is `<em>`: a −10° slant (`slnt` axis; the family has no italic) at weight 300, in champagne on dark. Use it at most once per heading.
- Break heading lines deliberately: pass `lines={[…]}` to `TextReveal` / `SectionHeading`.
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

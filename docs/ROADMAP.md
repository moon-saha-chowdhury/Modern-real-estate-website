# Roadmap

| #   | Milestone                                       | Branch                              | Status                                                                   |
| --- | ----------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| 0   | Audit & plan                                    | n/a                                 | ✅ Approved                                                              |
| 1   | Foundation & design system                      | `feature/project-foundation`        | ✅ Merged (PR #1)                                                        |
| 2   | Homepage                                        | `feature/homepage`                  | 🔄 In review                                                             |
| 3   | Building transformation (scroll-scrubbed video) | `feature/building-scroll-animation` | 🔄 In review                                                             |
| 4   | Project portfolio                               | `feature/projects-portfolio`        | ⏳                                                                       |
| 5   | Project details                                 | `feature/project-details`           | ✅ Sections render only with data                                        |
| 6   | Virtual room tour                               | `feature/virtual-room-tour`         | ◐ Pilot: illustrative rooms for The Linden; needs real renders or photos |
| 7   | About, Expertise, Contact                       | `feature/about-contact`             | ⏳                                                                       |
| 8   | Final optimisation                              | `feature/responsive-optimization`   | ⏳                                                                       |

## Decisions

- **Hero (M3):** full-bleed scroll-scrubbed **image sequence on a canvas** (183 WebP frames, 15 fps; desktop 1600px 13.5 MB, mobile tall crop 608x1080 7.4 MB, loaded progressively). Replaced the <video> approach, which stuttered because every seek waits on the decoder. Source: start.mp4 + end.mp4 (3D CGI blue-hour glass tower). Static zoom-out (86% desktop / 94% mobile) with feathered edges over a blurred copy of the final frame; no zoom animation; the title never moves (left of the tower on desktop). The hero is a "blue" surface on an otherwise light site.
- **Theme:** the whole site moved from dark (Midnight Forest) to a light theme at the client's request. Components use semantic colour tokens (text-fg, text-accent, border-rule, bg-surface) that resolve per surface.

- **Fonts:** Google Sans Flex (display, replaced Instrument Serif at the client's request), Manrope (body) and IBM Plex Mono (labels).
- **Code organisation:** no constants or types in `.tsx` files. Props types go in `src/types/`, constants in `src/lib/constants/` and animation presets in `src/lib/animations/presets.ts`. Route `metadata` values live in `lib/constants/metadata.ts` and pages re-export them, because Next.js requires that export.
- **Skills:** `apple-design` (Emil Kowalski, github.com/emilkowalski/skills @ c8a7962) installed in `.claude/skills/`. Where it conflicts with the master prompt (for example translucent glass chrome), the master prompt wins.
- **Skills:** `awwwards-animations` (github.com/devmartinese/awwwards-animations-skill @ c92d00b) installed as an animation technique reference. Its glitch, brutalist, bouncy and parallax patterns are excluded by the brief.
- **Sample imagery:** Unsplash, credited and labelled as samples until real photography arrives.
- **Video encoding:** `ffmpeg-static`, added in M3.
- **Structure:** follows the master prompt's §15, plus `actions/`, `lib/data/` and a split `virtual-tour/` folder.
- **Default branch:** `main`, which replaces `master`.

# Roadmap

| #   | Milestone                                       | Branch                              | Status               |
| --- | ----------------------------------------------- | ----------------------------------- | -------------------- |
| 0   | Audit & plan                                    | n/a                                 | ✅ Approved          |
| 1   | Foundation & design system                      | `feature/project-foundation`        | 🔄 In review         |
| 2   | Homepage                                        | `feature/homepage`                  | ⏳                   |
| 3   | Building transformation (scroll-scrubbed video) | `feature/building-scroll-animation` | ⏳ Needs video       |
| 4   | Project portfolio                               | `feature/projects-portfolio`        | ⏳                   |
| 5   | Project details                                 | `feature/project-details`           | ⏳                   |
| 6   | Virtual room tour                               | `feature/virtual-room-tour`         | ⏳ Needs tour assets |
| 7   | About, Expertise, Contact                       | `feature/about-contact`             | ⏳                   |
| 8   | Final optimisation                              | `feature/responsive-optimization`   | ⏳                   |

## Decisions

- **Fonts:** Google Sans Flex (display, replaced Instrument Serif at the client's request), Manrope (body) and IBM Plex Mono (labels).
- **Code organisation:** no constants or types in `.tsx` files. Props types go in `src/types/`, constants in `src/lib/constants/` and animation presets in `src/lib/animations/presets.ts`. Route `metadata` values live in `lib/constants/metadata.ts` and pages re-export them, because Next.js requires that export.
- **Skills:** `apple-design` (Emil Kowalski, github.com/emilkowalski/skills @ c8a7962) installed in `.claude/skills/`. Where it conflicts with the master prompt (for example translucent glass chrome), the master prompt wins.
- **Sample imagery:** Unsplash, credited and labelled as samples until real photography arrives.
- **Video encoding:** `ffmpeg-static`, added in M3.
- **Structure:** follows the master prompt's §15, plus `actions/`, `lib/data/` and a split `virtual-tour/` folder.
- **Default branch:** `main`, which replaces `master`.

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

- **Fonts:** Instrument Serif, Manrope and IBM Plex Mono.
- **Sample imagery:** Unsplash, credited and labelled as samples until real photography arrives.
- **Video encoding:** `ffmpeg-static`, added in M3.
- **Structure:** follows the master prompt's §15, plus `actions/`, `lib/data/` and a split `virtual-tour/` folder.
- **Default branch:** `main`, which replaces `master`.

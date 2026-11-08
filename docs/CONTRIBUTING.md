# Workflow

## Branching

- `main` is stable. Every milestone merges here after review and approval.
- Each milestone gets a feature branch cut from the latest `main`:

| Branch                              | Milestone                                                   |
| ----------------------------------- | ----------------------------------------------------------- |
| `feature/project-foundation`        | M1: config, tokens, fonts, layout, docs, skills, QA tooling |
| `feature/design-system`             | M1 refinements (if split out)                               |
| `feature/homepage`                  | M2                                                          |
| `feature/building-scroll-animation` | M3                                                          |
| `feature/projects-portfolio`        | M4                                                          |
| `feature/project-details`           | M5                                                          |
| `feature/virtual-room-tour`         | M6                                                          |
| `feature/about-contact`             | M7 (About, Expertise, Contact)                              |
| `feature/responsive-optimization`   | M8                                                          |

- Keep each branch to its own milestone. Fixes go on `fix/<topic>` and maintenance on `chore/<topic>`.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat(nav): …`, `fix(hero): …`, `chore: …`, `docs: …`, `test: …`.

## Definition of done (every milestone)

1. `npm run lint`, `npm run typecheck` and `npm run build` all pass.
2. `npm run test:e2e` passes.
3. `npm run qa:screens`: review the screenshots at 1440, 1024 and 390 and make **at least two visual refinement passes**.
4. Reduced-motion and keyboard checks pass.
5. Docs are updated (README, ROADMAP and, if tokens changed, DESIGN-SYSTEM).
6. The milestone report is delivered and approved before merging to `main`.

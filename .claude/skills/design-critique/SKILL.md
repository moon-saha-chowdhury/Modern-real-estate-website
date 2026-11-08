---
name: design-critique
description: Use after building or changing UI on the Meridian site to critique real browser screenshots against the Midnight Forest direction and produce concrete refinements. Required at least twice per milestone.
---

# Design critique — Meridian

Never judge from source code. Look at real renders.

## Steps

1. `npm run build`, then `npm run qa:screens`. This writes `.artifacts/screenshots/<route>-<1440|1024|390>[-fold].png`.
2. Open the fold and full-page images with the Read tool, for each changed route at all three widths.
3. Score each section 1–5 on: identity · typography · spacing · composition · imagery · hierarchy · colour · responsiveness.
4. For anything below 4, write a **specific** fix: what, where and why. "Improve spacing" is not specific. "Reduce gap between eyebrow and H1 from 40px to 24px at 390px; the label floats" is.
5. Apply the fixes, recapture and compare. Repeat. Two passes minimum.

## Questions to ask

- Does this look like a bespoke architecture brand, or a template?
- Is there one clear focal point per viewport?
- Do line breaks in headlines read well at all three widths? Watch for orphans and one-word lines.
- Is anything the same size as its neighbour without a reason?
- Does mobile have its own composition, or is it just a stacked desktop?
- Is any green used where champagne or ivory would be quieter?
- Is any placeholder content unlabelled?

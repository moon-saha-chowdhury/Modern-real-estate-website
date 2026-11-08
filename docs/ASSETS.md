# Assets & information required from Meridian Developments

Nothing in this list will be invented. Until an item arrives, the related UI is hidden or shows a labelled placeholder.

## Signature hero (Milestone 3)

- [ ] **Building transformation video**: the original 8-second Veo export at the highest quality available.
  - State whether it has a real alpha channel. If it does, also supply an HEVC-with-alpha `.mov`, because Safari can't play transparent WebM.
  - State the background colour of the video frame.
  - We re-encode it with dense keyframes (MP4 H.264 + WebM VP9, 1080p and 720p) using `ffmpeg-static` so it can follow scrolling smoothly, and extract the first and last frames as poster images.

## Brand

- [ ] Logo (SVG, light and dark versions) and a favicon source
- [ ] Confirmation of the name, tagline and brand description

## Projects (one set per project)

- [ ] Name, location/address, category (residential/commercial) and status (upcoming/ongoing/completed)
- [ ] Description, land area, floors, units, apartment sizes, completion info and architect
- [ ] Hero image and gallery (exterior, interior, lobby, amenities, construction progress): JPG/WebP, at least 2400px on the long edge
- [ ] Floor plans: PNG/SVG for display and PDF for download, with beds, baths and sq ft for each type
- [ ] Amenities list
- [ ] Map coordinates, nearby landmarks and transport
- [ ] Brochure PDF and sales contact
- [ ] **Room tour** (pick one):
  - an equirectangular panorama JPG, 2:1 ratio, at least 6000×3000, one per room
  - a GLB/glTF model, Draco-compressed, at most 15 MB
  - a Matterport model ID

## Company

- [ ] Overview, vision, mission, philosophy and values
- [ ] Leadership: names, roles, portraits and short bios
- [ ] Company journey / milestones (dates)
- [ ] **Real statistics**: completed projects, total developments, built-up area, years of experience
- [ ] Testimonials and partner logos, with permission to publish
- [ ] Office address, phone, email, office hours and social profile URLs
- [ ] Privacy policy and terms text

## Operations

- [ ] Where enquiries should go (email address) and the preferred email provider (e.g. Resend)
- [ ] Production domain

## Interim sample photography

Until real photography arrives we use Unsplash images under the Unsplash License.

- Each image is credited to its photographer (`credit` field) and flagged `isSample: true`.
- Each is visibly labelled as a sample in the UI.

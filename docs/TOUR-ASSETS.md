# 360° tour: images, rules and the data contract

How a project gets a "look around the room" tour, what the content team must provide, and what the
admin screen has to collect. The tour is **images only**: one 360° panorama per room, no video.

## What a 360° image is (and is not)

A 360° panorama is a single flat image that shows everything around one spot, stretched so it can
be wrapped inside a sphere ("equirectangular"). It is exactly **twice as wide as it is tall (2:1)**.

An ordinary photograph cannot be turned into a 360° view. It shows only one side of the room.
The gallery photographs are ordinary photographs and stay in the gallery.

## Where 360° images come from

| Source                                         | Notes                                                                                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Architect's / visualiser's render              | Export a 360° panorama (equirectangular) from V-Ray, Enscape, Twinmotion, Lumion or Blender, one per room. Best for unbuilt projects. |
| 360° camera (Insta360, Ricoh Theta or similar) | One shot per room, from a tripod. Best for built flats.                                                                               |
| AI-generated                                   | Only for illustrative samples. Always labelled "Illustrative tour". Rooms generated separately do not match each other.               |

## Shooting or exporting a room

- Stand (or place the camera) in the **middle of the room, about 1.5 m above the floor**, level.
- Lights on, curtains open, doors to the next room open, **no people**, one time of day for the whole flat.
- Export **8192×4096 px, JPEG, sRGB** (4096×2048 is the minimum we like). Keep the file under 80 MB.
- Hide or paint out the tripod at the bottom of the image.
- One image per room. Name them by room: `living.jpg`, `master-bedroom.jpg`.

## What the system checks

`PANORAMA_RULES` in `src/lib/constants/tour.ts`:

| Rule   | Value                                                                   |
| ------ | ----------------------------------------------------------------------- |
| Format | JPEG, PNG, WebP or TIFF                                                 |
| Shape  | 2:1 (within 2%)                                                         |
| Width  | at least 2048 px (8192 recommended, warns below 4096); at most 16384 px |
| Size   | at most 80 MB                                                           |
| Seam   | warns when the left and right edges do not meet                         |
| Output | `name.webp` (4096 px, desktop) and `name-2k.webp` (2048 px, phones)     |

The messages are written for the person uploading ("An ordinary photo cannot be turned into a 360°
view") by `validatePanorama`.

## Adding a tour by hand today

```bash
# 1. Check a file (writes nothing)
npm run media:panorama -- raw/living.jpg x x --check

# 2. Prepare it: 4096 and 2048 px WebP, plus a flat poster of the view people see first
npm run media:panorama -- raw/living.jpg public/media/tour/<project> living --poster -8,-6,100

# AI-generated panoramas also need --seam (makes the left and right edges meet)
```

Then add the room to the project in `src/data/projects.ts` (see `sample-the-linden`).

**Hotspot angles** come from a pixel position `(x, y)` in a panorama of size `W × H`:
`yaw = (x / W − 0.5) × 360`, `pitch = (0.5 − y / H) × 180`.

## The data an admin screen collects

Defined and checked by `tourSchema` / `validateTour` in `src/lib/validation/tour.ts`. A record that
passes renders as it is.

| Field                        | Meaning                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| `scenes[].id`                | Short lowercase name used in links: `master-bedroom`. Unique in the tour.             |
| `scenes[].label`             | Name shown on the room button: "Master bedroom" (40 characters).                      |
| `scenes[].src` / `srcMobile` | The prepared 4096 px and 2048 px panorama files.                                      |
| `scenes[].initialYaw`        | Direction the visitor faces on arrival (−180 to 180).                                 |
| `scenes[].description`       | One or two sentences: shown as a caption and read to screen readers (200 characters). |
| `scenes[].hotspots[]`        | "Go to" links: target room, label, `yaw`, `pitch`. Up to 8 per room.                  |
| `scenes[].mapPoint`          | Where the room sits on the floor plan, 0–100% across and down.                        |
| `plan`                       | Optional light-lined floor plan for the mini-map (needs a `mapPoint` on every room).  |
| `poster`                     | A flat (ordinary) image shown before the tour is entered, with alt text.              |
| `isIllustrative`             | True when the rooms are not the real building (shows "Illustrative tour").            |

## Upload flow for the admin

1. **`inspectPanorama(file, PANORAMA_RULES)`** on upload: show `errors` (block the upload) and
   `warnings` (let the admin continue). The `seamScore` is about 1 for a panorama that wraps.
2. **`preparePanorama(file, PANORAMA_RULES, { seam })`** returns the two WebP files to store.
3. **`renderFlatView(file, { yaw, pitch, hFov, width, height })`** makes the poster; let the admin
   pick the direction in the viewer, default it to the room's `initialYaw`.
4. Save the record only if **`validateTour(tour).ok`**; show `issues` (each has a `path` and a
   plain message) next to the field they belong to.

`src/lib/tour/*` needs `sharp` (a native module): call it from a Node-runtime route handler or
server action, not from the Edge runtime, and cap the upload size. A 8192×4096 panorama takes
about 100 MB of memory while it is processed.

## If a project has no 360° images

The tour section simply does not render, and the gallery and floor plans carry the page. Nothing
else needs to change.

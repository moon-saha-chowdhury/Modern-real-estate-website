import { EXPLORER_UNIT_BACKDROP } from "./explorer";

/** The hero's scroll film: building by day, its floors splitting apart, the plan, then a room. */
export const REEL_HERO = {
  /** Height of the scroll track, in viewport heights. */
  trackVh: 460,
  /** Scroll progress (0–1) at which each moment is reached. */
  stops: { split: 0.08, apart: 0.34, exploded: 0.44, plan: 0.58, zoom: 0.78, room: 0.88 },
  /** The building is cut into this many horizontal bands that slide apart. */
  slices: 8,
  /** The building's box on the still, as fractions of it: only this part is cut into bands. */
  buildingBox: { top: 0.1, bottom: 0.95, left: 0.09, right: 0.74 },
  /** How far the outermost band travels, as a fraction of the viewport height. */
  sliceTravel: 0.22,
  planBackdrop: EXPLORER_UNIT_BACKDROP,
  images: {
    building: {
      src: "/media/hero/building-day.webp",
      alt: "An eight-storey residence of travertine and glass with planted terraces, in morning light.",
    },
    exploded: {
      src: "/media/hero/building-exploded.webp",
      alt: "The building's floors lifted apart on black, each slab with its glass and terrace.",
    },
    plan: {
      src: "/media/explorer/residence-a.webp",
      alt: "Cutaway view of a three-bedroom residence: living room, kitchen, bedrooms, bathroom and balcony.",
    },
  },
  copy: {
    scroll: "Scroll to explore",
    buildingLabel: "Meridian Residences",
    planLabel: "Explore the floor",
    planNote: "Sample residence · Residence A",
    exitTour: "Back to the plan",
  },
} as const;

/** The hero's scroll film: building by day, its floors apart, the plan in clay, then a room. */
export const REEL_HERO = {
  /** Height of the scroll track, in viewport heights. */
  trackVh: 420,
  /** Scroll progress (0–1) at which each stage is fully in view. */
  stops: { exploded: 0.28, plan: 0.52, zoom: 0.74, room: 0.84 },
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
      src: "/media/hero/plan-clay.webp",
      alt: "A three-bedroom residence as a white clay model on black: living room, kitchen, bedrooms, bathroom and balcony.",
    },
  },
  copy: {
    scroll: "Scroll to explore",
    buildingLabel: "Meridian Residences",
    planLabel: "Explore the floor",
    planNote: "Sample plan, Residence A",
    roomNote: "Sample residence · AI-generated imagery",
    back: "Back to the plan",
    exitTour: "Back to the plan",
  },
} as const;

import type { TowerGeometry } from "@/types/explorer";

/** The hero's tower explorer: one still of the finished tower, with its floors made selectable. */
export const EXPLORER_TOWER = {
  src: "/media/explorer/building.webp",
  width: 2560,
  height: 1428,
  alt: "A four-storey residence of travertine, oak slats and glass with planted balconies, in daylight among trees.",
} as const;

/** The building's four floors on the still (the roof pergola is outside them). */
export const EXPLORER_GEOMETRY: TowerGeometry = {
  left: 0.23,
  right: 0.77,
  edges: [0.877, 0.75, 0.573, 0.392, 0.205],
};

/** Number of the lowest floor. */
export const EXPLORER_FIRST_LEVEL = 1;

/** How far the camera pushes into a floor before the residence appears. */
export const EXPLORER_ZOOM = 2.2;

/** How far the camera pushes into a room of the cutaway before its 360° view appears. */
export const EXPLORER_ROOM_ZOOM = 2.6;

export const EXPLORER_COPY = {
  hintHover: "Hover a floor to explore",
  hintTap: "Tap a floor to explore",
  sample: "Illustrative concept · sample figures",
  back: "Back to building",
  request: "Request floor plan",
  design: "Design this residence",
  roomHint: "Choose a room to step inside",
  exitRoom: "Back to residence",
} as const;

/** The cutaway render's own background colour, so the image has no visible edge. */
export const EXPLORER_UNIT_BACKDROP = "#101b2f";

/**
 * The flight between the tower and the residence: an AI-generated clip (and its reverse), played
 * over the hero on landscape screens. Portrait screens and reduced motion keep the plain push.
 */
export const EXPLORER_CLIPS = {
  query: "(min-aspect-ratio: 1/1) and (prefers-reduced-motion: no-preference)",
  enter: "/media/explorer/clips/building-to-residence",
  leave: "/media/explorer/clips/residence-to-building",
  /** The views swap underneath this long after the clip starts (it has faded in by then). */
  swapAfterMs: 400,
  /** If a clip never finishes (stalled download), carry on without it. */
  timeoutMs: 14000,
} as const;

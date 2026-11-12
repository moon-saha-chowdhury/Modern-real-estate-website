import type { TowerGeometry } from "@/types/explorer";

/** The hero's tower explorer: one still of the finished tower, with its floors made selectable. */
export const EXPLORER_TOWER = {
  src: "/media/explorer/tower.webp",
  width: 2752,
  height: 1536,
  alt: "A glass residential tower at dusk beside the water, its lobby and a few windows lit.",
} as const;

/** The band of residential floors on the still (the podium and the roof pavilion are outside it). */
export const EXPLORER_GEOMETRY: TowerGeometry = {
  left: 0.398,
  right: 0.602,
  top: 0.127,
  bottom: 0.685,
};

/** Lowest residential level (the podium holds the lobby). */
export const EXPLORER_FIRST_LEVEL = 2;

/** How far the camera pushes into a floor before the residence appears. */
export const EXPLORER_ZOOM = 3.4;

/** How far the camera pushes into a room of the cutaway before its 360° view appears. */
export const EXPLORER_ROOM_ZOOM = 2.6;

export const EXPLORER_COPY = {
  hintHover: "Hover a floor to explore",
  hintTap: "Tap a floor to explore",
  sample: "Illustrative concept · sample figures",
  back: "Back to tower",
  request: "Request floor plan",
  roomHint: "Choose a room to step inside",
  exitRoom: "Back to residence",
} as const;

/** The cutaway render's own background colour, so the image has no visible edge. */
export const EXPLORER_UNIT_BACKDROP = "#101b2f";

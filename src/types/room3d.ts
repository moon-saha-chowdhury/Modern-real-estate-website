/** Where a piece of furniture comes from (kept for the record; CC0 needs no credit). */
export interface FurnitureSource {
  name: string;
  url: string;
  author: string;
  license: "CC0" | "CC-BY" | "Purchased" | "Generated";
  /** The credit line the licence requires (CC-BY), shown on the page that uses the model. */
  credit?: string;
}

export type FurnitureCategory = "seating" | "beds" | "tables" | "storage" | "decor" | "lighting";

/** One piece in the room designer's catalogue. */
export interface FurnitureItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  /** Compressed GLB (meshopt geometry, WebP textures), in metres, Y up. */
  file: string;
  /** Multiplier that brings the model to real-world metres (1 when it already is). */
  scale?: number;
  /** Height of its lowest point above the floor, for something that hangs (a pendant lamp). */
  elevation?: number;
  source: FurnitureSource;
}

/* ---------- The residence's plan (metres, x to the east, z to the south) ---------- */

export type FloorKey = "oak" | "travertine" | "marble";

/** A doorway or a window cut into a wall. */
export interface PlanOpening {
  kind: "door" | "window";
  /** Distance along the wall from its start (the lower coordinate), in metres. */
  at: number;
  width: number;
  height: number;
  /** Height of the bottom edge above the floor. */
  sill: number;
}

/**
 * An axis-aligned wall. `a` is the room on its lower-coordinate side (north of a wall that runs
 * east–west, west of one that runs north–south) and `b` the room on the other side; "outside"
 * is the street or the balcony. Each face is painted with its own room's colour.
 */
export interface PlanWall {
  id: string;
  from: readonly [number, number];
  to: readonly [number, number];
  thickness: number;
  a: string;
  b: string;
  openings?: readonly PlanOpening[];
}

export interface PlanRoom {
  id: string;
  label: string;
  /** Top-left corner and size of the floor. */
  x: number;
  z: number;
  width: number;
  depth: number;
  floor: FloorKey;
  /** The room's walls and floor can be restyled (the balcony's cannot). */
  styleable: boolean;
}

/** A glass balustrade along the edge of the balcony. */
export interface PlanBalustrade {
  from: readonly [number, number];
  to: readonly [number, number];
}

export interface ResidencePlan {
  id: string;
  name: string;
  wallHeight: number;
  rooms: readonly PlanRoom[];
  walls: readonly PlanWall[];
  balustrades: readonly PlanBalustrade[];
  /** The whole floor, balcony included: furniture stays inside it. */
  bounds: { x: number; z: number; width: number; depth: number };
  /** The default arrangement of furniture. */
  layout: readonly PlacedFurniture[];
}

/* ---------- The visitor's design ---------- */

/** One piece of furniture in the room. `rotation` is a quarter-turn count (0–3). */
export interface PlacedFurniture {
  uid: string;
  itemId: string;
  x: number;
  z: number;
  rotation: number;
}

export interface WallFinish {
  key: string;
  label: string;
  color: string;
}

export interface FloorFinish {
  key: FloorKey;
  label: string;
}

/** A starting look: one wall colour for the living spaces and bedrooms, one floor. */
export interface Mood {
  id: string;
  label: string;
  note: string;
  wall: string;
  floor: FloorKey;
}

/** The finishes chosen per room (room id → finish key). */
export interface DesignFinishes {
  walls: Record<string, string>;
  floors: Record<string, FloorKey>;
}

export type DesignerView = "dollhouse" | "top";

export type DesignerTab = "furniture" | "finishes" | "moods";

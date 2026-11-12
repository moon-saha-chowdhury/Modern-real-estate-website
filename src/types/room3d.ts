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
  source: FurnitureSource;
}

/** Where a piece of furniture comes from (kept for the record; CC0 needs no credit). */
export interface FurnitureSource {
  name: string;
  url: string;
  author: string;
  license: "CC0" | "CC-BY" | "Purchased" | "Generated";
}

export type FurnitureCategory = "seating" | "tables" | "storage" | "decor" | "lighting";

/** One piece in the room designer's catalogue. */
export interface FurnitureItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  /** Compressed GLB (meshopt geometry, WebP textures), in metres, Y up. */
  file: string;
  source: FurnitureSource;
}

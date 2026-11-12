import type { PanoramaScene } from "./project";

/** A room marked on a residence cutaway (the hero's tower explorer). */
export interface ResidenceRoom {
  /** Also the id of the room's 360° scene. */
  id: string;
  label: string;
  note: string;
  /** Hotspot position as a fraction of the cutaway image (0–1). */
  x: number;
  y: number;
}

/** A residence type shown as an isometric cutaway. */
export interface Residence {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  summary: string;
  image: { src: string; alt: string; width: number; height: number };
  rooms: ResidenceRoom[];
  /** The 360° view from inside each room (same ids as `rooms`). */
  scenes: PanoramaScene[];
}

/** One selectable floor of the hero tower. */
export interface TowerFloor {
  level: number;
  residenceId: string;
  /** Sample "from" price in US dollars. */
  priceFrom: number;
}

/** Where the residential floors sit on the tower still, as fractions of the image (0–1). */
export interface TowerGeometry {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

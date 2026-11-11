/** A room marked on a residence cutaway (the hero's tower explorer). */
export interface ResidenceRoom {
  id: string;
  label: string;
  note: string;
  /** Hotspot position as a fraction of the cutaway image (0–1). */
  x: number;
  y: number;
  /** Room id in the sample 360° tour, when that room can be looked around. */
  tourRoom?: string;
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

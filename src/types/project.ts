/**
 * Project data model.
 * Every optional field is genuinely optional: UI sections render only when data exists.
 * Adding a project = adding a record to src/data/projects.ts — no UI changes required.
 */

export type ProjectCategory = "residential" | "commercial";
export type ProjectStatus = "upcoming" | "ongoing" | "completed";

export type GalleryCategory = "exterior" | "interior" | "lobby" | "amenities" | "construction";

/** Image reference. `credit` is required for sample (stock) photography. */
export interface MediaImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit?: { author: string; url: string; source: "Unsplash" | "Meridian" };
  /** True for stock/sample imagery standing in for real project photography. */
  isSample?: boolean;
}

export interface GalleryImage extends MediaImage {
  category: GalleryCategory;
}

export interface FloorPlan {
  id: string;
  name: string; // e.g. "Type A"
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  image: MediaImage;
  downloadUrl?: string; // PDF
}

export type AmenityKey =
  | "rooftop-garden"
  | "swimming-pool"
  | "gym"
  | "parking"
  | "play-area"
  | "security"
  | "community-space"
  | "generator"
  | "elevator";

export interface PanoramaScene {
  id: string;
  label: string; // "Living room"
  src: string; // equirectangular 2:1 image
  initialYaw?: number;
}

export type VirtualTour =
  | { kind: "panorama"; scenes: PanoramaScene[] }
  | { kind: "model"; src: string; poster?: string } // GLB / glTF (Draco)
  | { kind: "matterport"; modelId: string };

export interface MapLocation {
  address: string[];
  lat: number;
  lng: number;
  landmarks?: { name: string; distance: string }[];
  transport?: string[];
  highlights?: string[];
}

export interface CompletionInfo {
  /** Free-form, e.g. "Q4 2027" or "Handed over March 2024". */
  label: string;
  architect?: string;
}

export interface EnquiryInfo {
  brochureUrl?: string;
  salesPhone?: string;
  salesEmail?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  location: string; // short, e.g. "Gulshan, Dhaka"
  category: ProjectCategory;
  status: ProjectStatus;
  summary: string; // one line for cards
  description: string;
  heroImage: MediaImage;
  gallery: GalleryImage[];
  landArea?: string;
  totalFloors?: number;
  totalUnits?: number;
  apartmentSizes?: string;
  amenities: AmenityKey[];
  floorPlans: FloorPlan[];
  virtualTour: VirtualTour | null;
  mapLocation?: MapLocation;
  completionInformation?: CompletionInfo;
  enquiryInformation?: EnquiryInfo;
  featured?: boolean;
  /** True while the whole record is sample content, not a real Meridian project. */
  isPlaceholder: boolean;
}

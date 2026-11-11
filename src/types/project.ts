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
  /** True for generated or rendered imagery that is not a photograph of the real building. */
  isIllustrative?: boolean;
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

/** A "go to" marker inside a panorama. Angles are in degrees. */
export interface PanoramaHotspot {
  toSceneId: string;
  label: string;
  /** -180..180, 0 = the centre of the equirectangular image. */
  yaw: number;
  /** -90..90, 0 = the horizon, negative = below it. */
  pitch: number;
}

export interface PanoramaScene {
  id: string;
  label: string; // "Living room"
  src: string; // equirectangular 2:1 image, 4096 px wide (scripts/prepare-panorama.mjs)
  srcMobile?: string; // same, 2048 px wide, used on phones
  /** Starting direction in degrees (0 = the centre of the image). */
  initialYaw?: number;
  /** One or two sentences about the room: shown as a caption and announced to screen readers. */
  description?: string;
  /** Where the camera stands on the tour plan, as % of the plan's width and height. */
  mapPoint?: { x: number; y: number };
  hotspots?: PanoramaHotspot[];
}

export type VirtualTour =
  | {
      kind: "panorama";
      scenes: PanoramaScene[];
      /** Ordinary (flat) still shown before the tour is entered. */
      poster: MediaImage;
      /** Light-lined floor plan for the mini-map (scenes' mapPoint sit on it). */
      plan?: MediaImage;
      /** True when the rooms are illustrative renders, not the real building. */
      isIllustrative?: boolean;
    }
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

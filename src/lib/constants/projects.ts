import type { ProjectFilter, ProjectTileVariant } from "@/types/content";
import type { ProjectCategory, ProjectStatus } from "@/types/project";

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  residential: "Residential",
  commercial: "Commercial",
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
};

/** Status marker colours (small non-text marks). */
export const STATUS_MARKER_CLASSES: Record<ProjectStatus, string> = {
  upcoming: "bg-accent",
  ongoing: "bg-brand",
  completed: "bg-ink",
};

export const PROJECT_FILTERS: ProjectFilter[] = [
  { key: "all", label: "All" },
  { key: "residential", label: "Residential" },
  { key: "commercial", label: "Commercial" },
  { key: "upcoming", label: "Upcoming" },
  { key: "ongoing", label: "Ongoing" },
  { key: "completed", label: "Completed" },
];

/** Repeating rhythm of the editorial mosaic: one feature + two supports, then tall + wide. */
export const PROJECT_TILE_SEQUENCE: ProjectTileVariant[] = [
  "feature",
  "support",
  "support",
  "tall",
  "wide",
];

/** Grid placement and image crop for each tile shape (12-column grid at lg). */
export const PROJECT_TILE_CLASSES: Record<
  ProjectTileVariant,
  { tile: string; image: string; sizes: string }
> = {
  feature: {
    tile: "col-span-full lg:col-span-8 lg:row-span-2",
    image: "aspect-[4/3] lg:aspect-[16/13]",
    sizes: "(min-width: 1024px) 66vw, 100vw",
  },
  support: {
    tile: "col-span-3 col-start-2 md:col-span-4 md:col-start-auto lg:col-span-4",
    image: "aspect-[4/3]",
    sizes: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 75vw",
  },
  tall: {
    tile: "col-span-full md:col-span-4 lg:col-span-5",
    image: "aspect-[4/5]",
    sizes: "(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw",
  },
  wide: {
    tile: "col-span-full md:col-span-8 lg:col-span-6 lg:col-start-7 lg:mt-32",
    image: "aspect-[3/2]",
    sizes: "(min-width: 1024px) 50vw, 100vw",
  },
};

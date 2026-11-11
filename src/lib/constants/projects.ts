import type { AmenityKey, ProjectCategory, ProjectStatus } from "@/types/project";

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  residential: "Residential",
  commercial: "Commercial",
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
};

export const AMENITY_LABELS: Record<AmenityKey, string> = {
  "rooftop-garden": "Rooftop garden",
  "swimming-pool": "Swimming pool",
  gym: "Gym",
  parking: "Parking",
  "play-area": "Play area",
  security: "24/7 security",
  "community-space": "Community space",
  generator: "Backup generator",
  elevator: "Elevators",
};

/** Filters on the /projects page: the URL carries them as ?category= and ?status=. */
export const PROJECT_FILTER_GROUPS = [
  {
    param: "category",
    label: "Type",
    options: [
      { key: "all", label: "All" },
      { key: "residential", label: "Residential" },
      { key: "commercial", label: "Commercial" },
    ],
  },
  {
    param: "status",
    label: "Stage",
    options: [
      { key: "all", label: "All" },
      { key: "upcoming", label: "Upcoming" },
      { key: "ongoing", label: "Ongoing" },
      { key: "completed", label: "Completed" },
    ],
  },
] as const;

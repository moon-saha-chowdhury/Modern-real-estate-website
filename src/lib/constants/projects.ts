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

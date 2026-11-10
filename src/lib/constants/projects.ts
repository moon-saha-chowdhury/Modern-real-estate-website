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

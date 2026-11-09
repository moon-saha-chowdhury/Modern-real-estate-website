import { PROJECT_FILTERS, PROJECT_TILE_SEQUENCE } from "@/lib/constants/projects";
import type { ProjectFilterKey, ProjectTileVariant } from "@/types/content";
import type { Project } from "@/types/project";

/** Whether a project matches a filter (category or status; "all" matches everything). */
export function matchesFilter(project: Project, key: ProjectFilterKey): boolean {
  if (key === "all") return true;
  return project.category === key || project.status === key;
}

/** Number of projects per filter, for the counts shown beside each filter. */
export function countByFilter(projects: Project[]): Record<string, number> {
  return Object.fromEntries(
    PROJECT_FILTERS.map((f) => [f.key, projects.filter((p) => matchesFilter(p, f.key)).length]),
  );
}

/** Tile shape for the nth project in the mosaic. */
export function tileVariantAt(index: number, total: number): ProjectTileVariant {
  // A lone trailing project after a full rhythm reads better as a wide tile than a giant one.
  if (total > 1 && index === total - 1 && index % PROJECT_TILE_SEQUENCE.length === 0) {
    return "wide";
  }
  return PROJECT_TILE_SEQUENCE[index % PROJECT_TILE_SEQUENCE.length];
}

/** Two-digit display index: 1 → "01". */
export function displayIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function isProjectFilterKey(value: string): value is ProjectFilterKey {
  return PROJECT_FILTERS.some((f) => f.key === value);
}

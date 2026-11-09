import { cacheLife } from "next/cache";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";

/**
 * Project data access. Pages and components read projects only through these functions,
 * so the source (local data today, a CMS later) can change without touching the UI.
 */

export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("max");
  return projects;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("max");
  return projects.filter((project) => project.featured);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  "use cache";
  cacheLife("max");
  return projects.find((project) => project.slug === slug);
}

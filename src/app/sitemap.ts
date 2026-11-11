import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants/site";
import { getProjects } from "@/lib/data/projects";

const ROUTES = ["", "/about", "/projects", "/expertise", "/contact", "/privacy", "/terms"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  return [
    ...ROUTES.map((route) => ({ url: `${siteConfig.url}${route}` })),
    ...projects.map((project) => ({ url: `${siteConfig.url}/projects/${project.slug}` })),
  ];
}

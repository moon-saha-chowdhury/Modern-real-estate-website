import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { SampleBadge } from "@/components/common/SampleBadge";
import {
  CATEGORY_LABELS,
  PROJECT_TILE_CLASSES,
  STATUS_LABELS,
  STATUS_MARKER_CLASSES,
} from "@/lib/constants/projects";
import { cn } from "@/lib/utils/cn";
import type { ProjectCardProps } from "@/types/sections";

/**
 * Editorial project tile. The variant sets grid placement and crop; the photograph does the work,
 * with metadata set beneath it like a drawing caption rather than in a card.
 */
export function ProjectCard({ project, variant, index }: ProjectCardProps) {
  const tile = PROJECT_TILE_CLASSES[variant];
  const isFeature = variant === "feature";

  return (
    <article className={cn("flex flex-col gap-3", tile.tile)}>
      <Link
        href={`/projects/${project.slug}`}
        className="group/card flex flex-col gap-6 outline-offset-8"
      >
        <div className={cn("relative overflow-hidden bg-charcoal", tile.image)}>
          <Image
            src={project.heroImage.src}
            alt={project.heroImage.alt}
            fill
            sizes={tile.sizes}
            className="object-cover transition-[scale,filter] duration-[1400ms] ease-meridian group-hover/card:scale-[1.04] motion-reduce:transition-none"
          />
          {project.isPlaceholder && (
            <SampleBadge
              label="Sample project"
              className="absolute top-4 left-4 border-ivory/30 bg-obsidian/75 text-ivory"
            />
          )}
          <span
            aria-hidden="true"
            className="absolute right-4 bottom-4 flex size-11 translate-y-2 items-center justify-center bg-ivory text-obsidian opacity-0 transition-[opacity,translate] duration-500 ease-meridian group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-visible/card:translate-y-0 group-focus-visible/card:opacity-100"
          >
            <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4 label-mono text-mist">
            <span>
              <span className="text-champagne">P—{index}</span>
              <span aria-hidden="true"> · </span>
              {CATEGORY_LABELS[project.category]}
            </span>
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn("size-1.5", STATUS_MARKER_CLASSES[project.status])}
              />
              {STATUS_LABELS[project.status]}
            </span>
          </div>
          <h3
            className={cn(
              "font-display transition-colors duration-500",
              isFeature ? "text-display-md" : "text-display-sm",
            )}
          >
            {project.name}
          </h3>
          <p className="text-small text-mist">{project.location}</p>
          {isFeature && <p className="max-w-md text-mist">{project.summary}</p>}
          <span className="sr-only">View project</span>
        </div>
      </Link>
      <PhotoCredit image={project.heroImage} className="text-mist" />
    </article>
  );
}

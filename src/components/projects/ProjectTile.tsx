import Image from "next/image";
import Link from "next/link";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { SampleBadge } from "@/components/common/SampleBadge";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/constants/projects";
import type { ProjectIndexProps, ProjectSectionProps } from "@/types/sections";

/** The grid itself: two columns, the second sitting lower so rows don't line up like a table. */
export function ProjectList({ projects }: ProjectIndexProps) {
  return (
    <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2">
      {projects.map((project, i) => (
        <li key={project.id} className={i % 2 === 1 ? "md:mt-24" : undefined}>
          <ProjectTile project={project} />
        </li>
      ))}
    </ul>
  );
}

/** A project in the /projects grid: photograph, then a short caption. A 360° tour is flagged. */
export function ProjectTile({ project }: ProjectSectionProps) {
  return (
    <article className="flex flex-col gap-3">
      <Link
        href={`/projects/${project.slug}`}
        className="group flex flex-col gap-5 outline-offset-8 transition-[scale] duration-100 ease-out active:scale-[0.99] motion-reduce:transition-none"
      >
        <div className="relative aspect-4/3 overflow-hidden bg-stone">
          <Image
            src={project.heroImage.src}
            alt={project.heroImage.alt}
            fill
            sizes="(min-width: 768px) 46vw, 94vw"
            className="object-cover transition-[scale] duration-[1400ms] ease-meridian group-hover:scale-[1.04] motion-reduce:transition-none"
          />
          {project.isPlaceholder && (
            <SampleBadge
              label="Sample project"
              className="absolute top-4 left-4 border-ivory/30 bg-obsidian/75 text-ivory"
            />
          )}
          {project.virtualTour && (
            <span className="absolute top-4 right-4 bg-white px-2 py-1 label-mono text-[0.625rem] text-ink">
              360° tour
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="label-mono text-fg-muted">
            {STATUS_LABELS[project.status]} · {CATEGORY_LABELS[project.category]}
          </p>
          <h3 className="font-display text-display-sm">{project.name}</h3>
          <p className="text-small text-fg-muted">{project.location}</p>
          <p className="max-w-md text-fg-muted">{project.summary}</p>
        </div>
      </Link>
      <PhotoCredit image={project.heroImage} className="text-fg-muted" />
    </article>
  );
}

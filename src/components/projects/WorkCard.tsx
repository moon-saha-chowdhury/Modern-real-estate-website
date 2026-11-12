import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CursorLabel } from "@/components/common/CursorLabel";
import { ImageReveal } from "@/components/common/ImageReveal";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { Reveal } from "@/components/common/Reveal";
import { SampleBadge } from "@/components/common/SampleBadge";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/constants/projects";
import type { WorkCardProps } from "@/types/sections";

/**
 * Full-width project card (homepage "Selected work"): the photograph fills the card, the
 * one-line summary sits top right, status and name bottom left — text set straight on the image
 * over soft shading. The frame opens and the photograph settles as the card scrolls in; on hover
 * the photograph eases in a little.
 */
export function WorkCard({ project }: WorkCardProps) {
  const meta = `${STATUS_LABELS[project.status]} · ${CATEGORY_LABELS[project.category]}`;

  return (
    <article className="flex flex-col gap-3">
      <Link
        href={`/projects/${project.slug}`}
        data-surface="blue"
        className="group/work group/cursor relative block aspect-4/5 overflow-hidden text-fg outline-offset-8 transition-[scale] duration-100 ease-out active:scale-[0.995] motion-reduce:transition-none md:aspect-auto md:h-[min(680px,78svh)] md:min-h-104"
      >
        <ImageReveal
          src={project.heroImage.src}
          alt={project.heroImage.alt}
          sizes="(min-width: 1440px) 1360px, 94vw"
          className="absolute inset-0"
          imageClassName="transition-[scale] duration-[1400ms] ease-meridian group-hover/work:scale-[1.04] motion-reduce:transition-none"
        />

        {/* Legibility: shade under the title and behind the summary */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/75 via-ink/15 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_at_top_right,rgb(0_0_0/0.35),transparent_55%)] md:block"
        />

        {project.isPlaceholder && (
          <SampleBadge
            label="Sample project"
            className="absolute top-4 left-4 border-ivory/30 bg-obsidian/75 text-ivory md:top-8 md:left-8"
          />
        )}

        <Reveal className="absolute top-8 right-8 hidden max-w-xs md:block lg:max-w-sm">
          <p className="text-lead text-fg">{project.summary}</p>
        </Reveal>

        <Reveal className="absolute inset-x-4 bottom-5 flex flex-col gap-3 md:inset-x-8 md:bottom-8">
          <p className="label-mono text-fg-muted">{meta}</p>
          <h3 className="font-display text-display-md">{project.name}</h3>
          <p className="max-w-sm text-small text-fg-muted md:hidden">{project.summary}</p>
          <span className="sr-only">View project</span>
        </Reveal>

        <CursorLabel label="View project" />

        <span
          aria-hidden="true"
          className="absolute right-4 bottom-5 flex size-11 translate-y-2 items-center justify-center bg-white text-ink opacity-0 transition-[opacity,translate] duration-500 ease-meridian group-hover/work:translate-y-0 group-hover/work:opacity-100 group-focus-visible/work:translate-y-0 group-focus-visible/work:opacity-100 md:right-8 md:bottom-8"
        >
          <ArrowUpRight className="size-4" strokeWidth={1.5} />
        </span>
      </Link>
      <PhotoCredit image={project.heroImage} className="text-fg-muted" />
    </article>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CursorLabel } from "@/components/common/CursorLabel";
import { ImageReveal } from "@/components/common/ImageReveal";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { Reveal } from "@/components/common/Reveal";
import { SampleBadge } from "@/components/common/SampleBadge";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/constants/projects";
import { displayIndex } from "@/lib/utils/projects";
import type { WorkCardProps } from "@/types/sections";

/**
 * Full-width project card (homepage "Selected work"): a clean photograph, then a caption set on
 * paper like a gallery label — number, name and one line on the left, a hairline table of facts
 * on the right. The photograph carries only its badges. The frame opens and the photograph
 * settles as the card scrolls in; on hover the photograph eases in a little. The whole card
 * (photograph and caption) is one link; the photo credit sits outside it.
 */
export function WorkCard({ project, index }: WorkCardProps) {
  const facts = [
    ["Location", project.location],
    ["Type", CATEGORY_LABELS[project.category]],
    ["Stage", STATUS_LABELS[project.status]],
    ["Completion", project.completionInformation?.label],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]));

  return (
    <article className="flex flex-col gap-3">
      <Link
        href={`/projects/${project.slug}`}
        className="group/work group/cursor flex flex-col gap-8 text-fg outline-offset-8 transition-[scale] duration-100 ease-out active:scale-[0.995] motion-reduce:transition-none md:gap-10"
      >
        <div className="relative aspect-4/5 overflow-hidden md:aspect-auto md:h-[min(720px,80svh)] md:min-h-104">
          <ImageReveal
            src={project.heroImage.src}
            alt={project.heroImage.alt}
            sizes="(min-width: 1440px) 1360px, 94vw"
            className="absolute inset-0"
            imageClassName="transition-[scale] duration-[1400ms] ease-meridian group-hover/work:scale-[1.04] motion-reduce:transition-none"
          />

          {project.isPlaceholder && (
            <SampleBadge
              label="Sample project"
              className="absolute top-4 left-4 border-ivory/30 bg-obsidian/75 text-ivory md:top-6 md:left-6"
            />
          )}
          {project.virtualTour && (
            <span className="absolute top-4 right-4 bg-white px-2 py-1 label-mono text-[0.625rem] text-ink md:top-6 md:right-6">
              360° tour
            </span>
          )}

          <CursorLabel label="View project" />

          <span
            aria-hidden="true"
            className="absolute right-4 bottom-4 flex size-11 translate-y-2 items-center justify-center bg-white text-ink opacity-0 transition-[opacity,translate] duration-500 ease-meridian group-hover/work:translate-y-0 group-hover/work:opacity-100 group-focus-visible/work:translate-y-0 group-focus-visible/work:opacity-100 md:right-6 md:bottom-6"
          >
            <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </span>
        </div>

        <Reveal className="grid gap-x-8 gap-y-8 lg:grid-cols-12">
          <div className="flex gap-6 lg:col-span-7 lg:gap-10">
            <span aria-hidden="true" className="pt-2 label-mono text-fg-muted">
              {displayIndex(index)}
            </span>
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-display-md">{project.name}</h3>
              <p className="max-w-md text-fg-muted">{project.summary}</p>
              <span className="sr-only">View project</span>
            </div>
          </div>
          <dl className="lg:col-span-5">
            {facts.map(([term, value]) => (
              <div
                key={term}
                className="grid grid-cols-[7rem_1fr] gap-4 border-t border-rule py-3 text-small last:border-b"
              >
                <dt className="label-mono text-fg-muted">{term}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Link>
      <PhotoCredit image={project.heroImage} className="text-fg-muted" />
    </article>
  );
}

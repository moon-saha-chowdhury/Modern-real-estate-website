import Image from "next/image";
import Link from "next/link";
import { Orbit } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { Reveal } from "@/components/common/Reveal";
import { SampleBadge } from "@/components/common/SampleBadge";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import type { TourTeaserProps } from "@/types/sections";

/**
 * 03 — Step inside (stone). A project's 360° tour as an invitation: a statement and a button on
 * the left, the tour's still on the right with a "360° tour" mark. Both link to the project page,
 * which opens the tour on its first room (?room=...). The still is a flat image: nothing loads
 * three.js here.
 */
export function TourTeaser({ project }: TourTeaserProps) {
  const tour = project.virtualTour;
  if (!tour || tour.kind !== "panorama") return null;
  const href = `/projects/${project.slug}?room=${tour.scenes[0].id}`;

  return (
    <Section tone="stone" aria-labelledby="tour-teaser-title">
      <Container grid className="items-center gap-y-12">
        <div className="col-span-full flex flex-col gap-8 lg:col-span-4">
          <TextReveal
            as="h2"
            id="tour-teaser-title"
            className="font-display text-display-lg"
            lines={["Step inside", `*${project.name}.*`]}
          />
          <Reveal className="flex flex-col gap-8">
            <p className="max-w-sm text-lead text-fg-muted">
              Walk through {tour.scenes.length} rooms in 360°, from the living room to the balcony,
              before a single wall is built.
            </p>
            <Button href={href} icon className="self-start">
              Enter the tour
            </Button>
          </Reveal>
        </div>

        <Reveal className="col-span-full lg:col-span-8">
          <Link
            href={href}
            aria-label={`Enter the 360° tour of ${project.name}`}
            className="group relative block aspect-4/3 overflow-hidden bg-ink outline-offset-8 md:aspect-16/10"
          >
            <Image
              src={tour.poster.src}
              alt={tour.poster.alt}
              fill
              sizes="(min-width: 1024px) 62vw, 94vw"
              className="object-cover transition-[scale] duration-[1400ms] ease-meridian group-hover:scale-[1.03] motion-reduce:transition-none"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-ink/55 via-transparent to-ink/20"
            />
            {tour.isIllustrative && (
              <SampleBadge
                label="Illustrative tour"
                className="absolute top-4 left-4 border-ivory/30 bg-obsidian/75 text-ivory md:top-6 md:left-6"
              />
            )}
            <span className="absolute top-1/2 left-1/2 flex -translate-1/2 items-center gap-4 border border-white/40 bg-ink/40 px-6 py-4 text-lead whitespace-nowrap text-white backdrop-blur-md transition-colors duration-500 ease-meridian group-hover:bg-ink/65">
              <Orbit aria-hidden="true" className="size-6" strokeWidth={1.25} />
              360° tour
            </span>
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { Reveal } from "@/components/common/Reveal";
import { TextReveal } from "@/components/common/TextReveal";
import { HERO_MEDIA } from "@/lib/constants/hero";
import type { ProjectCtaProps } from "@/types/sections";

/** Closing band on the blue dusk (as on the homepage): enquire, or move on to the next project. */
export function ProjectCta({ project, next }: ProjectCtaProps) {
  return (
    <section
      data-surface="blue"
      data-nav-blue="glass"
      aria-labelledby="project-cta-title"
      className="relative isolate overflow-hidden bg-twilight py-section text-fg"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src={HERO_MEDIA.towerFinished}
          alt=""
          fill
          sizes="50vw"
          className="scale-110 object-cover blur-2xl"
        />
        <div className="absolute inset-0 bg-linear-to-b from-twilight/60 via-ink/45 to-ink/80" />
      </div>
      <Container grid className="gap-y-12">
        <TextReveal
          as="h2"
          id="project-cta-title"
          className="col-span-full font-display text-display-lg lg:col-span-7"
          lines={["Interested in", `*${project.name}?*`]}
        />
        <Reveal className="col-span-full flex flex-col gap-8 lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="text-lead text-fg-muted">
            Ask about availability, pricing or a site visit. We reply personally.
          </p>
          <Button href="/contact" surface="dark" icon className="self-start">
            Enquire about this project
          </Button>
        </Reveal>
        {next && (
          <Reveal className="col-span-full border-t border-rule pt-8">
            <Link
              href={`/projects/${next.slug}`}
              className="group flex items-baseline justify-between gap-6 outline-offset-8"
            >
              <span className="label-mono text-fg-muted">Next project</span>
              <span className="flex items-center gap-3 font-display text-display-sm">
                {next.name}
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-6 transition-[translate] duration-500 ease-meridian group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </span>
            </Link>
          </Reveal>
        )}
      </Container>
    </section>
  );
}

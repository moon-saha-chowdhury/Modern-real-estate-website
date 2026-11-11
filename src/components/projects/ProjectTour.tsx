import { Container } from "@/components/common/Container";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { PanoramaTour } from "@/components/virtual-tour/PanoramaTour";
import type { ProjectSectionProps } from "@/types/sections";

/** Virtual tour block. Only panorama tours exist so far; other kinds render nothing. */
export function ProjectTour({ project }: ProjectSectionProps) {
  const tour = project.virtualTour;
  if (!tour || tour.kind !== "panorama") return null;

  return (
    <Section tone="stone" aria-labelledby="tour-title">
      <Container className="flex flex-col gap-12 lg:gap-16">
        <header className="grid-editorial items-end gap-y-8">
          <TextReveal
            as="h2"
            id="tour-title"
            className="col-span-full font-display text-display-lg lg:col-span-7"
            lines={["Step inside", "the *residence.*"]}
          />
          <Reveal className="col-span-full lg:col-span-4 lg:col-start-9">
            <p className="text-lead text-fg-muted">
              Look around each room, then move on to the next. Drag or swipe with two fingers to
              look, Ctrl + scroll to zoom.
            </p>
          </Reveal>
        </header>
        <PanoramaTour
          scenes={tour.scenes}
          poster={tour.poster}
          plan={tour.plan}
          label={`${project.name}, virtual tour`}
          isIllustrative={tour.isIllustrative}
        />
      </Container>
    </Section>
  );
}

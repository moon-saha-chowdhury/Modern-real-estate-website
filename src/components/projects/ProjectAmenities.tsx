import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { AMENITY_LABELS } from "@/lib/constants/projects";
import type { ProjectSectionProps } from "@/types/sections";

/** Amenities as a hairline-ruled list. Only when the project has any. */
export function ProjectAmenities({ project }: ProjectSectionProps) {
  if (project.amenities.length === 0) return null;

  return (
    <Section tone="stone" aria-labelledby="amenities-title">
      <Container grid className="gap-y-12">
        <TextReveal
          as="h2"
          id="amenities-title"
          className="col-span-full font-display text-display-lg lg:col-span-5"
          lines={["Shared *amenities.*"]}
        />
        <ul className="col-span-full grid gap-x-10 border-t border-rule sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {project.amenities.map((key) => (
            <li key={key} className="border-b border-rule py-5 text-lead">
              {AMENITY_LABELS[key]}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import type { ProjectSectionProps } from "@/types/sections";

/**
 * Address, nearby places, transport and highlights as text. No embedded map: a map is a
 * heavy third party, so if one is added later it must be a click-to-load facade.
 */
export function ProjectLocation({ project }: ProjectSectionProps) {
  const location = project.mapLocation;
  if (!location) return null;

  return (
    <Section tone="paper" aria-labelledby="location-title">
      <Container grid className="gap-y-12">
        <TextReveal
          as="h2"
          id="location-title"
          className="col-span-full font-display text-display-lg lg:col-span-5"
          lines={["The *location.*"]}
        />
        <div className="col-span-full flex flex-col gap-10 lg:col-span-6 lg:col-start-7">
          <address className="text-lead text-fg-muted not-italic">
            {location.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          {location.landmarks && location.landmarks.length > 0 && (
            <ul className="border-t border-rule">
              {location.landmarks.map((place) => (
                <li
                  key={place.name}
                  className="flex items-baseline justify-between gap-6 border-b border-rule py-4"
                >
                  <span>{place.name}</span>
                  <span className="label-mono text-fg-muted">{place.distance}</span>
                </li>
              ))}
            </ul>
          )}
          {location.transport && location.transport.length > 0 && (
            <p className="text-fg-muted">{location.transport.join(" · ")}</p>
          )}
          {location.highlights && location.highlights.length > 0 && (
            <ul className="flex flex-col gap-2 text-fg-muted">
              {location.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </Section>
  );
}

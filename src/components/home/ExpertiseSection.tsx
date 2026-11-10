import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { expertise, expertisePhotos } from "@/data/expertise";
import { ExpertiseList } from "./ExpertiseList";

/**
 * 04 — Expertise. Heading, then capability cards that pin while their photographs scroll over
 * them (see ExpertiseList).
 */
export function ExpertiseSection() {
  return (
    <Section tone="stone" aria-labelledby="expertise-title">
      <Container className="flex flex-col gap-12 lg:gap-16">
        <TextReveal
          id="expertise-title"
          className="max-w-[18ch] font-display text-display-lg lg:ml-[calc(100%/6)]"
          lines={["From land", "to *landmark.*"]}
        />
        <ExpertiseList items={expertise} photos={expertisePhotos} />
      </Container>
    </Section>
  );
}

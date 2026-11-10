import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { expertise } from "@/data/expertise";
import { ExpertiseList } from "./ExpertiseList";

/**
 * 04 — Expertise (forest). Sticky heading with a single photograph that changes with the
 * hovered row; full-width numbered rows rather than icon cards.
 */
export function ExpertiseSection() {
  return (
    <Section tone="stone" aria-labelledby="expertise-title">
      <Container className="flex flex-col gap-14">
        <TextReveal
          id="expertise-title"
          className="max-w-[18ch] font-display text-display-md"
          lines={["From land", "to *landmark.*"]}
        />
        <ExpertiseList items={expertise} />
      </Container>
    </Section>
  );
}

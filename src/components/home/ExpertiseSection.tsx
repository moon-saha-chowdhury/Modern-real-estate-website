import { Container } from "@/components/common/Container";
import { Eyebrow } from "@/components/common/Eyebrow";
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
    <Section tone="forest" aria-labelledby="expertise-title">
      <Container className="flex flex-col gap-14">
        <Eyebrow index="04" className="text-champagne">
          Expertise
        </Eyebrow>
        <TextReveal
          id="expertise-title"
          className="max-w-[18ch] font-display text-display-md"
          lines={[
            "From land",
            <>
              to <em className="text-champagne">landmark.</em>
            </>,
          ]}
        />
        <ExpertiseList items={expertise} />
      </Container>
    </Section>
  );
}

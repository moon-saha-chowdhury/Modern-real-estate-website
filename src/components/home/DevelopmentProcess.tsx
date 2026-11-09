import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { processStages } from "@/data/process";
import { ProcessTimeline } from "./ProcessTimeline";

/**
 * 06 — Development process (ivory). Six stages on a drawn line: horizontal on desktop,
 * vertical on mobile. The line draws with scroll progress.
 */
export function DevelopmentProcess() {
  return (
    <Section tone="ivory" id="approach" aria-labelledby="process-title">
      <Container className="flex flex-col gap-20">
        <SectionHeading
          index="06"
          eyebrow="Our approach"
          titleId="process-title"
          title={["Six stages,", "one *standard.*"]}
          intro={
            <p>
              Every Meridian building follows the same disciplined path, from the first look at a
              plot of land to the day the keys change hands.
            </p>
          }
        />
        <ProcessTimeline stages={processStages} />
      </Container>
    </Section>
  );
}

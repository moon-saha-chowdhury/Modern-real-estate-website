import { Container } from "@/components/common/Container";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { processStages } from "@/data/process";
import { ProcessDrawing } from "./ProcessDrawing";

/**
 * 06 — Development process (white). Six stages beside a line drawing of the building they
 * produce: each stage, as you reach it, adds its layer to the drawing (see ProcessDrawing).
 */
export function DevelopmentProcess() {
  return (
    <Section tone="white" id="approach" aria-labelledby="process-title">
      <Container className="flex flex-col gap-16 lg:gap-20">
        <header className="grid-editorial items-end gap-y-8">
          <TextReveal
            as="h2"
            id="process-title"
            className="col-span-full font-display text-display-lg lg:col-span-7 lg:col-start-3"
            lines={["Six stages,", "one *standard.*"]}
          />
          <Reveal className="col-span-full lg:col-span-4 lg:col-start-9">
            <p className="text-lead text-fg-muted">
              Every Meridian building follows the same disciplined path, from the first look at a
              plot of land to the day the keys change hands.
            </p>
          </Reveal>
        </header>
        <ProcessDrawing stages={processStages} />
      </Container>
    </Section>
  );
}

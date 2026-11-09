import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { Eyebrow } from "@/components/common/Eyebrow";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { BuildingTransformation } from "./BuildingTransformation";

/**
 * 01 — Cinematic hero. Split layout: headline left, building transformation right.
 * The scroll-scrubbed video arrives in Milestone 3 (BuildingTransformation).
 */
export function HeroSection() {
  return (
    <Section
      tone="obsidian"
      spacing="none"
      aria-labelledby="hero-title"
      className="overflow-hidden"
    >
      <Container
        grid
        className="min-h-svh items-center gap-y-12 pt-[calc(var(--spacing-nav)+3rem)] pb-20"
      >
        <div className="col-span-full flex flex-col gap-10 lg:col-span-7 xl:col-span-6">
          <Reveal immediate y={12}>
            <Eyebrow index="01" className="text-champagne">
              Architecture-led development
            </Eyebrow>
          </Reveal>
          <TextReveal
            as="h1"
            immediate
            delay={0.15}
            className="font-display text-display-xl"
            id="hero-title"
            lines={[
              "Building spaces.",
              <>
                Shaping <em className="text-champagne">tomorrow.</em>
              </>,
            ]}
          />
          <Reveal immediate delay={0.55} className="flex max-w-md flex-col gap-10">
            <p className="text-lead text-mist">
              Residential and commercial buildings shaped by thoughtful design, engineered with care
              and delivered with quiet confidence.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button href="/projects" icon>
                Explore Projects
              </Button>
              <Button href="#approach" variant="text">
                Our Approach
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal
          immediate
          delay={0.35}
          className="col-span-full lg:col-span-5 lg:col-start-8 xl:col-span-6 xl:col-start-7"
        >
          <BuildingTransformation />
        </Reveal>
      </Container>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-mist lg:flex"
      >
        <span className="label-mono">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.4s_var(--ease-meridian-in-out)_infinite] bg-champagne motion-reduce:hidden" />
        </span>
      </div>
    </Section>
  );
}

import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { Eyebrow } from "@/components/common/Eyebrow";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";

/**
 * Milestone 1 — foundation preview.
 * The full homepage (10 sections) is built in Milestone 2; the scroll-controlled building
 * transformation replaces the drawing frame on the right in Milestone 3.
 */
export default function HomePage() {
  return (
    <>
      <Section tone="obsidian" spacing="none" className="min-h-svh overflow-hidden">
        <Container
          grid
          className="min-h-svh items-center gap-y-12 pt-[calc(var(--spacing-nav)+3rem)] pb-16"
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
              lines={[
                "Building spaces.",
                <>
                  Shaping <em className="text-champagne">tomorrow.</em>
                </>,
              ]}
            />
            <Reveal immediate delay={0.55} className="flex max-w-md flex-col gap-10">
              <p className="text-lead text-mist">
                Residential and commercial buildings shaped by thoughtful design, engineered with
                care and delivered with quiet confidence.
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <Button href="/projects" icon>
                  Explore Projects
                </Button>
                <Button href="/about" variant="text">
                  Our Approach
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Placeholder frame for the Milestone 3 building transformation */}
          <Reveal
            immediate
            delay={0.35}
            className="col-span-full lg:col-span-5 lg:col-start-8 xl:col-span-6 xl:col-start-7"
          >
            <div className="relative aspect-[4/5] w-full border border-line bg-[linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] bg-[size:48px_48px] opacity-80">
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 text-mist">
                <span className="label-mono">Building transformation</span>
                <span className="label-mono">Milestone 03</span>
              </div>
              <span className="absolute top-6 left-6 label-mono text-champagne">
                Fig. 01 — Elevation
              </span>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="ivory">
        <Container grid className="gap-y-10">
          <Eyebrow index="02" className="col-span-full text-ink-soft">
            Foundation preview
          </Eyebrow>
          <TextReveal
            className="col-span-full font-display text-display-md lg:col-span-9"
            lines={[
              "Every building begins",
              <>
                with a <em>promise</em> — of thoughtful
              </>,
              "design and lasting quality.",
            ]}
          />
          <Reveal className="col-span-full flex flex-col gap-8 text-ink-soft md:col-span-5 md:col-start-4 lg:col-span-4 lg:col-start-9">
            <p>
              This page previews the Midnight Forest design system. The complete homepage is
              assembled in Milestone 2.
            </p>
            <Button href="/styleguide" variant="text" surface="light">
              View design system
            </Button>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

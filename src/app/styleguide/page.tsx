import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { Eyebrow } from "@/components/common/Eyebrow";
import { SampleBadge } from "@/components/common/SampleBadge";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { pageMetadata } from "@/lib/constants/metadata";
import { COLOUR_SWATCHES, TYPE_SPECIMENS } from "@/lib/constants/styleguide";
import { SECTION_TONES } from "@/lib/constants/ui";
import { surfaceOf } from "@/lib/utils/surface";

/** Internal design-system reference. Not linked from navigation and excluded from indexing. */
export const metadata = pageMetadata.styleguide;

export default function StyleguidePage() {
  return (
    <>
      <Section
        tone="paper"
        spacing="none"
        className="pt-[calc(var(--spacing-nav)+6rem)] pb-section"
      >
        <Container>
          <SectionHeading
            as="h1"
            size="lg"
            eyebrow="Midnight Forest — Design system"
            index="00"
            title={["Architectural", "*luxury*, quietly."]}
            intro={
              <p>
                Tokens, typography and components for Meridian Developments. Internal reference.
              </p>
            }
          />
        </Container>
      </Section>

      {/* Colour */}
      <Section tone="stone" spacing="compact">
        <Container className="flex flex-col gap-12">
          <Eyebrow index="01" className="text-accent">
            Colour
          </Eyebrow>
          <ul className="grid grid-cols-2 gap-px border border-rule bg-rule md:grid-cols-3 lg:grid-cols-9">
            {COLOUR_SWATCHES.map((c) => (
              <li key={c.token} className="flex flex-col bg-surface">
                <div className={`${c.swatchClass} aspect-[3/4] lg:aspect-[1/2]`} />
                <div className="flex flex-col gap-1 p-4">
                  <span className="text-small text-fg">{c.name}</span>
                  <span className="label-mono text-fg-muted">{c.hex}</span>
                  <span className="text-[0.75rem] text-fg-muted">{c.role}</span>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Typography */}
      <Section tone="white" spacing="compact">
        <Container className="flex flex-col gap-12">
          <Eyebrow index="02" className="text-accent">
            Typography — Google Sans Flex · Manrope · IBM Plex Mono
          </Eyebrow>
          <div className="flex flex-col divide-y divide-rule border-y border-rule">
            {TYPE_SPECIMENS.map((t) => (
              <div key={t.label} className="grid-editorial items-baseline gap-y-3 py-8">
                <span className="col-span-full label-mono text-fg-muted lg:col-span-2">
                  {t.label}
                </span>
                <p className={`col-span-full font-display lg:col-span-10 ${t.className}`}>
                  {t.sample} <em className="text-accent">{t.emphasis}</em>
                </p>
              </div>
            ))}
            <div className="grid-editorial gap-y-3 py-8">
              <span className="col-span-full label-mono text-fg-muted lg:col-span-2">
                Lead · Manrope
              </span>
              <p className="col-span-full max-w-2xl text-lead lg:col-span-8">
                We believe every building begins with a promise — of thoughtful design, lasting
                quality, and spaces that become part of people&apos;s lives.
              </p>
            </div>
            <div className="grid-editorial gap-y-3 py-8">
              <span className="col-span-full label-mono text-fg-muted lg:col-span-2">
                Body · Manrope
              </span>
              <p className="col-span-full max-w-prose text-fg-muted lg:col-span-6">
                Body copy is set generously, with a long measure capped near 70 characters.
                Secondary text uses Mist on dark surfaces and a derived soft ink on Ivory.
              </p>
            </div>
            <div className="grid-editorial gap-y-3 py-8">
              <span className="col-span-full label-mono text-fg-muted lg:col-span-2">
                Label · Plex Mono
              </span>
              <div className="col-span-full flex flex-wrap items-center gap-8 lg:col-span-10">
                <Eyebrow index="03">Section annotation</Eyebrow>
                <span className="label-mono text-accent">Gulshan, Dhaka · Residential</span>
                <SampleBadge className="text-fg-muted" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Buttons & surfaces */}
      <Section tone="paper" spacing="none" className="pb-section">
        <Container className="flex flex-col gap-12">
          <Eyebrow index="03" className="text-accent">
            Surfaces &amp; actions
          </Eyebrow>
        </Container>
        <div className="mt-12 flex flex-col">
          {SECTION_TONES.map((tone) => {
            const surface = surfaceOf(tone);
            return (
              <Section key={tone} tone={tone} spacing="none" className="py-14">
                <Container className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                  <span className="label-mono opacity-70">{tone}</span>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <Button surface={surface} icon>
                      Explore Projects
                    </Button>
                    <Button surface={surface} variant="outline">
                      Schedule a Visit
                    </Button>
                    <Button surface={surface} variant="text">
                      Our Approach
                    </Button>
                  </div>
                </Container>
              </Section>
            );
          })}
        </div>
      </Section>
    </>
  );
}

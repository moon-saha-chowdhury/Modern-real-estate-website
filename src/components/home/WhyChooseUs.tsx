import { Container } from "@/components/common/Container";
import { Eyebrow } from "@/components/common/Eyebrow";
import { Reveal } from "@/components/common/Reveal";
import { SampleBadge } from "@/components/common/SampleBadge";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { strengths } from "@/data/strengths";
import { displayIndex } from "@/lib/utils/projects";

/**
 * 07 — Why Meridian (charcoal). Sticky statement on the left; strengths set as a two-column
 * index on the right, each under its own hairline, like a specification sheet.
 */
export function WhyChooseUs() {
  return (
    <Section tone="charcoal" aria-labelledby="why-title">
      <Container grid className="gap-y-16">
        <div className="col-span-full flex flex-col gap-10 lg:col-span-5">
          <div className="flex flex-col gap-10 lg:sticky lg:top-[calc(var(--spacing-nav)+3rem)]">
            <Eyebrow index="07" className="text-champagne">
              Why Meridian
            </Eyebrow>
            <TextReveal
              id="why-title"
              className="font-display text-display-md"
              lines={["Built to be", "lived in,", "*for decades.*"]}
            />
            <SampleBadge label="Draft — to be confirmed" className="self-start text-mist" />
          </div>
        </div>

        <ul className="col-span-full grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {strengths.map((strength, i) => (
            <li key={strength.id}>
              <Reveal
                delay={(i % 2) * 0.08}
                className="flex flex-col gap-4 border-t border-line pt-6"
              >
                <span className="label-mono text-champagne">{displayIndex(i)}</span>
                <h3 className="text-lead font-medium text-ivory">{strength.title}</h3>
                <p className="text-small text-mist">{strength.description}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

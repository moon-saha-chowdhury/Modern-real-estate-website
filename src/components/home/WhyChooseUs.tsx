import Image from "next/image";
import { Container } from "@/components/common/Container";
import { Reveal } from "@/components/common/Reveal";
import { SampleBadge } from "@/components/common/SampleBadge";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { media } from "@/data/media";
import { strengths } from "@/data/strengths";
import { displayIndex } from "@/lib/utils/projects";

/**
 * 07 — Why Meridian (stone). A sticky column on the left (statement over a tall photograph of a
 * building's edge); the strengths as a two-column index on the right, each under its own hairline,
 * like a specification sheet.
 */
export function WhyChooseUs() {
  const image = media.projectConcreteEdge;

  return (
    <Section tone="stone" aria-labelledby="why-title">
      <Container grid className="gap-y-16">
        <div className="col-span-full lg:col-span-5">
          <div className="flex flex-col gap-10 lg:sticky lg:top-[calc(var(--spacing-nav)+3rem)]">
            <TextReveal
              id="why-title"
              className="font-display text-display-lg"
              lines={["Built to be", "lived in,", "*for decades.*"]}
            />
            <figure className="hidden max-w-xs flex-col gap-3 lg:flex">
              <div className="relative aspect-4/5 overflow-hidden bg-paper">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 24vw, 0px"
                  quality={90}
                  className="object-cover"
                />
              </div>
              <PhotoCredit image={image} className="text-fg-muted" />
            </figure>
            <SampleBadge label="Draft — to be confirmed" className="self-start text-fg-muted" />
          </div>
        </div>

        <ul className="col-span-full grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {strengths.map((strength, i) => (
            <li key={strength.id}>
              <Reveal
                delay={(i % 2) * 0.08}
                className="flex flex-col gap-4 border-t border-rule pt-6"
              >
                <span className="font-display text-display-sm text-accent tabular-nums">
                  {displayIndex(i)}
                </span>
                <h3 className="font-display text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] leading-tight">
                  {strength.title}
                </h3>
                <p className="text-fg-muted">{strength.description}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

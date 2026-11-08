import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { TextReveal } from "./TextReveal";
import type { PageIntroProps } from "@/types/ui";

/** Editorial page opener used by inner pages (About, Projects, Expertise, Contact …). */
export function PageIntro({ eyebrow, index, title, intro, children }: PageIntroProps) {
  return (
    <Section
      tone="obsidian"
      spacing="none"
      className="pt-[calc(var(--spacing-nav)+clamp(4rem,10vw,9rem))] pb-section"
    >
      <Container grid className="gap-y-10">
        <Eyebrow index={index} className="col-span-full text-champagne">
          {eyebrow}
        </Eyebrow>
        <TextReveal
          as="h1"
          immediate
          lines={title}
          className="col-span-full font-display text-display-lg lg:col-span-10"
        />
        {intro && (
          <Reveal
            immediate
            delay={0.3}
            className="col-span-full text-lead text-mist md:col-span-6 lg:col-span-5 lg:col-start-7"
          >
            {intro}
          </Reveal>
        )}
        {children && <div className="col-span-full">{children}</div>}
      </Container>
    </Section>
  );
}

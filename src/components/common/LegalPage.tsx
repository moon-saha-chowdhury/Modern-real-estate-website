import { Container } from "./Container";
import { PageIntro } from "./PageIntro";
import { Reveal } from "./Reveal";
import { SampleBadge } from "./SampleBadge";
import { Section } from "./Section";
import type { LegalPageProps } from "@/types/sections";

/** Privacy and terms: an intro, then numbered sections of plain paragraphs. */
export function LegalPage({ eyebrow, title, intro, sections }: LegalPageProps) {
  return (
    <>
      <PageIntro eyebrow={eyebrow} title={title} intro={<p>{intro}</p>}>
        <SampleBadge
          className="text-fg-muted"
          label="Sample text for the demo site, not legal advice"
        />
      </PageIntro>
      <Section tone="white">
        <Container grid className="gap-y-14">
          {sections.map((section, i) => (
            <Reveal
              key={section.heading}
              className="col-span-full grid gap-4 border-t border-rule pt-8 lg:col-span-9 lg:col-start-3 lg:grid-cols-[3rem_1fr]"
            >
              <span className="label-mono text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex flex-col gap-4">
                <h2 className="font-display text-display-sm">{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="max-w-prose text-fg-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </Container>
      </Section>
    </>
  );
}

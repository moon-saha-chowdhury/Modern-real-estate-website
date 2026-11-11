import { Container } from "@/components/common/Container";
import { CtaBand } from "@/components/common/CtaBand";
import { ImageReveal } from "@/components/common/ImageReveal";
import { PageIntro } from "@/components/common/PageIntro";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { Reveal } from "@/components/common/Reveal";
import { SampleBadge } from "@/components/common/SampleBadge";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { expertise } from "@/data/expertise";
import { pageMetadata } from "@/lib/constants/metadata";
import { cn } from "@/lib/utils/cn";
import { displayIndex } from "@/lib/utils/projects";

export const metadata = pageMetadata.expertise;

export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="Expertise"
        index="03"
        title={["From land to", "*landmark*."]}
        intro={<p>Development, architecture, engineering and partnership: under one discipline.</p>}
      >
        <SampleBadge className="text-fg-muted" label="Sample copy" />
      </PageIntro>

      {expertise.map((item, i) => (
        <Section
          key={item.id}
          id={item.id}
          tone={i % 2 === 0 ? "white" : "stone"}
          aria-labelledby={`${item.id}-title`}
          className="scroll-mt-20"
        >
          <Container grid className="items-center gap-y-12">
            <figure
              className={cn(
                "col-span-full flex flex-col gap-3 lg:col-span-5",
                i % 2 === 1 && "lg:order-2 lg:col-start-8",
              )}
            >
              <ImageReveal
                src={item.image.src}
                alt={item.image.alt}
                sizes="(min-width: 1024px) 38vw, 94vw"
                className="aspect-4/3 w-full lg:aspect-4/5"
              />
              <PhotoCredit image={item.image} className="text-fg-muted" />
            </figure>
            <div
              className={cn(
                "col-span-full flex flex-col gap-8 lg:col-span-6",
                i % 2 === 0 ? "lg:col-start-7" : "lg:order-1 lg:col-start-1",
              )}
            >
              <span className="label-mono text-accent">{displayIndex(i)}</span>
              <TextReveal
                as="h2"
                id={`${item.id}-title`}
                className="font-display text-display-lg"
                lines={[item.title]}
              />
              <Reveal className="flex flex-col gap-8">
                <p className="max-w-lg text-lead text-fg-muted">{item.summary}</p>
                {item.points && (
                  <ul className="border-t border-rule">
                    {item.points.map((point) => (
                      <li key={point} className="border-b border-rule py-4">
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            </div>
          </Container>
        </Section>
      ))}

      <CtaBand
        id="expertise-cta-title"
        title={["Have a plot", "or a *brief?*"]}
        text="Tell us what you have in mind, and we will tell you honestly whether and how we can help."
        href="/contact"
        label="Start a conversation"
      />
    </>
  );
}

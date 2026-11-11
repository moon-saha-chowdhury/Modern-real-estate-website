import { CompanyStats } from "@/components/home/CompanyStats";
import { Container } from "@/components/common/Container";
import { CtaBand } from "@/components/common/CtaBand";
import { ImageReveal } from "@/components/common/ImageReveal";
import { PageIntro } from "@/components/common/PageIntro";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { Reveal } from "@/components/common/Reveal";
import { SampleBadge } from "@/components/common/SampleBadge";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { milestones, principles } from "@/data/about";
import { media } from "@/data/media";
import { pageMetadata } from "@/lib/constants/metadata";
import { displayIndex } from "@/lib/utils/projects";

export const metadata = pageMetadata.about;

export default function Page() {
  const image = media.brandIntro;

  return (
    <>
      <PageIntro
        eyebrow="About Meridian"
        index="01"
        title={["A practice built on", "*intention*."]}
        intro={<p>Our story, how we work and the people behind every Meridian building.</p>}
      >
        <SampleBadge className="text-fg-muted" label="Sample copy" />
      </PageIntro>

      <Section tone="white" aria-labelledby="story-title">
        <Container grid className="gap-y-14">
          <TextReveal
            as="h2"
            id="story-title"
            className="col-span-full font-display text-display-lg lg:col-span-6"
            lines={["We start with", "the *plot,*", "then the people."]}
          />
          <div className="col-span-full flex flex-col gap-6 lg:col-span-5 lg:col-start-8 lg:self-end">
            <Reveal className="flex flex-col gap-6 text-lead text-fg-muted">
              <p>
                Meridian began with a simple rule: draw the building around the people who will live
                in it. We are architects, engineers and builders in one team, so a decision made on
                the drawing board is still understood on site.
              </p>
              <p>
                We build homes and workplaces in the city, and we say plainly what we have built,
                what we are building and what is still on the drawing board.
              </p>
            </Reveal>
          </div>
          <figure className="col-span-4 col-start-2 flex flex-col gap-3 md:col-span-4 md:col-start-5 lg:col-span-3 lg:col-start-1">
            <ImageReveal
              src={image.src}
              alt={image.alt}
              sizes="(min-width: 1024px) 24vw, 70vw"
              className="aspect-3/4 w-full"
            />
            <PhotoCredit image={image} className="text-fg-muted" />
          </figure>
        </Container>
      </Section>

      <Section tone="stone" aria-labelledby="principles-title">
        <Container grid className="gap-y-14">
          <TextReveal
            as="h2"
            id="principles-title"
            className="col-span-full font-display text-display-lg lg:col-span-5"
            lines={["How we *work.*"]}
          />
          <ul className="col-span-full border-t border-rule lg:col-span-6 lg:col-start-7">
            {principles.map((principle, i) => (
              <Reveal
                key={principle.id}
                className="grid gap-3 border-b border-rule py-8 md:grid-cols-[3rem_1fr]"
              >
                <span className="label-mono text-accent">{displayIndex(i)}</span>
                <div className="flex flex-col gap-3">
                  <h3 className="font-display text-display-sm">{principle.title}</h3>
                  <p className="text-fg-muted">{principle.description}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <CompanyStats />

      <Section tone="white" aria-labelledby="milestones-title">
        <Container grid className="gap-y-14">
          <TextReveal
            as="h2"
            id="milestones-title"
            className="col-span-full font-display text-display-lg lg:col-span-5"
            lines={["A few *milestones.*"]}
          />
          <ol className="col-span-full border-t border-rule lg:col-span-6 lg:col-start-7">
            {milestones.map((milestone) => (
              <Reveal
                key={milestone.year}
                className="grid gap-3 border-b border-rule py-8 md:grid-cols-[6rem_1fr]"
              >
                <span className="font-display text-display-sm text-accent tabular-nums">
                  {milestone.year}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lead font-medium">{milestone.title}</h3>
                  <p className="text-fg-muted">{milestone.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <CtaBand
        id="about-cta-title"
        title={["See what we", "*build.*"]}
        text="Browse the projects, or step inside one of them with a 360° tour."
        href="/projects"
        label="View all projects"
      />
    </>
  );
}

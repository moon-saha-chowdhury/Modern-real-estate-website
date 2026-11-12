import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { ImageReveal } from "@/components/common/ImageReveal";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { media } from "@/data/media";
import { DUSK_EDGE } from "@/lib/constants/hero";

/**
 * 02 — Brand introduction, on paper.
 *
 * The hero is the one dark moment of the page; this is where it ends. The tower's dusk dissolves
 * into paper over a third of a screen (a many-stop gradient: two stops would band), and the
 * navbar stays blue only while it is still over the dusk, so white text never lands on paper.
 *
 * Then a quiet editorial composition: one statement, a portrait and a landscape photograph at
 * different heights, and a short paragraph. No backdrop, no frost, nothing sticky.
 */
export function BrandIntroduction() {
  const portrait = media.brandIntro;
  const interior = media.interiorLiving;

  return (
    <>
      <div
        aria-hidden="true"
        className="relative h-[34svh] min-h-52"
        style={{
          backgroundImage: `linear-gradient(to bottom,
            ${DUSK_EDGE} 0%,
            color-mix(in oklab, ${DUSK_EDGE} 78%, var(--color-paper)) 14%,
            color-mix(in oklab, ${DUSK_EDGE} 52%, var(--color-paper)) 32%,
            color-mix(in oklab, ${DUSK_EDGE} 26%, var(--color-paper)) 52%,
            color-mix(in oklab, ${DUSK_EDGE} 9%, var(--color-paper)) 74%,
            var(--color-paper) 100%)`,
        }}
      >
        {/* The navbar is blue while this upper part is under it, light after */}
        <div data-nav-blue className="absolute inset-x-0 top-0 h-[48%]" />
      </div>

      <Section tone="paper" aria-labelledby="intro-title" className="pt-0">
        <Container className="grid-editorial gap-y-14 lg:gap-y-24">
          <TextReveal
            id="intro-title"
            flowBelowLg
            className="col-span-full font-display text-display-md lg:col-span-9"
            lines={[
              "We believe every building",
              "begins with a promise —",
              "of thoughtful design, *lasting*",
              "quality, and spaces that",
              "become part of people's lives.",
            ]}
          />

          <figure className="col-span-4 col-start-1 flex flex-col gap-3 md:col-span-3 md:col-start-1 lg:col-span-3 lg:col-start-2 lg:row-start-2">
            <ImageReveal
              src={portrait.src}
              alt={portrait.alt}
              sizes="(min-width: 1024px) 24vw, (min-width: 768px) 30vw, 60vw"
              className="aspect-3/4 w-full"
            />
            <PhotoCredit image={portrait} className="text-fg-muted" />
          </figure>

          <Reveal className="col-span-full flex flex-col gap-8 md:col-span-5 md:col-start-5 md:row-start-2 lg:col-span-3 lg:col-start-6 lg:self-end">
            <span aria-hidden="true" className="h-px w-16 bg-fg/30" />
            <p className="text-lead text-fg-muted">
              Meridian develops residential and commercial buildings with an architect&apos;s
              discipline: every plan resolved for light, air and privacy before a single wall is
              built, and every detail made to last.
            </p>
            <Button href="/about" variant="text" icon className="self-start">
              About Meridian
            </Button>
          </Reveal>

          <figure className="col-span-full flex flex-col gap-3 md:col-span-6 md:col-start-7 md:row-start-3 lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:mt-40">
            <ImageReveal
              src={interior.src}
              alt={interior.alt}
              sizes="(min-width: 1024px) 32vw, (min-width: 768px) 46vw, 94vw"
              className="aspect-4/3 w-full"
            />
            <PhotoCredit image={interior} className="text-fg-muted" />
          </figure>
        </Container>
      </Section>
    </>
  );
}

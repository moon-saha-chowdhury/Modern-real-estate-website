import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { Eyebrow } from "@/components/common/Eyebrow";
import { ImageReveal } from "@/components/common/ImageReveal";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { media } from "@/data/media";

/**
 * 02 — Brand introduction (ivory).
 * Off-centre statement across eight columns; a tall cropped photograph sits high in the right
 * margin; the philosophy note is offset beneath the statement rather than beside it.
 */
export function BrandIntroduction() {
  const image = media.brandIntro;

  return (
    <Section tone="paper" aria-labelledby="intro-title">
      <Container grid className="gap-y-12 lg:gap-y-20">
        <Eyebrow index="02" className="col-span-full text-fg-muted">
          Who we are
        </Eyebrow>

        <TextReveal
          id="intro-title"
          flowBelowLg
          className="col-span-full font-display text-display-md lg:col-span-8 lg:row-start-2"
          lines={[
            "We believe every building",
            "begins with a promise —",
            "of thoughtful design, *lasting*",
            "quality, and spaces that",
            "become part of people's lives.",
          ]}
        />

        <figure className="col-span-3 col-start-2 flex flex-col gap-3 md:col-span-3 md:col-start-6 lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:row-start-2 lg:-mt-24">
          <ImageReveal
            src={image.src}
            alt={image.alt}
            sizes="(min-width: 1024px) 22vw, (min-width: 768px) 36vw, 75vw"
            className="aspect-[3/4] w-full"
          />
          <PhotoCredit image={image} className="text-fg-muted" />
        </figure>

        <Reveal className="col-span-full flex flex-col gap-8 md:col-span-5 md:col-start-2 lg:col-span-4 lg:col-start-5 lg:row-start-3">
          <span aria-hidden="true" className="h-px w-16 bg-surface/30" />
          <p className="text-fg-muted">
            Meridian develops residential and commercial buildings with an architect&apos;s
            discipline: every plan resolved for light, air and privacy before a single wall is
            built, and every detail made to last.
          </p>
          <Button href="/about" variant="text" surface="light" icon className="self-start">
            About Meridian
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}

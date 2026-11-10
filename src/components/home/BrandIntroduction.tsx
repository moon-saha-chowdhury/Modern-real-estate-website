import Image from "next/image";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { ImageReveal } from "@/components/common/ImageReveal";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { Reveal } from "@/components/common/Reveal";
import { TextReveal } from "@/components/common/TextReveal";
import { media } from "@/data/media";
import { HERO_MEDIA } from "@/lib/constants/hero";
import { SkyVeil } from "./SkyVeil";

/**
 * 02 — Brand introduction, continuing the hero's sky.
 *
 * The hero's camera rises into open sky; this section picks up from there like the reference
 * reel: the sky fades (SkyVeil) to the finished tower, which stays fixed behind for the whole
 * section (sticky), and the content rises over it on a translucent plate.
 * A "blue" surface (white text), so the navbar stays blue over it too (data-nav-blue).
 */
export function BrandIntroduction() {
  const image = media.brandIntro;

  return (
    <section
      data-surface="blue"
      data-nav-blue="glass"
      aria-labelledby="intro-title"
      className="relative isolate bg-twilight text-fg"
    >
      {/* Fixed backdrop: sticks to the viewport while the content scrolls over it */}
      <div
        aria-hidden="true"
        className="pointer-events-none sticky top-0 -z-10 -mb-[100svh] h-svh overflow-hidden"
      >
        <Image
          src={HERO_MEDIA.towerFinished}
          alt=""
          fill
          sizes="(max-width: 767px) 260vw, 100vw"
          quality={90}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-ink/10 via-transparent to-ink/45" />
        <SkyVeil />
      </div>

      {/* The top padding leaves the tower on screen (after the sky fades) before the content
          rises over it; the bottom padding lets it show again before the next section. */}
      <div className="pt-[125svh] pb-[45svh] motion-reduce:pt-[70svh]">
        <Container>
          <div className="grid-editorial gap-y-12 rounded-sm bg-ink/35 p-6 ring-1 ring-fg/10 backdrop-blur-md md:p-10 lg:gap-y-20 lg:p-16">
            <TextReveal
              id="intro-title"
              flowBelowLg
              className="col-span-full font-display text-display-md lg:col-span-8"
              lines={[
                "We believe every building",
                "begins with a promise —",
                "of thoughtful design, *lasting*",
                "quality, and spaces that",
                "become part of people's lives.",
              ]}
            />

            <figure className="col-span-3 col-start-2 flex flex-col gap-3 md:col-span-3 md:col-start-6 lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:row-start-1">
              <ImageReveal
                src={image.src}
                alt={image.alt}
                sizes="(min-width: 1024px) 22vw, (min-width: 768px) 36vw, 75vw"
                className="aspect-3/4 w-full"
              />
              <PhotoCredit image={image} className="text-fg-muted" />
            </figure>

            <Reveal className="col-span-full flex flex-col gap-8 md:col-span-5 md:col-start-2 lg:col-span-4 lg:col-start-5 lg:row-start-2">
              <span aria-hidden="true" className="h-px w-16 bg-fg/30" />
              <p className="text-fg-muted">
                Meridian develops residential and commercial buildings with an architect&apos;s
                discipline: every plan resolved for light, air and privacy before a single wall is
                built, and every detail made to last.
              </p>
              <Button href="/about" variant="text" icon className="self-start">
                About Meridian
              </Button>
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
}

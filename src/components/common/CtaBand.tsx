import Image from "next/image";
import { Button } from "./Button";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { TextReveal } from "./TextReveal";
import { HERO_MEDIA } from "@/lib/constants/hero";
import type { CtaBandProps } from "@/types/sections";

/**
 * Closing band on the hero's blue dusk (the mirrored, blurred tower). Used to end the inner
 * pages: a statement, one line and a button. `children` adds a row beneath.
 */
export function CtaBand({ id, title, text, href, label, children }: CtaBandProps) {
  return (
    <section
      data-surface="blue"
      data-nav-blue="glass"
      aria-labelledby={id}
      className="relative isolate overflow-hidden bg-twilight py-section text-fg"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src={HERO_MEDIA.towerFinished}
          alt=""
          fill
          sizes="50vw"
          className="scale-110 -scale-x-100 object-cover blur-2xl"
        />
        <div className="absolute inset-0 bg-linear-to-b from-twilight/60 via-ink/45 to-ink/80" />
      </div>
      <Container grid className="gap-y-12">
        <TextReveal
          as="h2"
          id={id}
          className="col-span-full font-display text-display-lg lg:col-span-7"
          lines={title}
        />
        <Reveal className="col-span-full flex flex-col gap-8 lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="text-lead text-fg-muted">{text}</p>
          <Button href={href} surface="dark" icon className="self-start">
            {label}
          </Button>
        </Reveal>
        {children}
      </Container>
    </section>
  );
}

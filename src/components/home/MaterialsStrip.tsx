import { Container } from "@/components/common/Container";
import { ImageReveal } from "@/components/common/ImageReveal";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { Reveal } from "@/components/common/Reveal";
import { SampleBadge } from "@/components/common/SampleBadge";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { materials } from "@/data/materials";

/**
 * 08 — Materials (white). A short statement, then four photographs of the materials the
 * buildings are made of, at alternating heights so the row reads like a sample board rather than
 * a grid of cards. Each has its name and one line on how it is used.
 */
export function MaterialsStrip() {
  return (
    <Section tone="white" aria-labelledby="materials-title">
      <Container className="flex flex-col gap-14 lg:gap-20">
        <header className="grid-editorial items-end gap-y-8">
          <TextReveal
            as="h2"
            id="materials-title"
            className="col-span-full font-display text-display-lg lg:col-span-6 lg:col-start-3"
            lines={["Materials we", "can *name.*"]}
          />
          <Reveal className="col-span-full flex flex-col gap-5 lg:col-span-4 lg:col-start-9">
            <p className="text-lead text-fg-muted">
              A building is judged up close. These are the surfaces residents touch every day.
            </p>
            <SampleBadge label="Sample specification" className="self-start text-fg-muted" />
          </Reveal>
        </header>

        <ul className="grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-4 lg:gap-x-8">
          {materials.map((material, i) => (
            <li key={material.id} className={i % 2 === 1 ? "lg:mt-24" : undefined}>
              <figure className="flex flex-col gap-4">
                <ImageReveal
                  src={material.image.src}
                  alt={material.image.alt}
                  sizes="(min-width: 1024px) 22vw, 46vw"
                  delay={i * 0.08}
                  className="aspect-3/4 w-full"
                />
                <figcaption className="flex flex-col gap-2">
                  <span className="font-display text-display-sm">{material.name}</span>
                  <span className="text-small text-fg-muted">{material.note}</span>
                  <PhotoCredit image={material.image} className="text-fg-muted" />
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

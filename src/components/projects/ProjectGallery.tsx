import { Container } from "@/components/common/Container";
import { ImageReveal } from "@/components/common/ImageReveal";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import type { ProjectSectionProps } from "@/types/sections";

/** Photographs, the first one wide. Renders only when the project has a gallery. */
export function ProjectGallery({ project }: ProjectSectionProps) {
  if (project.gallery.length === 0) return null;

  return (
    <Section tone="paper" aria-labelledby="gallery-title">
      <Container className="flex flex-col gap-12">
        <TextReveal
          as="h2"
          id="gallery-title"
          className="font-display text-display-lg lg:ml-[calc(100%/6)]"
          lines={["The *gallery.*"]}
        />
        <ul className="grid gap-4 md:grid-cols-2">
          {project.gallery.map((image, i) => (
            <li key={image.src} className={i === 0 ? "md:col-span-2" : undefined}>
              <figure className="flex flex-col gap-2">
                <ImageReveal
                  src={image.src}
                  alt={image.alt}
                  sizes={
                    i === 0 ? "(min-width: 1440px) 1360px, 94vw" : "(min-width: 768px) 46vw, 94vw"
                  }
                  className={i === 0 ? "aspect-16/9 w-full" : "aspect-4/3 w-full"}
                />
                <figcaption className="flex items-baseline justify-between gap-4">
                  <span className="label-mono text-fg-muted capitalize">{image.category}</span>
                  <PhotoCredit image={image} className="text-fg-muted" />
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

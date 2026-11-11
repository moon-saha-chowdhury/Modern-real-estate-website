import { Container } from "@/components/common/Container";
import { ImageReveal } from "@/components/common/ImageReveal";
import { PhotoCredit } from "@/components/common/PhotoCredit";
import { Section } from "@/components/common/Section";
import type { ProjectSectionProps } from "@/types/sections";

/** The project's lead photograph, full container width, tall on phones and wide from md. */
export function ProjectHeroImage({ project }: ProjectSectionProps) {
  const image = project.heroImage;
  return (
    <Section tone="paper" spacing="none" className="pb-section">
      <Container className="flex flex-col gap-3">
        <ImageReveal
          src={image.src}
          alt={image.alt}
          priority
          sizes="(min-width: 1440px) 1360px, 94vw"
          className="aspect-4/5 w-full md:aspect-21/9"
        />
        <PhotoCredit image={image} className="text-fg-muted" />
      </Container>
    </Section>
  );
}

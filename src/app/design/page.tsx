import { Container } from "@/components/common/Container";
import { PageIntro } from "@/components/common/PageIntro";
import { Section } from "@/components/common/Section";
import { ResidenceDesignerLoader } from "@/components/room3d/ResidenceDesignerLoader";
import { pageMetadata } from "@/lib/constants/metadata";

export const metadata = pageMetadata.design;

/**
 * Design your residence: the apartment from the homepage's cutaway, in 3D, with furniture to
 * place and finishes to choose. The designer (three.js) is loaded in the browser only.
 */
export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="Design"
        index="05"
        title={["Make it", "*yours.*"]}
        intro={
          <p>
            Move through a sample residence in 3D. Place furniture, drag it into position, repaint
            the walls and change the floors, then copy a link to the design.
          </p>
        }
      />
      <Section tone="white" spacing="compact" aria-label="Residence designer">
        <Container>
          <ResidenceDesignerLoader />
        </Container>
      </Section>
    </>
  );
}

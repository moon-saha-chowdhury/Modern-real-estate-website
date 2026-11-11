import { Suspense } from "react";
import { Container } from "@/components/common/Container";
import { PageIntro } from "@/components/common/PageIntro";
import { Section } from "@/components/common/Section";
import { ProjectIndex } from "@/components/projects/ProjectIndex";
import { ProjectList } from "@/components/projects/ProjectTile";
import { pageMetadata } from "@/lib/constants/metadata";
import { getProjects } from "@/lib/data/projects";

export const metadata = pageMetadata.projects;

export default async function Page() {
  const projects = await getProjects();

  return (
    <>
      <PageIntro
        eyebrow="Portfolio"
        index="02"
        title={["Selected", "*developments*."]}
        intro={<p>Residential and commercial buildings: upcoming, ongoing and completed.</p>}
      />
      <Section tone="white" spacing="compact" aria-label="Projects">
        <Container>
          {/* The filters read the address; until they load, every project is listed. */}
          <Suspense fallback={<ProjectList projects={projects} />}>
            <ProjectIndex projects={projects} />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}

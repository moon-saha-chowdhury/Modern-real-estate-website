import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { getFeaturedProjects } from "@/lib/data/projects";

/**
 * 03 — Featured projects (obsidian). Editorial mosaic with working filters.
 */
export async function FeaturedProjects() {
  const projects = await getFeaturedProjects();

  return (
    <Section tone="obsidian" aria-labelledby="projects-title">
      <Container className="flex flex-col gap-16 lg:gap-20">
        <SectionHeading
          index="03"
          eyebrow="Selected work"
          titleId="projects-title"
          title={[
            "Places in",
            <>
              the <em className="text-champagne">making.</em>
            </>,
          ]}
          intro={
            <p>
              Residential and commercial buildings at every stage, from land in assessment to homes
              already lived in.
            </p>
          }
        />

        <ProjectShowcase projects={projects} labelledBy="projects-title" />

        <div className="flex justify-start border-t border-line pt-10 md:justify-end">
          <Button href="/projects" variant="outline" icon>
            View all projects
          </Button>
        </div>
      </Container>
    </Section>
  );
}

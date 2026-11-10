import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { Reveal } from "@/components/common/Reveal";
import { WorkCard } from "@/components/projects/WorkCard";
import { getFeaturedProjects } from "@/lib/data/projects";

/**
 * 03 — Selected work. A heading row (title and intro, link to all projects on the right), then
 * one full-width card per featured project, stacked with a narrow gap.
 */
export async function FeaturedProjects() {
  const projects = await getFeaturedProjects();

  return (
    <Section tone="white" aria-labelledby="projects-title">
      <Container className="flex flex-col gap-12 lg:gap-16">
        <header className="grid-editorial items-end gap-y-8">
          <div className="col-span-full flex flex-col gap-6 lg:col-span-6 lg:col-start-3">
            <TextReveal
              as="h2"
              id="projects-title"
              lines={["Selected *work.*"]}
              className="font-display text-display-lg"
            />
            <Reveal>
              <p className="max-w-md text-lead text-fg-muted">
                Residential and commercial buildings at every stage, from land in assessment to
                homes already lived in.
              </p>
            </Reveal>
          </div>
          <Reveal className="col-span-full flex lg:col-span-4 lg:col-start-9 lg:justify-end">
            <Button href="/projects" variant="outline" icon>
              View all projects
            </Button>
          </Reveal>
        </header>

        <ul className="flex flex-col gap-5" aria-label="Featured projects">
          {projects.map((project) => (
            <li key={project.id}>
              <WorkCard project={project} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

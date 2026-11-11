import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/common/Button";
import { PageIntro } from "@/components/common/PageIntro";
import { SampleBadge } from "@/components/common/SampleBadge";
import { ProjectAmenities } from "@/components/projects/ProjectAmenities";
import { ProjectCta } from "@/components/projects/ProjectCta";
import { ProjectFloorPlans } from "@/components/projects/ProjectFloorPlans";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectHeroImage } from "@/components/projects/ProjectHeroImage";
import { ProjectLocation } from "@/components/projects/ProjectLocation";
import { ProjectOverview } from "@/components/projects/ProjectOverview";
import { ProjectTour } from "@/components/projects/ProjectTour";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/constants/projects";
import { getProject, getProjects } from "@/lib/data/projects";

/**
 * Project detail route. Every section after the lead photograph renders only when the project
 * has the data for it, so a sparse record (like the samples) still makes a clean page.
 */
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return { title: project.name, description: project.summary };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const all = await getProjects();
  const next = all[(all.findIndex((p) => p.id === project.id) + 1) % all.length];

  return (
    <>
      <PageIntro
        eyebrow={`${CATEGORY_LABELS[project.category]} · ${STATUS_LABELS[project.status]}`}
        title={[project.name]}
        intro={<p>{project.summary}</p>}
      >
        <div className="flex flex-wrap items-center gap-6">
          {project.isPlaceholder && (
            <SampleBadge label="Sample project" className="text-fg-muted" />
          )}
          <Button href="/projects" variant="text">
            Back to projects
          </Button>
        </div>
      </PageIntro>
      <ProjectHeroImage project={project} />
      <ProjectOverview project={project} />
      <ProjectTour project={project} />
      <ProjectGallery project={project} />
      <ProjectFloorPlans project={project} />
      <ProjectAmenities project={project} />
      <ProjectLocation project={project} />
      <ProjectCta project={project} next={next.id === project.id ? undefined : next} />
    </>
  );
}

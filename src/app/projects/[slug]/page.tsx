import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/common/Button";
import { PageIntro } from "@/components/common/PageIntro";
import { SampleBadge } from "@/components/common/SampleBadge";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/constants/projects";
import { getProject, getProjects } from "@/lib/data/projects";

/**
 * Project detail route. Milestone 4 stub so every portfolio link resolves; the full experience
 * (hero, overview, gallery, floor plans, tour, location, enquiry) is built in Milestone 5.
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

  return (
    <PageIntro
      eyebrow={`${CATEGORY_LABELS[project.category]} · ${STATUS_LABELS[project.status]}`}
      title={[project.name]}
      intro={<p>{project.summary}</p>}
    >
      <div className="flex flex-wrap items-center gap-6">
        {project.isPlaceholder && <SampleBadge label="Sample project" className="text-mist" />}
        <SampleBadge label="Full details — Milestone 5" className="text-mist" />
        <Button href="/projects" variant="text">
          Back to projects
        </Button>
      </div>
    </PageIntro>
  );
}

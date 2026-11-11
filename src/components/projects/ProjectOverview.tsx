import { Container } from "@/components/common/Container";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/constants/projects";
import type { ProjectSectionProps } from "@/types/sections";

/** Description on the left, a hairline-ruled fact sheet on the right (only the facts we have). */
export function ProjectOverview({ project }: ProjectSectionProps) {
  const facts: [string, string][] = [
    ["Status", STATUS_LABELS[project.status]],
    ["Type", CATEGORY_LABELS[project.category]],
    ["Location", project.location],
  ];
  if (project.landArea) facts.push(["Land area", project.landArea]);
  if (project.totalFloors) facts.push(["Floors", String(project.totalFloors)]);
  if (project.totalUnits) facts.push(["Homes", String(project.totalUnits)]);
  if (project.apartmentSizes) facts.push(["Apartment sizes", project.apartmentSizes]);
  if (project.completionInformation) {
    facts.push(["Completion", project.completionInformation.label]);
    if (project.completionInformation.architect) {
      facts.push(["Architect", project.completionInformation.architect]);
    }
  }

  return (
    <Section tone="white" aria-labelledby="overview-title">
      <Container grid className="gap-y-12">
        <TextReveal
          as="h2"
          id="overview-title"
          className="col-span-full font-display text-display-lg lg:col-span-5"
          lines={["About", "the *project.*"]}
        />
        <div className="col-span-full flex flex-col gap-12 lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="text-lead text-fg-muted">{project.description}</p>
          </Reveal>
          <dl className="border-t border-rule">
            {facts.map(([label, value]) => (
              <Reveal
                key={label}
                className="grid grid-cols-[8rem_1fr] gap-4 border-b border-rule py-4 md:grid-cols-[11rem_1fr]"
              >
                <dt className="label-mono text-fg-muted">{label}</dt>
                <dd className="text-fg">{value}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}

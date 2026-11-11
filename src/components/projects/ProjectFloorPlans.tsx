import Image from "next/image";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { TextReveal } from "@/components/common/TextReveal";
import type { ProjectSectionProps } from "@/types/sections";

/** One row per plan: the drawing, then its name and numbers. Only when plans exist. */
export function ProjectFloorPlans({ project }: ProjectSectionProps) {
  if (project.floorPlans.length === 0) return null;

  return (
    <Section tone="white" aria-labelledby="plans-title">
      <Container className="flex flex-col gap-12">
        <TextReveal
          as="h2"
          id="plans-title"
          className="font-display text-display-lg lg:ml-[calc(100%/6)]"
          lines={["Floor *plans.*"]}
        />
        <ul className="border-t border-rule">
          {project.floorPlans.map((plan) => (
            <li
              key={plan.id}
              className="grid gap-6 border-b border-rule py-8 md:grid-cols-12 md:items-center"
            >
              <div className="relative aspect-4/3 bg-paper md:col-span-5">
                <Image
                  src={plan.image.src}
                  alt={plan.image.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 94vw"
                  className="object-contain p-4"
                />
              </div>
              <div className="flex flex-col gap-3 md:col-span-6 md:col-start-7">
                <h3 className="font-display text-display-sm">{plan.name}</h3>
                <p className="label-mono text-fg-muted">
                  {plan.bedrooms} bed · {plan.bathrooms} bath · {plan.areaSqft.toLocaleString("en")}{" "}
                  sq ft
                </p>
                {plan.downloadUrl && (
                  <a
                    href={plan.downloadUrl}
                    className="self-start border-b border-current/40 pb-0.5 text-small hover:border-current"
                  >
                    Download the plan (PDF)
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

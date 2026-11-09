import type { ProcessStage } from "@/types/content";

/** Development process stages. Stage names come from the brief; descriptions are draft copy. */
export const processStages: ProcessStage[] = [
  {
    id: "land",
    title: "Land Assessment",
    description: "Title, soil, access and zoning reviewed before any commitment is made.",
  },
  {
    id: "concept",
    title: "Concept & Planning",
    description: "Site potential tested through massing studies and a feasible unit mix.",
  },
  {
    id: "design",
    title: "Architectural Design",
    description: "Plans, elevations and materials developed into one coordinated design.",
  },
  {
    id: "approvals",
    title: "Engineering & Approvals",
    description: "Structural and services design completed; statutory approvals secured.",
  },
  {
    id: "construction",
    title: "Construction",
    description: "Foundation to rooftop, with stage inspections and progress reporting.",
  },
  {
    id: "handover",
    title: "Handover",
    description: "Snagging, documentation and keys, followed by after-handover support.",
  },
];

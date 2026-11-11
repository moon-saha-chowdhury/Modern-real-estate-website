import type { ExpertiseItem } from "@/types/content";
import { media } from "./media";

/**
 * Capabilities. ⚠ DRAFT COPY: describes the services named in the brief.
 * Replace with Meridian's own wording when supplied.
 */
export const expertise: ExpertiseItem[] = [
  {
    id: "residential",
    title: "Residential Development",
    summary:
      "Homes planned around light, privacy and how families actually live: apartments designed from the floor plan outwards.",
    points: [
      "Apartment buildings and townhouses",
      "Unit mixes tested against the plot",
      "Homes handed over with a full documentation pack",
    ],
    image: media.interiorLiving,
  },
  {
    id: "commercial",
    title: "Commercial Development",
    summary:
      "Workplaces and mixed-use buildings with efficient floor plates, durable materials and street-level presence.",
    points: [
      "Offices and mixed-use buildings",
      "Efficient, flexible floor plates",
      "Ground floors planned for street life",
    ],
    image: media.expertiseCommercial,
  },
  {
    id: "architecture",
    title: "Architecture & Planning",
    summary:
      "Massing, orientation and circulation resolved early, so every later decision has a clear framework to follow.",
    points: [
      "Massing, orientation and circulation studies",
      "Plans, elevations and materials in one set",
      "Design reviews before every major decision",
    ],
    image: media.expertiseArchitecture,
  },
  {
    id: "construction",
    title: "Construction & Engineering",
    summary:
      "Structural engineering and site execution held to drawings and tolerances, inspected stage by stage.",
    points: [
      "Structural and services engineering",
      "Site execution held to the drawings",
      "Stage-by-stage inspections and reports",
    ],
    image: media.projectConcreteBalconies,
  },
  {
    id: "management",
    title: "Project Management",
    summary:
      "One accountable team coordinating design, approvals, procurement and handover against a published schedule.",
    points: [
      "One accountable team from design to handover",
      "Published schedules and progress reports",
      "Procurement and cost control",
    ],
    image: media.projectGeometricFacade,
  },
  {
    id: "landowner",
    title: "Landowner Partnership",
    summary:
      "Joint development with landowners on clear, documented terms, from feasibility through to shared handover.",
    points: [
      "Joint development on documented terms",
      "Title, soil, access and zoning reviewed first",
      "Owners share in what is built",
    ],
    image: media.projectConcreteEdge,
  },
];

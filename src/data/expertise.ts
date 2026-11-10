import type { ExpertiseItem } from "@/types/content";
import type { MediaImage } from "@/types/project";
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
    image: media.expertiseResidential,
  },
  {
    id: "commercial",
    title: "Commercial Development",
    summary:
      "Workplaces and mixed-use buildings with efficient floor plates, durable materials and street-level presence.",
    image: media.expertiseCommercial,
  },
  {
    id: "architecture",
    title: "Architecture & Planning",
    summary:
      "Massing, orientation and circulation resolved early, so every later decision has a clear framework to follow.",
    image: media.expertiseArchitecture,
  },
  {
    id: "construction",
    title: "Construction & Engineering",
    summary:
      "Structural engineering and site execution held to drawings and tolerances, inspected stage by stage.",
    image: media.expertiseConstruction,
  },
  {
    id: "management",
    title: "Project Management",
    summary:
      "One accountable team coordinating design, approvals, procurement and handover against a published schedule.",
    image: media.expertiseManagement,
  },
  {
    id: "landowner",
    title: "Landowner Partnership",
    summary:
      "Joint development with landowners on clear, documented terms, from feasibility through to shared handover.",
    image: media.expertiseLand,
  },
];

/**
 * Photographs for the homepage "From land to landmark" section, in display order:
 * wide, narrow, narrow, wide. Chosen from the sample registry for the site's cool, dusk palette.
 */
export const expertisePhotos: MediaImage[] = [
  media.projectNightTower,
  media.expertiseCommercial,
  media.expertiseArchitecture,
  media.projectGlassBalconies,
];

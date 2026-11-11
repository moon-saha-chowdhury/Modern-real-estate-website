import type { Partner, Testimonial } from "@/types/content";

/**
 * ⚠ SAMPLE quotes written for the demo site, not from real clients. Replace with real quotes
 * (published with the client's written permission) and remove `isSample`.
 */
export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    quote:
      "Every plan was resolved before a single wall went up, and it shows: the morning light reaches the back of the flat.",
    author: "A. K.",
    role: "Homeowner, sample quote",
    isSample: true,
  },
  {
    id: "t-2",
    quote:
      "They treated our plot as a shared project, with clear documents, honest timelines and no surprises at handover.",
    author: "M. R.",
    role: "Landowner partner, sample quote",
    isSample: true,
  },
  {
    id: "t-3",
    quote:
      "Our floor plates are bright, quiet and easy to fit out. The building team answered every question on site.",
    author: "S. T.",
    role: "Office tenant, sample quote",
    isSample: true,
  },
];

/** ⚠ SAMPLE partners (invented names, no logos). Replace with real partners and their logos. */
export const partners: Partner[] = [
  { id: "p-1", name: "Arden Architects", isSample: true },
  { id: "p-2", name: "Halvorsen Structures", isSample: true },
  { id: "p-3", name: "Northgate Materials", isSample: true },
  { id: "p-4", name: "Clearwater Services", isSample: true },
  { id: "p-5", name: "Bramley Surveyors", isSample: true },
];

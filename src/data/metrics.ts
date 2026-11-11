import type { Metric } from "@/types/content";

/**
 * Company statistics. ⚠ SAMPLE FIGURES: invented for the demo site and shown with a "Sample
 * figures" label. Replace with Meridian's verified numbers (set `metricsAreSample` to false),
 * or set a value to null to show a labelled blank instead.
 */
export const metrics: Metric[] = [
  { id: "completed", label: "Completed projects", value: 14 },
  { id: "developments", label: "Total developments", value: 22 },
  { id: "area", label: "Built-up area", value: 850, suffix: "k sq ft" },
  { id: "years", label: "Years of experience", value: 15, suffix: "+" },
];

export const metricsAreSample = true;

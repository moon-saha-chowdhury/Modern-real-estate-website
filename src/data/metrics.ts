import type { Metric } from "@/types/content";

/**
 * Company statistics. Values are intentionally null: the master prompt forbids presenting
 * mock numbers as real achievements. Fill in verified figures from Meridian to display them.
 */
export const metrics: Metric[] = [
  { id: "completed", label: "Completed projects", value: null },
  { id: "developments", label: "Total developments", value: null },
  { id: "area", label: "Built-up area", value: null, suffix: " sq ft" },
  { id: "years", label: "Years of experience", value: null },
];

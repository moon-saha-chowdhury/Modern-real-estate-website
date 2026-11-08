import type { SectionTone, Surface } from "@/types/ui";

/** Whether a section tone is a dark or light surface. */
export function surfaceOf(tone: SectionTone): Surface {
  return tone === "ivory" ? "light" : "dark";
}

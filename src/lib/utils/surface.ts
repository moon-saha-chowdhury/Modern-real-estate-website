import { DARK_TONES } from "@/lib/constants/ui";
import type { SectionTone, Surface } from "@/types/ui";

/** Whether a section tone is a dark or light surface. */
export function surfaceOf(tone: SectionTone): Surface {
  return DARK_TONES.includes(tone) ? "dark" : "light";
}

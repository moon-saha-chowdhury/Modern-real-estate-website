import { SECTION_TONE_CLASSES } from "@/lib/constants/ui";
import { cn } from "@/lib/utils/cn";
import { surfaceOf } from "@/lib/utils/surface";
import type { SectionProps } from "@/types/ui";

/**
 * Page section with a deliberate surface colour.
 * Exposes `data-surface` (dark|light) and `data-tone` so children and the navbar can adapt.
 */
export function Section({
  tone = "obsidian",
  spacing = "default",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      data-tone={tone}
      data-surface={surfaceOf(tone)}
      className={cn(
        "relative isolate",
        SECTION_TONE_CLASSES[tone],
        spacing === "default" && "py-section",
        spacing === "compact" && "py-[calc(var(--spacing-section)*0.6)]",
        className,
      )}
      {...props}
    />
  );
}

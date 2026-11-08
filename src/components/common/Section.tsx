import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

export type SectionTone = "obsidian" | "forest" | "charcoal" | "ivory";

const tones: Record<SectionTone, string> = {
  obsidian: "bg-obsidian text-ivory",
  forest: "bg-forest text-ivory",
  charcoal: "bg-charcoal text-ivory",
  ivory: "bg-ivory text-obsidian",
};

export function surfaceOf(tone: SectionTone) {
  return tone === "ivory" ? "light" : "dark";
}

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  tone?: SectionTone;
  /** Vertical rhythm. `none` for full-bleed compositions that manage their own spacing. */
  spacing?: "default" | "compact" | "none";
}

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
        tones[tone],
        spacing === "default" && "py-section",
        spacing === "compact" && "py-[calc(var(--spacing-section)*0.6)]",
        className,
      )}
      {...props}
    />
  );
}

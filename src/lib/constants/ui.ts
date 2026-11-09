import type { ButtonVariant, SectionTone, Surface } from "@/types/ui";

/**
 * Background for each section tone. Text colours come from the semantic tokens (text-fg …),
 * which resolve from the section's data-surface; --surface lets inner panels match the tone.
 */
export const SECTION_TONE_CLASSES: Record<SectionTone, string> = {
  paper: "bg-paper text-fg [--surface:var(--color-paper)]",
  stone: "bg-stone text-fg [--surface:var(--color-stone)]",
  white: "bg-white text-fg [--surface:var(--color-white)]",
  forest: "bg-forest text-fg [--surface:var(--color-forest)]",
};

export const SECTION_TONES: SectionTone[] = ["paper", "stone", "white", "forest"];

/** Tones that render as dark surfaces (everything else is light). */
export const DARK_TONES: SectionTone[] = ["forest"];

/** Button colour treatments per variant and surface. */
export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, Record<Surface, string>> = {
  primary: {
    light: "bg-ink text-paper hover:bg-forest",
    dark: "bg-ivory text-ink hover:bg-champagne",
  },
  // Outline and text buttons follow the semantic colours, so they adapt to whatever surface
  // they sit on (e.g. the navbar CTA over the blue hero and over paper).
  outline: {
    light: "border border-fg/30 text-fg hover:border-fg/80",
    dark: "border border-fg/30 text-fg hover:border-fg/80",
  },
  text: {
    light: "text-fg",
    dark: "text-fg",
  },
};

/** Emphasis inside display lines: deep champagne (bronze) on light, champagne on dark. */
export const EMPHASIS_CLASS = "text-accent";

/** Footer link styling, shared across footer columns. */
export const FOOTER_LINK_CLASS =
  "inline-block py-1 text-small text-fg/75 transition-colors duration-300 hover:text-fg focus-visible:text-fg";

/** Placeholder slots shown until real partner logos are supplied. */
export const PARTNER_PLACEHOLDER_SLOTS = 5;

/** Shared input styling: underline fields, no boxes. Underline meets 3:1 on white panels. */
export const FIELD_INPUT_CLASS =
  "w-full border-0 border-b border-rule-strong bg-transparent px-0 py-3 text-fg placeholder:text-fg/40 transition-colors duration-300 focus:border-brand focus:outline-none aria-[invalid=true]:border-danger";

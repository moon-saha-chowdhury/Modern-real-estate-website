import type { ButtonVariant, SectionTone, Surface } from "@/types/ui";

/** Background + text colour for each section tone. */
export const SECTION_TONE_CLASSES: Record<SectionTone, string> = {
  obsidian: "bg-obsidian text-ivory",
  forest: "bg-forest text-ivory",
  charcoal: "bg-charcoal text-ivory",
  ivory: "bg-ivory text-obsidian",
};

export const SECTION_TONES: SectionTone[] = ["obsidian", "forest", "charcoal", "ivory"];

/** Button colour treatments per variant and surface. */
export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, Record<Surface, string>> = {
  primary: {
    dark: "bg-ivory text-obsidian hover:bg-champagne",
    light: "bg-obsidian text-ivory hover:bg-forest",
  },
  outline: {
    dark: "border border-ivory/25 text-ivory hover:border-ivory/80",
    light: "border border-obsidian/25 text-obsidian hover:border-obsidian/80",
  },
  text: {
    dark: "text-ivory",
    light: "text-obsidian",
  },
};

/** Footer link styling, shared across footer columns. */
export const FOOTER_LINK_CLASS =
  "text-small text-ivory/70 transition-colors duration-300 hover:text-ivory focus-visible:text-ivory";

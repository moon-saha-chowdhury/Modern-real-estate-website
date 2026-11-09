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

/** Emphasis inside display lines: champagne on dark surfaces, sage on ivory. */
export const EMPHASIS_CLASS = "text-champagne in-data-[surface=light]:text-sage";

/** Footer link styling, shared across footer columns. */
export const FOOTER_LINK_CLASS =
  "inline-block py-1 text-small text-ivory/70 transition-colors duration-300 hover:text-ivory focus-visible:text-ivory";

/** Placeholder slots shown until real partner logos are supplied. */
export const PARTNER_PLACEHOLDER_SLOTS = 5;

/** Shared input styling: underline fields, no boxes. */
export const FIELD_INPUT_CLASS =
  "w-full border-0 border-b border-ivory/25 bg-transparent px-0 py-3 text-ivory placeholder:text-ivory/30 transition-colors duration-300 focus:border-champagne focus:outline-none aria-[invalid=true]:border-danger";

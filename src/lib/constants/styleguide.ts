import type { ColourSwatch, TypeSpecimen } from "@/types/ui";

/** Palette shown on /styleguide. Mirrors src/styles/tokens.css. */
export const COLOUR_SWATCHES: ColourSwatch[] = [
  {
    name: "Obsidian",
    token: "obsidian",
    hex: "#101713",
    role: "Primary dark",
    swatchClass: "bg-obsidian",
  },
  {
    name: "Forest",
    token: "forest",
    hex: "#1E3027",
    role: "Deep forest",
    swatchClass: "bg-forest",
  },
  {
    name: "Charcoal",
    token: "charcoal",
    hex: "#141914",
    role: "Secondary dark",
    swatchClass: "bg-charcoal",
  },
  {
    name: "Sage",
    token: "sage",
    hex: "#647C62",
    role: "Muted accent · large type",
    swatchClass: "bg-sage",
  },
  {
    name: "Brand",
    token: "brand",
    hex: "#337418",
    role: "Deliberate accent",
    swatchClass: "bg-brand",
  },
  {
    name: "Champagne",
    token: "champagne",
    hex: "#C2B99F",
    role: "Editorial highlight",
    swatchClass: "bg-champagne",
  },
  {
    name: "Ivory",
    token: "ivory",
    hex: "#F1EFE7",
    role: "Light surface · text",
    swatchClass: "bg-ivory",
  },
  { name: "Mist", token: "mist", hex: "#A5AAA1", role: "Secondary text", swatchClass: "bg-mist" },
  { name: "Line", token: "line", hex: "#303A32", role: "Borders", swatchClass: "bg-line" },
];

export const TYPE_SPECIMENS: TypeSpecimen[] = [
  { label: "Display XL", className: "text-display-xl", sample: "Shaping", emphasis: "tomorrow" },
  {
    label: "Display LG",
    className: "text-display-lg",
    sample: "Selected",
    emphasis: "developments",
  },
  {
    label: "Display MD",
    className: "text-display-md",
    sample: "From land to",
    emphasis: "landmark",
  },
  {
    label: "Display SM",
    className: "text-display-sm",
    sample: "Engineering",
    emphasis: "excellence",
  },
];

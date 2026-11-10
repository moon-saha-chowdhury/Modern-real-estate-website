/**
 * Homepage "From land to landmark": four photographs, the first and last wide, the middle two
 * narrow. From lg they scroll up over the pinned cards, laid out in flow with these widths,
 * positions and overlaps (negative top margins keep the gaps tight). Below lg, and with reduced
 * motion, they form a two-column collage: wide, narrow + narrow, wide.
 */
export const EXPERTISE_PHOTO_CLASSES = [
  { frame: "col-span-2 lg:w-[44%] lg:ml-0", image: "aspect-4/3" },
  { frame: "lg:w-[25%] lg:ml-[71%] lg:-mt-[13%]", image: "aspect-4/5" },
  { frame: "lg:w-[29%] lg:ml-[7%] lg:-mt-[9%]", image: "aspect-4/5" },
  { frame: "col-span-2 lg:w-[46%] lg:ml-[50%] lg:-mt-[12%]", image: "aspect-4/3" },
] as const;

/** Vertical stagger of the pinned cards, per column (three columns at lg). */
export const EXPERTISE_CARD_OFFSET_CLASSES = ["lg:mt-0", "lg:mt-5", "lg:mt-10"] as const;

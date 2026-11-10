/**
 * Homepage "From land to landmark" (lg+): the photographs scroll up over the pinned cards.
 * One entry per photograph, repeating: width and horizontal position within the container.
 */
export const EXPERTISE_FLOAT_CLASSES = [
  "w-[34%] ml-0",
  "w-[26%] ml-[66%]",
  "w-[30%] ml-[30%]",
  "w-[24%] ml-[4%]",
  "w-[36%] ml-[58%]",
  "w-[28%] ml-[22%]",
] as const;

/** Vertical stagger of the pinned cards, per column (three columns at lg). */
export const EXPERTISE_CARD_OFFSET_CLASSES = ["lg:mt-0", "lg:mt-5", "lg:mt-10"] as const;

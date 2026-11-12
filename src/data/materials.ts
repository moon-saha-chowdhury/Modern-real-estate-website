import type { Material } from "@/types/content";
import { media } from "./media";

/**
 * Materials strip on the homepage. ⚠ DRAFT COPY: the photographs are sample stock images and the
 * notes describe the kind of specification Meridian would name, not a real bill of materials.
 */
export const materials: Material[] = [
  {
    id: "travertine",
    name: "Travertine",
    note: "Honed and laid in long courses, so the veining runs on from one slab to the next.",
    image: media.materialTravertine,
  },
  {
    id: "oak",
    name: "Oak",
    note: "Wide planks, oiled rather than lacquered, so the floor ages instead of wearing.",
    image: media.materialOak,
  },
  {
    id: "marble",
    name: "Marble",
    note: "Book-matched in the bathrooms, with every slab chosen before it is cut.",
    image: media.materialMarble,
  },
  {
    id: "glass",
    name: "Glass",
    note: "Low-iron and floor to ceiling, specified for daylight first and views second.",
    image: media.materialGlass,
  },
];

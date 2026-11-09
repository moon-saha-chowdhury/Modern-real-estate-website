import type { MediaImage } from "@/types/project";

/**
 * Sample photography registry.
 * ⚠ ALL images here are Unsplash stock (Unsplash License), standing in for Meridian's own
 * photography. Each is flagged `isSample` with a credit and is labelled in the UI.
 * Verified free-licence (not Unsplash+) on 2026-11-09.
 */

const UNSPLASH_WIDTH = 2400;

function unsplash(
  id: string,
  ratio: number,
  alt: string,
  author: string,
  page: string,
): MediaImage {
  return {
    src: `https://images.unsplash.com/${id}?auto=format&fit=max&w=${UNSPLASH_WIDTH}&q=80`,
    width: UNSPLASH_WIDTH,
    height: Math.round(UNSPLASH_WIDTH / ratio),
    alt,
    isSample: true,
    credit: { author, url: `https://unsplash.com/photos/${page}`, source: "Unsplash" },
  };
}

export const media = {
  /* ---------- Brand ---------- */
  brandIntro: unsplash(
    "photo-1743760676341-ac13322116ad",
    4554 / 8096,
    "Sunlight and shadow falling across a concrete staircase",
    "Aleksandr Zaitsev",
    "shadow-and-sunlight-cast-upon-a-concrete-staircase-xDV6YuFBkAo",
  ),
  contact: unsplash(
    "photo-1759604218664-f4f714869555",
    6000 / 4000,
    "A modern building at night, lit only from within",
    "Valentin Klopfenstein",
    "modern-glass-building-illuminated-at-night-fvLB04BlhUk",
  ),
  interiorLiving: unsplash(
    "photo-1772797583328-f83bc3f94f80",
    2208 / 2760,
    "A calm living room with natural light and timber shelving",
    "Puscas Adryan",
    "modern-living-room-with-natural-light-and-wooden-accents-2cfj0Y5ch00",
  ),

  /* ---------- Sample project exteriors ---------- */
  projectGlassBalconies: unsplash(
    "photo-1624204386084-dd8c05e32226",
    6956 / 4642,
    "Apartment building with glass balconies against a soft pink evening sky",
    "Tobias Wilden",
    "apartment-building-reflecting-pink-sky-4453DIQWtsQ",
  ),
  projectNightTower: unsplash(
    "photo-1662569156439-8d3a5c3123fd",
    2865 / 4091,
    "A residential tower at night with warm light glowing from every floor",
    "Towfiq islam",
    "a-tall-building-with-many-windows-EyBgE1pPS6s",
  ),
  projectConcreteEdge: unsplash(
    "photo-1504183076530-34da727624a3",
    3024 / 3780,
    "The sharp corner of a minimalist concrete building against a pale sky",
    "Ishtiaque Hossain",
    "architectural-photography-of-edge-of-building-Hjmq9bRnKFc",
  ),
  projectConcreteBalconies: unsplash(
    "photo-1763269584601-bf56c0148aa5",
    2747 / 4120,
    "A concrete facade of staggered, repeating balconies",
    "Jisang Jung",
    "modern-concrete-building-with-repeating-balcony-patterns-HB1kt6cVz2E",
  ),
  projectOfficeSunset: unsplash(
    "photo-1778961419928-2968ddd57c05",
    2069 / 3121,
    "An office building of glass and brick in late afternoon light",
    "Linus Belanger",
    "modern-office-building-with-glass-and-brick-facade-z-XlxM2vAPY",
  ),
  projectGeometricFacade: unsplash(
    "photo-1792767970593-7973dda4e263",
    3024 / 4032,
    "A commercial building with a geometric patterned glass facade",
    "Rowan Heuvel",
    "modern-building-with-geometric-glass-facade-DqFmfLG5p8o",
  ),

  /* ---------- Expertise ---------- */
  expertiseResidential: unsplash(
    "photo-1595330449916-e7c3e1962bd3",
    4635 / 3480,
    "A brick apartment building with balconies under a bright sky",
    "Anders Holm-Jensen",
    "brown-concrete-building-under-blue-sky-during-daytime-urYCLa2G4Lg",
  ),
  expertiseCommercial: unsplash(
    "photo-1745015446589-7ee6f702d8c1",
    4000 / 6000,
    "A reflective glass office facade",
    "Fabian Kleiser",
    "glass-facade-of-a-modern-office-building-V5vF94h52r0",
  ),
  expertiseArchitecture: unsplash(
    "photo-1653164579768-ea97833b3b03",
    4272 / 2848,
    "A white architectural scale model on a white surface",
    "Fernando Andrade",
    "a-model-of-a-building-on-a-white-surface-XjNnftIsI-g",
  ),
  expertiseConstruction: unsplash(
    "photo-1695067441231-a76a08f1ab89",
    3905 / 5840,
    "A building under construction beside a tower crane",
    "Martti Salmi",
    "a-building-under-construction-with-a-crane-in-the-background-PV6p4Lbt8rA",
  ),
  expertiseManagement: unsplash(
    "photo-1684966693180-45b9e18aff8d",
    5328 / 4000,
    "An active construction site seen from above, with a crane and formwork",
    "Gab Audiovisuel",
    "a-construction-site-with-a-crane-in-the-middle-of-it-hhXTjR9RrqY",
  ),
  expertiseLand: unsplash(
    "photo-1780396140356-45d45ad87a0a",
    6012 / 4008,
    "A cleared, level site prepared for development",
    "Jose Manuel Esp",
    "a-barren-construction-site-with-poles-and-dirt-piles-D0WHkzyHMi4",
  ),
} satisfies Record<string, MediaImage>;

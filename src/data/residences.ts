import { EXPLORER_FIRST_LEVEL } from "@/lib/constants/explorer";
import type { Residence, TowerFloor } from "@/types/explorer";

/**
 * SAMPLE residences for the hero's tower explorer (labelled as such on the page). The cutaway is
 * an AI-generated illustration; names, sizes and prices are invented.
 */
export const residences: Residence[] = [
  {
    id: "residence-a",
    name: "Residence A",
    bedrooms: 3,
    bathrooms: 1,
    areaSqft: 1450,
    summary:
      "A corner home with the living room, kitchen and dining in one open space, three bedrooms set apart for quiet, and a balcony that runs the full width of the plan.",
    image: {
      src: "/media/explorer/residence-b.webp",
      alt: "Cutaway view from above of a three-bedroom apartment: open living room and kitchen, three bedrooms, a bathroom and a long glass balcony.",
      width: 2880,
      height: 1607,
    },
    rooms: [
      {
        id: "living",
        label: "Living room",
        note: "Opens onto the balcony through full-height glass.",
        x: 0.355,
        y: 0.455,
        tourRoom: "living",
      },
      {
        id: "kitchen",
        label: "Kitchen & dining",
        note: "A stone island with seating, and a table for six beside it.",
        x: 0.465,
        y: 0.31,
        tourRoom: "dining",
      },
      {
        id: "primary",
        label: "Primary bedroom",
        note: "Set at the quiet end of the plan, with a walk-in wardrobe.",
        x: 0.735,
        y: 0.475,
        tourRoom: "bedroom",
      },
      {
        id: "bathroom",
        label: "Bathroom",
        note: "Walk-in shower, stone vanity and a window for daylight.",
        x: 0.625,
        y: 0.325,
        tourRoom: "bathroom",
      },
      {
        id: "balcony",
        label: "Balcony",
        note: "Glass-fronted, deep enough for a table and chairs.",
        x: 0.39,
        y: 0.665,
        tourRoom: "balcony",
      },
    ],
  },
];

/** Twenty residential floors, lowest first. Sample prices rise with the view. */
export const towerFloors: TowerFloor[] = Array.from({ length: 20 }, (_, i) => ({
  level: EXPLORER_FIRST_LEVEL + i,
  residenceId: "residence-a",
  priceFrom: 1_100_000 + i * 45_000,
}));

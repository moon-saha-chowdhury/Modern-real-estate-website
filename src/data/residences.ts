import { EXPLORER_FIRST_LEVEL } from "@/lib/constants/explorer";
import type { Residence, ResidenceRoom, TowerFloor } from "@/types/explorer";
import type { PanoramaHotspot, PanoramaScene } from "@/types/project";

const DIR = "/media/explorer/residence-a";
const CLIPS = "/media/explorer/clips";

const rooms: ResidenceRoom[] = [
  {
    id: "living",
    clip: `${CLIPS}/living`,
    label: "Living room",
    note: "Opens onto the balcony through full-height glass.",
    x: 0.355,
    y: 0.455,
  },
  {
    id: "kitchen",
    clip: `${CLIPS}/kitchen`,
    label: "Kitchen & dining",
    note: "A stone island with seating, and a table for six beside it.",
    x: 0.465,
    y: 0.31,
  },
  {
    id: "bedroom",
    clip: `${CLIPS}/bedroom`,
    label: "Primary bedroom",
    note: "Set at the quiet end of the plan, with a walk-in wardrobe.",
    x: 0.735,
    y: 0.475,
  },
  {
    id: "bathroom",
    label: "Bathroom",
    note: "Walk-in shower, stone vanity and a window for daylight.",
    x: 0.625,
    y: 0.325,
  },
  {
    id: "balcony",
    clip: `${CLIPS}/balcony`,
    label: "Balcony",
    note: "Glass-fronted, deep enough for a table and chairs.",
    x: 0.39,
    y: 0.665,
  },
];

/** Where each panorama starts looking, and the doorways it shows (degrees, 0 = image centre). */
const views: Record<string, { initialYaw: number; hotspots: PanoramaHotspot[] }> = {
  living: {
    initialYaw: 0,
    hotspots: [
      { toSceneId: "balcony", label: "Balcony", yaw: -135, pitch: -6 },
      { toSceneId: "kitchen", label: "Kitchen & dining", yaw: 72, pitch: -4 },
    ],
  },
  kitchen: {
    initialYaw: -30,
    hotspots: [
      { toSceneId: "living", label: "Living room", yaw: 95, pitch: -8 },
      { toSceneId: "bedroom", label: "Primary bedroom", yaw: 25, pitch: -5 },
      { toSceneId: "bathroom", label: "Bathroom", yaw: -26, pitch: -5 },
    ],
  },
  bedroom: {
    initialYaw: 0,
    hotspots: [
      { toSceneId: "bathroom", label: "Bathroom", yaw: -108, pitch: -5 },
      { toSceneId: "kitchen", label: "Kitchen & dining", yaw: 56, pitch: -5 },
    ],
  },
  bathroom: {
    initialYaw: -20,
    hotspots: [{ toSceneId: "bedroom", label: "Primary bedroom", yaw: 20, pitch: -8 }],
  },
  balcony: {
    initialYaw: 112,
    hotspots: [{ toSceneId: "living", label: "Living room", yaw: -22, pitch: -8 }],
  },
};

/** One 360° scene per room; the cutaway doubles as the tour's mini-map. */
const scenes: PanoramaScene[] = rooms.map((room) => ({
  id: room.id,
  label: room.label,
  description: room.note,
  src: `${DIR}/${room.id}.webp`,
  srcMobile: `${DIR}/${room.id}-2k.webp`,
  mapPoint: { x: room.x * 100, y: room.y * 100 },
  ...views[room.id],
}));

/**
 * SAMPLE residences for the hero's tower explorer (labelled as such on the page). The cutaway
 * and the room panoramas are AI-generated illustrations; names, sizes and prices are invented.
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
      src: "/media/explorer/residence-a.webp",
      alt: "Cutaway view from above of a three-bedroom apartment: open living room and kitchen, three bedrooms, a bathroom and a long glass balcony.",
      width: 2880,
      height: 1607,
    },
    rooms,
    scenes,
  },
];

/** Twenty residential floors, lowest first. Sample prices rise with the view. */
export const towerFloors: TowerFloor[] = Array.from({ length: 20 }, (_, i) => ({
  level: EXPLORER_FIRST_LEVEL + i,
  residenceId: "residence-a",
  priceFrom: 1_100_000 + i * 45_000,
}));

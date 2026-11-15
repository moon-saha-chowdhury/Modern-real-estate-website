import type {
  DesignerTab,
  DesignerView,
  FloorFinish,
  FurnitureCategory,
  Mood,
  WallFinish,
} from "@/types/room3d";

/** Wall paints, named like paints are: soft, muted, in the site's own palette. */
export const WALL_FINISHES: readonly WallFinish[] = [
  { key: "paper", label: "Paper", color: "#f1efe7" },
  { key: "stone", label: "Stone", color: "#e0ddd2" },
  { key: "sand", label: "Sand", color: "#d8c9ae" },
  { key: "clay", label: "Clay", color: "#c4a186" },
  { key: "sage", label: "Sage", color: "#a9b6a0" },
  { key: "forest", label: "Forest", color: "#3f5a45" },
  { key: "slate", label: "Slate", color: "#5b6b7a" },
  { key: "charcoal", label: "Charcoal", color: "#2e312e" },
];

export const FLOOR_FINISHES: readonly FloorFinish[] = [
  { key: "oak", label: "Oak" },
  { key: "travertine", label: "Travertine" },
  { key: "marble", label: "Marble" },
];

/** Three starting looks (wall paint for the living spaces and bedrooms, plus a floor). */
export const MOODS: readonly Mood[] = [
  { id: "warm", label: "Warm", note: "Sand walls, oak floors", wall: "sand", floor: "oak" },
  {
    id: "minimal",
    label: "Minimal",
    note: "Paper walls, travertine floors",
    wall: "paper",
    floor: "travertine",
  },
  { id: "dark", label: "Dark", note: "Charcoal walls, oak floors", wall: "charcoal", floor: "oak" },
];

/** Walls the moods leave alone (a bathroom stays marble and stone). */
export const MOOD_EXEMPT_ROOMS = ["bath"] as const;

/** What the plan starts with. */
export const DEFAULT_WALL = "stone";

export const DESIGNER = {
  /** Furniture snaps to this grid, in metres. */
  snap: 0.05,
  /** Furniture is kept this far inside the walls (centre of an item, minus its half-size). */
  edgeMargin: 0.12,
  /** Seconds a camera move takes. */
  cameraSeconds: 0.9,
  /** Where the camera starts and the limits it keeps to. */
  views: {
    dollhouse: { position: [13.5, 17, 24] as const, target: [6.5, 0, 5.4] as const },
    top: { position: [6.5, 27, 5.5] as const, target: [6.5, 0, 5.4] as const },
  } satisfies Record<DesignerView, { position: readonly number[]; target: readonly number[] }>,
  minDistance: 3,
  maxDistance: 40,
  /** Wall height (as a fraction of full height) between two rooms, and of an outside wall facing the camera. */
  partitionHeight: 0.52,
  kerbHeight: 0.1,
  /** How far above a room the camera sits when a room is focused. */
  focusHeight: 8.5,
  focusBack: 6.5,
} as const;

/** Default look of the glass and frames. */
export const SHELL_COLORS = {
  background: "#e8e6de",
  wallBody: "#f4f2ea",
  outside: "#ebe8df",
  slab: "#f1efe7",
  frame: "#2b2d2b",
  glass: "#bcd3dc",
} as const;

export const FURNITURE_CATEGORIES: readonly { key: FurnitureCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "seating", label: "Seating" },
  { key: "beds", label: "Beds" },
  { key: "tables", label: "Tables" },
  { key: "storage", label: "Storage" },
  { key: "decor", label: "Decor" },
  { key: "lighting", label: "Lighting" },
];

export const DESIGNER_TABS: readonly { key: DesignerTab; label: string }[] = [
  { key: "furniture", label: "Furniture" },
  { key: "finishes", label: "Finishes" },
  { key: "moods", label: "Moods" },
];

export const DESIGNER_VIEWS: readonly { key: DesignerView; label: string }[] = [
  { key: "dollhouse", label: "Dollhouse" },
  { key: "top", label: "Top" },
];

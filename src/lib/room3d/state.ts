import { FLOOR_FINISHES, WALL_FINISHES } from "@/lib/constants/room3d";
import type {
  DesignFinishes,
  FloorKey,
  FurnitureItem,
  PlacedFurniture,
  ResidencePlan,
} from "@/types/room3d";

/** What the visitor has made: the furniture and the finishes. */
export interface Design {
  placed: PlacedFurniture[];
  finishes: DesignFinishes;
}

const round = (value: number) => Math.round(value * 100);

/** A design as a short URL-safe string (items by their place in the catalogue, centimetres). */
export function encodeDesign(design: Design, catalogue: readonly FurnitureItem[]): string {
  const index = new Map(catalogue.map((item, i) => [item.id, i]));
  const payload = {
    p: design.placed
      .filter((piece) => index.has(piece.itemId))
      .map((piece) => [index.get(piece.itemId), round(piece.x), round(piece.z), piece.rotation]),
    w: design.finishes.walls,
    f: design.finishes.floors,
  };
  return btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

/** The reverse; anything that does not check out is dropped (a link may be old or edited). */
export function decodeDesign(
  text: string,
  catalogue: readonly FurnitureItem[],
  plan: ResidencePlan,
): Design | null {
  try {
    const padded = text.replace(/-/g, "+").replace(/_/g, "/");
    const data: unknown = JSON.parse(atob(padded + "=".repeat((4 - (padded.length % 4)) % 4)));
    if (!data || typeof data !== "object") return null;
    const { p, w, f } = data as { p?: unknown; w?: unknown; f?: unknown };
    const placed: PlacedFurniture[] = [];
    if (Array.isArray(p)) {
      p.slice(0, 80).forEach((row: unknown, n) => {
        if (!Array.isArray(row)) return;
        const [i, x, z, rotation] = row as unknown[];
        const item = isNumber(i) ? catalogue[i] : undefined;
        if (!item || !isNumber(x) || !isNumber(z) || !isNumber(rotation)) return;
        const b = plan.bounds;
        placed.push({
          uid: `${item.id}-shared-${n}`,
          itemId: item.id,
          x: Math.min(Math.max(x / 100, b.x), b.x + b.width),
          z: Math.min(Math.max(z / 100, b.z), b.z + b.depth),
          rotation: ((Math.round(rotation) % 4) + 4) % 4,
        });
      });
    }
    const walls: Record<string, string> = {};
    const floors: Record<string, FloorKey> = {};
    for (const room of plan.rooms.filter((candidate) => candidate.styleable)) {
      const wall = (w as Record<string, unknown> | undefined)?.[room.id];
      const floor = (f as Record<string, unknown> | undefined)?.[room.id];
      walls[room.id] = WALL_FINISHES.some((finish) => finish.key === wall)
        ? (wall as string)
        : "stone";
      floors[room.id] = FLOOR_FINISHES.some((finish) => finish.key === floor)
        ? (floor as FloorKey)
        : room.floor;
    }
    return { placed, finishes: { walls, floors } };
  } catch {
    return null;
  }
}

/** The starting design: the plan's own layout, stone walls and each room's own floor. */
export function defaultDesign(plan: ResidencePlan, wall: string): Design {
  const walls: Record<string, string> = {};
  const floors: Record<string, FloorKey> = {};
  for (const room of plan.rooms.filter((candidate) => candidate.styleable)) {
    walls[room.id] = wall;
    floors[room.id] = room.floor;
  }
  return { placed: plan.layout.map((piece) => ({ ...piece })), finishes: { walls, floors } };
}

/** History for undo and redo: the design now, and what came before and after it. */
export interface History {
  past: Design[];
  present: Design;
  future: Design[];
}

export type HistoryAction =
  | { type: "commit"; change: (design: Design) => Design }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "replace"; design: Design };

const LIMIT = 60;

export function historyReducer(state: History, action: HistoryAction): History {
  switch (action.type) {
    case "commit":
      return {
        past: [...state.past, state.present].slice(-LIMIT),
        present: action.change(state.present),
        future: [],
      };
    case "undo": {
      const previous = state.past[state.past.length - 1];
      if (!previous) return state;
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case "redo": {
      const [next, ...rest] = state.future;
      if (!next) return state;
      return { past: [...state.past, state.present], present: next, future: rest };
    }
    case "replace":
      return {
        past: [...state.past, state.present].slice(-LIMIT),
        present: action.design,
        future: [],
      };
  }
}

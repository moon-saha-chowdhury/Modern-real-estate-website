import type { DrawingLayer, DrawingLight, DrawingPath } from "@/types/process";

/**
 * The elevation drawn across the process sheet: a 22-storey tower with a lower wing either side
 * of it, on a plot between two neighbours. The sheet is 1500 × 680 and the building fills most of
 * its height. Each stage adds one layer of lines: plot and context, massing, facade and level
 * marks, structure, a crane, lit windows.
 */
export const DRAWING_SIZE = { width: 1500, height: 680 } as const;

const GROUND = 620;
const PITCH = 24;

const TOWER = { left: 520, right: 780, floors: 22 } as const;
const WING_L = { left: 280, right: 520, floors: 8 } as const;
const WING_R = { left: 780, right: 1040, floors: 6 } as const;
const PLOT = { left: 240, right: 1080 } as const;
const MAST = 1062;

const topOf = (block: { floors: number }) => GROUND - PITCH * block.floors;
const TOWER_TOP = topOf(TOWER);

const range = (count: number, from: number, step: number) =>
  Array.from({ length: count }, (_, i) => from + i * step);
const levelY = (floor: number) => GROUND - PITCH * floor;

/** 1 — the plot: the ground, two neighbours for scale, the boundary, survey ticks, a dimension. */
const plot: DrawingPath[] = [
  { d: `M0 ${GROUND} H1500`, width: 1.5 },
  {
    d: [
      `M40 ${GROUND} V440 H150 V${GROUND}`,
      `M150 ${GROUND} V520 H220 V${GROUND}`,
      `M1120 ${GROUND} V500 H1210 V${GROUND}`,
      `M1210 ${GROUND} V430 H1330 V${GROUND}`,
      `M1330 ${GROUND} V540 H1420 V${GROUND}`,
    ].join(" "),
    width: 1,
    opacity: 0.35,
  },
  {
    d: `M${PLOT.left} ${GROUND} V${GROUND - 14} M${PLOT.right} ${GROUND} V${GROUND - 14}`,
    width: 1,
  },
  { d: `M${PLOT.left} ${GROUND - 14} H${PLOT.right}`, width: 1, dash: "3 7", opacity: 0.5 },
  {
    d: range(27, PLOT.left + 30, 30)
      .map((x) => `M${x} ${GROUND} V${GROUND + 8}`)
      .join(" "),
    width: 1,
    opacity: 0.6,
  },
  {
    d: `M${PLOT.left} ${GROUND + 36} H${PLOT.right} M${PLOT.left} ${GROUND + 28} V${GROUND + 44} M${PLOT.right} ${GROUND + 28} V${GROUND + 44}`,
    width: 1,
    opacity: 0.7,
  },
];

/** 2 — massing: the tower, its two wings, the roof pavilion and a centre line. */
const massing: DrawingPath[] = [
  { d: `M${TOWER.left} ${GROUND} V${TOWER_TOP} H${TOWER.right} V${GROUND}`, width: 1.75 },
  { d: `M${WING_L.left} ${GROUND} V${topOf(WING_L)} H${WING_L.right}`, width: 1.75 },
  { d: `M${WING_R.right} ${GROUND} V${topOf(WING_R)} H${WING_R.left}`, width: 1.75 },
  { d: `M590 ${TOWER_TOP} V${TOWER_TOP - 28} H710 V${TOWER_TOP}`, width: 1.75 },
  { d: `M650 ${GROUND} V${TOWER_TOP - 60}`, width: 1, dash: "2 8", opacity: 0.5 },
];

/** Level marks: datum lines across the sheet and a small label at each. */
const LEVELS = [5, 10, 15, 20];
const levelLines: DrawingPath[] = [
  {
    d: LEVELS.map((k) => `M0 ${levelY(k)} H1500`).join(" "),
    width: 0.75,
    dash: "2 8",
    opacity: 0.4,
  },
];
const levelLabels = LEVELS.map((k) => ({
  x: 12,
  y: levelY(k) - 8,
  text: `L${String(k).padStart(2, "0")}`,
}));

type Block = { left: number; right: number; floors: number };

/** A line at every floor of a block. */
const floorLines = (block: Block) =>
  range(block.floors - 1, 1, 1)
    .map((k) => `M${block.left} ${levelY(k)} H${block.right}`)
    .join(" ");
/** Vertical mullions every 40 units inside a block. */
const mullions = (block: Block) =>
  range(Math.floor((block.right - block.left) / 40) - 1, block.left + 40, 40)
    .map((x) => `M${x} ${topOf(block)} V${GROUND}`)
    .join(" ");

/** 3 — the facade: a line at every floor, mullions, the pavilion's glazing, level marks. */
const facade: DrawingPath[] = [
  ...levelLines,
  { d: floorLines(TOWER), width: 0.75, opacity: 0.55 },
  { d: floorLines(WING_L), width: 0.75, opacity: 0.55 },
  { d: floorLines(WING_R), width: 0.75, opacity: 0.55 },
  { d: mullions(TOWER), width: 0.75, opacity: 0.55 },
  { d: mullions(WING_L), width: 0.75, opacity: 0.55 },
  { d: mullions(WING_R), width: 0.75, opacity: 0.55 },
  {
    d: [620, 650, 680].map((x) => `M${x} ${TOWER_TOP} V${TOWER_TOP - 28}`).join(" "),
    width: 0.75,
    opacity: 0.55,
  },
];

/** 4 — engineering: the tower's core, and bracing across the wings and the tower's base. */
const bay = (x: number, width: number, bottom: number, top: number) =>
  `M${x} ${bottom} L${x + width} ${top} M${x + width} ${bottom} L${x} ${top}`;
const engineering: DrawingPath[] = [
  { d: `M610 ${GROUND} V${TOWER_TOP} M690 ${GROUND} V${TOWER_TOP}`, width: 1.75 },
  {
    d: range(3, WING_L.left, 80)
      .map((x) => bay(x, 80, GROUND, topOf(WING_L)))
      .join(" "),
    width: 1,
    opacity: 0.8,
  },
  {
    d: range(3, WING_R.left, 260 / 3)
      .map((x) => bay(x, 260 / 3, GROUND, topOf(WING_R)))
      .join(" "),
    width: 1,
    opacity: 0.8,
  },
  {
    d: range(4, TOWER.left, 65)
      .map((x) => bay(x, 65, GROUND, GROUND - PITCH * 4))
      .join(" "),
    width: 1,
    opacity: 0.8,
  },
];

/** 5 — construction: a tower crane beside the building, lattice mast, jib and hook. */
const crane: DrawingPath[] = [
  { d: `M${MAST - 6} ${GROUND} V6 M${MAST + 6} ${GROUND} V6`, width: 1.75 },
  {
    d: range(30, 0, 1)
      .map((i) => `${i === 0 ? "M" : "L"}${MAST + (i % 2 === 0 ? -6 : 6)} ${GROUND - i * 20}`)
      .join(" "),
    width: 0.75,
    opacity: 0.7,
  },
  {
    d: `M${MAST} 6 L840 30 M${MAST} 6 L1290 30 M840 30 H1320 M${MAST} 30 V6 M1290 30 V62`,
    width: 1.75,
  },
  { d: `M900 30 V170 M893 170 H907`, width: 1, opacity: 0.8 },
];

/** 6 — handover: lit windows, chosen by a fixed sequence so the drawing never changes. */
function windows(block: Block, count: number, seed: number): DrawingLight[] {
  const columns = Math.floor((block.right - block.left) / 40);
  let state = seed;
  const next = () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
  const taken = new Set<string>();
  const found: DrawingLight[] = [];
  while (found.length < count) {
    const column = Math.floor(next() * columns);
    const floor = Math.floor(next() * block.floors);
    const key = `${column}:${floor}`;
    if (taken.has(key)) continue;
    taken.add(key);
    found.push({
      x: block.left + column * 40 + 13,
      y: GROUND - PITCH * (floor + 1) + 7,
      width: 14,
      height: 10,
    });
  }
  return found;
}
const lights: DrawingLight[] = [
  ...windows(TOWER, 30, 7),
  ...windows(WING_L, 9, 11),
  ...windows(WING_R, 7, 13),
];

export const DRAWING_LAYERS: DrawingLayer[] = [
  { stageId: "land", paths: plot },
  { stageId: "concept", paths: massing },
  { stageId: "design", paths: facade, labels: levelLabels },
  { stageId: "approvals", paths: engineering },
  { stageId: "construction", paths: crane },
  { stageId: "handover", paths: [], lights },
];

/** Springs the scroll progress: critically damped, so the drawing settles without overshoot. */
export const DRAWING_SPRING = {
  stiffness: 110,
  damping: 30,
  mass: 0.5,
  restDelta: 0.0005,
} as const;

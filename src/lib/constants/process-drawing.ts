import type { DrawingLayer, DrawingLight, DrawingPath } from "@/types/process";

/**
 * The elevation drawn beside the six development stages. A tower of 20 floors on a plot, in a
 * 600 × 720 space; each stage adds one layer of lines, so the drawing becomes the building as the
 * list is read: plot, massing, facade, structure, crane, lit windows.
 */
export const DRAWING_SIZE = { width: 600, height: 720 } as const;

const GROUND = 650;
const LEFT = 200;
const RIGHT = 400;
const TOP = 130;
const FLOORS = 20;
const PITCH = (GROUND - TOP) / FLOORS;
const PODIUM_TOP = 566;
const MAST = 440;

const range = (count: number, from: number, step: number) =>
  Array.from({ length: count }, (_, i) => from + i * step);

/** 1 — the plot: ground line, boundary, survey ticks and a dimension line. */
const plot: DrawingPath[] = [
  { d: `M30 ${GROUND} H570`, width: 1.5 },
  { d: `M60 ${GROUND} V${GROUND - 14} M540 ${GROUND} V${GROUND - 14}`, width: 1 },
  { d: `M60 ${GROUND - 14} H540`, width: 1, dash: "3 7", opacity: 0.5 },
  {
    d: range(15, 90, 30)
      .map((x) => `M${x} ${GROUND} V${GROUND + 8}`)
      .join(" "),
    width: 1,
    opacity: 0.6,
  },
  {
    d: `M60 ${GROUND + 36} H540 M60 ${GROUND + 28} V${GROUND + 44} M540 ${GROUND + 28} V${GROUND + 44}`,
    width: 1,
    opacity: 0.7,
  },
];

/** 2 — massing: the tower, its podium, the roof pavilion and a height guide. */
const massing: DrawingPath[] = [
  { d: `M${LEFT} ${GROUND} V${TOP} H${RIGHT} V${GROUND}`, width: 1.5 },
  { d: `M150 ${GROUND} V${PODIUM_TOP} H450 V${GROUND}`, width: 1.5 },
  { d: `M225 ${TOP} V${TOP - 26} H375 V${TOP}`, width: 1.5 },
  { d: `M${RIGHT + 70} ${GROUND} V${TOP - 26}`, width: 1, dash: "2 6", opacity: 0.55 },
  {
    d: `M${RIGHT + 62} ${TOP - 26} H${RIGHT + 78} M${RIGHT + 62} ${GROUND} H${RIGHT + 78}`,
    width: 1,
    opacity: 0.7,
  },
];

/** 3 — the facade: a line at every floor, mullions, podium glazing, pavilion glazing. */
const facade: DrawingPath[] = [
  {
    d: range(FLOORS - 1, 1, 1)
      .map((k) => `M${LEFT} ${GROUND - PITCH * k} H${RIGHT}`)
      .join(" "),
    width: 0.75,
    opacity: 0.55,
  },
  {
    d: [250, 300, 350].map((x) => `M${x} ${TOP} V${PODIUM_TOP}`).join(" "),
    width: 0.75,
    opacity: 0.55,
  },
  {
    d: range(9, 180, 30)
      .map((x) => `M${x} ${PODIUM_TOP} V${GROUND}`)
      .join(" "),
    width: 0.75,
    opacity: 0.55,
  },
  { d: `M275 ${TOP} V${TOP - 26} M325 ${TOP} V${TOP - 26}`, width: 0.75, opacity: 0.55 },
];

/** 4 — engineering: the core, columns and bracing, in the brand colour. */
const engineering: DrawingPath[] = [
  { d: `M280 ${GROUND} V${TOP} M320 ${GROUND} V${TOP}`, width: 1.5, tone: "brand" },
  {
    d: range(5, 150, 75)
      .slice(0, 4)
      .map(
        (x) => `M${x} ${GROUND} L${x + 75} ${PODIUM_TOP} M${x + 75} ${GROUND} L${x} ${PODIUM_TOP}`,
      )
      .join(" "),
    width: 1,
    tone: "brand",
    opacity: 0.85,
  },
  {
    d: range(4, 1, 5)
      .map((k) => `M${LEFT - 8} ${GROUND - PITCH * k * 3} H${LEFT}`)
      .join(" "),
    width: 1,
    tone: "brand",
  },
];

/** 5 — construction: a tower crane beside the building, lattice mast and hook. */
const crane: DrawingPath[] = [
  { d: `M${MAST - 6} ${GROUND} V70 M${MAST + 6} ${GROUND} V70`, width: 1.5 },
  {
    d: range(28, 0, 1)
      .map((i) => `${i === 0 ? "M" : "L"}${MAST + (i % 2 === 0 ? -6 : 6)} ${GROUND - i * 20}`)
      .join(" "),
    width: 0.75,
    opacity: 0.7,
  },
  { d: `M${MAST} 70 V38 M${MAST} 38 L330 70 M${MAST} 38 L548 70 M320 70 H560`, width: 1.5 },
  { d: `M548 70 V100 M360 70 V190`, width: 1, opacity: 0.8 },
];

/** 6 — handover: the lit windows (not paths, so the layer has none to draw). */
const LIT: [floor: number, bay: number][] = [
  [0, 0],
  [2, 2],
  [3, 1],
  [5, 3],
  [6, 0],
  [8, 2],
  [9, 1],
  [11, 3],
  [12, 0],
  [13, 2],
  [14, 1],
  [15, 3],
  [16, 0],
  [17, 2],
  [18, 1],
  [19, 3],
];
const lights: DrawingLight[] = LIT.map(([floor, bay]) => ({
  x: LEFT + bay * 50 + 18,
  y: GROUND - PITCH * (floor + 1) + 8,
  width: 14,
  height: 10,
}));

export const DRAWING_LAYERS: DrawingLayer[] = [
  { stageId: "land", paths: plot },
  { stageId: "concept", paths: massing },
  { stageId: "design", paths: facade },
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

/** Scroll range over which the list drives the drawing (relative to the viewport). */
export const DRAWING_SCROLL_OFFSET = ["start 75%", "end 55%"] as const;

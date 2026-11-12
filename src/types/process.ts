/** One stroke of the process drawing (the building's elevation, drawn in six layers). */
export interface DrawingPath {
  /** SVG path data in the drawing's 600 × 720 space. */
  d: string;
  /** Stroke width in screen pixels (the stroke does not scale with the drawing). */
  width?: number;
  /** A dashed stroke fades in instead of being drawn. */
  dash?: string;
  /** Opacity of the stroke at rest, 0–1. */
  opacity?: number;
}

/** A window that lights up in the last layer. */
export interface DrawingLight {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** A small mono annotation on the drawing (a level mark). */
export interface DrawingLabel {
  x: number;
  y: number;
  text: string;
}

/** What one stage adds to the drawing. */
export interface DrawingLayer {
  stageId: string;
  paths: DrawingPath[];
  lights?: DrawingLight[];
  labels?: DrawingLabel[];
}

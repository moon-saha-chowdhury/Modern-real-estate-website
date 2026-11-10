import type { ReactNode } from "react";
import type { ExpertiseItem, Metric, ProcessStage } from "./content";
import type { MediaImage, Project } from "./project";

/* ---------- Projects ---------- */

/** Full-width "selected work" card on the homepage. */
export interface WorkCardProps {
  project: Project;
}

/* ---------- Home sections ---------- */

export interface ExpertiseListProps {
  items: ExpertiseItem[];
}

export interface ProcessTimelineProps {
  stages: ProcessStage[];
}

export interface MetricValueProps {
  metric: Metric;
}

export interface CountUpProps {
  to: number;
  suffix?: string;
  className?: string;
}

export interface PhotoCreditProps {
  image: MediaImage;
  className?: string;
}

/* ---------- Hero ---------- */

export interface HeroStage {
  /** Video progress (0–1) at which this phase begins. */
  at: number;
  label: string;
}

/** One encoded frame set (desktop or mobile). Each has its own frame rate and therefore count. */
export interface HeroFrameSet {
  /** Public directory holding 0001.webp … */
  dir: string;
  width: number;
  height: number;
  count: number;
  fps: number;
  /** Index of the finished, lit tower: the last frame before the camera starts to move. */
  finishedFrame: number;
}

export interface HeroSequence {
  /** Length of the source footage in seconds. */
  seconds: number;
  /** Footage time at which the tower is finished and the camera rise begins. */
  finishedSeconds: number;
  desktop: HeroFrameSet;
  mobile: HeroFrameSet;
}

/**
 * A floor callout pinned beside the tower (desktop): a dot on the facade, a leader line and a
 * label chip. Positions are fractions of the video frame, so they track the tower at any size.
 */
export interface HeroCallout {
  /** Short mono tag, e.g. "Level 10". */
  tag: string;
  label: string;
  /** Vertical anchor on the tower (0 = top of frame, 1 = bottom). */
  y: number;
  /** Scroll progress (0–1) window in which the callout is shown. */
  from: number;
  to: number;
}

/** Where the scaled frame sits inside the hero, in CSS pixels. */
export interface FrameRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BuildingTransformationProps {
  /** One string per line; *asterisks* mark emphasis. */
  title: string[];
}

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  /** The input / textarea, already wired with id, aria-invalid and aria-describedby. */
  children: ReactNode;
}

export interface EnquiryFormProps {
  /** Pre-selected enquiry type. */
  defaultType?: "project" | "visit" | "landowner" | "general";
}

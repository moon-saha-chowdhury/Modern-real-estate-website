import type { ReactNode } from "react";
import type { ExpertiseItem, LegalSection, Metric, ProcessStage } from "./content";
import type { MediaImage, PanoramaScene, Project } from "./project";

/* ---------- Projects ---------- */

/** The /projects page: every project with category and status filters. */
export interface ProjectIndexProps {
  projects: Project[];
}

/** Closing band on the blue dusk (used by the inner pages and the project page). */
export interface CtaBandProps {
  id: string;
  /** One string per line; *asterisks* mark emphasis. */
  title: string[];
  text: string;
  href: string;
  label: string;
  /** Extra row under the band (the project page's "next project" link). */
  children?: ReactNode;
}

/** A legal page: sections of plain paragraphs. */
export interface LegalPageProps {
  eyebrow: string;
  title: string[];
  intro: string;
  sections: LegalSection[];
}

/** A project detail section that needs only the project. */
export interface ProjectSectionProps {
  project: Project;
}

/** Closing band: enquire about this project, or go to the next one. */
export interface ProjectCtaProps {
  project: Project;
  next?: Project;
}

/** The click-to-load panorama tour (poster first, viewer on demand). */
export interface PanoramaTourProps {
  scenes: PanoramaScene[];
  /** Flat poster shown until the tour is entered. */
  poster: MediaImage;
  /** Floor plan for the mini-map. */
  plan?: MediaImage;
  /** Accessible name, e.g. "The Linden, virtual tour". */
  label: string;
  isIllustrative?: boolean;
}

/** The viewer itself (loaded only after the visitor enters the tour). */
export interface PanoramaViewerProps {
  scenes: PanoramaScene[];
  plan?: MediaImage;
  /** Id of the room to open first (from the `?room=` link). */
  initialRoom?: string;
  label: string;
  onExit: () => void;
  /** Text of the exit button (default "Exit tour"). */
  exitLabel?: string;
  /** Keep `?room=` in the address bar (default true; off where the tour is not the page's subject). */
  syncUrl?: boolean;
}

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

export interface BrandIntroductionProps {
  /**
   * "sky" (default): overlaps the scroll hero and takes over from its open sky.
   * "none": a plain section after a one-screen hero, with the tower backdrop visible throughout.
   */
  handover?: "sky" | "none";
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

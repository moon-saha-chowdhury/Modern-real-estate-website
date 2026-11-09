import type { ReactNode } from "react";
import type { ExpertiseItem, Metric, ProcessStage, ProjectTileVariant } from "./content";
import type { MediaImage, Project } from "./project";

/* ---------- Projects ---------- */

export interface ProjectCardProps {
  project: Project;
  variant: ProjectTileVariant;
  /** Display index, e.g. "01". */
  index: string;
}

export interface ProjectShowcaseProps {
  projects: Project[];
  /** Heading level id the filter group is labelled by. */
  labelledBy: string;
}

export interface ProjectFiltersProps {
  active: string;
  counts: Record<string, number>;
  onChange: (key: string) => void;
  labelledBy: string;
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

export interface BuildingTransformationProps {
  eyebrow: string;
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

import type { MediaImage } from "./project";

/** A Meridian capability (homepage Expertise, /expertise). */
export interface ExpertiseItem {
  id: string;
  title: string;
  summary: string;
  image: MediaImage;
}

/** A stage of the development process timeline. */
export interface ProcessStage {
  id: string;
  title: string;
  description: string;
}

/** A brand strength ("Why Meridian"). */
export interface Strength {
  id: string;
  title: string;
  description: string;
}

/**
 * A company statistic. `value` stays null until Meridian supplies a verified figure;
 * the UI never shows a number that has not been confirmed.
 */
export interface Metric {
  id: string;
  label: string;
  value: number | null;
  /** Display suffix, e.g. "+" or " sq ft". */
  suffix?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: MediaImage;
}

/** Enquiry topics offered on the contact form. */
export type EnquiryType = "project" | "visit" | "landowner" | "general";

export interface EnquiryTopic {
  value: EnquiryType;
  label: string;
  description: string;
}

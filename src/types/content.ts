import type { MediaImage } from "./project";

/** A Meridian capability (homepage Expertise, /expertise). */
export interface ExpertiseItem {
  id: string;
  title: string;
  summary: string;
  /** What the capability covers, as short points (the Expertise page). */
  points?: string[];
  image: MediaImage;
}

/** A material the buildings are made of (the homepage's materials strip). */
export interface Material {
  id: string;
  name: string;
  note: string;
  image: MediaImage;
}

/** A paragraph block of a legal page. */
export interface LegalSection {
  heading: string;
  body: string[];
}

/** A working principle shown on the About page. */
export interface Principle {
  id: string;
  title: string;
  description: string;
}

/** A moment in the company's story (About page). */
export interface Milestone {
  year: string;
  title: string;
  text: string;
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
  /** True while the quote is invented sample copy. */
  isSample?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logo?: MediaImage;
  /** True while the partner is an invented sample. */
  isSample?: boolean;
}

/** Enquiry topics offered on the contact form. */
export type EnquiryType = "project" | "visit" | "landowner" | "general";

export interface EnquiryTopic {
  value: EnquiryType;
  label: string;
  description: string;
}

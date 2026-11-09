import type { EnquiryTopic } from "@/types/content";

export const ENQUIRY_TOPICS: EnquiryTopic[] = [
  {
    value: "project",
    label: "Project enquiry",
    description: "Availability, pricing and specifications for a development.",
  },
  {
    value: "visit",
    label: "Schedule a visit",
    description: "Tour a site or show apartment with our sales team.",
  },
  {
    value: "landowner",
    label: "Landowner partnership",
    description: "Discuss joint development of your land.",
  },
  {
    value: "general",
    label: "General contact",
    description: "Anything else: press, careers, suppliers.",
  },
];

export const ENQUIRY_MESSAGE_MAX = 2000;

import type { CompanyInfo } from "@/types/company";

/**
 * Company information.
 * ⚠ SAMPLE — tagline, description and contact details are invented for the demo site (the
 * phone number and email use reserved fictional ranges) and must be replaced with Meridian's
 * own before launch. Social profiles are empty.
 */
export const company: CompanyInfo = {
  name: "Meridian Developments",
  shortName: "Meridian",
  tagline: "Building spaces. Shaping tomorrow.",
  description:
    "An architecture-led property developer creating residential and commercial buildings with thoughtful design, lasting quality and quiet confidence.",
  // Sample details: the number uses the fictional 555-01xx range and the address is invented.
  contact: {
    phone: "+1 555 0100",
    email: "hello@meridian.example",
    address: ["Level 5, Meridian House", "12 Harbour Road", "Sample City"],
    officeHours: "Sunday to Thursday, 9:00 to 18:00",
  },
  social: [],
  isPlaceholder: true,
};

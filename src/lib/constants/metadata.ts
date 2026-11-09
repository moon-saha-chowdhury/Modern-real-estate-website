import type { Metadata, Viewport } from "next";
import { company } from "@/data/company";
import { siteConfig } from "./site";

/**
 * Metadata for every route. Next.js requires `metadata` / `viewport` to be exported from the
 * page or layout file, so those files re-export the values defined here.
 */
export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${company.name} — Architecture-led property development`,
    template: `%s — ${company.name}`,
  },
  description: company.description,
  openGraph: {
    type: "website",
    siteName: company.name,
    locale: siteConfig.locale,
  },
};

export const rootViewport: Viewport = {
  themeColor: "#f1efe7",
  colorScheme: "light",
};

export const pageMetadata = {
  about: {
    title: "About",
    description: "The vision, values and people behind Meridian Developments.",
  },
  projects: {
    title: "Projects",
    description: "Residential and commercial developments by Meridian Developments.",
  },
  expertise: {
    title: "Expertise",
    description:
      "Residential and commercial development, architecture, engineering, project management and landowner partnership.",
  },
  contact: {
    title: "Contact",
    description:
      "Enquire about a Meridian project, schedule a visit or discuss a landowner partnership.",
  },
  privacy: {
    title: "Privacy policy",
    description: "Privacy policy for Meridian Developments.",
  },
  terms: {
    title: "Terms of use",
    description: "Terms of use for Meridian Developments.",
  },
  styleguide: {
    title: "Design system",
    robots: { index: false, follow: false },
  },
} satisfies Record<string, Metadata>;

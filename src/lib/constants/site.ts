import type { NavItem } from "@/types/company";

export const siteConfig = {
  name: "Meridian Developments",
  /** Production domain — TODO: replace once the domain is confirmed. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_GB",
} as const;

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Expertise", href: "/expertise" },
  { label: "Contact", href: "/contact" },
];

export const legalNav: NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export const primaryCta: NavItem = { label: "Explore Projects", href: "/projects" };

/** Portfolio shortcuts (footer). Query params are read by the /projects filters in Milestone 4. */
export const portfolioNav: NavItem[] = [
  { label: "Residential", href: "/projects?category=residential" },
  { label: "Commercial", href: "/projects?category=commercial" },
  { label: "Upcoming", href: "/projects?status=upcoming" },
  { label: "Ongoing", href: "/projects?status=ongoing" },
  { label: "Completed", href: "/projects?status=completed" },
];

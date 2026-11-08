export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface ContactDetails {
  phone?: string;
  email?: string;
  address?: string[];
  officeHours?: string;
}

export interface CompanyInfo {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  contact: ContactDetails;
  social: SocialLink[];
  /**
   * True while any of the above is sample copy rather than confirmed company information.
   * The UI must surface this — placeholder content is never presented as real.
   */
  isPlaceholder: boolean;
}

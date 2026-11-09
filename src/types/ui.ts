import type { ImageProps } from "next/image";
import type Link from "next/link";
import type Lenis from "lenis";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/* ---------- Surfaces ---------- */

export type SectionTone = "obsidian" | "forest" | "charcoal" | "ivory";
export type Surface = "dark" | "light";
export type SectionSpacing = "default" | "compact" | "none";

export interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  tone?: SectionTone;
  /** Vertical rhythm. `none` for full-bleed compositions that manage their own spacing. */
  spacing?: SectionSpacing;
}

export type ContainerProps<T extends ElementType> = {
  as?: T;
  /** Adds the 4/8/12-column editorial grid. */
  grid?: boolean;
} & ComponentPropsWithoutRef<T>;

/* ---------- Button ---------- */

export type ButtonVariant = "primary" | "outline" | "text";

export interface ButtonBaseProps {
  /** String label: rendered twice for the vertical "roll" hover. */
  children: string;
  variant?: ButtonVariant;
  /** Background the button sits on. */
  surface?: Surface;
  icon?: boolean;
  className?: string;
}

export type ButtonAsLink = ButtonBaseProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "children" | "className" | "href"
  >;

export type ButtonAsButton = ButtonBaseProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "children" | "className"
  >;

export type ButtonProps = ButtonAsLink | ButtonAsButton;

/* ---------- Typography & headings ---------- */

export interface EyebrowProps {
  children: ReactNode;
  /** Optional drawing-set style index, e.g. "01". */
  index?: string;
  className?: string;
  as?: "p" | "span" | "h2";
}

export interface SectionHeadingProps {
  eyebrow: string;
  index?: string;
  /** Controlled line breaks: one entry per line. */
  title: ReactNode[];
  intro?: ReactNode;
  size?: "md" | "lg";
  as?: "h1" | "h2";
  className?: string;
  /** id for the heading element, so the section can be labelled by it. */
  titleId?: string;
}

export interface PageIntroProps {
  eyebrow: string;
  index?: string;
  title: ReactNode[];
  intro?: ReactNode;
  children?: ReactNode;
}

export interface SampleBadgeProps {
  className?: string;
  label?: string;
}

/* ---------- Motion primitives ---------- */

export interface TextRevealProps {
  /** Each entry is one deliberately controlled line. Supports inline markup (e.g. <em>). */
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Animate on mount instead of when scrolled into view (hero). */
  immediate?: boolean;
  id?: string;
}

export interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance in px to travel upward. */
  y?: number;
  immediate?: boolean;
}

export type RevealDirection = "bottom" | "left" | "right";

export interface ImageRevealProps extends Omit<ImageProps, "className"> {
  /** Wrapper classes: set the aspect ratio / size here (e.g. "aspect-[4/5]"). */
  className?: string;
  imageClassName?: string;
  /** Direction the mask opens from. */
  from?: RevealDirection;
  delay?: number;
}

/* ---------- Layout ---------- */

export interface MobileNavigationProps {
  open: boolean;
  pathname: string;
  onNavigate: () => void;
}

export interface FooterColumnProps {
  title: string;
  children: ReactNode;
}

export interface WordmarkProps {
  className?: string;
  onClick?: () => void;
}

export interface SmoothScrollApi {
  /** Current Lenis instance, or null when smooth scrolling is disabled (reduced motion). */
  get: () => Lenis | null;
  lock: () => void;
  unlock: () => void;
}

/* ---------- Styleguide ---------- */

export interface ColourSwatch {
  name: string;
  token: string;
  hex: string;
  role: string;
  swatchClass: string;
}

export interface TypeSpecimen {
  label: string;
  className: string;
  sample: string;
  emphasis: string;
}

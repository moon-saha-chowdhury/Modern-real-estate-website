import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Eyebrow } from "./Eyebrow";
import { TextReveal } from "./TextReveal";

interface SectionHeadingProps {
  eyebrow: string;
  index?: string;
  /** Controlled line breaks — one entry per line. */
  title: ReactNode[];
  intro?: ReactNode;
  size?: "md" | "lg";
  as?: "h1" | "h2";
  className?: string;
}

/**
 * Editorial heading block: annotation label, serif statement, optional intro offset to the right.
 */
export function SectionHeading({
  eyebrow,
  index,
  title,
  intro,
  size = "md",
  as = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn("grid-editorial gap-y-8", className)}>
      <Eyebrow
        index={index}
        className="col-span-full text-champagne in-data-[surface=light]:text-ink-soft"
      >
        {eyebrow}
      </Eyebrow>
      <TextReveal
        as={as}
        lines={title}
        className={cn(
          "col-span-full font-display lg:col-span-8",
          size === "lg" ? "text-display-lg" : "text-display-md",
        )}
      />
      {intro && (
        <div className="col-span-full text-lead text-mist in-data-[surface=light]:text-ink-soft md:col-span-5 md:col-start-4 lg:col-span-4 lg:col-start-9 lg:self-end">
          {intro}
        </div>
      )}
    </header>
  );
}

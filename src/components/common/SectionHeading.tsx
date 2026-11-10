import { cn } from "@/lib/utils/cn";
import type { SectionHeadingProps } from "@/types/ui";
import { Eyebrow } from "./Eyebrow";
import { TextReveal } from "./TextReveal";

/**
 * Editorial heading block: annotation label, display statement, optional intro offset to the right.
 */
export function SectionHeading({
  eyebrow,
  index,
  title,
  intro,
  size = "md",
  as = "h2",
  className,
  titleId,
}: SectionHeadingProps) {
  return (
    <header className={cn("grid-editorial gap-y-8", className)}>
      {eyebrow && (
        <Eyebrow index={index} className="col-span-full text-accent">
          {eyebrow}
        </Eyebrow>
      )}
      <TextReveal
        as={as}
        id={titleId}
        lines={title}
        className={cn(
          "col-span-full font-display lg:col-span-8",
          size === "lg" ? "text-display-lg" : "text-display-md",
        )}
      />
      {intro && (
        <div className="col-span-full text-lead text-fg-muted md:col-span-5 md:col-start-4 lg:col-span-4 lg:col-start-9 lg:self-end">
          {intro}
        </div>
      )}
    </header>
  );
}

import { cn } from "@/lib/utils/cn";
import type { PhotoCreditProps } from "@/types/sections";

/**
 * Credit line for sample (stock) photography. Renders nothing for Meridian's own imagery.
 * Required by the content-integrity rule: sample images are always labelled.
 * Full-strength text colour (no opacity) so it meets 4.5:1; the link has a 24px-tall hit area.
 */
export function PhotoCredit({ image, className }: PhotoCreditProps) {
  if (!image.isSample || !image.credit) return null;
  return (
    <p className={cn("label-mono text-[0.6875rem] leading-6", className)}>
      Sample photo ·{" "}
      <a
        href={image.credit.url}
        target="_blank"
        rel="noreferrer"
        className="inline-block py-[3px] underline decoration-current/40 underline-offset-2 hover:decoration-current"
      >
        {image.credit.author}
      </a>{" "}
      / {image.credit.source}
    </p>
  );
}

import { cn } from "@/lib/utils/cn";
import type { PhotoCreditProps } from "@/types/sections";

/**
 * Credit line for sample (stock) photography. Renders nothing for Meridian's own imagery.
 * Required by the content-integrity rule: sample images are always labelled.
 */
export function PhotoCredit({ image, className }: PhotoCreditProps) {
  if (!image.isSample || !image.credit) return null;
  return (
    <p className={cn("label-mono text-[0.625rem] opacity-70", className)}>
      Sample photo ·{" "}
      <a
        href={image.credit.url}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-current/30 underline-offset-2 hover:decoration-current"
      >
        {image.credit.author}
      </a>{" "}
      / {image.credit.source}
    </p>
  );
}

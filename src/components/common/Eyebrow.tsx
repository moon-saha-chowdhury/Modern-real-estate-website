import { cn } from "@/lib/utils/cn";
import type { EyebrowProps } from "@/types/ui";

/** Small uppercase technical label — reads like an annotation on an architectural drawing. */
export function Eyebrow({ children, index, className, as: Tag = "p" }: EyebrowProps) {
  return (
    <Tag className={cn("flex items-center gap-3 label-mono", className)}>
      {index && <span className="tabular-nums">{index}</span>}
      {index && <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />}
      <span>{children}</span>
    </Tag>
  );
}

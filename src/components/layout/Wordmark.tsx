import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { WordmarkProps } from "@/types/ui";

/**
 * Typographic wordmark — stands in until the official logo (SVG) is supplied.
 */
export function Wordmark({ className, onClick }: WordmarkProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Meridian Developments — home"
      className={cn("group inline-flex items-baseline gap-2.5 leading-none", className)}
    >
      <span className="font-display text-[1.625rem] tracking-[-0.01em]">Meridian</span>
      <span className="hidden label-mono text-[0.625rem] text-mist sm:inline">Developments</span>
    </Link>
  );
}

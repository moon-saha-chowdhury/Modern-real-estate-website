import { cn } from "@/lib/utils/cn";

/**
 * Marks placeholder content. Required wherever `isPlaceholder` / `isSample` data is rendered,
 * so sample material is never mistaken for real company information.
 */
export function SampleBadge({
  className,
  label = "Sample content",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border border-current/30 px-2 py-1 label-mono text-[0.625rem] opacity-80",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 bg-champagne" />
      {label}
    </span>
  );
}

"use client";

import { PROJECT_FILTERS } from "@/lib/constants/projects";
import { cn } from "@/lib/utils/cn";
import type { ProjectFiltersProps } from "@/types/sections";

/**
 * Filter bar: flat mono text with an underline marker, not pills.
 * Toggle buttons with aria-pressed; counts sit in superscript like drawing references.
 */
export function ProjectFilters({ active, counts, onChange, labelledBy }: ProjectFiltersProps) {
  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      className="-mx-gutter flex [scrollbar-width:none] gap-x-8 overflow-x-auto border-b border-line px-gutter md:mx-0 md:flex-wrap md:px-0"
    >
      {PROJECT_FILTERS.map((filter) => {
        const isActive = filter.key === active;
        const count = counts[filter.key] ?? 0;
        return (
          <button
            key={filter.key}
            type="button"
            aria-pressed={isActive}
            disabled={count === 0}
            onClick={() => onChange(filter.key)}
            className={cn(
              "relative flex shrink-0 items-start gap-1 py-4 label-mono transition-colors duration-300",
              "disabled:cursor-not-allowed disabled:opacity-35",
              isActive ? "text-ivory" : "text-mist hover:text-ivory",
            )}
          >
            {filter.label}
            <sup className="text-[0.5625rem] text-champagne tabular-nums">{count}</sup>
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 -bottom-px h-px origin-left bg-champagne transition-transform duration-500 ease-meridian",
                isActive ? "scale-x-100" : "scale-x-0",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

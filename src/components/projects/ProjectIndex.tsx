"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PROJECT_FILTER_GROUPS } from "@/lib/constants/projects";
import { cn } from "@/lib/utils/cn";
import type { ProjectIndexProps } from "@/types/sections";
import { ProjectList } from "./ProjectTile";

/**
 * Every project in a two-column grid (the second column sits lower, so the rows don't line up
 * like a table), with Type and Stage filters kept in the address (?category=…&status=…) so a
 * filtered view can be shared and the footer's portfolio links land on it.
 */
export function ProjectIndex({ projects }: ProjectIndexProps) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const active = (param: string) => params.get(param) ?? "all";
  const visible = projects.filter((project) =>
    PROJECT_FILTER_GROUPS.every(({ param }) => {
      const value = active(param);
      return value === "all" || project[param as "category" | "status"] === value;
    }),
  );

  const choose = (param: string, key: string) => {
    const next = new URLSearchParams(params.toString());
    if (key === "all") next.delete(param);
    else next.set(param, key);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-col gap-6 border-y border-rule py-6 md:flex-row md:flex-wrap md:items-center md:gap-x-12">
        {PROJECT_FILTER_GROUPS.map((group) => (
          <div
            key={group.param}
            role="group"
            aria-label={group.label}
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <span className="label-mono text-fg-muted">{group.label}</span>
            {group.options.map((option) => {
              const pressed = active(group.param) === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => choose(group.param, option.key)}
                  className={cn(
                    "border-b py-1 text-small transition-colors duration-300",
                    pressed
                      ? "border-fg text-fg"
                      : "border-transparent text-fg-muted hover:border-fg/40 hover:text-fg",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        ))}
        <p className="label-mono text-fg-muted md:ml-auto" aria-live="polite">
          {visible.length} {visible.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {visible.length > 0 ? (
        <ProjectList projects={visible} />
      ) : (
        <p className="py-16 text-lead text-fg-muted">No projects match these filters.</p>
      )}
    </div>
  );
}

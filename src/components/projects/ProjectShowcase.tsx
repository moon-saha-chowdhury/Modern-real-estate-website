"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { DURATION, EASE_MERIDIAN } from "@/lib/animations/eases";
import {
  countByFilter,
  displayIndex,
  isProjectFilterKey,
  matchesFilter,
  tileVariantAt,
} from "@/lib/utils/projects";
import type { ProjectFilterKey } from "@/types/content";
import type { ProjectShowcaseProps } from "@/types/sections";
import { ProjectCard } from "./ProjectCard";
import { ProjectFilters } from "./ProjectFilters";

/**
 * Filterable editorial mosaic. Filtering is instant and client-side; tiles cross-fade so the
 * reflow reads as one composed change rather than a jump.
 */
export function ProjectShowcase({ projects, labelledBy }: ProjectShowcaseProps) {
  const [filter, setFilter] = useState<ProjectFilterKey>("all");
  const counts = useMemo(() => countByFilter(projects), [projects]);
  const visible = useMemo(
    () => projects.filter((project) => matchesFilter(project, filter)),
    [projects, filter],
  );

  return (
    <div className="flex flex-col gap-14">
      <ProjectFilters
        active={filter}
        counts={counts}
        labelledBy={labelledBy}
        onChange={(key) => isProjectFilterKey(key) && setFilter(key)}
      />

      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
      </p>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={filter}
          className="grid-editorial grid-flow-row-dense gap-y-16 lg:gap-y-20"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: DURATION.ui, ease: EASE_MERIDIAN }}
        >
          {visible.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={displayIndex(projects.indexOf(project))}
              variant={tileVariantAt(i, visible.length)}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

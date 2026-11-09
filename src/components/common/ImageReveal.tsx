"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { DURATION, EASE_MERIDIAN } from "@/lib/animations/eases";
import {
  CLIP_HIDDEN,
  CLIP_VISIBLE,
  IMAGE_SETTLE_SCALE,
  VIEWPORT_IMAGE,
} from "@/lib/animations/presets";
import { cn } from "@/lib/utils/cn";
import type { ImageRevealProps } from "@/types/ui";

/**
 * Architectural image mask reveal: the frame opens while the photograph settles from a slight scale.
 * Always uses next/image with `fill`; the wrapper controls cropping.
 */
export function ImageReveal({
  className,
  imageClassName,
  from = "bottom",
  delay = 0,
  alt,
  sizes = "100vw",
  ...imageProps
}: ImageRevealProps) {
  const transition = { duration: DURATION.hero, ease: EASE_MERIDIAN, delay };

  return (
    <motion.div
      className={cn("relative overflow-hidden bg-stone", className)}
      initial={{ clipPath: CLIP_HIDDEN[from] }}
      whileInView={{ clipPath: CLIP_VISIBLE }}
      viewport={VIEWPORT_IMAGE}
      transition={transition}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: IMAGE_SETTLE_SCALE }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT_IMAGE}
        transition={{ ...transition, duration: DURATION.hero * 1.4 }}
      >
        <Image
          alt={alt}
          fill
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
          {...imageProps}
        />
      </motion.div>
    </motion.div>
  );
}

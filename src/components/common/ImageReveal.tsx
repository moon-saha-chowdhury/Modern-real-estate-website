"use client";

import { motion } from "motion/react";
import Image, { type ImageProps } from "next/image";
import { DURATION, EASE_MERIDIAN } from "@/lib/animations/eases";
import { cn } from "@/lib/utils/cn";

interface ImageRevealProps extends Omit<ImageProps, "className"> {
  /** Wrapper classes — set the aspect ratio / size here (e.g. "aspect-[4/5]"). */
  className?: string;
  imageClassName?: string;
  /** Direction the mask opens from. */
  from?: "bottom" | "left" | "right";
  delay?: number;
}

const hidden = {
  bottom: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * Architectural image mask reveal: the frame opens while the photograph settles from a slight scale.
 * Always uses next/image with `fill` — the wrapper controls cropping.
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
  const viewport = { once: true, margin: "0px 0px -15% 0px" } as const;

  return (
    <motion.div
      className={cn("relative overflow-hidden bg-charcoal", className)}
      initial={{ clipPath: hidden[from] }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={viewport}
      transition={transition}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={viewport}
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

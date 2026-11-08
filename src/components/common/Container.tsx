import type { ElementType } from "react";
import { cn } from "@/lib/utils/cn";
import type { ContainerProps } from "@/types/ui";

/** Max-width (1440px) wrapper with fluid side gutters. */
export function Container<T extends ElementType = "div">({
  as,
  grid = false,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn("mx-auto w-full max-w-site px-gutter", grid && "grid-editorial", className)}
      {...props}
    />
  );
}

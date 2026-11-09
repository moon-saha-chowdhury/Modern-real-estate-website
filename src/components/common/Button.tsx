import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BUTTON_VARIANT_CLASSES } from "@/lib/constants/ui";
import { cn } from "@/lib/utils/cn";
import type {
  ButtonAsButton,
  ButtonAsLink,
  ButtonBaseProps,
  ButtonProps,
  ButtonVariant,
  Surface,
} from "@/types/ui";

export function buttonClasses(
  variant: ButtonVariant = "primary",
  surface: Surface = "light",
  className?: string,
) {
  return cn(
    "group/btn relative inline-flex items-center gap-3 label-mono whitespace-nowrap select-none",
    "transition-[color,background-color,border-color,scale] duration-500 ease-meridian",
    // Press feedback lands on pointer-down, instantly (apple-design §1)
    "active:scale-[0.98] active:duration-100",
    "disabled:pointer-events-none disabled:opacity-50",
    variant === "text" ? "h-auto py-2" : "h-12 px-6",
    BUTTON_VARIANT_CLASSES[variant][surface],
    className,
  );
}

function Inner({
  children,
  icon,
  variant,
}: Pick<ButtonBaseProps, "children" | "icon" | "variant">) {
  return (
    <>
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-meridian group-hover/btn:-translate-y-full motion-reduce:group-hover/btn:translate-y-0">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-meridian group-hover/btn:translate-y-0 motion-reduce:hidden"
        >
          {children}
        </span>
      </span>
      {icon && (
        <ArrowUpRight
          aria-hidden="true"
          strokeWidth={1.5}
          className="size-4 shrink-0 transition-transform duration-500 ease-meridian group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
        />
      )}
      {variant === "text" && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-100 bg-current opacity-40 transition-transform duration-500 ease-meridian group-hover/btn:origin-right group-hover/btn:scale-x-0"
        />
      )}
    </>
  );
}

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    surface = "light",
    icon = false,
    className,
    ...rest
  } = props;
  const classes = buttonClasses(variant, surface, className);

  if (typeof rest.href === "string") {
    const { href, ...linkProps } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkProps}>
        <Inner icon={icon} variant={variant}>
          {children}
        </Inner>
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      <Inner icon={icon} variant={variant}>
        {children}
      </Inner>
    </button>
  );
}

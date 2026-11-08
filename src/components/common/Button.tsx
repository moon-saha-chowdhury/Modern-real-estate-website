import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "outline" | "text";
type Surface = "dark" | "light";

interface BaseProps {
  /** String label — rendered twice for the vertical "roll" hover. */
  children: string;
  variant?: Variant;
  /** Background the button sits on. */
  surface?: Surface;
  icon?: boolean;
  className?: string;
}

type ButtonAsLink = BaseProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "children" | "className" | "href"
  >;
type ButtonAsButton = BaseProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "children" | "className"
  >;

export type ButtonProps = ButtonAsLink | ButtonAsButton;

const variants: Record<Variant, Record<Surface, string>> = {
  primary: {
    dark: "bg-ivory text-obsidian hover:bg-champagne",
    light: "bg-obsidian text-ivory hover:bg-forest",
  },
  outline: {
    dark: "border border-ivory/25 text-ivory hover:border-ivory/80",
    light: "border border-obsidian/25 text-obsidian hover:border-obsidian/80",
  },
  text: {
    dark: "text-ivory",
    light: "text-obsidian",
  },
};

export function buttonClasses(
  variant: Variant = "primary",
  surface: Surface = "dark",
  className?: string,
) {
  return cn(
    "group/btn relative inline-flex items-center gap-3 label-mono whitespace-nowrap",
    "transition-colors duration-500 ease-meridian disabled:pointer-events-none disabled:opacity-50",
    variant === "text" ? "h-auto py-2" : "h-12 px-6",
    variants[variant][surface],
    className,
  );
}

function Inner({ children, icon, variant }: Pick<BaseProps, "children" | "icon" | "variant">) {
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
    surface = "dark",
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

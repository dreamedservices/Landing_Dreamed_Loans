import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";
export type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Fondo sobre el que se coloca el botón; afecta a "secondary" y "ghost". */
  tone?: "dark" | "light";
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  children: ReactNode;
};

type LinkProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type ButtonProps = LinkProps | NativeButtonProps;

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-small gap-1.5",
  md: "h-11 px-5 text-body gap-2",
  lg: "h-13 px-6 text-lead gap-2",
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-[3.25rem] w-[3.25rem]",
};

function variantClasses(variant: ButtonVariant, tone: "dark" | "light"): string {
  switch (variant) {
    case "primary":
      // Texto blanco a pedido explícito, pese a que el tramo verde del degradado
      // baja el contraste a 1.35:1 (bajo el mínimo documentado en README.md).
      return "bg-[image:var(--gradient-brand)] text-brand-white hover:brightness-105 active:brightness-95";
    case "secondary":
      return tone === "dark"
        ? "bg-transparent text-brand-white border border-line-dark hover:bg-white/5"
        : "bg-transparent text-brand-ink border border-line-light hover:bg-black/5";
    case "ghost":
      return tone === "dark"
        ? "bg-transparent text-brand-white hover:bg-white/10"
        : "bg-transparent text-brand-ink hover:bg-black/5";
    case "icon":
      return tone === "dark"
        ? "bg-transparent text-brand-white hover:bg-white/10"
        : "bg-transparent text-brand-ink hover:bg-black/5";
  }
}

const baseClasses =
  "inline-flex items-center justify-center rounded-md font-sans font-medium " +
  "transition-[transform,filter,background-color] duration-150 ease-out " +
  "hover:-translate-y-0.5 active:translate-y-0 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue " +
  "disabled:pointer-events-none disabled:opacity-50 disabled:translate-y-0 " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-50 " +
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    tone = "dark",
    isLoading,
    icon,
    iconPosition = "right",
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    baseClasses,
    variant === "icon" ? iconSizeClasses[size] : sizeClasses[size],
    variantClasses(variant, tone),
    className,
  );

  const content =
    icon && variant !== "icon" ? (
      <>
        {iconPosition === "left" ? <span aria-hidden="true">{icon}</span> : null}
        {children}
        {iconPosition === "right" ? <span aria-hidden="true">{icon}</span> : null}
      </>
    ) : (
      children
    );

  if ("href" in props && props.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={classes} aria-disabled={isLoading || undefined} {...anchorRest}>
        {content}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      type={buttonRest.type ?? "button"}
      className={classes}
      disabled={isLoading || buttonRest.disabled}
      aria-busy={isLoading || undefined}
      {...buttonRest}
    >
      {content}
    </button>
  );
}

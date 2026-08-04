"use client";

import type { ReactNode } from "react";
import { Button, type ButtonVariant, type ButtonSize } from "@/components/ui/Button";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics/track";

type TrackedCtaButtonProps = {
  event: AnalyticsEvent;
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  tone?: "dark" | "light";
  className?: string;
  children: ReactNode;
};

/**
 * `Button` con tracking de clic. Aparte del primitivo porque las secciones
 * que lo usan (Header, Hero, Footer) son Server Components: un `onClick`
 * no puede cruzar ese límite como prop, tiene que vivir dentro de un Client
 * Component ya montado — este.
 */
export function TrackedCtaButton({
  event,
  href,
  variant = "primary",
  size = "md",
  tone,
  className,
  children,
}: TrackedCtaButtonProps) {
  return (
    <Button
      href={href}
      variant={variant}
      size={size}
      tone={tone}
      className={className}
      onClick={() => trackEvent(event)}
    >
      {children}
    </Button>
  );
}

"use client";

import type { ReactNode } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics/track";

type TrackedLinkProps = {
  event: AnalyticsEvent;
  href: string;
  className?: string;
  children: ReactNode;
};

/** Enlace de texto plano (no el primitivo `Button`) con tracking de clic. */
export function TrackedLink({ event, href, className, children }: TrackedLinkProps) {
  return (
    <a href={href} className={className} onClick={() => trackEvent(event)}>
      {children}
    </a>
  );
}

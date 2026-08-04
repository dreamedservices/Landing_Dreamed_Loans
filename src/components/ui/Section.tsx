import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionTone = "dark" | "light" | "deep";

type SectionProps = {
  id?: string;
  tone?: SectionTone;
  className?: string;
  children: ReactNode;
};

const toneClasses: Record<SectionTone, string> = {
  dark: "bg-brand-ink text-brand-white",
  light: "bg-surface-soft text-brand-ink",
  deep: "bg-surface-deep text-brand-white",
};

/**
 * scroll-mt-24 es un valor provisional hasta fijar la altura real del header
 * en Fase 03 (NAVEGACION.md §4).
 */
export function Section({ id, tone = "light", className, children }: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-20 sm:py-28", toneClasses[tone], className)}>
      {children}
    </section>
  );
}

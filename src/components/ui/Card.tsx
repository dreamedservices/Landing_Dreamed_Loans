import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardTone = "dark" | "light";

type CardProps = {
  as?: ElementType<{ className?: string; children?: ReactNode }>;
  tone?: CardTone;
  /** Añade el tratamiento hover; usar solo si la card completa es interactiva. */
  interactive?: boolean;
  className?: string;
  children: ReactNode;
};

const toneClasses: Record<CardTone, string> = {
  dark: "bg-surface-1 text-brand-white border border-line-dark shadow-soft-dark",
  light: "bg-brand-white text-brand-ink border border-line-light shadow-soft-light",
};

/**
 * Primitiva genérica. Las variantes de contenido (Feature Story, Product
 * Window, Metric, Trust — COMPONENTE-CARDS-MODALES.md §2) se componen con
 * este primitivo en Fase 03, no se crean como componentes aparte aquí.
 */
export function Card({ as: Tag = "article", tone = "dark", interactive = false, className, children }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-lg p-6 sm:p-8",
        toneClasses[tone],
        interactive &&
          "transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-1 motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

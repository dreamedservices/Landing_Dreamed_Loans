import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeadingLevel = 1 | 2 | 3 | 4;
type HeadingSize = "display" | "h1" | "h2" | "h3";

type HeadingProps = {
  /** Nivel semántico real del encabezado (h1–h4). Mantener una sola jerarquía lógica por página. */
  level: HeadingLevel;
  /** Tamaño visual; por defecto sigue al nivel semántico, pero puede desacoplarse (ej. un h2 con tamaño display). */
  size?: HeadingSize;
  tone?: "dark" | "light";
  className?: string;
  children: ReactNode;
};

const tagByLevel: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4"> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
};

const defaultSizeByLevel: Record<HeadingLevel, HeadingSize> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h3",
};

/**
 * THEME.md §5 reserva Bricolage Grotesque (font-display) para H1/H2 y
 * frases de transición. H3/H4 usan Manrope en peso de énfasis (600–700).
 */
const sizeClasses: Record<HeadingSize, string> = {
  display: "font-display text-display",
  h1: "font-display text-h1",
  h2: "font-display text-h2",
  h3: "font-sans font-bold text-h3",
};

export function Heading({ level, size, tone = "dark", className, children }: HeadingProps) {
  const Tag = tagByLevel[level];
  const visualSize = size ?? defaultSizeByLevel[level];

  return (
    <Tag
      className={cn(
        sizeClasses[visualSize],
        tone === "dark" ? "text-brand-white" : "text-brand-ink",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

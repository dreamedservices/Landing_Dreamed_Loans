import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EyebrowProps = {
  tone?: "dark" | "light";
  className?: string;
  children: ReactNode;
};

/**
 * Sobre fondo claro no se usa brand-blue como texto: a este tamaño no cumple
 * el contraste mínimo (README.md: azul sobre blanco 3.02:1, solo texto grande
 * o elementos no textuales). Se usa brand-ink atenuado en su lugar.
 */
export function Eyebrow({ tone = "dark", className, children }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-label font-sans font-medium uppercase tracking-[0.08em]",
        tone === "dark" ? "text-brand-blue" : "text-brand-ink/70",
        className,
      )}
    >
      {children}
    </p>
  );
}

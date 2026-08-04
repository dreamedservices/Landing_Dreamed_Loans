import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "success" | "info" | "warning" | "danger" | "neutral";

type BadgeProps = {
  tone?: BadgeTone;
  /** Icono opcional; el texto sigue siendo obligatorio, el badge nunca depende solo del color. */
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * Mapeo de estados sugeridos en COMPONENTE-TABLAS-BADGES.md §6:
 * success≈"Al día", info≈"Pendiente", warning≈"En ruta"/"Prueba",
 * danger≈"Atrasado" (rojo, no verde de marca), neutral≈"Pagado".
 *
 * Colores sólidos (no brand-color con opacidad): un badge puede aparecer
 * sobre fondo oscuro o claro (ej. dentro de una ficha de préstamo, que según
 * PATRON-FICHA-DETALLE.md §6 es clara dentro de un entorno oscuro), y un tinte
 * con opacidad se mezclaría con lo que haya detrás, rompiendo el contraste con
 * el texto oscuro. Valores calculados como marca al 15-20% sobre blanco.
 */
const toneClasses: Record<BadgeTone, string> = {
  success: "bg-[#deffd1] text-brand-ink",
  info: "bg-[#e5effd] text-brand-ink",
  warning: "bg-amber-100 text-amber-900",
  danger: "bg-red-100 text-red-800",
  neutral: "bg-[#f2f2f2] text-brand-ink",
};

export function Badge({ tone = "neutral", icon, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-small font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="flex h-3.5 w-3.5 items-center justify-center">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}

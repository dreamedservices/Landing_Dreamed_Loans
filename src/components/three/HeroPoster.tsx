import Image from "next/image";
import logoSmall from "@/assets/brand/logo-small.png";

/**
 * Póster 2D siempre presente en el HTML (ARQUITECTURA.md §8): sin JS, con
 * `prefers-reduced-motion`, sin WebGL o mientras el Canvas carga, esta imagen
 * es la experiencia completa del logo, no un estado vacío.
 */
export function HeroPoster({ className }: { className?: string }) {
  return (
    <Image
      src={logoSmall}
      alt="Isotipo de Dream Préstamos: una P formada por una flecha ascendente en degradado azul a verde"
      className={className ?? "h-auto w-10 sm:w-64"}
      priority
    />
  );
}

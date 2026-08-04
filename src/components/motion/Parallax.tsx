"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Desplazamiento máximo en px mientras la sección cruza el viewport. Sutil a propósito. */
  offset?: number;
};

/**
 * Parallax sutil ligado al scroll (scrub, sin pin) para las "ventanas de
 * producto" (THEME.md §7: "Producto: ventanas HTML inspiradas en el sistema
 * real"). Sin JS/reduced motion, el elemento queda en su posición normal —
 * el offset es un extra, no contenido.
 */
export function Parallax({ children, className, offset = 40 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };
        if (reduceMotion) return;

        gsap.fromTo(
          ref.current,
          { y: -offset },
          {
            y: offset,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Entrada del hero al montar, sin intro bloqueante: el H1 ya está en el HTML
 * (SSR) y visible antes de que este efecto corra. Solo añade un stagger de
 * entrada tras la hidratación (FASE-04 "Implementar entrada del hero sin
 * intro bloqueante").
 */
export function HeroIntro({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };
        const targets = scope.current ? Array.from(scope.current.children) : [];

        if (reduceMotion) {
          gsap.set(targets, { autoAlpha: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.1, delay: 0.1 },
        );
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}

"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
};

/**
 * Revelado genérico por scroll (FASE-04 "Revelados de secciones"). Sin pin,
 * sin scrub: toggleActions "play none none none" — se revela una vez y se
 * queda visible. gsap.matchMedia() decide entre animar o mostrar de una vez
 * según prefers-reduced-motion (FRONTEND.md §8).
 */
export function Reveal({ children, className, y = 24, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduceMotion } = context.conditions as { reduceMotion: boolean };

          if (reduceMotion) {
            gsap.set(ref.current, { autoAlpha: 1, y: 0 });
            return;
          }

          gsap.fromTo(
            ref.current,
            { autoAlpha: 0, y },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              delay,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ref.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: ref, dependencies: [y, delay] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

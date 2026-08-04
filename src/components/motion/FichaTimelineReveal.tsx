"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * PATRON-FICHA-DETALLE.md §5: "La línea de tiempo avanza hasta un cobro".
 * La línea usa scrub ligado al propio recorrido de la ficha (sin pin); el
 * resto de la ficha se revela una vez, no de forma continua.
 */
export function FichaTimelineReveal({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };
        const steps = gsap.utils.toArray<HTMLElement>("[data-timeline-step]", scope.current);
        const rows = gsap.utils.toArray<HTMLElement>("[data-payment-row]", scope.current);
        const docs = gsap.utils.toArray<HTMLElement>("[data-document-item]", scope.current);

        if (reduceMotion) {
          gsap.set(steps, { scaleX: 1 });
          gsap.set([...rows, ...docs], { autoAlpha: 1, y: 0 });
          return;
        }

        gsap.set(steps, { scaleX: 0, transformOrigin: "left" });

        gsap.to(steps, {
          scaleX: 1,
          stagger: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.5,
          },
        });

        gsap.fromTo(
          [...rows, ...docs],
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: scope.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          },
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

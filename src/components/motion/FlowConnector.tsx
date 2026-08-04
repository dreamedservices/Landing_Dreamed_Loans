"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * "Línea de flujo entre capítulos" (FASE-04). Decorativa: aria-hidden,
 * no transporta información. Sin pin, crece con el scroll (scrub corto).
 */
export function FlowConnector() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };

        if (reduceMotion) {
          gsap.set(ref.current, { scaleY: 1 });
          return;
        }

        gsap.fromTo(
          ref.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 90%",
              end: "bottom 40%",
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
    <div className="relative h-16 overflow-hidden" aria-hidden="true">
      <div
        ref={ref}
        className="mx-auto h-full w-px origin-top bg-[image:var(--gradient-brand)]"
      />
    </div>
  );
}

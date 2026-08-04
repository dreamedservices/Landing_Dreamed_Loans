"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * PATRON-DASHBOARD.md §4: "Los indicadores aparecen en un único stagger" +
 * barras que crecen desde 0. Solo transform/opacity (gsap-performance). Sin
 * pin: se revela al entrar en viewport y se queda así.
 */
export function DashboardCounters({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };
        const kpis = gsap.utils.toArray<HTMLElement>("[data-kpi]", scope.current);
        const bars = gsap.utils.toArray<HTMLElement>("[data-bar]", scope.current);

        if (reduceMotion) {
          gsap.set(kpis, { autoAlpha: 1, y: 0 });
          gsap.set(bars, { scaleY: 1 });
          return;
        }

        gsap.set(bars, { transformOrigin: "bottom" });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });

        timeline
          .fromTo(kpis, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" })
          .fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: 0.6, stagger: 0.06, ease: "power3.out" }, "-=0.25");
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

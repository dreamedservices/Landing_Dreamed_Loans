"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { trackEvent } from "@/lib/analytics/track";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  /** Slug sin PII (ej. "problema", "producto") para el evento `section_view`. */
  sectionName?: string;
};

/**
 * Reveal de entrada + transición de salida (scrub, sin pin, una sola vez la
 * de entrada). Se probó con `position: sticky` para un efecto de "sección
 * anclada" que la siguiente cubre al subir, pero se revirtió: cualquier
 * sección más alta que el viewport (formularios, cards, capturas — la
 * mayoría aquí) quedaba con su parte inferior fija fuera de pantalla e
 * inalcanzable con scroll — cortaba contenido real, encontrado por reporte
 * directo tras publicar. Sin `sticky`, la sección se atenúa y encoge
 * levemente justo antes de salir por arriba (scroll normal, nunca fijo), así
 * el contenido siempre es 100% alcanzable sin importar su altura. No se usa
 * en el Hero: ese tiene su propia entrada (`HeroIntro`) al montar.
 */
export function SectionReveal({ children, className, sectionName }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };

        if (sectionName) {
          ScrollTrigger.create({
            trigger: ref.current,
            start: "top 85%",
            once: true,
            onEnter: () => trackEvent("section_view", { section: sectionName }),
          });
        }

        if (reduceMotion) {
          gsap.set(ref.current, { autoAlpha: 1, y: 0, scale: 1 });
          return;
        }

        gsap.fromTo(
          ref.current,
          { autoAlpha: 0, y: 56, scale: 0.97 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              once: true,
            },
          },
        );

        // Salida: durante la última pantalla de scroll de la sección (de
        // "bottom bottom" a "bottom top") se encoge y atenúa levemente —
        // scrub puro, sin `sticky`/`pin`, así el scroll nunca se detiene ni
        // el contenido queda fijo fuera de pantalla.
        gsap.to(ref.current, {
          scale: 0.94,
          autoAlpha: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "bottom bottom",
            end: "bottom top",
            scrub: true,
          },
        });
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

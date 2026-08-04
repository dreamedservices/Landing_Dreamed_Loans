"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Envuelve un <Heading> (u otro elemento con un h1-h4 dentro) y lo revela
 * por líneas desde abajo al entrar en viewport, con máscara (mask:"lines")
 * para el efecto de recorte típico de reveal editorial. `display:contents`
 * en el wrapper: no participa en el layout, así no rompe grids/flex del
 * padre. `SplitText` con `aria:"auto"` (por defecto) deja un `aria-label`
 * con el texto completo, así que un lector de pantalla sigue oyendo una
 * frase coherente, no línea por línea.
 */
export function TextReveal({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const target = scope.current?.querySelector<HTMLElement>("h1, h2, h3, h4");
      if (!target) return;

      const mm = gsap.matchMedia();
      let split: SplitText | undefined;

      mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };
        if (reduceMotion) return; // el texto normal ya es visible sin dividir

        split = SplitText.create(target, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 100,
              opacity: 0,
              duration: 0.8,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: target,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            });
          },
        });
      });

      return () => {
        mm.revert();
        split?.revert();
      };
    },
    { scope },
  );

  return (
    <div ref={scope} className={className} style={{ display: "contents" }}>
      {children}
    </div>
  );
}

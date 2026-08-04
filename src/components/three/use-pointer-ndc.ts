import { useEffect, useRef } from "react";

/**
 * Posición del puntero en coordenadas normalizadas (-1..1, origen al centro
 * de la ventana). La usa HeroLogoScene para inclinar el isotipo hacia el
 * puntero. `HeroParticlesBackground` es un sistema aparte (canvas 2D, no
 * WebGL) con su propio tracking de puntero en píxeles de sección, no NDC —
 * no comparte este hook a propósito.
 */
export function usePointerNDC(active: boolean) {
  const ref = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!active) return;

    function onPointerMove(event: PointerEvent) {
      ref.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      ref.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    }

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [active]);

  return ref;
}

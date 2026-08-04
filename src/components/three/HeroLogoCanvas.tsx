"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useExperienceStore, detectQuality } from "@/stores/experience-store";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";
import { HeroLogoScene } from "./HeroLogoScene";
import { usePointerNDC } from "./use-pointer-ndc";
import { trackEvent } from "@/lib/analytics/track";

/**
 * Único Canvas WebGL de la landing (ARQUITECTURA.md §8), dentro del Hero en
 * vez de un panel flotante aparte. Se monta encima del `HeroPoster` (mismo
 * tamaño, `absolute inset-0`): en calidad "poster" no renderiza nada y el
 * póster de abajo queda como la experiencia completa — nunca hay salto de
 * layout ni contenido que dependa de que esto cargue.
 *
 * data-testid="hero-3d-canvas": tests/e2e/motion.spec.ts lo usa para
 * verificar que este Canvas específico no se monta sin WebGL, sin
 * confundirlo con `HeroParticlesBackground` (un `<canvas>` 2D aparte, sin
 * relación con el presupuesto de "un Canvas" que es específico de WebGL/R3F).
 */
export function HeroLogoCanvas({ className }: { className?: string }) {
  const quality = useExperienceStore((state) => state.quality);
  const setQuality = useExperienceStore((state) => state.setQuality);

  const [paused, setPaused] = useState(false);
  const interactive = quality === "full";
  const pointer = usePointerNDC(interactive);

  useEffect(() => {
    setQuality(detectQuality());

    function onVisibilityChange() {
      setPaused(document.hidden);
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [setQuality]);

  if (quality === "poster") return null;

  return (
    <div className={className} data-testid="hero-3d-canvas" aria-hidden="true">
      <CanvasErrorBoundary>
        <Canvas
          dpr={quality === "full" ? [1, 2] : 1}
          frameloop={paused ? "never" : "always"}
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0, 3.4], fov: 35 }}
          onCreated={() => trackEvent("three_experience_loaded")}
        >
          <ambientLight intensity={2.0} />
          <directionalLight position={[2, 2, 3]} intensity={1.1} color="#4F96F0" />
          <pointLight position={[-1.5, -1, 1.5]} intensity={1.4} color="#5CFD19" />
          <Suspense fallback={null}>
            <HeroLogoScene interactive={interactive} pointer={pointer} />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}

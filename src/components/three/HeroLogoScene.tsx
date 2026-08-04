"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Marca 3D estática del Hero (revisión post-Trionn: se retira el patrón de
 * "progreso de ScrollTrigger → escena", que vivía en un panel flotante fuera
 * del Hero — ver historial de FASE-04-ANIMACION-Y-3D.md). Ahora el modelo
 * vive solo aquí, en reposo, con dos capas de movimiento acotado:
 * - Vaivén de reposo (seno del reloj, no delta acumulado) para que nunca
 *   quede completamente inmóvil.
 * - Inclinación suave hacia el puntero, como única interacción del sitio con
 *   el mouse (THEME.md §12 solo permite esto en un elemento así de acotado).
 * Ambas se apagan con `interactive=false` (reduced motion / calidad baja).
 */
type HeroLogoSceneProps = {
  /** false en calidad "reduced" o reduced motion: sin vaivén ni respuesta al puntero. */
  interactive: boolean;
  /** Ver `usePointerNDC`: posición del puntero en NDC (-1..1), solo para inclinar el isotipo. */
  pointer: RefObject<{ x: number; y: number }>;
};

/**
 * v3 del modelo: mezcla mallas con textura horneada (material propio en el
 * GLB) y mallas con color por vértice (COLOR_0, sin material — three.js las
 * resuelve solas vía GLTFLoader). A diferencia de la v1, aquí SÍ hay que
 * respetar el material de cada malla tal cual viene, no reemplazarlo por uno
 * genérico: forzar `vertexColors` en todas rompía la malla con textura
 * (quedaba negra, sin su mapa). Solo se clona cada material para forzar
 * `side: DoubleSide` — sin esto, al girar el objeto casi plano hasta quedar
 * de canto la cara trasera desaparece (culling) y se ve como un
 * artefacto/rotura, no una silueta fina real. Verificado visualmente.
 */
export function HeroLogoScene({ interactive, pointer }: HeroLogoSceneProps) {
  const { scene } = useGLTF("/models/dream-prestamos-logo-v3.glb");

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const makeDoubleSided = (material: THREE.Material) => {
          const next = material.clone();
          next.side = THREE.DoubleSide;
          return next;
        };
        child.material = Array.isArray(child.material)
          ? child.material.map(makeDoubleSided)
          : makeDoubleSided(child.material);
      }
    });
    return clone;
  }, [scene]);

  const spinGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!spinGroupRef.current || !interactive) return;

    // Vaivén acotado (±0.12 rad), no rotación infinita — THEME.md §8
    // prohíbe explícitamente "mantener rotación infinita rápida"; usar
    // el reloj (no delta acumulado) evita que el ángulo crezca sin límite.
    spinGroupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
    const targetX = pointer.current.y * 0.15;
    const targetZ = -pointer.current.x * 0.1;
    spinGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      spinGroupRef.current.rotation.x,
      targetX,
      0.05,
    );
    spinGroupRef.current.rotation.z = THREE.MathUtils.lerp(
      spinGroupRef.current.rotation.z,
      targetZ,
      0.05,
    );
  });

  return (
    <group ref={spinGroupRef}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload("/models/dream-prestamos-logo-v3.glb");

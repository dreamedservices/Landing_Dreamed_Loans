"use client";

import dynamic from "next/dynamic";

/**
 * `ssr:false` en `next/dynamic` solo se permite dentro de un Client
 * Component (Next.js 16). Este wrapper existe solo para eso: mantiene todo
 * el chunk 3D (Three.js, R3F, Drei) fuera del camino crítico sin forzar
 * `HeroSection.tsx` a ser cliente completo.
 */
const HeroLogoCanvas = dynamic(
  () => import("./HeroLogoCanvas").then((mod) => mod.HeroLogoCanvas),
  { ssr: false },
);

export function HeroLogoCanvasLoader({ className }: { className?: string }) {
  return <HeroLogoCanvas className={className} />;
}

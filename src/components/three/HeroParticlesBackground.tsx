"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  radius: number;
  /** 0 = azul de marca, 1 = verde de marca; mezcla fija por partícula. */
  colorMix: number;
  /** Fase del vaivén de reposo, para que no floten todas en sincronía. */
  phase: number;
};

const COUNT = 90;
const HOVER_RADIUS = 130;
const BLUE: [number, number, number] = [79, 150, 240];
const GREEN: [number, number, number] = [92, 253, 25];

/**
 * Fondo de partículas de la sección completa del Hero (no solo el área del
 * logo). `<canvas>` 2D plano con su propio `requestAnimationFrame`,
 * deliberadamente NO React Three Fiber/WebGL: el presupuesto "un Canvas
 * principal como máximo" de ARQUITECTURA.md §8 es sobre el Canvas 3D (GLB,
 * DPR, postprocesado) — esta capa es una animación 2D mucho más barata y
 * ortogonal a esa regla, no una segunda instancia de la misma.
 *
 * Transparente y de bajo contraste en reposo (se lee como textura ambiental,
 * no como confeti); cada partícula crece y se aclara según su distancia al
 * puntero, así la interacción es individual por partícula, no del campo
 * completo. `pointer-events: none` (vía className del padre): decorativo,
 * nunca compite por clics con el header/CTA que se pintan encima.
 */
export function HeroParticlesBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const pointer = { x: -9999, y: -9999 };
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let raf = 0;
    let paused = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1 + Math.random() * 1.6,
        colorMix: Math.random(),
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function onPointerMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    }

    function onPointerLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
    }

    function onVisibilityChange() {
      paused = document.hidden;
      if (!paused && !raf) raf = requestAnimationFrame(draw);
    }

    function draw() {
      frame += 1;
      ctx!.clearRect(0, 0, width, height);

      for (const particle of particles) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const proximity = Math.max(0, 1 - distance / HOVER_RADIUS);

        const bob = Math.sin(frame * 0.012 + particle.phase) * 3;
        const r = BLUE[0] + (GREEN[0] - BLUE[0]) * particle.colorMix;
        const g = BLUE[1] + (GREEN[1] - BLUE[1]) * particle.colorMix;
        const b = BLUE[2] + (GREEN[2] - BLUE[2]) * particle.colorMix;

        const opacity = 0.16 + proximity * 0.6;
        const radius = particle.radius + proximity * 2.4;

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx!.arc(particle.x, particle.y + bob, radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      raf = paused ? 0 : requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

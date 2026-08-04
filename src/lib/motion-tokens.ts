/**
 * Valores documentados en FRONTEND.md §8 y THEME.md §9. No se usan todavía:
 * quedan listos para que Fase 04 (GSAP) los consuma en lugar de números sueltos.
 */

export const durations = {
  /** Hover, focus, cambios de estado puntuales (120–220 ms). */
  micro: 0.18,
  /** Entrada de un componente al viewport (350–700 ms). */
  enter: 0.5,
  /** Transición narrativa por scroll (700–1400 ms; puede superarse si depende de progreso). */
  narrative: 1,
} as const;

/**
 * Nombres de ease válidos para GSAP. THEME.md pide curvas suaves con salida
 * decidida y evitar rebotes/elasticidad en acciones financieras.
 */
export const easings = {
  micro: "power1.out",
  enter: "power2.out",
  narrative: "power3.inOut",
} as const;

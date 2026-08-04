import { create } from "zustand";

export type ExperienceQuality = "full" | "reduced" | "poster";

type ExperienceState = {
  quality: ExperienceQuality;
  setQuality: (quality: ExperienceQuality) => void;
};

/**
 * Único estado 3D realmente compartido (ARQUITECTURA.md §6): calidad de la
 * experiencia. No guarda datos de formulario, timelines ni objetos Three.js.
 */
export const useExperienceStore = create<ExperienceState>((set) => ({
  quality: "poster",
  setQuality: (quality) => set({ quality }),
}));

/**
 * Corre una sola vez en el cliente (CinematicCanvas). No es reactivo a
 * propósito: cambios de red/reduced-motion en caliente no degradan una
 * escena ya montada, para evitar reinicios bruscos.
 */
export function detectQuality(): ExperienceQuality {
  if (typeof window === "undefined") return "poster";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return "poster";

  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (connection?.saveData) return "poster";

  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  if (!gl) return "poster";

  const isSlowNetwork = connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g";
  const isNarrowViewport = window.innerWidth < 1280;
  if (isSlowNetwork || isNarrowViewport) return "reduced";

  return "full";
}

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ConsentStatus = "undecided" | "granted" | "denied";

type ConsentState = {
  status: ConsentStatus;
  grant: () => void;
  deny: () => void;
  /** Reabre el banner (enlace "Preferencias de cookies" del footer). */
  reset: () => void;
};

/**
 * Decisión de Fase 00: banner de consentimiento previo a la carga de
 * Google Analytics — no solo antes de disparar eventos, sino antes de que
 * el script de gtag.js entre al DOM (ver `GoogleAnalytics.tsx`).
 * Persistido en localStorage para no volver a preguntar en cada visita.
 */
export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      status: "undecided",
      grant: () => set({ status: "granted" }),
      deny: () => set({ status: "denied" }),
      reset: () => set({ status: "undecided" }),
    }),
    { name: "ga-consent" },
  ),
);

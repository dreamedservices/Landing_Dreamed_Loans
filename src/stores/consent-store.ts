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

/** Preferencia conjunta para Google Analytics y Meta Pixel. */
export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      status: "undecided",
      grant: () => set({ status: "granted" }),
      deny: () => set({ status: "denied" }),
      reset: () => set({ status: "undecided" }),
    }),
    // La clave nueva vuelve a pedir consentimiento a quienes aceptaron la
    // versión anterior, que solo mencionaba Google Analytics.
    { name: "analytics-advertising-consent-v1" },
  ),
);

"use client";

import { useConsentStore } from "@/stores/consent-store";

/** Reabre `ConsentBanner` (vuelve el estado a "undecided"). */
export function CookiePreferencesButton() {
  const reset = useConsentStore((state) => state.reset);

  return (
    <button
      type="button"
      onClick={reset}
      className="text-body text-brand-white/80 hover:text-brand-white"
    >
      Preferencias de cookies
    </button>
  );
}

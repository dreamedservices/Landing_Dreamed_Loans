"use client";

import { useConsentStore } from "@/stores/consent-store";

/**
 * Solo Pixel de navegador: el hosting (VPS de archivos estáticos, sin Node)
 * no puede ejecutar la Conversions API. Nunca pasar PII (correo, teléfono)
 * como parámetro, igual que el resto de la analítica del proyecto.
 */
export function trackMetaLeadConversion(): void {
  if (typeof window === "undefined" || useConsentStore.getState().status !== "granted") return;
  window.fbq?.("track", "Lead");
}

/** Evento personalizado: el usuario completó un campo del formulario. */
export function trackMetaFormFieldCompleted(fieldName: string): void {
  if (typeof window === "undefined" || useConsentStore.getState().status !== "granted") return;
  window.fbq?.("trackCustom", "FormFieldCompleted", { field_name: fieldName });
}

/** Evento personalizado: el usuario abandonó el formulario sin enviarlo. */
export function trackMetaFormAbandoned(lastField: string): void {
  if (typeof window === "undefined" || useConsentStore.getState().status !== "granted") return;
  window.fbq?.("trackCustom", "FormAbandoned", { last_field: lastField });
}

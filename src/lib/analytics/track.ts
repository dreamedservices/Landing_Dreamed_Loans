/**
 * Eventos mínimos de ARQUITECTURA.md §13. `trackEvent` nunca lanza ni
 * bloquea la interacción del usuario: si gtag no está cargado (sin
 * consentimiento, sin `NEXT_PUBLIC_GA_MEASUREMENT_ID`, SSR, sin JS) no hace
 * nada. Nunca pasar PII (nombre, correo, teléfono) como parámetro.
 */
export type AnalyticsEvent =
  | "cta_trial_click"
  | "cta_demo_click"
  | "lead_form_start"
  | "lead_form_error"
  | "lead_form_submit"
  | "lead_email_confirmed"
  | "registration_redirect"
  | "section_view"
  | "system_screenshot_select"
  | "system_screenshot_zoom"
  | "three_experience_loaded"
  | "three_fallback_used";

type Gtag = (command: "event", eventName: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function trackEvent(name: AnalyticsEvent, params?: Record<string, string | number | boolean>): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

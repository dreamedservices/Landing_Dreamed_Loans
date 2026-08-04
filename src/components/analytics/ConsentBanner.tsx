"use client";

import Link from "next/link";
import { useConsentStore } from "@/stores/consent-store";
import { Button } from "@/components/ui/Button";

/**
 * Banner de consentimiento (Fase 00): se muestra hasta que la persona decide
 * "Aceptar" o "Rechazar" — ninguna de las dos opciones carga Google
 * Analytics por sí sola; `GoogleAnalytics.tsx` solo monta el script cuando
 * `status === "granted"`. La decisión se persiste (zustand + localStorage,
 * `consent-store.ts`); no vuelve a preguntar en visitas futuras a menos que
 * se use "Preferencias de cookies" en el footer.
 */
export function ConsentBanner() {
  const status = useConsentStore((state) => state.status);
  const grant = useConsentStore((state) => state.grant);
  const deny = useConsentStore((state) => state.deny);

  if (status !== "undecided") return null;

  return (
    <div
      role="region"
      aria-label="Consentimiento de cookies"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line-dark bg-brand-ink px-6 py-5 shadow-soft-dark sm:px-8"
    >
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-small text-brand-white/80">
          Usamos Google Analytics para entender cómo se usa el sitio. Solo se
          activa si lo aceptas. Más detalles en{" "}
          <Link href="/cookies" className="underline hover:text-brand-white">
            nuestra política de cookies
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" tone="dark" size="sm" onClick={deny}>
            Rechazar
          </Button>
          <Button variant="primary" size="sm" onClick={grant}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}

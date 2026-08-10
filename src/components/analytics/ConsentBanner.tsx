"use client";

import Link from "next/link";
import { useConsentStore } from "@/stores/consent-store";
import { Button } from "@/components/ui/Button";

/** Google Analytics y Meta Pixel solo se cargan tras una aceptación expresa. */
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
          Con tu permiso usamos Google Analytics y Meta Pixel para medir el
          uso del sitio y la efectividad de nuestras campañas. Puedes aceptar
          o rechazar sin afectar el formulario. Más detalles en{" "}
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

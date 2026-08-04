"use client";

import Script from "next/script";
import { useConsentStore } from "@/stores/consent-store";
import { publicEnv } from "@/lib/env";

/**
 * gtag.js no se monta hasta que `status === "granted"` — no solo se difieren
 * los eventos, el script ni siquiera entra al DOM antes del consentimiento
 * (decisión de Fase 00: "banner de consentimiento previo a la carga").
 * Sin `NEXT_PUBLIC_GA_MEASUREMENT_ID` no renderiza nada, igual que el resto
 * de las integraciones opcionales de este proyecto.
 */
export function GoogleAnalytics() {
  const status = useConsentStore((state) => state.status);
  const measurementId = publicEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!measurementId || status !== "granted") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}

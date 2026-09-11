"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { publicEnv } from "@/lib/env";
import { useConsentStore } from "@/stores/consent-store";

/**
 * Carga Meta Pixel solo tras consentimiento. No incluye fallback <noscript>
 * porque ese recurso enviaría PageView antes de poder conocer la elección.
 */
export function MetaPixel() {
  const status = useConsentStore((state) => state.status);
  const pixelId = publicEnv.NEXT_PUBLIC_META_PIXEL_ID;
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);
  // El script base (con el fbq('init', ...)) corre de forma asíncrona; sin este
  // guard, un efecto en el primer render con consentimiento ya otorgado podía
  // disparar "track"/"consent" antes de que el init real hubiera ejecutado.
  const isPixelReadyRef = useRef(false);

  const trackPageView = useCallback(() => {
    if (!isPixelReadyRef.current || !window.fbq) return;
    if (lastTrackedPath.current === pathname) return;
    window.fbq("track", "PageView");
    lastTrackedPath.current = pathname;
  }, [pathname]);

  const handleScriptReady = useCallback(() => {
    isPixelReadyRef.current = true;
    window.fbq?.("consent", "grant");
    trackPageView();
  }, [trackPageView]);

  useEffect(() => {
    if (!pixelId || !isPixelReadyRef.current) return;
    if (status === "granted") {
      window.fbq?.("consent", "grant");
      trackPageView();
      return;
    }
    window.fbq?.("consent", "revoke");
    lastTrackedPath.current = null;
  }, [pixelId, status, trackPageView]);

  if (!pixelId || status !== "granted") return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive" onReady={handleScriptReady}>
      {`
        !function(f,b,e,v,n,t,s){
          if(!f.fbq){n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
          s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
        }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
        if (window.__dreamMetaPixelId !== '${pixelId}') {
          fbq('init', '${pixelId}');
          window.__dreamMetaPixelId = '${pixelId}';
        }
      `}
    </Script>
  );
}

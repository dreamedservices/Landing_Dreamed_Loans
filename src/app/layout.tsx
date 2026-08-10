import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";
import { publicEnv } from "@/lib/env";
import { SkipLink } from "@/components/layout/SkipLink";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MetaPixel } from "@/components/analytics/MetaPixel";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dream Préstamos",
  description:
    "Controla cada préstamo. Convierte cada cobro en claridad. Contenido provisional de la Fase 03.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bricolageGrotesque.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SkipLink />
        <SiteHeader loginUrl={publicEnv.NEXT_PUBLIC_SYSTEM_LOGIN_URL} />
        {children}
        <SiteFooter loginUrl={publicEnv.NEXT_PUBLIC_SYSTEM_LOGIN_URL} />
        <ConsentBanner />
        <GoogleAnalytics />
        <MetaPixel />
      </body>
    </html>
  );
}

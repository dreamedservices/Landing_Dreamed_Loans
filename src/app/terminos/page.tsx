import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";

export const metadata: Metadata = {
  title: "Términos",
  robots: { index: false, follow: true },
};

/**
 * Placeholder de Fase 03. El texto legal real (uso de la landing, solicitud
 * de prueba, condiciones reales del sistema, vigencia de la prueba —
 * STACK-TECNOLOGICO.md §6) se redacta y revisa legalmente en Fase 06.
 * No usar este contenido en producción.
 */
export default function TerminosPage() {
  return (
    <main id="contenido">
      <Section tone="light" className="py-24">
        <Container as="div" className="max-w-2xl">
          <Heading level={1} size="h2" tone="light">
            Términos y condiciones
          </Heading>
          <p className="mt-6 text-body text-brand-ink/80">
            Estamos preparando esta página. Aquí describiremos las
            condiciones de uso de esta landing, cómo funciona la solicitud de
            prueba gratis y las condiciones reales del sistema Dream
            Préstamos.
          </p>
        </Container>
      </Section>
    </main>
  );
}

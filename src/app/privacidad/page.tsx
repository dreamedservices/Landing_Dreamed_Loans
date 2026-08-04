import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";

export const metadata: Metadata = {
  title: "Privacidad",
  robots: { index: false, follow: true },
};

/**
 * Placeholder de Fase 03. El texto legal real (responsable del tratamiento,
 * datos recopilados, base y consentimiento, proveedor de correo, retención,
 * derechos, analítica y cookies — STACK-TECNOLOGICO.md §6) se redacta y
 * revisa legalmente en Fase 06. No usar este contenido en producción.
 */
export default function PrivacidadPage() {
  return (
    <main id="contenido">
      <Section tone="light" className="py-24">
        <Container as="div" className="max-w-2xl">
          <Heading level={1} size="h2" tone="light">
            Política de Privacidad
          </Heading>
          <p className="mt-6 text-body text-brand-ink/80">
            Estamos preparando esta página. Aquí explicaremos qué datos
            recopilamos a través del formulario de prueba gratis, con qué
            finalidad los usamos, cuánto tiempo los conservamos y cómo puedes
            ejercer tus derechos sobre ellos.
          </p>
        </Container>
      </Section>
    </main>
  );
}

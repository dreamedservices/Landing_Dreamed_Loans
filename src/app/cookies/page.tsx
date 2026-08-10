import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";

export const metadata: Metadata = {
  title: "Cookies",
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <main id="contenido">
      <Section tone="light" className="py-24">
        <Container as="div" className="max-w-2xl">
          <Heading level={1} size="h2" tone="light">Política de Cookies</Heading>
          <p className="mt-4 text-small text-brand-ink/60">Última actualización: 7 de agosto de 2026.</p>
          <p className="mt-6 text-body text-brand-ink/80">
            Dream Préstamos utiliza tecnologías de medición solo cuando eliges
            “Aceptar” en el banner. Rechazarlas no impide navegar ni enviar el formulario.
          </p>

          <Heading level={2} size="h3" tone="light" className="mt-10">Qué utilizamos</Heading>
          <p className="mt-4 text-body text-brand-ink/80">
            Google Analytics 4 nos ayuda a entender el uso agregado del sitio. Meta Pixel nos
            ayuda a medir si una campaña de Facebook o Instagram produjo una visita o una
            solicitud válida. No enviamos a estas herramientas el mensaje del formulario, el
            rango de cartera, el correo, el teléfono ni otra información personal o financiera.
          </p>

          <Heading level={2} size="h3" tone="light" className="mt-10">Datos y almacenamiento</Heading>
          <p className="mt-4 text-body text-brand-ink/80">
            Estas herramientas pueden usar identificadores como <code className="rounded bg-surface-soft px-1">_ga</code>,{" "}
            <code className="rounded bg-surface-soft px-1">_fbp</code> y <code className="rounded bg-surface-soft px-1">_fbc</code>,
            además de la URL visitada, navegador, dirección IP y parámetros de campaña.
          </p>

          <Heading level={2} size="h3" tone="light" className="mt-10">Tu elección</Heading>
          <p className="mt-4 text-body text-brand-ink/80">
            La elección se guarda en <code className="rounded bg-surface-soft px-1">localStorage</code> con
            la clave <code className="rounded bg-surface-soft px-1">analytics-advertising-consent-v1</code>.
            Puedes retirarla en cualquier momento desde “Preferencias de cookies” en el pie de página.
            Al retirarla se desactiva el envío de eventos posteriores; también puedes eliminar las
            cookies ya existentes desde la configuración de tu navegador.
          </p>

          <Heading level={2} size="h3" tone="light" className="mt-10">Proveedores</Heading>
          <p className="mt-4 text-body text-brand-ink/80">
            Consulta las políticas de{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Google</a>
            {" y "}
            <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="underline">Meta</a>
            {" "}para conocer sus prácticas y plazos de conservación.
          </p>
        </Container>
      </Section>
    </main>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";

export const metadata: Metadata = {
  title: "Cookies",
  robots: { index: false, follow: true },
};

/**
 * A diferencia de /privacidad y /terminos (placeholders puros), esta página
 * describe lo que el sitio realmente hace hoy (Google Analytics 4 detrás de
 * un banner de consentimiento) — el propio banner enlaza aquí, así que no
 * puede ser un "estamos preparando esta página". Aun así, pendiente de
 * revisión legal antes de tratarse como texto definitivo (Fase 00/06).
 */
export default function CookiesPage() {
  return (
    <main id="contenido">
      <Section tone="light" className="py-24">
        <Container as="div" className="max-w-2xl">
          <Heading level={1} size="h2" tone="light">
            Política de Cookies
          </Heading>
          <p className="mt-6 text-body text-brand-ink/80">
            Este sitio usa Google Analytics 4 para entender cómo se usa la
            página (qué secciones se ven, qué botones se presionan) y así
            mejorarla. Nunca lo hacemos sin tu permiso.
          </p>

          <Heading level={2} size="h3" tone="light" className="mt-10">
            Cómo funciona el consentimiento
          </Heading>
          <p className="mt-4 text-body text-brand-ink/80">
            Al entrar al sitio ves un banner con dos opciones: &ldquo;Aceptar&rdquo; o
            &ldquo;Rechazar&rdquo;. Mientras no elijas ninguna, Google Analytics no se
            carga — ni siquiera el script se descarga. Si rechazas, tampoco
            se carga. Tu elección se guarda en tu navegador (
            <code className="rounded bg-surface-soft px-1 py-0.5 text-small">
              localStorage
            </code>
            , clave <code className="rounded bg-surface-soft px-1 py-0.5 text-small">ga-consent</code>) para
            no volver a preguntarte en cada visita. Puedes cambiar tu decisión
            cuando quieras desde &ldquo;Preferencias de cookies&rdquo; en el pie de
            página.
          </p>

          <Heading level={2} size="h3" tone="light" className="mt-10">
            Qué mide Google Analytics aquí
          </Heading>
          <p className="mt-4 text-body text-brand-ink/80">
            Páginas y secciones vistas, clics en los botones principales
            (probar gratis, ver cómo funciona) y si el formulario de prueba
            gratis se completó con éxito. Estos eventos nunca incluyen tu
            nombre, correo, teléfono ni ningún otro dato que hayas escrito en
            el formulario.
          </p>

          <Heading level={2} size="h3" tone="light" className="mt-10">
            Cookies estrictamente necesarias
          </Heading>
          <p className="mt-4 text-body text-brand-ink/80">
            Aparte de Analytics, el sitio guarda en tu navegador tu elección
            de consentimiento y, si envías el formulario, información técnica
            necesaria para procesar esa solicitud una sola vez. Ninguna de
            estas requiere tu permiso porque son indispensables para que el
            sitio funcione.
          </p>

          <Heading level={2} size="h3" tone="light" className="mt-10">
            Más información
          </Heading>
          <p className="mt-4 text-body text-brand-ink/80">
            Google explica qué datos procesa y con qué fines en su{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Política de Privacidad
            </a>
            .
          </p>
        </Container>
      </Section>
    </main>
  );
}

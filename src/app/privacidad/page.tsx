import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";

export const metadata: Metadata = {
  title: "Privacidad",
  robots: { index: false, follow: true },
};

const contactEmail = "dreamedservice@gmail.com";

export default function PrivacidadPage() {
  return (
    <main id="contenido">
      <Section tone="light" className="py-24">
        <Container as="div" className="max-w-2xl">
          <Heading level={1} size="h2" tone="light">Política de Privacidad</Heading>
          <p className="mt-4 text-small text-brand-ink/60">Última actualización: 7 de agosto de 2026.</p>

          <Heading level={2} size="h3" tone="light" className="mt-10">Responsable y contacto</Heading>
          <p className="mt-4 text-body text-brand-ink/80">
            Dream Préstamos es responsable del tratamiento descrito aquí. Para consultas,
            acceso, corrección o eliminación de datos, escribe a{" "}
            <a className="underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>.
          </p>

          <Heading level={2} size="h3" tone="light" className="mt-10">Datos que recopilamos</Heading>
          <p className="mt-4 text-body text-brand-ink/80">
            Al solicitar una prueba recopilamos nombre, empresa, correo, teléfono, país,
            tamaño de equipo y, si decides proporcionarlos, rango de cartera y mensaje.
            También registramos fecha, URL y parámetros de atribución de campaña. El
            consentimiento comercial opcional es independiente del necesario para responder tu solicitud.
          </p>

          <Heading level={2} size="h3" tone="light" className="mt-10">Para qué los usamos</Heading>
          <p className="mt-4 text-body text-brand-ink/80">
            Usamos los datos para gestionar la solicitud, contactarte, enviarte una confirmación,
            prevenir abuso y, cuando lo autorizas, medir el rendimiento del sitio y de las campañas.
            No vendemos los datos ni enviamos a Meta el contenido financiero o libre del formulario.
          </p>

          <Heading level={2} size="h3" tone="light" className="mt-10">Proveedores y transferencias</Heading>
          <p className="mt-4 text-body text-brand-ink/80">
            Nuestro proveedor de correo (SMTP propio) procesa el envío de la solicitud. Google Analytics
            y Meta procesan medición solo después de aceptar las tecnologías opcionales. Estos
            proveedores pueden procesar información fuera de tu país bajo sus propios mecanismos
            contractuales y políticas de privacidad.
          </p>

          <Heading level={2} size="h3" tone="light" className="mt-10">Conservación y seguridad</Heading>
          <p className="mt-4 text-body text-brand-ink/80">
            Conservamos la solicitud durante el tiempo necesario para atenderla y cumplir
            obligaciones aplicables. Aplicamos validación, controles anti-bot y minimización de
            datos. No enviamos correo, teléfono ni otros datos personales del formulario a Meta;
            la medición de campañas ocurre solo en el navegador, mediante el Pixel.
          </p>

          <Heading level={2} size="h3" tone="light" className="mt-10">Tus opciones</Heading>
          <p className="mt-4 text-body text-brand-ink/80">
            Puedes rechazar o retirar la medición desde “Preferencias de cookies”. También puedes
            solicitar información, rectificación o eliminación escribiendo al correo indicado.
            Podremos pedir datos razonables para verificar la identidad antes de responder.
          </p>
        </Container>
      </Section>
    </main>
  );
}

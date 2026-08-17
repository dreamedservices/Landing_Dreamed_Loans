import { UserPlus, Rocket, CreditCard } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { TrackedCtaButton } from "@/components/analytics/TrackedCtaButton";
import { PricingPlans } from "./PricingPlans";
import { site } from "@/config/site";

const steps = [
  {
    icon: UserPlus,
    title: "Creas tu cuenta",
    description: "Te registras en minutos, sin tarjeta ni datos de pago.",
  },
  {
    icon: Rocket,
    title: `Usas el sistema ${site.trialDays} días gratis`,
    description: "Acceso completo desde el primer minuto: clientes, préstamos, cobranza y reportes.",
  },
  {
    icon: CreditCard,
    title: "Pagas dentro del sistema",
    description: "Al terminar la prueba, eliges tu plan y activas el pago directamente desde tu cuenta.",
  },
];

/**
 * Precios y límites según la propuesta comercial vigente (Etapa 1: Lanzamiento).
 * Enterprise Dedicado se muestra como opción premium separada, no como cuarta
 * columna del comparativo (recomendación estratégica de la propuesta).
 */
export function PricingSection() {
  return (
    <Section id="planes" tone="light">
      <Container as="div">
        <Eyebrow tone="light">Planes</Eyebrow>
        <TextReveal>
          <Heading level={2} tone="light" className="mt-2 max-w-2xl">
            Empieza gratis. Paga solo cuando decidas quedarte.
          </Heading>
        </TextReveal>
        <p className="mt-4 max-w-2xl text-lead text-brand-ink/80">
          Toda cuenta nueva arranca con {site.trialDays} días de prueba completa, sin costo y sin
          tarjeta. Elige tu plan cuando estés listo, directamente desde el sistema.
        </p>

        {/* Proceso: quita la fricción de "¿cuándo pago?" antes de que la pregunta aparezca. */}
        <Reveal className="mt-10 grid gap-6 rounded-lg border border-line-light bg-brand-white p-6 sm:grid-cols-3 sm:p-8">
          {steps.map((step, index) => (
            <div key={step.title} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] text-brand-white">
                <step.icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-small font-medium uppercase tracking-[0.08em] text-brand-ink/50">
                  Paso {index + 1}
                </p>
                <Heading level={3} tone="light" className="mt-1">
                  {step.title}
                </Heading>
                <p className="mt-1 text-body text-brand-ink/80">{step.description}</p>
              </div>
            </div>
          ))}
        </Reveal>

        <PricingPlans />

        <Reveal className="mt-12">
          <Card tone="dark" className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge tone="neutral">Enterprise Dedicado</Badge>
              <Heading level={3} tone="dark" className="mt-3">
                ¿Necesitas una instalación exclusiva para tu financiera?
              </Heading>
              <p className="mt-2 max-w-2xl text-body text-brand-white/80">
                Instancia y base de datos dedicadas, dominio propio, white label, personalizaciones a
                medida, integraciones externas, backups dedicados y SLA empresarial. Desde USD 299/mes
                más implementación.
              </p>
            </div>
            <TrackedCtaButton
              event="cta_demo_click"
              href="https://wa.me/18092304923?text=Hola,%20quiero%20hablar%20con%20ventas%20sobre%20una%20instalación%20dedicada%20de%20Dreamed%20Préstamos."
              variant="secondary"
              tone="dark"
              className="shrink-0"
            >
              Hablar con ventas
            </TrackedCtaButton>
          </Card>
        </Reveal>
      </Container>
    </Section>
  );
}

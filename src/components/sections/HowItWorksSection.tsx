import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

const steps = [
  {
    title: "Configura tu negocio",
    description: "Define tu empresa, monedas de trabajo y quién forma parte del equipo.",
  },
  {
    title: "Registra clientes y préstamos",
    description: "Da de alta tu cartera actual o impórtala desde Excel con validación.",
  },
  {
    title: "Asigna rutas y cobra",
    description: "Organiza a tus cobradores por ruta y sigue el avance de cada jornada.",
  },
  {
    title: "Revisa caja y reportes",
    description: "Consulta cartera, pagos, atrasos y rendimiento por cobrador cuando lo necesites.",
  },
];

export function HowItWorksSection() {
  return (
    <Section id="como-funciona" tone="light">
      <Container as="div">
        <Eyebrow tone="light">Cómo funciona</Eyebrow>
        <TextReveal>
          <Heading level={2} tone="light" className="mt-2 max-w-2xl">
            De la configuración inicial al primer reporte.
          </Heading>
        </TextReveal>

        <Reveal>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title}>
                <Card tone="light" className="h-full">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] text-body font-semibold text-brand-white"
                  >
                    {index + 1}
                  </span>
                  <Heading level={3} tone="light" className="mt-4">
                    {step.title}
                  </Heading>
                  <p className="mt-2 text-body text-brand-ink/80">{step.description}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </Section>
  );
}

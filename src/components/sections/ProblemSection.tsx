import { FileWarning, MapPinOff, AlertTriangle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

const points = [
  {
    icon: FileWarning,
    title: "Clientes y préstamos dispersos",
    description: "Hojas de cálculo, cuadernos y mensajes sueltos que no siempre coinciden entre sí.",
  },
  {
    icon: MapPinOff,
    title: "Cobradores sin visibilidad de ruta",
    description: "Cada cobrador sabe su propia ruta, pero el negocio no ve el conjunto en tiempo real.",
  },
  {
    icon: AlertTriangle,
    title: "Caja y mora difíciles de rastrear",
    description: "Confirmar qué se cobró, qué falta y qué está atrasado toma tiempo y llamadas.",
  },
];

/** Copy provisional de Fase 00, pendiente de aprobación literal. Sin promesas absolutas. */
export function ProblemSection() {
  return (
    <Section tone="light">
      <Container as="div">
        <Eyebrow tone="light">El problema</Eyebrow>
        <TextReveal>
          <Heading level={2} tone="light" className="mt-2 max-w-2xl">
            La operación de préstamos se vuelve difícil de seguir cuando vive en
            varios lugares a la vez.
          </Heading>
        </TextReveal>

        <Reveal className="mt-12 grid gap-6 sm:grid-cols-3">
          {points.map((point) => (
            <Card key={point.title} tone="light">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5effd] text-brand-blue">
                <point.icon aria-hidden="true" className="h-5 w-5" />
              </div>
              <Heading level={3} tone="light" className="mt-4">
                {point.title}
              </Heading>
              <p className="mt-2 text-body text-brand-ink/80">{point.description}</p>
            </Card>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

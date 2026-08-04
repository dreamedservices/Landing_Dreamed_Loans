import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Parallax } from "@/components/motion/Parallax";
import { LoanCalculatorWidget } from "./LoanCalculatorWidget";

/** Calculadora de préstamos, funcional: misma fórmula del dashboard real. */
export function LoanCalculatorSection() {
  return (
    <Section tone="light">
      <Container as="div">
        <Reveal>
          <Eyebrow tone="light">Calculadora de préstamos</Eyebrow>
          <TextReveal>
            <Heading level={2} tone="light" className="mt-2 max-w-2xl">
              Cotiza las condiciones antes de aprobar un préstamo.
            </Heading>
          </TextReveal>
          <p className="mt-4 max-w-prose text-lead text-brand-ink/80">
            Define el capital, las cuotas y el interés para ver la proyección
            del préstamo antes de registrarlo — pruébala aquí mismo, es la
            misma calculadora del dashboard.
          </p>
        </Reveal>

        <Parallax offset={20} className="mt-12">
          <LoanCalculatorWidget />
        </Parallax>
      </Container>
    </Section>
  );
}

import { ShieldCheck, History, Eye } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

/**
 * Confianza basada en capacidades verificadas (FASE-00, FASE-03). Sin
 * testimonios, cifras ni certificaciones — ninguna está autorizada todavía.
 */
const points = [
  {
    icon: ShieldCheck,
    title: "Permisos por módulo",
    description: "Cada rol ve y hace solo lo que le corresponde, desde cobranza hasta caja.",
  },
  {
    icon: History,
    title: "Trazabilidad de cada pago",
    description: "Los pagos parciales, abonos y anulaciones quedan registrados con su contexto.",
  },
  {
    icon: Eye,
    title: "Vista previa antes de confirmar",
    description: "Revisa cómo se distribuye un cobro antes de aplicarlo, no después.",
  },
];

export function TrustSection() {
  return (
    <Section tone="deep">
      <Container as="div">
        <Eyebrow tone="dark">Por qué confiar</Eyebrow>
        <TextReveal>
          <Heading level={2} tone="dark" className="mt-2 max-w-2xl">
            Control basado en cómo funciona el sistema, no en promesas.
          </Heading>
        </TextReveal>

        <Reveal className="mt-12 grid gap-6 sm:grid-cols-3">
          {points.map((point) => (
            <Card key={point.title} tone="dark">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-brand-blue">
                <point.icon aria-hidden="true" className="h-5 w-5" />
              </div>
              <Heading level={3} tone="dark" className="mt-4">
                {point.title}
              </Heading>
              <p className="mt-2 text-body text-brand-white/80">{point.description}</p>
            </Card>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

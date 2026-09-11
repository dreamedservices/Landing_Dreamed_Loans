import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { LeadForm } from "@/components/forms/LeadForm";
import { site } from "@/config/site";
import { TextReveal } from "@/components/motion/TextReveal";

export function TrialSection() {
  return (
    <Section id="prueba-gratis" tone="deep">
      <Container as="div" className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Eyebrow tone="dark">Exclusivo para financieras y prestamistas</Eyebrow>
          <TextReveal>
            <Heading level={2} tone="dark" className="mt-2">
              Empieza tu prueba gratis de {site.trialDays} días.
            </Heading>
          </TextReveal>
          <p className="mt-4 max-w-prose text-lead text-brand-white/80">
            Dream Préstamos es un sistema de gestión pensado para{" "}
            <strong className="text-brand-white">financieras, prestamistas y cooperativas</strong>{" "}
            que ya operan préstamos. Completa la solicitud y te llevamos al
            registro de Dream Préstamos.
          </p>
        </div>

        <Card tone="light">
          <LeadForm />
        </Card>
      </Container>
    </Section>
  );
}

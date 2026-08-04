import { Users, MessageCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

/** Equipo y automatización (README.md §Capacidades verificadas). id="equipo". */
export function TeamAutomationSection() {
  return (
    <Section id="equipo" tone="deep">
      <Container as="div">
        <Reveal>
          <Eyebrow tone="dark">Equipo y automatización</Eyebrow>
          <TextReveal>
            <Heading level={2} tone="dark" className="mt-2 max-w-2xl">
              Cada persona ve solo lo que le corresponde.
            </Heading>
          </TextReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <Card tone="light" interactive>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5effd] text-brand-blue">
                <Users aria-hidden="true" className="h-5 w-5" />
              </div>
              <Heading level={3} tone="light" className="mt-4">
                Roles y permisos por módulo
              </Heading>
              <p className="mt-2 text-body text-brand-ink/80">
                Define qué puede ver y hacer cada persona del equipo — desde un
                cobrador en ruta hasta quien administra caja y reportes.
              </p>
            </Card>

            <Card tone="light" interactive>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#deffd1] text-brand-ink">
                <MessageCircle aria-hidden="true" className="h-5 w-5" />
              </div>
              <Heading level={3} tone="light" className="mt-4">
                Recordatorios por WhatsApp
              </Heading>
              <p className="mt-2 text-body text-brand-ink/80">
                Automatiza recordatorios de pago para reducir el seguimiento
                manual por mensaje.
              </p>
            </Card>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

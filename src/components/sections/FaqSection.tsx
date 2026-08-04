import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { TextReveal } from "@/components/motion/TextReveal";

/**
 * Borrador de Fase 00, pendiente de aprobación literal. Excluye a propósito
 * las preguntas sobre precio post-prueba y detalle de privacidad: dependen
 * de decisiones comerciales/legales que todavía no están cerradas.
 */
const faqs = [
  {
    question: "¿Qué es Dream Préstamos?",
    answer:
      "Un sistema para gestionar préstamos, clientes, cobradores, rutas, caja y reportes desde un solo lugar.",
  },
  {
    question: "¿Puedo importar mis clientes actuales?",
    answer: "Sí, el sistema permite importar clientes desde Excel con validación.",
  },
  {
    question: "¿Sirve para cobradores que trabajan en la calle?",
    answer:
      "Sí, hay una experiencia específica para cobradores en ruta, con mapas y geolocalización.",
  },
  {
    question: "¿Desde qué dispositivos se usa?",
    answer:
      "El equipo de cobranza puede trabajar desde el celular en la ruta; la administración funciona desde computadora o tablet.",
  },
  {
    question: "¿Puedo registrar pagos parciales o abonos?",
    answer:
      "Sí, los pagos son flexibles: vista previa, pagos parciales, abonos, mora y anulación controlada.",
  },
  {
    question: "¿Tiene reportes de cartera y caja?",
    answer:
      "Sí, incluye reportes de cartera, pagos, vencimientos, atrasos, caja y rendimiento de cobradores.",
  },
  {
    question: "¿Puedo dar acceso limitado a mi equipo?",
    answer: "Sí, el sistema tiene roles y permisos por módulo.",
  },
  {
    question: "¿Envía recordatorios automáticos?",
    answer: "Sí, hay automatización y recordatorios por WhatsApp.",
  },
  {
    question: "¿Cuánto dura la prueba gratis?",
    answer: "14 días.",
  },
  {
    question: "¿Dónde puedo pedir ayuda?",
    answer: "Escríbenos a dreamedservice@gmail.com.",
  },
];

/** Sin JavaScript: <details>/<summary> nativos, funcionan sin GSAP (THEME.md §6 FAQ). */
export function FaqSection() {
  return (
    <Section id="preguntas" tone="light">
      <Container as="div">
        <Eyebrow tone="light">Preguntas frecuentes</Eyebrow>
        <TextReveal>
          <Heading level={2} tone="light" className="mt-2 max-w-2xl">
            Lo que preguntan antes de probarlo.
          </Heading>
        </TextReveal>

        <div className="mt-10 flex max-w-3xl flex-col divide-y divide-line-light border-y border-line-light">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="cursor-pointer list-none text-lead font-medium text-brand-ink marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span aria-hidden="true" className="text-brand-ink/50 group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-body text-brand-ink/80">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}

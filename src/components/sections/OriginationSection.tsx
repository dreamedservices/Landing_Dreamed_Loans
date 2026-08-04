import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FichaTimelineReveal } from "@/components/motion/FichaTimelineReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Parallax } from "@/components/motion/Parallax";

/** Datos ilustrativos — PATRON-FICHA-DETALLE.md §4. No representan un préstamo real. */
const loan = {
  id: "PR-0842",
  status: "Al día" as const,
  principal: "RD$ 45,000",
  interest: "RD$ 6,750",
  total: "RD$ 51,750",
  balance: "RD$ 18,300",
  nextPayment: "28 de julio · RD$ 4,312",
};

const timeline = [
  { label: "Desembolso", done: true },
  { label: "Cuota 1", done: true },
  { label: "Cuota 2", done: true },
  { label: "Próximo pago", done: false },
];

const payments = [
  { date: "28/06/2026", amount: "RD$ 4,312", status: "Pagado" as const },
  { date: "28/05/2026", amount: "RD$ 4,312", status: "Pagado" as const },
  { date: "28/04/2026", amount: "RD$ 4,312", status: "Pagado" as const },
];

const documents = ["Recibo", "Contrato", "Pagaré"];

/** PATRON-FICHA-DETALLE.md. Ficha en HTML/CSS; sin acciones falsas enfocables. */
export function OriginationSection() {
  return (
    <Section id="funciones" tone="light">
      <Container as="div">
        <Eyebrow tone="light">Originación</Eyebrow>
        <TextReveal>
          <Heading level={2} tone="light" className="mt-2 max-w-2xl">
            Cada préstamo, explicado de principio a fin.
          </Heading>
        </TextReveal>
        <p className="mt-4 max-w-prose text-lead text-brand-ink/80">
          Registra clientes y préstamos, importa tu cartera actual desde Excel
          con validación, y consulta capital, interés, cuotas y saldo desde
          una ficha que mantiene el contexto.
        </p>

        <Parallax offset={24}>
        <FichaTimelineReveal className="mt-12">
          <Card tone="dark">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-dark pb-4">
              <div>
                <p className="text-small text-brand-white/60">Préstamo (ficticio)</p>
                <p className="text-h3 font-display text-brand-white">{loan.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="success">{loan.status}</Badge>
                <Badge tone="neutral">Datos ilustrativos</Badge>
              </div>
            </div>

            <dl className="mt-6 grid gap-6 sm:grid-cols-4">
              <div>
                <dt className="text-small text-brand-white/60">Capital</dt>
                <dd className="mt-1 text-body font-medium text-brand-white tabular-nums">{loan.principal}</dd>
              </div>
              <div>
                <dt className="text-small text-brand-white/60">Interés</dt>
                <dd className="mt-1 text-body font-medium text-brand-white tabular-nums">{loan.interest}</dd>
              </div>
              <div>
                <dt className="text-small text-brand-white/60">Total</dt>
                <dd className="mt-1 text-body font-medium text-brand-white tabular-nums">{loan.total}</dd>
              </div>
              <div>
                <dt className="text-small text-brand-white/60">Saldo</dt>
                <dd className="mt-1 text-body font-medium text-brand-white tabular-nums">{loan.balance}</dd>
              </div>
            </dl>

            <div className="mt-8">
              <p className="text-small text-brand-white/60">Próximo pago: {loan.nextPayment}</p>
              <ol className="mt-3 flex items-center gap-2">
                {timeline.map((step, index) => (
                  <li key={step.label} className="flex flex-1 items-center gap-2">
                    <span
                      data-timeline-step={step.done ? "" : undefined}
                      aria-hidden="true"
                      className={
                        "h-2 flex-1 rounded-full " +
                        (step.done ? "bg-[image:var(--gradient-brand)]" : "bg-white/15")
                      }
                    />
                    <span className="sr-only">
                      {index + 1}. {step.label}
                      {step.done ? " (completado)" : " (pendiente)"}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-2 flex justify-between text-small text-brand-white/60">
                {timeline.map((step) => (
                  <span key={step.label}>{step.label}</span>
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-body text-brand-white">
                  <caption className="mb-2 text-left text-small text-brand-white/60">
                    Pagos — datos ilustrativos
                  </caption>
                  <thead>
                    <tr className="border-b border-line-dark">
                      <th scope="col" className="py-2 pr-4 font-medium">
                        Fecha
                      </th>
                      <th scope="col" className="py-2 pr-4 font-medium">
                        Monto
                      </th>
                      <th scope="col" className="py-2 font-medium">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.date} data-payment-row className="border-b border-line-dark last:border-none">
                        <td className="py-2 pr-4">{payment.date}</td>
                        <td className="py-2 pr-4 tabular-nums">{payment.amount}</td>
                        <td className="py-2">
                          <Badge tone="neutral">{payment.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <p className="text-small text-brand-white/60">Documentos disponibles</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {documents.map((document) => (
                    <li key={document} data-document-item className="text-body text-brand-white/80">
                      {document}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </FichaTimelineReveal>
        </Parallax>
      </Container>
    </Section>
  );
}

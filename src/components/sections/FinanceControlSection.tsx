import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Parallax } from "@/components/motion/Parallax";

/** Datos ilustrativos: distribución de un cobro de ejemplo. */
const distribution = [
  { label: "Cuota", value: 60, className: "bg-brand-blue" },
  { label: "Mora", value: 10, className: "bg-red-400" },
  { label: "Abono", value: 20, className: "bg-brand-green" },
  { label: "Saldo pendiente", value: 10, className: "bg-black/15" },
];

const reports = ["Cartera", "Pagos", "Vencimientos", "Atrasos", "Caja", "Rendimiento de cobradores"];

/** Copy de la card tomado de COMPONENTE-CARDS-MODALES.md §9 (ya aprobado como ejemplo). */
export function FinanceControlSection() {
  return (
    <Section tone="light">
      <Container as="div">
        <Reveal className="grid items-center gap-12 lg:grid-cols-2">
          <Parallax offset={20} className="order-2 lg:order-1">
          <Card tone="dark">
            <div className="flex items-center justify-between gap-3">
              <p className="text-small text-brand-white/60">Vista previa del cobro</p>
              <Badge tone="neutral">Datos ilustrativos</Badge>
            </div>

            <div
              role="img"
              aria-label={`Distribución del cobro: ${distribution
                .map((part) => `${part.label} ${part.value}%`)
                .join(", ")}`}
              className="mt-6 flex h-4 w-full overflow-hidden rounded-full"
            >
              {distribution.map((part) => (
                <span
                  key={part.label}
                  aria-hidden="true"
                  className={part.className}
                  style={{ width: `${part.value}%` }}
                />
              ))}
            </div>

            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {distribution.map((part) => (
                <li key={part.label} className="flex items-center gap-2 text-small text-brand-white/80">
                  <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${part.className}`} />
                  {part.label} · {part.value}%
                </li>
              ))}
            </ul>

            <p className="mt-6 text-small text-brand-white/60">
              Reportes disponibles: {reports.join(" · ")}.
            </p>
          </Card>
          </Parallax>

          <div className="order-1 lg:order-2">
            <Eyebrow tone="light">Control financiero</Eyebrow>
            <TextReveal>
              <Heading level={2} tone="light" className="mt-2">
                Pagos flexibles sin perder el control
              </Heading>
            </TextReveal>
            <p className="mt-4 max-w-prose text-lead text-brand-ink/80">
              Previsualiza cómo se distribuye cada cobro entre cuota, mora,
              abono y saldo pendiente antes de confirmarlo. Abre, opera y
              cierra caja, y consulta ingresos y egresos junto a los reportes
              de cartera.
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

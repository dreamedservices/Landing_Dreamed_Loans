import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DashboardCounters } from "@/components/motion/DashboardCounters";
import { TextReveal } from "@/components/motion/TextReveal";
import { Parallax } from "@/components/motion/Parallax";

/** Datos ilustrativos — PATRON-DASHBOARD.md §5. No representan clientes reales. */
const kpis = [
  { label: "Capital colocado", value: "RD$ 4.2M" },
  { label: "Cobros del período", value: "RD$ 812K" },
  { label: "Cartera pendiente", value: "RD$ 1.6M" },
  { label: "Préstamos activos", value: "128" },
];

const weeklyCollections = [
  { day: "Lun", amount: 62 },
  { day: "Mar", amount: 74 },
  { day: "Mié", amount: 58 },
  { day: "Jue", amount: 81 },
  { day: "Vie", amount: 90 },
];

const maxCollection = Math.max(...weeklyCollections.map((day) => day.amount));

const routesToday = [
  { collector: "Ruta 1 — J. M.", status: "En ruta" as const },
  { collector: "Ruta 2 — A. R.", status: "Pendiente" as const },
  { collector: "Ruta 3 — L. S.", status: "Al día" as const },
];

const statusTone = {
  "En ruta": "warning",
  Pendiente: "info",
  "Al día": "success",
} as const;

/** PATRON-DASHBOARD.md. Ventana de producto en HTML/CSS, sin animación (llega en Fase 04). */
export function DashboardStorySection() {
  return (
    <Section id="producto" tone="deep">
      <Container as="div">
        <Eyebrow tone="dark">Producto</Eyebrow>
        <TextReveal>
          <Heading level={2} tone="dark" className="mt-2 max-w-2xl">
            Toda tu operación, en una sola pantalla.
          </Heading>
        </TextReveal>
        <p className="mt-4 max-w-prose text-lead text-brand-white/80">
          Sigue capital, ingresos, préstamos activos, rutas y próximos cobros
          desde el dashboard.
        </p>

        <Parallax offset={24}>
        <Card tone="light" className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-small font-medium text-brand-ink/60">
              Período: Este mes
            </span>
            <Badge tone="neutral">Datos ilustrativos</Badge>
          </div>

          <DashboardCounters>
            <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {kpis.map((kpi) => (
                <div key={kpi.label} data-kpi>
                  <dt className="text-small text-brand-ink/60">{kpi.label}</dt>
                  <dd className="mt-1 text-h3 font-display text-brand-ink tabular-nums">{kpi.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div>
                <Heading level={3} tone="light">
                  Cobros de la semana
                </Heading>
                <div
                  role="img"
                  aria-label={`Cobros de la semana: ${weeklyCollections
                    .map((day) => `${day.day} ${day.amount} mil pesos`)
                    .join(", ")}`}
                  className="mt-4 flex h-32 items-end gap-3"
                >
                  {weeklyCollections.map((day) => (
                    <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        data-bar
                        aria-hidden="true"
                        className="w-full rounded-t-sm bg-[image:var(--gradient-brand)]"
                        style={{ height: `${(day.amount / maxCollection) * 100}%` }}
                      />
                      <span className="text-small text-brand-ink/60">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Heading level={3} tone="light">
                  Rutas de hoy
                </Heading>
                <ul className="mt-4 flex flex-col gap-3">
                  {routesToday.map((route) => (
                    <li
                      key={route.collector}
                      className="flex items-center justify-between border-b border-line-light pb-3 last:border-none"
                    >
                      <span className="text-body text-brand-ink">{route.collector}</span>
                      <Badge tone={statusTone[route.status]}>{route.status}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DashboardCounters>
        </Card>
        </Parallax>
      </Container>
    </Section>
  );
}

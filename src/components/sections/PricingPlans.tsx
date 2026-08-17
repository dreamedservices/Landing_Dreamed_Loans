"use client";

import { useState } from "react";
import { Check, PiggyBank } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedCtaButton } from "@/components/analytics/TrackedCtaButton";
import { trialAnchor } from "@/config/navigation";
import { cn } from "@/lib/cn";
import { site } from "@/config/site";

type Plan = {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  highlighted?: boolean;
  limits: string[];
};

const plans: Plan[] = [
  {
    name: "Inicial",
    monthlyPrice: 19,
    annualPrice: 205,
    limits: ["200 clientes", "USD 10,000 de cartera activa", "1 administrador", "1 cobrador"],
  },
  {
    name: "Profesional",
    monthlyPrice: 49,
    annualPrice: 529,
    highlighted: true,
    limits: [
      "2,000 clientes",
      "USD 100,000 de cartera activa",
      "Hasta 5 usuarios",
      "10 cobradores",
    ],
  },
  {
    name: "Empresarial",
    monthlyPrice: 99,
    annualPrice: 1069,
    limits: [
      "Clientes ilimitados",
      "Cartera activa ilimitada",
      "Usuarios ilimitados",
      "Cobradores ilimitados",
    ],
  },
];

/**
 * Precios y límites según la propuesta comercial vigente (Etapa 1: Lanzamiento).
 * El anual ya trae el 10% de descuento aplicado (ej. Profesional: 49*12*0.9 ≈ 529).
 */
export function PricingPlans() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3">
        <span className={cn("text-body font-medium", annual ? "text-brand-ink/50" : "text-brand-ink")}>
          Mensual
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={annual}
          aria-label="Cambiar entre precio mensual y anual"
          onClick={() => setAnnual((value) => !value)}
          className="relative inline-flex h-7 w-13 shrink-0 items-center rounded-full bg-[image:var(--gradient-brand)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          <span
            aria-hidden="true"
            className={cn(
              "inline-block h-5 w-5 rounded-full bg-brand-white shadow-soft-light transition-transform duration-150",
              annual ? "translate-x-7" : "translate-x-1",
            )}
          />
        </button>
        <span className={cn("text-body font-medium", annual ? "text-brand-ink" : "text-brand-ink/50")}>
          Anual
        </span>
        <Badge tone="success">Ahorra 10%</Badge>
      </div>

      <Reveal className="mt-6 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const displayPrice = annual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice;
          const yearlySavings = plan.monthlyPrice * 12 - plan.annualPrice;

          return (
            <Card
              key={plan.name}
              tone={plan.highlighted ? "dark" : "light"}
              className={plan.highlighted ? "relative border-2 border-brand-blue" : "relative"}
            >
              {plan.highlighted ? (
                <Badge tone="info" className="absolute -top-3 left-6">
                  Más elegido
                </Badge>
              ) : null}

              <Heading level={3} tone={plan.highlighted ? "dark" : "light"}>
                {plan.name}
              </Heading>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-h2">USD {displayPrice}</span>
                <span
                  className={
                    plan.highlighted ? "text-body text-brand-white/60" : "text-body text-brand-ink/60"
                  }
                >
                  /mes
                </span>
              </div>
              {annual ? (
                <>
                  <p
                    className={
                      plan.highlighted
                        ? "mt-1 text-small text-brand-white/60"
                        : "mt-1 text-small text-brand-ink/60"
                    }
                  >
                    Facturado USD {plan.annualPrice}/año
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#deffd1] px-3 py-1.5 text-small font-semibold text-emerald-900 ring-2 ring-emerald-400/70">
                    <PiggyBank aria-hidden="true" className="h-4 w-4 shrink-0" />
                    Ahorras USD {yearlySavings} al año
                  </div>
                </>
              ) : (
                <p
                  className={
                    plan.highlighted
                      ? "mt-1 text-small text-brand-white/60"
                      : "mt-1 text-small text-brand-ink/60"
                  }
                >
                  o USD {plan.annualPrice}/año pagando anual (ahorra 10%)
                </p>
              )}

              <ul className="mt-6 flex flex-col gap-3">
                {plan.limits.map((limit) => (
                  <li key={limit} className="flex items-start gap-2 text-body">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                    <span className={plan.highlighted ? "text-brand-white/90" : "text-brand-ink/90"}>
                      {limit}
                    </span>
                  </li>
                ))}
              </ul>

              <p
                className={
                  plan.highlighted
                    ? "mt-6 text-small font-medium text-brand-white/70"
                    : "mt-6 text-small font-medium text-brand-ink/70"
                }
              >
                Incluye {site.trialDays} días de prueba gratis
              </p>

              <TrackedCtaButton
                event="cta_trial_click"
                href={trialAnchor}
                variant="primary"
                className="mt-4 w-full"
              >
                Probar gratis
              </TrackedCtaButton>
            </Card>
          );
        })}
      </Reveal>
    </div>
  );
}

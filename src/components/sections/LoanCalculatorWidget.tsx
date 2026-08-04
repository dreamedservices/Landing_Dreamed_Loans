"use client";

import { useState } from "react";
import { Calculator, Calendar, Percent } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { trialAnchor } from "@/config/navigation";
import { trackEvent } from "@/lib/analytics/track";
import {
  calculateLoanProjection,
  formatCurrency,
  parseLocaleNumber,
  type LoanPaymentSchedule,
} from "@/lib/loan-calculations";

const scheduleOptions: { value: LoanPaymentSchedule; label: string }[] = [
  { value: "diario", label: "Diario" },
  { value: "semanal", label: "Semanal" },
  { value: "quincenal", label: "Quincenal" },
  { value: "mensual", label: "Mensual" },
];

type CalculatorState =
  | { status: "idle" }
  | { status: "error" }
  | {
      status: "done";
      installmentAmount: number;
      totalInterest: number;
      totalAmount: number;
      frequencyLabel: string;
    };

/**
 * Misma calculadora del dashboard, funcional aquí (no una captura de
 * pantalla): mismos campos, mismo cálculo (`lib/loan-calculations.ts`,
 * portado del sistema real), adaptada a los componentes de esta landing.
 * Sin datos controlados por campo (se lee FormData al enviar, igual que
 * LeadForm) — el único estado en React es el resultado a mostrar.
 */
export function LoanCalculatorWidget() {
  const [state, setState] = useState<CalculatorState>({ status: "idle" });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const capital = parseLocaleNumber(String(data.get("capital") ?? ""));
    const cuotas = parseLocaleNumber(String(data.get("cuotas") ?? ""));
    const interes = parseLocaleNumber(String(data.get("interes") ?? ""));
    const tipoCuota = String(data.get("tipo") ?? "mensual") as LoanPaymentSchedule;

    const projection = calculateLoanProjection(capital, cuotas, interes, tipoCuota);
    if (!projection) {
      setState({ status: "error" });
      return;
    }

    setState({ status: "done", ...projection });
  }

  return (
    <Card tone="light" className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input id="capital" name="capital" label="Capital solicitado" placeholder="5,000.00" required />

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Input
              id="cuotas"
              name="cuotas"
              type="text"
              inputMode="numeric"
              label="Cant. de cuotas"
              placeholder="Ej: 12"
              className="pl-10"
              required
            />
            <Calendar
              aria-hidden="true"
              className="absolute bottom-[11px] left-3 h-5 w-5 text-brand-ink/40"
            />
          </div>
          <div className="relative">
            <Input
              id="interes"
              name="interes"
              type="text"
              inputMode="decimal"
              label="Interés mensual (%)"
              placeholder="Ej: 2.5"
              className="pl-10"
              required
            />
            <Percent
              aria-hidden="true"
              className="absolute bottom-[11px] left-3 h-5 w-5 text-brand-ink/40"
            />
          </div>
        </div>

        <Select
          id="tipo"
          name="tipo"
          label="Tipo de cuota"
          defaultValue="mensual"
          options={scheduleOptions}
          required
        />

        <Button type="submit" variant="primary" size="lg" className="mt-2 w-full">
          Calcular préstamo
        </Button>
      </form>

      <div className="flex flex-col justify-center rounded-2xl border border-line-light bg-surface-soft p-6">
        {state.status === "done" ? (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <p className="text-small text-brand-ink/60">Cuota {state.frequencyLabel.toLowerCase()}</p>
              <p className="mt-1 font-display text-h3 font-semibold text-brand-blue">
                {formatCurrency(state.installmentAmount)}
              </p>
            </div>

            <div className="h-px w-full bg-line-light" />

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-line-light bg-brand-white p-4">
                <p className="text-small text-brand-ink/60">Total intereses</p>
                <p className="mt-1 text-body font-semibold text-red-600">
                  +{formatCurrency(state.totalInterest)}
                </p>
              </div>
              <div className="rounded-xl border border-line-light bg-brand-white p-4">
                <p className="text-small text-brand-ink/60">Total a pagar</p>
                <p className="mt-1 text-body font-semibold text-brand-ink">
                  {formatCurrency(state.totalAmount)}
                </p>
              </div>
            </div>

            <Button
              href={trialAnchor}
              variant="secondary"
              tone="light"
              size="md"
              className="w-full"
              onClick={() => trackEvent("cta_trial_click")}
            >
              Probar gratis
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-6 text-center text-brand-ink/40">
            <Calculator aria-hidden="true" className="h-16 w-16" />
            <p className="text-body text-brand-ink/60">
              {state.status === "error"
                ? "Revisa los datos: deben ser valores positivos."
                : "Ingresa los datos y presiona calcular para ver la proyección."}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

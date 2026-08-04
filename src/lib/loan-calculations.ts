/**
 * Misma fórmula que usa el sistema real (dashboard) para esta calculadora,
 * portada tal cual — no es un aproximado inventado para la landing.
 */
export type LoanPaymentSchedule = "diario" | "semanal" | "quincenal" | "mensual";

export type LoanProjection = {
  installmentAmount: number;
  totalInterest: number;
  totalAmount: number;
  frequencyLabel: string;
};

const PERIODS_PER_MONTH: Record<LoanPaymentSchedule, number> = {
  diario: 30,
  semanal: 52 / 12,
  quincenal: 2,
  mensual: 1,
};

const FREQUENCY_LABELS: Record<LoanPaymentSchedule, string> = {
  diario: "Diaria",
  semanal: "Semanal",
  quincenal: "Quincenal",
  mensual: "Mensual",
};

export function calculateLoanProjection(
  capital: number,
  installments: number,
  monthlyInterestRate: number,
  paymentSchedule: LoanPaymentSchedule,
): LoanProjection | null {
  if (
    !Number.isFinite(capital) ||
    capital <= 0 ||
    !Number.isInteger(installments) ||
    installments <= 0 ||
    !Number.isFinite(monthlyInterestRate) ||
    monthlyInterestRate < 0
  ) {
    return null;
  }

  const monthlyRate = monthlyInterestRate / 100;
  const periodRate = monthlyRate / PERIODS_PER_MONTH[paymentSchedule];
  const totalInterest = capital * periodRate * installments;
  const totalAmount = capital + totalInterest;

  return {
    installmentAmount: totalAmount / installments,
    totalInterest,
    totalAmount,
    frequencyLabel: FREQUENCY_LABELS[paymentSchedule],
  };
}

/**
 * Acepta coma o punto como separador decimal (`<input type="number">`
 * descarta la coma en vez de rechazarla: "2,5" quedaba en "25" — 2.5% de
 * interés se convertía en 25%, un resultado 10x mayor sin ningún error
 * visible. Con ambos presentes, el que aparece más a la derecha es el
 * separador decimal real; el otro se trata como separador de miles.
 */
export function parseLocaleNumber(raw: string): number {
  const trimmed = raw.trim();
  if (!trimmed) return NaN;

  const lastComma = trimmed.lastIndexOf(",");
  const lastDot = trimmed.lastIndexOf(".");

  if (lastComma > -1 && lastDot > -1) {
    const decimalIndex = Math.max(lastComma, lastDot);
    const integerPart = trimmed.slice(0, decimalIndex).replace(/[.,]/g, "");
    const decimalPart = trimmed.slice(decimalIndex + 1).replace(/[^0-9]/g, "");
    return Number(`${integerPart}.${decimalPart}`);
  }

  if (lastComma > -1) {
    const integerPart = trimmed.slice(0, lastComma).replace(/[^0-9]/g, "");
    const decimalPart = trimmed.slice(lastComma + 1).replace(/[^0-9]/g, "");
    return Number(decimalPart ? `${integerPart}.${decimalPart}` : integerPart);
  }

  return Number(trimmed.replace(/[^0-9.]/g, ""));
}

export function formatCurrency(amount: number): string {
  return `RD$ ${amount.toLocaleString("es-DO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

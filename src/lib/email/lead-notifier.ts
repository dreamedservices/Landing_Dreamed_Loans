import type { ValidatedLead } from "@/lib/validation/lead-schema";

export type LeadContext = {
  requestId: string;
  submittedAt: string;
  pageUrl: string;
  userAgentSummary?: string;
};

export type LeadNotifierResult = {
  messageId: string;
};

/**
 * ARQUITECTURA.md §10: el proveedor de correo es intercambiable detrás de
 * esta interfaz. `retryable` distingue un fallo temporal (mostrar "reintenta")
 * de un rechazo definitivo del proveedor.
 *
 * `sendLead` (al negocio) es la ruta crítica: si falla, la API responde
 * error y no redirige (política "fail closed" de Fase 05). `sendClientConfirmation`
 * (al correo del propio lead) es best-effort — su fallo se registra pero
 * nunca bloquea el registro; el negocio ya quedó notificado.
 */
export interface LeadNotifier {
  sendLead(lead: ValidatedLead, context: LeadContext): Promise<LeadNotifierResult>;
  sendClientConfirmation(lead: ValidatedLead, context: LeadContext): Promise<LeadNotifierResult>;
}

export class LeadNotifierError extends Error {
  readonly retryable: boolean;

  constructor(message: string, retryable: boolean) {
    super(message);
    this.name = "LeadNotifierError";
    this.retryable = retryable;
  }
}

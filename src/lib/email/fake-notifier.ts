import "server-only";
import type { ValidatedLead } from "@/lib/validation/lead-schema";
import type { LeadContext, LeadNotifier, LeadNotifierResult } from "./lead-notifier";
import { LeadNotifierError } from "./lead-notifier";

/**
 * Solo para tests automatizados (activado por LEADS_TEST_MODE=true, que solo
 * se define en playwright.config.ts — nunca en producción ni en .env.local).
 * El comportamiento se controla con marcadores en `businessName` para poder
 * probar éxito, rechazo y timeout de forma determinista sin credenciales
 * reales ni enviar correo de verdad.
 */
export const testMarkers = {
  FAIL: "__TEST_FAIL__",
  TIMEOUT: "__TEST_TIMEOUT__",
  REJECT: "__TEST_REJECT__",
} as const;

export class FakeLeadNotifier implements LeadNotifier {
  async sendLead(lead: ValidatedLead, context: LeadContext): Promise<LeadNotifierResult> {
    if (lead.businessName.includes(testMarkers.TIMEOUT)) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new LeadNotifierError("Tiempo de espera agotado (simulado).", true);
    }

    if (lead.businessName.includes(testMarkers.REJECT)) {
      throw new LeadNotifierError("El proveedor rechazó el mensaje (simulado).", false);
    }

    if (lead.businessName.includes(testMarkers.FAIL)) {
      throw new LeadNotifierError("Fallo simulado del proveedor.", true);
    }

    return { messageId: `fake-${context.requestId}` };
  }

  async sendClientConfirmation(lead: ValidatedLead, context: LeadContext): Promise<LeadNotifierResult> {
    // Mismos marcadores que sendLead, para poder probar el camino
    // "negocio notificado, confirmación al cliente falla" de forma determinista.
    if (lead.businessName.includes(testMarkers.TIMEOUT)) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new LeadNotifierError("Tiempo de espera agotado (simulado).", true);
    }

    if (lead.businessName.includes(testMarkers.REJECT)) {
      throw new LeadNotifierError("El proveedor rechazó el mensaje (simulado).", false);
    }

    if (lead.businessName.includes(testMarkers.FAIL)) {
      throw new LeadNotifierError("Fallo simulado del proveedor.", true);
    }

    return { messageId: `fake-confirmation-${context.requestId}` };
  }
}

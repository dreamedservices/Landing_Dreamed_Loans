"use client";

import type { ValidatedLead } from "@/lib/validation/lead-schema";
import { publicEnv } from "@/lib/env";

export type LeadContext = {
  requestId: string;
  submittedAt: string;
  pageUrl: string;
};

export class LeadEmailError extends Error {}

/**
 * Envía el lead al servicio serverless propio (mailer/, desplegado aparte
 * en Cloudflare Workers), que manda los dos correos por el SMTP real del negocio. Es
 * la ruta crítica: si falla, no se debe redirigir al registro.
 */
export async function sendLead(
  lead: ValidatedLead,
  context: LeadContext,
  antiBot: { website: string; startedAt: number },
) {
  let response: Response;
  try {
    response = await fetch(publicEnv.NEXT_PUBLIC_LEAD_MAILER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, ...context, ...antiBot }),
    });
  } catch (error) {
    throw new LeadEmailError(error instanceof Error ? error.message : "No se pudo contactar al servidor");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new LeadEmailError(body?.message ?? `El servidor respondió ${response.status}`);
  }
}

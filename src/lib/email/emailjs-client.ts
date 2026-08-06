"use client";

import emailjs from "@emailjs/browser";
import type { ValidatedLead } from "@/lib/validation/lead-schema";
import { site } from "@/config/site";
import { publicEnv } from "@/lib/env";

export type LeadContext = {
  requestId: string;
  submittedAt: string;
  pageUrl: string;
};

/**
 * Sin servidor (export estático): el envío ocurre en el navegador vía
 * EmailJS, usando la cuenta de Gmail conectada en el dashboard de EmailJS.
 * Las plantillas ("Owner"/"Client") viven en emailjs.com, no aquí — este
 * módulo solo arma los parámetros que cada plantilla espera.
 */

function utmSummary(lead: ValidatedLead): string {
  if (!lead.utm) return "";
  return Object.entries(lead.utm)
    .filter(([, value]) => value)
    .map(([key, value]) => `utm_${key}: ${value}`)
    .join(", ");
}

function ownerParams(lead: ValidatedLead, context: LeadContext) {
  return {
    request_id: context.requestId,
    submitted_at: context.submittedAt,
    page_url: context.pageUrl,
    to_email: publicEnv.NEXT_PUBLIC_LEADS_NOTIFICATION_EMAIL,
    reply_to: lead.email,
    full_name: lead.fullName,
    business_name: lead.businessName,
    email: lead.email,
    phone: lead.phone,
    country: lead.country,
    team_size: lead.teamSize || "—",
    portfolio_range: lead.portfolioRange || "—",
    message: lead.message || "—",
    marketing_consent: lead.marketingConsent ? "Sí" : "No",
    utm_summary: utmSummary(lead) || "—",
  };
}

function clientParams(lead: ValidatedLead, context: LeadContext) {
  return {
    request_id: context.requestId,
    to_email: lead.email,
    reply_to: publicEnv.NEXT_PUBLIC_LEADS_NOTIFICATION_EMAIL,
    full_name: lead.fullName,
    business_name: lead.businessName,
    trial_days: site.trialDays,
    contact_email: publicEnv.NEXT_PUBLIC_LEADS_NOTIFICATION_EMAIL,
  };
}

export class LeadEmailError extends Error {}

/**
 * Al negocio: ruta crítica. Si falla, no se redirige al registro (mismo
 * criterio "fail closed" que tenía la API route con SMTP).
 */
export async function sendLeadToOwner(lead: ValidatedLead, context: LeadContext) {
  try {
    await emailjs.send(
      publicEnv.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      publicEnv.NEXT_PUBLIC_EMAILJS_TEMPLATE_OWNER_ID,
      ownerParams(lead, context),
      { publicKey: publicEnv.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY },
    );
  } catch (error) {
    throw new LeadEmailError(error instanceof Error ? error.message : "Error desconocido");
  }
}

/**
 * Al cliente: best-effort. Su fallo se ignora — el negocio ya fue
 * notificado por sendLeadToOwner(), que es la parte que importa.
 */
export async function sendLeadClientConfirmation(lead: ValidatedLead, context: LeadContext) {
  try {
    await emailjs.send(
      publicEnv.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      publicEnv.NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT_ID,
      clientParams(lead, context),
      { publicKey: publicEnv.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY },
    );
  } catch (error) {
    console.error("[emailjs] confirmación al cliente falló (no bloquea):", error);
  }
}

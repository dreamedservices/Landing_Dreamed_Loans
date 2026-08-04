import "server-only";
import type { ValidatedLead } from "@/lib/validation/lead-schema";
import type { LeadContext } from "./lead-notifier";
import { site } from "@/config/site";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const fieldLabels: Record<string, string> = {
  fullName: "Nombre y apellido",
  businessName: "Empresa o financiera",
  email: "Correo",
  phone: "Teléfono/WhatsApp",
  country: "País",
  teamSize: "Tamaño del equipo",
  portfolioRange: "Rango de cartera",
  message: "Mensaje",
  marketingConsent: "Comunicaciones comerciales",
};

function leadRows(lead: ValidatedLead): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    [fieldLabels.fullName, lead.fullName],
    [fieldLabels.businessName, lead.businessName],
    [fieldLabels.email, lead.email],
    [fieldLabels.phone, lead.phone],
    [fieldLabels.country, lead.country],
  ];

  if (lead.teamSize) rows.push([fieldLabels.teamSize, lead.teamSize]);
  if (lead.portfolioRange) rows.push([fieldLabels.portfolioRange, lead.portfolioRange]);
  if (lead.message) rows.push([fieldLabels.message, lead.message]);
  rows.push([fieldLabels.marketingConsent, lead.marketingConsent ? "Sí" : "No"]);

  return rows;
}

export function buildSubject(lead: ValidatedLead): string {
  return `[Dream Préstamos] Nueva solicitud de prueba — ${lead.businessName}`;
}

export function buildTextBody(lead: ValidatedLead, context: LeadContext): string {
  const rows = leadRows(lead).map(([label, value]) => `${label}: ${value}`);
  const utm = lead.utm
    ? Object.entries(lead.utm)
        .filter(([, value]) => value)
        .map(([key, value]) => `utm_${key}: ${value}`)
        .join("\n")
    : "";

  return [
    "Nueva solicitud de prueba gratis — Dream Préstamos",
    "",
    ...rows,
    "",
    `Solicitud: ${context.requestId}`,
    `Fecha: ${context.submittedAt}`,
    `Página de origen: ${context.pageUrl}`,
    context.userAgentSummary ? `Navegador: ${context.userAgentSummary}` : "",
    utm,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildHtmlBody(lead: ValidatedLead, context: LeadContext): string {
  const rows = leadRows(lead)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#5b6572;">${escapeHtml(label)}</td><td style="padding:4px 0;color:#091A2A;font-weight:600;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const utmRows = lead.utm
    ? Object.entries(lead.utm)
        .filter(([, value]) => value)
        .map(
          ([key, value]) =>
            `<tr><td style="padding:2px 12px 2px 0;color:#8a94a3;">utm_${escapeHtml(key)}</td><td style="padding:2px 0;color:#8a94a3;">${escapeHtml(String(value))}</td></tr>`,
        )
        .join("")
    : "";

  return `<!doctype html>
<html lang="es">
  <body style="font-family:Arial,Helvetica,sans-serif;background:#F4F8FC;padding:24px;">
    <table role="presentation" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;">
      <tr><td>
        <h1 style="font-size:18px;color:#091A2A;margin:0 0 16px;">Nueva solicitud de prueba gratis</h1>
        <table role="presentation" style="width:100%;font-size:14px;">${rows}</table>
        <p style="margin:20px 0 4px;font-size:12px;color:#8a94a3;">Solicitud ${escapeHtml(context.requestId)} · ${escapeHtml(context.submittedAt)}</p>
        <p style="margin:0 0 4px;font-size:12px;color:#8a94a3;">Origen: ${escapeHtml(context.pageUrl)}</p>
        ${utmRows ? `<table role="presentation" style="width:100%;font-size:12px;margin-top:8px;">${utmRows}</table>` : ""}
      </td></tr>
    </table>
  </body>
</html>`;
}

/**
 * Confirmación al cliente (no al negocio): sin cifras ni promesas fuera de
 * lo aprobado en Fase 00 — solo confirma la recepción y los próximos pasos
 * ya conocidos (prueba de `site.trialDays` días, contacto de soporte).
 */
export function buildClientSubject(): string {
  return "Recibimos tu solicitud — Dream Préstamos";
}

export function buildClientTextBody(
  lead: ValidatedLead,
  context: LeadContext,
  contactEmail: string,
): string {
  return [
    `Hola ${lead.fullName},`,
    "",
    `Recibimos tu solicitud de prueba gratis de ${site.trialDays} días para ${lead.businessName}.`,
    "Nuestro equipo se pondrá en contacto contigo en breve.",
    "",
    `¿Tienes preguntas mientras tanto? Escríbenos a ${contactEmail}.`,
    "",
    `Solicitud: ${context.requestId}`,
  ].join("\n");
}

export function buildClientHtmlBody(
  lead: ValidatedLead,
  context: LeadContext,
  contactEmail: string,
): string {
  return `<!doctype html>
<html lang="es">
  <body style="font-family:Arial,Helvetica,sans-serif;background:#F4F8FC;padding:24px;">
    <table role="presentation" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;">
      <tr><td>
        <h1 style="font-size:18px;color:#091A2A;margin:0 0 16px;">¡Recibimos tu solicitud, ${escapeHtml(lead.fullName)}!</h1>
        <p style="font-size:14px;color:#091A2A;line-height:1.6;margin:0 0 12px;">
          Recibimos tu solicitud de prueba gratis de ${site.trialDays} días para
          <strong>${escapeHtml(lead.businessName)}</strong>. Nuestro equipo se pondrá en
          contacto contigo en breve.
        </p>
        <p style="font-size:14px;color:#091A2A;line-height:1.6;margin:0 0 20px;">
          ¿Tienes preguntas mientras tanto? Escríbenos a
          <a href="mailto:${escapeHtml(contactEmail)}" style="color:#4F96F0;">${escapeHtml(contactEmail)}</a>.
        </p>
        <p style="margin:0;font-size:12px;color:#8a94a3;">Solicitud ${escapeHtml(context.requestId)}</p>
      </td></tr>
    </table>
  </body>
</html>`;
}

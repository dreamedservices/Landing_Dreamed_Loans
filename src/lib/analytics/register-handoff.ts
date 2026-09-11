import type { CampaignAttribution } from "@/lib/analytics/attribution";
import { publicEnv } from "@/lib/env";

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

type RegisterHandoffLead = {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  country: string;
  teamSize: string;
  portfolioRange: string;
  rnc?: string;
  activeLoans: string;
};

/**
 * Pasa los datos ya capturados en el lead al registro del sistema (dominio
 * aparte, app.dreamprestamos.com) vía query params, para que el usuario no
 * tenga que reescribirlos. Nunca incluye contraseña: el sistema sigue
 * pidiéndola directamente al usuario. `fbp`/`fbclid` viajan para que el
 * sistema pueda correlacionar su propio CompleteRegistration con este lead.
 */
export function buildRegisterRedirectUrl(
  lead: RegisterHandoffLead,
  attribution: CampaignAttribution,
  leadId: string,
): string {
  const url = new URL(publicEnv.NEXT_PUBLIC_SYSTEM_REGISTER_URL);

  const params: Record<string, string | undefined> = {
    first_name: lead.firstName || undefined,
    last_name: lead.lastName || undefined,
    email: lead.email,
    phone: lead.phone,
    country: lead.country,
    company: lead.businessName,
    team_size: lead.teamSize || undefined,
    portfolio_range: lead.portfolioRange || undefined,
    company_tax_id: lead.rnc || undefined,
    active_loans: lead.activeLoans || undefined,
    lead_id: leadId,
    utm_source: attribution.utm?.source,
    utm_medium: attribution.utm?.medium,
    utm_campaign: attribution.utm?.campaign,
    utm_content: attribution.utm?.content,
    utm_term: attribution.utm?.term,
    fbclid: attribution.fbclid,
    fbp: readCookie("_fbp"),
  };

  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  return url.toString();
}

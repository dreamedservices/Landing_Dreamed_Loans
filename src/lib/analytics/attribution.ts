export const UTM_KEYS = ["source", "medium", "campaign", "content", "term"] as const;

export type UtmData = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export type CampaignAttribution = {
  utm?: UtmData;
  fbclid?: string;
};

const SESSION_KEY = "dream-campaign-attribution-v1";

function clean(value: string | null, maxLength: number): string | undefined {
  if (!value) return undefined;
  const normalized = value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  return normalized ? normalized.slice(0, maxLength) : undefined;
}

/** Conserva la atribución de la primera página durante la pestaña actual. */
export function readCampaignAttribution(): CampaignAttribution {
  if (typeof window === "undefined") return {};

  let stored: CampaignAttribution = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "{}") as CampaignAttribution;
  } catch {
    stored = {};
  }

  const params = new URLSearchParams(window.location.search);
  const currentUtm: UtmData = {};
  for (const key of UTM_KEYS) {
    const value = clean(params.get(`utm_${key}`), 100);
    if (value) currentUtm[key] = value;
  }

  const attribution: CampaignAttribution = {
    utm: Object.keys(currentUtm).length > 0 ? currentUtm : stored.utm,
    fbclid: clean(params.get("fbclid"), 500) ?? stored.fbclid,
  };

  if (attribution.utm || attribution.fbclid) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(attribution));
    } catch {
      // La atribución es opcional; storage bloqueado no rompe el formulario.
    }
  }

  return attribution;
}

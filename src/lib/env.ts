import { z } from "zod";

/**
 * Solo variables públicas y de URL base. Los secretos de correo (Gmail API)
 * se añaden en Fase 05, no aquí.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_SYSTEM_LOGIN_URL: z.url().optional(),
  // Opcional a propósito: sin ID, GoogleAnalytics.tsx simplemente no monta
  // nada (mismo criterio de degradación que el póster 2D sin WebGL).
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z
    .string()
    .regex(/^G-[A-Z0-9]+$/, "Debe tener el formato G-XXXXXXXXXX")
    .optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z
    .string()
    .regex(/^\d{5,20}$/, "Debe ser un ID numérico de Meta")
    .optional(),
  NEXT_PUBLIC_SYSTEM_REGISTER_URL: z.url(),
  // Export estático (sin servidor propio): el envío de correos vive en un
  // servicio serverless aparte (ver mailer/), desplegado como Cloudflare
  // Worker con SMTP real. Esta URL apunta a ese Worker (ej.
  // https://dream-prestamos-lead-mailer.<subdominio>.workers.dev, o un dominio propio).
  NEXT_PUBLIC_LEAD_MAILER_URL: z.url(),
});

function parsePublicEnv() {
  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SYSTEM_LOGIN_URL: process.env.NEXT_PUBLIC_SYSTEM_LOGIN_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || undefined,
    NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID || undefined,
    NEXT_PUBLIC_SYSTEM_REGISTER_URL: process.env.NEXT_PUBLIC_SYSTEM_REGISTER_URL,
    NEXT_PUBLIC_LEAD_MAILER_URL: process.env.NEXT_PUBLIC_LEAD_MAILER_URL,
  });

  if (!result.success) {
    const missing = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Variables de entorno públicas inválidas: ${missing}`);
  }

  return result.data;
}

export const publicEnv = parsePublicEnv();

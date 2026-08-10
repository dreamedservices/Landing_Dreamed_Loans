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
  // Export estático (sin servidor): el flujo de leads envía correos desde el
  // navegador vía EmailJS en vez de una API route con SMTP.
  NEXT_PUBLIC_SYSTEM_REGISTER_URL: z.url(),
  NEXT_PUBLIC_LEADS_NOTIFICATION_EMAIL: z.email(),
  NEXT_PUBLIC_EMAILJS_SERVICE_ID: z.string().min(1),
  NEXT_PUBLIC_EMAILJS_TEMPLATE_OWNER_ID: z.string().min(1),
  NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: z.string().min(1),
});

function parsePublicEnv() {
  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SYSTEM_LOGIN_URL: process.env.NEXT_PUBLIC_SYSTEM_LOGIN_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || undefined,
    NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID || undefined,
    NEXT_PUBLIC_SYSTEM_REGISTER_URL: process.env.NEXT_PUBLIC_SYSTEM_REGISTER_URL,
    NEXT_PUBLIC_LEADS_NOTIFICATION_EMAIL: process.env.NEXT_PUBLIC_LEADS_NOTIFICATION_EMAIL,
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    NEXT_PUBLIC_EMAILJS_TEMPLATE_OWNER_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_OWNER_ID,
    NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT_ID,
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  });

  if (!result.success) {
    const missing = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Variables de entorno públicas inválidas: ${missing}`);
  }

  return result.data;
}

export const publicEnv = parsePublicEnv();

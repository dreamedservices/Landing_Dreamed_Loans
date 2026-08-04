import "server-only";
import { z } from "zod";

/**
 * Variables solo-servidor del flujo de leads, separadas en dos grupos a
 * propósito:
 * - `getLeadsEnv()`: lo que el endpoint necesita siempre (registro, rate
 *   limit, destinatario). Si falta, todo el flujo de leads falla.
 * - `getSmtpEnv()`: credenciales SMTP, validadas solo cuando se construye
 *   el adaptador real. Así, si faltan, el resto del endpoint sigue
 *   funcionando y falla "en cerrado" justo en el envío — no antes.
 *
 * Se cambió de Gmail API/OAuth a SMTP (2026-07-30): el flujo de OAuth
 * requiere que una persona complete el consentimiento en un navegador, y no
 * se pudo completar; el propietario del producto prefirió usar directamente
 * las credenciales SMTP del dominio propio (dreamedservices.com).
 */

const leadsEnvSchema = z.object({
  SYSTEM_REGISTER_URL: z.url(),
  LEADS_NOTIFICATION_EMAIL: z.email(),
  LEAD_RATE_LIMIT_SECRET: z.string().min(16),
});

const smtpEnvSchema = z.object({
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USERNAME: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
  // "true"/"false" como texto: así llega desde .env. z.coerce.boolean() trataría
  // cualquier string no vacío (incluido "false") como true.
  SMTP_AUTH: z
    .string()
    .optional()
    .transform((value) => value !== "false"),
  SMTP_DEBUG: z
    .string()
    .optional()
    .transform((value) => value === "1" || value === "true"),
});

export type LeadsEnv = z.infer<typeof leadsEnvSchema>;
export type SmtpEnv = z.infer<typeof smtpEnvSchema>;

/** Host permitido para la redirección de registro (ARQUITECTURA.md §11). */
const ALLOWED_REGISTER_HOSTS = ["dreamprestamos.com"];

let leadsEnvCache: LeadsEnv | null = null;

export function getLeadsEnv(): LeadsEnv {
  if (leadsEnvCache) return leadsEnvCache;

  const result = leadsEnvSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Configuración del servidor inválida: ${missing}`);
  }

  const registerUrl = new URL(result.data.SYSTEM_REGISTER_URL);
  if (registerUrl.protocol !== "https:") {
    throw new Error("SYSTEM_REGISTER_URL debe usar https en producción.");
  }
  if (!ALLOWED_REGISTER_HOSTS.includes(registerUrl.hostname)) {
    throw new Error(
      `SYSTEM_REGISTER_URL usa un host no permitido: ${registerUrl.hostname}. Hosts permitidos: ${ALLOWED_REGISTER_HOSTS.join(", ")}.`,
    );
  }

  leadsEnvCache = result.data;
  return leadsEnvCache;
}

let smtpEnvCache: SmtpEnv | null = null;

export function getSmtpEnv(): SmtpEnv {
  if (smtpEnvCache) return smtpEnvCache;

  const result = smtpEnvSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Credenciales SMTP inválidas o ausentes: ${missing}`);
  }

  smtpEnvCache = result.data;
  return smtpEnvCache;
}

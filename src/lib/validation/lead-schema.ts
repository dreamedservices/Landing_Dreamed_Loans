import { z } from "zod";

/**
 * Contrato de STACK-TECNOLOGICO.md §7 / FASE-05, con los campos aprobados en
 * Fase 00 (ARQUITECTURA.md §9, "usar la propuesta completa"): nombre,
 * empresa, correo y teléfono obligatorios; país obligatorio; equipo, cartera
 * y mensaje opcionales. `website` es el honeypot; `startedAt` sostiene el
 * chequeo de tiempo mínimo de llenado. Ninguno de los dos es visible al usuario.
 */

const utmToken = z
  .string()
  .trim()
  .max(100)
  .regex(/^[^\u0000-\u001F\u007F]*$/, "UTM inválido")
  .optional();

export const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Nombre demasiado corto").max(120),
  businessName: z.string().trim().min(2, "Empresa demasiado corta").max(120),
  email: z.email("Correo inválido").trim().toLowerCase().max(254),
  phone: z
    .string()
    .trim()
    .min(6, "Teléfono inválido")
    .max(30)
    .refine((value) => value.replace(/\D/g, "").length >= 6, "Teléfono inválido"),
  country: z.string().trim().min(2, "País inválido").max(80),
  teamSize: z.string().trim().max(40).optional().or(z.literal("")),
  portfolioRange: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  processingConsent: z.literal(true, { message: "Consentimiento requerido" }),
  marketingConsent: z.boolean(),
  utm: z
    .object({
      source: utmToken,
      medium: utmToken,
      campaign: utmToken,
      content: utmToken,
      term: utmToken,
    })
    .optional(),
  /** Honeypot: debe llegar vacío. Un bot que autocompleta todo lo llenará. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** Marca de tiempo (ms epoch) de cuando el formulario se volvió interactivo. */
  startedAt: z.number().int().positive(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type ValidatedLead = Omit<LeadInput, "website" | "startedAt">;

export const MIN_FILL_TIME_MS = 1500;
export const MAX_BODY_BYTES = 10_000;

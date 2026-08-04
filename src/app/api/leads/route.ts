import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { leadSchema, MAX_BODY_BYTES, MIN_FILL_TIME_MS, type ValidatedLead } from "@/lib/validation/lead-schema";
import { checkRateLimit, hashRateLimitKey } from "@/lib/rate-limit";
import { getLeadsEnv } from "@/lib/env.server";
import { getLeadNotifier } from "@/lib/email/get-notifier";
import { LeadNotifierError } from "@/lib/email/lead-notifier";

// nodemailer requiere APIs de Node.js completas (sockets TLS), no Edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ErrorCode = "VALIDATION" | "RATE_LIMITED" | "EMAIL_FAILED" | "SERVER_ERROR";

function errorResponse(code: ErrorCode, message: string, status: number) {
  return NextResponse.json(
    { ok: false, code, message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function summarizeUserAgent(userAgent: string | null): string | undefined {
  if (!userAgent) return undefined;
  return userAgent.slice(0, 120);
}

export async function POST(request: NextRequest) {
  let leadsEnv;
  try {
    leadsEnv = getLeadsEnv();
  } catch (error) {
    console.error("[api/leads] configuración inválida:", error instanceof Error ? error.message : error);
    return errorResponse("SERVER_ERROR", "El servidor no está configurado correctamente.", 500);
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return errorResponse("VALIDATION", "Revisa los campos indicados.", 400);
  }

  let rawBody: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return errorResponse("VALIDATION", "Revisa los campos indicados.", 400);
    }
    rawBody = JSON.parse(text);
  } catch {
    return errorResponse("VALIDATION", "Revisa los campos indicados.", 400);
  }

  const parsed = leadSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse("VALIDATION", "Revisa los campos indicados.", 400);
  }

  const input = parsed.data;

  // Honeypot: un campo que un humano nunca llena.
  if (input.website) {
    return errorResponse("VALIDATION", "Revisa los campos indicados.", 400);
  }

  // Tiempo mínimo de envío: descarta bots que completan y envían al instante.
  if (Date.now() - input.startedAt < MIN_FILL_TIME_MS) {
    return errorResponse("VALIDATION", "Revisa los campos indicados.", 400);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateLimitKey = hashRateLimitKey(ip, leadsEnv.LEAD_RATE_LIMIT_SECRET);
  const rateLimit = checkRateLimit(rateLimitKey);
  if (!rateLimit.allowed) {
    return errorResponse(
      "RATE_LIMITED",
      "Recibimos varios intentos. Espera unos minutos antes de volver a enviar.",
      429,
    );
  }

  const lead: ValidatedLead = {
    fullName: input.fullName,
    businessName: input.businessName,
    email: input.email,
    phone: input.phone,
    country: input.country,
    teamSize: input.teamSize,
    portfolioRange: input.portfolioRange,
    message: input.message,
    processingConsent: input.processingConsent,
    marketingConsent: input.marketingConsent,
    utm: input.utm,
  };

  const requestId = randomUUID();
  const context = {
    requestId,
    submittedAt: new Date().toISOString(),
    pageUrl: request.headers.get("referer") ?? leadsEnv.SYSTEM_REGISTER_URL,
    userAgentSummary: summarizeUserAgent(request.headers.get("user-agent")),
  };

  // Header exclusivo de test (solo tiene efecto si LEADS_TEST_MODE=true):
  // permite probar el camino real de "credenciales ausentes" sin enviar
  // correo de verdad. Ver get-notifier.ts.
  const forceReal = request.headers.get("x-lead-test-force-real") === "true";
  let notifier;

  try {
    // getLeadNotifier() puede lanzar si faltan credenciales SMTP
    // (getSmtpEnv()) — mismo try/catch que el envío para no dejarlo sin manejar.
    notifier = getLeadNotifier(forceReal);
    // Al negocio: ruta crítica, "fail closed" — si falla, no se redirige.
    await notifier.sendLead(lead, context);
  } catch (error) {
    if (error instanceof LeadNotifierError) {
      console.error(`[api/leads] ${requestId} envío falló (retryable=${error.retryable}):`, error.message);
      return errorResponse(
        "EMAIL_FAILED",
        "No pudimos enviar tu solicitud. Tus datos siguen aquí; inténtalo nuevamente.",
        error.retryable ? 503 : 502,
      );
    }

    console.error(`[api/leads] ${requestId} error inesperado:`, error instanceof Error ? error.message : error);
    return errorResponse("SERVER_ERROR", "Ocurrió un error inesperado.", 500);
  }

  try {
    // Al cliente: best-effort, no bloquea el registro — el negocio ya fue
    // notificado con el paso anterior, que es el que importa para el flujo.
    await notifier.sendClientConfirmation(lead, context);
  } catch (error) {
    console.error(
      `[api/leads] ${requestId} confirmación al cliente falló (no bloquea):`,
      error instanceof Error ? error.message : error,
    );
  }

  return NextResponse.json(
    { ok: true, requestId, redirectUrl: leadsEnv.SYSTEM_REGISTER_URL },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}

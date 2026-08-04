import "server-only";
import { createHash } from "node:crypto";

/**
 * Limitador en memoria (MVP, aprobado en Fase 05): válido para una sola
 * instancia del servidor. Si el sitio se despliega en múltiples instancias o
 * regiones, cada una tiene su propio contador — revisar antes de escalar
 * horizontalmente (ARQUITECTURA.md §14 permite "en memoria" o "proveedor de
 * borde"; se eligió en memoria para este MVP).
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

/** Clave no reversible: nunca se guarda la IP en claro (ARQUITECTURA.md §14). */
export function hashRateLimitKey(ip: string, secret: string): string {
  return createHash("sha256").update(`${ip}:${secret}`).digest("hex");
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
};

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const existing = (hits.get(key) ?? []).filter((timestamp) => timestamp > windowStart);

  if (existing.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, existing);
    return { allowed: false, remaining: 0 };
  }

  existing.push(now);
  hits.set(key, existing);

  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - existing.length };
}

"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics/track";

/** FRONTEND.md §3. */
type LeadSubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; redirectUrl: string }
  | { status: "error"; message: string };

type LeadResponse =
  | { ok: true; redirectUrl: string; requestId: string }
  | { ok: false; code: "VALIDATION" | "RATE_LIMITED" | "EMAIL_FAILED" | "SERVER_ERROR"; message: string };

const UTM_KEYS = ["source", "medium", "campaign"] as const;

function readUtm(): Record<string, string> | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(`utm_${key}`);
    if (value) utm[key] = value.slice(0, 100);
  }
  return Object.keys(utm).length > 0 ? utm : undefined;
}

/**
 * Conectado a POST /api/leads (Fase 05). Sin datos controlados por campo:
 * se lee FormData en el submit, así el contenido se conserva tal cual si el
 * envío falla (COMPONENTE-BOTONES-FORMULARIOS.md §4 "no limpiar tras un fallo").
 */
export function LeadForm() {
  const [state, setState] = useState<LeadSubmissionState>({ status: "idle" });
  const [startedAt] = useState(() => Date.now());
  const hasStartedRef = useRef(false);

  const isSubmitting = state.status === "submitting";

  function handleFormFocus() {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    trackEvent("lead_form_start");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      fullName: String(data.get("nombre") ?? ""),
      businessName: String(data.get("empresa") ?? ""),
      email: String(data.get("correo") ?? ""),
      phone: String(data.get("telefono") ?? ""),
      country: String(data.get("pais") ?? ""),
      teamSize: String(data.get("tamano_equipo") ?? ""),
      portfolioRange: String(data.get("rango_cartera") ?? ""),
      message: String(data.get("mensaje") ?? ""),
      processingConsent: data.get("consentimiento") === "on",
      marketingConsent: data.get("consentimiento_comercial") === "on",
      utm: readUtm(),
      website: String(data.get("website") ?? ""),
      startedAt,
    };

    setState({ status: "submitting" });
    trackEvent("lead_form_submit");

    let response: Response;
    try {
      response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      trackEvent("lead_form_error");
      setState({
        status: "error",
        message: "No pudimos enviar tu solicitud. Tus datos siguen aquí; inténtalo nuevamente.",
      });
      return;
    }

    let result: LeadResponse;
    try {
      result = await response.json();
    } catch {
      trackEvent("lead_form_error");
      setState({ status: "error", message: "Ocurrió un error inesperado. Inténtalo nuevamente." });
      return;
    }

    if (!result.ok) {
      trackEvent("lead_form_error");
      setState({ status: "error", message: result.message });
      return;
    }

    trackEvent("lead_email_confirmed");
    setState({ status: "success", redirectUrl: result.redirectUrl });
    trackEvent("registration_redirect");
    // Redirección solo tras confirmación del servidor (no en finally).
    window.location.href = result.redirectUrl;
  }

  return (
    <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit} onFocus={handleFormFocus}>
      {/* Honeypot: invisible para personas, atractivo para bots que autocompletan todo. */}
      <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">No completar este campo</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Input
        id="nombre"
        name="nombre"
        label="Nombre y apellido"
        autoComplete="name"
        required
        disabled={isSubmitting}
      />
      <Input
        id="empresa"
        name="empresa"
        label="Empresa o financiera"
        autoComplete="organization"
        required
        disabled={isSubmitting}
      />
      <Input
        id="correo"
        name="correo"
        type="email"
        label="Correo"
        autoComplete="email"
        required
        disabled={isSubmitting}
      />
      <Input
        id="telefono"
        name="telefono"
        type="tel"
        label="Teléfono/WhatsApp"
        autoComplete="tel"
        required
        disabled={isSubmitting}
      />

      <Select
        id="pais"
        name="pais"
        label="País"
        placeholder="Selecciona un país"
        options={[
          { value: "República Dominicana", label: "República Dominicana" },
          { value: "México", label: "México" },
          { value: "Colombia", label: "Colombia" },
          { value: "Otro", label: "Otro" },
        ]}
        required
        disabled={isSubmitting}
      />
      <Select
        id="equipo"
        name="tamano_equipo"
        label="Tamaño del equipo"
        placeholder="Selecciona un rango"
        options={[
          { value: "1-5 personas", label: "1 a 5 personas" },
          { value: "6-15 personas", label: "6 a 15 personas" },
          { value: "16-50 personas", label: "16 a 50 personas" },
          { value: "Más de 50 personas", label: "Más de 50 personas" },
        ]}
        disabled={isSubmitting}
      />

      <div className="sm:col-span-2">
        <Select
          id="cartera"
          name="rango_cartera"
          label="Rango de cartera"
          placeholder="Selecciona un rango"
          options={[
            { value: "Menos de RD$ 1M", label: "Menos de RD$ 1M" },
            { value: "RD$ 1M a RD$ 5M", label: "RD$ 1M a RD$ 5M" },
            { value: "Más de RD$ 5M", label: "Más de RD$ 5M" },
          ]}
          disabled={isSubmitting}
        />
      </div>

      <div className="sm:col-span-2">
        <Textarea
          id="mensaje"
          name="mensaje"
          label="Mensaje"
          hint="Opcional."
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2">
        <Checkbox
          id="consentimiento"
          name="consentimiento"
          required
          disabled={isSubmitting}
          label={
            <>
              Autorizo el uso de mis datos para gestionar esta solicitud y
              contactarme sobre Dream Préstamos. Ver{" "}
              <Link href="/privacidad" className="underline">
                Política de Privacidad
              </Link>
              .
            </>
          }
        />
        <Checkbox
          id="consentimiento_comercial"
          name="consentimiento_comercial"
          disabled={isSubmitting}
          label="Quiero recibir novedades y comunicaciones comerciales de Dream Préstamos."
        />
      </div>

      <div className="flex flex-col gap-3 sm:col-span-2">
        <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto" isLoading={isSubmitting}>
          {isSubmitting ? "Enviando solicitud…" : "Probar gratis"}
        </Button>

        <p aria-live="polite" className="text-small text-brand-ink/70 empty:hidden">
          {state.status === "error" ? state.message : null}
          {state.status === "success" ? "Solicitud enviada. Te llevamos al registro…" : null}
        </p>
      </div>
    </form>
  );
}

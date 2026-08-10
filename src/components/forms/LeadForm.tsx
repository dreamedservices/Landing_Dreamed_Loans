"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics/track";
import { leadSchema, MIN_FILL_TIME_MS } from "@/lib/validation/lead-schema";
import { sendLeadToOwner, sendLeadClientConfirmation, LeadEmailError } from "@/lib/email/emailjs-client";
import { publicEnv } from "@/lib/env";
import { readCampaignAttribution } from "@/lib/analytics/attribution";
import { trackMetaLeadConversion } from "@/lib/analytics/meta-client";

/** FRONTEND.md §3. */
type LeadSubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; redirectUrl: string }
  | { status: "error"; message: string };

/**
 * Envía vía EmailJS desde el navegador (sin servidor, export estático). Sin datos controlados por campo:
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
    const attribution = readCampaignAttribution();
    const firstName = String(data.get("nombre") ?? "").trim();
    const lastName = String(data.get("apellido") ?? "").trim();

    const payload = {
      fullName: `${firstName} ${lastName}`.trim(),
      businessName: String(data.get("empresa") ?? ""),
      email: String(data.get("correo") ?? ""),
      phone: String(data.get("telefono") ?? ""),
      country: String(data.get("pais") ?? ""),
      teamSize: String(data.get("tamano_equipo") ?? ""),
      portfolioRange: String(data.get("rango_cartera") ?? ""),
      message: String(data.get("mensaje") ?? ""),
      processingConsent: data.get("consentimiento") === "on",
      marketingConsent: data.get("consentimiento_comercial") === "on",
      utm: attribution.utm,
      website: String(data.get("website") ?? ""),
      startedAt,
    };

    // Honeypot: un campo que un humano nunca llena.
    if (payload.website) {
      setState({ status: "error", message: "Revisa los campos indicados." });
      return;
    }

    // Tiempo mínimo de envío: descarta bots que completan y envían al instante.
    if (Date.now() - payload.startedAt < MIN_FILL_TIME_MS) {
      setState({ status: "error", message: "Revisa los campos indicados." });
      return;
    }

    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      setState({ status: "error", message: "Revisa los campos indicados." });
      return;
    }

    const lead = {
      fullName: parsed.data.fullName,
      businessName: parsed.data.businessName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      country: parsed.data.country,
      teamSize: parsed.data.teamSize,
      portfolioRange: parsed.data.portfolioRange,
      message: parsed.data.message,
      processingConsent: parsed.data.processingConsent,
      marketingConsent: parsed.data.marketingConsent,
      utm: parsed.data.utm,
    };

    const context = {
      requestId: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      pageUrl: window.location.href,
    };

    setState({ status: "submitting" });
    trackEvent("lead_form_submit");

    try {
      // Al negocio: ruta crítica, "fail closed" — si falla, no se redirige.
      await sendLeadToOwner(lead, context);
    } catch (error) {
      trackEvent("lead_form_error");
      const message =
        error instanceof LeadEmailError
          ? "No pudimos enviar tu solicitud. Tus datos siguen aquí; inténtalo nuevamente."
          : "Ocurrió un error inesperado. Inténtalo nuevamente.";
      setState({ status: "error", message });
      return;
    }

    // Al cliente: best-effort, no bloquea el registro.
    void sendLeadClientConfirmation(lead, context);

    const redirectUrl = publicEnv.NEXT_PUBLIC_SYSTEM_REGISTER_URL;
    trackEvent("lead_email_confirmed");
    trackMetaLeadConversion();
    setState({ status: "success", redirectUrl });
    trackEvent("registration_redirect");
    window.location.href = redirectUrl;
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
        label="Nombre"
        autoComplete="given-name"
        required
        disabled={isSubmitting}
      />
      <Input
        id="apellido"
        name="apellido"
        label="Apellido"
        autoComplete="family-name"
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

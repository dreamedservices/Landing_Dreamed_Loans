# Leads — EmailJS, registro y medición

## Flujo actual

```text
Formulario en el navegador
  → validación Zod + honeypot + tiempo mínimo
  → EmailJS: aviso al negocio (crítico)
  → EmailJS: confirmación al lead (best-effort)
  → evento Lead de Meta Pixel (solo navegador, con consentimiento)
  → redirección al registro
```

La landing no guarda leads en una base de datos. EmailJS usa dos plantillas administradas en su panel: una para el negocio y otra para la confirmación del cliente.

## Variables

```env
NEXT_PUBLIC_SYSTEM_REGISTER_URL=
NEXT_PUBLIC_LEADS_NOTIFICATION_EMAIL=
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_OWNER_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

Los identificadores públicos de EmailJS permiten invocar las plantillas, por lo que las restricciones de dominio, cuota y protección antiabuso deben configurarse también en el panel de EmailJS.

## Comportamiento

- Si falla el correo al negocio, el formulario conserva los datos y no redirige.
- Si falla la confirmación al cliente, la solicitud sigue siendo válida.
- `Lead` se dispara después de confirmar el correo al negocio, nunca al hacer clic en el botón.
- La medición de Meta es best-effort y no invalida un lead ya confirmado.
- Las UTMs `source`, `medium`, `campaign`, `content`, `term` y `fbclid` se conservan durante la pestaña actual.

La configuración detallada de Meta está en `docs/META-ADS-RUNBOOK.md`.

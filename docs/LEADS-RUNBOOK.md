# Runbook — Leads, SMTP y registro (Fase 05)

## 1. Estado actual de credenciales

`site/.env.local` (nunca se commitea) tiene:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_AUTH` — buzón `info@dreamprestamos.com`.
- `LEADS_NOTIFICATION_EMAIL` — `dreamedservice@gmail.com` (destino del aviso de cada solicitud).
- `SYSTEM_REGISTER_URL` — `https://dreamprestamos.com/auth/register`.
- `LEAD_RATE_LIMIT_SECRET` — generado localmente.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — Google Analytics 4.

Con esto el flujo real ya está completo y **verificado con un envío real** (correo recibido tanto en
`dreamedservice@gmail.com` como en la confirmación al lead) — no falta ningún valor.

### `SMTP_HOST` no es el que parece

`mail.dreamedservices.com` y `dreamprestamos.com` (apex) están detrás de Cloudflare: el puerto 465 no llega al origen
(timeout de conexión, confirmado con una prueba de socket TCP cruda). `mail.dreamprestamos.com` sí conecta, pero su
certificado TLS es del hosting compartido (`bh8940.banahosting.com`), no del dominio propio — nodemailer rechaza la
conexión con `Hostname/IP does not match certificate's altnames`. La solución fue usar directamente el hostname del
certificado como `SMTP_HOST`. Si se cambia de proveedor de hosting de correo, repetir este diagnóstico (DNS + socket
TCP directo al puerto + revisar a qué nombre pertenece el certificado) en vez de asumir que el hostname "obvio"
(`mail.dominio.com`) es el correcto.

## 2. Por qué SMTP y no Gmail API/OAuth

Fase 05 se implementó originalmente con Gmail API + OAuth 2.0 (aprobado en Fase 00). Ese flujo requiere que una persona
inicie sesión en un navegador como `dreamedservice@gmail.com` y otorgue consentimiento — un paso que no se pudo
completar. El propietario del producto decidió usar en su lugar las credenciales SMTP ya disponibles del dominio propio
(`dreamedservices.com`). El código de Gmail (`gmail-notifier.ts`, `scripts/get-gmail-refresh-token.mjs`, dependencia
`@googleapis/gmail`) se eliminó — no quedó como alternativa sin usar.

`nodemailer` maneja el envío por SMTP. `SmtpLeadNotifier` implementa la misma interfaz `LeadNotifier` que usaba el
adaptador de Gmail, así que el resto del flujo (`route.ts`, plantillas, adaptador falso de tests) no cambió.

## 3. Dos correos por solicitud

- **Al negocio** (`sendLead`, a `LEADS_NOTIFICATION_EMAIL`): ruta crítica, política "fail closed" — si falla, la API
  responde error y el formulario no redirige (el usuario puede reintentar, sus datos no se pierden).
- **Al cliente** (`sendClientConfirmation`, al correo que puso en el formulario): confirmación de recepción,
  best-effort — si falla, se registra en logs pero nunca bloquea el registro, porque el negocio ya quedó notificado con
  el paso anterior.

## 4. Rotación y revocación

- **Cambiar la contraseña SMTP**: actualizar `SMTP_PASSWORD` en `.env.local` y reiniciar el servidor. No hay ningún
  token derivado que regenerar (a diferencia del refresh token de OAuth).
- **Credencial comprometida**: cambiar la contraseña del buzón `info@dreamprestamos.com` en el panel del proveedor de
  correo del dominio, y actualizar `SMTP_PASSWORD`. El envío de leads empezará a fallar en cerrado hasta que se
  actualice.
- **`LEAD_RATE_LIMIT_SECRET`**: puede rotarse en cualquier momento (solo afecta el hash de la clave de rate limit; el
  limitador es en memoria, no hay estado que migrar).

## 5. Flujo de datos y retención

```text
Formulario (cliente)
  → POST /api/leads (validación Zod + honeypot + tiempo mínimo + rate limit)
    → LeadNotifier.sendLead()          [crítico, fail closed]
      → SMTP (mail.dreamedservices.com) → bandeja de dreamedservice@gmail.com
    → LeadNotifier.sendClientConfirmation()  [best-effort]
      → SMTP → bandeja del correo que puso el lead en el formulario
  → respuesta { ok, requestId, redirectUrl }
  → redirección del navegador a SYSTEM_REGISTER_URL
```

- **La landing no tiene base de datos.** No hay tabla ni almacenamiento propio de leads: el único registro persistente
  es el correo que llega a `dreamedservice@gmail.com`.
- **Retención**: gobernada por la política del proveedor de correo del dominio, no por este proyecto.
- **Logs del servidor**: solo telemetría técnica (`requestId`, si el envío fue reintentable, mensajes de error
  genéricos). Nunca se registra el cuerpo del lead ni la IP en claro — la IP solo se usa, hasheada con
  `LEAD_RATE_LIMIT_SECRET`, como clave de rate limit en memoria, y nunca se persiste.
- **Rate limiting en memoria**: se pierde al reiniciar el servidor; no comparte estado entre instancias si el sitio se
  despliega en varias regiones (documentado como limitación de MVP en `FASE-05-LEADS-GMAIL-Y-REGISTRO.md`).

## 6. Diagnóstico

Si el envío falla, poner `SMTP_DEBUG=true` en `.env.local` y reiniciar: `nodemailer` imprime el diálogo SMTP completo
en los logs del servidor (útil para distinguir un problema de autenticación de uno de conexión/puerto/TLS). Volver a
`SMTP_DEBUG=0` después — el log detallado no debe quedar activo en producción.

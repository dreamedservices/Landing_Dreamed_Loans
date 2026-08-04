import "server-only";
import type { LeadNotifier } from "./lead-notifier";
import { SmtpLeadNotifier } from "./smtp-notifier";
import { FakeLeadNotifier } from "./fake-notifier";
import { getSmtpEnv, getLeadsEnv } from "@/lib/env.server";

/**
 * LEADS_TEST_MODE solo se define en playwright.config.ts. Cualquier otro
 * entorno (dev, producción) usa siempre el adaptador real de SMTP.
 *
 * `forceReal` permite que un test verifique el comportamiento real cuando
 * faltan credenciales (caso obligatorio de FASE-05) sin enviar un correo de
 * verdad: solo tiene efecto cuando LEADS_TEST_MODE ya es "true", así que en
 * producción esta opción no existe.
 */
export function getLeadNotifier(forceReal = false): LeadNotifier {
  if (process.env.LEADS_TEST_MODE === "true" && !forceReal) {
    return new FakeLeadNotifier();
  }

  const smtpEnv = getSmtpEnv();
  const leadsEnv = getLeadsEnv();

  return new SmtpLeadNotifier({
    host: smtpEnv.SMTP_HOST,
    port: smtpEnv.SMTP_PORT,
    username: smtpEnv.SMTP_USERNAME,
    password: smtpEnv.SMTP_PASSWORD,
    auth: smtpEnv.SMTP_AUTH,
    debug: smtpEnv.SMTP_DEBUG,
    toEmail: leadsEnv.LEADS_NOTIFICATION_EMAIL,
  });
}

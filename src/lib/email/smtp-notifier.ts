import "server-only";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { lookup } from "node:dns/promises";
import type { ValidatedLead } from "@/lib/validation/lead-schema";
import type { LeadContext, LeadNotifier, LeadNotifierResult } from "./lead-notifier";
import { LeadNotifierError } from "./lead-notifier";
import {
  buildClientHtmlBody,
  buildClientSubject,
  buildClientTextBody,
  buildHtmlBody,
  buildSubject,
  buildTextBody,
} from "./templates";

type SmtpNotifierConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  auth: boolean;
  debug: boolean;
  /** Destinatario del aviso al negocio (dreamedservice@gmail.com). */
  toEmail: string;
};

type MessageParts = {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};

const SEND_TIMEOUT_MS = 8000;

/**
 * SMTP directo (nodemailer) en vez de Gmail API/OAuth: el flujo de OAuth
 * requiere que una persona complete el consentimiento en un navegador y no
 * se pudo completar; se usa en su lugar el buzón `no-replay@dreamedservices.com`
 * ya provisto. El remitente (`From`) es siempre la cuenta autenticada — la
 * mayoría de los servidores SMTP rechazan o marcan como spam un `From` que
 * no coincide con la cuenta autenticada.
 */
export class SmtpLeadNotifier implements LeadNotifier {
  constructor(private readonly config: SmtpNotifierConfig) {}

  async sendLead(lead: ValidatedLead, context: LeadContext): Promise<LeadNotifierResult> {
    return this.send({
      to: this.config.toEmail,
      replyTo: lead.email,
      subject: buildSubject(lead),
      text: buildTextBody(lead, context),
      html: buildHtmlBody(lead, context),
    });
  }

  async sendClientConfirmation(lead: ValidatedLead, context: LeadContext): Promise<LeadNotifierResult> {
    return this.send({
      to: lead.email,
      replyTo: this.config.toEmail,
      subject: buildClientSubject(),
      text: buildClientTextBody(lead, context, this.config.toEmail),
      html: buildClientHtmlBody(lead, context, this.config.toEmail),
    });
  }

  private async send(parts: MessageParts): Promise<LeadNotifierResult> {
    // El host resuelve a IPv4 e IPv6 (detrás de Cloudflare); en algunos
    // entornos la ruta IPv6 no es alcanzable (ENETUNREACH) aunque la IPv4 sí
    // lo es. nodemailer no expone una opción `family` real (su propio
    // resolveHostname() ignora el orden de familia salvo que `host` ya sea
    // una IP literal — código de `nodemailer/lib/shared/index.js`), así que
    // se resuelve la IPv4 aquí mismo y se conecta directo a ella. `servername`
    // mantiene el hostname original para que la verificación TLS/SNI del
    // certificado siga siendo correcta (si se conectara por IP sin esto, la
    // validación del certificado fallaría o se enviaría el SNI equivocado).
    let host = this.config.host;
    try {
      const resolved = await lookup(this.config.host, { family: 4 });
      host = resolved.address;
    } catch {
      // Si la resolución IPv4 falla, se deja el hostname original: que sea
      // nodemailer/Node quien reporte el error real de conexión.
    }

    const options: SMTPTransport.Options = {
      host,
      port: this.config.port,
      secure: this.config.port === 465,
      tls: { servername: this.config.host },
      auth: this.config.auth
        ? { user: this.config.username, pass: this.config.password }
        : undefined,
      connectionTimeout: SEND_TIMEOUT_MS,
      socketTimeout: SEND_TIMEOUT_MS,
      logger: this.config.debug,
      debug: this.config.debug,
    };
    const transporter = nodemailer.createTransport(options);

    try {
      const info = await transporter.sendMail({
        from: `Dream Préstamos <${this.config.username}>`,
        to: parts.to,
        replyTo: parts.replyTo,
        subject: parts.subject,
        text: parts.text,
        html: parts.html,
      });

      if (!info.messageId) {
        throw new LeadNotifierError("El servidor SMTP no devolvió un id de mensaje.", true);
      }

      return { messageId: info.messageId };
    } catch (error) {
      if (error instanceof LeadNotifierError) throw error;

      // No exponer el error real del proveedor (puede incluir detalles de las credenciales).
      const message = error instanceof Error ? error.message : "Error desconocido del proveedor";
      const isAuthError = /auth|credentials|invalid login/i.test(message);
      console.error("[SmtpLeadNotifier] envío falló:", message);
      throw new LeadNotifierError("No se pudo enviar el correo.", !isAuthError);
    }
  }
}

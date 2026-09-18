import nodemailer, { type Transporter } from "nodemailer";

/**
 * Transactional e-mail over our own SMTP mailbox (Hostinger by default),
 * the same pattern the NoComply API uses. Marketing mail stays in
 * MailerLite; this is only for messages the app itself owes a person:
 * course reminders today, possibly auth mail later.
 *
 * Env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.
 */

let transporter: Transporter | null = null;

export function isMailerConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter(): Transporter {
  if (transporter) return transporter;
  if (!isMailerConfigured()) throw new Error("SMTP_USER and SMTP_PASS are not set");
  const port = Number(process.env.SMTP_PORT) || 465;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
  /** RFC 8058 one-click unsubscribe target, added as List-Unsubscribe headers. */
  unsubscribeUrl?: string;
}

export function fromAddress(): string {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "";
  return from.includes("<") ? from : `po prostu sens <${from}>`;
}

export async function sendMail(message: MailMessage): Promise<void> {
  const headers: Record<string, string> = {};
  if (message.unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${message.unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }
  await getTransporter().sendMail({
    from: fromAddress(),
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
    headers,
  });
}

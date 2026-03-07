import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates', 'emails');

const mailgun = new Mailgun(FormData);

function createMailgunClient() {
  if (!env.MAILGUN_API_KEY) return null;
  return mailgun.client({
    username: 'api',
    key: env.MAILGUN_API_KEY,
    url: 'https://api.mailgun.net',
  });
}

const mg = createMailgunClient();

function getMailgunDomain(): string {
  if (env.MAILGUN_DOMAIN) return env.MAILGUN_DOMAIN;
  const host = env.MAILGUN_PROXY_EMAIL.split('@')[1] || '';
  if (host.startsWith('mg.')) return host;
  return `mg.${host}`;
}

async function renderTemplate(templateName: string, data: Record<string, unknown>): Promise<string> {
  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.ejs`);
  return ejs.renderFile(templatePath, data);
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!mg) {
    console.log(`[EMAIL-DEV] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL-DEV] Would send HTML email (${html.length} chars)`);
    return true;
  }

  try {
    const domain = getMailgunDomain();
    await mg.messages.create(domain, {
      from: `OldPickleball <${env.MAILGUN_PROXY_EMAIL}>`,
      to: [to],
      subject,
      html,
    });
    console.log(`[EMAIL] Sent "${subject}" to ${to}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] Failed to send to ${to}:`, error);
    return false;
  }
}

export class EmailService {
  static async sendOTP(to: string, otpCode: string, isNewUser: boolean): Promise<boolean> {
    const subject = isNewUser
      ? 'Welcome to OldPickleball — Your verification code'
      : 'Your OldPickleball sign-in code';

    const html = await renderTemplate('otp', {
      otpCode,
      isNewUser,
      expiryMinutes: env.OTP_EXPIRY_MINUTES,
    });

    return sendEmail(to, subject, html);
  }

  static async sendWelcome(to: string, firstName: string): Promise<boolean> {
    const html = await renderTemplate('welcome', { firstName });
    return sendEmail(to, 'Welcome to OldPickleball! 🏓', html);
  }
}

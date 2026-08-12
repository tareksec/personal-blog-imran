import { kv } from '@vercel/kv';

/**
 * POST /api/contact
 * Body: { name, email, subject, message, website }
 *   website — honeypot field; must be empty or the request is rejected.
 *
 * Server-side validation, per-IP rate limiting (5/hour via KV, with an
 * in-memory fallback), then delivery via:
 *   1. Resend REST API  (RESEND_API_KEY)
 *   2. SMTP (nodemailer) (SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_FROM)
 *   3. Otherwise returns 503 with a clear setup message.
 */

const CONTACT_TO = process.env.CONTACT_TO_EMAIL || 'contact@imrankhanlincoln.com';
const RATE_LIMIT_PER_HOUR = 5;

const inMemoryHits = new Map(); // fallback when KV is unavailable

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function validate(body) {
  const errors = {};
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const subject = String(body.subject || '').trim();
  const message = String(body.message || '').trim();

  if (name.length < 2 || name.length > 100) errors.name = 'Please enter your name (2–100 characters).';
  if (!isValidEmail(email) || email.length > 200) errors.email = 'Please enter a valid email address.';
  if (subject.length < 2 || subject.length > 200) errors.subject = 'Please enter a subject (2–200 characters).';
  if (message.length < 10 || message.length > 5000) errors.message = 'Please enter a message (10–5000 characters).';

  return { errors, values: { name, email, subject, message } };
}

async function checkRateLimit(ip) {
  const key = `contact:rate:${ip}`;
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const count = (await kv.get(key)) || 0;
      if (count >= RATE_LIMIT_PER_HOUR) return false;
      await kv.set(key, count + 1, { ex: 3600 });
      return true;
    }
  } catch {
    /* fall through to in-memory */
  }
  const now = Date.now();
  const entry = inMemoryHits.get(ip);
  if (entry && entry.count >= RATE_LIMIT_PER_HOUR && now - entry.resetAt < 3600000) return false;
  if (!entry || now - entry.resetAt >= 3600000) inMemoryHits.set(ip, { count: 1, resetAt: now + 3600000 });
  else entry.count += 1;
  return true;
}

async function sendViaResend({ name, email, subject, message }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || `Imran Khan Lincoln <onboarding@resend.dev>`,
      to: [CONTACT_TO],
      reply_to: email,
      subject: `[Website] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name.replace(/</g, '&lt;')}</p><p><strong>Email:</strong> ${email.replace(/</g, '&lt;')}</p><hr><p>${message.replace(/</g, '&lt;').replace(/\n/g, '<br>')}</p>`,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend responded ${res.status}: ${body.slice(0, 200)}`);
  }
}

async function sendViaSmtp({ name, email, subject, message }) {
  const nodemailer = (await import('nodemailer')).default;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: (process.env.SMTP_PORT || '587') === '465',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || `Website Contact <${process.env.SMTP_USER || 'no-reply@localhost'}>`,
    to: CONTACT_TO,
    replyTo: email,
    subject: `[Website] ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'object' && req.body !== null ? req.body : {};

    // Honeypot: bots fill this hidden field
    if (String(body.website || '').trim() !== '') {
      return res.status(200).json({ success: true }); // pretend it worked
    }

    const { errors, values } = validate(body);
    if (Object.keys(errors).length) {
      return res.status(400).json({ success: false, errors });
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return res.status(429).json({ success: false, error: 'Too many messages. Please try again later.' });
    }

    if (process.env.RESEND_API_KEY) {
      await sendViaResend(values);
    } else if (process.env.SMTP_HOST) {
      await sendViaSmtp(values);
    } else {
      return res.status(503).json({
        success: false,
        error: 'Email delivery is not configured yet. Set RESEND_API_KEY or SMTP_* environment variables.',
      });
    }

    res.status(200).json({ success: true, message: 'Message sent. Thank you!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, error: 'Failed to send your message. Please try again later.' });
  }
}
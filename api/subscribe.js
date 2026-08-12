import { kv } from '@vercel/kv';

/**
 * POST /api/subscribe
 * Body: { email, website }
 *   website — honeypot field; must be empty or request is rejected.
 *
 * Stores subscriber emails in Vercel KV (fallback: in-memory).
 * Sends a welcome email via Resend if RESEND_API_KEY is configured.
 * Rate limited: 3 subscriptions per IP per hour.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || 'Imran Khan Lincoln <onboarding@resend.dev>';
const RATE_LIMIT_PER_HOUR = 3;

const inMemorySubs = new Set();
const inMemoryHits = new Map();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
}

/** Deduplicate: check if email already subscribed */
async function isAlreadySubscribed(email) {
  const key = `subscriber:${email.toLowerCase()}`;
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      return !!(await kv.get(key));
    }
  } catch { /* fall through */ }
  return inMemorySubs.has(email.toLowerCase());
}

async function storeSubscriber(email) {
  const key = `subscriber:${email.toLowerCase()}`;
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      // Store with no expiry — persistent subscription
      await kv.set(key, { email: email.toLowerCase(), subscribedAt: new Date().toISOString() });
      // Also add to a set for easy listing
      await kv.sadd('subscribers:list', email.toLowerCase());
      return true;
    }
  } catch { /* fall through */ }
  // In-memory fallback
  inMemorySubs.add(email.toLowerCase());
  return true;
}

async function checkRateLimit(ip) {
  const key = `subscribe:rate:${ip}`;
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const count = (await kv.get(key)) || 0;
      if (count >= RATE_LIMIT_PER_HOUR) return false;
      await kv.set(key, count + 1, { ex: 3600 });
      return true;
    }
  } catch { /* fall through */ }
  const now = Date.now();
  const entry = inMemoryHits.get(ip);
  if (entry && entry.count >= RATE_LIMIT_PER_HOUR && now - entry.resetAt < 3600000) return false;
  if (!entry || now - entry.resetAt >= 3600000) inMemoryHits.set(ip, { count: 1, resetAt: now + 3600000 });
  else entry.count += 1;
  return true;
}

async function sendWelcomeEmail(email) {
  if (!RESEND_API_KEY) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [email],
        subject: 'Welcome to Imran Khan Lincoln\'s Newsletter',
        text: `Thank you for subscribing! You'll receive insights on Real Estate, Leadership & Business Strategy from Md. Imran Khan Lincoln.\n\nVisit the blog: https://imrankhanlincoln.blogspot.com/`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
<h2>Thank you for subscribing!</h2>
<p>You're now on the list to receive insights on <strong>Real Estate, Leadership & Business Strategy</strong> from Md. Imran Khan Lincoln.</p>
<p>In the meantime, explore the blog:</p>
<a href="https://imrankhanlincoln.blogspot.com/" style="display:inline-block;padding:12px 24px;background:#1154FF;color:#fff;border-radius:6px;text-decoration:none;">Visit the Blog</a>
<hr style="margin-top:24px;border:none;border-top:1px solid #eee;"/>
<p style="color:#999;font-size:12px;">You received this because you subscribed at imranvai.vercel.app. If this was a mistake, you can reply to unsubscribe.</p>
</div>`,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const email = String(req.body && req.body.email || '').trim();
    const website = String(req.body && req.body.website || '').trim();

    // Honeypot
    if (website) {
      return res.status(200).json({ success: true, message: 'Thank you for subscribing!' });
    }

    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Rate limit
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
    }

    // Deduplicate
    if (await isAlreadySubscribed(email)) {
      return res.status(200).json({ success: true, message: 'You are already subscribed!' });
    }

    // Store
    await storeSubscriber(email);

    // Send welcome email (non-blocking — don't fail if Resend isn't configured)
    const emailSent = await sendWelcomeEmail(email);

    return res.status(200).json({
      success: true,
      message: 'Thanks for subscribing! Check your inbox for a welcome email.',
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

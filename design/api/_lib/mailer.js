// Outbound email via Resend (https://resend.com).
//
// Configured entirely by environment variables:
//
//   RESEND_API_KEY   required to send at all; without it the mailer becomes a
//                    no-op that logs what it would have sent
//   MAIL_FROM        e.g. "DriveMe <bookings@driveme.fi>" — the domain must be
//                    verified in Resend or the API rejects the send
//   OPS_EMAIL        where booking alerts go (info@driveme.fi once that inbox
//                    exists; any address you can actually read until then)
//   PUBLIC_BASE_URL  origin used for links inside emails, e.g. https://driveme.fi
//
// Nothing here is allowed to throw. By the time we send, the booking is already
// safely in the database — a mail outage must never turn into a lost customer.

export function mailConfig() {
  return {
    enabled: Boolean(process.env.RESEND_API_KEY),
    from: process.env.MAIL_FROM || 'DriveMe <bookings@driveme.fi>',
    ops: process.env.OPS_EMAIL || 'info@driveme.fi',
    base: (
      process.env.PUBLIC_BASE_URL ||
      (process.env.URL || '') ||                       // Netlify sets URL to the site origin
      (process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : '') ||
      'https://driveme.fi'
    ).replace(/\/+$/, ''),
  };
}

/**
 * @returns {Promise<{sent:boolean, id?:string, error?:string}>} never rejects
 */
export async function sendMail({ to, subject, html, text, replyTo }) {
  const cfg = mailConfig();

  if (!cfg.enabled) {
    console.warn('mail: RESEND_API_KEY not set — skipped "' + subject + '" to ' + to);
    return { sent: false, error: 'not configured' };
  }
  if (!to) return { sent: false, error: 'no recipient' };

  // Don't let a slow provider hold a serverless invocation open.
  const abort = AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: cfg.from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: abort,
    });

    if (!res.ok) {
      // Resend explains refusals in the body — an unverified sending domain is
      // by far the most common one, so surface it rather than a bare status.
      const detail = await res.text().catch(() => '');
      console.error('mail: resend rejected (' + res.status + '):', detail.slice(0, 300));
      return { sent: false, error: 'resend ' + res.status };
    }

    const data = await res.json().catch(() => ({}));
    return { sent: true, id: data.id };
  } catch (e) {
    console.error('mail: send failed:', e.name === 'TimeoutError' ? 'timed out' : e.message);
    return { sent: false, error: e.message };
  }
}

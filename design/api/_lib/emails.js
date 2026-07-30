// Email bodies. Kept apart from mailer.js so the wording can change without
// touching delivery, and so templates stay testable without network access.

const esc = (v) =>
  String(v == null ? '' : v).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const PAY = { card: 'Card', mobilepay: 'MobilePay', invoice: 'Corporate invoice' };

/** Bookings are stored UTC; ops read them in Helsinki time. */
function whenLocal(iso) {
  if (!iso) return 'Not specified';
  try {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Helsinki',
    }).format(new Date(iso)) + ' (Helsinki)';
  } catch {
    return iso;
  }
}

const euro = (n) => (n == null ? '—' : '€' + Number(n).toFixed(2));

/**
 * Alert to the ops inbox for a new booking.
 * Reply-To is the customer, so replying from the inbox reaches them directly.
 */
export function bookingAlert(booking, base) {
  const ref = booking.id.slice(0, 8).toUpperCase();
  const type = booking.mode === 'hourly'
    ? 'By the hour' + (booking.duration_hours ? ' · ' + booking.duration_hours + ' h' : '')
    : 'Point to point';

  const rows = [
    ['Reference', ref],
    ['Customer', booking.customer_name],
    ['Phone', booking.customer_phone],
    ['Email', booking.customer_email],
    ['When', whenLocal(booking.scheduled_for)],
    ['Pickup', booking.pickup_location],
    ['Drop-off', booking.destination || 'Open-ended (driver stays)'],
    ['Booking type', type],
    ['Beyond metro', booking.km_beyond_metro ? booking.km_beyond_metro + ' km' : '—'],
    ['Quoted price', euro(booking.estimated_price)],
    ['Payment', PAY[booking.payment_method] || 'Not chosen'],
  ];

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#F5F8FC;font-family:Inter,-apple-system,'Segoe UI',sans-serif;color:#0B1524">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #EAEFF6;border-radius:14px;overflow:hidden">
    <div style="padding:20px 24px;border-bottom:1px solid #EAEFF6">
      <div style="font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:#697687;font-weight:600">New booking</div>
      <div style="font-size:21px;font-weight:600;letter-spacing:-.01em;margin-top:4px">Reference ${esc(ref)}</div>
      <div style="font-size:13.5px;color:#697687;margin-top:2px">Nobody is assigned yet — the customer is seeing “Matching driver…”.</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rows.map(([k, v]) => `<tr>
        <td style="padding:11px 24px;color:#697687;white-space:nowrap;border-bottom:1px solid #F2F5F9;vertical-align:top;width:130px">${esc(k)}</td>
        <td style="padding:11px 24px;border-bottom:1px solid #F2F5F9">${esc(v || '—')}</td>
      </tr>`).join('')}
    </table>
    <div style="padding:22px 24px">
      <a href="${esc(base)}/admin" style="display:inline-block;background:#0F63BD;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:10px">Open in admin</a>
      <div style="font-size:12.5px;color:#697687;margin-top:14px">Assign an approved driver, then send them their GPS link from the booking drawer.</div>
    </div>
  </div>
  <div style="max-width:560px;margin:14px auto 0;font-size:11.5px;color:#8C97A6;text-align:center">
    Sent automatically by the DriveMe booking form · Mansio Group Oy
  </div>
</body></html>`;

  const text = [
    'NEW BOOKING — ' + ref,
    'Nobody is assigned yet; the customer sees "Matching driver...".',
    '',
    ...rows.map(([k, v]) => k + ': ' + (v || '—')),
    '',
    'Open in admin: ' + base + '/admin',
  ].join('\n');

  return {
    subject: `New booking ${ref} — ${booking.customer_name} — ${whenLocal(booking.scheduled_for)}`,
    html,
    text,
    replyTo: booking.customer_email,
  };
}

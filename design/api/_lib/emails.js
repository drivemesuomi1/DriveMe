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

/* ==========================================================================
   Customer acknowledgement — sent the moment a request is submitted.
   The site promises "we'll confirm by email", so this is what keeps that
   promise. It deliberately does NOT carry a tracking link: tracking only
   opens once a chauffeur is assigned (migration 0004), so a link sent now
   would just show an error.
   ========================================================================== */
const COPY = {
  fi: {
    subject: (ref) => `Kiitos yhteydenotostasi — varausviite ${ref}`,
    eyebrow: 'Varauspyyntö vastaanotettu',
    title: 'Kiitos yhteydenotostasi',
    lede: 'Olemme vastaanottaneet varauspyyntösi ja palaamme asiaan pian — yleensä tunnin sisällä.',
    next: 'Vahvistamme kuljettajan sähköpostitse. Tarkastettu ja lisensoitu kuljettaja ajaa oman autosi perille.',
    detailsHead: 'Varauksen tiedot',
    rows: { ref:'Viite', when:'Ajankohta', pickup:'Noutopaikka', dest:'Määränpää', type:'Varaustyyppi', price:'Hinta-arvio', pay:'Maksutapa' },
    open: 'Avoin — kuljettaja pysyy mukanasi',
    hourly: (h) => `Tuntiveloitus${h ? ` · ${h} h` : ''}`,
    p2p: 'Pisteestä pisteeseen',
    notChosen: 'Ei valittu',
    help: 'Jos jokin tieto on väärin, vastaa tähän viestiin.',
    foot: 'DriveMe · Mansio Group Oy · Helsinki',
  },
  sv: {
    subject: (ref) => `Tack för din förfrågan — bokningsreferens ${ref}`,
    eyebrow: 'Förfrågan mottagen',
    title: 'Tack för din förfrågan',
    lede: 'Vi har tagit emot din bokningsförfrågan och återkommer inom kort — vanligtvis inom en timme.',
    next: 'Vi bekräftar din förare via e-post. En kontrollerad, licensierad chaufför kör din egen bil ända fram till dörren.',
    detailsHead: 'Din förfrågan',
    rows: { ref:'Referens', when:'Tidpunkt', pickup:'Upphämtning', dest:'Destination', type:'Bokningstyp', price:'Prisuppskattning', pay:'Betalning' },
    open: 'Öppen — föraren stannar hos dig',
    hourly: (h) => `Per timme${h ? ` · ${h} h` : ''}`,
    p2p: 'Punkt till punkt',
    notChosen: 'Inte valt',
    help: 'Om någon uppgift är fel, svara bara på det här meddelandet.',
    foot: 'DriveMe · Mansio Group Oy · Helsingfors',
  },
  en: {
    subject: (ref) => `Thank you for contacting DriveMe — reference ${ref}`,
    eyebrow: 'Request received',
    title: 'Thank you for contacting DriveMe',
    lede: "We've received your booking request and will get back to you shortly — usually within the hour.",
    next: "We'll confirm your driver by email. A vetted, licensed chauffeur drives your own car to your door.",
    detailsHead: 'Your request',
    rows: { ref:'Reference', when:'When', pickup:'Pickup', dest:'Drop-off', type:'Booking type', price:'Estimated price', pay:'Payment' },
    open: 'Open-ended — the driver stays with you',
    hourly: (h) => `By the hour${h ? ` · ${h} h` : ''}`,
    p2p: 'Point to point',
    notChosen: 'Not chosen',
    help: 'If any detail is wrong, just reply to this email.',
    foot: 'DriveMe · Mansio Group Oy · Helsinki',
  },
};

const PAY_LABEL = {
  fi: { card:'Kortti', mobilepay:'MobilePay', invoice:'Yrityslasku' },
  sv: { card:'Kort', mobilepay:'MobilePay', invoice:'Företagsfaktura' },
  en: { card:'Card', mobilepay:'MobilePay', invoice:'Corporate invoice' },
};

/**
 * Acknowledgement to the customer.
 * @param {string} lang 'fi' | 'en' — falls back to Finnish, the site default.
 */
export function customerConfirmation(booking, base, lang) {
  const L = COPY[lang] || COPY.fi;
  const ref = booking.id.slice(0, 8).toUpperCase();
  const type = booking.mode === 'hourly' ? L.hourly(booking.duration_hours) : L.p2p;

  const rows = [
    [L.rows.ref, ref],
    [L.rows.when, whenLocal(booking.scheduled_for)],
    [L.rows.pickup, booking.pickup_location],
    [L.rows.dest, booking.destination || L.open],
    [L.rows.type, type],
    [L.rows.price, euro(booking.estimated_price)],
    [L.rows.pay, (PAY_LABEL[lang] || PAY_LABEL.fi)[booking.payment_method] || L.notChosen],
  ];

  const html = `<!doctype html><html lang="${esc(lang === 'en' ? 'en' : 'fi')}"><body style="margin:0;padding:24px;background:#F5F8FC;font-family:Inter,-apple-system,'Segoe UI',sans-serif;color:#0B1524">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #EAEFF6;border-radius:14px;overflow:hidden">
    <div style="padding:24px 24px 20px;border-bottom:1px solid #EAEFF6">
      <div style="font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:#697687;font-weight:600">${esc(L.eyebrow)}</div>
      <div style="font-size:22px;font-weight:600;letter-spacing:-.01em;margin-top:6px">${esc(L.title)}</div>
      <p style="font-size:14.5px;line-height:1.6;color:#3A4757;margin:12px 0 0">${esc(L.lede)}</p>
      <p style="font-size:14.5px;line-height:1.6;color:#3A4757;margin:12px 0 0">${esc(L.next)}</p>
    </div>
    <div style="padding:18px 24px 4px;font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:#697687;font-weight:600">${esc(L.detailsHead)}</div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rows.map(([k, v]) => `<tr>
        <td style="padding:10px 24px;color:#697687;white-space:nowrap;border-bottom:1px solid #F2F5F9;vertical-align:top;width:140px">${esc(k)}</td>
        <td style="padding:10px 24px;border-bottom:1px solid #F2F5F9">${esc(v || '—')}</td>
      </tr>`).join('')}
    </table>
    <div style="padding:20px 24px;font-size:13px;color:#697687">${esc(L.help)}</div>
  </div>
  <div style="max-width:560px;margin:14px auto 0;font-size:11.5px;color:#8C97A6;text-align:center">${esc(L.foot)}</div>
</body></html>`;

  const text = [
    L.title, '', L.lede, '', L.next, '', L.detailsHead,
    ...rows.map(([k, v]) => `${k}: ${v || '—'}`),
    '', L.help, '', L.foot,
  ].join('\n');

  return { subject: L.subject(ref), html, text };
}

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

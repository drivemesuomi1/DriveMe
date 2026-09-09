// Email bodies. Kept apart from mailer.js so the wording can change without
// touching delivery, and so templates stay testable without network access.

const esc = (v) =>
  String(v == null ? '' : v).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const PAY = { card: 'Card', mobilepay: 'MobilePay', invoice: 'Corporate invoice' };

/**
 * Service labels for the §7 concierge request. Kept here rather than imported
 * from the content layer because api/ is bundled on its own - these are the
 * only customer-visible service strings the API itself has to know.
 */
const SERVICE_LABEL = {
  fi: {
    inspection: 'Auton vienti katsastukseen', workshop: 'Auton nouto huoltoon',
    tyre: 'Auton vienti renkaanvaihtoon', wash: 'Auton vienti pesuun',
    glass: 'Lasi-, kori- tai takaisinkutsuajo', pickupReturn: 'Auton nouto ja palautus',
    relocation: 'Auton siirtopalvelu', dealer: 'Palautus autoliikkeeseen tai leasingyhtiolle',
    personalDriver: 'Oma kuljettaja', safeRideHome: 'Turvallinen kotiinkuljetus',
    airport: 'Kuljettaja lentoasemalle', business: 'Yritysasiakkuus',
  },
  sv: {
    inspection: 'Bilen till besiktning', workshop: 'Bilen till service',
    tyre: 'Bilen till dackbyte', wash: 'Bilen till tvatt',
    glass: 'Glas, plat eller aterkallelse', pickupReturn: 'Upphamtning och retur',
    relocation: 'Fordonsflytt', dealer: 'Aterlamning till bilhandel eller leasing',
    personalDriver: 'Personlig forare', safeRideHome: 'Trygg hemresa',
    airport: 'Forare till flygplatsen', business: 'Foretagskonto',
  },
  en: {
    inspection: 'Vehicle inspection run', workshop: 'Workshop run',
    tyre: 'Tyre service run', wash: 'Wash and detailing run',
    glass: 'Glass, body shop or recall run', pickupReturn: 'Pickup and return',
    relocation: 'Vehicle relocation', dealer: 'Dealer or lease handover',
    personalDriver: 'Personal driver', safeRideHome: 'Safe ride home',
    airport: 'Airport driver', business: 'Corporate account',
  },
};

const SHAPE_LABEL = {
  fi: { oneWay: 'Yhteen suuntaan', pickupReturn: 'Nouto ja palautus', waitReturn: 'Odota ja palauta' },
  sv: { oneWay: 'Enkel riktning', pickupReturn: 'Upphamtning och retur', waitReturn: 'Vanta och returnera' },
  en: { oneWay: 'One way', pickupReturn: 'Pickup and return', waitReturn: 'Wait and return' },
};

function serviceLabel(booking, lang) {
  if (!booking.service) return null;
  const table = SERVICE_LABEL[lang] || SERVICE_LABEL.fi;
  const base = table[booking.service] || booking.service;
  const shapes = SHAPE_LABEL[lang] || SHAPE_LABEL.fi;
  const shape = booking.shape ? shapes[booking.shape] : null;
  return shape ? base + ' - ' + shape : base;
}

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
    lede: 'Olemme vastaanottaneet pyyntösi ja palaamme asiaan pian — palveluaikana yleensä alle 15 minuutissa.',
    next: 'Pyyntö ei ole vielä vahvistus. Vahvistamme erikseen kuljettajan, ajan ja kiinteän DriveMe-hinnan, ja vasta se tekee työstä sitovan.',
    third: 'Kolmannen osapuolen palvelut — katsastus, huolto, renkaat, pesu tai muu vastaava — maksat suoraan valitsemallesi palveluntarjoajalle. Ne eivät sisälly DriveMe-hintaan.',
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
    lede: 'Vi har tagit emot din förfrågan och återkommer inom kort.',
    next: 'En förfrågan är ännu inte en bekräftelse. Vi bekräftar förare, tid och ett fast DriveMe-pris separat.',
    third: 'Tredjepartstjänster — besiktning, service, däck eller tvätt — betalar du direkt till leverantören. De ingår inte i DriveMe-priset.',
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
    lede: "We've received your request and will get back to you shortly — usually within 15 minutes during service hours.",
    next: 'A request is not yet a confirmation. We confirm the driver, the time and a fixed DriveMe fee separately, and only that makes the job binding.',
    third: 'Third-party services — inspection, maintenance, tyres, wash or similar — are paid directly to the provider you choose. They are not part of the DriveMe fee.',
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
  const type = serviceLabel(booking, lang)
    || (booking.mode === 'hourly' ? L.hourly(booking.duration_hours) : L.p2p);

  // A quote-only job has no figure to show, and inventing one here would be
  // exactly the "fake total" the strategy warns against (§5).
  const priceNote = { fi: ' (ohjeellinen)', sv: ' (preliminärt)', en: ' (indicative)' };
  const quoteOnly = { fi: 'Vahvistamme kiinteän tarjouksen', sv: 'Vi bekräftar en fast offert', en: 'We will confirm a fixed quote' };
  const price = booking.quote_status === 'quote_required'
    ? (quoteOnly[lang] || quoteOnly.fi)
    : euro(booking.estimated_price) + (priceNote[lang] || priceNote.fi);

  const rows = [
    [L.rows.ref, ref],
    [L.rows.when, whenLocal(booking.scheduled_for)],
    [L.rows.pickup, booking.pickup_location],
    [L.rows.dest, booking.destination || L.open],
    [L.rows.type, type],
    [L.rows.price, price],
    [L.rows.pay, (PAY_LABEL[lang] || PAY_LABEL.fi)[booking.payment_method] || L.notChosen],
  ];

  const html = `<!doctype html><html lang="${esc(lang === 'en' ? 'en' : 'fi')}"><body style="margin:0;padding:24px;background:#F5F8FC;font-family:Inter,-apple-system,'Segoe UI',sans-serif;color:#0B1524">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #EAEFF6;border-radius:14px;overflow:hidden">
    <div style="padding:24px 24px 20px;border-bottom:1px solid #EAEFF6">
      <div style="font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:#697687;font-weight:600">${esc(L.eyebrow)}</div>
      <div style="font-size:22px;font-weight:600;letter-spacing:-.01em;margin-top:6px">${esc(L.title)}</div>
      <p style="font-size:14.5px;line-height:1.6;color:#3A4757;margin:12px 0 0">${esc(L.lede)}</p>
      <p style="font-size:14.5px;line-height:1.6;color:#3A4757;margin:12px 0 0">${esc(L.next)}</p>
      <p style="font-size:13.5px;line-height:1.6;color:#697687;margin:12px 0 0">${esc(L.third)}</p>
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
    L.title, '', L.lede, '', L.next, '', L.third, '', L.detailsHead,
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
  const type = serviceLabel(booking, 'en')
    || (booking.mode === 'hourly'
      ? 'By the hour' + (booking.duration_hours ? ' · ' + booking.duration_hours + ' h' : '')
      : 'Point to point');

  const vehicle = [booking.vehicle_plate, booking.vehicle_details, booking.vehicle_gearbox, booking.vehicle_fuel]
    .filter(Boolean).join(' · ');
  const appointment = [booking.provider, booking.appointment_time, booking.appointment_ref]
    .filter(Boolean).join(' · ');
  const company = booking.is_corporate
    ? [booking.company_name, booking.business_id, booking.invoice_email].filter(Boolean).join(' · ')
    : null;

  // Only rows with something in them: an ops alert that lists a dozen dashes
  // is harder to read at 07:00 than one that lists what was actually ordered.
  const rows = [
    ['Reference', ref],
    ['Service', type],
    ['Customer', booking.customer_name],
    ['Phone', booking.customer_phone],
    ['Email', booking.customer_email],
    ['Company', company],
    ['When', whenLocal(booking.scheduled_for) +
      (booking.collection_window ? ' · window ' + booking.collection_window : '')],
    ['Deliver by', booking.delivery_by],
    ['Pickup', booking.pickup_location],
    ['Destination', booking.destination || 'Open-ended (driver stays)'],
    ['Return to', booking.return_location],
    ['Access notes', booking.access_notes],
    ['Appointment', appointment],
    ['Key handover', booking.key_method],
    ['Expected waiting', booking.wait_minutes ? booking.wait_minutes + ' min' : null],
    ['Driver hours', booking.duration_hours ? booking.duration_hours + ' h' : null],
    ['Vehicle', vehicle],
    ['Mileage', booking.vehicle_mileage ? booking.vehicle_mileage + ' km' : null],
    ['Vehicle notes', booking.vehicle_notes],
    ['Handover contacts', [booking.pickup_contact, booking.delivery_contact, booking.contact_notes].filter(Boolean).join(' · ')],
    // Indicative until a human sets confirmed_price in /admin (§5).
    ['Indicative price', booking.quote_status === 'quote_required'
      ? 'Manual fixed quote required'
      : euro(booking.estimated_price)],
    ['Payment', PAY[booking.payment_method] || 'Not chosen'],
    ['Customer notes', booking.notes],
  ].filter(function (r) { return r[1] != null && r[1] !== ''; });

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#F5F8FC;font-family:Inter,-apple-system,'Segoe UI',sans-serif;color:#0B1524">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #EAEFF6;border-radius:14px;overflow:hidden">
    <div style="padding:20px 24px;border-bottom:1px solid #EAEFF6">
      <div style="font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:#697687;font-weight:600">New booking</div>
      <div style="font-size:21px;font-weight:600;letter-spacing:-.01em;margin-top:4px">Reference ${esc(ref)}</div>
      <div style="font-size:13.5px;color:#697687;margin-top:2px">Not confirmed yet — quote it, assign a driver, then confirm the fixed fee to the customer.</div>
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
    'NEW REQUEST — ' + ref,
    'Not confirmed yet; quote it, assign a driver, then confirm the fixed fee.',
    '',
    ...rows.map(([k, v]) => k + ': ' + (v || '—')),
    '',
    'Open in admin: ' + base + '/admin',
  ].join('\n');

  return {
    subject: `New request ${ref} — ${type} — ${booking.customer_name}`,
    html,
    text,
    replyTo: booking.customer_email,
  };
}

/**
 * The request flow (§7 "Operational workflow and booking fields").
 *
 * One flow, called "request" until DriveMe accepts it (§12 audit: the old
 * site had two booking interfaces and mixed request/book language). The
 * fields are exactly the groups the document lists - customer, service,
 * locations, appointment, vehicle, eligibility, handover, payment,
 * permissions - shown conditionally so a relocation booking is not asked
 * for a workshop reference.
 *
 * Pricing shown here is INDICATIVE and says so. The same constants that
 * produce it are exported from api/_lib/pricing.js and re-used by the
 * server, which recomputes the figure before storing it.
 */

import { services, byKey } from '../content/services.mjs';
import { acknowledgements, brand, ui } from '../content/site.mjs';
import { PRODUCTS, WAITING, PREMIUMS, SERVICE_PRODUCTS } from '../api/_lib/pricing.js';
import { esc } from './layout.mjs';
import { url } from './routes.mjs';
import { isGated } from './blocks.mjs';

const COPY = {
  fi: {
    path: 'Mitä tarvitset?',
    pathDriver: 'Tarvitsen kuljettajan',
    pathDriverSub: 'Ammattikuljettaja ajaa omaa autoasi.',
    pathCar: 'Hoida autoni puolestani',
    pathCarSub: 'Noudamme auton, viemme sen palveluun ja palautamme sen.',
    service: 'Palvelu',
    serviceLabel: 'Valitse palvelu',
    shape: 'Miten hoidamme työn?',
    shapeOneWay: 'Vain yhteen suuntaan',
    shapeOneWaySub: 'Yksi nouto ja yksi toimitus.',
    shapeReturn: 'Nouto ja myöhempi palautus',
    shapeReturnSub: 'Kaksi sovittua siirtoa; kuljettaja ei jää odottamaan.',
    shapeWait: 'Odota ja palauta',
    shapeWaitSub: `Kuljettaja odottaa enintään ${WAITING.waitReturnIncludedMinutes} min ja tuo auton takaisin.`,
    locations: 'Osoitteet',
    pickup: 'Nouto-osoite',
    destination: 'Kohde tai palveluntarjoajan osoite',
    returnTo: 'Palautusosoite',
    returnSame: 'Palautus samaan osoitteeseen kuin nouto',
    access: 'Kulku- ja pysäköintiohjeet',
    accessHelp: 'Portti- tai ovikoodi, parkkihallin taso, mistä avaimet löytyvät.',
    timing: 'Ajankohta',
    date: 'Päivämäärä',
    window: 'Noutoikkuna',
    deliveryBy: 'Tarvittava toimitusaika',
    deliveryByHelp: 'Jätä tyhjäksi, jos aikataulu on joustava.',
    appointment: 'Ajanvaraus palveluntarjoajalla',
    provider: 'Palveluntarjoaja',
    providerHelp: 'Katsastusasema, korjaamo, rengasliike, pesula tai muu valitsemasi kohde.',
    apptTime: 'Vahvistettu aika',
    apptRef: 'Varausnumero',
    apptContact: 'Yhteyshenkilö tai puhelin kohteessa',
    keyMethod: 'Avainten luovutus kohteessa',
    keyHand: 'Nimetylle henkilölle',
    keyDrop: 'Avainlaatikkoon',
    keyOther: 'Muu, kerron lisätiedoissa',
    apptNotice: 'Emme lähetä kuljettajaa ennen kuin ajanvaraus on vahvistettu. Ajanvarauksen tekee ja maksun hoitaa asiakas suoraan palveluntarjoajalle.',
    hours: 'Kuljettajan tarve tunteina',
    hoursHelp: `Suositeltu minimi ${PRODUCTS.personalDriver.minHours} tuntia.`,
    wait: 'Arvioitu odotusaika kohteessa (min)',
    waitHelp: `Jokaiseen luovutukseen sisältyy ${WAITING.includedMinutes} min. Sen ylittävä odotus veloitetaan ${WAITING.hourlyRate} €/h ${WAITING.unitMinutes} minuutin erissä.`,
    vehicle: 'Ajoneuvo',
    plate: 'Rekisteritunnus',
    makeModel: 'Merkki ja malli',
    year: 'Vuosimalli',
    gearbox: 'Vaihteisto',
    manual: 'Manuaali',
    automatic: 'Automaatti',
    fuel: 'Käyttövoima',
    fuelPetrol: 'Bensiini',
    fuelDiesel: 'Diesel',
    fuelHybrid: 'Hybridi',
    fuelEv: 'Sähkö',
    mileage: 'Mittarilukema (km, arvio)',
    controls: 'Erityiset hallintalaitteet, viat tai varoitusvalot',
    controlsHelp: 'Esimerkiksi käsihallintalaitteet, lukkopulttiavaimen sijainti, tiedossa oleva vika.',
    customer: 'Yhteystiedot',
    name: 'Nimi',
    phone: 'Puhelin',
    email: 'Sähköposti',
    customerType: 'Asiakastyyppi',
    person: 'Yksityishenkilö',
    company: 'Yritys',
    companyName: 'Yrityksen nimi',
    businessId: 'Y-tunnus',
    invoiceEmail: 'Laskutussähköposti',
    handover: 'Luovutus',
    pickupContact: 'Kuka luovuttaa avaimet noudossa?',
    deliveryContact: 'Kuka vastaanottaa auton?',
    contactMe: 'Minä itse',
    contactOther: 'Joku muu (nimi ja puhelin)',
    payment: 'Maksu',
    payMethod: 'DriveMe-palkkion maksutapa',
    payCard: 'Kortti',
    payMobile: 'MobilePay',
    payInvoice: 'Lasku (yritysasiakkaat)',
    payNote: 'Maksutavat vahvistetaan ennen julkaisua. Kolmannen osapuolen palvelut maksat aina suoraan palveluntarjoajalle.',
    acks: 'Vahvistukset',
    acksIntro: 'Nämä ovat varauksen ehtoja. Käymme ne läpi myös vahvistuksessa.',
    notes: 'Muuta huomioitavaa',
    quote: 'Ohjeellinen hinta',
    quoteNote: 'Ohjeellinen hinta sisältää arvonlisäveron. Vahvistamme kiinteän DriveMe-hinnan ennen kuljettajan lähtöä. Kolmannen osapuolen maksut eivät sisälly.',
    quoteFrom: 'alkaen',
    quoteManual: 'Kiinteä tarjous',
    quoteManualNote: 'Tälle työlle annamme kiinteän tarjouksen käsin - reitti tai palvelu ei sovi vakiohinnastoon.',
    submit: 'Lähetä pyyntö',
    submitting: 'Lähetetään…',
    errorTitle: 'Tarkista nämä kohdat',
    required: 'Tämä tieto tarvitaan.',
    badEmail: 'Tarkista sähköpostiosoite.',
    mustAccept: 'Vahvistus tarvitaan.',
    submitLocked: 'Ennen pyynnön lähettämistä:',
    requiredNote: 'Tähdellä * merkityt kentät ovat pakollisia. Muut voit täyttää, jos tiedät ne nyt.',
    doneTitle: 'Kiitos - pyyntö on vastaanotettu',
    doneBody: 'Pyyntö ei ole vielä vahvistus. Käymme tiedot läpi ja vahvistamme kuljettajan, ajan ja kiinteän hinnan. Vastaamme palveluaikana alle 15 minuutissa.',
    doneRef: 'Viitteesi',
    doneAgain: 'Lähetä uusi pyyntö',
    failed: 'Pyyntöä ei saatu lähetettyä. Yritä uudelleen tai soita numeroon ' + brand.phone + '.',
    gatedTitle: 'Tämä palvelu ei ole vielä varattavissa',
    gateContactTitle: 'Ota yhteyttä',
    gateContactBody: 'Kerromme mielellämme lisää ja ilmoitamme heti, kun palvelu on saatavilla.',
    lines: {
      base: 'Palvelun perushinta',
      driverTime: 'Kuljettajan aika',
      waiting: 'Odotus',
      night: 'Yölisä',
      weekend: 'Viikonloppulisä',
      publicHoliday: 'Arkipyhälisä',
      urgent: 'Kiirelisä',
    },
  },
  en: {
    path: 'What do you need?',
    pathDriver: 'I need a driver',
    pathDriverSub: 'A professional driver operates your own car.',
    pathCar: 'Take care of my car',
    pathCarSub: 'We collect the car, take it to the provider and return it.',
    service: 'Service',
    serviceLabel: 'Choose the service',
    shape: 'How should we run the job?',
    shapeOneWay: 'One way only',
    shapeOneWaySub: 'One collection and one delivery.',
    shapeReturn: 'Pickup and later return',
    shapeReturnSub: 'Two scheduled movements; the driver does not wait.',
    shapeWait: 'Wait and return',
    shapeWaitSub: `The driver waits up to ${WAITING.waitReturnIncludedMinutes} min and brings the car back.`,
    locations: 'Addresses',
    pickup: 'Collection address',
    destination: 'Destination or provider address',
    returnTo: 'Return address',
    returnSame: 'Return to the collection address',
    access: 'Access and parking instructions',
    accessHelp: 'Gate or door code, garage level, where the keys are.',
    timing: 'Timing',
    date: 'Date',
    window: 'Collection window',
    deliveryBy: 'Required delivery time',
    deliveryByHelp: 'Leave empty if the schedule is flexible.',
    appointment: 'Provider appointment',
    provider: 'Provider',
    providerHelp: 'Inspection station, workshop, tyre shop, wash or other destination you choose.',
    apptTime: 'Confirmed time',
    apptRef: 'Booking reference',
    apptContact: 'Contact or phone at the destination',
    keyMethod: 'Key handover at the destination',
    keyHand: 'To a named person',
    keyDrop: 'Key drop box',
    keyOther: 'Other, described in the notes',
    apptNotice: 'We do not send a driver before the appointment is confirmed. You book and pay the provider directly.',
    hours: 'Driver hours needed',
    hoursHelp: `Recommended minimum ${PRODUCTS.personalDriver.minHours} hours.`,
    wait: 'Expected waiting at the destination (min)',
    waitHelp: `Every handover includes ${WAITING.includedMinutes} min. Beyond that, waiting is ${WAITING.hourlyRate} €/h in ${WAITING.unitMinutes}-minute units.`,
    vehicle: 'Vehicle',
    plate: 'Registration',
    makeModel: 'Make and model',
    year: 'Year',
    gearbox: 'Transmission',
    manual: 'Manual',
    automatic: 'Automatic',
    fuel: 'Fuel type',
    fuelPetrol: 'Petrol',
    fuelDiesel: 'Diesel',
    fuelHybrid: 'Hybrid',
    fuelEv: 'Electric',
    mileage: 'Mileage (km, estimate)',
    controls: 'Special controls, faults or warning lights',
    controlsHelp: 'For example hand controls, wheel-lock key location, a known fault.',
    customer: 'Your details',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    customerType: 'Customer type',
    person: 'Private customer',
    company: 'Company',
    companyName: 'Company name',
    businessId: 'Business ID',
    invoiceEmail: 'Invoicing email',
    handover: 'Handover',
    pickupContact: 'Who hands over the keys at collection?',
    deliveryContact: 'Who receives the car?',
    contactMe: 'Me',
    contactOther: 'Someone else (name and phone)',
    payment: 'Payment',
    payMethod: 'How you pay the DriveMe fee',
    payCard: 'Card',
    payMobile: 'MobilePay',
    payInvoice: 'Invoice (business accounts)',
    payNote: 'Payment methods are confirmed before launch. Third-party services are always paid directly to the provider.',
    acks: 'Confirmations',
    acksIntro: 'These are booking conditions. We repeat them in the confirmation.',
    notes: 'Anything else we should know',
    quote: 'Indicative price',
    quoteNote: 'The indicative price includes VAT. We confirm a fixed DriveMe fee before the driver is sent. Third-party charges are not included.',
    quoteFrom: 'from',
    quoteManual: 'Fixed quote',
    quoteManualNote: 'This job gets a fixed quote by hand - the route or service does not fit the standard price list.',
    submit: 'Send request',
    submitting: 'Sending…',
    errorTitle: 'Please check these fields',
    required: 'This field is required.',
    badEmail: 'Check the email address.',
    mustAccept: 'This confirmation is required.',
    submitLocked: 'Before you can send the request:',
    requiredNote: 'Fields marked * are required. The rest are optional; fill them in if you know them now.',
    doneTitle: 'Thank you - your request has arrived',
    doneBody: 'A request is not yet a confirmation. We review the details and confirm the driver, the time and a fixed fee. We answer within 15 minutes during service hours.',
    doneRef: 'Your reference',
    doneAgain: 'Send another request',
    failed: 'We could not send that request. Please try again or call ' + brand.phone + '.',
    gatedTitle: 'This service is not bookable yet',
    gateContactTitle: 'Contact us',
    gateContactBody: 'Contact us for more details. We will let you know as soon as this service is available.',
    lines: {
      base: 'Service base price',
      driverTime: 'Driver time',
      waiting: 'Waiting',
      night: 'Night premium',
      weekend: 'Weekend premium',
      publicHoliday: 'Public holiday premium',
      urgent: 'Urgency premium',
    },
  },
};

/* The asterisk is driven by the input's own `required`, so the marker cannot
   drift away from what validation actually enforces. Conditionally required
   fields start unmarked and booking.js toggles them. */
const field = (id, label, input, help) => `
      <div class="field">
        <label for="${id}">${esc(label)}<span class="req" data-for="${id}"${/ required/.test(input) ? '' : ' hidden'}>*</span></label>
        ${input}
        ${help ? `<span class="help" id="${id}-help">${esc(help)}</span>` : ''}
        <span class="err" id="${id}-err" role="alert"></span>
      </div>`;

const text = (id, opts = {}) =>
  `<input type="${opts.type || 'text'}" id="${id}" name="${id}"${opts.required ? ' required' : ''}` +
  `${opts.autocomplete ? ` autocomplete="${opts.autocomplete}"` : ''}` +
  `${opts.inputmode ? ` inputmode="${opts.inputmode}"` : ''}` +
  `${opts.min !== undefined ? ` min="${opts.min}"` : ''}${opts.max !== undefined ? ` max="${opts.max}"` : ''}` +
  `${opts.step ? ` step="${opts.step}"` : ''}${opts.value ? ` value="${esc(opts.value)}"` : ''}` +
  `${opts.help ? ` aria-describedby="${id}-help"` : ''}>`;

const select = (id, options, opts = {}) =>
  `<select id="${id}" name="${id}"${opts.required ? ' required' : ''}>${options
    .map((o) => `<option value="${esc(o.v)}"${o.selected ? ' selected' : ''}>${esc(o.l)}</option>`)
    .join('')}</select>`;

const radio = (name, value, label, sub, checked) => `
        <label class="choice">
          <input type="radio" name="${name}" value="${esc(value)}"${checked ? ' checked' : ''}>
          <span>${esc(label)}${sub ? `<small>${esc(sub)}</small>` : ''}</span>
        </label>`;

export function bookingForm(locale) {
  const c = COPY[locale];
  const t = ui[locale];

  const conciergeOptions = services
    .filter((s) => s.category === 'concierge')
    .map((s) => ({ v: s.key, l: s[locale].nav }));
  const driverOptions = services
    .filter((s) => s.category === 'driver')
    .map((s) => ({ v: s.key, l: s[locale].nav }));
  const businessOption = { v: 'business', l: byKey.business[locale].nav };

  const serviceMeta = Object.fromEntries(services.map((s) => [s.key, {
    category: s.category,
    appointment: s.appointment,
    gated: isGated(s),
    product: SERVICE_PRODUCTS[s.key].default,
    allowed: SERVICE_PRODUCTS[s.key].allowed,
    label: s[locale].nav,
  }]));

  const config = {
    locale,
    products: PRODUCTS,
    waiting: WAITING,
    premiums: PREMIUMS,
    services: serviceMeta,
    copy: {
      required: c.required, badEmail: c.badEmail, mustAccept: c.mustAccept,
      submitLocked: c.submitLocked,
      errorTitle: c.errorTitle, submitting: c.submitting, submit: c.submit,
      failed: c.failed, quoteFrom: c.quoteFrom, quoteManual: c.quoteManual,
      quoteManualNote: c.quoteManualNote, quoteNote: c.quoteNote, lines: c.lines,
      gatedTitle: c.gatedTitle,
    },
    endpoint: '/api/bookings',
  };

  return `
<section class="sec">
  <div class="wrap">
    <form class="form-shell" id="request-form" novalidate>
      <div>
        <div class="summary-box" id="error-summary" hidden tabindex="-1">
          <h2>${esc(c.errorTitle)}</h2>
          <ul></ul>
        </div>

        <p class="hint form-required-note">${esc(c.requiredNote)}</p>

        <fieldset class="fieldset">
          <legend>${esc(c.path)}</legend>
          <div class="choice-grid" role="radiogroup" aria-label="${esc(c.path)}">
            ${radio('path', 'car', c.pathCar, c.pathCarSub, true)}
            ${radio('path', 'driver', c.pathDriver, c.pathDriverSub, false)}
          </div>
          <div id="service-field">
            ${field('service', c.serviceLabel, select('service', [...conciergeOptions, businessOption], { required: true }))}
          </div>
          <div id="gate-warning" hidden></div>
        </fieldset>

        <fieldset class="fieldset" id="shape-set">
          <legend>${esc(c.shape)}</legend>
          <div class="choice-grid" role="radiogroup" aria-label="${esc(c.shape)}">
            ${radio('shape', 'pickupReturn', c.shapeReturn, c.shapeReturnSub, true)}
            ${radio('shape', 'oneWay', c.shapeOneWay, c.shapeOneWaySub, false)}
            ${radio('shape', 'waitReturn', c.shapeWait, c.shapeWaitSub, false)}
          </div>
        </fieldset>

        <fieldset class="fieldset">
          <legend>${esc(c.locations)}</legend>
          ${field('pickup_location', c.pickup, text('pickup_location', { required: true, autocomplete: 'street-address' }))}
          <div id="destination-field">
            ${field('destination', c.destination, text('destination'))}
          </div>
          <div id="return-field">
            <label class="form-check" style="margin-top:14px">
              <input type="checkbox" id="return_same" name="return_same" checked>
              <span>${esc(c.returnSame)}</span>
            </label>
            <div id="return-address" hidden>
              ${field('return_location', c.returnTo, text('return_location', { autocomplete: 'street-address' }))}
            </div>
          </div>
          ${field('access_notes', c.access, `<textarea id="access_notes" name="access_notes" aria-describedby="access_notes-help"></textarea>`, c.accessHelp)}
        </fieldset>

        <fieldset class="fieldset">
          <legend>${esc(c.timing)}</legend>
          <div class="grid-2">
            ${field('date', c.date, text('date', { type: 'date', required: true }))}
            ${field('window', c.window, select('window', [
    { v: '08-10', l: '08–10' }, { v: '10-12', l: '10–12' }, { v: '12-14', l: '12–14' },
    { v: '14-16', l: '14–16' }, { v: '16-18', l: '16–18' }, { v: '18-20', l: '18–20' },
  ], { required: true }))}
          </div>
          <div class="grid-2">
            ${field('delivery_by', c.deliveryBy, text('delivery_by', { type: 'time' }), c.deliveryByHelp)}
            <div id="wait-field">
              ${field('wait_minutes', c.wait, text('wait_minutes', { type: 'number', min: 0, max: 480, step: '15' }), c.waitHelp)}
            </div>
            <div id="hours-field" hidden>
              ${field('hours', c.hours, text('hours', { type: 'number', min: 1, max: 12, step: '0.5', value: String(PRODUCTS.personalDriver.minHours) }), c.hoursHelp)}
            </div>
          </div>
        </fieldset>

        <fieldset class="fieldset" id="appointment-set">
          <legend>${esc(c.appointment)}</legend>
          <p class="hint">${esc(c.apptNotice)}</p>
          <div class="grid-2">
            ${field('provider', c.provider, text('provider', { help: true }), c.providerHelp)}
            ${field('appointment_time', c.apptTime, text('appointment_time', { type: 'time' }))}
          </div>
          <div class="grid-2">
            ${field('appointment_ref', c.apptRef, text('appointment_ref'))}
            ${field('appointment_contact', c.apptContact, text('appointment_contact'))}
          </div>
          ${field('key_method', c.keyMethod, select('key_method', [
    { v: 'named', l: c.keyHand }, { v: 'drop', l: c.keyDrop }, { v: 'other', l: c.keyOther },
  ]))}
        </fieldset>

        <fieldset class="fieldset">
          <legend>${esc(c.vehicle)}</legend>
          <div class="grid-2">
            ${field('plate', c.plate, text('plate', { required: true }))}
            ${field('vehicle_model', c.makeModel, text('vehicle_model'))}
          </div>
          <div class="grid-2">
            ${field('vehicle_year', c.year, text('vehicle_year', { type: 'number', min: 1950, max: 2030 }))}
            ${field('gearbox', c.gearbox, select('gearbox', [
    { v: 'automatic', l: c.automatic }, { v: 'manual', l: c.manual },
  ]))}
            ${field('fuel', c.fuel, select('fuel', [
    { v: 'petrol', l: c.fuelPetrol }, { v: 'diesel', l: c.fuelDiesel },
    { v: 'hybrid', l: c.fuelHybrid }, { v: 'ev', l: c.fuelEv },
  ]))}
            ${field('mileage', c.mileage, text('mileage', { type: 'number', min: 0, max: 2000000 }))}
          </div>
          ${field('vehicle_notes', c.controls, `<textarea id="vehicle_notes" name="vehicle_notes" aria-describedby="vehicle_notes-help"></textarea>`, c.controlsHelp)}
        </fieldset>

        <fieldset class="fieldset">
          <legend>${esc(c.customer)}</legend>
          <div class="grid-2">
            ${field('customer_name', c.name, text('customer_name', { required: true, autocomplete: 'name' }))}
            ${field('customer_phone', c.phone, text('customer_phone', { type: 'tel', required: true, autocomplete: 'tel' }))}
            ${field('customer_email', c.email, text('customer_email', { type: 'email', required: true, autocomplete: 'email' }))}
            ${field('customer_type', c.customerType, select('customer_type', [
    { v: 'person', l: c.person }, { v: 'company', l: c.company },
  ]))}
          </div>
          <div id="company-fields" hidden>
            <div class="grid-2">
              ${field('company_name', c.companyName, text('company_name', { autocomplete: 'organization' }))}
              ${field('business_id', c.businessId, text('business_id'))}
              ${field('invoice_email', c.invoiceEmail, text('invoice_email', { type: 'email' }))}
            </div>
          </div>
          <div class="grid-2">
            ${field('pickup_contact', c.pickupContact, select('pickup_contact', [
    { v: 'me', l: c.contactMe }, { v: 'other', l: c.contactOther },
  ]))}
            ${field('delivery_contact', c.deliveryContact, select('delivery_contact', [
    { v: 'me', l: c.contactMe }, { v: 'other', l: c.contactOther },
  ]))}
          </div>
          ${field('contact_notes', c.handover, text('contact_notes'))}
        </fieldset>

        <fieldset class="fieldset">
          <legend>${esc(c.payment)}</legend>
          ${field('payment_method', c.payMethod, select('payment_method', [
    { v: 'card', l: c.payCard }, { v: 'mobilepay', l: c.payMobile }, { v: 'invoice', l: c.payInvoice },
  ]))}
          <p class="hint">${esc(c.payNote)}</p>
        </fieldset>

        <fieldset class="fieldset">
          <legend>${esc(c.acks)}</legend>
          <p class="hint">${esc(c.acksIntro)} <a href="${url('terms', locale)}">${esc(locale === 'fi' ? 'Palveluehdot' : 'Terms of service')}</a></p>
          <div class="checks">
            ${acknowledgements[locale].map((a, i) => `
            <label class="form-check">
              <input type="checkbox" name="ack" id="ack-${i}" data-ack="${i}" required>
              <span>${esc(a)}</span>
            </label>`).join('')}
          </div>
          <span class="err" id="ack-err" role="alert"></span>
        </fieldset>

        <fieldset class="fieldset">
          <legend>${esc(c.notes)}</legend>
          <div class="field">
            <label for="notes" class="sr-only">${esc(c.notes)}</label>
            <textarea id="notes" name="notes"></textarea>
          </div>
        </fieldset>
      </div>

      <aside class="quote" aria-live="polite">
        <h2 id="quote-title">${esc(c.quote)}</h2>
        <p class="amount" id="quote-amount"><small>${esc(c.quoteFrom)}</small>—</p>
        <ul class="quote-lines" id="quote-lines"></ul>
        <p class="note" id="quote-note">${esc(c.quoteNote)}</p>
        <button class="btn btn-primary" type="submit" id="submit-btn">${esc(c.submit)}</button>
        <!-- The confirmations sit far above this sticky panel, so a disabled
             button on its own would read as broken rather than as waiting. -->
        <p class="note" id="submit-hint">${esc(c.submitLocked)}</p>
        <p class="note" id="quote-call"><a href="tel:${brand.phoneHref}">${esc(t.callUs)} ${esc(brand.phone)}</a></p>

        <!-- Replaces the whole quote panel for a gated service: there is no
             price to indicate, so the panel becomes the way to reach us.
             Shown/hidden by the .is-gated class on the form, not by [hidden]. -->
        <div id="gate-contact">
          <h2>${esc(c.gateContactTitle)}</h2>
          <p class="note">${esc(c.gateContactBody)}</p>
          <p class="gate-contact-line"><a href="mailto:${brand.email}">${esc(brand.email)}</a></p>
          <p class="gate-contact-line"><a href="tel:${brand.phoneHref}">${esc(brand.phone)}</a></p>
        </div>
      </aside>
    </form>

    <div class="done" id="done-panel" hidden tabindex="-1">
      <h2>${esc(c.doneTitle)}</h2>
      <p>${esc(c.doneBody)}</p>
      <p class="ref" id="done-ref"></p>
      <p style="margin-top:18px"><button class="btn btn-ghost" type="button" id="again-btn">${esc(c.doneAgain)}</button></p>
    </div>
  </div>
</section>

<script id="booking-config" type="application/json">${JSON.stringify(config)}</script>`;
}

export function bookingScript() {
  return '<script src="/assets/booking.js?v=2" defer></script>';
}

export { COPY as bookingCopy };

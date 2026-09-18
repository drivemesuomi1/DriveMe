/**
 * The price request, rebuilt for "DriveMe: A Driver for Your Car" (Driver
 * First Growth Plan, 13 Sep 2026).
 *
 * The plan's P1 item is a two-stage inquiry a customer can send from a phone
 * in under a minute. The first stage asks only what is needed to call back
 * with a price: what the car needs, where from, where to, when, and who to
 * call. Registration, key handover, invoicing and the booking statements are
 * collected on the callback and at confirmation; the optional details panel
 * lets a customer who has them to hand add them now.
 *
 * Three things can be asked for: a general address-to-address move, a run to
 * an inspection, workshop, tyre shop, wash or dealer - both driven with nobody
 * in the car - or a journey, where a driver takes the customer and their
 * passengers in the customer's own car and the price is quoted per route.
 *
 * Pricing shown here is INDICATIVE and says so. The same constants that
 * produce it come from api/_lib/pricing.js, which the server re-uses to
 * recompute the product and the figure before storing them.
 */

import { services, byKey } from '../content/services.mjs';
import { brand, ui } from '../content/site.mjs';
import { PRODUCTS, WAITING, PREMIUMS, SERVICE_PRODUCTS, servicesOfType } from '../api/_lib/pricing.js';
import { esc } from './layout.mjs';
import { url, serviceUrl } from './routes.mjs';
import { isGated } from './blocks.mjs';

const WINDOWS = ['08-10', '10-12', '12-14', '14-16', '16-18', '18-20'];

const COPY = {
  fi: {
    typeLegend: 'Mitä autollesi tehdään?',
    typeMove: 'Aja autoni toiseen osoitteeseen',
    typeMoveSub: 'Kuljettaja vie auton sovittuun osoitteeseen, tarvittaessa myös takaisin.',
    typeAppt: 'Vie autoni palveluun',
    typeApptSub: 'Katsastus, huolto, renkaanvaihto, pesu tai autoliike. Palautus sovitusti.',
    typeJourney: 'Kuljettaja matkallesi',
    typeJourneySub: 'Kuljettaja ajaa sinut ja matkaseurueesi omalla autollasi.',
    journeyLegend: 'Minne matka suuntautuu?',
    journeyDestination: 'Määränpää',
    journeyDestinationHelp: 'Esim. Helsinki-Vantaan lentoasema, Tampere tai mökin osoite.',
    passengers: 'Matkustajien määrä',
    passengersHelp: 'Kuljettaja ei vie paikkaa: kerro, montako teitä matkustaa.',
    journeyReturn: 'Tarvitsetko myös paluumatkan?',
    businessNote: 'Yritysasiakas: kerro ensimmäinen siirto tässä. Sovimme sopimushinnan ja laskutuksen, kun soitamme.',
    moveLegend: 'Minne auto menee?',
    destination: 'Kohdeosoite',
    returnLegend: 'Tarvitaanko paluu?',
    returnNo: 'Ei, vain yhteen suuntaan',
    returnYes: 'Kyllä, auto tuodaan takaisin myöhemmin',
    apptLegend: 'Palvelu ja palveluntarjoaja',
    service: 'Mihin palveluun auto viedään?',
    serviceHelp: 'Muu kohde? Valitse yllä "Aja autoni toiseen osoitteeseen".',
    serviceNames: {
      inspection: 'Katsastus',
      workshop: 'Huolto tai korjaamo',
      tyre: 'Renkaanvaihto tai rengashotelli',
      wash: 'Pesu tai detailing',
      glass: 'Lasi, kori tai takaisinkutsu',
      dealer: 'Autoliike, leasing tai vuokraamo',
    },
    provider: 'Palveluntarjoaja ja osoite',
    providerHelp: 'Esim. katsastusasema tai korjaamo ja sen osoite. Ajan varaat ja palvelun maksat itse.',
    apptTime: 'Varattu aika, jos tiedossa',
    shape: 'Miten auto palaa?',
    shapeWait: 'Kuljettaja odottaa ja tuo auton takaisin',
    shapeWaitSub: `Odotusta enintään ${WAITING.waitReturnIncludedMinutes} min.`,
    shapeReturn: 'Nouto ja palautus myöhemmin',
    shapeReturnSub: 'Tuomme auton takaisin, kun palvelu on valmis.',
    shapeOneWay: 'Vain vienti',
    shapeOneWaySub: 'Noudat auton itse tai sovimme paluun erikseen.',
    whereWhen: 'Nouto ja aika',
    pickup: 'Nouto-osoite tai postinumero',
    date: 'Toivottu päivä',
    window: 'Toivottu aika',
    windowFlex: 'Joustava',
    contact: 'Kenelle soitamme?',
    name: 'Nimi',
    phone: 'Puhelin',
    email: 'Sähköposti',
    emailHelp: 'Vapaaehtoinen. Lähetämme kuittauksen, jos annat osoitteen.',
    auth: 'Olen auton omistaja tai haltija, tai minulla on lupa antaa auto DriveMen kuljettajan ajettavaksi.',
    authLabel: 'Lupa auton ajamiseen',
    more: 'Lisätiedot',
    moreSub: 'Vapaaehtoinen. Voit täyttää nämä nyt tai käydä ne läpi, kun soitamme.',
    plate: 'Rekisteritunnus',
    makeModel: 'Merkki ja malli',
    gearbox: 'Vaihteisto',
    manual: 'Manuaali',
    automatic: 'Automaatti',
    fuel: 'Käyttövoima',
    fuelPetrol: 'Bensiini',
    fuelDiesel: 'Diesel',
    fuelHybrid: 'Hybridi',
    fuelEv: 'Sähkö',
    unknown: 'Ei tiedossa',
    access: 'Kulku- ja pysäköintiohjeet',
    accessHelp: 'Portti- tai ovikoodi, parkkihallin taso, mistä avaimet löytyvät.',
    apptRef: 'Varausnumero',
    customerType: 'Asiakastyyppi',
    person: 'Yksityishenkilö',
    company: 'Yritys',
    companyName: 'Yrityksen nimi',
    businessId: 'Y-tunnus',
    invoiceEmail: 'Laskutussähköposti',
    notes: 'Muuta huomioitavaa',
    notesHelp: 'Esimerkiksi tiedossa olevat viat tai toive palautuksesta toiseen osoitteeseen.',
    laterNote: 'Rekisteritunnuksen, avainten luovutuksen, valtuutuksen, maksutavan ja varauksen ehdot käymme läpi ennen vahvistusta.',
    terms: 'Palveluehdot',
    quote: 'Ohjeellinen hinta',
    quoteNote: 'Hinta sisältää arvonlisäveron. Vahvistamme kiinteän DriveMe-hinnan ennen ajoa. Palveluntarjoajan maksut eivät sisälly.',
    quoteFrom: 'alkaen',
    quoteManual: 'Kiinteä tarjous',
    quoteManualNote: 'Tälle työlle annamme kiinteän tarjouksen käsin.',
    submit: 'Lähetä hintapyyntö',
    submitting: 'Lähetetään…',
    errorTitle: 'Tarkista nämä kohdat',
    required: 'Tämä tieto tarvitaan.',
    badEmail: 'Tarkista sähköpostiosoite tai jätä kenttä tyhjäksi.',
    badPhone: 'Tarkista puhelinnumero.',
    badRange: 'Arvo ei ole sallitulla välillä.',
    mustAccept: 'Tämä vahvistus tarvitaan.',
    submitLocked: 'Ennen pyynnön lähettämistä:',
    requiredNote: 'Tähdellä * merkityt kentät ovat pakollisia. Pyynnön lähettäminen vie alle minuutin.',
    doneTitle: 'Kiitos - hintapyyntö on vastaanotettu',
    doneBody: 'Tämä on pyyntö, ei vielä vahvistus. Soitamme sinulle, käymme auton tiedot läpi ja vahvistamme kuljettajan, ajan ja kiinteän hinnan.',
    doneCall: `Kiireellisessä asiassa soita ${brand.phone}.`,
    doneRef: 'Viitteesi',
    doneAgain: 'Lähetä uusi pyyntö',
    failed: 'Pyyntöä ei saatu lähetettyä. Yritä uudelleen tai soita numeroon ' + brand.phone + '.',
    gatedTitle: 'Tätä palvelua ei voi vielä varata',
    gatedBody: 'Tämä palvelu ei ole vielä varattavissa. Kerromme heti, kun se avautuu.',
    gateContactTitle: 'Ota yhteyttä',
    gateContactBody: 'Kerromme mielellämme lisää ja ilmoitamme heti, kun palvelu on saatavilla.',
    lines: {
      base: 'Palvelun perushinta',
      night: 'Yölisä',
      weekend: 'Viikonloppulisä',
      publicHoliday: 'Arkipyhälisä',
      urgent: 'Kiirelisä',
    },
  },
  en: {
    typeLegend: 'What does your car need?',
    typeMove: 'Drive my car to another address',
    typeMoveSub: 'A driver takes the car to the agreed address, and back again if needed.',
    typeAppt: 'Take my car to a service',
    typeApptSub: 'Inspection, workshop, tyre change, wash or dealer. Returned as agreed.',
    typeJourney: 'A driver for my journey',
    typeJourneySub: 'A driver takes you and your passengers in your own car.',
    journeyLegend: 'Where does the journey go?',
    journeyDestination: 'Destination',
    journeyDestinationHelp: 'For example Helsinki Airport, Tampere or the address of your cottage.',
    passengers: 'Number of passengers',
    passengersHelp: 'The driver does not take a seat: tell us how many of you are travelling.',
    journeyReturn: 'Do you also need a return journey?',
    businessNote: 'Company customer: tell us about the first move here. We agree contract pricing and invoicing when we call.',
    moveLegend: 'Where does the car go?',
    destination: 'Destination address',
    returnLegend: 'Does the car need to come back?',
    returnNo: 'No, one way only',
    returnYes: 'Yes, bring it back later',
    apptLegend: 'Service and provider',
    service: 'Which service is the car going to?',
    serviceHelp: 'Somewhere else? Choose "Drive my car to another address" above.',
    serviceNames: {
      inspection: 'Inspection',
      workshop: 'Workshop or maintenance',
      tyre: 'Tyre change or tyre hotel',
      wash: 'Wash or detailing',
      glass: 'Glass, body shop or recall',
      dealer: 'Dealer, lease or rental return',
    },
    provider: 'Provider and address',
    providerHelp: 'For example the inspection station or workshop and its address. You book and pay the provider yourself.',
    apptTime: 'Booked time, if known',
    shape: 'How does the car come back?',
    shapeWait: 'The driver waits and brings it back',
    shapeWaitSub: `Up to ${WAITING.waitReturnIncludedMinutes} min of waiting.`,
    shapeReturn: 'Pickup and later return',
    shapeReturnSub: 'We bring the car back once the service is done.',
    shapeOneWay: 'Delivery only',
    shapeOneWaySub: 'You collect it yourself, or we agree the return separately.',
    whereWhen: 'Collection and timing',
    pickup: 'Collection address or postcode',
    date: 'Preferred day',
    window: 'Preferred time',
    windowFlex: 'Flexible',
    contact: 'Who should we call?',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    emailHelp: 'Optional. We send a receipt if you give an address.',
    auth: 'I am the owner or keeper of the car, or I am authorised to hand it to a DriveMe driver.',
    authLabel: 'Permission to drive the car',
    more: 'More details',
    moreSub: 'Optional. Fill these in now, or go through them with us when we call.',
    plate: 'Registration',
    makeModel: 'Make and model',
    gearbox: 'Transmission',
    manual: 'Manual',
    automatic: 'Automatic',
    fuel: 'Fuel type',
    fuelPetrol: 'Petrol',
    fuelDiesel: 'Diesel',
    fuelHybrid: 'Hybrid',
    fuelEv: 'Electric',
    unknown: 'Not sure',
    access: 'Access and parking instructions',
    accessHelp: 'Gate or door code, garage level, where the keys are.',
    apptRef: 'Booking reference',
    customerType: 'Customer type',
    person: 'Private customer',
    company: 'Company',
    companyName: 'Company name',
    businessId: 'Business ID',
    invoiceEmail: 'Invoicing email',
    notes: 'Anything else we should know',
    notesHelp: 'For example known faults, or a return to a different address.',
    laterNote: 'We go through the registration, key handover, authorisation, payment method and booking terms before we confirm.',
    terms: 'Terms of service',
    quote: 'Indicative price',
    quoteNote: 'The price includes VAT. We confirm a fixed DriveMe fee before the drive. Provider charges are not included.',
    quoteFrom: 'from',
    quoteManual: 'Fixed quote',
    quoteManualNote: 'This job gets a fixed quote by hand.',
    submit: 'Send price request',
    submitting: 'Sending…',
    errorTitle: 'Please check these fields',
    required: 'This field is required.',
    badEmail: 'Check the email address, or leave it empty.',
    badPhone: 'Check the phone number.',
    badRange: 'That value is out of range.',
    mustAccept: 'This confirmation is required.',
    submitLocked: 'Before you can send the request:',
    requiredNote: 'Fields marked * are required. Sending the request takes under a minute.',
    doneTitle: 'Thank you - your price request has arrived',
    doneBody: 'This is a request, not yet a confirmation. We will call you, go through the vehicle details and confirm the driver, the time and a fixed price.',
    doneCall: `If it is urgent, call ${brand.phone}.`,
    doneRef: 'Your reference',
    doneAgain: 'Send another request',
    failed: 'We could not send that request. Please try again or call ' + brand.phone + '.',
    gatedTitle: 'This service cannot be booked yet',
    gatedBody: 'This service cannot be booked yet. We will tell you as soon as it opens.',
    gateContactTitle: 'Contact us',
    gateContactBody: 'Contact us for more details. We will let you know as soon as this service is available.',
    lines: {
      base: 'Service base price',
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

const textarea = (id, help) =>
  `<textarea id="${id}" name="${id}"${help ? ` aria-describedby="${id}-help"` : ''}></textarea>`;

const select = (id, options, opts = {}) =>
  `<select id="${id}" name="${id}"${opts.required ? ' required' : ''}${opts.help ? ` aria-describedby="${id}-help"` : ''}>${options
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

  // The selector lists appointment runs only - never a passenger service.
  const appointmentKeys = servicesOfType('appointment_run').filter((k) => !isGated(byKey[k]));
  const firstShape = SERVICE_PRODUCTS[appointmentKeys[0]].defaultShape;

  const serviceMeta = Object.fromEntries(services.map((s) => {
    const sp = SERVICE_PRODUCTS[s.key];
    return [s.key, {
      type: sp.type,
      gated: isGated(s),
      label: s[locale].nav,
      product: sp.default,
      shapes: sp.shapes,
      defaultShape: sp.defaultShape,
    }];
  }));

  const config = {
    locale,
    // Unsold passenger prices stay out of the page entirely.
    products: Object.fromEntries(Object.entries(PRODUCTS).filter(([, p]) => !p.hidden)),
    premiums: PREMIUMS,
    services: serviceMeta,
    copy: {
      required: c.required, badEmail: c.badEmail, badPhone: c.badPhone, badRange: c.badRange,
      mustAccept: c.mustAccept, authLabel: c.authLabel,
      submitLocked: c.submitLocked,
      errorTitle: c.errorTitle, submitting: c.submitting, submit: c.submit,
      failed: c.failed, quoteFrom: c.quoteFrom, quoteManual: c.quoteManual,
      quoteManualNote: c.quoteManualNote, quoteNote: c.quoteNote, lines: c.lines,
      gatedTitle: c.gatedTitle, gatedBody: c.gatedBody,
      journeyLegend: c.journeyLegend, moveLegend: c.moveLegend,
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
          <legend>${esc(c.typeLegend)}</legend>
          <div class="callout" id="business-note" hidden><p>${esc(c.businessNote)}</p></div>
          <div class="choice-grid" role="radiogroup" aria-label="${esc(c.typeLegend)}">
            ${radio('service_type', 'general_move', c.typeMove, c.typeMoveSub, true)}
            ${radio('service_type', 'appointment_run', c.typeAppt, c.typeApptSub, false)}
            ${radio('service_type', 'passenger_journey', c.typeJourney, c.typeJourneySub, false)}
          </div>
          <div id="gate-warning" hidden></div>
        </fieldset>

        <fieldset class="fieldset" id="move-set">
          <legend id="route-legend">${esc(c.moveLegend)}</legend>
          ${field('destination', c.destination, text('destination', { autocomplete: 'street-address', help: true }), c.journeyDestinationHelp)}
          <div id="passengers-field" hidden>
            ${field('passengers', c.passengers, text('passengers', { type: 'number', min: 1, max: 8, value: '1', help: true }), c.passengersHelp)}
          </div>
          <p class="field-label" id="return-label">${esc(c.returnLegend)}</p>
          <div class="choice-grid" role="radiogroup" aria-labelledby="return-label">
            ${radio('return_needed', 'no', c.returnNo, '', true)}
            ${radio('return_needed', 'yes', c.returnYes, '', false)}
          </div>
        </fieldset>

        <fieldset class="fieldset" id="appointment-set" hidden>
          <legend>${esc(c.apptLegend)}</legend>
          <div id="service-field">
            ${field('service', c.service, select('service', appointmentKeys.map((k) => ({ v: k, l: c.serviceNames[k] })), { help: true }), c.serviceHelp)}
          </div>
          <div class="grid-2">
            ${field('provider', c.provider, text('provider', { help: true }), c.providerHelp)}
            ${field('appointment_time', c.apptTime, text('appointment_time', { type: 'time' }))}
          </div>
          <p class="field-label" id="shape-label">${esc(c.shape)}</p>
          <div class="choice-grid" role="radiogroup" aria-labelledby="shape-label">
            ${radio('shape', 'waitReturn', c.shapeWait, c.shapeWaitSub, firstShape === 'waitReturn')}
            ${radio('shape', 'pickupReturn', c.shapeReturn, c.shapeReturnSub, firstShape === 'pickupReturn')}
            ${radio('shape', 'oneWay', c.shapeOneWay, c.shapeOneWaySub, firstShape === 'oneWay')}
          </div>
        </fieldset>

        <fieldset class="fieldset">
          <legend>${esc(c.whereWhen)}</legend>
          ${field('pickup_location', c.pickup, text('pickup_location', { required: true, autocomplete: 'street-address' }))}
          <div class="grid-2">
            ${field('date', c.date, text('date', { type: 'date', required: true }))}
            ${field('window', c.window, select('window', [
    { v: 'flex', l: c.windowFlex },
    ...WINDOWS.map((w) => ({ v: w, l: w.replace('-', '–') })),
  ], { required: true }))}
          </div>
        </fieldset>

        <fieldset class="fieldset">
          <legend>${esc(c.contact)}</legend>
          <div class="grid-2">
            ${field('customer_name', c.name, text('customer_name', { required: true, autocomplete: 'name' }))}
            ${field('customer_phone', c.phone, text('customer_phone', { type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel' }))}
          </div>
          ${field('customer_email', c.email, text('customer_email', { type: 'email', autocomplete: 'email', help: true }), c.emailHelp)}
          <label class="form-check auth-field">
            <input type="checkbox" name="ack" id="ack-0" required>
            <span>${esc(c.auth)}</span>
          </label>
          <span class="err" id="ack-err" role="alert"></span>
        </fieldset>

        <details class="more-details" id="more-details">
          <summary>${esc(c.more)}<small>${esc(c.moreSub)}</small></summary>
          <div class="more-details-body">
            <div class="grid-2">
              ${field('plate', c.plate, text('plate', { autocomplete: 'off' }))}
              ${field('vehicle_model', c.makeModel, text('vehicle_model'))}
              ${field('gearbox', c.gearbox, select('gearbox', [
    { v: '', l: c.unknown }, { v: 'automatic', l: c.automatic }, { v: 'manual', l: c.manual },
  ]))}
              ${field('fuel', c.fuel, select('fuel', [
    { v: '', l: c.unknown }, { v: 'petrol', l: c.fuelPetrol }, { v: 'diesel', l: c.fuelDiesel },
    { v: 'hybrid', l: c.fuelHybrid }, { v: 'ev', l: c.fuelEv },
  ]))}
            </div>
            ${field('access_notes', c.access, textarea('access_notes', true), c.accessHelp)}
            <div class="grid-2">
              ${field('appointment_ref', c.apptRef, text('appointment_ref'))}
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
            ${field('notes', c.notes, textarea('notes', true), c.notesHelp)}
            <p class="hint">${esc(c.laterNote)} <a href="${url('terms', locale)}">${esc(c.terms)}</a></p>
          </div>
        </details>
      </div>

      <aside class="quote" aria-live="polite">
        <h2 id="quote-title">${esc(c.quote)}</h2>
        <p class="amount" id="quote-amount"><small>${esc(c.quoteFrom)}</small>—</p>
        <ul class="quote-lines" id="quote-lines"></ul>
        <p class="note" id="quote-note">${esc(c.quoteNote)}</p>
        <button class="btn btn-primary" type="submit" id="submit-btn">${esc(c.submit)}</button>
        <!-- The confirmation sits far above this sticky panel, so a disabled
             button on its own would read as broken rather than as waiting. -->
        <p class="note" id="submit-hint">${esc(c.submitLocked)}</p>
        <p class="note" id="quote-call"><a href="tel:${brand.phoneHref}">${esc(t.callUs)} ${esc(brand.phone)}</a></p>

        <!-- Replaces the whole quote panel when a link asks for a service that
             is not sold: there is no price to indicate, so the panel becomes
             the way to reach us. Shown by the .is-gated class, not [hidden]. -->
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
      <p>${esc(c.doneCall)}</p>
      <p class="ref" id="done-ref"></p>
      <p style="margin-top:18px"><button class="btn btn-ghost" type="button" id="again-btn">${esc(c.doneAgain)}</button></p>
    </div>
  </div>
</section>

<script id="booking-config" type="application/json">${JSON.stringify(config)}</script>`;
}

export function bookingScript() {
  return '<script src="/assets/booking.js?v=3" defer></script>';
}

export { COPY as bookingCopy };

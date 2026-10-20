/**
 * The quote form — "Pyydä kiinteä tarjous" (client brief, 20 October 2026).
 *
 * One page, three numbered steps, and enough detail to write a fixed quote
 * without having to phone the customer first:
 *
 *   1  which service          one dropdown, and it decides step 2
 *   2  the job                collection, destination, when, which car, plus
 *                             the two or three questions that particular
 *                             service needs and no others
 *   3  who is asking          name, phone, email, and a company block that
 *                             opens when a company name is filled in
 *
 * The conditional fields are the point. A private driver booking is asked how
 * many are travelling; a transfer is asked for the registration and whether
 * the car is roadworthy; a service transfer is asked for the appointment and
 * whether the car comes back. Nobody is asked all three.
 *
 * What has not changed since the October brief: no price is calculated here,
 * the submit is an enquiry rather than a booking, and a successful send shows
 * the exact 24-hour confirmation the client specified - repeated in the
 * confirmation email by api/_lib/emails.js.
 *
 * Vehicle details are one field on purpose ("Ford Focus 2018, manuaali"):
 * three questions in one answer, which is both faster to fill in and closer
 * to how anyone describes their own car.
 */

import { services, byKey } from '../content/services.mjs';
import { brand, ui } from '../content/site.mjs';
import { SERVICE_ALIASES, SERVICE_PRODUCTS } from '../api/_lib/pricing.js';
import { esc } from './layout.mjs';
import { url } from './routes.mjs';
import { isGated } from './blocks.mjs';
import { form as svForm } from '../content/sv/form.mjs';

const COPY = {
  fi: {
    intro: 'Kerro reitti, ajankohta ja auto, niin lähetämme kiinteän hinnan. Lomakkeen täyttäminen vie noin minuutin.',

    step1: 'Palvelu',
    service: 'Mitä palvelua tarvitset?',
    servicePlaceholder: 'Valitse palvelu',
    serviceNames: {
      branchTransfer: 'Toimipisteiden välinen siirto',
      homeDelivery: 'Kotiintoimitus',
      purchasedCarPickup: 'Ostoauton nouto',
      workshopTransfer: 'Huoltosiirto (huolto, katsastus, renkaat, pesu)',
      relocation: 'Auton siirtopalvelu (yksittäinen siirto)',
      personalDriver: 'Oma kuljettaja',
      business: 'Yrityksille (sopimus tai useita siirtoja)',
      other: 'Muu palvelu',
    },

    step2: 'Siirron tiedot',
    step2Journey: 'Matkan tiedot',
    pickup: 'Noutopaikka',
    pickupHelp: 'Katuosoite tai postinumero.',
    destination: 'Kohdeosoite',
    destinationJourney: 'Määränpää',
    destinationHelp: 'Katuosoite, postinumero tai kohteen nimi.',
    date: 'Toivottu päivä',
    time: 'Toivottu kellonaika',
    timeHelp: 'Vapaaehtoinen. Jos aika on joustava, jätä tyhjäksi.',
    vehicle: 'Ajoneuvon tiedot',
    vehicleHelp: 'Merkki, malli, vuosimalli ja vaihteisto samaan kenttään. Esimerkiksi "Ford Focus 2018, manuaali".',

    passengers: 'Matkustajien määrä',
    passengersHelp: 'Kuljettaja ei vie paikkaa: kerro, montako teitä matkustaa.',
    stops: 'Välipysähdykset',
    stopsHelp: 'Vapaaehtoinen. Esimerkiksi nouto matkan varrelta tai odotus kohteessa.',

    plate: 'Rekisteritunnus',
    plateHelp: 'Vapaaehtoinen. Nopeuttaa tarjouksen tekemistä.',
    roadworthy: 'Auto on ajokuntoinen ja liikennekäytössä',
    roadworthyHelp: 'Emme aja autoa, joka ei ole ajokuntoinen tai on ajokiellossa. Kerro siitä alla, niin ohjaamme sinut hinauskumppanille.',

    apptTime: 'Varattu aika palveluntarjoajalla',
    apptTimeHelp: 'Vapaaehtoinen. Ajanvarauksen teet ja palvelun maksat itse.',
    returnLabel: 'Tarvitaanko paluukuljetus?',
    returnYes: 'Kyllä, auto tuodaan takaisin',
    returnNo: 'Ei, vain vienti',

    step3: 'Yhteystiedot',
    name: 'Nimi',
    phone: 'Puhelinnumero',
    email: 'Sähköposti',
    emailHelp: 'Lähetämme tarjouksen ja kuittauksen tähän osoitteeseen.',
    company: 'Yrityksen nimi',
    companyHelp: 'Vapaaehtoinen. Täytä, jos pyydät tarjousta yrityksen puolesta.',
    businessId: 'Y-tunnus',
    businessIdHelp: 'Vapaaehtoinen.',
    volume: 'Ajoneuvojen tai siirtojen määrä',
    volumeHelp: 'Esimerkiksi "3 autoa" tai "noin 10 siirtoa kuukaudessa".',
    recurrence: 'Kertaluonteinen vai toistuva?',
    recurrenceOnce: 'Kertaluonteinen siirto',
    recurrenceRecurring: 'Toistuvaa yhteistyötä',

    notes: 'Lisätiedot / mitä haluaisit meidän tekevän?',
    notesHelp: 'Vapaaehtoinen. Kerro vapaasti, jos jokin poikkeaa tavallisesta - avainten luovutus, portti- tai parkkihallikoodi, tiedossa oleva vika tai muu toive.',
    offerToggle: 'Minulla on etukoodi',
    offerCode: 'Etukoodi',
    offerCodeHelp: 'Vapaaehtoinen. Huomioimme kampanjakoodin tarjouksessa.',

    submit: 'Pyydä kiinteä tarjous',
    submitting: 'Lähetetään…',
    promise: 'Vastaamme tarjouksella 24 tunnin kuluessa.',
    trustLine: 'Maksuton tarjous · Ei sitoumusta · Läpinäkyvä hinnoittelu',
    requiredNote: 'Tähdellä * merkityt kentät ovat pakollisia.',
    enquiryNote: 'Tarjouspyyntö ei vahvista varausta. Siirto sovitaan vasta, kun hyväksyt tarjouksen.',

    errorTitle: 'Tarkista nämä kohdat',
    required: 'Tämä tieto tarvitaan.',
    badEmail: 'Tarkista sähköpostiosoite.',
    badPhone: 'Tarkista puhelinnumero.',
    badDate: 'Valitse tämä päivä tai myöhempi.',
    badRange: 'Arvo ei ole sallitulla välillä.',
    failed: 'Tarjouspyyntöä ei saatu lähetettyä. Yritä uudelleen tai soita numeroon ' + brand.phone + '.',

    sideTitle: 'Näin etenemme',
    sideSteps: [
      'Luemme tarjouspyyntösi ja lähetämme kiinteän hinnan 24 tunnin kuluessa.',
      'Jos jokin yksityiskohta puuttuu, kysymme sen ennen tarjousta.',
      'Siirto vahvistetaan vasta, kun hyväksyt tarjouksen. Silloin sovimme avainten luovutuksen ja laskutuksen.',
    ],
    sideCallTitle: 'Tarvitsetko vastauksen heti?',
    terms: 'Palveluehdot',
    termsNote: 'Varauksen ehdot ja valtuutus auton luovuttamiseen käydään läpi ennen vahvistusta.',

    doneTitle: 'Kiitos tarjouspyynnöstäsi!',
    doneBody: 'DriveMe-tiimi ottaa sinuun yhteyttä 24 tunnin kuluessa. Tarjouspyyntö ei vielä vahvista varausta.',
    doneRef: 'Viitteesi',
    doneAgain: 'Lähetä uusi tarjouspyyntö',
    gatedTitle: 'Tätä palvelua ei voi vielä varata',
    gatedBody: 'Tämä palvelu ei ole vielä varattavissa. Kerromme heti, kun se avautuu - jätä yhteystietosi puhelimitse tai sähköpostilla.',
  },

  en: {
    intro: 'Tell us the route, the timing and the car, and we send a fixed price. The form takes about a minute.',

    step1: 'Service',
    service: 'Which service do you need?',
    servicePlaceholder: 'Choose a service',
    serviceNames: {
      branchTransfer: 'Branch-to-branch transfer',
      homeDelivery: 'Delivery to the customer',
      purchasedCarPickup: 'Purchased vehicle collection',
      workshopTransfer: 'Service transfer (workshop, inspection, tyres, wash)',
      relocation: 'Vehicle relocation (a single transfer)',
      personalDriver: 'Personal driver',
      business: 'For companies (agreement or several transfers)',
      other: 'Something else',
    },

    step2: 'Transfer details',
    step2Journey: 'Journey details',
    pickup: 'Collection address',
    pickupHelp: 'Street address or postcode.',
    destination: 'Destination address',
    destinationJourney: 'Destination',
    destinationHelp: 'Street address, postcode or the name of the place.',
    date: 'Preferred date',
    time: 'Preferred time',
    timeHelp: 'Optional. Leave empty if the time is flexible.',
    vehicle: 'Vehicle details',
    vehicleHelp: 'Make, model, year and transmission in one field. For example "Ford Focus 2018, manual".',

    passengers: 'Number of passengers',
    passengersHelp: 'The driver does not take a seat: tell us how many of you are travelling.',
    stops: 'Additional stops',
    stopsHelp: 'Optional. For example a pickup on the way or waiting at the destination.',

    plate: 'Registration number',
    plateHelp: 'Optional. It makes the quote quicker to prepare.',
    roadworthy: 'The car is roadworthy and registered for road use',
    roadworthyHelp: 'We do not drive a car that is not roadworthy or is under a driving ban. Tell us below and we will point you to a towing partner.',

    apptTime: 'Booked time at the provider',
    apptTimeHelp: 'Optional. You book the appointment and pay the provider yourself.',
    returnLabel: 'Is a return trip needed?',
    returnYes: 'Yes, bring the car back',
    returnNo: 'No, delivery only',

    step3: 'Contact details',
    name: 'Name',
    phone: 'Phone number',
    email: 'Email',
    emailHelp: 'We send the quote and a receipt to this address.',
    company: 'Company name',
    companyHelp: 'Optional. Fill this in if you are asking on behalf of a company.',
    businessId: 'Business ID',
    businessIdHelp: 'Optional.',
    volume: 'Number of vehicles or assignments',
    volumeHelp: 'For example "3 cars" or "around 10 transfers a month".',
    recurrence: 'One-time or recurring?',
    recurrenceOnce: 'A one-time transfer',
    recurrenceRecurring: 'Recurring work',

    notes: 'Anything else / what would you like us to do?',
    notesHelp: 'Optional. Tell us if anything is out of the ordinary - key handover, a gate or garage code, a known fault or any other wish.',
    offerToggle: 'I have an offer code',
    offerCode: 'Offer code',
    offerCodeHelp: 'Optional. We apply a campaign code to the quote.',

    submit: 'Get my fixed-price quote',
    submitting: 'Sending…',
    promise: 'We will get back to you with an offer within 24 hours.',
    trustLine: 'Free quotation · No obligation · Transparent pricing',
    requiredNote: 'Fields marked * are required.',
    enquiryNote: 'An enquiry does not confirm a booking. The transfer is agreed once you accept the quote.',

    errorTitle: 'Please check these fields',
    required: 'This field is required.',
    badEmail: 'Please check the email address.',
    badPhone: 'Please check the phone number.',
    badDate: 'Choose today or a later date.',
    badRange: 'That value is out of range.',
    failed: 'We could not send your enquiry. Please try again or call ' + brand.phone + '.',

    sideTitle: 'How we proceed',
    sideSteps: [
      'We read your enquiry and send a fixed price within 24 hours.',
      'If a detail is missing, we ask for it before quoting.',
      'The transfer is confirmed once you accept the quote. That is when we agree the key handover and the invoicing.',
    ],
    sideCallTitle: 'Need an answer right away?',
    terms: 'Terms of service',
    termsNote: 'The booking terms and the authorisation to hand the car over are gone through before we confirm.',

    doneTitle: 'Thank you for your enquiry!',
    doneBody: 'The DriveMe team will contact you within 24 hours. An enquiry does not confirm a booking yet.',
    doneRef: 'Your reference',
    doneAgain: 'Send another enquiry',
    gatedTitle: 'This service cannot be booked yet',
    gatedBody: 'This service is not bookable yet. We will tell you as soon as it opens - leave your details by phone or email.',
  },
};

COPY.sv = svForm;

/* The asterisk follows the input's own `required`, so the marker cannot drift
   away from what validation actually enforces. A field that only some services
   require starts unmarked and booking.js toggles it. */
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
  `${opts.value !== undefined ? ` value="${esc(opts.value)}"` : ''}` +
  `${opts.maxlength ? ` maxlength="${opts.maxlength}"` : ''}` +
  `${opts.placeholder ? ` placeholder="${esc(opts.placeholder)}"` : ''}` +
  `${opts.autocapitalize ? ` autocapitalize="${opts.autocapitalize}"` : ''}` +
  `${opts.help ? ` aria-describedby="${id}-help"` : ''}>`;

const textarea = (id, help, rows) =>
  `<textarea id="${id}" name="${id}" rows="${rows || 3}"${help ? ` aria-describedby="${id}-help"` : ''}></textarea>`;

const select = (id, options, opts = {}) =>
  `<select id="${id}" name="${id}"${opts.required ? ' required' : ''}${opts.help ? ` aria-describedby="${id}-help"` : ''}>${options
    .map((o) => `<option value="${esc(o.v)}"${o.selected ? ' selected' : ''}>${esc(o.l)}</option>`)
    .join('')}</select>`;

const step = (n, title, body) => `
        <fieldset class="enq-step">
          <legend id="step-${n}-legend"><span class="enq-num" aria-hidden="true">${n}</span>${esc(title)}</legend>
          ${body}
        </fieldset>`;

export function bookingForm(locale) {
  const c = COPY[locale];
  const t = ui[locale];

  /* Every service that is sold, in catalogue order, plus "Muu palvelu" for an
     enquiry that fits none of them. A gated service is never offered here -
     the API refuses it too - so the list cannot promise what we cannot do. */
  const keys = services.filter((s) => !isGated(s)).map((s) => s.key);
  const label = (k) => c.serviceNames[k] || byKey[k][locale].nav;
  const options = [{ v: '', l: c.servicePlaceholder }]
    .concat(keys.map((k) => ({ v: k, l: label(k) })))
    .concat([{ v: 'other', l: c.serviceNames.other }]);

  const config = {
    locale,
    /* What each service is, so the page can ask the two or three extra
       questions that service needs: a journey asks about passengers, a move
       about the car itself, a service transfer about the appointment. */
    services: Object.fromEntries(services.map((s) => [s.key, {
      gated: isGated(s),
      type: SERVICE_PRODUCTS[s.key].type,
    }])),
    // Retired service keys and what answers for them now, so a link made
    // before the catalogue was consolidated still opens the right service.
    aliases: SERVICE_ALIASES,
    copy: {
      required: c.required, badEmail: c.badEmail, badPhone: c.badPhone,
      badDate: c.badDate, badRange: c.badRange,
      errorTitle: c.errorTitle, submitting: c.submitting, submit: c.submit,
      failed: c.failed, doneRef: c.doneRef,
      gatedTitle: c.gatedTitle, gatedBody: c.gatedBody,
      step2: c.step2, step2Journey: c.step2Journey,
      destination: c.destination, destinationJourney: c.destinationJourney,
    },
    endpoint: '/api/bookings',
  };

  const journey = `
            <div class="grid-2">
              ${field('passengers', c.passengers, text('passengers', { type: 'number', min: 1, max: 8, value: '1', help: true }), c.passengersHelp)}
              ${field('extra_stops', c.stops, text('extra_stops', { help: true }), c.stopsHelp)}
            </div>`;

  const move = `
            <div class="grid-2">
              ${field('vehicle_plate', c.plate, text('vehicle_plate', { autocapitalize: 'characters', maxlength: 20, help: true }), c.plateHelp)}
            </div>
            <label class="form-check" for="roadworthy">
              <input type="checkbox" name="roadworthy" id="roadworthy" checked>
              <span>${esc(c.roadworthy)}</span>
            </label>
            <span class="help help-indent" id="roadworthy-help">${esc(c.roadworthyHelp)}</span>`;

  const appointment = `
            <div class="grid-2">
              ${field('appointment_time', c.apptTime, text('appointment_time', { type: 'time', help: true }), c.apptTimeHelp)}
              ${field('return_needed', c.returnLabel, select('return_needed', [
    { v: 'yes', l: c.returnYes, selected: true },
    { v: 'no', l: c.returnNo },
  ]))}
            </div>`;

  const company = `
            <div id="business-fields" hidden>
              <div class="grid-2">
                ${field('business_id', c.businessId, text('business_id', { help: true, maxlength: 20 }), c.businessIdHelp)}
                ${field('volume', c.volume, text('volume', { help: true, maxlength: 100 }), c.volumeHelp)}
              </div>
              ${field('recurrence', c.recurrence, select('recurrence', [
    { v: 'once', l: c.recurrenceOnce, selected: true },
    { v: 'recurring', l: c.recurrenceRecurring },
  ]))}
            </div>`;

  return `
<section class="sec">
  <div class="wrap">
    <div class="enquiry-shell" id="enquiry-shell">
      <form class="enquiry-card" id="request-form" novalidate>
        <p class="enquiry-intro">${esc(c.intro)}</p>

        <div class="summary-box" id="error-summary" hidden tabindex="-1">
          <h2>${esc(c.errorTitle)}</h2>
          <ul></ul>
        </div>
        <div id="gate-warning" hidden></div>

        <div class="enquiry-fields">
          ${step(1, c.step1, field('service', c.service, select('service', options, { required: true })))}

          ${step(2, c.step2, `
            <div class="grid-2">
              ${field('pickup_location', c.pickup, text('pickup_location', { required: true, autocomplete: 'street-address', help: true }), c.pickupHelp)}
              ${field('destination', c.destination, text('destination', { required: true, autocomplete: 'street-address', help: true }), c.destinationHelp)}
            </div>
            <div class="grid-2">
              ${field('date', c.date, text('date', { type: 'date', required: true }))}
              ${field('time', c.time, text('time', { type: 'time', help: true }), c.timeHelp)}
            </div>
            ${field('vehicle_details', c.vehicle, text('vehicle_details', { required: true, help: true, maxlength: 120 }), c.vehicleHelp)}

            <!-- One service's questions at a time: booking.js shows the group
                 that belongs to the chosen service and hides the rest, so
                 nobody is asked about passengers and a registration both. -->
            <div id="journey-fields" hidden>${journey}</div>
            <div id="move-fields" hidden>${move}</div>
            <div id="appointment-fields" hidden>${appointment}</div>`)}

          ${step(3, c.step3, `
            ${field('customer_name', c.name, text('customer_name', { required: true, autocomplete: 'name' }))}
            <div class="grid-2">
              ${field('customer_phone', c.phone, text('customer_phone', { type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel' }))}
              ${field('customer_email', c.email, text('customer_email', { type: 'email', required: true, autocomplete: 'email', help: true }), c.emailHelp)}
            </div>
            ${field('company_name', c.company, text('company_name', { autocomplete: 'organization', help: true }), c.companyHelp)}
            ${company}
            ${field('notes', c.notes, textarea('notes', true, 3), c.notesHelp)}

            <!-- Progressive disclosure: the campaign code is real but rare, so
                 it is one line until someone needs it. Arriving from the offer
                 page opens it with the code already in place. -->
            <div class="offer-reveal">
              <button class="link-btn" type="button" id="offer-toggle" aria-expanded="false" aria-controls="offer-field">
                <span class="plus" aria-hidden="true">+</span> ${esc(c.offerToggle)}
              </button>
              <div id="offer-field" hidden>
                ${field('offer_code', c.offerCode, text('offer_code', { help: true, autocapitalize: 'characters', maxlength: 20 }), c.offerCodeHelp)}
              </div>
            </div>`)}
        </div>

        <p class="hint form-required-note">${esc(c.requiredNote)}</p>

        <div class="enquiry-send">
          <button class="btn btn-primary btn-lg" type="submit" id="submit-btn">${esc(c.submit)} <span class="arrow" aria-hidden="true">→</span></button>
          <p class="enquiry-promise">${esc(c.promise)}</p>
          <p class="enquiry-trust">${esc(c.trustLine)}</p>
          <p class="enquiry-note" id="submit-hint">${esc(c.enquiryNote)}</p>
        </div>
      </form>

      <!-- No price panel. What the visitor needs here is what happens after
           they press send, and a way to reach a person if it is urgent. -->
      <aside class="enquiry-side">
        <h2>${esc(c.sideTitle)}</h2>
        <ol class="enquiry-steps">
          ${c.sideSteps.map((s) => `<li>${esc(s)}</li>`).join('')}
        </ol>
        <div class="enquiry-contact">
          <h3>${esc(c.sideCallTitle)}</h3>
          <p><a href="tel:${brand.phoneHref}">${esc(brand.phone)}</a></p>
          <p><a href="mailto:${brand.email}">${esc(brand.email)}</a></p>
        </div>
        <p class="enquiry-terms">${esc(c.termsNote)} <a href="${url('terms', locale)}">${esc(c.terms)}</a></p>
      </aside>
    </div>

    <div class="done" id="done-panel" hidden tabindex="-1">
      <h2>${esc(c.doneTitle)}</h2>
      <p>${esc(c.doneBody)}</p>
      <p class="ref" id="done-ref"></p>
      <p class="done-call"><a href="tel:${brand.phoneHref}">${esc(t.callUs)} ${esc(brand.phone)}</a></p>
      <p style="margin-top:18px"><button class="btn btn-ghost" type="button" id="again-btn">${esc(c.doneAgain)}</button></p>
    </div>

    <script id="booking-config" type="application/json">${JSON.stringify(config)}</script>
  </div>
</section>`;
}

export function bookingScript() {
  return '<script src="/assets/booking.js?v=5" defer></script>';
}

export { COPY as bookingCopy };

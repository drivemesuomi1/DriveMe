/**
 * The enquiry form — "Pyydä tarjous" (client feedback, 10 October 2026).
 *
 * One compact form: name, phone, email, which service, an optional company
 * name and an optional free-text field. Nothing else. The exact addresses,
 * the vehicle details, the access instructions and the booking declarations
 * are collected when we call back, which is also what the page now promises.
 *
 * Two things are deliberately gone:
 *
 *  · the price. No calculator, no sidebar, no starting figure. A quote is
 *    written by a person who has read the enquiry, so the page cannot show
 *    "89 €" for a car that has to reach Rovaniemi.
 *  · the long first stage. Addresses, dates, time windows, key handover,
 *    registration and the authorisation statement were all asked before
 *    anyone had even said what the job was worth.
 *
 * What the visitor gets instead is a side panel saying what happens next, and
 * after a successful send the exact confirmation the client asked for: a
 * thank-you, the 24-hour promise, and the reminder that an enquiry is not yet
 * a booking. The same three sentences are in the confirmation email
 * (api/_lib/emails.js), in all three languages.
 */

import { services, byKey } from '../content/services.mjs';
import { brand, ui } from '../content/site.mjs';
import { SERVICE_ALIASES } from '../api/_lib/pricing.js';
import { esc } from './layout.mjs';
import { url } from './routes.mjs';
import { isGated } from './blocks.mjs';
import { form as svForm } from '../content/sv/form.mjs';

/* The dropdown's own wording. It is kept here rather than taken from the
   service nav labels because the question is "what do you need?", not "what
   is this page called": a dealer looking for a branch move and a private
   customer looking for one transfer have to recognise their own line. */
const COPY = {
  fi: {
    intro: 'Kerro lyhyesti, mitä tarvitset. Luemme pyyntösi ja otamme yhteyttä 24 tunnin kuluessa.',
    name: 'Nimi',
    phone: 'Puhelinnumero',
    email: 'Sähköposti',
    emailHelp: 'Lähetämme tarjouspyynnöstä kirjallisen kuittauksen tähän osoitteeseen.',
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
    company: 'Yrityksen nimi',
    companyHelp: 'Vapaaehtoinen. Täytä, jos pyydät tarjousta yrityksen puolesta.',
    notes: 'Lisätiedot / mitä haluaisit meidän tekevän?',
    notesHelp: 'Kerro vapaasti esimerkiksi reitti, toivottu ajankohta ja siirtojen määrä. Tarkat osoitteet, auton tiedot ja avainten luovutus sovitaan, kun otamme yhteyttä.',
    offerToggle: 'Minulla on etukoodi',
    offerCode: 'Etukoodi',
    offerCodeHelp: 'Vapaaehtoinen. Kampanjakoodi kirjoitetaan tähän, ja huomioimme sen tarjouksessa.',
    submit: 'Pyydä tarjous',
    submitting: 'Lähetetään…',
    requiredNote: 'Tähdellä * merkityt kentät ovat pakollisia.',
    enquiryNote: 'Tarjouspyyntö ei vahvista varausta. Vahvistamme hinnan, aikataulun ja kuljettajan erikseen, ja siirto sovitaan vasta kun hyväksyt tarjouksen.',
    errorTitle: 'Tarkista nämä kohdat',
    required: 'Tämä tieto tarvitaan.',
    badEmail: 'Tarkista sähköpostiosoite.',
    badPhone: 'Tarkista puhelinnumero.',
    failed: 'Tarjouspyyntöä ei saatu lähetettyä. Yritä uudelleen tai soita numeroon ' + brand.phone + '.',
    sideTitle: 'Näin etenemme',
    sideSteps: [
      'Luemme tarjouspyyntösi ja otamme yhteyttä 24 tunnin kuluessa.',
      'Käymme yhdessä läpi osoitteet, auton tiedot, avainten luovutuksen ja aikataulun.',
      'Saat kiinteän hinnan. Siirto vahvistetaan vasta, kun hyväksyt tarjouksen.',
    ],
    sideCallTitle: 'Tarvitsetko vastauksen heti?',
    terms: 'Palveluehdot',
    termsNote: 'Varauksen ehdot ja valtuutus auton luovuttamiseen käydään läpi ennen vahvistusta.',
    /* The exact wording the client specified, in all three languages. It is
       shown only after the API has confirmed the enquiry arrived. */
    doneTitle: 'Kiitos tarjouspyynnöstäsi!',
    doneBody: 'DriveMe-tiimi ottaa sinuun yhteyttä 24 tunnin kuluessa. Tarjouspyyntö ei vielä vahvista varausta.',
    doneRef: 'Viitteesi',
    doneAgain: 'Lähetä uusi tarjouspyyntö',
    gatedTitle: 'Tätä palvelua ei voi vielä varata',
    gatedBody: 'Tämä palvelu ei ole vielä varattavissa. Kerromme heti, kun se avautuu - jätä yhteystietosi puhelimitse tai sähköpostilla.',
  },
  en: {
    intro: 'Tell us briefly what you need. We read your enquiry and get back to you within 24 hours.',
    name: 'Name',
    phone: 'Phone number',
    email: 'Email',
    emailHelp: 'We send a written receipt of your enquiry to this address.',
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
    company: 'Company name',
    companyHelp: 'Optional. Fill this in if you are asking on behalf of a company.',
    notes: 'Anything else / what would you like us to do?',
    notesHelp: 'Describe the route, the timing you have in mind and how many transfers you need. Exact addresses, vehicle details and the key handover are agreed when we contact you.',
    offerToggle: 'I have an offer code',
    offerCode: 'Offer code',
    offerCodeHelp: 'Optional. Enter a campaign code here and we apply it to the quote.',
    submit: 'Request a quote',
    submitting: 'Sending…',
    requiredNote: 'Fields marked * are required.',
    enquiryNote: 'An enquiry does not confirm a booking. We confirm the price, the schedule and the driver separately, and the transfer is agreed once you accept the quote.',
    errorTitle: 'Please check these fields',
    required: 'This field is required.',
    badEmail: 'Please check the email address.',
    badPhone: 'Please check the phone number.',
    failed: 'We could not send your enquiry. Please try again or call ' + brand.phone + '.',
    sideTitle: 'How we proceed',
    sideSteps: [
      'We read your enquiry and contact you within 24 hours.',
      'Together we go through the addresses, the vehicle details, the key handover and the schedule.',
      'You get a fixed price. The transfer is confirmed only once you accept the quote.',
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

/* The asterisk is driven by the input's own `required`, so the marker cannot
   drift away from what validation actually enforces. */
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
  `${opts.maxlength ? ` maxlength="${opts.maxlength}"` : ''}` +
  `${opts.autocapitalize ? ` autocapitalize="${opts.autocapitalize}"` : ''}` +
  `${opts.help ? ` aria-describedby="${id}-help"` : ''}>`;

const textarea = (id, help, rows) =>
  `<textarea id="${id}" name="${id}" rows="${rows || 4}"${help ? ` aria-describedby="${id}-help"` : ''}></textarea>`;

export function bookingForm(locale) {
  const c = COPY[locale];
  const t = ui[locale];

  /* Every service that is sold, in catalogue order, plus "Muu palvelu" for an
     enquiry that fits none of them. A gated service is never offered here -
     the API refuses it too - so the list cannot promise what we cannot do. */
  const keys = services.filter((s) => !isGated(s)).map((s) => s.key);
  const label = (k) => c.serviceNames[k] || byKey[k][locale].nav;
  const options = [`<option value="">${esc(c.servicePlaceholder)}</option>`]
    .concat(keys.map((k) => `<option value="${k}">${esc(label(k))}</option>`))
    .concat(`<option value="other">${esc(c.serviceNames.other)}</option>`)
    .join('');

  const config = {
    locale,
    // Which services exist and which of them must not be taken. The page only
    // lists the sellable ones; this is what a deep link is checked against.
    services: Object.fromEntries(services.map((s) => [s.key, { gated: isGated(s) }])),
    // Retired service keys and what answers for them now, so a link made
    // before the catalogue was consolidated still opens the right service.
    aliases: SERVICE_ALIASES,
    copy: {
      required: c.required, badEmail: c.badEmail, badPhone: c.badPhone,
      errorTitle: c.errorTitle, submitting: c.submitting, submit: c.submit,
      failed: c.failed, doneRef: c.doneRef,
      gatedTitle: c.gatedTitle, gatedBody: c.gatedBody,
    },
    endpoint: '/api/bookings',
  };

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
          ${field('customer_name', c.name, text('customer_name', { required: true, autocomplete: 'name' }))}
          <div class="grid-2">
            ${field('customer_phone', c.phone, text('customer_phone', { type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel' }))}
            ${field('customer_email', c.email, text('customer_email', { type: 'email', required: true, autocomplete: 'email', help: true }), c.emailHelp)}
          </div>
          ${field('service', c.service, `<select id="service" name="service" required>${options}</select>`)}
          ${field('company_name', c.company, text('company_name', { autocomplete: 'organization', help: true }), c.companyHelp)}
          ${field('notes', c.notes, textarea('notes', true, 4), c.notesHelp)}

          <!-- Progressive disclosure: the campaign code is real but rare, so it
               is one line until someone needs it. Arriving from the offer page
               opens it with the code already in place. -->
          <div class="offer-reveal">
            <button class="link-btn" type="button" id="offer-toggle" aria-expanded="false" aria-controls="offer-field">
              <span class="plus" aria-hidden="true">+</span> ${esc(c.offerToggle)}
            </button>
            <div id="offer-field" hidden>
              ${field('offer_code', c.offerCode, text('offer_code', { help: true, autocapitalize: 'characters', maxlength: 20 }), c.offerCodeHelp)}
            </div>
          </div>
        </div>

        <p class="hint form-required-note">${esc(c.requiredNote)}</p>

        <div class="enquiry-send">
          <button class="btn btn-primary btn-lg" type="submit" id="submit-btn">${esc(c.submit)} <span class="arrow" aria-hidden="true">→</span></button>
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
  return '<script src="/assets/booking.js?v=4" defer></script>';
}

export { COPY as bookingCopy };

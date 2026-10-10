/**
 * The service catalogue (§3 of the growth strategy), one entry per published
 * service page.
 *
 * Every entry carries the four blocks the document insists on for each
 * service - what DriveMe includes, what the customer must arrange and pay,
 * what is not included, and the implementation note the developer/operations
 * side has to honour - plus the §10 page skeleton (steps, price, FAQ,
 * related links).
 *
 * `gate` names an entry in site.mjs `launchGates`. While that gate is not
 * live, the page renders the "awaiting clearance" notice instead of a booking
 * CTA and the booking flow refuses to take the job. That is the document's
 * implementation principle in code: no published promise without an
 * operational reality behind it.
 *
 * `category`:
 *   'concierge' - a driver for the customer's own car, nobody travelling in
 *                 it (sold now)
 *   'driver'    - the customer travels in their own car, driven by us
 *                 (Gate A cleared; every journey is quoted per route)
 *   'business'  - B2B, lead form rather than instant checkout
 */

import { transferServices } from './services-transfer.mjs';

export const services = [
  ...transferServices,






  /* ------------------------------------------------------------------ */
  {
    key: 'relocation',
    category: 'concierge',
    launch: 'priority',
    appointment: 'none',
    icon: 'relocation',
    price: { key: 'oneWay' },
    related: ['branchTransfer', 'workshopTransfer', 'business'],
    devNote: 'Start with scheduled capital-region and domestic transfers. Price long-distance jobs individually until route and driver-return economics are proven.',
    fi: {
      slug: 'auton-siirtopalvelu',
      nav: 'Auton siirtopalvelu',
      short: 'Siirto',
      title: 'Auton siirtopalvelu Suomessa | DriveMe',
      description: 'Kuljettaja noutaa ajokuntoisen autosi ja ajaa sen toiseen osoitteeseen pääkaupunkiseudulla. Sinun ei tarvitse lähteä mukaan, ja luovutus dokumentoidaan molemmissa päissä.',
      h1: 'Auton siirtopalvelu Suomessa',
      lead: 'Noudamme ajokuntoisen autosi ja ajamme sen sovittuun osoitteeseen, tarvittaessa myös takaisin. Sinun ei tarvitse lähteä mukaan, ja luovutus dokumentoidaan molemmissa päissä.',
      keywords: ['auton siirtopalvelu', 'ajoneuvon siirto', 'auton kuljetus kuljettamalla'],
      steps: [
        'Kerrot nouto- ja toimitusosoitteen sekä yhteyshenkilöt molemmissa päissä.',
        'Vahvistamme kiinteän hinnan reitin, ajankohdan ja kuljettajan paluulogistiikan perusteella.',
        'Noudamme auton, dokumentoimme kunnon, mittarilukeman ja polttoaine- tai lataustason.',
        'Toimitamme auton ja kuittaamme luovutuksen valtuutetulle vastaanottajalle.',
      ],
      included: [
        'Yhdensuuntainen ajettu siirto',
        'Nouto- ja toimituskuvat',
        'Mittarilukema-, polttoaine- tai lataustaso- ja avainluovutuskirjaukset',
        'Tilailmoitukset',
      ],
      customer: [
        'Nimeä valtuutetut yhteyshenkilöt molempiin päihin',
        'Varmista voimassa oleva rekisteröinti, vakuutus, renkaat ja ajokunto',
        'Ilmoita viat, muutokset ja erityiset hallintalaitteet',
        'Maksa polttoaine, lataus, tiemaksut ja pysäköinti tarjouksen mukaisesti',
      ],
      excluded: [
        'Kuljetus lavetilla tai perävaunulla',
        'Liikennekäytöstä poistetun tai ajokiellossa olevan auton siirto',
        'Siirrot Suomen rajojen ulkopuolelle',
        'Säilytys',
      ],
      boundary: 'DriveMe vastaa ajetusta siirrosta ja dokumentoidusta luovutuksesta. Auton kelpoisuudesta ja tiedoista vastaa asiakas.',
      faq: [
        { q: 'Tarvitseeko minun olla autossa mukana?', a: 'Ei. Kuljettaja ajaa auton yksin, eikä autossa kuljeteta matkustajia. Riittää, että avaimet luovutetaan sovitusti noudossa ja joku vastaanottaa auton perillä, tai avaimet jätetään sovittuun paikkaan.' },
        { q: 'Voinko tilata myös paluun?', a: 'Kyllä. Kerro hintapyynnössä, että auto tuodaan takaisin myöhemmin, niin hinnoittelemme noudon ja palautuksen yhtenä työnä.' },
        { q: 'Ajetaanko auto vai kuljetetaanko se lavetilla?', a: 'Ajamme auton. Se on nopeampaa ja edullisempaa ajokuntoiselle autolle. Jos auto ei ole ajokuntoinen tai sitä ei saa ajaa, tarvitaan lavetti - silloin ohjaamme sinut kuljetuskumppanille.' },
        { q: 'Siirrättekö autoja pääkaupunkiseudun ulkopuolelle?', a: 'Kyllä, mutta hinnoittelemme pitkät siirrot tapauskohtaisesti, koska kuljettajan paluumatka on osa kustannusta. Pyydä tarjous reitille.' },
        { q: 'Kuka maksaa polttoaineen ja tiemaksut?', a: 'Ne kerrotaan tarjouksessa erikseen. Emme piilota niitä hintaan.' },
        { q: 'Voiko auton vastaanottaa joku muu?', a: 'Kyllä. Nimeä valtuutettu vastaanottaja varauksessa, niin kirjaamme luovutuksen hänelle.' },
      ],
    },
    en: {
      slug: 'vehicle-relocation',
      nav: 'Vehicle relocation',
      short: 'Relocation',
      title: 'Vehicle relocation in Finland | DriveMe',
      description: 'A driver collects your roadworthy car and drives it to another address in the Helsinki capital region. You do not travel with it, and the handover is documented at both ends.',
      h1: 'Vehicle relocation: a driver takes your car to another address',
      lead: 'We collect your roadworthy car and drive it to the agreed address, and back again if needed. You do not need to travel with it, and the handover is documented at both ends.',
      keywords: ['vehicle relocation Helsinki', 'driven car transfer Finland'],
      steps: [
        'You give the collection and delivery addresses and the contacts at both ends.',
        'We confirm a fixed price from the route, the timing and the driver’s return logistics.',
        'We collect the car and document condition, mileage and fuel or charge level.',
        'We deliver the car and record the handover to the authorised recipient.',
      ],
      included: [
        'One-way driven relocation',
        'Pickup and delivery photos',
        'Mileage, fuel/charge and key handover records',
        'Status notifications',
      ],
      customer: [
        'Provide authorised contacts at both ends',
        'Ensure valid registration, insurance, tyres and roadworthiness',
        'Declare faults, modifications and special controls',
        'Pay fuel, charging, tolls and parking as stated in the quote',
      ],
      excluded: [
        'Transport by truck or trailer',
        'Moving deregistered or driving-banned vehicles',
        'Transfers outside Finland',
        'Storage',
      ],
      boundary: 'DriveMe is responsible for the driven move and the documented handover. Vehicle eligibility and disclosure are the customer’s responsibility.',
      faq: [
        { q: 'Do I need to travel in the car?', a: 'No. The driver drives the car alone and carries no passengers. The keys just need to be handed over as agreed at collection and someone receives the car at the destination, or the keys are left at an agreed place.' },
        { q: 'Can I also book the return?', a: 'Yes. Say in the price request that the car should come back later, and we price the collection and return as one job.' },
        { q: 'Is the car driven or trailered?', a: 'We drive it. That is faster and cheaper for a roadworthy car. If the car cannot legally or safely be driven, it needs a trailer and we point you to a transport partner.' },
        { q: 'Do you move cars outside the capital region?', a: 'Yes, but long-distance moves are priced individually because the driver’s return trip is part of the cost. Ask for a quote on the route.' },
        { q: 'Who pays fuel and tolls?', a: 'They are stated separately in the quote. We do not hide them in the price.' },
        { q: 'Can someone else receive the car?', a: 'Yes. Name an authorised recipient in the booking and we record the handover to them.' },
      ],
    },
  },



  /* ------------------------------------------------------------------ */
  {
    key: 'personalDriver',
    category: 'driver',
    launch: 'gated',
    appointment: 'none',
    icon: 'driver',
    price: { key: 'personalDriver' },
    related: ['relocation', 'workshopTransfer', 'business'],
    devNote: 'Retain as a premium category, but keep alcohol-heavy positioning off the homepage. Lead with time, convenience, events, business and airport use. Gate A (Traficom + insurer) is cleared; price each booking by hand.',
    fi: {
      slug: 'oma-kuljettaja',
      nav: 'Oma kuljettaja',
      short: 'Oma kuljettaja',
      title: 'Oma kuljettaja omalle autollesi Helsingissä | DriveMe',
      description: 'Ammattikuljettaja ajaa omaa autoasi illan, tapahtuman, työpäivän tai usean pysähdyksen ajan pääkaupunkiseudulla.',
      h1: 'Oma kuljettaja asiakkaan omalle autolle',
      lead: 'Sinun autosi, sinun suunnitelmasi, ammattikuljettaja - illaksi, tapahtumaan tai usean pysähdyksen päiväksi.',
      keywords: ['oma kuljettaja', 'henkilökohtainen kuljettaja', 'kuskipalvelu omalla autolla'],
      steps: [
        'Kerrot aikataulun, nouto-osoitteen, pysähdykset ja kohteen.',
        'Vahvistamme kuljettajan ja hinnan ennen ajoa.',
        'Kuljettaja saapuu sovittuun aikaan ja ajaa omaa autoasi.',
        'Auto ja avaimet luovutetaan sinulle sovitussa paikassa.',
      ],
      included: [
        'Kuljettajan aika vahvistetun aikataulun mukaan',
        'Sovittu nouto, pysähdykset ja määränpää',
        'Dokumentoitu kuljettajan henkilöllisyys ja tukiyhteystieto',
        'Auton ja avainten turvallinen luovutus',
      ],
      customer: [
        'Ole kykenevä nousemaan autoon ja matkustamaan turvallisesti matkustajana',
        'Anna käyttöön laillinen, vakuutettu ja ajokuntoinen auto',
        'Ilmoita erityiset hallintalaitteet',
        'Maksa pysäköinti, tiemaksut ja auton energia, ellei tarjouksessa toisin sanota',
      ],
      excluded: [
        'Ilman saattajaa matkustavan lapsen kuljettaminen',
        'Hoidollinen valvonta tai avustamisvelvoitteet',
        'Turvattoman auton ajaminen',
        'Rajoittamaton odotus tai vahvistamattomat jatkot',
      ],
      boundary: 'DriveMe vastaa kuljettajasta ja sovitusta ajasta. Auton kelpoisuudesta, vakuutuksesta ja matkustajien turvavarusteista vastaa asiakas. Hinta vahvistetaan ennen ajoa.',
      faq: [
        { q: 'Ajaako kuljettaja omaa autoani vai teidän autoanne?', a: 'Omaa autoasi. Se on palvelun ydin: tuttu auto, omat lastenistuimet ja tavarat, ei siirtymistä vieraaseen autoon.' },
        { q: 'Onko palvelu jo saatavilla?', a: 'Kyllä. Kuljettaja omalle autollesi on varattavissa, ja hinta vahvistetaan reitin ja keston mukaan ennen ajoa.' },
        { q: 'Onko tunneille minimiä?', a: 'Suositeltu minimi on kaksi tuntia. Kerromme hinnan ja minimin varauksen yhteydessä.' },
        { q: 'Kuljetatteko lapsen yksin?', a: 'Emme. Ilman saattajaa matkustavan lapsen kuljetus on suljettu palvelun ulkopuolelle.' },
      ],
    },
    en: {
      slug: 'personal-driver',
      nav: 'Personal driver',
      short: 'Personal driver',
      title: 'A personal driver for your own car in Helsinki | DriveMe',
      description: 'A professional driver operates your own car for an evening, an event, a business day or a multi-stop schedule in the capital region.',
      h1: 'A personal driver for your own car',
      lead: 'Your vehicle, your plans, a professional driver - for an evening, an event or a multi-stop day.',
      keywords: ['personal driver own car', 'chauffeur for my car Helsinki'],
      steps: [
        'You tell us the schedule, pickup, stops and destination.',
        'We confirm the driver and the price before the drive.',
        'The driver arrives at the agreed time and drives your own car.',
        'The car and keys are handed back to you at the agreed place.',
      ],
      included: [
        'Driver time under the confirmed schedule',
        'Agreed pickup, stops and destination',
        'Documented driver identity and support contact',
        'Safe handover of vehicle and keys',
      ],
      customer: [
        'Be fit to enter and use the vehicle safely as a passenger',
        'Provide a legal, insured and roadworthy vehicle',
        'Disclose special controls',
        'Pay parking, tolls and vehicle energy unless the quote says otherwise',
      ],
      excluded: [
        'Transporting an unaccompanied child',
        'Medical supervision or assisted-care obligations',
        'Driving an unsafe vehicle',
        'Unlimited waiting or unconfirmed extensions',
      ],
      boundary: 'DriveMe is responsible for the driver and the agreed hours. Vehicle eligibility, insurance and passenger safety equipment are the customer’s responsibility. The price is confirmed before the drive.',
      faq: [
        { q: 'Does the driver use my car or yours?', a: 'Yours. That is the point of the service: a familiar car, your own child seats and belongings, no transfer into a strange vehicle.' },
        { q: 'Is the service available now?', a: 'Yes. A driver for your own car can be booked, and the price is confirmed from the route and duration before the drive.' },
        { q: 'Is there an hourly minimum?', a: 'The recommended minimum is two hours. We state the price and minimum with your booking.' },
        { q: 'Do you transport a child alone?', a: 'No. Unaccompanied child transport is excluded from the service.' },
      ],
    },
  },



  /* ------------------------------------------------------------------ */
  {
    key: 'business',
    category: 'business',
    launch: 'priority',
    appointment: 'depends',
    icon: 'business',
    price: { key: 'corporate' },
    related: ['branchTransfer', 'homeDelivery', 'workshopTransfer'],
    devNote: 'Lead form rather than instant checkout: company, Business ID, fleet size, monthly movements, common routes, service-level needs and invoice contact.',
    fi: {
      slug: 'yrityksille',
      nav: 'Yrityksille',
      short: 'Yrityksille',
      title: 'Yritysautojen siirtopalvelu Helsingissä | DriveMe',
      description: 'Ajoneuvojen noudot, huoltosiirrot, työntekijäluovutukset ja muut yritysautojen siirrot yhdeltä luotettavalta kumppanilta. Pääkaupunkiseudulla.',
      h1: 'Autonsiirrot *yrityksille*',
      lead: 'DriveMe auttaa autoliikkeitä, leasing- ja kalustoyhtiöitä sekä autovuokraamoja hoitamaan ajoneuvojen siirrot ilman oman henkilökunnan ajomatkoja. Voit pyytää tarjouksen yksittäisestä siirrosta tai keskustella toistuvista ajoista ja sovitusta laskutuskäytännöstä.',
      keywords: ['yritysautojen siirto', 'ajoneuvojen siirtopalvelu yrityksille', 'fleet concierge Finland'],
      steps: [
        'Kerrot kalustosi koon, tavallisimmat reitit ja kuukausittaisen siirtomäärän.',
        'Sovimme palvelutasosta, valtuutetuista tilaajista ja hyväksymisrajoista.',
        'Tilaukset tulevat yhdestä paikasta ja nimeämme kuljettajan jokaiseen työhön.',
        'Saat työkohtaisen tilatiedon ja kuukausittain koottavan laskun.',
      ],
      included: [
        'Nimetty yritysasiakkuus',
        'Keskitetty tilaus ja kuljettajan nimeäminen',
        'Ajoneuvon kunnon dokumentointi',
        'Kuukausittain koottu lasku',
        'Työkohtainen tila- ja poikkeamakirjaus',
      ],
      customer: [
        'Valtuutetut tilaajat ja kustannuspaikat',
        'Ajoneuvojen kelpoisuus ja palveluntarjoajien ajanvaraukset',
        'Selkeät hyväksymisrajat',
        'Ajantasaiset kalusto- ja yhteystiedot',
      ],
      excluded: [
        'Kaluston huoltopäätökset',
        'Kolmannen osapuolen työn laatu',
        'Hyväksymättömät korjauskulut',
        'Hinaus tai säilytys, ellei niistä ole erikseen sovittu',
      ],
      boundary: 'DriveMe hoitaa siirrot ja luovutukset. Huoltopäätökset, korjaushyväksynnät ja palveluntarjoajien laskut pysyvät yrityksen omissa käsissä.',
      faq: [
        { q: 'Mikä on pienin järkevä kalustokoko?', a: 'Palvelu on suunniteltu 2-50 auton kalustoille, joissa ei ole omaa kalustokoordinaattoria. Pienempikin onnistuu, jos siirtoja on säännöllisesti.' },
        { q: 'Saammeko yhden laskun?', a: 'Kyllä. Kokoamme kuukauden työt yhdelle laskulle kustannuspaikoittain eriteltynä.' },
        { q: 'Voiko työntekijä luovuttaa auton?', a: 'Kyllä, kun hänet on nimetty varauksessa valtuutetuksi luovuttajaksi tai vastaanottajaksi.' },
        { q: 'Hyväksyttekö korjauksia puolestamme?', a: 'Emme. Kuljettaja ei hyväksy töitä eikä kuluja. Hyväksymisrajaksi on asetettu 0 euroa, ellei sopimuksessa toisin sovita.' },
      ],
    },
    en: {
      slug: 'for-companies',
      nav: 'For companies',
      short: 'For companies',
      title: 'Company vehicle transfers in Helsinki | DriveMe',
      description: 'Vehicle collections, service transfers, employee handovers and other company car movements from one reliable partner. In the Helsinki region.',
      h1: 'Vehicle movement service for companies',
      lead: 'One reliable contact for recurring vehicle movements, service appointments and employee handovers.',
      keywords: ['corporate fleet movements Finland', 'fleet concierge Helsinki'],
      steps: [
        'You tell us your fleet size, common routes and monthly movement volume.',
        'We agree service levels, authorised bookers and approval limits.',
        'Bookings come through one place and we assign a driver to every job.',
        'You get job-level status and one consolidated monthly invoice.',
      ],
      included: [
        'Named business account',
        'Central booking and driver assignment',
        'Vehicle condition documentation',
        'Monthly consolidated invoice',
        'Job-level status and exception record',
      ],
      customer: [
        'Authorised bookers and cost centres',
        'Vehicle eligibility and provider appointments',
        'Clear approval limits',
        'Accurate fleet and contact data',
      ],
      excluded: [
        'Fleet maintenance decisions',
        'Third-party workmanship',
        'Unapproved repair costs',
        'Towing or storage unless separately contracted',
      ],
      boundary: 'DriveMe handles the movements and handovers. Maintenance decisions, repair approvals and provider invoices stay with the company.',
      faq: [
        { q: 'What fleet size makes sense?', a: 'The service is built for fleets of 2-50 vehicles with no dedicated fleet coordinator. Smaller works too when movements are regular.' },
        { q: 'Do we get one invoice?', a: 'Yes. We consolidate the month’s jobs onto one invoice, itemised by cost centre.' },
        { q: 'Can an employee hand the car over?', a: 'Yes, when named in the booking as an authorised person.' },
        { q: 'Do you approve repairs for us?', a: 'No. Drivers approve no work and no cost. The approval limit is set to zero euro unless a contract says otherwise.' },
      ],
    },
  },
];

/* Swedish, from content/sv/services.mjs: same keys, one reviewable document. */
import * as SV from './sv/services.mjs';
for (const s of services) {
  if (!SV[s.key]) throw new Error(`no Swedish content for service: ${s.key}`);
  s.sv = SV[s.key];
}

export const byKey = Object.fromEntries(services.map((s) => [s.key, s]));

/** Services offered in the "Take care of my car" path of the booking flow. */
export const conciergeKeys = services.filter((s) => s.category === 'concierge').map((s) => s.key);
/** Services offered in the "I need a driver" path. */
export const driverKeys = services.filter((s) => s.category === 'driver').map((s) => s.key);

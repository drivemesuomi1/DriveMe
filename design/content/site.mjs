/**
 * Site-wide content: brand, navigation, coverage, contact and the legal
 * boundary copy that has to read identically on every page.
 *
 * Source: "DriveMe - Service and Website Growth Strategy" (Mansio Group Oy,
 * 8 September 2026) - §6 responsibility boundaries, §8 information
 * architecture - as refocused by "DriveMe: A Driver for Your Car" (Driver
 * First Growth Plan, 13 September 2026): the site sells a driver for the
 * customer's own car, with nobody travelling in it.
 *
 * Finnish is the primary market language (§8). English mirrors it under /en/
 * and Swedish under /sv/ - Swedish is an official language of Finland, so the
 * site is published in it rather than translated on demand. The Swedish copy
 * lives in content/sv/ so a Swedish speaker can read and correct it as one
 * document; it is merged into these objects at the foot of this file.
 */

export const LOCALES = ['fi', 'en', 'sv'];
export const DEFAULT_LOCALE = 'fi';

export const ORIGIN = 'https://driveme.fi';

export const brand = {
  name: 'DriveMe',
  legalName: 'Mansio Group Oy',
  phone: '+358 50 357 2836',
  phoneHref: '+358503572836',
  email: 'info@driveme.fi',
  serviceEmail: 'asiakaspalvelu@driveme.fi',
  city: 'Helsinki',
  country: 'FI',
  // §12 audit, "Coverage differs": one launch area, used everywhere.
  coverage: ['Helsinki', 'Espoo', 'Vantaa', 'Kauniainen'],
  // OWNER DECISION PENDING: the Y-tunnus. Published on the terms page and in
  // the LocalBusiness schema as soon as it is filled in; until then nothing
  // placeholder-shaped is shown in its place.
  businessId: null,
};

/**
 * Which nav keys appear in the header bar. Safety and FAQ are deliberately
 * absent: §8 lists them in the navigation, but seven items leave the Finnish
 * labels — which run about 30% longer than the English — with no room to
 * breathe. Both stay one hover away in the services menu, sit in the footer,
 * and are linked from the homepage sections that describe them.
 */
// Five items, two of them menus. "How it works" sits inside both menus
// rather than taking a sixth slot in the bar.
export const headerNav = ['services', 'serviceTransfers', 'business', 'pricing', 'contact'];

/** §8 recommended navigation — the full set of top-level pages. */
export const nav = {
  fi: [
    { key: 'services', label: 'Autonsiirrot', href: '/palvelut/', menu: 'move' },
    { key: 'serviceTransfers', label: 'Huoltosiirrot', href: '/huoltosiirto/' },
    { key: 'how', label: 'Näin se toimii', href: '/nain-se-toimii/' },
    { key: 'pricing', label: 'Hinnasto', href: '/hinnasto/' },
    { key: 'business', label: 'Yrityksille', href: '/yrityksille/' },
    { key: 'safety', label: 'Turvallisuus', href: '/turvallisuus/' },
    { key: 'faq', label: 'Usein kysyttyä', href: '/usein-kysyttya/' },
    { key: 'contact', label: 'Yhteystiedot', href: '/yhteystiedot/' },
  ],
  en: [
    { key: 'services', label: 'Vehicle transfers', href: '/en/services/', menu: 'move' },
    { key: 'serviceTransfers', label: 'Service transfers', href: '/en/service-transfer/' },
    { key: 'how', label: 'How it works', href: '/en/how-it-works/' },
    { key: 'pricing', label: 'Pricing', href: '/en/pricing/' },
    { key: 'business', label: 'For companies', href: '/en/for-companies/' },
    { key: 'safety', label: 'Safety', href: '/en/safety/' },
    { key: 'faq', label: 'FAQ', href: '/en/faq/' },
    { key: 'contact', label: 'Contact', href: '/en/contact/' },
  ],
};

/** Headings inside the services drop-down: the two things sold now. */
export const menuGroups = {
  fi: {
    appointment: 'Huoltosiirrot',
    appointmentIntro: 'Yksi siirto, minkä tahansa varatun autopalvelun luo ja takaisin.',
    destinations: 'Mihin siirto sopii',
    move: 'Autonsiirrot',
    moveIntro: 'Ajokuntoinen auto paikasta toiseen, dokumentoidulla luovutuksella.',
    passenger: 'Kuljettajapalvelu',
    business: 'Yrityksille',
    all: 'Kaikki palvelut',
    how: 'Näin se toimii',
    pricing: 'Hinnasto',
    safety: 'Turvallisuus',
    faq: 'Usein kysyttyä',
  },
  en: {
    appointment: 'Service transfers',
    appointmentIntro: 'One transfer, to any booked car service and back again.',
    destinations: 'What it covers',
    move: 'Vehicle transfers',
    moveIntro: 'A roadworthy car from one place to another, handover documented.',
    passenger: 'Driver service',
    business: 'For companies',
    all: 'All services',
    how: 'How it works',
    pricing: 'Pricing',
    safety: 'Safety',
    faq: 'FAQ',
  },
};

export const ui = {
  fi: {
    lang: 'fi-FI',
    skip: 'Siirry sisältöön',
    bookCta: 'Pyydä hinta',
    bookHref: '/pyyda-tarjous/',
    callUs: 'Soita',
    menu: 'Valikko',
    close: 'Sulje',
    language: 'Kieli',
    breadcrumbHome: 'Etusivu',
    included: 'DriveMe-palveluun sisältyy',
    customer: 'Asiakkaan vastuulla',
    excluded: 'Ei sisälly',
    eligibility: 'Ajoneuvon kelpoisuus ja epäämisoikeus',
    steps: 'Näin se etenee',
    price: 'Hinta',
    faq: 'Usein kysyttyä',
    coverage: 'Palvelualue',
    related: 'Liittyvät palvelut',
    boundary: 'Vastuunjako',
    requestPrice: 'Pyydä hinta',
    finalCta: 'Kuljettaja autollesi, *kun et ehdi itse*',
    priceFrom: 'alkaen',
    vatNote: 'Hinnat sisältävät arvonlisäveron.',
    thirdParty: 'Kolmannen osapuolen maksut eivät sisälly hintaan, vaan ne maksetaan suoraan palveluntarjoajalle.',
    onThisPage: 'Tällä sivulla',
    allServices: 'Kaikki palvelut',
    readMore: 'Lue lisää',
    requestMove: 'Pyydä hinta auton siirrolle',
    phoneLabel: 'Puhelin',
    serviceEmailLabel: 'Asiakaspalvelu',
    generalEmailLabel: 'Yleiset asiat',
    noPassenger: 'Sinun ei tarvitse lähteä mukaan. Kuljettaja ajaa autosi perille, eikä autossa kuljeteta matkustajia.',
    passengers: 'Matkustajat',
    noPassengerShort: 'Ei matkustajia, et lähde mukaan',
    withPassengers: 'Sinä ja matkaseurueesi',
  },
  en: {
    lang: 'en-FI',
    skip: 'Skip to content',
    bookCta: 'Get a price',
    bookHref: '/en/request-a-quote/',
    callUs: 'Call',
    menu: 'Menu',
    close: 'Close',
    language: 'Language',
    breadcrumbHome: 'Home',
    included: 'Included in the DriveMe service',
    customer: 'Customer responsibilities',
    excluded: 'Not included',
    eligibility: 'Vehicle eligibility and refusal rules',
    steps: 'How it runs',
    price: 'Price',
    faq: 'Frequently asked',
    coverage: 'Service area',
    related: 'Related services',
    boundary: 'Responsibility boundary',
    requestPrice: 'Request a price',
    finalCta: 'A driver for your car, *when you cannot make the trip*',
    priceFrom: 'from',
    vatNote: 'Prices include Finnish VAT.',
    thirdParty: 'Third-party charges are not included and are paid directly to the provider.',
    onThisPage: 'On this page',
    allServices: 'All services',
    readMore: 'Read more',
    requestMove: 'Get a price to move my car',
    phoneLabel: 'Phone',
    serviceEmailLabel: 'Customer service',
    generalEmailLabel: 'General enquiries',
    noPassenger: 'You do not need to travel with the car. The driver takes it to the destination and carries no passengers.',
    passengers: 'Passengers',
    noPassengerShort: 'None, you do not travel with it',
    withPassengers: 'You and your passengers',
  },
};

/**
 * §6 recommended short disclaimer, in the document's own wording. Both
 * versions end with the sentence that keeps the terms fair under Finnish
 * consumer law - do not drop it (§6, "Why the final sentence is necessary").
 */
export const disclaimer = {
  fi: 'DriveMe tarjoaa ajoneuvon nouto-, ajo-, toimitus- ja sovitut luovutuspalvelut. Katsastus-, huolto-, korjaus-, rengas-, pesu-, detailing-, pysäköinti- ja muut kolmannen osapuolen palvelut perustuvat asiakkaan ja asiakkaan valitseman palveluntarjoajan väliseen erilliseen sopimukseen. Asiakas vastaa ajanvarauksesta, työn hyväksymisestä ja palveluntarjoajan maksamisesta. DriveMe ei takaa kolmannen osapuolen saatavuutta, aikataulua, hintaa, työn laatua tai lopputulosta. DriveMe vastaa omasta palvelustaan sovellettavan lain mukaisesti.',
  en: 'DriveMe provides vehicle collection, driving, delivery and agreed handover services. Any inspection, maintenance, repair, tyre, washing, detailing, parking or other third-party service is supplied under a separate agreement between the customer and the selected provider. The customer is responsible for booking the appointment, approving the work and paying the provider directly. DriveMe does not guarantee the availability, schedule, price, workmanship or outcome of a third-party service. DriveMe remains responsible for its own service to the extent required by applicable law.',
};

/** §6 mandatory booking acknowledgements - rendered on /varaus/ and /ehdot/. */
export const acknowledgements = {
  fi: [
    'Olen ajoneuvon omistaja, haltija tai valtuutettu käyttäjä ja valtuutan DriveMen ajamaan sitä tässä varauksessa.',
    'Ajoneuvo on rekisteröity liikennekäyttöön, vakuutettu ja ajokuntoinen, eikä sillä ole ajokieltoa.',
    'Olen ilmoittanut tiedossani olevat viat, varoitusvalot, muutokset ja erityiset käyttöohjeet.',
    'Olen varannut tai vahvistanut kolmannen osapuolen ajanvarauksen silloin, kun palvelu sitä edellyttää.',
    'Hyväksyn ja maksan kolmannen osapuolen palvelut suoraan; DriveMellä ei ole valtuutta hyväksyä lisätöitä.',
    'Olen poistanut autosta käteisen, arvoesineet, kielletyt tavarat ja tarpeettomat henkilötiedot.',
    'Valtuutan kunto-, mittarilukema-, polttoaine- tai lataustaso- ja luovutusvalokuvat palvelun todentamiseksi.',
    'Hyväksyn vahvistetun DriveMe-hinnan, odotussäännöt ja peruutusehdot.',
  ],
  en: [
    'I am the owner, keeper or authorised user of the vehicle and authorise DriveMe to drive it for this booking.',
    'The vehicle is registered for traffic use, insured, roadworthy and not subject to a driving ban.',
    'I have disclosed known faults, warning lights, modifications and special operating instructions.',
    'I have booked or confirmed the third-party appointment where required.',
    'I will approve and pay third-party services directly; DriveMe is not authorised to approve extra work.',
    'I have removed cash, valuables, prohibited items and unnecessary personal data from the vehicle.',
    'I authorise condition, mileage, fuel/charge and handover photographs for service evidence.',
    'I accept the confirmed DriveMe fee, waiting rules and cancellation conditions.',
  ],
};

/** §6 customer vehicle eligibility - the default block on every service page. */
export const eligibility = {
  fi: [
    'Voimassa oleva rekisteröinti, vakuutus ja lain edellyttämä katsastus.',
    'Oikeat kausirenkaat ja turvallinen rengaskunto.',
    'Riittävä polttoaine tai lataus suunniteltuun reittiin sekä kohtuullinen varmuusvara.',
    'Ei voimassa olevaa ajokieltoa, turvallisuutta vaarantavaa vauriota, vakavaa nestevuotoa tai kriittistä varoitusta.',
    'Tavanomaiset hallintalaitteet, jotka vastaavat kuljettajan ajo-oikeutta ja ilmoitettua osaamista.',
    'Avaimet ja mahdollinen lukkopulttiavain käytettävissä.',
  ],
  en: [
    'Valid registration, insurance and legally required inspection.',
    'Correct seasonal tyres and safe tyre condition.',
    'Sufficient fuel or battery to complete the planned route plus reasonable reserve.',
    'No active driving ban, unsafe damage, serious fluid leak or critical warning.',
    'Normal controls compatible with the assigned driver’s licence and disclosed competence.',
    'Keys and any wheel-lock key provided as needed.',
  ],
};

/** What the driver does when a vehicle cannot be accepted (§7.1). */
export const refusal = {
  fi: 'Kuljettaja ei aja autoa, joka vaikuttaa turvattomalta, laittomalta tai olennaisesti varaustiedoista poikkeavalta. Tällöin dokumentoimme tilanteen, keskeytämme työn ja asiakas järjestää hinauksen tai muun lainmukaisen kuljetuksen. Veloitamme vain ehdoissa kerrotun perusmaksun ja toteutuneen ajan.',
  en: 'A driver will not drive a vehicle that appears unsafe, illegal or materially different from the booking information. We document the situation, pause the job, and the customer arranges towing or another legal transport method. Only the base fee and incurred time stated in the terms are charged.',
};

/** §12.1 trust strip - verified claims only. */
export const trustStrip = {
  fi: [
    { icon: 'price', label: 'Hinta vahvistetaan ennen ajoa' },
    { icon: 'driver', label: 'Ammattimainen kuljettaja' },
    { icon: 'doc', label: 'Dokumentoitu nouto ja palautus' },
    { icon: 'key', label: 'Sinun ei tarvitse lähteä mukaan' },
    { icon: 'pin', label: 'Helsinki, Espoo, Vantaa, Kauniainen' },
  ],
  en: [
    { icon: 'price', label: 'Price confirmed in advance' },
    { icon: 'driver', label: 'Professional driver' },
    { icon: 'doc', label: 'Documented pickup and return' },
    { icon: 'key', label: 'You do not travel with the car' },
    { icon: 'pin', label: 'Helsinki, Espoo, Vantaa, Kauniainen' },
  ],
};

/** The customer journey, condensed to the four steps on the homepage. */
export const howItWorks = {
  fi: [
    { t: 'Kerro, mihin auto menee', d: 'Nouto-osoite, kohde tai palveluntarjoaja ja toivottu päivä. Näet ohjeellisen hinnan heti.' },
    { t: 'Soitamme ja vahvistamme', d: 'Käymme auton tiedot läpi ja vahvistamme kuljettajan, ajan ja kiinteän hinnan. Pyyntö ei ole vielä vahvistus.' },
    { t: 'Kuljettaja noutaa autosi', d: 'Kuvaamme kunnon, mittarilukeman sekä polttoaine- tai lataustason. Sinun ei tarvitse lähteä mukaan.' },
    { t: 'Auto perille tai takaisin', d: 'Jokainen luovutus kirjataan, ja saat tiedon toimituksesta tai palautuksesta.' },
  ],
  en: [
    { t: 'Tell us where the car goes', d: 'Collection address, destination or provider, and the preferred day. You see an indicative price immediately.' },
    { t: 'We call you and confirm', d: 'We go through the vehicle details and confirm the driver, the time and a fixed price. A request is not yet a confirmation.' },
    { t: 'The driver collects your car', d: 'We photograph condition, mileage and fuel or charge level. You do not need to travel with it.' },
    { t: 'Delivered, or back home', d: 'Every handover is recorded, and you hear when the car is delivered or returned.' },
  ],
};

/** §7 status model, shown to customers on /nain-se-toimii/. */
export const statusModel = {
  fi: ['Pyyntö vastaanotettu', 'Odottaa tietoja', 'Vahvistettu', 'Kuljettaja nimetty', 'Kuljettaja matkalla', 'Auto noudettu', 'Palveluntarjoajalla tai siirrossa', 'Valmis palautettavaksi', 'Palautetaan', 'Toimitettu', 'Valmis'],
  en: ['Requested', 'Awaiting information', 'Confirmed', 'Driver assigned', 'Driver en route', 'Vehicle collected', 'At provider / in transit', 'Ready for return', 'Returning', 'Delivered', 'Completed'],
};

/** §5 cancellation recommendation. */
export const cancellation = {
  fi: [
    'Maksuton peruutus vähintään 24 tuntia ennen vahvistettua noutoa.',
    'Alle 24 tuntia ennen noutoa: 50 % DriveMe-palkkiosta.',
    'Kuljettajan lähdön jälkeen tai jos asiakas tai palveluntarjoaja ei ole paikalla: perusmaksu sekä toteutunut aika, pysäköinti ja matka ehdoissa kerrottuun enimmäismäärään asti.',
    'Kolmannen osapuolen peruutusmaksuihin sovelletaan aina asiakkaan ja kyseisen palveluntarjoajan välistä erillistä sopimusta.',
  ],
  en: [
    'Free cancellation at least 24 hours before the confirmed pickup.',
    'Less than 24 hours before pickup: 50% of the DriveMe fee.',
    'After driver dispatch or a customer or provider no-show: the base fee plus incurred time, parking and travel, capped as stated in the terms.',
    'Third-party cancellation fees are always governed by the customer’s separate agreement with that provider.',
  ],
};

/**
 * §6.1 launch gates live in api/_lib/gates.js, because the API has to refuse
 * a gated service just as firmly as the page has to stop advertising it.
 * Re-exported here so the content layer reads from one source.
 */
export { launchGates, SERVICE_GATES, isServiceGated } from '../api/_lib/gates.js';

export const gateNotice = {
  fi: 'Tämä palvelu odottaa viranomais- ja vakuutusvahvistusta. Otamme vastaan yhteydenottoja, mutta emme vahvista ajoja ennen kuin lupa- ja vakuutusasiat on varmistettu kirjallisesti.',
  en: 'This service is awaiting regulatory and insurance confirmation. We take expressions of interest, but we do not confirm jobs before the licensing and insurance position is confirmed in writing.',
};

/** Screening wording while Gate C is open (§6.1 Gate C, §12 audit). */
export const screening = {
  fi: {
    open: 'Jokaisella kuljettajalla on voimassa oleva ajo-oikeus, jonka tarkistamme ja kirjaamme, sekä henkilökohtainen perehdytys DriveMen nouto-, luovutus- ja dokumentointiohjeisiin. Emme julkaise laajempia taustatarkastusväitteitä ennen kuin tarkistusten sisältö on lakimiehen ja tietosuojaohjeistuksen hyväksymä.',
    closed: 'Jokaiselle kuljettajalle tehdään julkaistu, dokumentoitu tarkistuslista ennen ensimmäistä ajoa.',
  },
  en: {
    open: 'Every driver has a valid driving licence that we verify and record, plus personal training on DriveMe collection, handover and documentation rules. We do not publish broader background-check claims until the exact checks are approved by counsel and data-protection guidance.',
    closed: 'Every driver completes the published, documented check list before their first job.',
  },
};

export const footer = {
  fi: {
    tagline: 'Kuljettaja autollesi pääkaupunkiseudulla. Sinun ei tarvitse lähteä mukaan.',
    columns: [
      { title: 'Autonsiirrot yrityksille', keys: ['branchTransfer', 'homeDelivery', 'purchasedCarPickup'] },
      { title: 'Siirrot ja huoltoajot', keys: ['workshopTransfer', 'relocation'] },
      { title: 'Muut palvelut', keys: ['business', 'personalDriver'] },
    ],
    legalLinks: [
      { label: 'Palveluehdot', href: '/ehdot/' },
      { label: 'Peruutusehdot', href: '/ehdot/#peruutus' },
      { label: 'Tietosuoja', href: '/ehdot/#tietosuoja' },
      { label: 'Turvallisuus', href: '/turvallisuus/' },
    ],
    company: 'Mansio Group Oy · Helsinki, Suomi',
    note: 'DriveMe on Mansio Group Oy:n palvelu. DriveMe ei ole korjaamo, katsastusasema, rengasliike, autopesula, vakuutusyhtiö eikä maksunvälittäjä.',
  },
  en: {
    tagline: 'A driver for your car in the Helsinki capital region. You do not need to travel with it.',
    columns: [
      { title: 'Transfers for businesses', keys: ['branchTransfer', 'homeDelivery', 'purchasedCarPickup'] },
      { title: 'Transfers and service runs', keys: ['workshopTransfer', 'relocation'] },
      { title: 'Other services', keys: ['business', 'personalDriver'] },
    ],
    legalLinks: [
      { label: 'Terms of service', href: '/en/terms/' },
      { label: 'Cancellation', href: '/en/terms/#cancellation' },
      { label: 'Privacy', href: '/en/terms/#privacy' },
      { label: 'Safety', href: '/en/safety/' },
    ],
    company: 'Mansio Group Oy · Helsinki, Finland',
    note: 'DriveMe is a service of Mansio Group Oy. DriveMe is not a workshop, inspection station, tyre shop, car wash, insurer or payment intermediary.',
  },
};

/* ==========================================================================
   Swedish
   ==========================================================================
   Merged rather than interleaved: content/sv/ holds the Swedish wording as
   one readable document, and these assignments give every object its `sv`
   alongside `fi` and `en`. */
import * as SV from './sv/site.mjs';

Object.assign(nav, { sv: SV.nav });
Object.assign(menuGroups, { sv: SV.menuGroups });
Object.assign(ui, { sv: SV.ui });
Object.assign(disclaimer, { sv: SV.disclaimer });
Object.assign(acknowledgements, { sv: SV.acknowledgements });
Object.assign(eligibility, { sv: SV.eligibility });
Object.assign(refusal, { sv: SV.refusal });
Object.assign(trustStrip, { sv: SV.trustStrip });
Object.assign(howItWorks, { sv: SV.howItWorks });
Object.assign(statusModel, { sv: SV.statusModel });
Object.assign(cancellation, { sv: SV.cancellation });
Object.assign(gateNotice, { sv: SV.gateNotice });
Object.assign(screening, { sv: SV.screening });
Object.assign(footer, { sv: SV.footer });

/**
 * Micro-copy the page templates need: the words that used to sit inline in
 * build/ as `locale === 'fi' ? ... : ...`, which cannot express a third
 * language.
 */
export const words = {
  fi: {
    // The service area in this language: the Swedish page says Helsingfors.
    cities: brand.coverage,
    notBookable: 'Ei vielä varattavissa',
    fixedQuote: 'Kiinteä tarjous',
    ackNote: 'Käymme nämä läpi kanssasi ennen kuin varaus vahvistetaan.',
    gateCleared: 'Vahvistettu',
    gateWaiting: 'Odottaa vahvistusta',
    gateNoticeTitle: 'Palvelu ei ole vielä varattavissa',
    companyProvider: 'Palveluntarjoaja: ',
    companyBusinessId: 'Y-tunnus: ',
    companyDomicile: 'Kotipaikka: Helsinki, Suomi',
    companyPhone: 'Puhelin: ',
    companyEmail: 'Sähköposti: ',
    companyArea: 'Palvelualue: ',
    coverageBody: (areas) => `Palvelemme tällä hetkellä alueilla ${areas}. Pidemmät siirrot hinnoittelemme tapauskohtaisesti.`,
    ctaBody: 'Kerro, mistä auto noudetaan ja minne se menee. Vahvistamme kiinteän hinnan ennen ajoa.',
    registerInterest: 'Ilmoita kiinnostuksesi',
    interestTitle: 'Kerro kiinnostuksestasi',
    interestBody: 'Ilmoitamme heti, kun lupa- ja vakuutusasiat on vahvistettu ja palvelu on varattavissa.',
    sendEmail: 'Lähetä sähköposti',
    appointment: 'Ajanvaraus',
    fullPriceList: 'Koko hinnasto',
    allQuestions: 'Kaikki kysymykset',
    safetyAndInsurance: 'Turvallisuus ja vakuutukset',
    reviewPending: 'Tarkastus kesken',
    getInTouch: 'Yhteys',
    information: 'Tietoa',
    params: { source: 'lahde', service: 'palvelu', pickup: 'nouto', date: 'pvm', type: 'tyyppi', offer: 'etu' },
    typeValues: { move: 'siirto', service: 'palvelu', journey: 'matka' },
    typicalShort: (a, b) => `Tyypillisesti ${a}–${b} €`,
    safetyPoints: [
      'Aikaleimatut kuvat noudossa ja palautuksessa',
      'Mittarilukema sekä polttoaine- tai lataustaso kirjataan',
      'Luovutuksen aika, paikka ja vastaanottaja tallennetaan',
      'Kerromme avoimesti, mitkä lupa- ja vakuutusasiat ovat vielä kesken',
    ],
    price: {
      gated: (name) => `${name} ei ole vielä varattavissa, joten emme julkaise sille hintaa.`,
      journey: (name) => `${name}: kiinteä tarjous. Hinta muodostuu reitistä, matkan kestosta, matkustajien määrästä ja kuljettajan paluusta, ja vahvistamme sen ennen matkaa. Polttoaine, lataus, tiemaksut ja pysäköinti kerrotaan tarjouksessa erikseen.`,
      intro: (name, from) => `${name}: ${from}. Hinta sisältää arvonlisäveron.`,
      typical: (a, b) => `Tyypillinen hinta pääkaupunkiseudulla on ${a}–${b} € reitin, ajankohdan ja odotuksen mukaan.`,
      indicative: 'Näet ohjeellisen hinnan hintapyyntölomakkeella heti ja vahvistamme kiinteän DriveMe-hinnan ennen kuljettajan lähtöä.',
      toProvider: 'Palveluntarjoajan maksun, esimerkiksi katsastuksen tai huollon, maksat suoraan palveluntarjoajalle.',
      ownCosts: 'Mahdolliset polttoaine-, pysäköinti- ja tiemaksut kerrotaan tarjouksessa erikseen.',
    },
    appointmentLabels: {
      required: 'Vaaditaan', recommended: 'Suositeltu', none: 'Ei tarvita',
      flight: 'Lennon tiedot', depends: 'Riippuu työstä',
    },
    alt: {
      handover: 'Kuljettaja ajaa asiakkaan autoa yksin',
      corporate: 'DriveMen kuljettaja ja yritysasiakas luovuttamassa autoa',
      interior: 'Auton keskikonsoli ja vaihteenvalitsin',
    },
  },
  en: {
    cities: brand.coverage,
    notBookable: 'Not yet bookable',
    fixedQuote: 'Fixed quote',
    ackNote: 'We go through these with you before the booking is confirmed.',
    gateCleared: 'Cleared',
    gateWaiting: 'Awaiting confirmation',
    gateNoticeTitle: 'Not yet bookable',
    companyProvider: 'Service provider: ',
    companyBusinessId: 'Business ID: ',
    companyDomicile: 'Domicile: Helsinki, Finland',
    companyPhone: 'Phone: ',
    companyEmail: 'Email: ',
    companyArea: 'Service area: ',
    coverageBody: (areas) => `We currently serve ${areas}. Longer moves are priced individually.`,
    ctaBody: 'Tell us where the car is and where it needs to go. We confirm a fixed price before the drive.',
    registerInterest: 'Register interest',
    interestTitle: 'Register your interest',
    interestBody: 'We will tell you as soon as the licensing and insurance position is confirmed and the service is bookable.',
    sendEmail: 'Send an email',
    appointment: 'Appointment',
    fullPriceList: 'Full price list',
    allQuestions: 'All questions',
    safetyAndInsurance: 'Safety and insurance',
    reviewPending: 'Review pending',
    getInTouch: 'Get in touch',
    information: 'Information',
    params: { source: 'source', service: 'service', pickup: 'pickup', date: 'date', type: 'type', offer: 'offer' },
    typeValues: { move: 'move', service: 'service', journey: 'journey' },
    typicalShort: (a, b) => `Typically ${a}–${b} €`,
    safetyPoints: [
      'Timestamped photos at collection and at return',
      'Mileage and fuel or charge level recorded',
      'Handover time, place and receiver logged',
      'We state plainly which licensing and insurance items are still open',
    ],
    price: {
      gated: (name) => `${name} cannot be booked yet, so we do not publish a price for it.`,
      journey: (name) => `${name}: a fixed quote. The price comes from the route, the duration, the number of passengers and the driver's return leg, and we confirm it before the trip. Fuel, charging, tolls and parking are stated separately in the quote.`,
      intro: (name, from) => `${name}: ${from}, VAT included.`,
      typical: (a, b) => `A typical job in the capital region is ${a}–${b} €, depending on route, timing and waiting.`,
      indicative: 'You see an indicative price on the request form immediately, and we confirm a fixed DriveMe fee before the driver is sent.',
      toProvider: 'The provider\u2019s own charge, such as the inspection or the service, is paid directly to the provider.',
      ownCosts: 'Any fuel, parking or toll costs are stated separately in the quote.',
    },
    appointmentLabels: {
      required: 'Required', recommended: 'Recommended', none: 'Not needed',
      flight: 'Flight details', depends: 'Depends on the job',
    },
    alt: {
      handover: 'A driver alone at the wheel of a customer\u2019s car',
      corporate: 'A DriveMe driver and business customer handing over a vehicle',
      interior: 'The centre console and gear selector of a car',
    },
  },
  sv: SV.words,
};

/**
 * Site-wide content: brand, navigation, coverage, contact and the legal
 * boundary copy that has to read identically on every page.
 *
 * Source: "DriveMe - Service and Website Growth Strategy" (Mansio Group Oy,
 * 8 September 2026) - §6 responsibility boundaries, §8 information
 * architecture, §9/§9.1 homepage copy.
 *
 * Finnish is the primary market language (§8). English mirrors it under /en/.
 * Swedish is deliberately NOT generated yet: §8 forbids machine-translating
 * legal terms and service promises, so /sv/ waits for a human translation of
 * this file. Until then no sv-FI hreflang is emitted - a broken alternate is
 * worse than a missing one.
 */

export const LOCALES = ['fi', 'en'];
export const DEFAULT_LOCALE = 'fi';

export const ORIGIN = 'https://driveme.fi';

export const brand = {
  name: 'DriveMe',
  legalName: 'Mansio Group Oy',
  phone: '+358 50 357 2836',
  phoneHref: '+358503572836',
  email: 'info@driveme.fi',
  city: 'Helsinki',
  country: 'FI',
  // §12 audit, "Coverage differs": one launch area, used everywhere.
  coverage: ['Helsinki', 'Espoo', 'Vantaa', 'Kauniainen'],
};

/**
 * Which nav keys appear in the header bar. Safety and FAQ are deliberately
 * absent: §8 lists them in the navigation, but seven items leave the Finnish
 * labels — which run about 30% longer than the English — with no room to
 * breathe. Both stay one hover away in the services menu, sit in the footer,
 * and are linked from the homepage sections that describe them.
 */
export const headerNav = ['services', 'how', 'pricing', 'business', 'contact'];

/** §8 recommended navigation — the full set of top-level pages. */
export const nav = {
  fi: [
    { key: 'services', label: 'Palvelut', href: '/palvelut/', menu: true },
    { key: 'how', label: 'Näin se toimii', href: '/nain-se-toimii/' },
    { key: 'pricing', label: 'Hinnasto', href: '/hinnasto/' },
    { key: 'business', label: 'Yrityksille', href: '/yrityksille/' },
    { key: 'safety', label: 'Turvallisuus', href: '/turvallisuus/' },
    { key: 'faq', label: 'Usein kysyttyä', href: '/usein-kysyttya/' },
    { key: 'contact', label: 'Yhteystiedot', href: '/yhteystiedot/' },
  ],
  en: [
    { key: 'services', label: 'Services', href: '/en/services/', menu: true },
    { key: 'how', label: 'How it works', href: '/en/how-it-works/' },
    { key: 'pricing', label: 'Pricing', href: '/en/pricing/' },
    { key: 'business', label: 'For companies', href: '/en/for-companies/' },
    { key: 'safety', label: 'Safety', href: '/en/safety/' },
    { key: 'faq', label: 'FAQ', href: '/en/faq/' },
    { key: 'contact', label: 'Contact', href: '/en/contact/' },
  ],
};

/** Headings inside the services drop-down (grouped as the two paths). */
export const menuGroups = {
  fi: {
    concierge: 'Hoida autoni puolestani',
    driver: 'Tarvitsen kuljettajan',
    business: 'Lisää',
    all: 'Kaikki palvelut',
    pricing: 'Hinnasto',
    safety: 'Turvallisuus',
    faq: 'Usein kysyttyä',
    gated: 'Odottaa lupaa',
  },
  en: {
    concierge: 'Take care of my car',
    driver: 'I need a driver',
    business: 'More',
    all: 'All services',
    pricing: 'Pricing',
    safety: 'Safety',
    faq: 'FAQ',
    gated: 'Awaiting clearance',
  },
};

export const ui = {
  fi: {
    lang: 'fi-FI',
    skip: 'Siirry sisältöön',
    bookCta: 'Varaa DriveMe',
    bookHref: '/varaus/',
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
    finalCta: 'Anna meidän hoitaa ajaminen',
    priceFrom: 'alkaen',
    vatNote: 'Hinnat sisältävät arvonlisäveron.',
    thirdParty: 'Kolmannen osapuolen maksut eivät sisälly hintaan, vaan ne maksetaan suoraan palveluntarjoajalle.',
    onThisPage: 'Tällä sivulla',
    allServices: 'Kaikki palvelut',
    readMore: 'Lue lisää',
  },
  en: {
    lang: 'en-FI',
    skip: 'Skip to content',
    bookCta: 'Book DriveMe',
    bookHref: '/en/booking/',
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
    finalCta: 'Let us handle the driving',
    priceFrom: 'from',
    vatNote: 'Prices include Finnish VAT.',
    thirdParty: 'Third-party charges are not included and are paid directly to the provider.',
    onThisPage: 'On this page',
    allServices: 'All services',
    readMore: 'Read more',
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
    { icon: 'clock', label: 'Vastaamme alle 15 minuutissa' },
    { icon: 'pin', label: 'Helsinki, Espoo, Vantaa, Kauniainen' },
  ],
  en: [
    { icon: 'price', label: 'Price confirmed in advance' },
    { icon: 'driver', label: 'Professional driver' },
    { icon: 'doc', label: 'Documented pickup and return' },
    { icon: 'clock', label: 'We answer within 15 minutes' },
    { icon: 'pin', label: 'Helsinki, Espoo, Vantaa, Kauniainen' },
  ],
};

/** §7 customer journey, condensed to the four customer-facing steps (§9). */
export const howItWorks = {
  fi: [
    { t: 'Valitse palvelu ja lähetä tiedot', d: 'Kerro nouto-osoite, kohde, ajankohta ja auton tiedot. Näet ohjeellisen hinnan heti.' },
    { t: 'DriveMe vahvistaa ajan, kuljettajan ja hinnan', d: 'Pyyntö ei ole vahvistettu ennen kuin olemme hyväksyneet sen. Vastaamme palveluaikana alle 15 minuutissa.' },
    { t: 'Dokumentoimme auton kunnon ja luovutuksen', d: 'Aikaleimatut kuvat, mittarilukema sekä polttoaine- tai lataustaso noudon yhteydessä.' },
    { t: 'Saat tilapäivitykset ja vahvistuksen', d: 'Jokainen luovutus kuitataan, ja saat vahvistuksen toimituksesta tai palautuksesta.' },
  ],
  en: [
    { t: 'Choose a service and send the details', d: 'Tell us the collection address, destination, timing and vehicle details. You see an indicative price immediately.' },
    { t: 'DriveMe confirms the time, driver and price', d: 'A request is not confirmed until we accept it. We answer within 15 minutes during service hours.' },
    { t: 'We document the vehicle and handover at collection', d: 'Timestamped photos, mileage and fuel or charge level when the car is collected.' },
    { t: 'You receive status updates and confirmation', d: 'Every handover is recorded, and you get confirmation of the delivery or return.' },
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
    tagline: 'Kuljettaja- ja ajoneuvopalvelu pääkaupunkiseudulla.',
    columns: [
      { title: 'Auton hoito', keys: ['inspection', 'workshop', 'tyre', 'wash', 'glass'] },
      { title: 'Siirrot ja luovutukset', keys: ['pickupReturn', 'relocation', 'dealer'] },
      { title: 'Kuljettajapalvelut', keys: ['personalDriver', 'safeRideHome', 'airport'] },
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
    tagline: 'Driver and vehicle concierge service in the Helsinki capital region.',
    columns: [
      { title: 'Vehicle care', keys: ['inspection', 'workshop', 'tyre', 'wash', 'glass'] },
      { title: 'Moves and handovers', keys: ['pickupReturn', 'relocation', 'dealer'] },
      { title: 'Driver services', keys: ['personalDriver', 'safeRideHome', 'airport'] },
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

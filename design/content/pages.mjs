/**
 * Standalone pages: the homepage and the seven supporting pages in the §8
 * information architecture, expressed as blocks the renderer understands.
 *
 * Block vocabulary (see build/blocks.mjs):
 *   prose | list | steps | table | faq | callout | cards | cta | priceTable |
 *   statusRail | ackList | gateList
 */

import { PRODUCTS, WAITING, PREMIUMS, CANCELLATION } from '../api/_lib/pricing.js';

const fmt = (n) => `${n} €`;

/* -------------------------------------------------------------------------
 * Homepage (§9 Finnish, §9.1 English) in the §12.1 rebuild order.
 * ---------------------------------------------------------------------- */
export const home = {
  fi: {
    slug: '',
    title: 'DriveMe | Kuljettajapalvelu ja auton noutopalvelu',
    description: 'Varaa kuljettaja omalle autollesi tai auton nouto katsastukseen, huoltoon, renkaanvaihtoon, pesuun tai siirtoon pääkaupunkiseudulla.',
    eyebrow: 'Kuljettaja- ja ajoneuvopalvelu',
    h1: 'Sinun aikasi on arvokas. Me hoidamme ajamisen.',
    h1Accent: 'Sinun aikasi on arvokas.',
    h1Rest: 'Me hoidamme ajamisen.',
    lead: 'Tarvitsetko kuljettajan omalle autollesi tai luotettavan henkilön viemään autosi katsastukseen, huoltoon, renkaanvaihtoon tai pesuun? DriveMe noutaa, ajaa ja palauttaa ajoneuvosi sovitusti - selkeällä hinnalla ja dokumentoidulla luovutuksella.',
    paths: [
      {
        key: 'concierge',
        label: 'Hoida autoni puolestani',
        body: 'Me noudamme ajokuntoisen autosi, toimitamme sen valitsemaasi palveluun tai osoitteeseen ja palautamme sen sovitusti. Kolmannen osapuolen palvelu ja maksut sovitaan suoraan asiakkaan ja palveluntarjoajan välillä.',
        href: '/varaus/?polku=auto',
        cta: 'Pyydä hinta',
        linkLabel: 'Katso auton hoitopalvelut',
        linkHref: '/palvelut/',
      },
      {
        key: 'driver',
        label: 'Tarvitsen kuljettajan',
        body: 'Varaa kuljettaja omalle autollesi illaksi, tapahtumaan, lentoasemalle tai usean pysähdyksen päiväksi. Sinä päätät reitin ja aikataulun.',
        // Gate A is open, so this path leads to the service page and its
        // clearance notice rather than to a request form that would refuse it.
        gated: true,
        href: '/oma-kuljettaja/',
        cta: 'Lue kuljettajapalvelusta',
        linkLabel: 'Turvallinen kotiinkuljetus',
        linkHref: '/turvallinen-kotiinkuljetus/',
      },
    ],
    // Hero quick start: the first three fields of the §7 request, handed to
    // /varaus/ as query parameters. Not a second booking interface - it
    // cannot submit anything, and it says so.
    quick: {
      title: 'Pyydä hinta *muutamassa sekunnissa*',
      service: 'Palvelu',
      pickup: 'Nouto-osoite tai postinumero',
      pickupPlaceholder: 'Esim. Mannerheimintie 1, Helsinki',
      date: 'Päivämäärä',
      from: 'alkaen',
      submit: 'Jatka pyyntöön',
      note: 'Pyyntö ei ole vielä vahvistus. Vahvistamme kuljettajan, ajan ja kiinteän hinnan erikseen.',
      driverLink: 'Tarvitsetko kuljettajan omalle autollesi?',
    },
    popularTitle: 'Suositut *palvelut*',
    popularKeys: ['inspection', 'workshop', 'tyre', 'wash', 'relocation', 'dealer'],
    howTitle: 'Näin se *toimii*',
    priceTitle: 'Selkeä hinta *ennen ajoa*',
    priceLead: 'Näet ohjeellisen hinnan heti ja vahvistamme kiinteän DriveMe-hinnan ennen kuljettajan lähtöä. Kolmannen osapuolen maksut eivät sisälly, vaan maksat ne suoraan valitsemallesi palveluntarjoajalle.',
    driverTitle: 'Kuljettaja *omalle autollesi*',
    driverBody: 'Ammattikuljettaja ajaa omaa autoasi illan, tapahtuman, työpäivän tai lentoasemamatkan ajan. Kategoria odottaa viranomais- ja vakuutusvahvistusta, joten otamme toistaiseksi vastaan vain yhteydenottoja.',
    businessTitle: 'Yritysautojen *siirrot*',
    businessBody: 'Toistuvat siirrot, huoltoajot ja työntekijäluovutukset yhdeltä kumppanilta, työkohtaisella tilatiedolla ja yhdellä kuukausilaskulla.',
    safetyTitle: 'Näin suojaamme *autosi ja tietosi*',
    safetyBody: 'Dokumentoimme jokaisen noudon ja luovutuksen aikaleimatuin kuvin, kirjaamme mittarilukeman ja polttoaine- tai lataustason ja kerromme avoimesti, mitä vakuutus ja lupa-asiat tällä hetkellä kattavat.',
    ctaTitle: 'Anna meidän *hoitaa ajaminen*',
    ctaBody: 'Pyydä hinta ja varaa DriveMe. Vastaamme palveluaikana alle 15 minuutissa.',
  },
  en: {
    slug: 'en',
    title: 'DriveMe | Driver and vehicle concierge in Helsinki',
    description: 'Book a driver for your own car, or vehicle collection to an inspection, workshop, tyre service, wash or relocation in the Helsinki capital region.',
    eyebrow: 'Driver and vehicle concierge',
    h1: 'Your time matters. We take care of the driving.',
    h1Accent: 'Your time matters.',
    h1Rest: 'We take care of the driving.',
    lead: 'Need a driver for your own car, or someone reliable to take your vehicle to an inspection, workshop, tyre service or car wash? DriveMe collects, drives and returns your vehicle as agreed - with clear pricing and documented handovers.',
    paths: [
      {
        key: 'concierge',
        label: 'Take care of my car',
        body: 'We collect your roadworthy vehicle, deliver it to your chosen service provider or address and return it as agreed. Third-party services and charges remain a separate agreement between you and the provider.',
        href: '/en/booking/?path=car',
        cta: 'Request a price',
        linkLabel: 'See vehicle services',
        linkHref: '/en/services/',
      },
      {
        key: 'driver',
        label: 'I need a driver',
        body: 'Book a driver for your own vehicle for an evening, an event, an airport journey or a multi-stop day. You decide the route and schedule.',
        gated: true,
        href: '/en/personal-driver/',
        cta: 'Read about the driver service',
        linkLabel: 'Safe ride home',
        linkHref: '/en/safe-ride-home/',
      },
    ],
    quick: {
      title: 'Request a price *in seconds*',
      service: 'Service',
      pickup: 'Collection address or postcode',
      pickupPlaceholder: 'e.g. Mannerheimintie 1, Helsinki',
      date: 'Date',
      from: 'from',
      submit: 'Continue to the request',
      note: 'A request is not yet a confirmation. We confirm the driver, the time and a fixed fee separately.',
      driverLink: 'Need a driver for your own car?',
    },
    popularTitle: 'Popular *services*',
    popularKeys: ['inspection', 'workshop', 'tyre', 'wash', 'relocation', 'dealer'],
    howTitle: 'How it *works*',
    priceTitle: 'A clear price *before the drive*',
    priceLead: 'You see an indicative price immediately and we confirm a fixed DriveMe fee before the driver is sent. Third-party charges are not included - you pay those directly to the provider you choose.',
    driverTitle: 'A driver *for your own car*',
    driverBody: 'A professional driver operates your own car for an evening, an event, a working day or an airport journey. The category is awaiting regulatory and insurance confirmation, so for now we only take expressions of interest.',
    businessTitle: 'Company *vehicle movements*',
    businessBody: 'Recurring movements, service runs and employee handovers from one partner, with job-level status and a single monthly invoice.',
    safetyTitle: 'How we protect *your car and your data*',
    safetyBody: 'We document every collection and handover with timestamped photos, record mileage and fuel or charge level, and state plainly what our insurance and licensing position currently covers.',
    ctaTitle: 'Let us *handle the driving*',
    ctaBody: 'Request a price and book DriveMe. We answer within 15 minutes during service hours.',
  },
};

/* -------------------------------------------------------------------------
 * Services hub
 * ---------------------------------------------------------------------- */
export const servicesHub = {
  fi: {
    slug: 'palvelut',
    title: 'Kuljettaja- ja auton siirtopalvelut | DriveMe',
    description: 'Kaikki DriveMen palvelut: auton nouto katsastukseen, huoltoon, renkaanvaihtoon ja pesuun, siirrot, autoliikeluovutukset sekä kuljettajapalvelut.',
    h1: 'Kuljettaja- ja *auton siirtopalvelut*',
    lead: 'Kaksi tapaa käyttää DriveMeä: hankit kuljettajan omalle autollesi, tai annat meidän hoitaa auton siirrot puolestasi. Palveluntarjoajan saat aina valita itse.',
    groups: [
      { title: 'Hoida autoni puolestani', body: 'Auton nouto, toimitus valitsemaasi palveluun ja palautus sovitusti.', keys: ['inspection', 'workshop', 'tyre', 'wash', 'glass', 'pickupReturn', 'relocation', 'dealer'] },
      { title: 'Tarvitsen kuljettajan', body: 'Ammattikuljettaja ajaa omaa autoasi. Kategoria odottaa viranomais- ja vakuutusvahvistusta.', keys: ['personalDriver', 'safeRideHome', 'airport'] },
      { title: 'Yrityksille', body: 'Toistuvat siirrot, huoltoajot ja luovutukset yhdellä sopimuksella.', keys: ['business'] },
    ],
  },
  en: {
    slug: 'en/services',
    title: 'Driver and vehicle concierge services | DriveMe',
    description: 'Every DriveMe service: car collection to inspection, workshop, tyre service and wash, relocations, dealer handovers and driver services.',
    h1: 'Driver and *vehicle concierge* services',
    lead: 'Two ways to use DriveMe: get a driver for your own car, or let us handle the vehicle movements. You always choose the provider.',
    groups: [
      { title: 'Take care of my car', body: 'Collection, delivery to the provider you choose, and return as agreed.', keys: ['inspection', 'workshop', 'tyre', 'wash', 'glass', 'pickupReturn', 'relocation', 'dealer'] },
      { title: 'I need a driver', body: 'A professional driver operates your own car. This category awaits regulatory and insurance clearance.', keys: ['personalDriver', 'safeRideHome', 'airport'] },
      { title: 'For companies', body: 'Recurring movements, service runs and handovers under one agreement.', keys: ['business'] },
    ],
  },
};

/* -------------------------------------------------------------------------
 * Pricing (§5)
 * ---------------------------------------------------------------------- */
const priceRowsFi = [
  ['Yhdensuuntainen siirto', `alkaen ${fmt(PRODUCTS.oneWay.from)}`, 'Yksi nouto ja yksi toimitus', 'Kiinteä hinta vahvistetaan reitin ja ajankohdan perusteella'],
  ['Nouto ja myöhempi palautus', `alkaen ${fmt(PRODUCTS.pickupReturn.from)}`, 'Kaksi sovittua siirtoa', 'Palveluntarjoajan aikaa ei veloiteta, kun kuljettaja lähtee pois'],
  ['Odota ja palauta', `alkaen ${fmt(PRODUCTS.waitReturn.from)}`, `Nouto, enintään ${WAITING.waitReturnIncludedMinutes} min odotus, palautus`, `Sen jälkeen ${fmt(WAITING.hourlyRate)}/h ${WAITING.unitMinutes} minuutin erissä`],
  ['Auton vienti katsastukseen', `alkaen ${fmt(PRODUCTS.inspection.from)}`, 'Nouto, katsastuskäynti, palautus', 'Katsastusmaksut eivät sisälly'],
  ['Huolto-, rengas- tai pesuajo', `alkaen ${fmt(PRODUCTS.serviceRun.from)}`, 'Nouto ja palautus', 'Kolmannen osapuolen maksut eivät sisälly'],
  ['Kuljettaja lentoasemalle omalla autolla', `alkaen ${fmt(PRODUCTS.airport.from)}`, 'Ennalta varattu kuljettaja ja sovittu logistiikka', 'Vasta lupa- ja vakuutusvahvistuksen jälkeen'],
  ['Oma kuljettaja', `${fmt(PRODUCTS.personalDriver.from)}/h`, 'Kuljettajan aika', `Suositeltu minimi ${PRODUCTS.personalDriver.minHours} tuntia; vasta lupa- ja vakuutusvahvistuksen jälkeen`],
  ['Kotiinkuljetus omalla autolla', 'Kiinteä tarjous', 'Asiakas ja auto määränpäähän', 'Hinta reitin ja kuljettajalogistiikan mukaan'],
  ['Pitkän matkan siirto', 'Kiinteä tarjous', 'Ajettu siirto', 'Polttoaine, lataus ja paluulogistiikka eritellään'],
  ['Yritysasiakkaat', 'Sopimushinta', 'Volyymi, raportointi ja laskutus', 'Kuukausittainen vähimmäismäärä tai palvelumaksu'],
];

const priceRowsEn = [
  ['One-way vehicle move', `from ${fmt(PRODUCTS.oneWay.from)}`, 'One collection and one delivery', 'Final fixed quote based on route and time'],
  ['Pickup and later return', `from ${fmt(PRODUCTS.pickupReturn.from)}`, 'Two scheduled movements', 'Provider time is not billed once the driver has left'],
  ['Wait and return', `from ${fmt(PRODUCTS.waitReturn.from)}`, `Collection, up to ${WAITING.waitReturnIncludedMinutes} min wait, return`, `Then ${fmt(WAITING.hourlyRate)}/h in ${WAITING.unitMinutes}-minute units`],
  ['Vehicle inspection run', `from ${fmt(PRODUCTS.inspection.from)}`, 'Collection, inspection visit, return', 'Inspection fees excluded'],
  ['Workshop, tyre or wash run', `from ${fmt(PRODUCTS.serviceRun.from)}`, 'Pickup and return', 'Third-party fees excluded'],
  ['Own-car airport driver', `from ${fmt(PRODUCTS.airport.from)}`, 'Pre-booked driver and agreed logistics', 'Only after legal and insurance clearance'],
  ['Personal driver', `${fmt(PRODUCTS.personalDriver.from)}/h`, 'Driver time', `Recommended ${PRODUCTS.personalDriver.minHours}-hour minimum; only after legal and insurance clearance`],
  ['Designated one-way', 'Fixed quote', 'Customer and car to the destination', 'Quoted from route and dispatch cost'],
  ['Long-distance relocation', 'Fixed quote', 'Driven relocation', 'Fuel, charging and return logistics stated explicitly'],
  ['Corporate fleet', 'Contract pricing', 'Volume, reporting and invoicing', 'Minimum monthly volume or service fee'],
];

export const pricing = {
  fi: {
    slug: 'hinnasto',
    title: 'DriveMe hinnasto | Kuljettaja- ja noutopalvelut',
    description: 'DriveMen hinnat: yhdensuuntainen siirto alkaen 59 €, nouto ja palautus alkaen 99 €, katsastusajo alkaen 119 €. Kolmannen osapuolen maksut eivät sisälly.',
    h1: 'DriveMe *hinnasto*',
    lead: 'Hinnat sisältävät arvonlisäveron. Näet ohjeellisen hinnan heti varauslomakkeella ja vahvistamme kiinteän DriveMe-hinnan ennen kuljettajan lähtöä.',
    blocks: [
      {
        type: 'priceTable',
        head: ['Palvelu', 'Hinta', 'Sisältää', 'Huomioitavaa'],
        rows: priceRowsFi,
      },
      {
        type: 'callout', tone: 'info', title: 'Mistä hinta muodostuu',
        body: 'Hinta lasketaan lähtömaksusta, kuljettajan ajasta, tukiauton ajasta, reitin kilometreistä, odotetusta odotuksesta, pysäköinnistä ja tiemaksuista sekä mahdollisesta ajankohtalisästä. Emme pyydä sinua laskemaan kilometrejä minkään rajan ulkopuolelta: annat osoitteet ja ajan, me annamme yhden hinnan.',
      },
      {
        type: 'list', title: 'Selkeästi kerrotut lisät', variant: 'plain',
        items: [
          `Yötyö klo ${PREMIUMS.night.fromHour}-${String(PREMIUMS.night.toHour).padStart(2, '0')}: +${PREMIUMS.night.pct} %`,
          `Viikonloppu: +${PREMIUMS.weekend.pct} %`,
          `Arkipyhä: +${PREMIUMS.publicHoliday.pct} %`,
          `Kiireellinen tilaus alle ${PREMIUMS.urgent.withinHours} tuntia ennen noutoa: +${PREMIUMS.urgent.pct} %`,
          'Lisät eivät kertaudu: veloitamme vain yhden, korkeimman lisän.',
        ],
        note: 'Lisät näkyvät erillisinä riveinä hinta-arviossa ennen kuin lähetät pyynnön.',
      },
      {
        type: 'list', title: 'Odotus', variant: 'plain',
        items: [
          `Jokaiseen luovutukseen sisältyy ${WAITING.includedMinutes} minuuttia odotusta.`,
          `"Odota ja palauta" -tuotteeseen sisältyy ${WAITING.waitReturnIncludedMinutes} minuuttia.`,
          `Sen jälkeen odotus veloitetaan ${fmt(WAITING.hourlyRate)}/h ${WAITING.unitMinutes} minuutin erissä.`,
        ],
      },
      {
        type: 'list', title: 'Mikä ei sisälly hintaan', variant: 'cross',
        items: [
          'Katsastus-, huolto-, korjaus-, rengas-, pesu- ja detailing-maksut',
          'Polttoaine, lataus, pysäköinti ja tiemaksut, ellei tarjouksessa toisin sanota',
          'Kolmannen osapuolen peruutus- tai käsittelymaksut',
          'Hinaus, lavettikuljetus tai auton säilytys',
        ],
        note: 'Kolmannen osapuolen palvelut maksat suoraan valitsemallesi palveluntarjoajalle.',
      },
      { type: 'cancellation', title: 'Peruutusehdot', id: 'peruutus' },
      {
        type: 'callout', tone: 'warn', title: 'Miksi emme näytä valmista loppusummaa',
        body: 'Reitti, luovutusaika ja odotus vaikuttavat todelliseen kustannukseen. Näytämme siksi ohjeellisen alkaen-hinnan ja vahvistamme kiinteän hinnan ennen ajoa. Emme veloita enempää kuin vahvistettu hinta ilman erikseen sovittua muutosta.',
      },
    ],
  },
  en: {
    slug: 'en/pricing',
    title: 'DriveMe pricing | Driver and vehicle concierge',
    description: 'DriveMe prices: one-way move from 59 €, pickup and return from 99 €, inspection run from 119 €. Third-party charges are not included.',
    h1: 'DriveMe *pricing*',
    lead: 'Prices include Finnish VAT. You see an indicative price on the request form and we confirm a fixed DriveMe fee before the driver is sent.',
    blocks: [
      { type: 'priceTable', head: ['Service', 'Price', 'Includes', 'Notes'], rows: priceRowsEn },
      {
        type: 'callout', tone: 'info', title: 'How the price is formed',
        body: 'From the dispatch fee, driver time, support-vehicle time, route kilometres, expected waiting, parking and tolls, plus any timing premium. We never ask you to calculate kilometres outside a boundary: you give the addresses and the time, we give one price.',
      },
      {
        type: 'list', title: 'Clearly disclosed premiums', variant: 'plain',
        items: [
          `Night work ${PREMIUMS.night.fromHour}:00-0${PREMIUMS.night.toHour}:00: +${PREMIUMS.night.pct}%`,
          `Weekend: +${PREMIUMS.weekend.pct}%`,
          `Public holiday: +${PREMIUMS.publicHoliday.pct}%`,
          `Urgent request under ${PREMIUMS.urgent.withinHours} hours before pickup: +${PREMIUMS.urgent.pct}%`,
          'Premiums do not stack: only the single highest one is charged.',
        ],
        note: 'Premiums appear as separate lines in the estimate before you send the request.',
      },
      {
        type: 'list', title: 'Waiting', variant: 'plain',
        items: [
          `Every handover includes ${WAITING.includedMinutes} minutes of waiting.`,
          `The "wait and return" product includes ${WAITING.waitReturnIncludedMinutes} minutes.`,
          `Beyond that, waiting is ${fmt(WAITING.hourlyRate)}/h in ${WAITING.unitMinutes}-minute units.`,
        ],
      },
      {
        type: 'list', title: 'What the price does not include', variant: 'cross',
        items: [
          'Inspection, maintenance, repair, tyre, wash and detailing charges',
          'Fuel, charging, parking and tolls unless the quote says otherwise',
          'Third-party cancellation or handling fees',
          'Towing, trailer transport or vehicle storage',
        ],
        note: 'Third-party services are paid directly to the provider you choose.',
      },
      { type: 'cancellation', title: 'Cancellation', id: 'cancellation' },
      {
        type: 'callout', tone: 'warn', title: 'Why we do not show a finished total',
        body: 'Route, handover time and waiting all move the real cost. So we show an indicative starting price and confirm a fixed fee before the drive. We do not charge more than the confirmed fee without a separately agreed change.',
      },
    ],
  },
};

/* -------------------------------------------------------------------------
 * How it works (§7)
 * ---------------------------------------------------------------------- */
export const howPage = {
  fi: {
    slug: 'nain-se-toimii',
    title: 'Näin DriveMe toimii | Pyynnöstä valmiiseen työhön',
    description: 'Pyynnöstä vahvistukseen, noudosta dokumentoituun luovutukseen. Näin DriveMe-varaus etenee ja mitä tietoja tarvitsemme.',
    h1: 'Näin DriveMe *toimii*',
    lead: 'Kaikki varaukset vahvistetaan käsin. Se on hitaampaa kuin automaattinen kuittaus, mutta se tarkoittaa, että jokaisella vahvistetulla työllä on oikea kuljettaja, oikea aika ja oikea hinta.',
    blocks: [
      {
        type: 'steps', title: 'Asiakkaan polku', rows: true, two: true,
        items: [
          { t: 'Valitse polku', d: 'Tarvitsen kuljettajan tai hoida autoni puolestani.' },
          { t: 'Valitse palvelu ja tapa', d: 'Yhdensuuntainen, nouto ja palautus vai odota ja palauta.' },
          { t: 'Anna osoitteet ja ajankohta', d: 'Nouto, kohde tai palveluntarjoaja, palautusosoite ja ajanvarauksen tiedot.' },
          { t: 'Anna auton tiedot ja hyväksy ehdot', d: 'Rekisteritunnus, vaihteisto, käyttövoima sekä kelpoisuus- ja valtuutusvakuutukset.' },
          { t: 'Näet ohjeellisen hinnan ja lähetät pyynnön', d: 'Pyyntö ei vielä sido kumpaakaan osapuolta.' },
          { t: 'DriveMe vahvistaa kuljettajan, ajan ja hinnan', d: 'Vasta vahvistus tekee varauksesta sitovan.' },
          { t: 'Nouto dokumentoidaan', d: 'Avaimet, kunto, mittarilukema ja polttoaine- tai lataustaso aikaleimatuin kuvin.' },
          { t: 'Saat tilapäivitykset', d: 'Jokaisesta luovutuksesta ilmoitetaan.' },
          { t: 'Palautus tai toimitus kuitataan', d: 'Sinä tai valtuuttamasi vastaanottaja vahvistaa vastaanoton.' },
          { t: 'Saat kuitin tai laskun', d: 'Sekä lyhyen arviointipyynnön.' },
        ],
      },
      { type: 'statusRail', title: 'Työn tila' },
      {
        type: 'list', title: 'Mitä tietoja tarvitsemme', variant: 'plain', two: true,
        items: [
          'Yhteystiedot: nimi, puhelin, sähköposti sekä yrityksen tiedot ja Y-tunnus laskutusasiakkaille.',
          'Palvelu: tyyppi, yhdensuuntainen tai palautuksella, päivämäärä, noutoikkuna ja tarvittava toimitusaika.',
          'Osoitteet: nouto, palveluntarjoaja tai kohde, palautusosoite sekä kulku- ja pysäköintiohjeet.',
          'Ajanvaraus: palveluntarjoaja, vahvistettu aika, varausnumero, yhteyshenkilö ja avainten luovutustapa.',
          'Ajoneuvo: rekisteritunnus, merkki, malli, vuosimalli, vaihteisto, käyttövoima, mittarilukema ja erityiset hallintalaitteet.',
          'Kelpoisuus: ajokuntoisuus, vakuutus, rekisteröinti, katsastus, ajokiellon puuttuminen ja tiedossa olevat viat.',
          'Luovutus: omistajan tai haltijan valtuutus, noudon ja toimituksen yhteyshenkilöt, avaintapa ja asiakirjat.',
          'Maksu: DriveMe-maksutapa, kolmannen osapuolen maksu suoraan, pysäköinnin ja polttoaineen käsittely sekä laskutustiedot.',
        ],
      },
      {
        type: 'callout', tone: 'info', title: 'Pyyntö ei ole vahvistus',
        body: 'Lomakkeen lähettäminen luo pyynnön. Työ on vahvistettu vasta, kun saat meiltä vahvistuksen kuljettajasta, ajasta ja kiinteästä hinnasta.',
      },
    ],
  },
  en: {
    slug: 'en/how-it-works',
    title: 'How DriveMe works | From request to completed job',
    description: 'From request to confirmation, from collection to documented handover. How a DriveMe booking runs and what information we need.',
    h1: 'How DriveMe *works*',
    lead: 'Every booking is confirmed by a person. That is slower than an automatic receipt, but it means every confirmed job has a real driver, a real time and a real price.',
    blocks: [
      {
        type: 'steps', title: 'The customer journey', rows: true, two: true,
        items: [
          { t: 'Choose a path', d: 'I need a driver, or take care of my car.' },
          { t: 'Choose the service and shape', d: 'One-way, pickup and return, or wait and return.' },
          { t: 'Give addresses and timing', d: 'Collection, provider or destination, return address and appointment details.' },
          { t: 'Give vehicle details and accept the statements', d: 'Registration, transmission, fuel type, plus eligibility and authorisation.' },
          { t: 'See the indicative price and send the request', d: 'A request does not yet bind either side.' },
          { t: 'DriveMe confirms driver, time and fee', d: 'Only the confirmation makes the booking binding.' },
          { t: 'Collection is documented', d: 'Keys, condition, mileage and fuel or charge level in timestamped photos.' },
          { t: 'You receive status updates', d: 'Every handover is notified.' },
          { t: 'Return or delivery is signed off', d: 'You or your authorised recipient confirms receipt.' },
          { t: 'You receive a receipt or invoice', d: 'Plus a short rating request.' },
        ],
      },
      { type: 'statusRail', title: 'Job status' },
      {
        type: 'list', title: 'What we need from you', variant: 'plain', two: true,
        items: [
          'Contact: name, phone, email, plus company details and Business ID for invoiced accounts.',
          'Service: type, one-way or with return, date, collection window and required delivery time.',
          'Locations: collection, provider or destination, return address, access and parking instructions.',
          'Appointment: provider, confirmed time, booking reference, contact and key-drop method.',
          'Vehicle: registration, make, model, year, transmission, fuel type, mileage and special controls.',
          'Eligibility: roadworthy, insured, registered, inspected, no driving ban, known faults.',
          'Handover: owner or keeper authority, pickup and delivery contacts, key method, documents.',
          'Payment: DriveMe payment method, third-party paid directly, parking and fuel treatment, invoice details.',
        ],
      },
      {
        type: 'callout', tone: 'info', title: 'A request is not a confirmation',
        body: 'Submitting the form creates a request. The job is confirmed only when you receive our confirmation of the driver, time and fixed fee.',
      },
    ],
  },
};

/* -------------------------------------------------------------------------
 * Safety (§6.1, §7.1)
 * ---------------------------------------------------------------------- */
const splitFi = [
  ['Turvallinen ajo ja luovutus', 'Vastuussa', 'Antaa oikeat tiedot autosta', 'Ei vastuussa'],
  ['Ajanvarauksen olemassaolo', 'Tarkistaa annetut tiedot', 'Varaa ja vahvistaa', 'Vahvistaa saatavuuden'],
  ['Korjaus-, katsastus- ja pesutyö', 'Ei palveluntarjoaja', 'Valitsee ja hyväksyy', 'Vastuussa'],
  ['Kolmannen osapuolen maksu', 'Ei maksa etukäteen', 'Maksaa suoraan', 'Laskuttaa ja perii'],
  ['Ajoneuvon kelpoisuus', 'Voi kieltäytyä tarkistusten jälkeen', 'Takaa ja ilmoittaa', 'Voi kieltäytyä vastaanotosta'],
  ['DriveMe-hinta ja aikataulu', 'Kertoo ja toteuttaa', 'Maksaa ja on tavoitettavissa luovutuksessa', 'Ei vastuussa'],
];
const splitEn = [
  ['Safe driving and handover', 'Responsible', 'Accurate vehicle disclosure', 'Not responsible'],
  ['Appointment exists', 'Checks supplied details', 'Books and confirms', 'Confirms availability'],
  ['Repair, inspection or wash work', 'Not the provider', 'Selects and approves', 'Responsible'],
  ['Third-party payment', 'Does not advance by default', 'Pays directly', 'Invoices and collects'],
  ['Vehicle eligibility', 'May refuse after checks', 'Warrants and discloses', 'May refuse intake'],
  ['DriveMe fee and timing', 'Discloses and delivers', 'Pays and is available for handover', 'Not responsible'],
];

export const safety = {
  fi: {
    slug: 'turvallisuus',
    title: 'Näin suojaamme autosi ja tietosi | DriveMe',
    description: 'Dokumentoitu nouto ja luovutus, kuljettajien perehdytys, vakuutus- ja lupatilanne sekä poikkeustilanteiden toimintamalli.',
    h1: 'Näin suojaamme *autosi ja tietosi*',
    lead: 'Kerromme avoimesti mitä on jo käytössä ja mikä odottaa vahvistusta. Emme julkaise lupauksia, joita emme voi näyttää toteen.',
    blocks: [
      {
        type: 'list', title: 'Dokumentoimme jokaisen työn', variant: 'check',
        items: [
          'Aikaleimatut kuvat auton kaikilta sivuilta, renkaista, tuulilasista ja näkyvistä vaurioista noudossa.',
          'Mittarilukema, polttoaine- tai lataustaso ja varoitusvalot kuvattuna auton ollessa paikallaan.',
          'Avainten ja asiakirjojen vastaanoton kirjaus.',
          'Luovutuksen aika, paikka ja vastaanottaja tai hyväksytty avainlaatikko.',
          'Samat kuvat palautuksessa, jotta kunto on todennettavissa molemmissa päissä.',
        ],
      },
      { type: 'screening', title: 'Kuljettajat' },
      { type: 'gateList', title: 'Mitä odotamme ennen kuin lupaamme enemmän' },
      {
        type: 'table', title: 'Vastuunjako',
        head: ['Asia', 'DriveMe', 'Asiakas', 'Palveluntarjoaja'],
        rows: splitFi,
      },
      {
        type: 'list', title: 'Poikkeustilanteet', variant: 'plain',
        items: [
          'Palveluntarjoajalla ei ole varausta: otamme yhteyttä sinuun, odotamme vain sisältyvän ajan ja sinä ratkaiset asian suoraan palveluntarjoajan kanssa.',
          'Palveluntarjoaja pyytää lisätöitä: kuljettaja ei hyväksy mitään, vaan ohjaa pyynnön sinulle.',
          'Auto ei ole ajokuntoinen: emme aja, dokumentoimme tilanteen ja ehdotamme hinauskumppania.',
          'Auto määrätään ajokieltoon: emme aja, varmistamme avaimet ja pyydämme sinua järjestämään lainmukaisen kuljetuksen.',
          'Kolmannen osapuolen palvelu viivästyy: valitset myöhemmän palautuksen, veloitettavan odotuksen tai uuden ajan.',
          'Emme tavoita sinua: hyväksymisrajamme on 0 euroa emmekä hyväksy kolmannen osapuolen töitä.',
          'Vahinko tai onnettomuus: turvallisuus ensin, tarvittaessa hätäkeskus, ilmoitus valvomoon, kuvat ja vakuutusprosessi ilman vastuunmyöntöä paikan päällä.',
          'Avainten luovutus epäonnistuu: 15 minuutin yhteydenottoprosessi, minkä jälkeen sovelletaan vahvistettujen ehtojen mukaista epäonnistuneen luovutuksen maksua.',
        ],
      },
      { type: 'refusal', title: 'Milloin emme ota autoa ajettavaksi' },
      {
        type: 'list', title: 'Tietosi', variant: 'plain',
        items: [
          'Keräämme vain työn hoitamiseen tarvittavat tiedot ja säilytämme kuvat palvelun todentamiseksi.',
          'Emme kuvaa tarpeettomia henkilöasiakirjoja emmekä auton sisältöä ilman syytä.',
          'Pyydämme poistamaan käteisen, arvoesineet ja tarpeettomat henkilötiedot autosta ennen noutoa.',
          'Seurantalinkki on henkilökohtainen ja voimassa vain kyseisen työn ajan.',
        ],
      },
    ],
  },
  en: {
    slug: 'en/safety',
    title: 'How we protect your car and your data | DriveMe',
    description: 'Documented collection and handover, driver training, our insurance and licensing position, and how exceptions are handled.',
    h1: 'How we protect *your car and your data*',
    lead: 'We state plainly what is already in place and what is awaiting confirmation. We do not publish promises we cannot evidence.',
    blocks: [
      {
        type: 'list', title: 'Every job is documented', variant: 'check',
        items: [
          'Timestamped photos of every side of the car, wheels, windscreen and visible damage at collection.',
          'Mileage, fuel or charge level and warning lights photographed while the car is stationary.',
          'A record of the keys and documents received.',
          'Handover time, place and receiver or approved key drop.',
          'The same photos at return, so the condition is evidenced at both ends.',
        ],
      },
      { type: 'screening', title: 'Drivers' },
      { type: 'gateList', title: 'What we are waiting for before promising more' },
      { type: 'table', title: 'Responsibility split', head: ['Issue', 'DriveMe', 'Customer', 'Third-party provider'], rows: splitEn },
      {
        type: 'list', title: 'Exceptions', variant: 'plain',
        items: [
          'The provider has no appointment: we contact you, wait only within the allowance, and you resolve it directly with the provider.',
          'The provider asks for more work: the driver approves nothing and refers the request to you.',
          'The vehicle is not roadworthy: we do not drive, we document it and suggest a towing partner.',
          'The vehicle is placed under a driving ban: we do not drive, we secure the keys and ask you to arrange legal transport.',
          'The third-party service is delayed: you choose a later return, chargeable waiting, or a reschedule.',
          'We cannot reach you: our approval limit is zero euro and we approve no third-party work.',
          'Damage or accident: safety first, emergency services if needed, dispatch notification, photos, and the insurance process without admitting liability on site.',
          'Key handover fails: a 15-minute contact process, then the failed-handover fee under the confirmed terms.',
        ],
      },
      { type: 'refusal', title: 'When we will not take the car' },
      {
        type: 'list', title: 'Your data', variant: 'plain',
        items: [
          'We collect only what the job needs and keep the photos as service evidence.',
          'We do not photograph unnecessary personal documents or the contents of the car without cause.',
          'We ask you to remove cash, valuables and unnecessary personal data before collection.',
          'A tracking link is personal and valid only for that job.',
        ],
      },
    ],
  },
};

/* -------------------------------------------------------------------------
 * FAQ (§10 core service FAQs)
 * ---------------------------------------------------------------------- */
export const faqPage = {
  fi: {
    slug: 'usein-kysyttya',
    title: 'Usein kysyttyä DriveMe-palvelusta',
    description: 'Vastaukset yleisimpiin kysymyksiin: ajanvaraukset, maksut, dokumentointi, ajokelpoisuus ja peruutukset.',
    h1: 'Usein kysyttyä *DriveMe-palvelusta*',
    lead: 'Jos et löydä vastausta, soita tai kirjoita - vastaamme palveluaikana alle 15 minuutissa.',
    items: [
      { q: 'Tarvitsenko ajanvarauksen?', a: 'Kyllä katsastukseen, huoltoon, lasi- ja korikorjaamoon sekä takaisinkutsuun. Pesuun ja renkaanvaihtoon vain, jos palveluntarjoaja ei ota vastaan ilman ajanvarausta; jonotuksesta voi tulla odotusveloitus.' },
      { q: 'Kuka maksaa palveluntarjoajalle?', a: 'Asiakas maksaa suoraan. DriveMe-palkkio kattaa vain vahvistetun DriveMe-palvelun.' },
      { q: 'Voiko kuljettaja hyväksyä korjauksia?', a: 'Ei. Palveluntarjoajan on otettava yhteyttä asiakkaaseen kaikissa hyväksynnöissä.' },
      { q: 'Entä jos autoa ei voi ajaa?', a: 'DriveMe kieltäytyy työstä tai keskeyttää sen, ja asiakas järjestää hinauksen tai muun lainmukaisen kuljetuksen.' },
      { q: 'Miten auton kunto dokumentoidaan?', a: 'Aikaleimatuin kuvin noudossa ja toimituksessa sekä mittarilukemalla ja polttoaine- tai lataustasolla.' },
      { q: 'Voitteko ottaa minkä tahansa auton?', a: 'Vain laillisesti ajokuntoisen ja vakuutetun auton, joka sopii nimetylle kuljettajalle ja varauksen tietoihin.' },
      { q: 'Voiko joku muu luovuttaa avaimet?', a: 'Kyllä, kun se on valtuutettu varauksessa ja henkilöllisyys sekä luovutustapa on vahvistettu.' },
      { q: 'Sisältyykö kolmannen osapuolen maksu hintaan?', a: 'Ei, ellei tarjouksessa nimenomaisesti niin sanota.' },
      { q: 'Onko DriveMe korjaamo tai katsastusasema?', a: 'Ei. DriveMe myy kuljetuksen, säilytysvastuun ajon ajaksi, dokumentoidun luovutuksen ja sovitun koordinoinnin - ei korjausta, katsastusta, neuvontaa eikä maksunvälitystä.' },
      { q: 'Millä alueella toimitte?', a: 'Helsinki, Espoo, Vantaa ja Kauniainen. Pidemmät siirrot hinnoittelemme tapauskohtaisesti.' },
      { q: 'Milloin varaus on sitova?', a: 'Kun olemme vahvistaneet kuljettajan, ajan ja kiinteän hinnan. Lomakkeen lähettäminen luo vasta pyynnön.' },
      { q: 'Miten peruutus toimii?', a: 'Maksuton vähintään 24 tuntia ennen noutoa. Alle 24 tuntia: 50 % DriveMe-palkkiosta. Kuljettajan lähdön jälkeen veloitamme perusmaksun ja toteutuneen ajan ehtojen mukaisesti.' },
    ],
  },
  en: {
    slug: 'en/faq',
    title: 'Frequently asked questions | DriveMe',
    description: 'Answers on appointments, payments, documentation, vehicle eligibility and cancellations.',
    h1: 'Frequently *asked questions*',
    lead: 'If your answer is not here, call or write - we answer within 15 minutes during service hours.',
    items: [
      { q: 'Do I need an appointment?', a: 'Yes for inspection, workshop, glass, body shop and recall work. For a wash or tyres, only if the provider does not accept walk-ins; queue time may be charged.' },
      { q: 'Who pays the provider?', a: 'The customer pays directly. The DriveMe fee covers only the confirmed DriveMe service.' },
      { q: 'Can the driver approve repairs?', a: 'No. The provider must contact the customer for all approvals.' },
      { q: 'What if the car cannot be driven?', a: 'DriveMe refuses or pauses the job, and the customer arranges towing or legal transport.' },
      { q: 'How is condition documented?', a: 'Timestamped pickup and delivery photos plus mileage and fuel or charge level.' },
      { q: 'Can you take any vehicle?', a: 'Only a legally roadworthy, insured vehicle compatible with the assigned driver and the booking details.' },
      { q: 'Can someone else hand over the keys?', a: 'Yes, when authorised in the booking and the identity and handover method are confirmed.' },
      { q: 'Is the third-party fee included?', a: 'No, unless an offer expressly says so.' },
      { q: 'Is DriveMe a workshop or inspection station?', a: 'No. DriveMe sells transportation, custody during the drive, documented handover and agreed coordination - not repairs, inspections, advice or payment intermediation.' },
      { q: 'Where do you operate?', a: 'Helsinki, Espoo, Vantaa and Kauniainen. Longer moves are priced individually.' },
      { q: 'When is a booking binding?', a: 'When we have confirmed the driver, the time and the fixed fee. Submitting the form only creates a request.' },
      { q: 'How does cancellation work?', a: 'Free at least 24 hours before pickup. Under 24 hours: 50% of the DriveMe fee. After driver dispatch we charge the base fee and incurred time under the terms.' },
    ],
  },
};

/* -------------------------------------------------------------------------
 * Terms (§6) - developer copy, legal review required (Gate D)
 * ---------------------------------------------------------------------- */
export const terms = {
  fi: {
    slug: 'ehdot',
    title: 'Palveluehdot ja vastuunjako | DriveMe',
    description: 'DriveMen palveluehdot: vastuunjako, ajoneuvon kelpoisuus, varauksen vakuutukset, peruutusehdot ja yhteystiedot.',
    h1: 'Palveluehdot ja vastuunjako',
    lead: 'Nämä ehdot kertovat, mistä DriveMe vastaa ja mistä asiakas ja palveluntarjoaja vastaavat.',
    reviewNotice: 'Tämä sivu on toteutusversio, joka odottaa suomalaisen lakimiehen tarkastusta etämyynnin tiedonantovelvollisuudesta, peruuttamisoikeudesta, vastuusta ja reklamaatiokäytännöistä. Ehdot eivät voi poistaa pakottavia kuluttajan oikeuksia.',
    blocks: [
      { type: 'disclaimer', title: 'Palvelun sisältö ja vastuunjako' },
      { type: 'ackList', title: 'Varauksen yhteydessä vahvistettavat asiat' },
      { type: 'eligibility', title: 'Ajoneuvon kelpoisuus' },
      { type: 'refusal', title: 'Oikeus kieltäytyä työstä' },
      { type: 'cancellation', title: 'Peruutusehdot', id: 'peruutus' },
      {
        type: 'list', title: 'Mitä emme tee', variant: 'cross',
        items: [
          'Hinaus tai tiepalvelu - ohjaamme hinauskumppanille.',
          'Vianmääritys, korjausneuvonta tai takuupäätökset.',
          'Korjausten varaaminen tai hyväksyminen asiakkaan puolesta.',
          'Ilman saattajaa matkustavan lapsen kuljetus.',
          'Hoidollinen tai avustettu kuljetus.',
          'Liikennekäytöstä poistetun, ajokiellossa olevan tai turvattoman auton siirto.',
          'Kansainväliset siirrot ilman erillistä tarjousta.',
          'Auton säilytys.',
          'Auton osto, arvonmääritys tai kaupan neuvottelu.',
          'Kolmannen osapuolen kulujen maksaminen asiakkaan puolesta ilman ennakkomaksua.',
        ],
      },
      {
        type: 'prose', title: 'Reklamaatiot', id: 'reklamaatiot',
        body: [
          'Ota yhteyttä sähköpostitse tai puhelimitse heti, kun huomaat puutteen palvelussamme. Käsittelemme reklamaation ja vastaamme siihen kirjallisesti.',
          'Kolmannen osapuolen työtä koskevat reklamaatiot osoitetaan kyseiselle palveluntarjoajalle, koska työ perustuu asiakkaan ja palveluntarjoajan väliseen sopimukseen.',
          'Kuluttaja-asiakkaalla on oikeus saattaa riita kuluttajariitalautakunnan käsiteltäväksi. Kuluttajaneuvonta antaa maksutonta neuvontaa.',
        ],
      },
      {
        type: 'prose', title: 'Tietosuoja', id: 'tietosuoja',
        body: [
          'Käsittelemme henkilötietoja palvelun toteuttamiseksi: yhteystiedot, osoitteet, ajoneuvotiedot, luovutus- ja kuntokuvat sekä työn tilatiedot.',
          'Kuvat ja luovutuskirjaukset säilytetään palvelun todentamiseksi ja mahdollisten vahinkotilanteiden selvittämiseksi.',
          'Seurantalinkki toimii ilman kirjautumista ja on voimassa vain kyseisen työn ajan.',
          'Emme myy henkilötietoja emmekä käytä niitä muuhun kuin palvelun toteuttamiseen, sen todentamiseen ja lakisääteisiin velvoitteisiin.',
        ],
      },
      { type: 'company', title: 'Palveluntarjoaja' },
    ],
  },
  en: {
    slug: 'en/terms',
    title: 'Terms of service and responsibility boundaries | DriveMe',
    description: 'DriveMe terms: responsibility split, vehicle eligibility, booking acknowledgements, cancellation and contact details.',
    h1: 'Terms of service and responsibility boundaries',
    lead: 'These terms state what DriveMe is responsible for, and what the customer and the provider are responsible for.',
    reviewNotice: 'This page is an implementation draft awaiting review by Finnish counsel on distance-selling information, cancellation rights, liability and complaints. Terms cannot remove mandatory consumer rights.',
    blocks: [
      { type: 'disclaimer', title: 'What the service covers' },
      { type: 'ackList', title: 'What you confirm when booking' },
      { type: 'eligibility', title: 'Vehicle eligibility' },
      { type: 'refusal', title: 'Right to refuse a job' },
      { type: 'cancellation', title: 'Cancellation', id: 'cancellation' },
      {
        type: 'list', title: 'What we do not do', variant: 'cross',
        items: [
          'Breakdown response or towing - we refer to a towing partner.',
          'Diagnosis, repair advice or warranty decisions.',
          'Booking or approving repairs on the customer’s behalf.',
          'Unaccompanied child transport.',
          'Medical or assisted transport.',
          'Moving deregistered, driving-banned or unsafe vehicles.',
          'International relocation without a separate quote.',
          'Vehicle storage.',
          'Car buying, valuation or negotiation.',
          'Advancing third-party costs without prepayment.',
        ],
      },
      {
        type: 'prose', title: 'Complaints', id: 'complaints',
        body: [
          'Contact us by email or phone as soon as you notice a defect in our service. We handle the complaint and answer in writing.',
          'Complaints about third-party work are addressed to that provider, because the work is based on the agreement between the customer and the provider.',
          'A consumer may take a dispute to the Finnish Consumer Disputes Board. Consumer Advisory Services give free guidance.',
        ],
      },
      {
        type: 'prose', title: 'Privacy', id: 'privacy',
        body: [
          'We process personal data to deliver the service: contact details, addresses, vehicle details, handover and condition photos, and job status.',
          'Photos and handover records are kept as evidence of the service and to resolve any damage question.',
          'A tracking link works without login and is valid only for that job.',
          'We do not sell personal data or use it for anything beyond delivering the service, evidencing it, and statutory obligations.',
        ],
      },
      { type: 'company', title: 'Service provider' },
    ],
  },
};

/* -------------------------------------------------------------------------
 * Contact
 * ---------------------------------------------------------------------- */
export const contact = {
  fi: {
    slug: 'yhteystiedot',
    title: 'Yhteystiedot | DriveMe',
    description: 'Ota yhteyttä DriveMeen: puhelin, sähköposti ja palvelualue pääkaupunkiseudulla.',
    h1: 'Yhteystiedot',
    lead: 'Yksi yhteyshenkilö hoitaa työn alusta loppuun. Poikkeustilanteessa saat oikean ihmisen kiinni.',
    hoursTitle: 'Palveluajat',
    hours: [
      'Ma-pe 7-21',
      'La 9-18',
      'Su ja arkipyhät sopimuksen mukaan',
    ],
    hoursNote: 'Palveluajat vahvistetaan ennen julkaisua (omistajan päätös). Yön, viikonlopun ja arkipyhän lisät on kerrottu hinnastossa.',
    areaTitle: 'Palvelualue',
    areaNote: 'Pidemmät siirrot hinnoittelemme tapauskohtaisesti.',
  },
  en: {
    slug: 'en/contact',
    title: 'Contact | DriveMe',
    description: 'Contact DriveMe: phone, email and service area in the Helsinki capital region.',
    h1: 'Contact',
    lead: 'One contact person runs the job from start to finish. When a job needs judgement, you reach a real person.',
    hoursTitle: 'Service hours',
    hours: [
      'Mon-Fri 07:00-21:00',
      'Sat 09:00-18:00',
      'Sun and public holidays by agreement',
    ],
    hoursNote: 'Service hours are confirmed before launch (owner decision). Night, weekend and public-holiday premiums are listed in the price list.',
    areaTitle: 'Service area',
    areaNote: 'Longer moves are priced individually.',
  },
};

/* -------------------------------------------------------------------------
 * Booking request flow (§7)
 * ---------------------------------------------------------------------- */
export const booking = {
  fi: {
    slug: 'varaus',
    title: 'Varaa DriveMe | Pyydä hinta',
    description: 'Lähetä palvelupyyntö: valitse palvelu, kerro osoitteet, ajankohta ja auton tiedot. Vahvistamme kuljettajan, ajan ja kiinteän hinnan.',
    h1: 'Pyydä hinta ja *varaa DriveMe*',
    lead: 'Lomakkeen lähettäminen luo pyynnön. Vahvistamme kuljettajan, ajan ja kiinteän DriveMe-hinnan ennen kuin työ on sitova.',
  },
  en: {
    slug: 'en/booking',
    title: 'Book DriveMe | Request a price',
    description: 'Send a service request: choose the service, give the addresses, timing and vehicle details. We confirm the driver, time and fixed price.',
    h1: 'Request a price and *book DriveMe*',
    lead: 'Submitting this form creates a request. We confirm the driver, the time and a fixed DriveMe fee before the job becomes binding.',
  },
};

export { CANCELLATION };

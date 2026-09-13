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
 * Homepage - the Driver First Growth Plan hero and offer: a driver for the
 * customer's own car, to an address or to an appointment, nobody travelling
 * in it. The passenger service is deliberately absent from this page.
 * ---------------------------------------------------------------------- */
export const home = {
  fi: {
    slug: '',
    title: 'Kuljettaja autollesi | Auton siirto, katsastus ja huolto | DriveMe',
    description: 'DriveMe noutaa ajokuntoisen autosi ja ajaa sen valitsemaasi osoitteeseen, katsastukseen, huoltoon, renkaanvaihtoon tai pesuun pääkaupunkiseudulla. Sinun ei tarvitse lähteä mukaan.',
    eyebrow: 'Auton siirrot pääkaupunkiseudulla',
    h1: 'Kuljettaja autollesi - silloin kun et ehdi ajaa itse.',
    h1Accent: 'Kuljettaja autollesi –',
    h1Rest: 'silloin kun et ehdi ajaa itse.',
    lead: 'Noudamme ajokuntoisen autosi ja ajamme sen valitsemaasi osoitteeseen, katsastukseen, huoltoon, renkaanvaihtoon tai pesuun. Sinun ei tarvitse lähteä mukaan.',
    primary: { label: 'Pyydä hinta auton siirrolle', href: '/varaus/?lahde=home_hero' },
    secondary: { label: 'Katso palvelut', href: '/palvelut/' },
    trustLine: 'Sinun autosi. Meidän kuljettajamme. Selkeä hinta ennen ajoa.',
    offerTitle: 'Mitä autollesi *tehdään*?',
    paths: [
      {
        key: 'move',
        label: 'Aja autoni toiseen osoitteeseen',
        body: 'Kuljettaja noutaa autosi ja ajaa sen sovittuun osoitteeseen: uuteen kotiin, työpaikalle, mökille tai toiselle pysäköintipaikalle. Kerro, tarvitaanko myös paluu.',
        priceService: 'relocation',
        href: '/varaus/?tyyppi=siirto&lahde=home_move',
        cta: 'Pyydä hinta siirrolle',
        linkLabel: 'Auton siirtopalvelu',
        linkHref: '/auton-siirtopalvelu/',
      },
      {
        key: 'appointment',
        label: 'Vie autoni palveluun',
        body: 'Viemme autosi katsastukseen, huoltoon, renkaanvaihtoon, pesuun tai autoliikkeeseen ja palautamme sen sovitusti. Varaat ajan ja maksat palvelun suoraan palveluntarjoajalle.',
        priceService: 'workshop',
        href: '/varaus/?tyyppi=palvelu&lahde=home_service',
        cta: 'Pyydä hinta palveluajolle',
        linkLabel: 'Katso kaikki palveluajot',
        linkHref: '/palvelut/',
      },
    ],
    // Hero quick start: the first fields of the request, handed to /varaus/
    // as query parameters. Not a second booking interface - it cannot submit
    // anything, and it says so.
    quick: {
      title: 'Pyydä hinta *auton siirrolle*',
      service: 'Mihin auto menee?',
      moveOption: 'Toiseen osoitteeseen (auton siirto)',
      pickup: 'Nouto-osoite tai postinumero',
      pickupPlaceholder: 'Esim. 00100 tai Mannerheimintie 1',
      date: 'Toivottu päivä',
      from: 'alkaen',
      submit: 'Jatka, vie alle minuutin',
      note: 'Pyyntö ei ole vielä vahvistus. Soitamme ja vahvistamme kuljettajan, ajan ja kiinteän hinnan.',
    },
    popularTitle: 'Mihin *autosi viedään*',
    popularKeys: ['inspection', 'workshop', 'tyre', 'wash', 'relocation', 'dealer'],
    howTitle: 'Näin se *toimii*',
    priceTitle: 'Selkeä hinta *ennen ajoa*',
    priceLead: 'Näet ohjeellisen hinnan heti ja vahvistamme kiinteän DriveMe-hinnan ennen ajoa. Palveluntarjoajan maksut, kuten katsastuksen tai huollon, maksat suoraan palveluntarjoajalle.',
    priceKeys: ['relocation', 'workshop', 'inspection'],
    handoverTitle: 'Sinä luovutat avaimet, *me hoidamme ajon*',
    handoverBody: 'Et istu autossa etkä odota huoltoliikkeen aulassa. Kuljettaja noutaa auton sovitusta paikasta, ajaa sen perille ja kirjaa jokaisen luovutuksen.',
    handoverPoints: [
      'Nouto kotoa, työpaikalta tai pysäköintihallista',
      'Kunto, mittarilukema ja polttoaine- tai lataustaso kuvataan noudossa',
      'Kuljettaja ei hyväksy lisätöitä puolestasi',
      'Autossa ei kuljeteta matkustajia',
    ],
    businessTitle: 'Yritysautojen *siirrot*',
    businessBody: 'Toistuvat siirrot, huoltoajot ja työntekijäluovutukset yhdeltä kumppanilta, työkohtaisella tilatiedolla ja yhdellä kuukausilaskulla.',
    safetyTitle: 'Näin suojaamme *autosi ja tietosi*',
    safetyBody: 'Dokumentoimme jokaisen noudon ja luovutuksen aikaleimatuin kuvin, kirjaamme mittarilukeman ja polttoaine- tai lataustason ja kerromme avoimesti, mitä vakuutus ja lupa-asiat tällä hetkellä kattavat.',
    ctaTitle: 'Pyydä hinta *auton siirrolle*',
    ctaBody: 'Kerro, mistä auto noudetaan ja minne se menee. Soitamme, vahvistamme kiinteän hinnan ja hoidamme ajon.',
  },
  en: {
    slug: 'en',
    title: 'A driver for your car | Vehicle moves and service runs | DriveMe',
    description: 'DriveMe collects your roadworthy car and drives it to your chosen address, inspection, workshop, tyre service or car wash in the Helsinki capital region. You do not need to travel with it.',
    eyebrow: 'Vehicle moves in the capital region',
    h1: 'A driver for your car, when you cannot make the trip.',
    h1Accent: 'A driver for your car,',
    h1Rest: 'when you cannot make the trip.',
    lead: 'We collect your roadworthy car and drive it to your chosen address, inspection, workshop, tyre service or car wash. You do not need to travel with it.',
    primary: { label: 'Get a price to move my car', href: '/en/booking/?source=home_hero' },
    secondary: { label: 'See services', href: '/en/services/' },
    trustLine: 'Your car. Our driver. A clear price before the drive.',
    offerTitle: 'What does your car *need*?',
    paths: [
      {
        key: 'move',
        label: 'Drive my car to another address',
        body: 'A driver collects your car and takes it to the agreed address: a new home, the office, the summer cottage or another parking space. Tell us whether it also needs to come back.',
        priceService: 'relocation',
        href: '/en/booking/?type=move&source=home_move',
        cta: 'Get a price for a move',
        linkLabel: 'Vehicle relocation',
        linkHref: '/en/vehicle-relocation/',
      },
      {
        key: 'appointment',
        label: 'Take my car to a service',
        body: 'We take your car to its inspection, workshop, tyre change, wash or dealer and return it as agreed. You book the appointment and pay the provider directly.',
        priceService: 'workshop',
        href: '/en/booking/?type=service&source=home_service',
        cta: 'Get a price for a service run',
        linkLabel: 'See all service runs',
        linkHref: '/en/services/',
      },
    ],
    quick: {
      title: 'Get a price *to move your car*',
      service: 'Where does the car go?',
      moveOption: 'Another address (vehicle move)',
      pickup: 'Collection address or postcode',
      pickupPlaceholder: 'e.g. 00100 or Mannerheimintie 1',
      date: 'Preferred day',
      from: 'from',
      submit: 'Continue, takes under a minute',
      note: 'A request is not a confirmation yet. We call you and confirm the driver, the time and a fixed price.',
    },
    popularTitle: 'Where *we take your car*',
    popularKeys: ['inspection', 'workshop', 'tyre', 'wash', 'relocation', 'dealer'],
    howTitle: 'How it *works*',
    priceTitle: 'A clear price *before the drive*',
    priceLead: 'You see an indicative price immediately and we confirm a fixed DriveMe fee before the drive. Provider charges, such as the inspection or the service itself, are paid directly to the provider.',
    priceKeys: ['relocation', 'workshop', 'inspection'],
    handoverTitle: 'You hand over the keys, *we do the driving*',
    handoverBody: 'You do not sit in the car or wait in a workshop lobby. The driver collects the car from the agreed place, drives it to the destination and records every handover.',
    handoverPoints: [
      'Collection from home, work or a parking garage',
      'Condition, mileage and fuel or charge level photographed at collection',
      'The driver approves no extra work on your behalf',
      'No passengers travel in the car',
    ],
    businessTitle: 'Company *vehicle movements*',
    businessBody: 'Recurring movements, service runs and employee handovers from one partner, with job-level status and a single monthly invoice.',
    safetyTitle: 'How we protect *your car and your data*',
    safetyBody: 'We document every collection and handover with timestamped photos, record mileage and fuel or charge level, and state plainly what our insurance and licensing position currently covers.',
    ctaTitle: 'Get a price *to move your car*',
    ctaBody: 'Tell us where the car is and where it needs to go. We call you, confirm a fixed price and handle the drive.',
  },
};

/* -------------------------------------------------------------------------
 * Services hub
 * ---------------------------------------------------------------------- */
export const servicesHub = {
  fi: {
    slug: 'palvelut',
    title: 'Auton siirto- ja noutopalvelut | DriveMe',
    description: 'DriveMen palvelut: auton vienti katsastukseen, huoltoon, renkaanvaihtoon ja pesuun, auton siirto osoitteesta toiseen sekä yritysautojen siirrot. Sinun ei tarvitse lähteä mukaan.',
    h1: 'Auton siirto- ja *noutopalvelut*',
    lead: 'Kuljettaja ajaa autosi sinne, minne sen pitää mennä. Sinun ei tarvitse lähteä mukaan, ja palveluntarjoajan valitset aina itse.',
    groups: [
      { title: 'Vie autoni palveluun', body: 'Nouto, toimitus valitsemaasi palveluun ja palautus sovitusti. Ajan varaat ja palvelun maksat itse.', keys: ['inspection', 'workshop', 'tyre', 'wash', 'glass', 'dealer'] },
      { title: 'Aja autoni toiseen osoitteeseen', body: 'Ajokuntoinen auto sovitusta osoitteesta toiseen, tarvittaessa myös takaisin.', keys: ['relocation', 'pickupReturn'] },
      { title: 'Yrityksille', body: 'Toistuvat siirrot, huoltoajot ja luovutukset yhdellä sopimuksella.', keys: ['business'] },
    ],
  },
  en: {
    slug: 'en/services',
    title: 'Vehicle moves and service runs | DriveMe',
    description: 'Every DriveMe service: taking your car to an inspection, workshop, tyre service or wash, moving it between addresses, and company vehicle movements. You do not need to travel with it.',
    h1: 'Vehicle moves and *service runs*',
    lead: 'A driver takes your car where it needs to go. You do not need to travel with it, and you always choose the provider.',
    groups: [
      { title: 'Take my car to a service', body: 'Collection, delivery to the provider you choose, and return as agreed. You book and pay the provider yourself.', keys: ['inspection', 'workshop', 'tyre', 'wash', 'glass', 'dealer'] },
      { title: 'Drive my car to another address', body: 'A roadworthy car from one agreed address to another, and back again if needed.', keys: ['relocation', 'pickupReturn'] },
      { title: 'For companies', body: 'Recurring movements, service runs and handovers under one agreement.', keys: ['business'] },
    ],
  },
};

/* -------------------------------------------------------------------------
 * Pricing (§5)
 * ---------------------------------------------------------------------- */
const range = (p) => `${p.typical[0]}-${p.typical[1]} €`;

// Passenger products are not sold, so they are not in the price list.
const priceRowsFi = [
  ['Auton siirto toiseen osoitteeseen', `alkaen ${fmt(PRODUCTS.oneWay.from)}`, 'Yksi nouto ja yksi toimitus', `Tyypillisesti ${range(PRODUCTS.oneWay)} reitin ja ajankohdan mukaan`],
  ['Nouto ja palautus myöhemmin', `alkaen ${fmt(PRODUCTS.pickupReturn.from)}`, 'Kaksi sovittua siirtoa', `Tyypillisesti ${range(PRODUCTS.pickupReturn)}; palveluntarjoajan aikaa ei veloiteta, kun kuljettaja on lähtenyt`],
  ['Huolto-, rengas- tai pesuajo', `alkaen ${fmt(PRODUCTS.serviceRun.from)}`, 'Nouto, toimitus ja palautus myöhemmin', `Tyypillisesti ${range(PRODUCTS.serviceRun)}; palveluntarjoajan maksut eivät sisälly`],
  ['Auton vienti katsastukseen', `alkaen ${fmt(PRODUCTS.inspection.from)}`, `Nouto, odotus enintään ${WAITING.waitReturnIncludedMinutes} min ja palautus`, 'Katsastusmaksu maksetaan suoraan asemalle'],
  ['Odota ja palauta', `alkaen ${fmt(PRODUCTS.waitReturn.from)}`, `Nouto, odotus enintään ${WAITING.waitReturnIncludedMinutes} min ja palautus`, `Sen jälkeen ${fmt(WAITING.hourlyRate)}/h ${WAITING.unitMinutes} minuutin erissä`],
  ['Palautus autoliikkeeseen tai leasingyhtiölle', `alkaen ${fmt(PRODUCTS.handover.from)}`, 'Nouto ja dokumentoitu luovutus', 'Palveluntarjoajan veloitukset maksat suoraan'],
  ['Pitkän matkan siirto', 'Kiinteä tarjous', 'Ajettu siirto pääkaupunkiseudun ulkopuolelle', 'Polttoaine, lataus ja kuljettajan paluu eritellään'],
  ['Yritysasiakkaat', 'Sopimushinta', 'Toistuvat siirrot, raportointi ja laskutus', 'Kuukausittainen vähimmäismäärä tai palvelumaksu'],
];

const priceRowsEn = [
  ['Car moved to another address', `from ${fmt(PRODUCTS.oneWay.from)}`, 'One collection and one delivery', `Typically ${range(PRODUCTS.oneWay)} depending on route and timing`],
  ['Pickup and later return', `from ${fmt(PRODUCTS.pickupReturn.from)}`, 'Two scheduled movements', `Typically ${range(PRODUCTS.pickupReturn)}; provider time is not billed once the driver has left`],
  ['Workshop, tyre or wash run', `from ${fmt(PRODUCTS.serviceRun.from)}`, 'Collection, delivery and later return', `Typically ${range(PRODUCTS.serviceRun)}; provider charges excluded`],
  ['Vehicle inspection run', `from ${fmt(PRODUCTS.inspection.from)}`, `Collection, up to ${WAITING.waitReturnIncludedMinutes} min wait, return`, 'The inspection fee is paid directly to the station'],
  ['Wait and return', `from ${fmt(PRODUCTS.waitReturn.from)}`, `Collection, up to ${WAITING.waitReturnIncludedMinutes} min wait, return`, `Then ${fmt(WAITING.hourlyRate)}/h in ${WAITING.unitMinutes}-minute units`],
  ['Dealer or lease handover', `from ${fmt(PRODUCTS.handover.from)}`, 'Collection and documented handover', 'Provider charges are settled directly'],
  ['Long-distance relocation', 'Fixed quote', 'Driven move outside the capital region', 'Fuel, charging and the driver’s return stated explicitly'],
  ['Corporate fleet', 'Contract pricing', 'Recurring moves, reporting and invoicing', 'Minimum monthly volume or service fee'],
];

export const pricing = {
  fi: {
    slug: 'hinnasto',
    title: 'DriveMe hinnasto | Kuljettaja- ja noutopalvelut',
    description: `DriveMen hinnat: auton siirto alkaen ${PRODUCTS.oneWay.from} €, huolto-, rengas- tai pesuajo alkaen ${PRODUCTS.serviceRun.from} €, katsastusajo alkaen ${PRODUCTS.inspection.from} €. Palveluntarjoajan maksut eivät sisälly.`,
    h1: 'DriveMe *hinnasto*',
    lead: 'Hinnat sisältävät arvonlisäveron. Näet ohjeellisen hinnan heti hintapyyntölomakkeella ja vahvistamme kiinteän DriveMe-hinnan ennen kuljettajan lähtöä. Autossa ei kuljeteta matkustajia.',
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
          `Katsastusajoon ja "Odota ja palauta" -ajoon sisältyy ${WAITING.waitReturnIncludedMinutes} minuuttia.`,
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
    description: `DriveMe prices: a car moved to another address from ${PRODUCTS.oneWay.from} €, workshop, tyre or wash run from ${PRODUCTS.serviceRun.from} €, inspection run from ${PRODUCTS.inspection.from} €. Provider charges are not included.`,
    h1: 'DriveMe *pricing*',
    lead: 'Prices include Finnish VAT. You see an indicative price on the request form and we confirm a fixed DriveMe fee before the driver is sent. No passengers travel in the car.',
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
          `Inspection runs and "wait and return" include ${WAITING.waitReturnIncludedMinutes} minutes.`,
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
    title: 'Näin DriveMe toimii | Hintapyynnöstä valmiiseen työhön',
    description: 'Hintapyynnöstä vahvistukseen, noudosta dokumentoituun luovutukseen. Näin DriveMe siirtää autosi ilman, että sinun tarvitsee lähteä mukaan.',
    h1: 'Näin DriveMe *toimii*',
    lead: 'Hintapyyntö vie alle minuutin, ja jokainen työ vahvistetaan käsin. Siksi jokaisella vahvistetulla työllä on oikea kuljettaja, oikea aika ja oikea hinta.',
    blocks: [
      {
        type: 'steps', title: 'Asiakkaan polku', rows: true, two: true,
        items: [
          { t: 'Valitse siirto tai palveluajo', d: 'Aja autoni toiseen osoitteeseen, tai vie autoni katsastukseen, huoltoon, renkaanvaihtoon, pesuun tai autoliikkeeseen.' },
          { t: 'Kerro nouto, kohde ja toivottu aika', d: 'Nouto-osoite tai postinumero, kohdeosoite tai palveluntarjoaja ja päivä.' },
          { t: 'Jätä nimi ja puhelinnumero', d: 'Pyynnön lähettäminen vie alle minuutin. Sähköposti on vapaaehtoinen.' },
          { t: 'Näet ohjeellisen hinnan', d: 'Pyyntö ei vielä sido kumpaakaan osapuolta.' },
          { t: 'Soitamme ja käymme tiedot läpi', d: 'Rekisteritunnus, avainten luovutus, valtuutus, auton kunto ja varauksen ehdot.' },
          { t: 'DriveMe vahvistaa kuljettajan, ajan ja hinnan', d: 'Vasta vahvistus tekee varauksesta sitovan.' },
          { t: 'Nouto dokumentoidaan', d: 'Avaimet, kunto, mittarilukema ja polttoaine- tai lataustaso aikaleimatuin kuvin. Sinun ei tarvitse lähteä mukaan.' },
          { t: 'Saat tilapäivitykset', d: 'Jokaisesta luovutuksesta ilmoitetaan.' },
          { t: 'Palautus tai toimitus kuitataan', d: 'Sinä tai valtuuttamasi vastaanottaja vahvistaa vastaanoton.' },
          { t: 'Saat kuitin tai laskun', d: 'Sekä lyhyen arviointipyynnön.' },
        ],
      },
      { type: 'statusRail', title: 'Työn tila' },
      {
        type: 'list', title: 'Hintapyynnössä kysymme', variant: 'check', two: true,
        items: [
          'Palvelu: auton siirto toiseen osoitteeseen tai vienti palveluun.',
          'Nouto-osoite tai postinumero.',
          'Kohdeosoite, tai palveluntarjoaja ja varattu aika.',
          'Toivottu päivä ja aika.',
          'Nimi ja puhelinnumero. Sähköposti on vapaaehtoinen.',
          'Vahvistus siitä, että saat luovuttaa auton kuljettajallemme.',
        ],
      },
      {
        type: 'list', title: 'Ennen vahvistusta sovimme', variant: 'plain', two: true,
        items: [
          'Ajoneuvo: rekisteritunnus, merkki, malli, vaihteisto ja käyttövoima.',
          'Kelpoisuus: ajokunto, vakuutus, rekisteröinti, katsastus ja tiedossa olevat viat.',
          'Luovutus: omistajan tai haltijan valtuutus, avainten luovutustapa ja yhteyshenkilöt.',
          'Ajanvaraus: palveluntarjoaja, aika, varausnumero ja yhteyshenkilö.',
          'Maksu: DriveMe-maksutapa ja yritysasiakkaan laskutustiedot.',
          'Ehdot: odotus, peruutus ja kolmannen osapuolen maksut.',
        ],
      },
      {
        type: 'callout', tone: 'info', title: 'Pyyntö ei ole vahvistus',
        body: 'Lomakkeen lähettäminen luo hintapyynnön. Työ on vahvistettu vasta, kun saat meiltä vahvistuksen kuljettajasta, ajasta ja kiinteästä hinnasta.',
      },
    ],
  },
  en: {
    slug: 'en/how-it-works',
    title: 'How DriveMe works | From price request to completed job',
    description: 'From price request to confirmation, from collection to documented handover. How DriveMe moves your car without you travelling with it.',
    h1: 'How DriveMe *works*',
    lead: 'A price request takes under a minute, and every job is confirmed by a person. That is why every confirmed job has a real driver, a real time and a real price.',
    blocks: [
      {
        type: 'steps', title: 'The customer journey', rows: true, two: true,
        items: [
          { t: 'Choose a move or a service run', d: 'Drive my car to another address, or take it to an inspection, workshop, tyre change, wash or dealer.' },
          { t: 'Give the collection, destination and time', d: 'Collection address or postcode, destination address or provider, and the day.' },
          { t: 'Leave your name and phone number', d: 'Sending the request takes under a minute. Email is optional.' },
          { t: 'See the indicative price', d: 'A request does not yet bind either side.' },
          { t: 'We call you and go through the details', d: 'Registration, key handover, authorisation, vehicle condition and the booking terms.' },
          { t: 'DriveMe confirms driver, time and fee', d: 'Only the confirmation makes the booking binding.' },
          { t: 'Collection is documented', d: 'Keys, condition, mileage and fuel or charge level in timestamped photos. You do not need to travel with the car.' },
          { t: 'You receive status updates', d: 'Every handover is notified.' },
          { t: 'Return or delivery is signed off', d: 'You or your authorised recipient confirms receipt.' },
          { t: 'You receive a receipt or invoice', d: 'Plus a short rating request.' },
        ],
      },
      { type: 'statusRail', title: 'Job status' },
      {
        type: 'list', title: 'What the price request asks', variant: 'check', two: true,
        items: [
          'Service: a move to another address, or a run to a provider.',
          'Collection address or postcode.',
          'Destination address, or the provider and booked time.',
          'Preferred day and time.',
          'Name and phone number. Email is optional.',
          'Confirmation that you may hand the car to our driver.',
        ],
      },
      {
        type: 'list', title: 'What we agree before confirming', variant: 'plain', two: true,
        items: [
          'Vehicle: registration, make, model, transmission and fuel type.',
          'Eligibility: roadworthy, insured, registered, inspected, known faults.',
          'Handover: owner or keeper authority, key method and contacts.',
          'Appointment: provider, time, booking reference and contact.',
          'Payment: DriveMe payment method and invoice details for companies.',
          'Terms: waiting, cancellation and third-party charges.',
        ],
      },
      {
        type: 'callout', tone: 'info', title: 'A request is not a confirmation',
        body: 'Submitting the form creates a price request. The job is confirmed only when you receive our confirmation of the driver, time and fixed fee.',
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
    lead: 'Jos et löydä vastausta, soita tai kirjoita, niin autamme.',
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
      { q: 'Voinko matkustaa auton mukana?', a: 'Et tällä hetkellä. DriveMe siirtää autosi ilman matkustajia, eikä sinun tarvitse lähteä mukaan. Voit ilmoittaa kiinnostuksesi palveluun, jossa matkustat itse.' },
      { q: 'Miten peruutus toimii?', a: 'Maksuton vähintään 24 tuntia ennen noutoa. Alle 24 tuntia: 50 % DriveMe-palkkiosta. Kuljettajan lähdön jälkeen veloitamme perusmaksun ja toteutuneen ajan ehtojen mukaisesti.' },
    ],
  },
  en: {
    slug: 'en/faq',
    title: 'Frequently asked questions | DriveMe',
    description: 'Answers on appointments, payments, documentation, vehicle eligibility and cancellations.',
    h1: 'Frequently *asked questions*',
    lead: 'If your answer is not here, call or write and we will help.',
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
      { q: 'Can I travel with the car?', a: 'Not at the moment. DriveMe moves your car with no passengers, and you do not need to travel with it. You can register interest in a service where you ride along.' },
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
    description: 'Ota yhteyttä DriveMeen: puhelin, sähköposti ja palvelualue pääkaupunkiseudulla. Pyydä hinta auton siirrolle.',
    h1: 'Yhteystiedot',
    lead: 'Yksi yhteyshenkilö hoitaa työn alusta loppuun. Poikkeustilanteessa saat oikean ihmisen kiinni.',
    // OWNER DECISION PENDING: publish the real service hours here once they
    // are confirmed. Until then the page states only what is true today.
    hoursTitle: 'Pyynnöt ja yhteydenotot',
    hours: [
      'Hintapyynnön voi jättää lomakkeella milloin tahansa.',
      'Soitamme takaisin ja vahvistamme ajan ja hinnan ennen ajoa.',
      'Yön, viikonlopun ja arkipyhän lisät on kerrottu hinnastossa.',
    ],
    areaTitle: 'Palvelualue',
    areaNote: 'Pidemmät siirrot hinnoittelemme tapauskohtaisesti.',
  },
  en: {
    slug: 'en/contact',
    title: 'Contact | DriveMe',
    description: 'Contact DriveMe: phone, email and service area in the Helsinki capital region. Get a price to move your car.',
    h1: 'Contact',
    lead: 'One contact person runs the job from start to finish. When a job needs judgement, you reach a real person.',
    hoursTitle: 'Requests and contact',
    hours: [
      'You can send a price request with the form at any time.',
      'We call you back and confirm the time and price before the drive.',
      'Night, weekend and public-holiday premiums are listed in the price list.',
    ],
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
    title: 'Pyydä hinta auton siirrolle | DriveMe',
    description: 'Lähetä hintapyyntö alle minuutissa: kerro mistä auto noudetaan, minne se menee ja milloin. Soitamme ja vahvistamme kiinteän hinnan.',
    h1: 'Pyydä hinta *auton siirrolle*',
    lead: 'Kerro, mistä auto noudetaan, minne se menee ja milloin. Lähettäminen vie alle minuutin. Soitamme, vahvistamme kiinteän hinnan, ja vasta sitten työ on sitova.',
  },
  en: {
    slug: 'en/booking',
    title: 'Get a price to move your car | DriveMe',
    description: 'Send a price request in under a minute: where the car is, where it goes and when. We call you and confirm a fixed price.',
    h1: 'Get a price *to move your car*',
    lead: 'Tell us where the car is, where it needs to go and when. Sending takes under a minute. We call you, confirm a fixed price, and only then is the job binding.',
  },
};

export { CANCELLATION };

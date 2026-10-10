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
    title: 'Autonsiirrot yrityksille ja yksityisille | DriveMe',
    description: 'DriveMe siirtää autot toimipisteiden välillä, toimittaa myydyt autot asiakkaille ja noutaa ostoautot. Pyydä tarjous reitillesi.',
    eyebrow: 'Ajoneuvosiirrot yrityksille ja yksityisasiakkaille',
    h1: 'Autonsiirrot autoalan yrityksille.',
    h1Accent: 'Autonsiirrot',
    h1Rest: 'autoalan yrityksille.',
    lead: 'DriveMe siirtää ajokuntoiset autot toimipisteiden välillä, toimittaa myydyt autot asiakkaille ja noutaa ostoautot myyjiltä. Hoidamme myös sovitut huoltosiirrot. Kerro reitti ja aikataulu - vahvistamme kuljettajan saatavuuden ja kiinteän hinnan ennen ajoa.',
    primary: { label: 'Pyydä siirtotarjous', href: '/pyyda-tarjous/?lahde=home_hero' },
    secondary: { label: 'Keskustele yrityssiirroista', href: '/yrityksille/' },
    trustLine: 'Pääkaupunkiseutu ja Uusimaa. Pidemmät siirrot Suomessa sovitaan reittikohtaisesti.',

    offerTitle: 'Neljä tapaa, joilla *siirrämme autonne*',
    paths: [
      {
        key: 'branchTransfer',
        label: 'Toimipisteiden välinen siirto',
        body: 'Siirrämme ajokuntoiset ajoneuvot liikkeenne toimipisteestä toiseen sovitun aikataulun mukaan: myyntivarasto, koeajoautot sekä vuokra- ja yritysautot.',
        priceService: 'branchTransfer',
        href: '/pyyda-tarjous/?palvelu=branchTransfer&lahde=home_branch',
        cta: 'Pyydä tarjous toimipistesiirrosta',
        linkLabel: 'Toimipisteiden välinen siirto',
        linkHref: '/toimipisteiden-valinen-siirto/',
      },
      {
        key: 'homeDelivery',
        label: 'Kotiintoimitus',
        body: 'Toimitamme myydyn auton liikkeestänne asiakkaan sovittuun osoitteeseen. Sovimme noudon, toimitusajan ja luovutuksen käytännöt etukäteen.',
        priceService: 'homeDelivery',
        href: '/pyyda-tarjous/?palvelu=homeDelivery&lahde=home_delivery',
        cta: 'Pyydä tarjous kotiintoimituksesta',
        linkLabel: 'Auton kotiintoimitus',
        linkHref: '/kotiintoimitus/',
      },
      {
        key: 'purchasedCarPickup',
        label: 'Ostoauton nouto',
        body: 'Kun liikkeenne ostaa auton yksityiseltä myyjältä, toisesta liikkeestä tai huutokaupasta, hoidamme noudon ja siirron ilmoittamaanne osoitteeseen.',
        priceService: 'purchasedCarPickup',
        href: '/pyyda-tarjous/?palvelu=purchasedCarPickup&lahde=home_purchase',
        cta: 'Pyydä tarjous ostoauton noudosta',
        linkLabel: 'Ostoauton nouto',
        linkHref: '/ostoauton-nouto/',
      },
      {
        key: 'workshopTransfer',
        label: 'Huoltosiirto',
        body: 'Noudamme auton sovitusta osoitteesta, viemme sen valitsemaanne huoltopisteeseen ja palautamme sen sovitusti. Huoltotyö sovitaan suoraan palveluntarjoajan kanssa.',
        priceService: 'workshopTransfer',
        href: '/pyyda-tarjous/?palvelu=workshopTransfer&lahde=home_workshop',
        cta: 'Pyydä tarjous huoltosiirrosta',
        linkLabel: 'Huoltosiirto',
        linkHref: '/huoltosiirto/',
      },
    ],

    // Hero quick start: the first fields of the quote request, handed to
    // /pyyda-tarjous/ as query parameters. It cannot submit anything itself.
    trust: {
      title: 'Kuka ajaa *autosi*',
      lead: 'DriveMe on Mansio Group Oy:n palvelu. Jokaisesta siirrosta jää dokumentaatio, ja yhteydenottoihin vastaa oikea ihminen.',
      providerTitle: 'Palveluntarjoaja',
      areaTitle: 'Palvelualue',
      contactTitle: 'Yhteystiedot',
      contactBody: 'Vastaamme tarjouspyyntöihin 24 tunnin kuluessa. Kiireellisissä asioissa soita.',
    },

    quick: {
      title: 'Pyydä *siirtotarjous*',
      lead: 'Valitse palvelu ja jätä yhteystietosi. Otamme yhteyttä 24 tunnin kuluessa.',
      service: 'Mikä siirto on kyseessä?',
      moveOption: 'Auton siirto toiseen osoitteeseen',
      submit: 'Pyydä tarjous',
      note: 'Tarjouspyyntö ei vahvista siirtoa. Vahvistamme hinnan, aikataulun ja kuljettajan erikseen.',
    },

    mosaic: {
      title: 'DriveMen *siirtopalvelut*',
      intro: 'Yksi kumppani autoalan siirtoihin: toimipisteiden väliset ajot, kotiintoimitukset, ostoautojen noudot ja huoltosiirrot. Myös yksittäiset siirrot yksityisasiakkaille.',
      quote: 'Pyydä tarjous',
      blurbs: {
        branchTransfer: 'Ajoneuvot toimipisteestä toiseen sovitun aikataulun mukaan.',
        homeDelivery: 'Myyty auto asiakkaan ovelle, dokumentoidulla luovutuksella.',
        purchasedCarPickup: 'Ostoauto myyjältä liikkeeseenne, kunto kirjattuna.',
        workshopTransfer: 'Auto huoltoon, katsastukseen tai pesuun ja takaisin.',
        relocation: 'Auton siirto toiseen osoitteeseen Suomessa, myös pidemmät reitit.',
        business: 'Toistuvat siirrot sovitulla laskutuskäytännöllä.',
      },
    },

    benefitsTitle: 'Mitä *tarjoukseen kuuluu*',
    benefits: [
      { t: 'Sovittu hinta ennen ajoa', d: 'Saat kiinteän tarjouksen reitistä ja aikataulusta ennen kuin kuljettaja lähtee. Hinta ei muutu kesken ajon.' },
      { t: 'Noudon ja luovutuksen dokumentointi', d: 'Kirjaamme näkyvän kunnon, mittarilukeman ja avaimet noudossa, ja luovutus kuitataan sovitulle vastaanottajalle.' },
      { t: 'Yksi yhteyshenkilö', d: 'Sama ihminen hoitaa tarjouksen, aikataulun ja poikkeustilanteet. Et jää selvittämään asiaa vaihtuvalle päivystäjälle.' },
    ],

    howTitle: 'Näin *siirto etenee*',
    priceTitle: 'Hinnoittelu *reitin mukaan*',
    priceLead: 'Yrityssiirrot hinnoitellaan reitin, aikataulun ja siirtomäärän mukaan. Saat kiinteän tarjouksen ennen ajoa. Huoltosiirroissa ja yksittäisissä siirroissa noudatamme julkaistua hinnastoa.',
    priceKeys: ['relocation', 'workshopTransfer'],
    handoverTitle: 'Te luovutatte avaimet, *me hoidamme ajon*',
    handoverBody: 'Henkilökuntanne ei istu siirtoajoissa. Kuljettaja noutaa auton sovitusta paikasta, ajaa sen perille ja kirjaa jokaisen luovutuksen.',
    handoverPoints: [
      'Nouto toimipisteeltä, asiakkaalta tai myyjältä',
      'Kunto, mittarilukema ja polttoaine- tai lataustaso kirjataan noudossa',
      'Kuljettaja ei hyväksy lisätöitä puolestanne',
      'Siirtoajossa autossa ei kuljeteta matkustajia',
    ],
    businessTitle: 'Autoliikkeille, leasing- ja *kalustoyhtiöille*',
    businessBody: 'DriveMe auttaa autoliikkeitä, leasing- ja kalustoyhtiöitä sekä autovuokraamoja hoitamaan ajoneuvojen siirrot ilman oman henkilökunnan ajomatkoja. Voit pyytää tarjouksen yksittäisestä siirrosta tai keskustella toistuvista ajoista ja sovitusta laskutuskäytännöstä.',
    safetyTitle: 'Mitä *dokumentoimme*',
    safetyBody: 'Jokaisesta siirrosta jää näyttö: aikaleimatut kuvat noudossa ja luovutuksessa, mittarilukema ja polttoaine- tai lataustaso sekä kuittaus siitä, kuka auton vastaanotti ja milloin. Kerromme avoimesti, mitä vakuutus- ja lupa-asiat tällä hetkellä kattavat.',
    otherTitle: 'Muut *tarpeet*',
    otherLinks: [
      { label: 'Auton siirtopalvelu yksityisasiakkaalle', href: '/auton-siirtopalvelu/' },
      { label: 'Oma kuljettaja asiakkaan omalla autolla', href: '/oma-kuljettaja/' },
    ],
    ctaTitle: 'Pyydä *siirtotarjous*',
    ctaBody: 'Kerro reitti, ajoneuvo ja toivottu aikataulu. Vahvistamme kuljettajan saatavuuden ja kiinteän hinnan ennen ajoa.',
  },
  en: {
    slug: 'en',
    title: 'Vehicle transfers for dealers and private customers | DriveMe',
    description: 'DriveMe moves cars between branches, delivers sold cars to customers and collects purchased vehicles. Ask for a quote on your route.',
    eyebrow: 'Vehicle transfers for businesses and private customers',
    h1: 'Vehicle transfers for the motor trade.',
    h1Accent: 'Vehicle transfers',
    h1Rest: 'for the motor trade.',
    lead: 'DriveMe moves roadworthy cars between branches, delivers sold cars to customers and collects purchased vehicles from sellers. We also handle booked service transfers. Tell us the route and the schedule - we confirm driver availability and a fixed price before the drive.',
    primary: { label: 'Request a transfer quote', href: '/en/request-a-quote/?source=home_hero' },
    secondary: { label: 'Talk about company transfers', href: '/en/for-companies/' },
    trustLine: 'The capital region and Uusimaa. Longer transfers in Finland are agreed per route.',

    offerTitle: 'Four ways we *move your vehicles*',
    paths: [
      {
        key: 'branchTransfer',
        label: 'Branch-to-branch transfer',
        body: 'We move roadworthy vehicles between your sites on an agreed schedule: stock moves, test-drive cars, rental and company vehicles.',
        priceService: 'branchTransfer',
        href: '/en/request-a-quote/?service=branchTransfer&source=home_branch',
        cta: 'Quote a branch transfer',
        linkLabel: 'Branch-to-branch transfer',
        linkHref: '/en/branch-to-branch-transfer/',
      },
      {
        key: 'homeDelivery',
        label: 'Delivery to the customer',
        body: 'We deliver a sold car from your showroom to the customer’s agreed address. Collection, delivery time and handover practice are agreed in advance.',
        priceService: 'homeDelivery',
        href: '/en/request-a-quote/?service=homeDelivery&source=home_delivery',
        cta: 'Quote a delivery',
        linkLabel: 'Delivery to the customer',
        linkHref: '/en/home-delivery/',
      },
      {
        key: 'purchasedCarPickup',
        label: 'Purchased vehicle collection',
        body: 'When your business buys a car from a private seller, another dealer or an auction, we collect it and bring it to the address you give.',
        priceService: 'purchasedCarPickup',
        href: '/en/request-a-quote/?service=purchasedCarPickup&source=home_purchase',
        cta: 'Quote a collection',
        linkLabel: 'Purchased vehicle collection',
        linkHref: '/en/purchased-vehicle-collection/',
      },
      {
        key: 'workshopTransfer',
        label: 'Service transfer',
        body: 'We collect the car, take it to the service point you choose and return it as agreed. The work itself stays between you and the provider.',
        priceService: 'workshopTransfer',
        href: '/en/request-a-quote/?service=workshopTransfer&source=home_workshop',
        cta: 'Quote a service transfer',
        linkLabel: 'Service transfer',
        linkHref: '/en/service-transfer/',
      },
    ],

    trust: {
      title: 'Who drives *your car*',
      lead: 'DriveMe is a service of Mansio Group Oy. Every transfer leaves a documented record, and a real person answers when you get in touch.',
      providerTitle: 'Service provider',
      areaTitle: 'Service area',
      contactTitle: 'Contact',
      contactBody: 'We answer enquiries within 24 hours. If it is urgent, call us.',
    },

    quick: {
      title: 'Request a *transfer quote*',
      lead: 'Choose a service and leave your details. We get back to you within 24 hours.',
      service: 'Which transfer is it?',
      moveOption: 'Move a car to another address',
      submit: 'Request a quote',
      note: 'An enquiry does not confirm the transfer. We confirm the price, the schedule and the driver separately.',
    },

    mosaic: {
      title: 'DriveMe *transfer services*',
      intro: 'One partner for motor-trade logistics: branch moves, deliveries to customers, purchased-car collections and service transfers. Single transfers for private customers too.',
      quote: 'Ask for a quote',
      blurbs: {
        branchTransfer: 'Vehicles from one site to another on an agreed schedule.',
        homeDelivery: 'A sold car to the customer’s door, with a documented handover.',
        purchasedCarPickup: 'A purchased car from the seller to you, condition recorded.',
        workshopTransfer: 'To the workshop, inspection or wash and back again.',
        relocation: 'A car moved to another address in Finland, longer routes included.',
        business: 'Recurring transfers on an agreed billing arrangement.',
      },
    },

    benefitsTitle: 'What the *quote includes*',
    benefits: [
      { t: 'An agreed price before the drive', d: 'You get a fixed quote for the route and the schedule before a driver sets off. The price does not move mid-job.' },
      { t: 'Collection and handover documented', d: 'We record visible condition, odometer and keys at collection, and the handover is signed off by the named receiver.' },
      { t: 'One named contact', d: 'The same person handles the quote, the schedule and anything that goes sideways. No rotating duty desk.' },
    ],

    howTitle: 'How a *transfer runs*',
    priceTitle: 'Priced *by the route*',
    priceLead: 'Company transfers are priced by route, schedule and volume, and you get a fixed quote before the drive. Service transfers and single moves follow the published price list.',
    priceKeys: ['relocation', 'workshopTransfer'],
    handoverTitle: 'You hand over the keys, *we do the driving*',
    handoverBody: 'Your staff stay at work. The driver collects the car at the agreed place, takes it where it needs to go and records every handover.',
    handoverPoints: [
      'Collection from your site, a customer or a seller',
      'Condition, odometer and fuel or charge level recorded at collection',
      'The driver approves no extra work on your behalf',
      'A transfer drive carries no passengers',
    ],
    businessTitle: 'For dealers, leasing and *fleet companies*',
    businessBody: 'DriveMe helps dealers, leasing and fleet companies and rental firms move vehicles without sending their own staff on the road. Ask for a quote on a single transfer, or talk to us about recurring drives and an agreed billing arrangement.',
    safetyTitle: 'What we *document*',
    safetyBody: 'Every transfer leaves evidence: timestamped photos at collection and handover, the odometer and the fuel or charge level, and a record of who received the car and when. We state plainly what the insurance and licensing position currently covers.',
    otherTitle: 'Other *needs*',
    otherLinks: [
      { label: 'Vehicle relocation for private customers', href: '/en/vehicle-relocation/' },
      { label: 'A personal driver in the customer’s own car', href: '/en/personal-driver/' },
    ],
    ctaTitle: 'Request a *transfer quote*',
    ctaBody: 'Tell us the route, the vehicle and the schedule you need. We confirm driver availability and a fixed price before the drive.',
  },
};

/* -------------------------------------------------------------------------
 * Services hub
 * ---------------------------------------------------------------------- */
export const servicesHub = {
  fi: {
    slug: 'palvelut',
    title: 'Autonsiirrot ja huoltosiirrot Helsingissä | DriveMe',
    description: 'DriveMen siirtopalvelut: toimipisteiden väliset siirrot, kotiintoimitukset, ostoautojen noudot, huoltosiirrot ja yksittäiset auton siirrot pääkaupunkiseudulla.',
    h1: 'Autonsiirrot ja *huoltosiirrot*',
    lead: 'Kuljettaja ajaa auton sinne, minne sen pitää mennä. Yrityssiirrot hinnoitellaan reitin mukaan, yksittäiset siirrot ja huoltoajot julkaistun hinnaston mukaan.',
    groups: [
      { title: 'Autonsiirrot autoalan yrityksille', body: 'Toimipisteiden väliset siirrot, myytyjen autojen kotiintoimitukset ja ostoautojen noudot. Jokaisesta siirrosta jää dokumentoitu luovutus.', keys: ['branchTransfer', 'homeDelivery', 'purchasedCarPickup'] },
      { title: 'Huoltosiirrot ja yksittäiset siirrot', body: 'Auto varattuun huoltoon, katsastukseen, renkaanvaihtoon tai pesuun ja takaisin - tai siirto osoitteesta toiseen.', keys: ['workshopTransfer', 'relocation'] },
      { title: 'Muut palvelut', body: 'Toistuvat siirrot sovitulla laskutuskäytännöllä, ja kuljettaja asiakkaan omaan autoon silloin kun matkustaja on mukana.', keys: ['business', 'personalDriver'] },
    ],
  },
  en: {
    slug: 'en/services',
    title: 'Vehicle transfers and service runs in Helsinki | DriveMe',
    description: 'DriveMe transfer services: branch-to-branch moves, deliveries to customers, purchased-vehicle collections, service transfers and single vehicle moves in the capital region.',
    h1: 'Vehicle transfers and *service runs*',
    lead: 'A driver takes the car where it needs to go. Company transfers are priced by route; single moves and service runs follow the published price list.',
    groups: [
      { title: 'Transfers for the motor trade', body: 'Branch-to-branch moves, deliveries of sold cars and collections of purchased ones. Every transfer leaves a documented handover.', keys: ['branchTransfer', 'homeDelivery', 'purchasedCarPickup'] },
      { title: 'Service transfers and single moves', body: 'A car to a booked service, inspection, tyre change or wash and back - or a move from one address to another.', keys: ['workshopTransfer', 'relocation'] },
      { title: 'Other services', body: 'Recurring transfers on an agreed billing arrangement, and a driver in the customer’s own car when a passenger travels.', keys: ['business', 'personalDriver'] },
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
  ['Kuljettaja matkallesi omalla autollasi', 'Kiinteä tarjous', 'Kuljettaja, sovittu reitti ja aikataulu', 'Hinta muodostuu reitistä, kestosta, matkustajamäärästä ja paluusta'],
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
  ['A driver for your journey in your own car', 'Fixed quote', 'A driver, the agreed route and schedule', 'Priced from the route, duration, passengers and return leg'],
  ['Long-distance relocation', 'Fixed quote', 'Driven move outside the capital region', 'Fuel, charging and the driver’s return stated explicitly'],
  ['Corporate fleet', 'Contract pricing', 'Recurring moves, reporting and invoicing', 'Minimum monthly volume or service fee'],
];

export const pricing = {
  fi: {
    slug: 'hinnasto',
    title: 'DriveMe hinnasto | Kuljettajapalvelut Helsingissä',
    description: `DriveMen hinnat: auton siirto alkaen ${PRODUCTS.oneWay.from} €, huolto-, rengas- tai pesuajo alkaen ${PRODUCTS.serviceRun.from} €, katsastusajo alkaen ${PRODUCTS.inspection.from} €. Palveluntarjoajan maksut eivät sisälly.`,
    h1: 'DriveMe *hinnasto*',
    lead: 'Yrityssiirrot hinnoitellaan reitin, aikataulun ja siirtomäärän mukaan. Saat kiinteän tarjouksen ennen ajoa. Yksittäiset siirrot ja huoltosiirrot noudattavat alla julkaistua hinnastoa, ja hinnat sisältävät arvonlisäveron.',
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
        note: 'Mahdollinen lisä eritellään omana rivinään tarjouksessa, jonka lähetämme sinulle.',
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
        body: 'Reitti, luovutusaika ja odotus vaikuttavat todelliseen kustannukseen, eikä lomake voi tietää niitä puolestasi. Julkaisemme siksi alkaen-hinnat tällä sivulla ja lähetämme kiinteän hinnan tarjouksessa. Emme veloita enempää kuin vahvistettu hinta ilman erikseen sovittua muutosta.',
      },
    ],
  },
  en: {
    slug: 'en/pricing',
    title: 'DriveMe pricing | Driver services in Helsinki',
    description: `DriveMe prices: a car moved to another address from ${PRODUCTS.oneWay.from} €, workshop, tyre or wash run from ${PRODUCTS.serviceRun.from} €, inspection run from ${PRODUCTS.inspection.from} €. Provider charges are not included.`,
    h1: 'DriveMe *pricing*',
    lead: 'Prices include Finnish VAT and are starting prices. Ask for a quote and you get a fixed price within 24 hours. Journeys where you travel in the car are quoted per route.',
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
        body: 'Route, handover time and waiting all move the real cost, and a form cannot know them for you. So we publish starting prices on this page and send a fixed fee in the quote. We do not charge more than the confirmed fee without a separately agreed change.',
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
    lead: 'Tarjouspyyntö vie alle minuutin, ja jokainen tarjous kirjoitetaan käsin. Siksi jokaisella vahvistetulla työllä on oikea kuljettaja, oikea aika ja oikea hinta.',
    blocks: [
      {
        type: 'steps', title: 'Asiakkaan polku', rows: true, two: true,
        items: [
          { t: 'Valitse tarvitsemasi palvelu', d: 'Toimipisteiden välinen siirto, kotiintoimitus, ostoauton nouto, huoltosiirto, yksittäinen siirto, oma kuljettaja - tai muu palvelu.' },
          { t: 'Jätä nimi, puhelin ja sähköposti', d: 'Tarjouspyynnön lähettäminen vie alle minuutin. Lisätiedot voit kertoa vapaassa kentässä.' },
          { t: 'Saat kuittauksen sähköpostiin', d: 'Vahvistamme, että pyyntö on vastaanotettu. Tarjouspyyntö ei vielä vahvista varausta.' },
          { t: 'Otamme yhteyttä 24 tunnin kuluessa', d: 'Nouto- ja toimitusosoitteet, auton tiedot, avainten luovutus, valtuutus ja varauksen ehdot.' },
          { t: 'DriveMe vahvistaa kuljettajan, ajan ja hinnan', d: 'Vasta vahvistus tekee varauksesta sitovan.' },
          { t: 'Nouto dokumentoidaan', d: 'Avaimet, kunto, mittarilukema ja polttoaine- tai lataustaso aikaleimatuin kuvin. Sinun ei tarvitse lähteä mukaan.' },
          { t: 'Saat tilapäivitykset', d: 'Jokaisesta luovutuksesta ilmoitetaan.' },
          { t: 'Palautus tai toimitus kuitataan', d: 'Sinä tai valtuuttamasi vastaanottaja vahvistaa vastaanoton.' },
          { t: 'Saat kuitin tai laskun', d: 'Sekä lyhyen arviointipyynnön.' },
        ],
      },
      { type: 'statusRail', title: 'Työn tila' },
      {
        type: 'list', title: 'Tarjouspyynnössä kysymme', variant: 'check', two: true,
        items: [
          'Nimi.',
          'Puhelinnumero.',
          'Sähköposti, johon lähetämme kuittauksen ja tarjouksen.',
          'Mitä palvelua tarvitset.',
          'Yrityksen nimi, jos pyydät tarjousta yrityksen puolesta. Vapaaehtoinen.',
          'Lisätiedot: reitti, toivottu ajankohta ja muut toiveet. Vapaaehtoinen.',
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
        type: 'callout', tone: 'info', title: 'Tarjouspyyntö ei ole vahvistus',
        body: 'Lomakkeen lähettäminen luo tarjouspyynnön. Työ on vahvistettu vasta, kun hyväksyt tarjouksen ja saat meiltä vahvistuksen kuljettajasta, ajasta ja kiinteästä hinnasta.',
      },
    ],
  },
  en: {
    slug: 'en/how-it-works',
    title: 'How DriveMe works | From price request to completed job',
    description: 'From price request to confirmation, from collection to documented handover. How DriveMe moves your car without you travelling with it.',
    h1: 'How DriveMe *works*',
    lead: 'An enquiry takes under a minute, and every quote is written by a person. That is why every confirmed job has a real driver, a real time and a real price.',
    blocks: [
      {
        type: 'steps', title: 'The customer journey', rows: true, two: true,
        items: [
          { t: 'Choose the service you need', d: 'A branch transfer, a delivery to a customer, a purchased-car collection, a service transfer, a single transfer, a personal driver - or something else.' },
          { t: 'Leave your name, phone and email', d: 'Sending the enquiry takes under a minute. Anything else goes in the free-text field.' },
          { t: 'You get a receipt by email', d: 'Confirming we have your enquiry. It does not confirm a booking yet.' },
          { t: 'We contact you within 24 hours', d: 'Collection and delivery addresses, vehicle details, key handover, authorisation and the booking terms.' },
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
      { q: 'Voinko matkustaa auton mukana?', a: 'Kyllä. Kuljettaja matkallesi -palvelussa kuljettaja ajaa sinut ja matkaseurueesi omalla autollasi, esimerkiksi lentoasemalle tai pitkälle matkalle. Auton siirroissa taas kukaan ei matkusta autossa.' },
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
      { q: 'Can I travel with the car?', a: 'Yes. With "a driver for your journey" a driver takes you and your passengers in your own car, for example to the airport or on a longer trip. On a vehicle move, nobody travels in the car.' },
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
          'Siirrot Suomen rajojen ulkopuolelle.',
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
          'Transfers outside Finland.',
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
    slug: 'pyyda-tarjous',
    title: 'Pyydä tarjous auton siirrosta | DriveMe',
    description: 'Jätä tarjouspyyntö alle minuutissa: nimi, puhelin, sähköposti ja tarvitsemasi palvelu. Otamme yhteyttä 24 tunnin kuluessa.',
    h1: 'Pyydä tarjous *auton siirrosta*',
    lead: 'Jätä yhteystietosi ja kerro, mitä palvelua tarvitset. Otamme yhteyttä 24 tunnin kuluessa, sovimme yksityiskohdat ja lähetämme kiinteän hinnan. Tarjouspyyntö ei vielä vahvista varausta.',
  },
  en: {
    slug: 'en/request-a-quote',
    title: 'Request a quote for a car transfer | DriveMe',
    description: 'Send an enquiry in under a minute: your name, phone, email and the service you need. We get back to you within 24 hours.',
    h1: 'Request a quote *for a car transfer*',
    lead: 'Leave your details and tell us which service you need. We get back to you within 24 hours, agree the details and send a fixed price. An enquiry does not confirm a booking yet.',
  },
};

/* Swedish, from content/sv/pages.mjs. */
import * as SV from './sv/pages.mjs';
Object.assign(home, { sv: SV.home });
Object.assign(servicesHub, { sv: SV.servicesHub });
Object.assign(pricing, { sv: SV.pricing });
Object.assign(howPage, { sv: SV.howPage });
Object.assign(safety, { sv: SV.safety });
Object.assign(faqPage, { sv: SV.faqPage });
Object.assign(terms, { sv: SV.terms });
Object.assign(contact, { sv: SV.contact });
Object.assign(booking, { sv: SV.booking });

export { CANCELLATION };

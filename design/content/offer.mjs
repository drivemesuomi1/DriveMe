/**
 * The new-customer offer (client brief, 29 Sep 2026): 10 % off the DriveMe
 * service fee on a first booking, code DRIVEME10, until 31 October 2026.
 *
 * The discount is a campaign, so everything about it - the code, the end date,
 * the percentage - lives in OFFER below. The announcement bar above the header
 * and this page both read it, and both stop by themselves when it expires:
 * a build after the end date drops the bar, and site.js hides it on a page
 * still sitting in a CDN cache.
 *
 * One claim from the brief was changed rather than published as written. It
 * offered a "tarkistettu" (screened) driver; Gate C in api/_lib/gates.js is
 * still open, so the site may only say what content/site.mjs `screening`
 * already says - the licence is verified and recorded, and the driver is
 * trained on DriveMe's own rules. See README, "Launch gates".
 */

export const OFFER = {
  code: 'DRIVEME10',
  percent: 10,
  /** Last day a booking can be made on the offer, inclusive (Europe/Helsinki). */
  endsAt: '2026-10-31',
};

/** Has the offer run out by `today`? The build and the browser both ask this. */
export const offerExpired = (today = new Date()) =>
  today.toISOString().slice(0, 10) > OFFER.endsAt;

export const offer = {
  fi: {
    slug: 'uuden-asiakkaan-etu',
    title: '10 % alennusta kuljettajapalvelusta | DriveMe Helsinki',
    description: 'Uusi asiakas saa 10 % alennuksen ensimmäisestä DriveMe-varauksesta. Luotettava kuljettajapalvelu Helsingissä, Espoossa, Vantaalla ja Kauniaisissa.',
    nav: 'Uuden asiakkaan etu',

    eyebrow: 'Uuden asiakkaan etu',
    h1: '10 % alennusta *ensimmäisestä varauksesta*',
    lead: 'Tarvitsetko luotettavan ja ammattitaitoisen kuljettajan omaan autoosi? Varaa ensimmäinen DriveMe-palvelusi 31.10.2026 mennessä ja saat 10 % alennuksen DriveMen palvelumaksusta.',
    codeLabel: 'Etukoodi',
    codeHint: 'Käytä koodia varauksen yhteydessä.',
    validUntil: 'Voimassa 31.10.2026 asti',
    areaLine: 'Tarjous on saatavilla Helsingissä, Espoossa, Vantaalla ja Kauniaisissa.',
    cta: 'Varaa kuljettaja',
    ctaSecondary: 'Katso hinnasto',
    expired: 'Tämä tarjous on päättynyt. Palvelumme ja hinnastomme ovat ennallaan – pyydä hinta, niin vahvistamme sen ennen ajoa.',

    sections: [
      {
        title: 'Luotettava kuljettajapalvelu omaan autoosi',
        photo: '/assets/service-heroes/journey-driver.jpg',
        alt: 'DriveMen kuljettaja asiakkaan auton ratissa',
        body: [
          'DriveMe tarjoaa turvallisen ja joustavan kuljettajapalvelun asiakkaan omalla autolla. Ammattitaitoinen kuljettajamme ajaa sinut tai autosi sovittuun määränpäähän.',
          'Palvelumme sopii yksityisasiakkaille, työmatkoille, lentokenttäkuljetuksiin sekä yritysten kuljetustarpeisiin Helsingissä, Espoossa, Vantaalla ja Kauniaisissa.',
        ],
      },
      {
        title: 'Henkilökohtainen kuljettaja matkallesi',
        photo: '/assets/service-heroes/personal-driver.jpg',
        alt: 'Kuljettaja avaa asiakkaalle auton oven',
        body: ['Varaa luotettava kuljettaja lyhyelle tai pitkälle matkalle. Kuljettajamme ajaa sinut omalla autollasi esimerkiksi:'],
        list: [
          'Lentokentälle tai lentokentältä',
          'Työmatkalle tai tapaamiseen',
          'Tapahtumaan tai juhlaan',
          'Helsingin, Espoon, Vantaan tai Kauniaisten alueella',
          'Toiseen kaupunkiin tai pidemmälle matkalle',
        ],
        after: 'Saat henkilökohtaisen ja täsmällisen palvelun ilman, että sinun tarvitsee tilata erillistä autoa.',
        services: ['personalDriver', 'relocation'],
      },
      {
        title: 'Lentokenttäkuljetukset omalla autollasi',
        photo: '/assets/service-heroes/airport-driver.jpg',
        alt: 'Kuljettaja asiakkaan auton kanssa lentoaseman edessä',
        body: [
          'Tarvitsetko kuljettajan Helsinki-Vantaan lentoasemalle tai lentoasemalta? DriveMe-kuljettaja saapuu sovittuun osoitteeseen ja ajaa sinut omalla autollasi lentokentälle.',
          'Kuljettaja voi myös noutaa sinut lentoasemalta ja ajaa sinut kotiin tai muuhun määränpäähän.',
        ],
        services: ['personalDriver'],
      },
      {
        title: 'Auton kuljetus puolestasi',
        photo: '/assets/service-heroes/vehicle-inspection-run.jpg',
        alt: 'Kuljettaja luovuttaa auton katsastusasemalla',
        body: ['Kun olet kiireinen, noudamme autosi ja viemme sen sovittuun kohteeseen:'],
        list: [
          'Katsastukseen',
          'Autohuoltoon tai korjaukseen',
          'Renkaanvaihtoon',
          'Autopesuun tai detailing-palveluun',
          'Lasikorjaukseen tai korikorjaamolle',
          'Toiseen osoitteeseen',
        ],
        after: 'Palautamme auton sovitusti palvelun jälkeen. Katsastus-, huolto-, korjaus-, pesu- ja muut kolmannen osapuolen maksut maksaa asiakas suoraan palveluntarjoajalle.',
        services: ['workshopTransfer', 'relocation'],
      },
      {
        title: 'Yritysten kuljettajapalvelu',
        photo: '/assets/service-heroes/business.jpg',
        alt: 'Kuljettaja ja yritysasiakas luovuttamassa autoa',
        body: [
          'Yrityksille tarjoamme joustavan kuljettaja- ja ajoneuvosiirtopalvelun. Kuljettajamme siirtävät yrityksen tai asiakkaan ajoneuvon toimipisteiden, autoliikkeiden, huoltojen ja muiden sovittujen osoitteiden välillä.',
          'Palvelu sopii yrityksille, jotka tarvitsevat luotettavan ja ammattimaisen kuljettajan ilman omaa kuljettajahenkilöstöä.',
        ],
        services: ['business'],
      },
    ],

    whyTitle: 'Miksi valita *DriveMe*',
    why: [
      {
        icon: 'driver',
        title: 'Ammattitaitoinen kuljettaja',
        body: 'Saat kokeneen kuljettajan, jonka ajo-oikeuden tarkistamme ja kirjaamme ja joka on perehdytetty DriveMen nouto-, luovutus- ja dokumentointiohjeisiin.',
      },
      {
        icon: 'doc',
        title: 'Dokumentoitu palvelu',
        body: 'Kuvaamme auton kunnon, mittarilukeman ja polttoainetason noudossa ja palautuksessa, ja kirjaamme luovutuksen ajan, paikan ja vastaanottajan.',
      },
      {
        icon: 'key',
        title: 'Sinun oma autosi',
        body: 'Tuomme kuljettajan sinun autoosi. Palveluun ei sisälly DriveMen autoa.',
      },
      {
        icon: 'price',
        title: 'Selkeä hinnoittelu',
        body: 'Näet ohjeellisen hinnan heti lomakkeella ja vahvistamme kiinteän hinnan ennen ajoa. Polttoaine-, pysäköinti- ja kolmannen osapuolen maksut veloitetaan erikseen.',
      },
    ],

    stepsTitle: 'Näin hyödynnät *10 % edun*',
    steps: [
      { title: 'Valitse tarvitsemasi palvelu', body: 'Kerro meille, milloin, mistä ja mihin tarvitset kuljettajan.' },
      { title: 'Käytä koodia DRIVEME10', body: 'Kirjoita koodi lomakkeen Tarjouskoodi-kenttään. Tämän sivun painikkeista se tulee kenttään valmiiksi.' },
      { title: 'Saat 10 % alennuksen', body: 'Alennamme ensimmäisen varauksesi DriveMe-palvelumaksua 10 % vahvistaessamme hinnan.' },
    ],

    bandTitle: 'Varaa nyt ja säästä 10 %',
    bandBody: 'Pyyntö vie alle minuutin. Se ei ole vielä vahvistus – soitamme ja vahvistamme kuljettajan, ajan ja kiinteän hinnan.',
    bandCta: 'Varaa nyt ja säästä 10 %',

    termsTitle: 'Tarjouksen ehdot',
    terms: [
      'Tarjous koskee uusia yksityisasiakkaita ja asiakkaan ensimmäistä DriveMe-varausta Helsingissä, Espoossa, Vantaalla tai Kauniaisissa. Varaus on tehtävä viimeistään 31.10.2026.',
      'Alennus koskee vain DriveMen palvelumaksua. Se ei koske polttoaine-, pysäköinti-, katsastus-, autohuolto-, korjaamo-, rengasliike-, autopesu- tai muita kolmannen osapuolen maksuja.',
      'Tarjousta ei voi yhdistää muihin alennuksiin tai etuihin. Palvelu tarjotaan saatavuuden mukaan.',
    ],

    bar: {
      lead: 'Uuden asiakkaan etu',
      text: '10 % alennus ensimmäisestä varauksesta',
      more: 'Lue lisää',
    },
  },

  en: {
    slug: 'en/new-customer-offer',
    title: '10 % off your first driver service | DriveMe Helsinki',
    description: 'New customers get 10 % off their first DriveMe booking. A reliable driver service in Helsinki, Espoo, Vantaa and Kauniainen.',
    nav: 'New customer offer',

    eyebrow: 'New customer offer',
    h1: '10 % off *your first booking*',
    lead: 'Need a reliable, professional driver for your own car? Book your first DriveMe service by 31 October 2026 and get 10 % off the DriveMe service fee.',
    codeLabel: 'Offer code',
    codeHint: 'Use the code when you send your request.',
    validUntil: 'Valid until 31 October 2026',
    areaLine: 'The offer is available in Helsinki, Espoo, Vantaa and Kauniainen.',
    cta: 'Request a driver',
    ctaSecondary: 'See the price list',
    expired: 'This offer has ended. The service and the price list are unchanged - ask for a price and we will confirm it before the drive.',

    sections: [
      {
        title: 'A reliable driver service for your own car',
        photo: '/assets/service-heroes/journey-driver.jpg',
        alt: 'A DriveMe driver at the wheel of a customer’s car',
        body: [
          'DriveMe provides a safe and flexible driver service in the customer’s own car. A professional driver takes you, or your car, to the agreed destination.',
          'It suits private customers, business travel, airport transfers and company transport needs in Helsinki, Espoo, Vantaa and Kauniainen.',
        ],
      },
      {
        title: 'A personal driver for your journey',
        photo: '/assets/service-heroes/personal-driver.jpg',
        alt: 'A driver holding the car door for a customer',
        body: ['Book a driver for a short trip or a long one. Your own car, our driver, for example:'],
        list: [
          'To or from the airport',
          'To work or to a meeting',
          'To an event or a celebration',
          'Around Helsinki, Espoo, Vantaa or Kauniainen',
          'To another city or a longer journey',
        ],
        after: 'You get a personal, punctual service without having to order a separate car.',
        services: ['personalDriver', 'relocation'],
      },
      {
        title: 'Airport transfers in your own car',
        photo: '/assets/service-heroes/airport-driver.jpg',
        alt: 'A driver with a customer’s car outside the airport terminal',
        body: [
          'Need a driver to or from Helsinki Airport? A DriveMe driver comes to the agreed address and drives you to the terminal in your own car.',
          'The driver can also collect you at the airport and take you home or anywhere else you need to be.',
        ],
        services: ['personalDriver'],
      },
      {
        title: 'We take the car for you',
        photo: '/assets/service-heroes/vehicle-inspection-run.jpg',
        alt: 'A driver handing a car over at the inspection station',
        body: ['When your day is full, we collect your car and take it where it needs to go:'],
        list: [
          'To the inspection',
          'To a service or a repair',
          'To a tyre change',
          'To a wash or detailing',
          'To glass repair or a body shop',
          'To another address',
        ],
        after: 'We bring the car back as agreed. Inspection, service, repair, wash and other third-party charges are paid by the customer, directly to the provider.',
        services: ['workshopTransfer', 'relocation'],
      },
      {
        title: 'Driver service for companies',
        photo: '/assets/service-heroes/business.jpg',
        alt: 'A driver and a business customer handing over a vehicle',
        body: [
          'For companies we offer a flexible driver and vehicle-transfer service. Our drivers move a company or customer vehicle between sites, dealers, workshops and other agreed addresses.',
          'It suits companies that need a reliable, professional driver without employing driving staff of their own.',
        ],
        services: ['business'],
      },
    ],

    whyTitle: 'Why choose *DriveMe*',
    why: [
      {
        icon: 'driver',
        title: 'A professional driver',
        body: 'An experienced driver whose licence we verify and record, trained on DriveMe’s collection, handover and documentation rules.',
      },
      {
        icon: 'doc',
        title: 'A documented job',
        body: 'We photograph the condition, the mileage and the fuel level at collection and at return, and log the handover time, place and receiver.',
      },
      {
        icon: 'key',
        title: 'Your own car',
        body: 'We bring a driver to your car. The service does not include a DriveMe vehicle.',
      },
      {
        icon: 'price',
        title: 'A price you can see',
        body: 'You see an indicative price on the form immediately and we confirm a fixed fee before the drive. Fuel, parking and third-party charges are billed separately.',
      },
    ],

    stepsTitle: 'How to use the *10 % offer*',
    steps: [
      { title: 'Choose the service you need', body: 'Tell us when, from where and to where you need a driver.' },
      { title: 'Use the code DRIVEME10', body: 'Type it into the Offer code field on the request form. The buttons on this page fill it in for you.' },
      { title: 'Get 10 % off', body: 'We take 10 % off the DriveMe service fee on your first booking when we confirm the price.' },
    ],

    bandTitle: 'Book now and save 10 %',
    bandBody: 'The request takes under a minute. It is not a confirmation yet - we call you and confirm the driver, the time and a fixed price.',
    bandCta: 'Book now and save 10 %',

    termsTitle: 'Offer terms',
    terms: [
      'The offer applies to new private customers and to a customer’s first DriveMe booking in Helsinki, Espoo, Vantaa or Kauniainen. The booking must be made by 31 October 2026.',
      'The discount applies to the DriveMe service fee only. It does not apply to fuel, parking, inspection, service, workshop, tyre, wash or other third-party charges.',
      'The offer cannot be combined with other discounts or benefits. The service is provided subject to availability.',
    ],

    bar: {
      lead: 'New customer offer',
      text: '10 % off your first booking',
      more: 'Read more',
    },
  },
};

/* Swedish, from content/sv/offer.mjs. */
import * as SV from './sv/offer.mjs';
Object.assign(offer, { sv: SV.offer });

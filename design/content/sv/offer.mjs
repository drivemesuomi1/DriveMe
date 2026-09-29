/**
 * Nykundserbjudandet på svenska: 10 % på DriveMes serviceavgift vid första
 * bokningen, koden DRIVEME10, till och med 31.10.2026.
 *
 * Samma innehåll som den finska sidan i ../offer.mjs, skrivet för svenska
 * läsare i huvudstadsregionen - inte översatt mening för mening.
 */

export const offer = {
  slug: 'sv/nykundserbjudande',
  title: '10 % rabatt på förartjänsten | DriveMe Helsingfors',
  description: 'Som ny kund får du 10 % rabatt på din första DriveMe-bokning. Pålitlig förartjänst i Helsingfors, Esbo, Vanda och Grankulla.',
  nav: 'Nykundserbjudande',

  eyebrow: 'Nykundserbjudande',
  h1: '10 % rabatt på *din första bokning*',
  lead: 'Behöver du en pålitlig och yrkeskunnig förare till din egen bil? Boka din första DriveMe-tjänst senast 31.10.2026 så får du 10 % rabatt på DriveMes serviceavgift.',
  codeLabel: 'Förmånskod',
  codeHint: 'Använd koden när du skickar din förfrågan.',
  validUntil: 'Gäller till 31.10.2026',
  areaLine: 'Erbjudandet gäller i Helsingfors, Esbo, Vanda och Grankulla.',
  cta: 'Begär en förare',
  ctaSecondary: 'Se prislistan',
  expired: 'Det här erbjudandet har gått ut. Tjänsten och prislistan är oförändrade - begär pris så bekräftar vi det före körningen.',

  sections: [
    {
      title: 'En pålitlig förartjänst för din egen bil',
      photo: '/assets/service-heroes/journey-driver.jpg',
      alt: 'En DriveMe-förare vid ratten i kundens bil',
      body: [
        'DriveMe erbjuder en trygg och flexibel förartjänst i kundens egen bil. Vår yrkeskunniga förare kör dig, eller din bil, till den överenskomna destinationen.',
        'Tjänsten passar privatkunder, arbetsresor, flygplatstransfer och företagens transportbehov i Helsingfors, Esbo, Vanda och Grankulla.',
      ],
    },
    {
      title: 'En personlig förare för din resa',
      photo: '/assets/service-heroes/personal-driver.jpg',
      alt: 'En förare öppnar bildörren för kunden',
      body: ['Boka en pålitlig förare för en kort eller lång resa. Din egen bil, vår förare, till exempel:'],
      list: [
        'Till eller från flygplatsen',
        'Till jobbet eller ett möte',
        'Till ett evenemang eller en fest',
        'Inom Helsingfors, Esbo, Vanda eller Grankulla',
        'Till en annan stad eller på en längre resa',
      ],
      after: 'Du får en personlig och punktlig tjänst utan att behöva beställa en separat bil.',
      services: ['journey', 'personalDriver'],
    },
    {
      title: 'Flygplatstransfer i din egen bil',
      photo: '/assets/service-heroes/airport-driver.jpg',
      alt: 'En förare med kundens bil utanför flygplatsterminalen',
      body: [
        'Behöver du en förare till eller från Helsingfors-Vanda flygplats? DriveMes förare kommer till den överenskomna adressen och kör dig till terminalen i din egen bil.',
        'Föraren kan också möta dig på flygplatsen och köra dig hem eller dit du ska.',
      ],
      services: ['airport'],
    },
    {
      title: 'Vi kör bilen åt dig',
      photo: '/assets/service-heroes/vehicle-inspection-run.jpg',
      alt: 'En förare lämnar över bilen på besiktningsstationen',
      body: ['När dagen är full hämtar vi din bil och kör den dit den ska:'],
      list: [
        'Till besiktningen',
        'Till service eller reparation',
        'Till däckbyte',
        'Till tvätt eller detaljrengöring',
        'Till glasverkstad eller plåtverkstad',
        'Till en annan adress',
      ],
      after: 'Vi returnerar bilen enligt överenskommelse. Besiktning, service, reparation, tvätt och andra avgifter till tredje part betalar kunden direkt till leverantören.',
      services: ['inspection', 'workshop', 'tyre', 'wash'],
    },
    {
      title: 'Förartjänst för företag',
      photo: '/assets/service-heroes/business.jpg',
      alt: 'En förare och en företagskund lämnar över en bil',
      body: [
        'För företag erbjuder vi en flexibel förar- och fordonsflyttstjänst. Våra förare flyttar företagets eller kundens fordon mellan verksamhetsställen, bilhandlare, verkstäder och andra överenskomna adresser.',
        'Tjänsten passar företag som behöver en pålitlig och professionell förare utan egen förarpersonal.',
      ],
      services: ['business'],
    },
  ],

  whyTitle: 'Därför *DriveMe*',
  why: [
    {
      icon: 'driver',
      title: 'Yrkeskunnig förare',
      body: 'Du får en erfaren förare vars körrätt vi kontrollerar och registrerar, och som är introducerad i DriveMes rutiner för upphämtning, överlämning och dokumentation.',
    },
    {
      icon: 'doc',
      title: 'Dokumenterat uppdrag',
      body: 'Vi fotograferar skick, mätarställning och bränslenivå vid upphämtning och retur, och registrerar tid, plats och mottagare vid överlämningen.',
    },
    {
      icon: 'key',
      title: 'Din egen bil',
      body: 'Vi kommer med en förare till din bil. Tjänsten omfattar ingen bil från DriveMe.',
    },
    {
      icon: 'price',
      title: 'Tydligt pris',
      body: 'Du ser ett riktpris direkt i formuläret och vi bekräftar ett fast pris före körningen. Bränsle, parkering och avgifter till tredje part debiteras separat.',
    },
  ],

  stepsTitle: 'Så använder du *10 %-erbjudandet*',
  steps: [
    { title: 'Välj den tjänst du behöver', body: 'Berätta när, varifrån och vart du behöver en förare.' },
    { title: 'Använd koden DRIVEME10', body: 'Skriv in den i fältet Förmånskod på formuläret. Knapparna på den här sidan fyller i den åt dig.' },
    { title: 'Du får 10 % rabatt', body: 'Vi drar av 10 % på DriveMes serviceavgift för din första bokning när vi bekräftar priset.' },
  ],

  bandTitle: 'Boka nu och spara 10 %',
  bandBody: 'Förfrågan tar under en minut. Den är ännu ingen bekräftelse - vi ringer och bekräftar förare, tid och ett fast pris.',
  bandCta: 'Boka nu och spara 10 %',

  termsTitle: 'Villkor för erbjudandet',
  terms: [
    'Erbjudandet gäller nya privatkunder och kundens första DriveMe-bokning i Helsingfors, Esbo, Vanda eller Grankulla. Bokningen ska göras senast 31.10.2026.',
    'Rabatten gäller endast DriveMes serviceavgift. Den gäller inte bränsle, parkering, besiktning, service, verkstad, däckfirma, biltvätt eller andra avgifter till tredje part.',
    'Erbjudandet kan inte kombineras med andra rabatter eller förmåner. Tjänsten erbjuds i mån av tillgång.',
  ],

  bar: {
    lead: 'Nykundserbjudande',
    text: '10 % rabatt på din första bokning',
    more: 'Läs mer',
  },
};

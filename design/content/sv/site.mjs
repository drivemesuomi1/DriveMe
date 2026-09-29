/**
 * Swedish site-wide content: navigation, interface wording, the legal boundary
 * copy and the booking statements.
 *
 * Swedish is an official language of Finland, so this is not a courtesy
 * translation of the Finnish: it is the same service described in Swedish as a
 * Finnish reader of Swedish would expect to read it. Terms follow ordinary
 * Finland-Swedish usage - besiktning, verkstad, däckbyte, bilflytt - rather
 * than word-for-word renderings of the Finnish compounds.
 *
 * REVIEW PENDING: the terms, the responsibility boundary and the booking
 * statements carry consumer-law weight. They read correctly, but they should
 * be checked by the same counsel who reviews the Finnish terms before the
 * company relies on them.
 */

export const nav = [
  { key: 'services', label: 'Tjänster', href: '/sv/tjanster/', menu: true },
  { key: 'how', label: 'Så fungerar det', href: '/sv/sa-fungerar-det/' },
  { key: 'pricing', label: 'Priser', href: '/sv/priser/' },
  { key: 'business', label: 'För företag', href: '/sv/for-foretag/' },
  { key: 'safety', label: 'Säkerhet', href: '/sv/sakerhet/' },
  { key: 'faq', label: 'Vanliga frågor', href: '/sv/vanliga-fragor/' },
  { key: 'contact', label: 'Kontakt', href: '/sv/kontakt/' },
];

export const menuGroups = {
  appointment: 'Ta min bil till en tjänst',
  move: 'Kör min bil till en annan adress',
  passenger: 'Förare för din resa',
  business: 'Mer',
  all: 'Alla tjänster',
  pricing: 'Priser',
  safety: 'Säkerhet',
  faq: 'Vanliga frågor',
};

export const ui = {
  lang: 'sv-FI',
  skip: 'Hoppa till innehållet',
  bookCta: 'Begär pris',
  bookHref: '/sv/offert/',
  callUs: 'Ring',
  menu: 'Meny',
  close: 'Stäng',
  language: 'Språk',
  breadcrumbHome: 'Startsida',
  included: 'Det här ingår i DriveMe-tjänsten',
  customer: 'Kundens ansvar',
  excluded: 'Ingår inte',
  eligibility: 'Fordonets skick och rätten att neka ett uppdrag',
  steps: 'Så går det till',
  price: 'Pris',
  faq: 'Vanliga frågor',
  coverage: 'Serviceområde',
  related: 'Relaterade tjänster',
  boundary: 'Ansvarsfördelning',
  requestPrice: 'Begär pris',
  finalCta: 'En förare för din bil, *när du inte hinner själv*',
  priceFrom: 'från',
  vatNote: 'Priserna inkluderar moms.',
  thirdParty: 'Tjänsteleverantörens avgifter ingår inte i priset utan betalas direkt till leverantören.',
  onThisPage: 'På den här sidan',
  allServices: 'Alla tjänster',
  readMore: 'Läs mer',
  requestMove: 'Begär pris för bilflytt',
  noPassenger: 'Du behöver inte åka med. Föraren kör bilen till destinationen, och inga passagerare åker med.',
  passengers: 'Passagerare',
  noPassengerShort: 'Inga passagerare, du åker inte med',
  withPassengers: 'Du och ditt sällskap',
  phoneLabel: 'Telefon',
  serviceEmailLabel: 'Kundtjänst',
  generalEmailLabel: 'Allmänna ärenden',
};

export const disclaimer = 'DriveMe tillhandahåller upphämtning, körning, leverans och överenskommen överlämning av fordon. Besiktning, service, reparation, däckarbete, tvätt, detaljrengöring, parkering och andra tjänster från tredje part bygger på ett separat avtal mellan kunden och den leverantör kunden valt. Kunden ansvarar för att boka tiden, godkänna arbetet och betala leverantören direkt. DriveMe garanterar inte tredje partens tillgänglighet, tidtabell, pris, arbetskvalitet eller slutresultat. DriveMe ansvarar för sin egen tjänst i den utsträckning tillämplig lag kräver.';

export const acknowledgements = [
  'Jag är fordonets ägare, innehavare eller behörig användare och ger DriveMe rätt att köra bilen för det här uppdraget.',
  'Bilen är registrerad i trafik, försäkrad och körduglig, och har inget körförbud.',
  'Jag har uppgett de fel, varningslampor, ändringar och särskilda bruksanvisningar jag känner till.',
  'Jag har bokat eller bekräftat tiden hos tredje part när tjänsten kräver det.',
  'Jag godkänner och betalar tredje partens tjänster direkt; DriveMe har ingen rätt att godkänna tilläggsarbeten.',
  'Jag har tagit bort kontanter, värdesaker, förbjudna föremål och onödiga personuppgifter ur bilen.',
  'Jag godkänner att skick, mätarställning, bränsle- eller laddningsnivå och överlämning fotograferas som dokumentation av tjänsten.',
  'Jag godkänner det bekräftade DriveMe-priset, väntereglerna och avbokningsvillkoren.',
];

export const eligibility = [
  'Giltig registrering, försäkring och lagstadgad besiktning.',
  'Rätt säsongsdäck och däck i trafikdugligt skick.',
  'Tillräckligt med bränsle eller laddning för den planerade rutten, med rimlig marginal.',
  'Inget gällande körförbud, ingen skada som äventyrar säkerheten, inget allvarligt vätskeläckage och ingen kritisk varning.',
  'Sedvanliga reglage som motsvarar förarens körrätt och den kompetens som uppgetts.',
  'Nycklar och eventuell låsbultsnyckel tillgängliga.',
];

export const refusal = 'Föraren kör inte en bil som verkar trafikfarlig, olaglig eller väsentligt annorlunda än vad bokningen uppger. Då dokumenterar vi situationen, avbryter uppdraget och kunden ordnar bogsering eller annan laglig transport. Vi debiterar endast grundavgiften och den tid som faktiskt gått åt, enligt villkoren.';

export const trustStrip = [
  { icon: 'price', label: 'Priset bekräftas före körningen' },
  { icon: 'driver', label: 'Professionell förare' },
  { icon: 'doc', label: 'Dokumenterad upphämtning och retur' },
  { icon: 'key', label: 'Du behöver inte åka med' },
  { icon: 'pin', label: 'Helsingfors, Esbo, Vanda, Grankulla' },
];

export const howItWorks = [
  { t: 'Berätta vart bilen ska', d: 'Upphämtningsadress, destination eller verkstad och önskad dag. Du ser ett riktpris direkt.' },
  { t: 'Vi ringer och bekräftar', d: 'Vi går igenom bilens uppgifter och bekräftar förare, tid och fast pris. En förfrågan är ännu ingen bekräftelse.' },
  { t: 'Föraren hämtar bilen', d: 'Vi fotograferar skick, mätarställning och bränsle- eller laddningsnivå. Du behöver inte åka med.' },
  { t: 'Framme, eller hemma igen', d: 'Varje överlämning dokumenteras och du får besked när bilen är levererad eller tillbaka.' },
];

export const statusModel = [
  'Förfrågan mottagen', 'Väntar på uppgifter', 'Bekräftad', 'Förare utsedd', 'Föraren på väg',
  'Bilen upphämtad', 'Hos leverantören eller under transport', 'Klar för retur', 'På väg tillbaka',
  'Levererad', 'Slutförd',
];

export const cancellation = [
  'Avgiftsfri avbokning minst 24 timmar före den bekräftade upphämtningen.',
  'Mindre än 24 timmar före upphämtningen: 50 % av DriveMe-arvodet.',
  'Efter att föraren åkt, eller om kunden eller leverantören inte är på plats: grundavgiften samt den tid, parkering och resa som uppstått, upp till det tak som anges i villkoren.',
  'Tredje partens avbokningsavgifter regleras alltid av kundens separata avtal med den leverantören.',
];

export const gateNotice = 'Den här tjänsten inväntar bekräftelse från myndighet och försäkringsbolag. Vi tar emot kontakter, men bekräftar inga uppdrag förrän tillstånds- och försäkringsfrågorna är bekräftade skriftligt.';

export const screening = {
  open: 'Varje förare har en giltig körrätt som vi kontrollerar och dokumenterar, samt en personlig introduktion till DriveMes regler för upphämtning, överlämning och dokumentation. Vi publicerar inga bredare påståenden om bakgrundskontroller förrän innehållet i kontrollerna är godkänt av jurist och dataskyddsanvisningar.',
  closed: 'Varje förare genomgår en publicerad, dokumenterad checklista före sitt första uppdrag.',
};

export const footer = {
  tagline: 'En förare för din bil i huvudstadsregionen. Du behöver inte åka med.',
  columns: [
    { title: 'Ta min bil till en tjänst', keys: ['inspection', 'workshop', 'tyre', 'wash', 'glass', 'dealer'] },
    { title: 'Bilflytt', keys: ['relocation', 'pickupReturn', 'business'] },
    { title: 'Förare för din resa', keys: ['journey', 'personalDriver', 'safeRideHome', 'airport'] },
  ],
  legalLinks: [
    { label: 'Servicevillkor', href: '/sv/villkor/' },
    { label: 'Avbokningsvillkor', href: '/sv/villkor/#avbokning' },
    { label: 'Dataskydd', href: '/sv/villkor/#dataskydd' },
    { label: 'Säkerhet', href: '/sv/sakerhet/' },
  ],
  company: 'Mansio Group Oy · Helsingfors, Finland',
  note: 'DriveMe är en tjänst från Mansio Group Oy. DriveMe är varken verkstad, besiktningsstation, däckfirma, biltvätt, försäkringsbolag eller betalningsförmedlare.',
};

/** Micro-copy the page templates need in every language. */
export const words = {
  cities: ['Helsingfors', 'Esbo', 'Vanda', 'Grankulla'],
  notBookable: 'Inte bokningsbar ännu',
  fixedQuote: 'Fast offert',
  ackNote: 'Vi går igenom de här med dig innan bokningen bekräftas.',
  gateCleared: 'Bekräftad',
  gateWaiting: 'Inväntar bekräftelse',
  gateNoticeTitle: 'Tjänsten är inte bokningsbar ännu',
  companyProvider: 'Tjänsteleverantör: ',
  companyBusinessId: 'FO-nummer: ',
  companyDomicile: 'Hemort: Helsingfors, Finland',
  companyPhone: 'Telefon: ',
  companyEmail: 'E-post: ',
  companyArea: 'Serviceområde: ',
  coverageBody: (areas) => `Vi betjänar för närvarande i ${areas}. Längre flyttar prissätts från fall till fall.`,
  ctaBody: 'Berätta var bilen finns och vart den ska. Vi bekräftar ett fast pris före körningen.',
  registerInterest: 'Anmäl ditt intresse',
  interestTitle: 'Berätta om ditt intresse',
  interestBody: 'Vi hör av oss så snart tillstånds- och försäkringsfrågorna är bekräftade och tjänsten kan bokas.',
  sendEmail: 'Skicka e-post',
  appointment: 'Tidsbokning',
  fullPriceList: 'Hela prislistan',
  allQuestions: 'Alla frågor',
  safetyAndInsurance: 'Säkerhet och försäkringar',
  reviewPending: 'Granskning pågår',
  getInTouch: 'Kontakt',
  information: 'Information',
  /** Query-string names the request form understands in this language. */
  params: { source: 'kalla', service: 'tjanst', pickup: 'hamtning', date: 'datum', type: 'typ', offer: 'erbjudande' },
  typeValues: { move: 'flytt', service: 'service', journey: 'resa' },
  typicalShort: (a, b) => `Vanligtvis ${a}–${b} €`,
  safetyPoints: [
    'Tidsstämplade bilder vid upphämtning och retur',
    'Mätarställning och bränsle- eller laddningsnivå antecknas',
    'Tid, plats och mottagare för överlämningen sparas',
    'Vi berättar öppet vilka tillstånds- och försäkringsfrågor som ännu är öppna',
  ],
  price: {
    gated: (name) => `${name} går inte att boka ännu, så vi publicerar inget pris för tjänsten.`,
    journey: (name) => `${name}: fast offert. Priset bildas av rutten, resans längd, antalet passagerare och förarens returresa, och vi bekräftar det före resan. Bränsle, laddning, vägavgifter och parkering anges separat i offerten.`,
    intro: (name, from) => `${name}: ${from}. Priset inkluderar moms.`,
    typical: (a, b) => `Ett typiskt uppdrag i huvudstadsregionen kostar ${a}–${b} € beroende på rutt, tidpunkt och väntetid.`,
    indicative: 'Du ser ett riktpris direkt i formuläret och vi bekräftar ett fast DriveMe-pris innan föraren åker.',
    toProvider: 'Leverantörens egen avgift, till exempel besiktningen eller servicen, betalar du direkt till leverantören.',
    ownCosts: 'Eventuella kostnader för bränsle, parkering och vägavgifter anges separat i offerten.',
  },
  appointmentLabels: {
    required: 'Krävs',
    recommended: 'Rekommenderas',
    none: 'Behövs inte',
    flight: 'Flyguppgifter',
    depends: 'Beror på uppdraget',
  },
  /** Alt text for the photographs on the homepage. */
  alt: {
    handover: 'Föraren kör kundens bil ensam',
    corporate: 'En DriveMe-förare och en företagskund lämnar över en bil',
    interior: 'Mittkonsolen och växelväljaren i en bil',
  },
};

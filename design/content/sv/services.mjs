/**
 * The service catalogue in Swedish.
 *
 * One entry per service, keyed exactly like content/services.mjs, and merged
 * into it there. The wording follows Finland-Swedish usage: besiktning,
 * verkstad, däckbyte, bilflytt, återlämning - not transliterated Finnish.
 *
 * The responsibility boundary on every page is the same promise as the Finnish
 * one, in Swedish: DriveMe sells the driving and the documented handover, the
 * customer keeps the agreement with the provider.
 */







export const relocation = {
  slug: 'bilflytt',
  nav: 'Bilflytt',
  short: 'Bilflytt',
  title: 'Bilflytt i Helsingfors och huvudstadsregionen | DriveMe',
  description: 'En förare hämtar din körklara bil och kör den till en annan adress i huvudstadsregionen. Du åker inte med, och överlämningen dokumenteras i båda ändar.',
  h1: 'Bilflytt: en förare kör din bil till en annan adress',
  lead: 'Vi hämtar din körklara bil och kör den till den överenskomna adressen, vid behov också tillbaka. Du behöver inte åka med, och överlämningen dokumenteras i båda ändar.',
  keywords: ['bilflytt', 'flytta bilen', 'köra bilen till annan adress'],
  steps: [
    'Du uppger upphämtnings- och leveransadress samt kontaktpersonerna i båda ändar.',
    'Vi bekräftar ett fast pris utifrån rutt, tidpunkt och förarens returresa.',
    'Vi hämtar bilen och dokumenterar skick, mätarställning och bränsle- eller laddningsnivå.',
    'Vi levererar bilen och kvitterar överlämningen till den behöriga mottagaren.',
  ],
  included: [
    'Körd flytt i en riktning',
    'Bilder vid upphämtning och leverans',
    'Anteckningar om mätarställning, bränsle- eller laddningsnivå och nyckelöverlämning',
    'Statusmeddelanden',
  ],
  customer: [
    'Namnge behöriga kontaktpersoner i båda ändar',
    'Säkerställ giltig registrering, försäkring, däck och körduglighet',
    'Uppge fel, ändringar och särskilda reglage',
    'Betala bränsle, laddning, vägavgifter och parkering enligt offerten',
  ],
  excluded: [
    'Transport på flak eller släp',
    'Flytt av avställda bilar eller bilar med körförbud',
    'Flyttar utanför Finlands gränser',
    'Förvaring',
  ],
  boundary: 'DriveMe ansvarar för den körda flytten och den dokumenterade överlämningen. Kunden ansvarar för bilens skick och för de uppgifter som lämnats.',
  faq: [
    { q: 'Behöver jag åka med i bilen?', a: 'Nej. Föraren kör bilen ensam och inga passagerare åker med. Det räcker att nycklarna lämnas över som överenskommet vid upphämtningen och att någon tar emot bilen framme, eller att nycklarna lämnas på en överenskommen plats.' },
    { q: 'Kan jag beställa returen också?', a: 'Ja. Ange i förfrågan att bilen ska tillbaka senare, så prissätter vi upphämtningen och returen som ett uppdrag.' },
    { q: 'Körs bilen eller transporteras den på flak?', a: 'Vi kör den. Det är snabbare och förmånligare för en körduglig bil. Om bilen inte är körduglig eller inte får köras behövs flak, och då hänvisar vi dig till en transportpartner.' },
    { q: 'Flyttar ni bilar utanför huvudstadsregionen?', a: 'Ja, men långa flyttar prissätts från fall till fall eftersom förarens returresa är en del av kostnaden. Begär offert för rutten.' },
    { q: 'Vem betalar bränsle och vägavgifter?', a: 'De anges separat i offerten. Vi gömmer dem inte i priset.' },
  ],
};



export const personalDriver = {
  slug: 'personlig-forare',
  nav: 'Personlig förare',
  short: 'Personlig förare',
  title: 'Personlig förare för din egen bil i Helsingfors | DriveMe',
  description: 'En professionell förare kör din egen bil under en kväll, ett evenemang, en arbetsdag eller en dag med flera stopp i huvudstadsregionen.',
  h1: 'Personlig förare för kundens egen bil',
  lead: 'Din bil, dina planer, en professionell förare - för en kväll, ett evenemang eller en dag med flera stopp.',
  keywords: ['personlig förare', 'chaufför egen bil', 'förare för kvällen'],
  steps: [
    'Du berättar tidtabellen, upphämtningsadressen, stoppen och destinationen.',
    'Vi bekräftar föraren och priset före körningen.',
    'Föraren kommer på överenskommen tid och kör din egen bil.',
    'Bilen och nycklarna överlämnas till dig på den överenskomna platsen.',
  ],
  included: [
    'Förarens tid enligt den bekräftade tidtabellen',
    'Överenskommen upphämtning, stopp och destination',
    'Dokumenterad föraridentitet och supportkontakt',
    'Trygg överlämning av bil och nycklar',
  ],
  customer: [
    'Var i skick att stiga in i bilen och åka med som passagerare på ett tryggt sätt',
    'Ställ en laglig, försäkrad och körduglig bil till förfogande',
    'Uppge särskilda reglage',
    'Betala parkering, vägavgifter och bilens energi om inte annat anges i offerten',
  ],
  excluded: [
    'Transport av barn utan medföljande vuxen',
    'Vårdande övervakning eller assistans',
    'Körning av en trafikfarlig bil',
    'Obegränsad väntan eller obekräftade förlängningar',
  ],
  boundary: 'DriveMe ansvarar för föraren och den överenskomna tiden. Kunden ansvarar för bilens skick, försäkring och passagerarnas säkerhetsutrustning. Priset bekräftas före körningen.',
  faq: [
    { q: 'Kör föraren min bil eller er bil?', a: 'Din egen. Det är kärnan i tjänsten: en bekant bil, egna bilbarnstolar och egna saker, utan att byta till ett främmande fordon.' },
    { q: 'Är tjänsten tillgänglig nu?', a: 'Ja. En förare för din egen bil går att boka, och priset bekräftas utifrån rutt och längd före körningen.' },
    { q: 'Finns det ett minimiantal timmar?', a: 'Vi rekommenderar minst två timmar. Vi uppger priset och minimitiden i samband med bokningen.' },
    { q: 'Transporterar ni ett barn ensamt?', a: 'Nej. Transport av barn utan medföljande vuxen ingår inte i tjänsten.' },
  ],
};



export const business = {
  slug: 'for-foretag',
  nav: 'För företag',
  short: 'För företag',
  title: 'Företagens bilflytt i Helsingfors | DriveMe',
  description: 'Upphämtningar, serviceflyttar, överlämningar till anställda och andra flyttar av företagsbilar från en och samma pålitliga partner. I Helsingforsregionen.',
  h1: 'Flytt av fordon för företag',
  lead: 'En pålitlig kontaktperson för återkommande fordonsflyttar, servicetider och överlämningar till anställda.',
  keywords: ['flytt av företagsbilar', 'fordonsflytt för företag', 'fleet concierge Finland'],
  steps: [
    'Du berättar bilparkens storlek, de vanligaste rutterna och antalet flyttar per månad.',
    'Vi kommer överens om servicenivå, behöriga beställare och godkännandegränser.',
    'Beställningarna kommer in via ett ställe och vi utser en förare för varje uppdrag.',
    'Du får uppdragsspecifik status och en samlad månadsfaktura.',
  ],
  included: [
    'Namngivet företagskonto',
    'Central beställning och utsedd förare',
    'Dokumentation av fordonets skick',
    'Samlad månadsfaktura',
    'Uppdragsspecifik status och avvikelseanteckning',
  ],
  customer: [
    'Behöriga beställare och kostnadsställen',
    'Fordonens skick och tiderna hos leverantörerna',
    'Tydliga godkännandegränser',
    'Uppdaterade fordons- och kontaktuppgifter',
  ],
  excluded: [
    'Beslut om bilparkens underhåll',
    'Tredje parts arbetskvalitet',
    'Icke godkända reparationskostnader',
    'Bogsering eller förvaring, om inte annat avtalats',
  ],
  boundary: 'DriveMe sköter flyttarna och överlämningarna. Underhållsbeslut, reparationsgodkännanden och leverantörernas fakturor stannar hos företaget.',
  faq: [
    { q: 'Vilken bilparksstorlek passar tjänsten?', a: 'Tjänsten är byggd för bilparker på 2-50 fordon utan egen fordonskoordinator. Mindre fungerar också när flyttarna är regelbundna.' },
    { q: 'Får vi en enda faktura?', a: 'Ja. Vi samlar månadens uppdrag på en faktura, specificerad per kostnadsställe.' },
    { q: 'Kan en anställd lämna över bilen?', a: 'Ja, när personen är namngiven i bokningen som behörig att lämna eller ta emot bilen.' },
    { q: 'Godkänner ni reparationer åt oss?', a: 'Nej. Föraren godkänner varken arbete eller kostnader. Godkännandegränsen är noll euro om inte annat avtalats.' },
  ],
};

/* The four primary business transfers. */
export * from './services-transfer.mjs';

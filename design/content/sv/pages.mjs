/**
 * The standalone pages in Swedish: homepage, services hub, prices, how it
 * works, safety, FAQ, terms, contact and the request page.
 *
 * Keyed exactly like content/pages.mjs and merged into it there. Prices come
 * from api/_lib/pricing.js like every other language, so a Swedish page can
 * never quote a figure the API does not charge.
 *
 * REVIEW PENDING: /sv/villkor/ is the Swedish face of the terms and carries the
 * same consumer-law weight as the Finnish page. It should go to the same
 * counsel before the company relies on it.
 */

import { PRODUCTS, WAITING, PREMIUMS } from '../../api/_lib/pricing.js';

const fmt = (n) => `${n} €`;
const range = (p) => `${p.typical[0]}-${p.typical[1]} €`;

export const home = {
  slug: 'sv',
  title: 'En förare för din bil | Bilflytt, besiktning och service | DriveMe',
  description: 'DriveMe hämtar din körklara bil och kör den till den adress, besiktning, verkstad, däckfirma eller biltvätt du väljer i huvudstadsregionen. Du behöver inte åka med.',
  eyebrow: 'Bilflytt i huvudstadsregionen',
  h1: 'En förare för din bil - när du inte hinner köra själv.',
  h1Accent: 'En förare för din bil –',
  h1Rest: 'när du inte hinner köra själv.',
  lead: 'Vi hämtar din körklara bil och kör den till den adress du väljer, till besiktning, service, däckbyte eller tvätt. Du behöver inte åka med.',
  primary: { label: 'Begär pris för bilflytt', href: '/sv/offert/?kalla=home_hero' },
  secondary: { label: 'Se tjänsterna', href: '/sv/tjanster/' },
  trustLine: 'Din bil. Vår förare. Ett tydligt pris före körningen.',
  offerTitle: 'Vad behöver din bil?',
  paths: [
    {
      key: 'journey',
      label: 'Förare för min resa',
      body: 'En förare kör dig och ditt sällskap i din egen bil: till flygplatsen, till en annan stad eller på en längre resa. Berätta rutt, tidpunkt och hur många ni är.',
      priceService: 'journey',
      href: '/sv/offert/?typ=resa&kalla=home_journey',
      cta: 'Begär pris',
      linkLabel: 'Förare för din resa',
      linkHref: '/sv/forare-for-din-resa/',
    },
    {
      key: 'move',
      label: 'Kör min bil till en annan adress',
      body: 'En förare hämtar din bil och kör den till den överenskomna adressen: ett nytt hem, jobbet, sommarstugan eller en annan parkeringsplats. Berätta om den också behöver komma tillbaka.',
      priceService: 'relocation',
      href: '/sv/offert/?typ=flytt&kalla=home_move',
      cta: 'Begär pris för flytt',
      linkLabel: 'Bilflytt',
      linkHref: '/sv/bilflytt/',
    },
    {
      key: 'appointment',
      label: 'Ta min bil till en tjänst',
      body: 'Vi kör din bil till besiktning, service, däckbyte, tvätt eller bilhandel och returnerar den enligt överenskommelse. Du bokar tiden och betalar leverantören direkt.',
      priceService: 'workshop',
      href: '/sv/offert/?typ=service&kalla=home_service',
      cta: 'Begär pris för servicekörning',
      linkLabel: 'Se alla servicekörningar',
      linkHref: '/sv/tjanster/',
    },
  ],
  quick: {
    title: 'Begär pris *för bilflytt*',
    service: 'Vart ska bilen?',
    moveOption: 'Till en annan adress (bilflytt)',
    pickup: 'Upphämtningsadress eller postnummer',
    pickupPlaceholder: 'T.ex. 00100 eller Mannerheimvägen 1',
    date: 'Önskad dag',
    from: 'från',
    submit: 'Fortsätt, tar under en minut',
    note: 'En förfrågan är ännu ingen bekräftelse. Vi ringer och bekräftar förare, tid och ett fast pris.',
  },
  mosaic: {
    title: 'DriveMes *tjänster*',
    intro: 'En förare kör din bil dit den ska: till en annan adress, till besiktning, till verkstaden eller till tvätten. Du behöver inte åka med.',
    quote: 'Begär pris',
    blurbs: {
      journey: 'En förare kör dig och ditt sällskap till flygplatsen eller på en längre resa.',
      relocation: 'En förare kör din bil till en annan adress, vid behov också tillbaka.',
      inspection: 'Till besiktningen och tillbaka, med handlingarna.',
      workshop: 'Upphämtning, leverans till verkstaden och retur när bilen är klar.',
      tyre: 'Däckbyte eller däckhotell utan att stå i kö.',
      wash: 'Tvätt eller detaljrengöring mitt i din arbetsdag.',
      pickupReturn: 'Upphämtning på överenskommen plats och retur senare.',
      glass: 'En körduglig bil till glas- eller plåtverkstaden.',
      dealer: 'Dokumenterad överlämning till bilhandeln eller leasingbolaget.',
      business: 'Återkommande flyttar och servicekörningar med ett avtal.',
    },
  },
  howTitle: 'Så *fungerar det*',
  priceTitle: 'Ett tydligt pris *före körningen*',
  priceLead: 'Du ser ett riktpris direkt och vi bekräftar ett fast DriveMe-pris före körningen. Leverantörens avgifter, som besiktningen eller servicen, betalar du direkt till leverantören.',
  priceKeys: ['relocation', 'workshop', 'inspection'],
  handoverTitle: 'Du lämnar nycklarna, *vi sköter körningen*',
  handoverBody: 'Du sitter inte i bilen och väntar inte i verkstadens lobby. Föraren hämtar bilen på den överenskomna platsen, kör den till destinationen och antecknar varje överlämning.',
  handoverPoints: [
    'Upphämtning hemma, på jobbet eller i parkeringshuset',
    'Skick, mätarställning och bränsle- eller laddningsnivå fotograferas vid upphämtningen',
    'Föraren godkänner inga tilläggsarbeten för din räkning',
    'Vid en bilflytt åker inga passagerare med',
  ],
  businessTitle: 'Flytt av *företagsbilar*',
  businessBody: 'Återkommande flyttar, servicekörningar och överlämningar till anställda från en och samma partner, med status per uppdrag och en enda månadsfaktura.',
  safetyTitle: 'Så skyddar vi *din bil och dina uppgifter*',
  safetyBody: 'Vi dokumenterar varje upphämtning och överlämning med tidsstämplade bilder, antecknar mätarställning och bränsle- eller laddningsnivå och berättar öppet vad försäkringen och tillstånden täcker just nu.',
  ctaTitle: 'Begär pris *för bilflytt*',
  ctaBody: 'Berätta var bilen finns och vart den ska. Vi ringer, bekräftar ett fast pris och sköter körningen.',
};

export const servicesHub = {
  slug: 'sv/tjanster',
  title: 'Bilflyttar och servicekörningar | DriveMe',
  description: 'Alla DriveMes tjänster: bilen till besiktning, verkstad, däckbyte och tvätt, bilflytt mellan adresser, förare för din resa och flyttar av företagsbilar.',
  h1: 'Bilflyttar och *servicekörningar*',
  lead: 'En förare kör din bil dit den ska. Du behöver inte åka med, och leverantören väljer du alltid själv.',
  groups: [
    { title: 'Ta min bil till en tjänst', body: 'Upphämtning, leverans till den tjänst du valt och retur enligt överenskommelse. Tiden bokar du och tjänsten betalar du själv.', keys: ['inspection', 'workshop', 'tyre', 'wash', 'glass', 'dealer'] },
    { title: 'Kör min bil till en annan adress', body: 'En körduglig bil från en överenskommen adress till en annan, vid behov också tillbaka.', keys: ['relocation', 'pickupReturn'] },
    { title: 'Förare för din resa', body: 'En förare kör dig och ditt sällskap i din egen bil. Varje resa prissätts utifrån rutten.', keys: ['journey', 'personalDriver', 'safeRideHome', 'airport'] },
    { title: 'För företag', body: 'Återkommande flyttar, servicekörningar och överlämningar med ett avtal.', keys: ['business'] },
  ],
};

const priceRows = [
  ['Bilen körd till en annan adress', `från ${fmt(PRODUCTS.oneWay.from)}`, 'En upphämtning och en leverans', `Vanligtvis ${range(PRODUCTS.oneWay)} beroende på rutt och tidpunkt`],
  ['Upphämtning och retur senare', `från ${fmt(PRODUCTS.pickupReturn.from)}`, 'Två överenskomna körningar', `Vanligtvis ${range(PRODUCTS.pickupReturn)}; leverantörens tid debiteras inte när föraren har åkt`],
  ['Service-, däck- eller tvättkörning', `från ${fmt(PRODUCTS.serviceRun.from)}`, 'Upphämtning, leverans och retur senare', `Vanligtvis ${range(PRODUCTS.serviceRun)}; leverantörens avgifter ingår inte`],
  ['Bilen till besiktning', `från ${fmt(PRODUCTS.inspection.from)}`, `Upphämtning, väntan högst ${WAITING.waitReturnIncludedMinutes} min och retur`, 'Besiktningsavgiften betalas direkt till stationen'],
  ['Vänta och returnera', `från ${fmt(PRODUCTS.waitReturn.from)}`, `Upphämtning, väntan högst ${WAITING.waitReturnIncludedMinutes} min och retur`, `Därefter ${fmt(WAITING.hourlyRate)}/h i poster om ${WAITING.unitMinutes} minuter`],
  ['Återlämning till bilhandel eller leasingbolag', `från ${fmt(PRODUCTS.handover.from)}`, 'Upphämtning och dokumenterad överlämning', 'Leverantörens avgifter betalar du direkt'],
  ['Förare för din resa i din egen bil', 'Fast offert', 'Förare, överenskommen rutt och tidtabell', 'Priset bildas av rutt, längd, antal passagerare och returresa'],
  ['Långdistansflytt', 'Fast offert', 'Körd flytt utanför huvudstadsregionen', 'Bränsle, laddning och förarens returresa specificeras'],
  ['Företagskunder', 'Avtalspris', 'Återkommande flyttar, rapportering och fakturering', 'Månatlig minimivolym eller serviceavgift'],
];

export const pricing = {
  slug: 'sv/priser',
  title: 'DriveMes priser | Bilflytt och servicekörningar',
  description: `DriveMes priser: bilflytt från ${PRODUCTS.oneWay.from} €, service-, däck- eller tvättkörning från ${PRODUCTS.serviceRun.from} €, besiktningskörning från ${PRODUCTS.inspection.from} €. Leverantörens avgifter ingår inte.`,
  h1: 'DriveMes *priser*',
  lead: 'Priserna inkluderar moms. Du ser ett riktpris direkt i formuläret och vi bekräftar ett fast DriveMe-pris innan föraren åker. Resor där du själv åker med prissätts utifrån rutten.',
  blocks: [
    { type: 'priceTable', head: ['Tjänst', 'Pris', 'Innehåller', 'Att notera'], rows: priceRows },
    {
      type: 'callout', tone: 'info', title: 'Så bildas priset',
      body: 'Priset räknas utifrån utryckningsavgiften, förarens tid, stödbilens tid, ruttens kilometrar, förväntad väntetid, parkering och vägavgifter samt ett eventuellt tidstillägg. Vi ber dig aldrig räkna kilometrar utanför någon gräns: du ger adresserna och tiden, vi ger ett pris.',
    },
    {
      type: 'list', title: 'Tydligt angivna tillägg', variant: 'plain',
      items: [
        `Nattarbete kl. ${PREMIUMS.night.fromHour}-0${PREMIUMS.night.toHour}: +${PREMIUMS.night.pct} %`,
        `Veckoslut: +${PREMIUMS.weekend.pct} %`,
        `Helgdag: +${PREMIUMS.publicHoliday.pct} %`,
        `Brådskande beställning mindre än ${PREMIUMS.urgent.withinHours} timmar före upphämtningen: +${PREMIUMS.urgent.pct} %`,
        'Tilläggen staplas inte: vi debiterar bara ett, det högsta.',
      ],
      note: 'Tilläggen syns som egna rader i prisuppskattningen innan du skickar förfrågan.',
    },
    {
      type: 'list', title: 'Väntetid', variant: 'plain',
      items: [
        `Varje överlämning innehåller ${WAITING.includedMinutes} minuters väntetid.`,
        `Besiktningskörningen och "vänta och returnera" innehåller ${WAITING.waitReturnIncludedMinutes} minuter.`,
        `Därefter debiteras väntetid med ${fmt(WAITING.hourlyRate)}/h i poster om ${WAITING.unitMinutes} minuter.`,
      ],
    },
    {
      type: 'list', title: 'Vad priset inte innehåller', variant: 'cross',
      items: [
        'Avgifter för besiktning, service, reparation, däck, tvätt och detaljrengöring',
        'Bränsle, laddning, parkering och vägavgifter, om inte annat anges i offerten',
        'Tredje parts avboknings- eller hanteringsavgifter',
        'Bogsering, flaktransport eller förvaring av bilen',
      ],
      note: 'Tredje parts tjänster betalar du direkt till den leverantör du valt.',
    },
    { type: 'cancellation', title: 'Avbokningsvillkor', id: 'avbokning' },
    {
      type: 'callout', tone: 'warn', title: 'Varför vi inte visar en färdig slutsumma',
      body: 'Rutten, överlämningstiden och väntetiden påverkar den verkliga kostnaden. Därför visar vi ett riktgivande från-pris och bekräftar ett fast pris före körningen. Vi debiterar aldrig mer än det bekräftade priset utan en separat överenskommen ändring.',
    },
  ],
};

export const howPage = {
  slug: 'sv/sa-fungerar-det',
  title: 'Så fungerar DriveMe | Från prisförfrågan till slutfört uppdrag',
  description: 'Från prisförfrågan till bekräftelse, från upphämtning till dokumenterad överlämning. Så flyttar DriveMe din bil utan att du behöver åka med.',
  h1: 'Så *fungerar DriveMe*',
  lead: 'En prisförfrågan tar under en minut, och varje uppdrag bekräftas av en människa. Därför har varje bekräftat uppdrag en riktig förare, en riktig tid och ett riktigt pris.',
  blocks: [
    {
      type: 'steps', title: 'Kundens väg', rows: true, two: true,
      items: [
        { t: 'Välj flytt eller servicekörning', d: 'Kör min bil till en annan adress, eller ta bilen till besiktning, service, däckbyte, tvätt eller bilhandel.' },
        { t: 'Ange upphämtning, destination och önskad tid', d: 'Upphämtningsadress eller postnummer, destinationsadress eller leverantör, och dagen.' },
        { t: 'Lämna namn och telefonnummer', d: 'Att skicka förfrågan tar under en minut. E-post är frivilligt.' },
        { t: 'Du ser ett riktpris', d: 'Förfrågan binder ännu ingendera parten.' },
        { t: 'Vi ringer och går igenom uppgifterna', d: 'Registernummer, nyckelöverlämning, fullmakt, bilens skick och bokningsvillkoren.' },
        { t: 'DriveMe bekräftar förare, tid och pris', d: 'Först bekräftelsen gör bokningen bindande.' },
        { t: 'Upphämtningen dokumenteras', d: 'Nycklar, skick, mätarställning och bränsle- eller laddningsnivå i tidsstämplade bilder. Du behöver inte åka med.' },
        { t: 'Du får statusuppdateringar', d: 'Varje överlämning meddelas.' },
        { t: 'Retur eller leverans kvitteras', d: 'Du eller din behöriga mottagare bekräftar mottagandet.' },
        { t: 'Du får kvitto eller faktura', d: 'Samt en kort begäran om omdöme.' },
      ],
    },
    { type: 'statusRail', title: 'Uppdragets status' },
    {
      type: 'list', title: 'Det här frågar prisförfrågan', variant: 'check', two: true,
      items: [
        'Tjänsten: bilflytt till en annan adress eller körning till en tjänst.',
        'Upphämtningsadress eller postnummer.',
        'Destinationsadress, eller leverantören och den bokade tiden.',
        'Önskad dag och tid.',
        'Namn och telefonnummer. E-post är frivilligt.',
        'Bekräftelse på att du får överlämna bilen till vår förare.',
      ],
    },
    {
      type: 'list', title: 'Det här kommer vi överens om före bekräftelsen', variant: 'plain', two: true,
      items: [
        'Fordonet: registernummer, märke, modell, växellåda och drivkraft.',
        'Skicket: körduglighet, försäkring, registrering, besiktning och kända fel.',
        'Överlämningen: ägarens eller innehavarens fullmakt, nyckelrutin och kontaktpersoner.',
        'Tidsbokningen: leverantör, tid, bokningsnummer och kontaktperson.',
        'Betalningen: DriveMes betalsätt och företagskundens faktureringsuppgifter.',
        'Villkoren: väntetid, avbokning och tredje parts avgifter.',
      ],
    },
    {
      type: 'callout', tone: 'info', title: 'En förfrågan är ingen bekräftelse',
      body: 'Att skicka formuläret skapar en prisförfrågan. Uppdraget är bekräftat först när du får vår bekräftelse på förare, tid och fast pris.',
    },
  ],
};

const splitSv = [
  ['Trygg körning och överlämning', 'Ansvarar', 'Ger korrekta uppgifter om bilen', 'Ansvarar inte'],
  ['Att tidsbokningen finns', 'Kontrollerar de uppgifter som lämnats', 'Bokar och bekräftar', 'Bekräftar tillgängligheten'],
  ['Reparation, besiktning och tvätt', 'Är inte leverantör', 'Väljer och godkänner', 'Ansvarar'],
  ['Betalning till tredje part', 'Lägger inte ut i förskott', 'Betalar direkt', 'Fakturerar och driver in'],
  ['Fordonets skick', 'Får neka efter kontroll', 'Garanterar och uppger', 'Får neka att ta emot'],
  ['DriveMes pris och tidtabell', 'Uppger och genomför', 'Betalar och är anträffbar vid överlämningen', 'Ansvarar inte'],
];

export const safety = {
  slug: 'sv/sakerhet',
  title: 'Så skyddar vi din bil och dina uppgifter | DriveMe',
  description: 'Dokumenterad upphämtning och överlämning, förarnas introduktion, försäkrings- och tillståndsläget samt hur undantag hanteras.',
  h1: 'Så skyddar vi *din bil och dina uppgifter*',
  lead: 'Vi berättar öppet vad som redan är på plats och vad som inväntar bekräftelse. Vi publicerar inga löften vi inte kan visa.',
  blocks: [
    {
      type: 'list', title: 'Vi dokumenterar varje uppdrag', variant: 'check',
      items: [
        'Tidsstämplade bilder på bilens alla sidor, däcken, vindrutan och synliga skador vid upphämtningen.',
        'Mätarställning, bränsle- eller laddningsnivå och varningslampor fotograferade när bilen står stilla.',
        'Anteckning om mottagna nycklar och handlingar.',
        'Tid, plats och mottagare för överlämningen, eller godkänt nyckelinkast.',
        'Samma bilder vid returen, så att skicket går att styrka i båda ändar.',
      ],
    },
    { type: 'screening', title: 'Förarna' },
    { type: 'gateList', title: 'Det här inväntar vi innan vi lovar mer' },
    { type: 'table', title: 'Ansvarsfördelning', head: ['Fråga', 'DriveMe', 'Kunden', 'Leverantören'], rows: splitSv },
    {
      type: 'list', title: 'Undantag', variant: 'plain',
      items: [
        'Leverantören har ingen bokning: vi kontaktar dig, väntar bara den tid som ingår och du löser saken direkt med leverantören.',
        'Leverantören föreslår tilläggsarbete: föraren godkänner ingenting utan hänvisar frågan till dig.',
        'Bilen är inte körduglig: vi kör inte, vi dokumenterar situationen och föreslår en bogseringspartner.',
        'Bilen beläggs med körförbud: vi kör inte, vi säkrar nycklarna och ber dig ordna laglig transport.',
        'Tredje parts tjänst blir försenad: du väljer senare retur, debiterbar väntetid eller en ny tid.',
        'Vi når inte dig: vår godkännandegräns är noll euro och vi godkänner inga arbeten hos tredje part.',
        'Skada eller olycka: säkerheten först, nödcentralen vid behov, anmälan till ledningscentralen, bilder och försäkringsprocessen utan att erkänna ansvar på plats.',
        'Nyckelöverlämningen misslyckas: en kontaktprocess på 15 minuter, därefter tillämpas avgiften för misslyckad överlämning enligt de bekräftade villkoren.',
      ],
    },
    { type: 'refusal', title: 'När vi inte tar emot bilen' },
    {
      type: 'list', title: 'Dina uppgifter', variant: 'plain',
      items: [
        'Vi samlar bara in det uppdraget kräver och sparar bilderna som bevis på tjänsten.',
        'Vi fotograferar inga onödiga identitetshandlingar och inte bilens innehåll utan orsak.',
        'Vi ber dig ta bort kontanter, värdesaker och onödiga personuppgifter ur bilen före upphämtningen.',
        'Spårningslänken är personlig och gäller bara under uppdraget.',
      ],
    },
  ],
};

export const faqPage = {
  slug: 'sv/vanliga-fragor',
  title: 'Vanliga frågor om DriveMe',
  description: 'Svar på de vanligaste frågorna: tidsbokningar, betalningar, dokumentation, bilens skick och avbokningar.',
  h1: 'Vanliga frågor *om DriveMe*',
  lead: 'Hittar du inte svaret? Ring eller skriv, så hjälper vi dig.',
  items: [
    { q: 'Behöver jag en bokad tid?', a: 'Ja för besiktning, service, glas- och plåtverkstad samt återkallelser. För tvätt och däckbyte bara om leverantören inte tar emot utan bokning; kötid kan leda till väntedebitering.' },
    { q: 'Vem betalar leverantören?', a: 'Kunden betalar direkt. DriveMe-arvodet täcker endast den bekräftade DriveMe-tjänsten.' },
    { q: 'Får föraren godkänna reparationer?', a: 'Nej. Leverantören måste kontakta kunden för alla godkännanden.' },
    { q: 'Vad händer om bilen inte går att köra?', a: 'DriveMe nekar eller avbryter uppdraget, och kunden ordnar bogsering eller annan laglig transport.' },
    { q: 'Hur dokumenteras bilens skick?', a: 'Med tidsstämplade bilder vid upphämtning och leverans samt mätarställning och bränsle- eller laddningsnivå.' },
    { q: 'Kan ni ta emot vilken bil som helst?', a: 'Endast en lagligt körduglig och försäkrad bil som passar den utsedda föraren och uppgifterna i bokningen.' },
    { q: 'Kan någon annan lämna över nycklarna?', a: 'Ja, när det är godkänt i bokningen och identiteten och överlämningssättet är bekräftade.' },
    { q: 'Ingår tredje parts avgift i priset?', a: 'Nej, om det inte uttryckligen står i offerten.' },
    { q: 'Är DriveMe en verkstad eller besiktningsstation?', a: 'Nej. DriveMe säljer transporten, ansvaret för bilen under körningen, den dokumenterade överlämningen och den överenskomna samordningen - inte reparation, besiktning, rådgivning eller betalningsförmedling.' },
    { q: 'Vilket område betjänar ni?', a: 'Helsingfors, Esbo, Vanda och Grankulla. Längre flyttar prissätter vi från fall till fall.' },
    { q: 'När är bokningen bindande?', a: 'När vi har bekräftat förare, tid och fast pris. Att skicka formuläret skapar bara en förfrågan.' },
    { q: 'Kan jag åka med i bilen?', a: 'Ja. I tjänsten "Förare för din resa" kör föraren dig och ditt sällskap i din egen bil, till exempel till flygplatsen eller på en längre resa. Vid en bilflytt åker däremot ingen med.' },
    { q: 'Hur fungerar avbokning?', a: 'Avgiftsfritt minst 24 timmar före upphämtningen. Under 24 timmar: 50 % av DriveMe-arvodet. Efter att föraren åkt debiterar vi grundavgiften och den tid som gått åt enligt villkoren.' },
  ],
};

export const terms = {
  slug: 'sv/villkor',
  title: 'Servicevillkor och ansvarsfördelning | DriveMe',
  description: 'DriveMes servicevillkor: ansvarsfördelning, fordonets skick, bokningens bekräftelser, avbokningsvillkor och kontaktuppgifter.',
  h1: 'Servicevillkor och ansvarsfördelning',
  lead: 'De här villkoren beskriver vad DriveMe ansvarar för och vad kunden och leverantören ansvarar för.',
  reviewNotice: 'Den här sidan är en implementeringsversion som inväntar granskning av en finländsk jurist gällande informationsskyldigheten vid distansförsäljning, ångerrätten, ansvaret och reklamationsrutinerna. Villkoren kan inte upphäva tvingande konsumenträttigheter.',
  blocks: [
    { type: 'disclaimer', title: 'Tjänstens innehåll och ansvarsfördelning' },
    { type: 'ackList', title: 'Det här bekräftas i samband med bokningen' },
    { type: 'eligibility', title: 'Fordonets skick' },
    { type: 'refusal', title: 'Rätt att neka ett uppdrag' },
    { type: 'cancellation', title: 'Avbokningsvillkor', id: 'avbokning' },
    {
      type: 'list', title: 'Vad vi inte gör', variant: 'cross',
      items: [
        'Bogsering eller vägservice - vi hänvisar till en bogseringspartner.',
        'Felsökning, reparationsrådgivning eller garantibeslut.',
        'Att boka eller godkänna reparationer för kundens räkning.',
        'Transport av barn utan medföljande vuxen.',
        'Vårdande eller assisterande transport.',
        'Flytt av avställda, körförbjudna eller trafikfarliga bilar.',
        'Internationella flyttar utan separat offert.',
        'Förvaring av bilen.',
        'Köp, värdering eller förhandling om bilaffärer.',
        'Att lägga ut för tredje parts kostnader utan förskottsbetalning.',
      ],
    },
    {
      type: 'prose', title: 'Reklamationer', id: 'reklamationer',
      body: [
        'Kontakta oss per e-post eller telefon så snart du upptäcker en brist i vår tjänst. Vi behandlar reklamationen och svarar skriftligt.',
        'Reklamationer som gäller tredje parts arbete riktas till den leverantören, eftersom arbetet bygger på avtalet mellan kunden och leverantören.',
        'En konsument har rätt att föra tvisten till konsumenttvistenämnden. Konsumentrådgivningen ger avgiftsfri rådgivning.',
      ],
    },
    {
      type: 'prose', title: 'Dataskydd', id: 'dataskydd',
      body: [
        'Vi behandlar personuppgifter för att genomföra tjänsten: kontaktuppgifter, adresser, fordonsuppgifter, bilder på överlämning och skick samt uppdragets status.',
        'Bilder och överlämningsanteckningar sparas som bevis på tjänsten och för att utreda eventuella skadefall.',
        'Spårningslänken fungerar utan inloggning och gäller bara under uppdraget.',
        'Vi säljer inte personuppgifter och använder dem inte till annat än att genomföra tjänsten, styrka den och uppfylla lagstadgade skyldigheter.',
      ],
    },
    { type: 'company', title: 'Tjänsteleverantör' },
  ],
};

export const contact = {
  slug: 'sv/kontakt',
  title: 'Kontakt | DriveMe',
  description: 'Kontakta DriveMe: telefon, e-post och serviceområde i huvudstadsregionen. Begär pris för en bilflytt.',
  h1: 'Kontakt',
  lead: 'En kontaktperson sköter uppdraget från början till slut. När något kräver omdöme når du en riktig människa.',
  hoursTitle: 'Förfrågningar och kontakt',
  hours: [
    'Du kan skicka en prisförfrågan med formuläret när som helst.',
    'Vi ringer upp och bekräftar tid och pris före körningen.',
    'Tillägg för natt, veckoslut och helgdagar finns i prislistan.',
  ],
  areaTitle: 'Serviceområde',
  areaNote: 'Längre flyttar prissätter vi från fall till fall.',
};

export const booking = {
  slug: 'sv/offert',
  title: 'Begär pris för en bilflytt | DriveMe',
  description: 'Skicka en prisförfrågan på under en minut: var bilen hämtas, vart den ska och när. Vi ringer och bekräftar ett fast pris.',
  h1: 'Begär pris *för en bilflytt*',
  lead: 'Berätta var bilen hämtas, vart den ska och när. Att skicka tar under en minut. Vi ringer, bekräftar ett fast pris, och först då är uppdraget bindande.',
};

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
  title: 'Bilflyttar för företag och privatpersoner | DriveMe',
  description: 'DriveMe flyttar bilar mellan verksamhetsställen, levererar sålda bilar till kunder och hämtar inköpta bilar. Begär offert på din rutt.',
  eyebrow: 'Fordonsflyttar för företag och privatkunder',
  h1: 'Bilflyttar för bilbranschens företag.',
  h1Accent: 'Bilflyttar',
  h1Rest: 'för bilbranschens företag.',
  lead: 'DriveMe flyttar kördugliga bilar mellan verksamhetsställen, levererar sålda bilar till kunderna och hämtar inköpta bilar hos säljarna. Vi sköter också avtalade serviceflyttar. Berätta rutt och tidtabell - vi bekräftar förarens tillgänglighet och ett fast pris före körningen.',
  primary: { label: 'Begär offert på flytt', href: '/sv/begar-offert/?kalla=home_hero' },
  secondary: { label: 'Diskutera företagsflyttar', href: '/sv/for-foretag/' },
  trustLine: 'Huvudstadsregionen och Nyland. Längre flyttar i Finland avtalas rutt för rutt.',

  offerTitle: 'Fyra sätt att *flytta era bilar*',
  paths: [
    {
      key: 'branchTransfer',
      label: 'Flytt mellan verksamhetsställen',
      body: 'Vi flyttar kördugliga fordon mellan era verksamhetsställen enligt överenskommen tidtabell: säljlager, provkörningsbilar samt hyr- och företagsbilar.',
      priceService: 'branchTransfer',
      href: '/sv/begar-offert/?tjanst=branchTransfer&kalla=home_branch',
      cta: 'Begär offert på flytt mellan ställen',
      linkLabel: 'Flytt mellan verksamhetsställen',
      linkHref: '/sv/bilflytt-mellan-verksamhetsstallen/',
    },
    {
      key: 'homeDelivery',
      label: 'Hemleverans',
      body: 'Vi levererar den sålda bilen från er affär till kundens överenskomna adress. Upphämtning, leveranstid och överlämning avtalas på förhand.',
      priceService: 'homeDelivery',
      href: '/sv/begar-offert/?tjanst=homeDelivery&kalla=home_delivery',
      cta: 'Begär offert på hemleverans',
      linkLabel: 'Hemleverans till kunden',
      linkHref: '/sv/hemleverans/',
    },
    {
      key: 'purchasedCarPickup',
      label: 'Hämtning av inköpt bil',
      body: 'När er affär köper en bil av en privat säljare, en annan affär eller på auktion sköter vi hämtningen och flytten till den adress ni anger.',
      priceService: 'purchasedCarPickup',
      href: '/sv/begar-offert/?tjanst=purchasedCarPickup&kalla=home_purchase',
      cta: 'Begär offert på hämtning',
      linkLabel: 'Hämtning av inköpt bil',
      linkHref: '/sv/hamtning-av-inkopt-bil/',
    },
    {
      key: 'workshopTransfer',
      label: 'Serviceflytt',
      body: 'Vi hämtar bilen på överenskommen adress, kör den till det serviceställe ni väljer och returnerar den enligt överenskommelse. Arbetet avtalas direkt med leverantören.',
      priceService: 'workshopTransfer',
      href: '/sv/begar-offert/?tjanst=workshopTransfer&kalla=home_workshop',
      cta: 'Begär offert på serviceflytt',
      linkLabel: 'Serviceflytt',
      linkHref: '/sv/serviceflytt/',
    },
  ],

  trust: {
    title: 'Vem kör *din bil*',
    lead: 'DriveMe är en tjänst från Mansio Group Oy. Varje flytt lämnar en dokumenterad spårbarhet, och en riktig människa svarar när du hör av dig.',
    providerTitle: 'Tjänsteleverantör',
    areaTitle: 'Serviceområde',
    contactTitle: 'Kontakt',
    contactBody: 'Vi svarar på offertförfrågningar inom 24 timmar. Är det brådskande, ring oss.',
  },

  quick: {
    title: 'Begär *offert på flytt*',
    lead: 'Välj tjänst och lämna dina kontaktuppgifter. Vi hör av oss inom 24 timmar.',
    service: 'Vilken flytt gäller det?',
    moveOption: 'Flytt av bil till en annan adress',
    submit: 'Begär offert',
    note: 'En offertförfrågan bekräftar inte flytten. Vi bekräftar pris, tidtabell och förare separat.',
  },

  mosaic: {
    title: 'DriveMes *flyttjänster*',
    intro: 'En partner för bilbranschens logistik: flyttar mellan verksamhetsställen, hemleveranser, hämtning av inköpta bilar och serviceflyttar. Också enskilda flyttar för privatkunder.',
    quote: 'Begär offert',
    blurbs: {
      branchTransfer: 'Fordon från ett verksamhetsställe till ett annat enligt tidtabell.',
      homeDelivery: 'Den sålda bilen till kundens dörr, med dokumenterad överlämning.',
      purchasedCarPickup: 'Den inköpta bilen från säljaren till er, med skicket registrerat.',
      workshopTransfer: 'Till verkstad, besiktning eller tvätt och tillbaka igen.',
      relocation: 'Bilen flyttad till en annan adress i Finland, även längre rutter.',
      business: 'Återkommande flyttar med avtalad faktureringspraxis.',
    },
  },

  benefitsTitle: 'Vad *offerten omfattar*',
  benefits: [
    { t: 'Avtalat pris före körningen', d: 'Du får en fast offert på rutten och tidtabellen innan föraren åker. Priset ändras inte mitt i uppdraget.' },
    { t: 'Dokumenterad upphämtning och överlämning', d: 'Vi registrerar synligt skick, mätarställning och nycklar vid upphämtningen, och överlämningen kvitteras av den namngivna mottagaren.' },
    { t: 'En kontaktperson', d: 'Samma person sköter offerten, tidtabellen och eventuella avvikelser. Ingen växlande jourdisk.' },
  ],

  howTitle: 'Så *går flytten till*',
  priceTitle: 'Prissatt *enligt rutten*',
  priceLead: 'Företagsflyttar prissätts enligt rutt, tidtabell och volym, och du får en fast offert före körningen. Serviceflyttar och enskilda flyttar följer den publicerade prislistan.',
  priceKeys: ['relocation', 'workshopTransfer'],
  handoverTitle: 'Ni lämnar nycklarna, *vi sköter körningen*',
  handoverBody: 'Er personal stannar på jobbet. Föraren hämtar bilen på den överenskomna platsen, kör den dit den ska och registrerar varje överlämning.',
  handoverPoints: [
    'Upphämtning hos er, hos kunden eller hos säljaren',
    'Skick, mätarställning och bränsle- eller laddningsnivå registreras vid upphämtningen',
    'Föraren godkänner inga tilläggsarbeten för er räkning',
    'I en flyttkörning transporteras inga passagerare',
  ],
  businessTitle: 'För bilhandel, leasing- och *fordonsbolag*',
  businessBody: 'DriveMe hjälper bilhandlare, leasing- och fordonsbolag samt biluthyrare att sköta fordonsflyttarna utan att den egna personalen behöver köra. Begär offert på en enskild flytt eller diskutera återkommande körningar och avtalad fakturering.',
  safetyTitle: 'Det här *dokumenterar vi*',
  safetyBody: 'Varje flytt lämnar bevis: tidsstämplade bilder vid upphämtning och överlämning, mätarställning och bränsle- eller laddningsnivå samt uppgift om vem som tog emot bilen och när. Vi berättar öppet vad försäkrings- och tillståndsläget täcker just nu.',
  otherTitle: 'Andra *behov*',
  otherLinks: [
    { label: 'Bilflytt för privatkunder', href: '/sv/bilflytt/' },
    { label: 'Personlig förare i kundens egen bil', href: '/sv/personlig-forare/' },
  ],
  ctaTitle: 'Begär *offert på flytt*',
  ctaBody: 'Berätta rutt, fordon och önskad tidtabell. Vi bekräftar förarens tillgänglighet och ett fast pris före körningen.',
};

export const servicesHub = {
  slug: 'sv/tjanster',
  title: 'Bilflyttar och serviceflyttar i Helsingfors | DriveMe',
  description: 'Alla DriveMes tjänster: bilen till besiktning, verkstad, däckbyte och tvätt, bilflytt mellan adresser, förare för din resa och flyttar av företagsbilar.',
  h1: 'Bilflyttar och *servicekörningar*',
  lead: 'En förare kör din bil dit den ska. Du behöver inte åka med, och leverantören väljer du alltid själv.',
  groups: [
    { title: 'Bilflyttar för bilbranschen', body: 'Flyttar mellan verksamhetsställen, hemleveranser av sålda bilar och hämtning av inköpta bilar. Varje flytt lämnar en dokumenterad överlämning.', keys: ['branchTransfer', 'homeDelivery', 'purchasedCarPickup'] },
    { title: 'Serviceflyttar och enskilda flyttar', body: 'Bilen till bokad service, besiktning, däckbyte eller tvätt och tillbaka - eller en flytt från en adress till en annan.', keys: ['workshopTransfer', 'relocation'] },
    { title: 'Andra tjänster', body: 'Återkommande flyttar med avtalad fakturering, och en förare i kundens egen bil när en passagerare följer med.', keys: ['business', 'personalDriver'] },
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
  title: 'DriveMes priser | Förartjänster i Helsingfors',
  description: `DriveMes priser: bilflytt från ${PRODUCTS.oneWay.from} €, service-, däck- eller tvättkörning från ${PRODUCTS.serviceRun.from} €, besiktningskörning från ${PRODUCTS.inspection.from} €. Leverantörens avgifter ingår inte.`,
  h1: 'DriveMes *priser*',
  lead: 'Priserna inkluderar moms och är från-priser. Begär offert, så får du ett fast pris inom 24 timmar. Resor där du själv åker med prissätts utifrån rutten.',
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
      body: 'Rutten, överlämningstiden och väntetiden påverkar den verkliga kostnaden, och ett formulär kan inte känna till dem åt dig. Därför publicerar vi från-priser på den här sidan och skickar ett fast pris i offerten. Vi debiterar aldrig mer än det bekräftade priset utan en separat överenskommen ändring.',
    },
  ],
};

export const howPage = {
  slug: 'sv/sa-fungerar-det',
  title: 'Så fungerar DriveMe | Från prisförfrågan till slutfört uppdrag',
  description: 'Från prisförfrågan till bekräftelse, från upphämtning till dokumenterad överlämning. Så flyttar DriveMe din bil utan att du behöver åka med.',
  h1: 'Så *fungerar DriveMe*',
  lead: 'En offertförfrågan tar under en minut, och varje offert skrivs av en människa. Därför har varje bekräftat uppdrag en riktig förare, en riktig tid och ett riktigt pris.',
  blocks: [
    {
      type: 'steps', title: 'Kundens väg', rows: true, two: true,
      items: [
        { t: 'Välj den tjänst du behöver', d: 'Flytt mellan verksamhetsställen, hemleverans, hämtning av inköpt bil, serviceflytt, en enskild flytt, personlig förare - eller en annan tjänst.' },
        { t: 'Lämna namn, telefon och e-post', d: 'Att skicka offertförfrågan tar under en minut. Övrigt berättar du i fritextfältet.' },
        { t: 'Du får en bekräftelse per e-post', d: 'Vi bekräftar att förfrågan har kommit fram. Den bekräftar ännu ingen bokning.' },
        { t: 'Vi hör av oss inom 24 timmar', d: 'Upphämtnings- och leveransadresser, bilens uppgifter, nyckelöverlämning, fullmakt och bokningsvillkoren.' },
        { t: 'DriveMe bekräftar förare, tid och pris', d: 'Först bekräftelsen gör bokningen bindande.' },
        { t: 'Upphämtningen dokumenteras', d: 'Nycklar, skick, mätarställning och bränsle- eller laddningsnivå i tidsstämplade bilder. Du behöver inte åka med.' },
        { t: 'Du får statusuppdateringar', d: 'Varje överlämning meddelas.' },
        { t: 'Retur eller leverans kvitteras', d: 'Du eller din behöriga mottagare bekräftar mottagandet.' },
        { t: 'Du får kvitto eller faktura', d: 'Samt en kort begäran om omdöme.' },
      ],
    },
    { type: 'statusRail', title: 'Uppdragets status' },
    {
      type: 'list', title: 'Det här frågar offertförfrågan', variant: 'check', two: true,
      items: [
        'Namn.',
        'Telefonnummer.',
        'E-post, dit vi skickar bekräftelsen och offerten.',
        'Vilken tjänst du behöver.',
        'Företagets namn, om du begär offert för ett företag. Frivilligt.',
        'Mer information: rutt, önskad tidpunkt och övriga önskemål. Frivilligt.',
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
      type: 'callout', tone: 'info', title: 'En offertförfrågan är ingen bekräftelse',
      body: 'Att skicka formuläret skapar en offertförfrågan. Uppdraget är bekräftat först när du godkänner offerten och får vår bekräftelse på förare, tid och fast pris.',
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
        'Flyttar utanför Finlands gränser.',
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
  slug: 'sv/begar-offert',
  title: 'Begär offert på en bilflytt | DriveMe',
  description: 'Skicka en offertförfrågan på under en minut: namn, telefon, e-post och den tjänst du behöver. Vi hör av oss inom 24 timmar.',
  h1: 'Begär offert *på en bilflytt*',
  lead: 'Lämna dina kontaktuppgifter och berätta vilken tjänst du behöver. Vi hör av oss inom 24 timmar, kommer överens om detaljerna och skickar ett fast pris. En offertförfrågan bekräftar ännu ingen bokning.',
};

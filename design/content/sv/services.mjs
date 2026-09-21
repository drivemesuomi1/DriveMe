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

export const inspection = {
  slug: 'bil-till-besiktning',
  nav: 'Bilen till besiktning',
  short: 'Besiktning',
  title: 'Bilen till besiktning | Upphämtning och retur | DriveMe',
  description: 'DriveMe hämtar din bil, kör den till den besiktning du bokat och returnerar den enligt överenskommelse. Besiktningsavgiften betalas direkt till stationen.',
  h1: 'Bilen till besiktning utan att du förlorar din dag',
  lead: 'Har du redan bokat besiktningstid? Vi hämtar din körklara bil, kör den till stationen och returnerar den med besiktningshandlingarna.',
  keywords: ['bilen till besiktning', 'besiktning upphämtning', 'köra bilen till besiktning'],
  steps: [
    'Du bokar besiktningstiden hos den station du väljer och skickar oss station, tid och bokningsnummer.',
    'Upphämtning inom det överenskomna tidsfönstret: vi dokumenterar skick, mätarställning och bränsle- eller laddningsnivå.',
    'Föraren lämnar bilen på stationen och kvitterar överlämningen.',
    'Vi returnerar bilen till den överenskomna adressen med besiktningshandlingarna och kvitterar att uppdraget är slutfört.',
  ],
  included: [
    'Överenskommet tidsfönster för upphämtning',
    'Bilder på skicket, mätarställningen och bränsle- eller laddningsnivån vid upphämtningen',
    'Körning till den besiktningsstation kunden bekräftat',
    'Överlämning, skälig väntetid enligt vald produkt, retur och slutkvittering',
  ],
  customer: [
    'Boka och bekräfta besiktningstiden innan föraren åker',
    'Uppge station, tid och bokningsnummer till DriveMe',
    'Betala besiktningsstationen direkt',
    'Se till att bilen är laglig, registrerad, försäkrad, körduglig och tillräckligt tankad eller laddad',
  ],
  excluded: [
    'Besiktningsavgift, utsläppsmätning eller efterkontroll',
    'Reparationer, felsökning eller rådgivning',
    'Garanti för att bilen godkänns',
    'Körning av ett fordon som belagts med körförbud',
  ],
  boundary: 'Kunden bokar och betalar besiktningen direkt till stationen. DriveMe ansvarar för den överenskomna upphämtningen, körningen, leveransen och överlämningen, inte för besiktningens innehåll eller resultat.',
  faq: [
    { q: 'Får någon annan köra min bil till besiktningen?', a: 'Ja. Vem som helst med körrätt och nycklarna får lämna in bilen, och du behöver inte vara på plats. Besiktningsavgiften betalas på stationen och handlingarna följer med bilen tillbaka.' },
    { q: 'Vad händer om bilen inte godkänns?', a: 'Om bilen fortfarande får köras lagligt returnerar vi den enligt dina anvisningar eller kör den till en överenskommen verkstad. Om bilen beläggs med körförbud avbryter vi uppdraget och kommer överens med dig om bogsering eller annan laglig transport.' },
    { q: 'Måste besiktningstiden vara bokad i förväg?', a: 'Ja. Vi skickar ingen förare utan bekräftad tid, eftersom vi annars varken kan lova att bilen tas emot eller när den är tillbaka.' },
    { q: 'Vem betalar besiktningen?', a: 'Du betalar stationen direkt. DriveMe-arvodet täcker endast upphämtning, körning, överlämning och retur.' },
    { q: 'Vad ska finnas i bilen?', a: 'Tillräckligt med bränsle eller laddning, rätt säsongsdäck och eventuell låsbultsnyckel. Ta ut värdesaker före upphämtningen.' },
  ],
};

export const workshop = {
  slug: 'bil-till-verkstad',
  nav: 'Bilen till verkstad',
  short: 'Service',
  title: 'Bilen till service och verkstad | Upphämtning och retur | DriveMe',
  description: 'Behåll din servicetid utan att förlora en arbetsdag. DriveMe kör bilen till den verkstad du valt och returnerar den enligt överenskommelse.',
  h1: 'Upphämtning till verkstaden och retur utan att din dag går åt',
  lead: 'Behåll din tid och din dag. DriveMe sköter överlämningarna av bilen medan du gör upp direkt med den verkstad du valt.',
  keywords: ['bilen till verkstad', 'servicetid upphämtning', 'hämta bilen till service'],
  steps: [
    'Du bokar servicetiden och kommer överens om arbetet med verkstaden.',
    'Vi hämtar bilen hemma eller på jobbet och dokumenterar skicket.',
    'Vi lämnar bilen på den angivna verkstaden och antecknar vem som tog emot den eller att nycklarna lämnades i nyckelinkast.',
    'När verkstaden meddelar att bilen är klar hämtar vi den och returnerar den till den överenskomna adressen.',
  ],
  included: [
    'Upphämtning hemma eller på arbetsplatsen',
    'Leverans till den angivna verkstaden',
    'Anteckning om mottagaren eller nyckelinkastet',
    'Upphämtning efter att verkstaden bekräftat att bilen är klar',
    'Retur till den överenskomna adressen',
  ],
  customer: [
    'Boka servicetiden och kom överens om arbetsordern',
    'Uppge bokningsnummer och verkstadens kontaktuppgifter',
    'Godkänn alla reparationer, ändringar och kostnader direkt med verkstaden',
    'Betala verkstaden direkt',
  ],
  excluded: [
    'Reparation eller felsökning av bilen',
    'Att välja verkstad, om inte annat avtalats',
    'Godkännande av tilläggsarbeten',
    'Garanti för verkstadens tidtabell eller arbetskvalitet',
  ],
  boundary: 'Kunden bokar tiden, godkänner arbetet och betalar verkstaden direkt. DriveMe ansvarar för den överenskomna upphämtningen, körningen, leveransen och överlämningen.',
  faq: [
    { q: 'Får föraren godkänna tilläggsarbeten?', a: 'Nej. Föraren uppger att bilen lämnas in för kundens räkning och har ingen rätt att godkänna arbete. Verkstaden kontaktar dig direkt för varje godkännande.' },
    { q: 'Kan jag beställa bara ena riktningen?', a: 'Ja. Du kan välja enbart inlämning, enbart upphämtning, retur samma dag eller retur en senare dag.' },
    { q: 'Vad händer om servicen tar längre tid än väntat?', a: 'Du bestämmer: vi flyttar returen, väntar enligt den debiterbara väntetiden eller bokar om. Verkstadens tid debiteras inte när föraren har åkt.' },
    { q: 'Hur lämnas nycklarna om verkstaden är stängd?', a: 'Vi använder verkstadens godkända nyckelinkast eller en namngiven mottagare, och antecknar alltid tid, plats och sätt.' },
  ],
};

export const tyre = {
  slug: 'bil-till-dackbyte',
  nav: 'Bilen till däckbyte',
  short: 'Däckbyte',
  title: 'Bilen till däckbyte eller däckhotell | DriveMe',
  description: 'Upphämtning till däckbyte, däckhotell eller hjulinställning och retur enligt överenskommelse. Däckfirmans avgifter betalas separat.',
  h1: 'Bilen till däckbyte utan att du står i kö',
  lead: 'Vi kör din bil till däckbytet, däckhotellet eller hjulinställningen och returnerar den redo för säsongen.',
  keywords: ['bilen till däckbyte', 'däckbyte upphämtning', 'däckhotell upphämtning'],
  steps: [
    'Du säkerställer tiden hos däckfirman, eller att firman tar emot bilen utan bokning.',
    'Du berättar var däcken finns: hos firman, i bilen eller på en annan adress.',
    'Vi hämtar bilen, dokumenterar skicket och kör den till däckfirman.',
    'Vi returnerar bilen till den överenskomna adressen när firman släpper den.',
  ],
  included: [
    'Upphämtning och retur',
    'Leverans till den angivna däckfirman',
    'Status för överlämningen och slutkvittering',
    'Skälig väntetid endast när den ingår i vald produkt',
  ],
  customer: [
    'Säkerställ att leverantören tar emot bilen vid önskad tidpunkt',
    'Berätta om däcken finns hos firman, i bilen eller på en annan upphämtningsadress',
    'Betala däckfirman direkt',
    'Uppge var låsbultsnyckeln finns',
  ],
  excluded: [
    'Däck, montering, förvaring eller hjulinställning',
    'Transport av lösa däck, om inte annat avtalats',
    'Bedömning av däckens säkerhet',
    'Kötid utöver den väntetid som ingår',
  ],
  boundary: 'Kunden väljer däckfirman och betalar den direkt. DriveMe ansvarar för upphämtningen, körningen, överlämningen och returen.',
  faq: [
    { q: 'Går det att köra bilen till däckbyte utan bokad tid?', a: 'Bara om firman du valt tar emot utan bokning och du godkänner en möjlig väntedebitering. Under högsäsong kräver vi bokad tid, eftersom köerna gör det omöjligt att lova en returtid.' },
    { q: 'Transporterar ni lösa däck?', a: 'Endast enligt särskild överenskommelse. Berätta i förfrågan om däcken finns i bilen, hos firman eller på en annan adress, så kommer vi överens om rätt sätt.' },
    { q: 'Bedömer ni däckens skick?', a: 'Nej. Vi är ingen däckfirma och bedömer inte däcksäkerhet - det hör till den leverantör du väljer.' },
    { q: 'Vem betalar däckarbetet?', a: 'Du betalar däckfirman direkt. DriveMe-arvodet täcker endast körningarna.' },
  ],
};

export const wash = {
  slug: 'bil-till-biltvatt',
  nav: 'Bilen till biltvätt',
  short: 'Tvätt och detaljrengöring',
  title: 'Bilen till biltvätt eller detaljrengöring | DriveMe',
  description: 'DriveMe kör din bil till den biltvätt eller detaljrengöring du valt och returnerar den. Tydligt DriveMe-pris i förväg.',
  h1: 'Bilen till tvätt eller detaljrengöring mitt i arbetsdagen',
  lead: 'Din bil kommer till sin bokade tid utan att ta över din kalender.',
  keywords: ['bilen till biltvätt', 'biltvätt upphämtning', 'detaljrengöring upphämtning'],
  steps: [
    'Du väljer tvätt eller detaljrengöring och paket, och betalar leverantören.',
    'Vi hämtar bilen och dokumenterar skicket före överlämningen.',
    'Vi kör bilen till tvätten och antecknar överlämningen.',
    'Vi returnerar bilen när leverantören släpper den.',
  ],
  included: [
    'Upphämtning, dokumenterat skick och leverans',
    'Retur när leverantören släpper bilen',
    'Valfri tankning eller laddning, om det avtalats separat och betalats i förväg',
  ],
  customer: [
    'Välj en leverantör som tar emot bokningen eller en bil utan bokad tid',
    'Välj och betala tvätt- eller detaljrengöringspaketet',
    'Ta bort värdesaker och berätta om känsliga ytor eller ändringar',
  ],
  excluded: [
    'Priset för tvätten eller detaljrengöringen',
    'Kvalitetskontroll av leverantörens arbete',
    'Skada som enbart orsakats av tredje parts leverantör',
    'Väntetid utöver den som ingår i produkten',
  ],
  boundary: 'Kunden väljer tvätten och betalar leverantören direkt. DriveMe ansvarar för upphämtningen, körningen, överlämningen och returen, inte för tvättens resultat.',
  faq: [
    { q: 'Betalar föraren tvätten åt mig?', a: 'Nej. Föraren lägger inte ut för tredje parts kostnader. Betala i förväg, använd leverantörens betalningslänk eller kom överens om distansbetalning direkt med tvätten.' },
    { q: 'Ansvarar ni för tvättresultatet?', a: 'Vi kvalitetsgranskar inte leverantörens arbete. Vi dokumenterar bilens skick vid upphämtning och retur, så skicket vid båda tillfällena går att styrka.' },
    { q: 'Min bil har en beläggning eller folie - är det ett problem?', a: 'Berätta det i förfrågan och välj en leverantör som kan hantera ytan. Vi för informationen vidare men fattar inga beslut om ytbehandling åt dig.' },
  ],
};

export const glass = {
  slug: 'glas-plat-och-aterkallelse',
  nav: 'Glas, plåt och återkallelse',
  short: 'Reparation',
  title: 'Bilen till glas-, plåt- eller återkallelsearbete | DriveMe',
  description: 'Från vindrutetid till tillverkarens återkallelse: DriveMe sköter flytten och överlämningen av en körduglig bil till specialverkstaden.',
  h1: 'Bilen till glas-, plåt- eller återkallelsearbete',
  lead: 'Från en tid hos glasmästaren till tillverkarens återkallelse - DriveMe sköter flytten och överlämningen av en körduglig bil.',
  keywords: ['bilen till reparation', 'vindruta upphämtning', 'återkallelse bilflytt'],
  steps: [
    'Du bokar tiden hos glasfirman, plåtverkstaden eller märkesverkstaden och sköter kontakten med försäkringsbolaget själv.',
    'Du ger oss boknings- eller skadenummer och kontaktuppgifterna på plats.',
    'Vi hämtar bilen, dokumenterar skicket och lämnar den på destinationen.',
    'Vi returnerar bilen när leverantören släpper den.',
  ],
  included: [
    'Leverans och/eller upphämtning',
    'Överlämning med bokningsnummer',
    'Dokumentation av skicket',
    'Retur när leverantören släpper bilen',
  ],
  customer: [
    'Se till att tiden är bekräftad',
    'Sköt kontakten med försäkringsbolaget och reparatören själv',
    'Uppge skade- eller bokningsnummer',
    'Godkänn alla kostnader och arbeten',
  ],
  excluded: [
    'Hantering av försäkringsersättning',
    'Bedömning av skadan',
    'Bogsering av krockskadade eller trafikfarliga bilar',
    'Reparationsrådgivning eller garantibeslut',
  ],
  boundary: 'Kunden sköter kontakten med försäkringsbolaget och reparatören och godkänner arbetet. DriveMe ansvarar för flytten och överlämningen av en körduglig bil.',
  faq: [
    { q: 'Kan ni flytta en krockskadad bil?', a: 'Inte om den inte går att köra säkert. Vi tar inte emot en bil som är synligt trafikfarlig, läcker, är krockskadad eller visar en kritisk varning - då hänvisar vi till en bogseringspartner.' },
    { q: 'Sköter ni försäkringsärendet?', a: 'Nej. Ersättning, skadebedömning och reparationsbeslut är mellan dig och ditt försäkringsbolag. Vi sköter flytten och överlämningen.' },
    { q: 'Krävs en bekräftad tid?', a: 'Ja. För glas-, plåt- och återkallelsearbeten förutsätter vi en bekräftad tid.' },
  ],
};

export const pickupReturn = {
  slug: 'upphamtning-och-retur',
  nav: 'Upphämtning och retur',
  short: 'Upphämtning och retur',
  title: 'Upphämtning och retur av bilen | DriveMe',
  description: 'Upphämtning och retur av din bil till vilken leverantör eller adress som helst i huvudstadsregionen, med dokumenterade överlämningar och ett pris som bekräftas i förväg.',
  h1: 'Upphämtning och retur av bilen',
  lead: 'En pålitlig partner för bilens körningar: vi hämtar din körklara bil, kör den till den tjänst eller adress du väljer och returnerar den enligt överenskommelse.',
  keywords: ['upphämtning av bil', 'hämta och returnera bil', 'bilhämtning Helsingfors'],
  steps: [
    'Du väljer tjänsten och uppger upphämtningsadress, destination och tidpunkt.',
    'Vi bekräftar förare, tid och ett fast DriveMe-pris.',
    'Vi hämtar bilen med dokumentation och håller dig uppdaterad.',
    'Vi returnerar eller överlämnar bilen enligt överenskommelse och kvitterar uppdraget som slutfört.',
  ],
  included: [
    'Överenskommet tidsfönster för upphämtning hemma eller på jobbet',
    'Dokumentation av skick, mätarställning och bränsle- eller laddningsnivå',
    'Körning till den destination kunden väljer',
    'Anteckning om överlämningen och retur till den överenskomna adressen',
  ],
  customer: [
    'Boka den tid leverantören kräver',
    'Uppge destinationens uppgifter, kontaktperson och eventuellt bokningsnummer',
    'Säkerställ bilens skick och att nycklarna kan lämnas över',
    'Betala tredje parts tjänster direkt',
  ],
  excluded: [
    'Tredje parts arbete och avgifter',
    'Flytt av en bil med körförbud eller i trafikfarligt skick',
    'Bogsering eller transport på flak',
    'Förvaring av bilen',
  ],
  boundary: 'DriveMe ansvarar för upphämtningen, körningen, leveransen och överlämningen. Tjänsten hos tredje part är alltid ett avtal mellan kunden och leverantören.',
  faq: [
    { q: 'Vilka tjänster kan ni köra bilen till?', a: 'Besiktning, service, däckbyte, tvätt, glas- och plåtverkstad, märkesverkstadens återkallelse, bilhandel eller vilken överenskommen adress som helst i huvudstadsregionen. Du väljer leverantören själv.' },
    { q: 'Kan jag använda min egen verkstad?', a: 'Ja, och det är hela poängen. Vi är inte bundna till någon enskild verkstad, station eller kedja.' },
    { q: 'Hur bildas priset?', a: 'Av tjänsten, adresserna, tidpunkten och den väntetid som behövs. Du ser ett riktpris direkt och vi bekräftar ett fast pris före körningen. Tredje parts avgifter ingår inte.' },
    { q: 'Måste jag vara på plats vid upphämtningen?', a: 'Nej, om nyckelöverlämningen är överenskommen i bokningen och den som lämnar nycklarna är behörig. Vi antecknar alltid vem som lämnade nycklarna och när.' },
  ],
};

export const relocation = {
  slug: 'bilflytt',
  nav: 'Bilflytt',
  short: 'Bilflytt',
  title: 'Bilflytt | En förare kör din bil till en annan adress | DriveMe',
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
    'Internationella flyttar utan separat offert',
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

export const dealer = {
  slug: 'aterlamning-till-bilhandel',
  nav: 'Återlämning till bilhandel',
  short: 'Bilhandel och leasing',
  title: 'Återlämning till bilhandel, leasingbolag eller hyrfirma | DriveMe',
  description: 'DriveMe sköter den dokumenterade leveransen av en körduglig bil till bilhandeln, leasingbolaget eller hyrfirman.',
  h1: 'Upphämtning eller återlämning till bilhandel och leasingbolag',
  lead: 'DriveMe sköter den fysiska överlämningen; köpe-, leasing- eller hyresavtalet förblir mellan dig och leverantören.',
  keywords: ['återlämning till leasingbolag', 'hämta bil från bilhandel', 'återlämning av hyrbil'],
  steps: [
    'Du säkerställer att mottagaren godkänner att en behörig tredje part lämnar eller hämtar bilen.',
    'Du lämnar en begränsad skriftlig fullmakt och nödvändiga identitetsuppgifter.',
    'Vi hämtar bilen och dokumenterar skick och mätarställning.',
    'Vi överlämnar bilen till en namngiven person eller ett godkänt nyckelinkast och kvitterar överlämningen.',
  ],
  included: [
    'Upphämtning eller återlämning av bilen',
    'Dokumentation av skick och mätarställning',
    'Mottagning av nycklar och handlingar',
    'Överlämning till namngiven person eller godkänt nyckelinkast',
  ],
  customer: [
    'Säkerställ att leverantören tillåter att en behörig tredje part lämnar eller hämtar bilen',
    'Lämna den fullmakt och identifiering som krävs',
    'Betala leverantörens avgifter direkt',
    'Granska och godkänn avtalshandlingarna personligen',
  ],
  excluded: [
    'Att underteckna köpe-, finansierings-, leasingavslutnings- eller skadeavtal för kundens räkning',
    'Värdering av bilen',
    'Godkännande av oanmälda avgifter',
    'Garanti för att leverantören godkänner bilen',
  ],
  boundary: 'Föraren har fullmakt endast för den fysiska överlämningen. Föraren undertecknar inga ekonomiska åtaganden och erkänner inget ansvar för din räkning.',
  faq: [
    { q: 'Får föraren underteckna returprotokollet?', a: 'Föraren kan kvittera den fysiska överlämningen, men godkänner varken skadebedömningar, avgifter eller avtalsvillkor. Det hör till dig.' },
    { q: 'Vad händer om leasingbolaget påstår att bilen har nya skador?', a: 'Vi dokumenterar bilens skick vid upphämtning och överlämning med tidsstämplade bilder, så du har bevis på skicket vid överlämningen. Diskussionen om skadan förs mellan dig och bolaget.' },
    { q: 'Krävs en skriftlig fullmakt?', a: 'Ja. Vi använder en begränsad fullmakt som endast ger rätt till den fysiska överlämningen. Vi skickar en modell i samband med bokningsbekräftelsen.' },
  ],
};

export const journey = {
  slug: 'forare-for-din-resa',
  nav: 'Förare för din resa',
  short: 'Resor',
  title: 'Förare för din resa i din egen bil | Flygplats och långa resor | DriveMe',
  description: 'DriveMe ordnar en professionell förare som kör dig och ditt sällskap i din egen bil: till flygplatsen, till en annan stad eller på en längre resa.',
  h1: 'Förare för din resa i din egen bil',
  lead: 'Ska du till flygplatsen, besöka en annan stad eller planerar du en längre resa med familjen? DriveMe ordnar en professionell förare som kör dig och ditt sällskap i din egen bil - på en kort eller lång resa.',
  keywords: ['förare för resan', 'förare till flygplatsen egen bil', 'förare långresa Finland'],
  steps: [
    'Berätta rutt, tidpunkt, antal passagerare och om du också behöver en returresa.',
    'Vi bekräftar föraren och ett fast pris före resan.',
    'Föraren kommer på överenskommen tid och kör din egen bil.',
    'Resan slutar på den överenskomna adressen, och bilen och nycklarna stannar hos dig.',
  ],
  included: [
    'En professionell förare för hela resan',
    'Den överenskomna rutten, stoppen och tidtabellen',
    'Förarens identitet och en supportkontakt i förväg',
    'Ett fast pris som bekräftas före resan',
  ],
  customer: [
    'Ställ en laglig, försäkrad och körduglig bil till förfogande',
    'Se till att alla passagerare har bältesplats och barn har bilbarnstol',
    'Berätta hur mycket bagage ni har och om bilen har särskilda reglage',
    'Betala bränsle, laddning, vägavgifter och parkering om inte annat anges i offerten',
  ],
  excluded: [
    'Taxiliknande skjuts utan bokning i förväg',
    'Transport av barn utan medföljande vuxen',
    'Vårdande eller assisterande transport',
    'Körning av en trafikfarlig bil eller en bil med körförbud',
  ],
  boundary: 'DriveMe ansvarar för föraren och den överenskomna resan. Kunden ansvarar för bilens skick, försäkring och passagerarnas säkerhetsutrustning.',
  faq: [
    { q: 'Vems bil körs resan med?', a: 'Din egen. Föraren kommer till dig och kör din bil, så bagage och bilbarnstolar är redan på plats och ingen behöver byta fordon.' },
    { q: 'Hur långa resor kör ni?', a: 'Från en kort flygplatsresa till långa resor, till exempel till Åbo, Tammerfors eller Lappland. Priset bildas av rutten, resans längd och en eventuell returresa.' },
    { q: 'Kan flera personer åka med?', a: 'Ja, upp till bilens registrerade antal passagerare och bältesplatser. Ange antalet resenärer i förfrågan.' },
    { q: 'Hur prissätts returresan?', a: 'Ange i förfrågan om du behöver en retur. På en enkelresa specificeras förarens returresa i offerten, så du ser vad du betalar för.' },
    { q: 'När är priset bindande?', a: 'När vi har bekräftat förare, tidtabell och fast pris. Att skicka förfrågan binder ännu ingendera parten.' },
  ],
};

export const personalDriver = {
  slug: 'personlig-forare',
  nav: 'Personlig förare',
  short: 'Personlig förare',
  title: 'Personlig förare för din egen bil | DriveMe',
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

export const safeRideHome = {
  slug: 'trygg-hemresa',
  nav: 'Trygg hemresa',
  short: 'Hemresa',
  title: 'En förare för dig och din bil hem | DriveMe',
  description: 'En förare kör dig och din egen bil hem efter kvällen, så att bilen inte blir kvar i stan.',
  h1: 'En förare för dig och din bil hem',
  lead: 'Du och din bil kommer fram på samma resa - efter kvällen, evenemanget eller den långa arbetsdagen.',
  keywords: ['trygg hemresa', 'förare hem egen bil', 'hemkörning med egen bil'],
  steps: [
    'Du uppger upphämtningsadress, tidpunkt och destination.',
    'Vi bekräftar föraren och ett fast pris.',
    'Föraren kommer och kör dig och din bil hem.',
    'Bilen och nycklarna stannar hos dig hemma.',
  ],
  included: [
    'En förare på överenskommen tid',
    'Körning med din egen bil till den överenskomna adressen',
    'Dokumenterad föraridentitet och supportkontakt',
    'Överlämning av bil och nycklar vid framkomsten',
  ],
  customer: [
    'Var i skick att stiga in i bilen och åka med som passagerare på ett tryggt sätt',
    'Ställ en laglig, försäkrad och körduglig bil till förfogande',
    'Uppge särskilda reglage',
    'Betala parkering och vägavgifter om inte annat anges i offerten',
  ],
  excluded: [
    'Vårdande övervakning eller assistans',
    'Transport av barn utan medföljande vuxen',
    'Körning av en trafikfarlig bil',
    'Obegränsad väntan',
  ],
  boundary: 'DriveMe ansvarar för föraren och den överenskomna resan. Kunden ansvarar för bilens skick och försäkring.',
  faq: [
    { q: 'Varför är det här bättre än taxi?', a: 'Din bil kommer hem med dig. Du behöver inte hämta den på morgonen, och det blir inga parkeringsavgifter eller böter över natten.' },
    { q: 'Är tjänsten tillgänglig nu?', a: 'Ja. Berätta rutten och tidpunkten, så bekräftar vi föraren och ett fast pris före körningen.' },
    { q: 'Kan flera passagerare åka med?', a: 'Ja, upp till bilens registrerade antal passagerare och bältesplatser.' },
  ],
};

export const airport = {
  slug: 'forare-till-flygplatsen',
  nav: 'Förare till flygplatsen',
  short: 'Flygplats',
  title: 'Förare till flygplatsen med din egen bil | DriveMe',
  description: 'Res till eller från flygplatsen i din egen bil, med ditt eget bagage och dina egna bilbarnstolar.',
  h1: 'Förare till flygplatsen med kundens egen bil',
  lead: 'Res till eller från flygplatsen i din bekanta bil - bagaget och bilbarnstolarna är redan dina.',
  keywords: ['förare till flygplatsen', 'flygplatstransfer egen bil', 'Helsingfors-Vanda förare'],
  steps: [
    'Du uppger flyguppgifter, antal passagerare och bagage.',
    'Vi kommer överens om var bilen och nycklarna finns efter avfärden eller före återkomsten.',
    'Vi bekräftar förare, tidtabell och pris.',
    'Föraren kör dig till flygplatsen och sköter bilen enligt överenskommelsen.',
  ],
  included: [
    'Förbokad förare och överenskommen stödlogistik',
    'Flyg- och tidtabellsuppgifter',
    'Överlämning av kund och bil enligt valt alternativ',
    'De avlämningsavgifter på flygplatsen som nämns i offerten',
  ],
  customer: [
    'Ge exakta flyg- och bagageuppgifter',
    'Säkerställ att bilen är lämplig och laglig',
    'Kom överens om var bilen och nycklarna finns efter avfärden eller före återkomsten',
    'Skaffa och montera bilbarnstolar själv',
  ],
  excluded: [
    'Parkering på flygplatsen, om den inte offererats',
    'Flygplatsassistans eller bagagehantering',
    'Förvaring av bilen',
    'Traditionell flygplatstransfer med DriveMes egen bil, tills den produkten har tillstånd och är i bruk',
  ],
  boundary: 'DriveMe ansvarar för föraren, den överenskomna resan och för att bilen hanteras som avtalat. Kunden ansvarar för bilens skick och försäkring.',
  faq: [
    { q: 'Var står min bil medan jag flyger?', a: 'Det avtalas i bokningen. De vanligaste alternativen är att bilen returneras hem eller till en överenskommen adress, eller att den hämtas på din återkomstdag. Förvaring ingår inte i tjänsten.' },
    { q: 'Är tjänsten tillgänglig nu?', a: 'Ja. Berätta flyguppgifterna och antalet passagerare, så bekräftar vi föraren och ett fast pris.' },
    { q: 'Ingår avlämningsavgiften på flygplatsen i priset?', a: 'Den anges separat i offerten när den gäller din resa.' },
  ],
};

export const business = {
  slug: 'for-foretag',
  nav: 'För företag',
  short: 'För företag',
  title: 'Bilflyttar och fleet concierge för företag | DriveMe',
  description: 'Upphämtningar, serviceflyttar, överlämningar till anställda och andra flyttar av företagsbilar från en och samma pålitliga partner.',
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

/**
 * De fyra primära företagsflyttarna på svenska (utvecklingsbrief 8.10.2026).
 *
 * Samma innehåll som ../services-transfer.mjs, skrivet för svenskspråkiga
 * läsare i Finland - inte översatt mening för mening.
 */

export const branchTransfer = {
  slug: 'bilflytt-mellan-verksamhetsstallen',
  nav: 'Flytt mellan verksamhetsställen',
  short: 'Flytt mellan ställen',
  title: 'Bilflytt mellan verksamhetsställen | DriveMe',
  description: 'Bilflyttar mellan bilhandelns och företagens verksamhetsställen. Överenskommen tidtabell, dokumenterad överlämning och fast offert före körningen.',
  h1: 'Bilflyttar mellan era verksamhetsställen',
  lead: 'Vi flyttar kördugliga fordon mellan era verksamhetsställen enligt överenskommen tidtabell. Tjänsten passar för flytt av säljlager, arrangemang med provkörningsbilar och förflyttning av hyr- och företagsbilar. Er personal kan fortsätta med sitt eget arbete medan DriveMe sköter körningen.',
  keywords: ['bilflytt mellan verksamhetsställen', 'bilflytt för bilhandel', 'fordonsflytt företag'],
  steps: [
    'Ange avgångs- och leveransadress, fordonets uppgifter och önskat tidsfönster.',
    'Vi bekräftar priset och föraren före körningen.',
    'Vid upphämtningen registrerar vi bilens synliga skick, mätarställning och nycklar.',
    'På plats kvitteras överlämningen av den överenskomna mottagaren.',
  ],
  included: [
    'Överenskommet tidsfönster för upphämtning och leverans',
    'Skickbilder, mätarställning och bränsle- eller laddningsnivå vid upphämtning',
    'Ett fordon per flyttpost, också när flera beställs samtidigt',
    'Kvitterad överlämning till den namngivna mottagaren',
  ],
  customer: [
    'Namnge kontaktpersonerna för upphämtning och mottagning samt när de kan nås',
    'Se till att fordonet är kördugligt, registrerat och försäkrat',
    'Lämna nycklarna enligt överenskommelse eller dokumenterade anvisningar för nyckelskåp',
  ],
  excluded: [
    'Bogsering eller flytt av fordon med körförbud',
    'Reparationer, service eller teknisk bedömning av skicket',
    'Förvaring av fordonet mellan flyttarna',
  ],
  boundary: 'DriveMe ansvarar för den överenskomna flytten, för dokumentationen av upphämtning och överlämning samt för tidtabellen. Fordonets skick, registrering och försäkring ansvarar beställaren för.',
  faq: [
    { q: 'Kan upphämtningstiden vara flexibel?', a: 'Ja. Vi kommer överens om ett tidsfönster som passar era öppettider. Ju bredare fönstret är, desto bättre ryms flytten i förarnas rutter.' },
    { q: 'Kan vi beställa flera bilar samtidigt?', a: 'Ja. En förfrågan kan innehålla flera fordon, men varje fordon får en egen flyttpost, en egen förare och en egen överlämning.' },
    { q: 'Hur gör ni med nycklar utanför öppettiderna?', a: 'Nyckelskåp eller väktare fungerar, när anvisningarna står i offerten på förhand. Föraren improviserar inte nyckelhämtning på plats.' },
    { q: 'Vad händer om mottagaren inte är på plats?', a: 'Föraren kontaktar den person ni har angett. Om överlämningen inte kan göras som avtalat dokumenterar vi situationen och kommer överens om fortsättningen; väntan kan debiteras enligt prislistan.' },
  ],
};

export const homeDelivery = {
  slug: 'hemleverans',
  nav: 'Hemleverans till kunden',
  short: 'Hemleverans',
  title: 'Hemleverans av bil för bilhandeln | DriveMe',
  description: 'Leverera den sålda bilen till kundens adress. DriveMe sköter körningen och överlämningen. Begär offert på hemleverans.',
  h1: 'Hemleverans av bilen till din kund',
  lead: 'Vi levererar den sålda bilen från er affär till kundens överenskomna adress. Upphämtning, leveranstid och praxis för överlämningen avtalas på förhand. Tjänsten passar också kunder som köper bil från en annan ort.',
  keywords: ['hemleverans bil', 'leverera såld bil till kund', 'bilhandelns leveranstjänst'],
  steps: [
    'Berätta upphämtningsplats, köparens kontaktuppgifter och ett realistiskt leveransfönster.',
    'Vi bekräftar pris, förare och leveranstid före körningen.',
    'Föraren kontrollerar synligt skick vid upphämtningen och registrerar mätarställningen.',
    'Bilen och nycklarna överlämnas till den avtalade mottagaren, och beställaren får en bekräftelse.',
  ],
  included: [
    'Överenskommet leveransfönster och kontakt med köparen före ankomst',
    'Registrering av synligt skick och mätarställning vid upphämtning',
    'Överlämning av bil och nycklar till den namngivna mottagaren',
    'Bekräftelse på överlämningen till beställaren efteråt',
  ],
  customer: [
    'Ansvarar för köpehandlingar, registrering och uppgifterna om bilen',
    'Lämnar köparens kontaktuppgifter och avtalar ett realistiskt leveransfönster',
    'Berättar på förhand om överlämningen omfattar presentation eller hämtning av inbytesbil',
  ],
  excluded: [
    'Säljpresentation av bilen eller redogörelse för tekniskt skick',
    'Mottagande av köpesumma eller andra betalningar',
    'Hämtning av inbytesbil utan en separat avtalad andra flytt',
  ],
  boundary: 'DriveMe ansvarar för flytten och den dokumenterade överlämningen. För köpets villkor, handlingarna och det som utlovats om bilen ansvarar den säljande affären. Kvitteringen bekräftar mottagandet; den avstår inte från konsumentens rättigheter.',
  faq: [
    { q: 'Till vilket område levererar ni?', a: 'Huvudstadsregionen och Nyland hör till standardområdet. Längre leveranser i Finland avtalas rutt för rutt, när förarens returresa är klar.' },
    { q: 'Måste köparen vara på plats?', a: 'Ja, eller en mottagare som köparen har namngett. Överlämningen kvitteras av den person ni har uppgett.' },
    { q: 'Hur går det med handlingar och nycklar?', a: 'Föraren levererar de handlingar och nycklar som lämnats med, som de är. Vi fyller inte i och undertecknar inte köpehandlingar för affärens räkning.' },
    { q: 'Kan ni hämta en inbytesbil samtidigt?', a: 'Det kan vi, men det är en egen flytt: ett separat fordon, en egen skickkontroll och en egen rad i offerten.' },
  ],
};

export const purchasedCarPickup = {
  slug: 'hamtning-av-inkopt-bil',
  nav: 'Hämtning av inköpt bil',
  short: 'Inköpshämtning',
  title: 'Hämtning av inköpt bil från säljaren | DriveMe',
  description: 'Vi hämtar den kördugliga inköpta bilen hos säljaren och flyttar den till er affär. Berätta rutt och tidpunkt så kontrollerar vi tillgången.',
  h1: 'Hämtning av inköpt bil från säljaren till er affär',
  lead: 'När er affär köper en bil av en privat säljare, av en annan affär eller på auktion kan DriveMe sköta hämtningen och flytten. Vi kommer överens om överlämningen med säljaren och levererar den kördugliga bilen till den adress ni anger.',
  keywords: ['hämtning av inköpt bil', 'hämta bil från säljare', 'auktionsbil flytt'],
  steps: [
    'Berätta säljarens kontaktuppgifter, var bilen står och tidsfönstret för hämtningen.',
    'Före körningen säkerställer vi att bilen och nycklarna kan överlämnas och att hämtningen är godkänd av beställaren.',
    'Föraren dokumenterar synligt skick och mätarställning vid hämtningen.',
    'Bilen levereras till den adress ni angett och överlämningen kvitteras.',
  ],
  included: [
    'Kontakt med säljaren och överenskommelse om överlämningen',
    'Skickbilder och mätarställning vid hämtningen',
    'Flytten till er adress och kvitterad överlämning',
    'Besked till beställaren om något på plats hindrar hämtningen',
  ],
  customer: [
    'Bekräftar att hämtningen är godkänd och anger vem som får lämna ut bilen',
    'Lämnar säljarens telefonnummer, adress, öppettider och bilens plats',
    'Ansvarar för köpet, betalningarna och anmälan om ägarbyte',
  ],
  excluded: [
    'Teknisk eller mekanisk kontroll och värdering av bilen',
    'Köprekommendation eller bedömning av skicket som stöd för affären',
    'Betalning av köpesumman eller hantering av ägarbytet',
  ],
  boundary: 'DriveMe sköter flytten och registrerar det synliga skicket. Vi kontrollerar inte bilen tekniskt och tar inte ställning till köpets villkor. Om bilen inte är körduglig eller fullmakten saknas meddelar vi beställaren innan vi fortsätter.',
  faq: [
    { q: 'Kan ni hämta hos en privat säljare eller på auktion?', a: 'Ja. Vi behöver säljarens kontaktuppgifter, hämtplatsens öppettider och uppgift om vem som får lämna ut bilen.' },
    { q: 'Hur bekräftas rätten att lämna ut bilen?', a: 'Beställaren bekräftar hämtningen före körningen. Om säljaren inte känner igen hämtningen som avtalad tar föraren inte bilen utan kontaktar beställaren.' },
    { q: 'Vad händer om bilen inte är körduglig?', a: 'Vi kör inte en bil som är obrukbar eller belagd med körförbud. Vi dokumenterar iakttagelsen, meddelar beställaren och kommer överens om fortsättningen; bogsering ordnar beställaren.' },
    { q: 'Kontrollerar ni skicket inför köpbeslutet?', a: 'Nej. Vi dokumenterar synligt skick och mätarställning för flyttens skull. Teknisk kontroll och värdering är andra tjänster som vi inte erbjuder.' },
  ],
};

export const workshopTransfer = {
  slug: 'serviceflytt',
  nav: 'Serviceflytt',
  short: 'Serviceflytt',
  title: 'Serviceflytt – upphämtning och retur | DriveMe',
  description: 'Bilen körs till det serviceställe du väljer och returneras enligt överenskommelse. DriveMe sköter körningen; arbetet avtalas direkt med leverantören.',
  h1: 'Serviceflytt – upphämtning och retur',
  lead: 'DriveMe hämtar den kördugliga bilen på överenskommen adress, kör den till det serviceställe ni väljer och returnerar den enligt överenskommelse. Tjänsten passar företagens fordon, verkstädernas kunder och privata bilägare.',
  destinations: [
    { id: 'besiktning', label: 'Besiktning', body: 'Du bokar tiden; vi kör bilen till stationen och tillbaka med handlingarna.' },
    { id: 'verkstad', label: 'Service och verkstad', body: 'Till den bokade servicen eller verkstaden, och tillbaka när leverantören säger att bilen är klar.' },
    { id: 'dack', label: 'Däckbyte', body: 'Däckbyte eller däckhotell utan att någon hos er behöver köa.' },
    { id: 'tvatt', label: 'Tvätt och detaljrengöring', body: 'Till tvätt eller detaljrengöring mitt i arbetsdagen.' },
    { id: 'glas', label: 'Glas- och plåtverkstad', body: 'En körduglig bil till glasbyte, plåtverkstad eller tillverkarens återkallelse.' },
  ],
  keywords: ['serviceflytt', 'bilen till verkstad', 'bilen till besiktning', 'upphämtning och retur'],
  steps: [
    'Berätta serviceställe, bokad tid och varifrån bilen hämtas.',
    'Vi bekräftar priset och föraren före körningen.',
    'Upphämtning i det överenskomna fönstret: synligt skick, mätarställning och nycklar registreras.',
    'Överlämning till servicestället, och retur enligt överenskommelse eller medan föraren väntar.',
  ],
  included: [
    'Upphämtning på överenskommen adress och överlämning till servicestället',
    'Registrering av synligt skick, mätarställning och bränsle- eller laddningsnivå',
    'Retur till den överenskomna adressen och kvittering när uppdraget är klart',
    'Den väntetid som den valda produkten omfattar, när vänta-och-returnera valts',
  ],
  customer: [
    'Bokar och bekräftar service-, besiktnings- eller annan tid innan föraren åker',
    'Betalar leverantörens arbete direkt till leverantören',
    'Namnger en kontaktperson som bekräftar att bilen är klar att returneras',
  ],
  excluded: [
    'Själva service-, reparations-, besiktnings-, däck- eller tvättarbetet',
    'Godkännande av tilläggsarbeten för kundens räkning',
    'Förlängd väntetid utan debitering när leverantören blir försenad',
  ],
  boundary: 'DriveMe ansvarar för flytten, dokumentationen och den överenskomna tidtabellen. Bokningen, arbetets innehåll och betalningen för det sköter beställaren direkt med leverantören. Föraren godkänner inga tilläggsarbeten.',
  faq: [
    { q: 'Måste tiden vara bokad på förhand?', a: 'Ja. Beställaren bokar service-, besiktnings- eller annan tid och meddelar oss leverantör, tidpunkt och eventuellt bokningsnummer.' },
    { q: 'Vilka tjänster passar flytten för?', a: 'Flytten kan avtalas till service, besiktning, däckbyte, tvätt, glasreparation eller annan bokad biltjänst. DriveMe sköter körningen, arbetet utför den leverantör ni valt.' },
    { q: 'Vad händer om servicen blir försenad?', a: 'Returen körs som en separat körning när leverantören bekräftar att bilen är klar. Tid som bilen står hos leverantören utan förare är ingen förarväntan och debiteras inte som sådan.' },
    { q: 'Vad är skillnaden mellan väntan och senare retur?', a: 'Med vänta-och-returnera stannar föraren kvar den överenskomna väntetiden och tar bilen tillbaka direkt. Vid senare retur åker föraren och kommer tillbaka när bilen är klar; två körningar har sitt eget pris.' },
  ],
};

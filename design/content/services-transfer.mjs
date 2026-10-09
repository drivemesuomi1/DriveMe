/**
 * The four primary business transfers (developer implementation brief,
 * 8 October 2026).
 *
 * DriveMe's offer is organised by the buyer's vehicle-logistics task rather
 * than by the destination: a dealer moving stock between branches, delivering
 * a sold car, collecting a car it has bought, or sending one to a booked
 * service appointment. The five destination pages that used to exist
 * (inspection, workshop, tyres, wash, glass) are examples inside the service
 * transfer now, and their URLs redirect to it.
 *
 * The Finnish copy here is the brief's own wording. English and Swedish say
 * the same thing for their readers rather than translating it clause by
 * clause.
 *
 * Price: every one of these is quoted per route. The brief is explicit that
 * the published consumer prices are a reference for their own scope, not an
 * automatic tariff for dealer work - "Yrityssiirrot hinnoitellaan reitin,
 * aikataulun ja siirtomaaran mukaan." The service transfer keeps the
 * published prices, because that is exactly the scope they were set for.
 */

export const transferServices = [
  /* ------------------------------------------------------------------ */
  {
    key: 'branchTransfer',
    category: 'business',
    launch: 'priority',
    appointment: 'none',
    icon: 'relocation',
    price: { key: 'transfer' },
    related: ['homeDelivery', 'purchasedCarPickup', 'workshopTransfer'],
    devNote: 'One vehicle per transfer record. Several vehicles may be requested together but each gets its own job record, its own driver assignment and its own handover evidence. Key-box access only with documented instructions.',
    fi: {
      slug: 'toimipisteiden-valinen-siirto',
      nav: 'Toimipisteiden välinen siirto',
      short: 'Toimipistesiirto',
      title: 'Toimipisteiden väliset autonsiirrot | DriveMe',
      description: 'Autonsiirrot liikkeiden ja yritysten toimipisteiden välillä. Sovittu aikataulu, dokumentoitu luovutus ja kiinteä tarjous ennen ajoa.',
      h1: 'Toimipisteiden väliset autonsiirrot',
      lead: 'Siirrämme ajokuntoiset ajoneuvot liikkeenne toimipisteestä toiseen sovitun aikataulun mukaan. Palvelu sopii myyntivaraston siirtoihin, koeajoautojen järjestelyihin ja vuokra- tai yritysautojen siirtämiseen. Henkilökuntanne voi jatkaa omaa työtään, kun DriveMe hoitaa siirtoajon.',
      keywords: ['toimipisteiden välinen autonsiirto', 'autonsiirto autoliikkeelle', 'siirtoajo toimipisteiden välillä'],
      steps: [
        'Ilmoita lähtö- ja toimitusosoite, ajoneuvon tiedot sekä toivottu aikaikkuna.',
        'Vahvistamme hinnan ja kuljettajan ennen ajoa.',
        'Noudon yhteydessä kirjaamme auton näkyvän kunnon, mittarilukeman ja avaimet.',
        'Perillä luovutus kuitataan sovitulle vastaanottajalle.',
      ],
      included: [
        'Sovittu nouto- ja toimitusaikaikkuna',
        'Noudon kuntokuvat, mittarilukema ja polttoaine- tai lataustaso',
        'Yksi ajoneuvo per siirtotietue, myös silloin kun siirrot tilataan yhdessä',
        'Luovutuksen kuittaus sovitulle vastaanottajalle',
      ],
      customer: [
        'Nimeä nouto- ja vastaanottoyhteyshenkilöt sekä heidän tavoitettavuutensa',
        'Varmista, että ajoneuvo on ajokuntoinen, rekisterissä ja vakuutettu',
        'Toimita avaimet sovitusti tai dokumentoidut ohjeet avainlaatikon käyttöön',
      ],
      excluded: [
        'Hinaus tai ajokiellossa olevan ajoneuvon siirto',
        'Korjaukset, huollot tai kunnon tekninen arviointi',
        'Ajoneuvon säilytys siirtojen välillä',
      ],
      boundary: 'DriveMe vastaa sovitusta siirrosta, noudon ja luovutuksen dokumentoinnista sekä aikataulusta. Ajoneuvon kunnosta, rekisteröinnistä ja vakuutuksesta vastaa tilaaja.',
      faq: [
        { q: 'Voiko noutoaika olla joustava?', a: 'Kyllä. Sovimme aikaikkunan, joka sopii toimipisteenne aukioloaikoihin. Mitä väljempi ikkuna on, sitä paremmin siirto saadaan sovitettua kuljettajien reitteihin.' },
        { q: 'Voimmeko tilata useita autoja kerralla?', a: 'Voitte. Pyyntö voi sisältää useita ajoneuvoja, mutta jokaisesta syntyy oma siirtotietue, oma kuljettajanimeäminen ja oma luovutuskuittaus.' },
        { q: 'Entä jos avaimet luovutetaan aukioloaikojen ulkopuolella?', a: 'Avainlaatikon tai vartijan kautta tapahtuva luovutus onnistuu, kun ohjeet on kirjattu tarjoukseen etukäteen. Kuljettaja ei improvisoi avainten hakua paikan päällä.' },
        { q: 'Entä jos vastaanottaja ei ole paikalla?', a: 'Kuljettaja ottaa yhteyttä ilmoittamaanne yhteyshenkilöön. Jos luovutusta ei saada tehtyä sovitusti, kirjaamme tilanteen ja sovimme jatkosta erikseen; odotus voi tulla veloitettavaksi julkaistun hinnaston mukaan.' },
      ],
    },
    en: {
      slug: 'branch-to-branch-transfer',
      nav: 'Branch-to-branch transfer',
      short: 'Branch transfer',
      title: 'Branch-to-branch vehicle transfers | DriveMe',
      description: 'Vehicle transfers between dealer and company branches. An agreed schedule, a documented handover and a fixed quote before the drive.',
      h1: 'Branch-to-branch vehicle transfers',
      lead: 'We move roadworthy vehicles between your sites on an agreed schedule: stock moves, test-drive cars, rental and company vehicles. Your staff keep doing their own work while DriveMe does the driving.',
      keywords: ['branch to branch vehicle transfer', 'dealer vehicle transfer helsinki', 'fleet vehicle move'],
      steps: [
        'Tell us the collection and delivery addresses, the vehicle details and the time window you need.',
        'We confirm the price and the driver before anyone drives.',
        'At collection we record the visible condition, the odometer and the keys.',
        'At the destination the handover is signed off by the named receiver.',
      ],
      included: [
        'An agreed collection and delivery window',
        'Condition photos, odometer and fuel or charge level at collection',
        'One vehicle per transfer record, even when transfers are ordered together',
        'A signed handover to the named receiver',
      ],
      customer: [
        'Name the collection and receiving contacts, and when they can be reached',
        'Make sure the vehicle is roadworthy, registered and insured',
        'Hand over the keys as agreed, or give documented key-box instructions',
      ],
      excluded: [
        'Towing, or moving a vehicle banned from the road',
        'Repairs, servicing or any technical assessment of condition',
        'Storing the vehicle between transfers',
      ],
      boundary: 'DriveMe is responsible for the agreed transfer, for documenting collection and handover, and for the schedule. The vehicle’s condition, registration and insurance remain the customer’s responsibility.',
      faq: [
        { q: 'Can the collection time be flexible?', a: 'Yes. We agree a window that fits your opening hours. The wider the window, the better the transfer fits a driver’s route.' },
        { q: 'Can we order several cars at once?', a: 'Yes. One request can contain several vehicles, but each one becomes its own transfer record with its own driver and its own handover.' },
        { q: 'What about keys outside opening hours?', a: 'A key box or a security desk works, as long as the instructions are written into the quote beforehand. The driver does not improvise key collection on site.' },
        { q: 'What if the receiver is not there?', a: 'The driver contacts the person you named. If the handover cannot be completed as agreed we record the situation and agree what happens next; waiting may be charged at the published rate.' },
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  {
    key: 'homeDelivery',
    category: 'business',
    launch: 'priority',
    appointment: 'none',
    icon: 'dealer',
    price: { key: 'transfer' },
    related: ['branchTransfer', 'purchasedCarPickup', 'relocation'],
    devNote: 'The dealer remains responsible for the sale documents and for what was promised about the vehicle. Record the acknowledgement of receipt, but never present that signature as a waiver of consumer rights. A trade-in collection is a second job with its own vehicle and readiness checks.',
    fi: {
      slug: 'kotiintoimitus',
      nav: 'Kotiintoimitus',
      short: 'Kotiintoimitus',
      title: 'Auton kotiintoimitus autoliikkeille | DriveMe',
      description: 'Toimita myyty auto asiakkaasi sovittuun osoitteeseen. DriveMe hoitaa siirron ja luovutuksen. Pyydä tarjous kotiintoimituksesta.',
      h1: 'Auton kotiintoimitus asiakkaallesi',
      lead: 'Toimitamme myydyn auton liikkeestänne asiakkaan sovittuun osoitteeseen. Sovimme noudon, toimitusajan ja luovutuksen käytännöt etukäteen. Palvelu sopii myös asiakkaille, jotka ostavat auton toiselta paikkakunnalta.',
      keywords: ['auton kotiintoimitus', 'myydyn auton toimitus asiakkaalle', 'autoliikkeen toimituspalvelu'],
      steps: [
        'Kerro noutopaikka, ostajan yhteystiedot ja realistinen toimitusaikaikkuna.',
        'Vahvistamme hinnan, kuljettajan ja toimitusajan ennen ajoa.',
        'Kuljettaja tarkistaa näkyvän kunnon noudossa ja kirjaa mittarilukeman.',
        'Auto ja avaimet luovutetaan sovitulle vastaanottajalle, ja tilaaja saa luovutuksen vahvistuksen.',
      ],
      included: [
        'Sovittu toimitusaikaikkuna ja yhteydenotto ostajaan ennen saapumista',
        'Näkyvän kunnon ja mittarilukeman kirjaus noudossa',
        'Auton ja avainten luovutus sovitulle vastaanottajalle',
        'Luovutuksen vahvistus tilaajalle toimituksen jälkeen',
      ],
      customer: [
        'Vastaa kauppakirjoista, rekisteröinnistä ja autosta annetuista tiedoista',
        'Toimita ostajan yhteystiedot ja sovi realistinen toimitusikkuna',
        'Kerro etukäteen, jos luovutukseen liittyy esittely tai vaihtoauton nouto',
      ],
      excluded: [
        'Auton myyntiesittely tai teknisen kunnon selostus ostajalle',
        'Kauppahinnan tai muiden maksujen vastaanotto',
        'Vaihtoauton nouto ilman erikseen sovittua toista siirtoa',
      ],
      boundary: 'DriveMe vastaa siirrosta ja dokumentoidusta luovutuksesta. Kaupan ehdoista, asiakirjoista ja autosta annetuista lupauksista vastaa myyjäliike. Luovutuksen kuittaus on kuittaus vastaanotosta, ei kuluttajan oikeuksista luopumista.',
      faq: [
        { q: 'Mille alueelle toimitatte?', a: 'Pääkaupunkiseutu ja Uusimaa kuuluvat vakioalueeseen. Pidemmät toimitukset Suomessa sovitaan reittikohtaisesti, kun kuljettajan paluujärjestely on selvillä.' },
        { q: 'Pitääkö ostajan olla paikalla?', a: 'Kyllä, tai hänen nimeämänsä vastaanottaja. Luovutus kuitataan sille henkilölle, jonka olette ilmoittaneet.' },
        { q: 'Entä asiakirjat ja avaimet?', a: 'Kuljettaja toimittaa mukaan annetut asiakirjat ja avaimet sellaisenaan. Emme täytä tai allekirjoita kauppa-asiakirjoja liikkeen puolesta.' },
        { q: 'Voitteko noutaa vaihtoauton samalla?', a: 'Voimme, mutta se on oma siirtonsa: erillinen ajoneuvo, oma kuntotarkistus ja oma tarjousrivi.' },
      ],
    },
    en: {
      slug: 'home-delivery',
      nav: 'Delivery to the customer',
      short: 'Home delivery',
      title: 'Vehicle delivery to your customer | DriveMe',
      description: 'Deliver a sold car to your customer’s address. DriveMe handles the drive and the handover. Ask for a delivery quote.',
      h1: 'Delivering a sold car to your customer',
      lead: 'We deliver a sold car from your showroom to the customer’s agreed address. Collection, delivery time and handover practice are agreed in advance. It also suits customers buying from another town.',
      keywords: ['car home delivery dealer', 'deliver sold car to customer', 'vehicle delivery service finland'],
      steps: [
        'Tell us the collection point, the buyer’s contact details and a realistic delivery window.',
        'We confirm the price, the driver and the delivery time before the drive.',
        'The driver checks the visible condition at collection and records the odometer.',
        'The car and keys are handed to the named receiver, and you get a confirmation of the handover.',
      ],
      included: [
        'An agreed delivery window and contact with the buyer before arrival',
        'Visible condition and odometer recorded at collection',
        'Handover of the car and the keys to the named receiver',
        'Confirmation of the handover sent to you afterwards',
      ],
      customer: [
        'Remain responsible for the sale documents, registration and what was said about the car',
        'Provide the buyer’s contact details and agree a realistic delivery window',
        'Tell us in advance if the handover includes a demonstration or a trade-in collection',
      ],
      excluded: [
        'Demonstrating the car or explaining its technical condition to the buyer',
        'Collecting the purchase price or any other payment',
        'Trade-in collection without a separately agreed second transfer',
      ],
      boundary: 'DriveMe is responsible for the transfer and the documented handover. The selling dealer remains responsible for the terms of sale, the documents and any representations about the car. The receipt acknowledges delivery; it does not waive consumer rights.',
      faq: [
        { q: 'Which areas do you deliver to?', a: 'The capital region and Uusimaa are the standard area. Longer deliveries in Finland are agreed per route, once the driver’s return leg is settled.' },
        { q: 'Does the buyer need to be present?', a: 'Yes, or a receiver they have named. The handover is signed off by the person you told us about.' },
        { q: 'What about documents and keys?', a: 'The driver delivers the documents and keys given to them, as they are. We do not complete or sign sale documents on the dealer’s behalf.' },
        { q: 'Can you collect a trade-in at the same time?', a: 'We can, but it is its own transfer: a separate vehicle, its own condition check and its own line in the quote.' },
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  {
    key: 'purchasedCarPickup',
    category: 'business',
    launch: 'priority',
    appointment: 'none',
    icon: 'pickup',
    price: { key: 'transfer' },
    related: ['branchTransfer', 'homeDelivery', 'workshopTransfer'],
    devNote: 'Transportation and visible-condition documentation only. No mechanical inspection, valuation, purchase recommendation, ownership-transfer handling or payment collection. Record the seller’s phone, who may release the vehicle, the opening hours and where the vehicle stands.',
    fi: {
      slug: 'ostoauton-nouto',
      nav: 'Ostoauton nouto',
      short: 'Ostoauton nouto',
      title: 'Ostoauton nouto myyjältä autoliikkeeseen | DriveMe',
      description: 'Noudamme ajokuntoisen ostoauton myyjältä ja siirrämme sen liikkeeseenne. Kerro reitti ja ajankohta, niin selvitämme saatavuuden.',
      h1: 'Ostoauton nouto myyjältä liikkeeseenne',
      lead: 'Kun liikkeenne ostaa auton yksityiseltä myyjältä, toisesta liikkeestä tai huutokaupasta, DriveMe voi hoitaa noudon ja siirron. Sovimme myyjän kanssa luovutuksen käytännöt ja toimitamme ajokuntoisen auton ilmoittamaanne osoitteeseen.',
      keywords: ['ostoauton nouto', 'auton nouto myyjältä', 'huutokauppa-auton siirto'],
      steps: [
        'Kerro myyjän yhteystiedot, auton sijainti ja noudon aikaikkuna.',
        'Varmistamme ennen ajoa, että auto ja avaimet ovat luovutettavissa ja että noutoon on tilaajan valtuutus.',
        'Kuljettaja dokumentoi näkyvän kunnon ja mittarilukeman noudossa.',
        'Auto toimitetaan ilmoittamaanne osoitteeseen ja luovutus kuitataan.',
      ],
      included: [
        'Yhteydenotto myyjään ja luovutuksen käytännöistä sopiminen',
        'Noudon kuntokuvat ja mittarilukema',
        'Siirto ilmoittamaanne osoitteeseen ja luovutuksen kuittaus',
        'Ilmoitus tilaajalle, jos noutoa estää jokin havaittu puute',
      ],
      customer: [
        'Vahvista, että noutoon on valtuutus ja kerro kuka auton saa luovuttaa',
        'Toimita myyjän puhelinnumero, osoite, aukioloajat ja auton sijainti',
        'Vastaa kaupasta, maksuista ja omistajanvaihdoksen ilmoituksista',
      ],
      excluded: [
        'Auton tekninen tai mekaaninen tarkastus ja arvonmääritys',
        'Ostosuositus tai kunnon arviointi kaupan tueksi',
        'Kauppahinnan maksu tai omistajanvaihdoksen hoitaminen',
      ],
      boundary: 'DriveMe hoitaa siirron ja kirjaa näkyvän kunnon. Emme tarkasta autoa teknisesti emmekä ota kantaa kaupan ehtoihin. Jos auto ei ole ajokuntoinen tai luovutusvaltuutus puuttuu, ilmoitamme siitä tilaajalle ennen jatkamista.',
      faq: [
        { q: 'Voitteko noutaa yksityiseltä myyjältä tai huutokaupasta?', a: 'Kyllä. Tarvitsemme myyjän yhteystiedot, noutopaikan aukioloajat ja tiedon siitä, kuka auton saa luovuttaa.' },
        { q: 'Miten luovutusvaltuutus varmistetaan?', a: 'Tilaaja vahvistaa noutovaltuutuksen ennen ajoa. Jos myyjä ei tunnista noutoa sovituksi, kuljettaja ei ota autoa vaan ottaa yhteyttä tilaajaan.' },
        { q: 'Entä jos auto ei olekaan ajokuntoinen?', a: 'Emme aja ajokelvotonta tai ajokiellossa olevaa autoa. Kirjaamme havainnon, ilmoitamme tilaajalle ja sovimme jatkosta; hinauksen järjestää tilaaja.' },
        { q: 'Tarkastatteko auton kunnon ostopäätöstä varten?', a: 'Emme. Dokumentoimme näkyvän kunnon ja mittarilukeman siirtoa varten. Tekninen tarkastus ja arvonmääritys ovat eri palveluita, joita emme tarjoa.' },
      ],
    },
    en: {
      slug: 'purchased-vehicle-collection',
      nav: 'Purchased vehicle collection',
      short: 'Purchase pickup',
      title: 'Collecting a purchased car from the seller | DriveMe',
      description: 'We collect a roadworthy purchased car from the seller and move it to your premises. Tell us the route and the timing and we will check availability.',
      h1: 'Collecting a purchased car from the seller',
      lead: 'When your business buys a car from a private seller, another dealer or an auction, DriveMe can handle the collection and the transfer. We agree the handover practice with the seller and deliver the roadworthy car to the address you give.',
      keywords: ['purchased car collection', 'collect car from seller', 'auction vehicle transfer finland'],
      steps: [
        'Give us the seller’s contact details, where the car stands and the collection window.',
        'Before the drive we confirm that the car and keys can be released and that the collection is authorised.',
        'The driver documents the visible condition and the odometer at collection.',
        'The car is delivered to the address you gave and the handover is signed off.',
      ],
      included: [
        'Contacting the seller and agreeing the handover practice',
        'Condition photos and odometer at collection',
        'The transfer to your address and a signed handover',
        'A call to you if anything found on site prevents the collection',
      ],
      customer: [
        'Confirm the collection is authorised and say who may release the car',
        'Provide the seller’s phone number, address, opening hours and the car’s location',
        'Remain responsible for the purchase, the payments and the change of ownership',
      ],
      excluded: [
        'Technical or mechanical inspection and valuation',
        'A purchase recommendation or an opinion on condition',
        'Paying the purchase price or handling the transfer of ownership',
      ],
      boundary: 'DriveMe handles the transfer and records the visible condition. We do not inspect the car technically and we take no position on the terms of the purchase. If the car is not roadworthy, or the authority to release it is missing, we tell you before going further.',
      faq: [
        { q: 'Can you collect from a private seller or an auction?', a: 'Yes. We need the seller’s contact details, the opening hours of the collection point and who is allowed to release the car.' },
        { q: 'How is the release authority confirmed?', a: 'You confirm the collection before the drive. If the seller does not recognise it as agreed, the driver does not take the car and contacts you instead.' },
        { q: 'What if the car turns out not to be roadworthy?', a: 'We do not drive a car that is unfit or banned from the road. We record what we found, tell you, and agree what happens next; towing is arranged by you.' },
        { q: 'Do you check the condition for the purchase decision?', a: 'No. We document the visible condition and odometer for the transfer. Technical inspection and valuation are different services, which we do not offer.' },
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  {
    key: 'workshopTransfer',
    category: 'concierge',
    launch: 'priority',
    appointment: 'required',
    icon: 'workshop',
    price: { key: 'serviceRun' },
    related: ['branchTransfer', 'relocation', 'purchasedCarPickup'],
    devNote: 'Record the workshop arrival deadline, the service booking reference and a contact who confirms the car is ready to come back. The return leg is dispatched separately once the provider confirms readiness. Unattended workshop time is not driver waiting, and drivers never approve repairs or extra provider work.',
    fi: {
      slug: 'huoltosiirto',
      nav: 'Huoltosiirto',
      short: 'Huoltosiirto',
      title: 'Huoltosiirto – auton nouto ja palautus | DriveMe',
      description: 'Auton siirto valittuun huoltopisteeseen ja palautus sovitusti. DriveMe hoitaa ajon; huoltotyö sovitaan suoraan palveluntarjoajan kanssa.',
      h1: 'Huoltosiirto – auton nouto ja palautus',
      lead: 'DriveMe noutaa ajokuntoisen auton sovitusta osoitteesta, vie sen valitsemaanne huoltopisteeseen ja palauttaa sen sovitusti. Palvelu sopii yritysten kalustolle ja korjaamojen asiakkaille sekä yksityisille auton omistajille.',
      destinations: [
        { id: 'katsastus', label: 'Katsastus', body: 'Varaat katsastusajan, me hoidamme auton asemalle ja takaisin katsastusdokumenttien kanssa.' },
        { id: 'huolto', label: 'Huolto ja korjaamo', body: 'Auto sovittuun huoltoon tai korjaamolle ja palautus, kun palveluntarjoaja ilmoittaa sen valmiiksi.' },
        { id: 'renkaat', label: 'Renkaanvaihto', body: 'Renkaanvaihto tai rengashotelli ilman että kukaan teistä jonottaa.' },
        { id: 'pesu', label: 'Pesu ja detailing', body: 'Auto pesuun tai detailing-palveluun kesken työpäivän.' },
        { id: 'lasi', label: 'Lasi- ja korikorjaamo', body: 'Ajokuntoinen auto lasin vaihtoon, korikorjaamolle tai valmistajan takaisinkutsuun.' },
      ],
      keywords: ['huoltosiirto', 'auton nouto huoltoon', 'auton vienti katsastukseen', 'auton nouto ja palautus'],
      steps: [
        'Kerro huoltopiste, varattu aika ja mistä auto noudetaan.',
        'Vahvistamme hinnan ja kuljettajan ennen ajoa.',
        'Nouto sovitussa ikkunassa: kirjaamme näkyvän kunnon, mittarilukeman ja avaimet.',
        'Luovutus huoltopisteelle, ja palautus sovitusti tai kuljettajan odottaessa.',
      ],
      included: [
        'Nouto sovitusta osoitteesta ja luovutus huoltopisteelle',
        'Näkyvän kunnon, mittarilukeman ja polttoaine- tai lataustason kirjaus',
        'Palautus sovittuun osoitteeseen ja valmistumiskuittaus',
        'Valitun tuotteen mukainen odotus, kun odota ja palauta -vaihtoehto on valittu',
      ],
      customer: [
        'Varaa ja vahvista huolto-, katsastus- tai muu aika ennen kuljettajan lähtöä',
        'Maksa palveluntarjoajan työ suoraan palveluntarjoajalle',
        'Nimeä yhteyshenkilö, joka vahvistaa auton olevan valmis palautettavaksi',
      ],
      excluded: [
        'Huolto-, korjaus-, katsastus-, rengas- tai pesutyö itsessään',
        'Lisätöiden hyväksyminen asiakkaan puolesta',
        'Odotusajan veloituksetta pidentäminen, jos huolto viivästyy',
      ],
      boundary: 'DriveMe vastaa siirrosta, dokumentoinnista ja sovitusta aikataulusta. Varauksesta, työn sisällöstä ja sen maksamisesta vastaa tilaaja suoraan palveluntarjoajalle. Kuljettaja ei hyväksy lisätöitä.',
      faq: [
        { q: 'Pitääkö aika olla varattuna etukäteen?', a: 'Kyllä. Tilaaja varaa huolto-, katsastus- tai muun ajan ja ilmoittaa meille palveluntarjoajan, ajan ja mahdollisen varausnumeron.' },
        { q: 'Mihin kaikkiin palveluihin siirto sopii?', a: 'Siirto voidaan sopia huoltoon, katsastukseen, renkaanvaihtoon, pesuun, lasikorjaukseen tai muuhun varattuun autopalveluun. DriveMe hoitaa ajon, työn tekee valitsemanne palveluntarjoaja.' },
        { q: 'Mitä tapahtuu, jos huolto viivästyy?', a: 'Palautus ajetaan erillisenä ajona, kun palveluntarjoaja vahvistaa auton olevan valmis. Huoltopisteellä vietetty aika ilman kuljettajaa ei ole kuljettajan odotusta eikä sitä veloiteta odotuksena.' },
        { q: 'Mitä eroa on odotuksella ja myöhemmällä palautuksella?', a: 'Odota ja palauta -vaihtoehdossa kuljettaja jää paikalle sovitun odotusajan ja tuo auton heti takaisin. Myöhemmässä palautuksessa kuljettaja lähtee ja palaa, kun auto on valmis; kahdesta ajosta muodostuu oma hintansa.' },
      ],
    },
    en: {
      slug: 'service-transfer',
      nav: 'Service transfer',
      short: 'Service transfer',
      title: 'Service transfer — collection and return | DriveMe',
      description: 'A car taken to the service point you choose and returned as agreed. DriveMe does the driving; the work itself is agreed directly with the provider.',
      h1: 'Service transfer — collection and return',
      lead: 'DriveMe collects a roadworthy car from the agreed address, takes it to the service point you choose and returns it as agreed. It suits company fleets, workshop customers and private owners alike.',
      destinations: [
        { id: 'inspection', label: 'Inspection', body: 'You book the slot; we take the car to the station and bring it back with the paperwork.' },
        { id: 'workshop', label: 'Workshop and repair', body: 'To the booked service or repair, and back once the provider says the car is ready.' },
        { id: 'tyres', label: 'Tyre change', body: 'A tyre change or tyre hotel without anyone on your side queueing for it.' },
        { id: 'wash', label: 'Wash and detailing', body: 'To a wash or detailing appointment in the middle of a working day.' },
        { id: 'glass', label: 'Glass and body shop', body: 'A roadworthy car to glass replacement, a body shop or a manufacturer recall.' },
      ],
      keywords: ['service transfer', 'car to workshop collection', 'car to inspection', 'vehicle pickup and return'],
      steps: [
        'Tell us the provider, the booked time and where the car is collected.',
        'We confirm the price and the driver before the drive.',
        'Collection in the agreed window: visible condition, odometer and keys recorded.',
        'Handover at the provider, then the return as agreed or with the driver waiting.',
      ],
      included: [
        'Collection from the agreed address and handover at the provider',
        'Visible condition, odometer and fuel or charge level recorded',
        'Return to the agreed address and a completion receipt',
        'The waiting allowance of the product chosen, when wait-and-return is selected',
      ],
      customer: [
        'Book and confirm the service, inspection or other appointment before the driver sets off',
        'Pay the provider’s own work directly to the provider',
        'Name a contact who confirms the car is ready to come back',
      ],
      excluded: [
        'The service, repair, inspection, tyre or wash work itself',
        'Approving additional work on the customer’s behalf',
        'Extending the waiting allowance free of charge when the provider runs late',
      ],
      boundary: 'DriveMe is responsible for the transfer, the documentation and the agreed schedule. The booking, the content of the work and paying for it stay between the customer and the provider. The driver approves no extra work.',
      faq: [
        { q: 'Does the appointment have to be booked in advance?', a: 'Yes. You book the service, inspection or other appointment and tell us the provider, the time and any booking reference.' },
        { q: 'Which services does this cover?', a: 'A transfer can be agreed to a service, an inspection, a tyre change, a wash, glass repair or any other booked car service. DriveMe does the driving; your chosen provider does the work.' },
        { q: 'What happens if the workshop runs late?', a: 'The return is dispatched as a separate drive once the provider confirms the car is ready. Time the car spends at the provider without a driver is not driver waiting and is not charged as such.' },
        { q: 'What is the difference between waiting and a later return?', a: 'With wait-and-return the driver stays for the agreed waiting allowance and brings the car straight back. With a later return the driver leaves and comes back when the car is ready; two drives carry their own price.' },
      ],
    },
  },
];

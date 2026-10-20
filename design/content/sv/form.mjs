/**
 * The quote form in Swedish: every field, help text, error message and the
 * confirmation the customer sees after sending.
 *
 * Keyed exactly like the Finnish and English blocks in build/booking-form.mjs
 * and merged into them there.
 */

import { brand } from '../site.mjs';

export const form = {
  intro: 'Berätta rutten, tidpunkten och bilen, så skickar vi ett fast pris. Formuläret tar ungefär en minut.',

  step1: 'Tjänst',
  service: 'Vilken tjänst behöver du?',
  servicePlaceholder: 'Välj tjänst',
  serviceNames: {
    branchTransfer: 'Flytt mellan verksamhetsställen',
    homeDelivery: 'Hemleverans till kunden',
    purchasedCarPickup: 'Hämtning av inköpt bil',
    workshopTransfer: 'Serviceflytt (verkstad, besiktning, däck, tvätt)',
    relocation: 'Bilflytt (en enskild flytt)',
    personalDriver: 'Personlig förare',
    business: 'För företag (avtal eller flera flyttar)',
    other: 'Annan tjänst',
  },

  step2: 'Uppgifter om flytten',
  step2Journey: 'Uppgifter om resan',
  pickup: 'Upphämtningsadress',
  pickupHelp: 'Gatuadress eller postnummer.',
  destination: 'Destinationsadress',
  destinationJourney: 'Destination',
  destinationHelp: 'Gatuadress, postnummer eller platsens namn.',
  date: 'Önskad dag',
  time: 'Önskad tid',
  timeHelp: 'Frivilligt. Lämna tomt om tiden är flexibel.',
  vehicle: 'Bilens uppgifter',
  vehicleHelp: 'Märke, modell, årsmodell och växellåda i ett och samma fält. Till exempel "Ford Focus 2018, manuell".',

  passengers: 'Antal passagerare',
  passengersHelp: 'Föraren tar ingen plats: berätta hur många ni är som reser.',
  stops: 'Stopp under resan',
  stopsHelp: 'Frivilligt. Till exempel en upphämtning på vägen eller väntetid på plats.',

  plate: 'Registernummer',
  plateHelp: 'Frivilligt. Det gör offerten snabbare att göra.',
  roadworthy: 'Bilen är körduglig och i trafik',
  roadworthyHelp: 'Vi kör inte en bil som inte är körduglig eller har körförbud. Berätta om det nedan, så hänvisar vi dig till en bogseringspartner.',

  apptTime: 'Bokad tid hos leverantören',
  apptTimeHelp: 'Frivilligt. Tiden bokar du och tjänsten betalar du själv.',
  returnLabel: 'Behövs en returtransport?',
  returnYes: 'Ja, bilen körs tillbaka',
  returnNo: 'Nej, bara dit',

  step3: 'Kontaktuppgifter',
  name: 'Namn',
  phone: 'Telefonnummer',
  email: 'E-post',
  emailHelp: 'Vi skickar offerten och en bekräftelse till den här adressen.',
  company: 'Företagets namn',
  companyHelp: 'Frivilligt. Fyll i om du begär offert för ett företag.',
  businessId: 'FO-nummer',
  businessIdHelp: 'Frivilligt.',
  volume: 'Antal bilar eller uppdrag',
  volumeHelp: 'Till exempel "3 bilar" eller "cirka 10 flyttar i månaden".',
  recurrence: 'Engångsuppdrag eller återkommande?',
  recurrenceOnce: 'En enskild flytt',
  recurrenceRecurring: 'Återkommande samarbete',

  notes: 'Mer information / vad vill du att vi gör?',
  notesHelp: 'Frivilligt. Berätta fritt om något avviker från det vanliga - nyckelöverlämning, port- eller garagekod, ett känt fel eller något annat önskemål.',
  offerToggle: 'Jag har en förmånskod',
  offerCode: 'Förmånskod',
  offerCodeHelp: 'Frivillig. Vi beaktar kampanjkoden i offerten.',

  submit: 'Begär fast offert',
  submitting: 'Skickar…',
  promise: 'Vi återkommer med en offert inom 24 timmar.',
  trustLine: 'Kostnadsfri offert · Utan förbindelse · Transparent prissättning',
  requiredNote: 'Fält märkta med * är obligatoriska.',
  enquiryNote: 'En offertförfrågan bekräftar ingen bokning. Flytten avtalas först när du godkänner offerten.',

  errorTitle: 'Kontrollera de här punkterna',
  required: 'Den här uppgiften behövs.',
  badEmail: 'Kontrollera e-postadressen.',
  badPhone: 'Kontrollera telefonnumret.',
  badDate: 'Välj i dag eller ett senare datum.',
  badRange: 'Värdet ligger utanför det tillåtna intervallet.',
  failed: 'Förfrågan kunde inte skickas. Försök igen eller ring ' + brand.phone + '.',

  sideTitle: 'Så går vi vidare',
  sideSteps: [
    'Vi läser din förfrågan och skickar ett fast pris inom 24 timmar.',
    'Om någon uppgift saknas frågar vi efter den före offerten.',
    'Flytten bekräftas först när du godkänner offerten. Då kommer vi överens om nyckelöverlämning och fakturering.',
  ],
  sideCallTitle: 'Behöver du svar genast?',
  terms: 'Servicevillkor',
  termsNote: 'Bokningsvillkoren och rätten att överlämna bilen går vi igenom före bekräftelsen.',

  doneTitle: 'Tack för din offertförfrågan!',
  doneBody: 'DriveMe-teamet kontaktar dig inom 24 timmar. En offertförfrågan bekräftar ännu ingen bokning.',
  doneRef: 'Din referens',
  doneAgain: 'Skicka en ny offertförfrågan',
  gatedTitle: 'Den här tjänsten går inte att boka ännu',
  gatedBody: 'Tjänsten är inte bokningsbar ännu. Vi berättar så snart den öppnar - lämna dina uppgifter per telefon eller e-post.',
};

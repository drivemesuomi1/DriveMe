/**
 * The enquiry form in Swedish: every field, help text, error message and the
 * confirmation the customer sees after sending.
 *
 * Keyed exactly like the Finnish and English blocks in build/booking-form.mjs
 * and merged into them there.
 */

import { brand } from '../site.mjs';

export const form = {
  intro: 'Berätta kort vad du behöver. Vi läser din förfrågan och kontaktar dig inom 24 timmar.',
  name: 'Namn',
  phone: 'Telefonnummer',
  email: 'E-post',
  emailHelp: 'Vi skickar en skriftlig bekräftelse på din förfrågan till den här adressen.',
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
  company: 'Företagets namn',
  companyHelp: 'Frivilligt. Fyll i om du begär offert för ett företag.',
  notes: 'Mer information / vad vill du att vi gör?',
  notesHelp: 'Berätta fritt om rutten, önskad tidpunkt och antalet flyttar. Exakta adresser, bilens uppgifter och nyckelöverlämningen kommer vi överens om när vi kontaktar dig.',
  offerToggle: 'Jag har en förmånskod',
  offerCode: 'Förmånskod',
  offerCodeHelp: 'Frivillig. Skriv in kampanjkoden här, vi beaktar den i offerten.',
  submit: 'Begär offert',
  submitting: 'Skickar…',
  requiredNote: 'Fält märkta med * är obligatoriska.',
  enquiryNote: 'En offertförfrågan bekräftar ingen bokning. Vi bekräftar pris, tidtabell och förare separat, och flytten avtalas först när du godkänner offerten.',
  errorTitle: 'Kontrollera de här punkterna',
  required: 'Den här uppgiften behövs.',
  badEmail: 'Kontrollera e-postadressen.',
  badPhone: 'Kontrollera telefonnumret.',
  failed: 'Förfrågan kunde inte skickas. Försök igen eller ring ' + brand.phone + '.',
  sideTitle: 'Så går vi vidare',
  sideSteps: [
    'Vi läser din offertförfrågan och kontaktar dig inom 24 timmar.',
    'Vi går tillsammans igenom adresserna, bilens uppgifter, nyckelöverlämningen och tidtabellen.',
    'Du får ett fast pris. Flytten bekräftas först när du godkänner offerten.',
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

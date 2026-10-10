/**
 * The request API, end to end, against local stand-ins for Supabase and
 * Resend.
 *
 * Nothing here touches a real database or sends a real email: SUPABASE_URL
 * and RESEND_API_URL point at an in-process HTTP server that records what the
 * handler sent and answers the way the real services do. That covers the
 * plan's P0 checks - submissions, emails and failure alerts - without writing
 * a test row into production.
 */

import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';

let rows = [];          // what the handler inserted
let mails = [];         // what the handler sent
let dbMode = 'ok';      // 'ok' | 'fail'
let mailMode = 'ok';    // 'ok' | 'fail'

const server = createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8');

  if (req.url.startsWith('/rest/v1/bookings')) {
    if (dbMode === 'fail') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        code: '23502', message: 'null value in column "customer_email" violates not-null constraint',
      }));
    }
    rows.push(...[].concat(JSON.parse(text)));
    res.writeHead(201);
    return res.end();
  }
  if (req.url === '/emails') {
    if (mailMode === 'fail') { res.writeHead(500); return res.end('unavailable'); }
    mails.push(JSON.parse(text));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ id: 'mail-' + mails.length }));
  }
  res.writeHead(404);
  res.end();
});

let handler;

before(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  process.env.SUPABASE_URL = origin;
  process.env.SUPABASE_ANON_KEY = 'test-anon-key';
  process.env.RESEND_API_KEY = 'test-resend-key';
  process.env.RESEND_API_URL = origin + '/emails';
  process.env.OPS_EMAIL = 'ops@example.test';
  // Imported after the environment is set: the Supabase module reads it on load.
  ({ default: handler } = await import('../api/bookings.js'));
});

after(() => server.close());

beforeEach(() => {
  rows = [];
  mails = [];
  dbMode = 'ok';
  mailMode = 'ok';
});

async function post(body) {
  const res = {
    statusCode: 0, headers: {}, body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
  await handler({ method: 'POST', body }, res);
  return res;
}

/** The enquiry, as the form sends it: six fields and nothing else. */
const enquiry = (extra = {}) => ({
  language: 'fi',
  customer_name: 'Testi Asiakas',
  customer_phone: '+358 40 123 4567',
  customer_email: 'testi@example.test',
  service: 'relocation',
  passenger_count: 0,
  lead_source: 'utm:google/cpc/test | entry:home_hero',
  ...extra,
});

test('an enquiry is saved from six fields, and priced by nobody', async () => {
  const res = await post(enquiry());
  assert.equal(res.statusCode, 201, JSON.stringify(res.body));
  assert.equal(res.body.success, true);
  assert.equal(res.body.saved, true);
  assert.match(res.body.reference, /^[0-9A-F]{8}$/);

  assert.equal(rows.length, 1);
  const row = rows[0];
  assert.equal(row.service, 'relocation');
  assert.equal(row.customer_email, 'testi@example.test');
  assert.equal(row.customer_type, 'person');
  assert.equal(row.passenger_count, 0);
  assert.equal(row.status, 'requested');
  assert.equal(row.lead_source, 'utm:google/cpc/test | entry:home_hero');
  assert.equal(row.manual_review, false);

  // Nothing is quoted on the page, so nothing is quoted here either: the
  // figure comes from a person who has read the enquiry.
  assert.equal(row.estimated_price, null, 'the API priced an enquiry');
  assert.equal(row.quote_status, 'quote_required');
  assert.equal(res.body.indicativePrice, null);

  // And nothing it no longer asks for is invented.
  assert.equal(row.pickup_location, null, 'the address is agreed on the call back');
  assert.equal(row.destination, null);
  assert.equal(row.scheduled_for, null);
  assert.equal(row.vehicle_plate, null);
  assert.equal(row.vehicle_owner_authorization, null, 'the declaration is taken on the call back');

  // Ops hears about it, and the customer gets the written confirmation.
  assert.equal(mails.length, 2);
  assert.deepEqual(mails[0].to, ['ops@example.test']);
  assert.match(mails[0].subject, /^New request [0-9A-F]{8} /);
  assert.match(mails[0].text, /\+358 40 123 4567/);
  assert.equal(mails[0].reply_to, 'testi@example.test');
  assert.deepEqual(mails[1].to, ['testi@example.test']);
  assert.match(mails[1].text, /24 tunnin kuluessa/);
  assert.match(mails[1].text, /ei vielä vahvista varausta/);
});

test('every one of the six offers is accepted, under the product that prices it', async () => {
  const expected = {
    branchTransfer: 'transfer',
    homeDelivery: 'transfer',
    purchasedCarPickup: 'transfer',
    workshopTransfer: 'serviceRun',
    relocation: 'oneWay',
    personalDriver: 'journey',
    business: 'corporate',
  };
  for (const [service, product] of Object.entries(expected)) {
    const res = await post(enquiry({ service }));
    assert.equal(res.statusCode, 201, `${service}: ${JSON.stringify(res.body)}`);
    assert.equal(rows.at(-1).service, service);
    assert.equal(rows.at(-1).product, product, service);
    // The product says how the job would be priced; the price itself waits.
    assert.equal(rows.at(-1).estimated_price, null, service);
  }
});

test('"Muu palvelu" is a real enquiry, not a validation error', async () => {
  const res = await post(enquiry({ service: 'other', notes: 'Tarvitsen auton siirron Viroon.' }));
  assert.equal(res.statusCode, 201, JSON.stringify(res.body));
  const row = rows[0];
  assert.equal(row.service, 'other');
  assert.equal(row.product, null, 'there is no product until someone has read it');
  assert.equal(row.quote_status, 'quote_required');
  assert.match(row.notes, /Viroon/);
});

test('a company name is what makes an enquiry a company enquiry', async () => {
  await post(enquiry({ service: 'branchTransfer', company_name: 'Autotalo Oy' }));
  assert.equal(rows[0].company_name, 'Autotalo Oy');
  assert.equal(rows[0].customer_type, 'company');
  assert.equal(rows[0].is_corporate, true);

  await post(enquiry());
  assert.equal(rows[1].customer_type, 'person');
  assert.equal(rows[1].is_corporate, false);
});

test('a campaign code rides along with the enquiry and reaches ops', async () => {
  const res = await post(enquiry({ offer_code: 'driveme10', notes: 'Avaimet vartijalla.' }));
  assert.equal(res.statusCode, 201, JSON.stringify(res.body));

  // Saved with the enquiry, upper-cased, and the customer's own note kept.
  const row = rows[0];
  assert.ok(row.notes.startsWith('Offer code: DRIVEME10\n'), row.notes);
  assert.match(row.notes, /Avaimet vartijalla\./);

  // Ops sees it on a line of its own, not buried in the free text.
  assert.match(mails[0].text, /Offer code:? ?.{0,4}DRIVEME10/);
  assert.equal(/Offer code: DRIVEME10/.test(mails[0].text.split('Customer notes')[1] || ''), false,
    'the code should not be repeated inside the customer notes');

  // And the customer's receipt repeats it back to them.
  assert.equal(mails.length, 2);
  assert.match(mails[1].text + mails[1].html, /DRIVEME10/);
});

test('an enquiry without a code keeps its notes exactly as written', async () => {
  await post(enquiry({ notes: 'Auto on pihassa.' }));
  assert.equal(rows[0].notes, 'Auto on pihassa.');
  assert.equal(/Offer code/.test(mails[0].text), false);
});

test('a retired service key still resolves to the offer that answers for it', async () => {
  const retired = {
    inspection: 'workshopTransfer', workshop: 'workshopTransfer', tyre: 'workshopTransfer',
    wash: 'workshopTransfer', glass: 'workshopTransfer',
    pickupReturn: 'relocation', dealer: 'relocation',
    journey: 'personalDriver', safeRideHome: 'personalDriver', airport: 'personalDriver',
  };
  for (const [asked, resolved] of Object.entries(retired)) {
    const res = await post(enquiry({ service: asked }));
    assert.equal(res.statusCode, 201, `${asked}: ${JSON.stringify(res.body)}`);
    assert.equal(rows.at(-1).service, resolved, asked);
  }
});

test('a journey records the passengers it is for, a move records none', async () => {
  await post(enquiry({ service: 'personalDriver' }));
  assert.equal(rows[0].mode, 'personal_driver');
  assert.equal(rows[0].service_type, 'passenger_journey');
  // How many travel is asked on the call back; a journey still carries one.
  assert.equal(rows[0].passenger_count, 1);

  await post(enquiry({ service: 'relocation' }));
  assert.equal(rows[1].mode, 'vehicle_concierge');
  assert.equal(rows[1].passenger_count, 0);
});

test('a car move with a passenger is refused and nothing is saved or sent', async () => {
  const res = await post(enquiry({ passenger_count: 1 }));
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.field, 'passenger_count');
  assert.equal(rows.length, 0);
  assert.equal(mails.length, 0);
});

test('text that suggests a passenger is saved but flagged for review, never relabelled', async () => {
  const res = await post(enquiry({ notes: 'Tulen itse kyytiin, jos se sopii' }));
  assert.equal(res.statusCode, 201, JSON.stringify(res.body));
  assert.equal(rows[0].manual_review, true);
  assert.match(rows[0].review_reason, /^Notes may mention a passenger/);
  assert.equal(rows[0].service, 'relocation');
  assert.match(mails[0].subject, /^REVIEW — New request/);
});

test('the enquiry insists on exactly the four things it asks for', async () => {
  const cases = [
    [enquiry({ customer_name: '' }), 'customer_name'],
    [enquiry({ customer_phone: '' }), 'customer_phone'],
    [enquiry({ customer_phone: '12' }), 'customer_phone'],
    [enquiry({ customer_email: '' }), 'customer_email'],
    [enquiry({ customer_email: 'not-an-address' }), 'customer_email'],
    [enquiry({ service: 'ei-tallaista' }), 'service'],
  ];
  for (const [body, field] of cases) {
    const res = await post(body);
    assert.equal(res.statusCode, 400, field);
    assert.equal(res.body.field, field);
  }
  assert.equal(rows.length, 0);
  assert.equal(mails.length, 0);
});

test('a company name and a free-text note are optional, as the form says', async () => {
  const res = await post(enquiry({ company_name: '', notes: '' }));
  assert.equal(res.statusCode, 201, JSON.stringify(res.body));
  assert.equal(rows[0].company_name, null);
  assert.equal(rows[0].notes, null);
});

test('when the database refuses an enquiry, ops get it in full and the lead survives', async () => {
  dbMode = 'fail';
  const res = await post(enquiry({ notes: 'Tapiolantie 1, Espoo' }));
  assert.equal(res.statusCode, 201, JSON.stringify(res.body));
  assert.equal(res.body.saved, false);
  assert.equal(mails.length, 2, 'the customer is still told we have it');
  assert.match(mails[0].subject, /^UNSAVED request [0-9A-F]{8} — enter manually/);
  assert.match(mails[0].text, /NOT SAVED/);
  assert.match(mails[0].text, /23502/);
  assert.match(mails[0].text, /Tapiolantie 1, Espoo/);
});

test('when the database and the failure alert both fail, the customer is told to call', async () => {
  dbMode = 'fail';
  mailMode = 'fail';
  const res = await post(enquiry());
  assert.equal(res.statusCode, 502);
  assert.match(res.body.error, /\+358 50 357 2836/);
});

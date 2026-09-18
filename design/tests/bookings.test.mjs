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

/** The first stage of the form, as a phone would send it. */
const firstStage = (extra = {}) => ({
  language: 'fi',
  customer_name: 'Testi Asiakas',
  customer_phone: '+358 40 123 4567',
  pickup_location: '00100 Helsinki',
  scheduled_for: '2026-10-06T09:00',
  collection_window: '08-10',
  passenger_count: 0,
  vehicle_owner_authorization: true,
  lead_source: 'utm:google/cpc/test | entry:home_hero',
  ...extra,
});

const move = (extra) => firstStage({
  service: 'relocation', service_type: 'general_move', shape: 'oneWay',
  destination: 'Tapiolantie 1, Espoo', return_needed: false, ...extra,
});

test('a general move is saved from the first stage alone, without an email', async () => {
  const res = await post(move());
  assert.equal(res.statusCode, 201, JSON.stringify(res.body));
  assert.equal(res.body.success, true);
  assert.equal(res.body.saved, true);
  assert.match(res.body.reference, /^[0-9A-F]{8}$/);

  assert.equal(rows.length, 1);
  const row = rows[0];
  assert.equal(row.service, 'relocation');
  assert.equal(row.service_type, 'general_move');
  assert.equal(row.product, 'oneWay');
  assert.equal(row.passenger_count, 0);
  assert.equal(row.customer_email, null);
  assert.equal(row.vehicle_plate, null, 'the registration waits for the callback');
  assert.equal(row.vehicle_owner_authorization, true);
  assert.equal(row.return_needed, false);
  assert.equal(row.lead_source, 'utm:google/cpc/test | entry:home_hero');
  assert.equal(row.manual_review, false);
  assert.equal(row.estimated_price, 89);
  assert.equal(row.status, 'requested');

  // Ops hears about it; there is no customer address to acknowledge to.
  assert.equal(mails.length, 1);
  assert.deepEqual(mails[0].to, ['ops@example.test']);
  assert.match(mails[0].subject, /^New request [0-9A-F]{8} /);
  assert.match(mails[0].text, /\+358 40 123 4567/);
  assert.equal(mails[0].reply_to, undefined);
});

test('a move that has to come back is priced as a pickup and return', async () => {
  const res = await post(move({ service: 'pickupReturn', shape: 'pickupReturn', return_needed: true }));
  assert.equal(res.statusCode, 201, JSON.stringify(res.body));
  assert.equal(rows[0].product, 'pickupReturn');
  assert.equal(rows[0].return_needed, true);
  assert.equal(rows[0].estimated_price, 149);
});

test('an appointment run goes to the provider, and the browser cannot pick a cheaper product', async () => {
  const res = await post(firstStage({
    service: 'inspection', service_type: 'appointment_run', shape: 'waitReturn',
    product: 'oneWay',                       // a tampered request
    provider: 'Katsastusasema, Tapiolantie 1, Espoo',
    customer_email: 'asiakas@example.test',
  }));
  assert.equal(res.statusCode, 201, JSON.stringify(res.body));
  const row = rows[0];
  assert.equal(row.service_type, 'appointment_run');
  assert.equal(row.product, 'inspection');
  assert.equal(row.estimated_price, 169);
  assert.equal(row.destination, 'Katsastusasema, Tapiolantie 1, Espoo');

  // Ops alert first, then the customer's receipt, which says it is a request.
  assert.equal(mails.length, 2);
  assert.deepEqual(mails[1].to, ['asiakas@example.test']);
  assert.match(mails[1].text, /ei ole vielä vahvistus/);
  assert.equal(mails[0].reply_to, 'asiakas@example.test');
});

test('a car move with a passenger is refused and nothing is saved or sent', async () => {
  const res = await post(move({ passenger_count: 1 }));
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.field, 'passenger_count');
  assert.equal(rows.length, 0);
  assert.equal(mails.length, 0);
});

test('a journey is saved with its passengers and quoted by hand', async () => {
  const res = await post(firstStage({
    service: 'journey', service_type: 'passenger_journey',
    destination: 'Helsinki-Vantaan lentoasema', passenger_count: 3, return_needed: true,
    customer_email: 'matkustaja@example.test',
  }));
  assert.equal(res.statusCode, 201, JSON.stringify(res.body));
  const row = rows[0];
  assert.equal(row.service, 'journey');
  assert.equal(row.service_type, 'passenger_journey');
  assert.equal(row.product, 'journey');
  assert.equal(row.passenger_count, 3);
  assert.equal(row.return_needed, true);
  assert.equal(row.mode, 'personal_driver');
  assert.equal(row.estimated_price, null, 'a journey is never auto-priced');
  assert.equal(row.quote_status, 'quote_required');
  assert.equal(row.manual_review, false, 'passengers are the point of a journey');
});

test('the older passenger pages book the same journey service', async () => {
  for (const service of ['personalDriver', 'safeRideHome', 'airport']) {
    const res = await post(firstStage({
      service, service_type: 'passenger_journey', destination: 'Tampere', passenger_count: 2,
    }));
    assert.equal(res.statusCode, 201, service);
    assert.equal(rows.at(-1).product, 'journey', service);
  }
  assert.equal(rows.length, 3);
});

test('a journey needs to say how many are travelling', async () => {
  const none = await post(firstStage({
    service: 'journey', service_type: 'passenger_journey', destination: 'Turku', passenger_count: 0,
  }));
  assert.equal(none.statusCode, 400);
  assert.equal(none.body.field, 'passenger_count');

  const tooMany = await post(firstStage({
    service: 'journey', service_type: 'passenger_journey', destination: 'Turku', passenger_count: 12,
  }));
  assert.equal(tooMany.statusCode, 400);
  assert.equal(tooMany.body.field, 'passenger_count');

  const nowhere = await post(firstStage({
    service: 'journey', service_type: 'passenger_journey', passenger_count: 2,
  }));
  assert.equal(nowhere.statusCode, 400);
  assert.equal(nowhere.body.field, 'destination');
  assert.equal(rows.length, 0);
});

test('text that suggests a passenger is saved but flagged for review, never relabelled', async () => {
  const res = await post(move({ notes: 'Tulen itse kyytiin, jos se sopii' }));
  assert.equal(res.statusCode, 201, JSON.stringify(res.body));
  assert.equal(rows[0].manual_review, true);
  assert.match(rows[0].review_reason, /^Notes may mention a passenger/);
  assert.equal(rows[0].service, 'relocation');
  assert.match(mails[0].subject, /^REVIEW — New request/);
});

test('a service and request type that disagree are sent back, not relabelled', async () => {
  const res = await post(move({ service_type: 'appointment_run' }));
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.field, 'service_type');

  const mismatch = await post(move({ return_needed: true }));
  assert.equal(mismatch.statusCode, 400);
  assert.equal(mismatch.body.field, 'return_needed');
  assert.equal(rows.length, 0);
});

test('the first stage still insists on what a call-back needs', async () => {
  const cases = [
    [move({ customer_phone: '' }), 'customer_phone'],
    [move({ customer_phone: '12' }), 'customer_phone'],
    [move({ customer_email: 'not-an-address' }), 'customer_email'],
    [move({ destination: '' }), 'destination'],
    [move({ pickup_location: '' }), 'pickup_location'],
    [move({ vehicle_owner_authorization: false }), 'ack-0'],
    [firstStage({ service: 'workshop', service_type: 'appointment_run' }), 'provider'],
  ];
  for (const [body, field] of cases) {
    const res = await post(body);
    assert.equal(res.statusCode, 400, field);
    assert.equal(res.body.field, field);
  }
  assert.equal(rows.length, 0);
});

test('when the database refuses a request, ops get it in full and the lead survives', async () => {
  dbMode = 'fail';
  const res = await post(move());
  assert.equal(res.statusCode, 201, JSON.stringify(res.body));
  assert.equal(res.body.saved, false);
  assert.equal(mails.length, 1);
  assert.match(mails[0].subject, /^UNSAVED request [0-9A-F]{8} — enter manually/);
  assert.match(mails[0].text, /NOT SAVED/);
  assert.match(mails[0].text, /23502/);
  assert.match(mails[0].text, /Tapiolantie 1, Espoo/);
});

test('when the database and the failure alert both fail, the customer is told to call', async () => {
  dbMode = 'fail';
  mailMode = 'fail';
  const res = await post(move());
  assert.equal(res.statusCode, 502);
  assert.match(res.body.error, /\+358 50 357 2836/);
});

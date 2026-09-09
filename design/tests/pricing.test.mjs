import test from 'node:test';
import assert from 'node:assert/strict';

import { quote, premiumsFor, PRODUCTS, WAITING, PREMIUMS, CANCELLATION } from '../api/_lib/pricing.js';

/* A Tuesday and a Saturday at 10:00 Helsinki time, expressed in UTC so the
   test says the same thing on a CI box in another zone. Finland is UTC+3 in
   September (EEST), so 07:00Z is 10:00 local. */
const TUE_10 = new Date('2026-09-08T07:00:00Z');
const SAT_10 = new Date('2026-09-12T07:00:00Z');
const TUE_23 = new Date('2026-09-08T20:00:00Z');   // 23:00 local
const XMAS_10 = new Date('2026-12-25T08:00:00Z');  // 10:00 local, UTC+2 in winter
const WEEK_EARLIER = new Date('2026-09-01T07:00:00Z');

test('a standard run is priced from the published starting price', () => {
  const q = quote({ product: 'inspection', when: TUE_10, now: WEEK_EARLIER });
  assert.equal(q.quoteOnly, false);
  assert.equal(q.from, PRODUCTS.inspection.from);
  assert.equal(q.total, 119);
  assert.equal(q.indicative, true);
});

test('there is no distance surcharge anywhere in the quote', () => {
  const q = quote({ product: 'pickupReturn', when: TUE_10, now: WEEK_EARLIER });
  // The §12 audit removed the "beyond the metro area" charge outright: a long
  // route becomes a manual fixed quote, never a per-kilometre add-on.
  assert.deepEqual(q.lines.map((l) => l.key), ['base']);
  assert.equal(q.total, PRODUCTS.pickupReturn.from);
});

test('a route outside the launch service area becomes a manual fixed quote', () => {
  const q = quote({ product: 'oneWay', outsideArea: true, when: TUE_10, now: WEEK_EARLIER });
  assert.equal(q.quoteOnly, true);
  assert.equal(q.total, null);
  assert.equal(q.from, null);
});

test('quote-only products never invent a total', () => {
  for (const key of ['designated', 'longDistance', 'corporate']) {
    const q = quote({ product: key, when: TUE_10, now: WEEK_EARLIER });
    assert.equal(q.quoteOnly, true, key);
    assert.equal(q.total, null, key);
  }
});

test('personal driver bills the hourly rate and never below the minimum', () => {
  const short = quote({ product: 'personalDriver', hours: 1, when: TUE_10, now: WEEK_EARLIER });
  assert.equal(short.total, PRODUCTS.personalDriver.minHours * PRODUCTS.personalDriver.from);

  const long = quote({ product: 'personalDriver', hours: 3.2, when: TUE_10, now: WEEK_EARLIER });
  // rounded up to the next half hour
  assert.equal(long.lines[0].hours, 3.5);
  assert.equal(long.total, 3.5 * PRODUCTS.personalDriver.from);
});

test('waiting is free up to the included allowance, then billed in 30-minute units', () => {
  const inside = quote({ product: 'serviceRun', waitMinutes: WAITING.includedMinutes, when: TUE_10, now: WEEK_EARLIER });
  assert.equal(inside.total, PRODUCTS.serviceRun.from);

  const over = quote({ product: 'serviceRun', waitMinutes: WAITING.includedMinutes + 10, when: TUE_10, now: WEEK_EARLIER });
  const waitLine = over.lines.find((l) => l.key === 'waiting');
  assert.equal(waitLine.minutes, 30, 'part of a unit bills the whole unit');
  assert.equal(waitLine.amount, 17.5);
});

test('wait-and-return includes a full hour before waiting is billed', () => {
  const q = quote({ product: 'waitReturn', waitMinutes: WAITING.waitReturnIncludedMinutes, when: TUE_10, now: WEEK_EARLIER });
  assert.equal(q.total, PRODUCTS.waitReturn.from);
  assert.equal(q.lines.some((l) => l.key === 'waiting'), false);
});

test('night, weekend, holiday and urgency are recognised as premiums', () => {
  assert.deepEqual(premiumsFor(TUE_23, WEEK_EARLIER).map((p) => p.key), ['night']);
  assert.deepEqual(premiumsFor(SAT_10, WEEK_EARLIER).map((p) => p.key), ['weekend']);
  assert.deepEqual(premiumsFor(XMAS_10, WEEK_EARLIER).map((p) => p.key), ['publicHoliday']);

  // Fixed instants, not Date.now(): a job two hours from "now" is also a night
  // job when the suite runs after 20:00, and only the highest premium survives.
  const TUE_14 = new Date('2026-09-08T11:00:00Z');        // Tue 14:00 local
  const FOUR_HOURS_EARLIER = new Date('2026-09-08T07:00:00Z');
  assert.deepEqual(premiumsFor(TUE_14, FOUR_HOURS_EARLIER).map((p) => p.key), ['urgent']);
  assert.deepEqual(premiumsFor(TUE_14, WEEK_EARLIER), [], 'a booked-ahead weekday daytime job carries no premium');
});

test('premiums do not stack — only the highest single one is charged', () => {
  // A Saturday night is both weekend and night; the customer pays one premium.
  const satNight = new Date('2026-09-12T20:00:00Z');  // Sat 23:00 local
  const applied = premiumsFor(satNight, WEEK_EARLIER);
  assert.equal(applied.length, 1);
  assert.equal(applied[0].key, 'night');
  assert.equal(applied[0].pct, PREMIUMS.night.pct);

  const q = quote({ product: 'serviceRun', when: satNight, now: WEEK_EARLIER });
  const premiumLines = q.lines.filter((l) => l.key === 'premium');
  assert.equal(premiumLines.length, 1);
  assert.equal(q.total, 99 + 99 * PREMIUMS.night.pct / 100);
});

test('the premium applies after waiting, so it is a premium on the whole job', () => {
  const q = quote({ product: 'serviceRun', waitMinutes: 45, when: TUE_23, now: WEEK_EARLIER });
  const wait = q.lines.find((l) => l.key === 'waiting').amount;
  const premium = q.lines.find((l) => l.key === 'premium').amount;
  // Rounded to cents: a price the customer sees must be payable.
  const raw = (PRODUCTS.serviceRun.from + wait) * PREMIUMS.night.pct / 100;
  assert.equal(raw, 29.125);
  assert.equal(premium, 29.13);
  assert.equal(q.total, PRODUCTS.serviceRun.from + wait + premium);
});

test('cancellation terms match what the pages publish', () => {
  assert.equal(CANCELLATION.freeBeforeHours, 24);
  assert.equal(CANCELLATION.lateFeePct, 50);
});

test('every product either has a starting price or is explicitly quote-only', () => {
  for (const [key, p] of Object.entries(PRODUCTS)) {
    assert.equal(
      p.quote === true || typeof p.from === 'number',
      true,
      `${key} must have a price or be quote-only`,
    );
    if (p.quote) assert.equal(p.from, null, `${key} must not carry a price it does not honour`);
  }
});

/**
 * DriveMe pricing - the single source of truth for §5 of the growth strategy.
 *
 * Both the published price list and the server-side quote import this module,
 * so a page can never advertise a number the API does not charge. That drift
 * is exactly what the §12 audit found on the old site (a €10 "beyond metro"
 * line that never reached the total, a €24 demo fare under a €105 minimum,
 * and a €100/month subscription that valued driver time below the list rate).
 *
 * Two rules the document is explicit about, both enforced below:
 *
 *  1. No geographic surcharge input. The customer never calculates kilometres
 *     "outside a boundary". A route the service area does not cover becomes a
 *     manual fixed quote, not a surcharge the customer has to compute.
 *
 *  2. What we show before confirmation is INDICATIVE. §5: "If instant pricing
 *     is not reliable, display an indicative 'from' price and promise manual
 *     confirmation, not a fake total." Everything here produces a `from`
 *     figure plus disclosed premium lines; the fixed fee is set by a human in
 *     /admin before the job is confirmed.
 *
 * OWNER DECISION PENDING (§13.1): the premium percentages and the waiting
 * rate below are the document's recommended launch structure, but the final
 * numbers need driver and support-vehicle cost modelling. They are collected
 * here so the owner changes them in one place - never in page copy.
 */

export const VAT_INCLUDED = true;         // §5: consumer prices shown incl. VAT
export const CURRENCY = 'EUR';

/**
 * §5 recommended launch prices. `from` is a starting price, never a total.
 * `quote: true` means the product has no starting price at all and always
 * goes to a manual fixed quote.
 */
export const PRODUCTS = {
  oneWay: { from: 59, quote: false, unit: 'job' },
  pickupReturn: { from: 99, quote: false, unit: 'job' },
  waitReturn: { from: 119, quote: false, unit: 'job' },
  inspection: { from: 119, quote: false, unit: 'job' },
  serviceRun: { from: 99, quote: false, unit: 'job' },
  airport: { from: 129, quote: false, unit: 'job' },
  personalDriver: { from: 39, quote: false, unit: 'hour', minHours: 2 },
  designated: { from: null, quote: true, unit: 'job' },
  longDistance: { from: null, quote: true, unit: 'job' },
  corporate: { from: null, quote: true, unit: 'contract' },
};

/** Waiting rules (§5). */
export const WAITING = {
  // Included at each handover on every product - covers a normal reception desk.
  includedMinutes: 15,
  // "Wait and return": collection, up to 60 min wait, return.
  waitReturnIncludedMinutes: 60,
  // Beyond the allowance, billed in 30-minute units.
  hourlyRate: 35,
  unitMinutes: 30,
};

/**
 * Disclosed premiums (§5: "Keep urgent, weekend, public-holiday and night
 * work as clearly disclosed premiums"). Percentages of the DriveMe fee.
 */
export const PREMIUMS = {
  night: { pct: 25, fromHour: 22, toHour: 6 },
  weekend: { pct: 15 },
  publicHoliday: { pct: 25 },
  urgent: { pct: 25, withinHours: 12 },
};

/** §5 cancellation recommendation, in machine-readable form. */
export const CANCELLATION = {
  freeBeforeHours: 24,
  lateFeePct: 50,
  // After dispatch: base fee + incurred time/parking/travel, capped in terms.
  afterDispatch: 'base_plus_incurred',
};

/**
 * Finnish public holidays that fall on a fixed date. Moving feasts (Easter,
 * Midsummer, Ascension) are deliberately not computed here: the indicative
 * quote must never be *more* than the confirmed fee, so a missed holiday
 * simply means ops adds the premium when confirming.
 */
const FIXED_HOLIDAYS = ['01-01', '05-01', '12-06', '12-24', '12-25', '12-26'];

export const SERVICE_TZ = 'Europe/Helsinki';

/** Wall-clock parts of an instant in the service timezone. */
export function serviceParts(date) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: SERVICE_TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false,
  });
  const p = Object.fromEntries(fmt.formatToParts(date).map((x) => [x.type, x.value]));
  return {
    date: `${p.year}-${p.month}-${p.day}`,
    monthDay: `${p.month}-${p.day}`,
    hour: Number(p.hour === '24' ? '0' : p.hour),
    minute: Number(p.minute),
    weekday: p.weekday,                       // Mon, Tue, ...
  };
}

/**
 * Which premiums apply to a job.
 * @param {Date} when     scheduled pickup
 * @param {Date} [now]    when the request is made (for the urgency premium)
 */
export function premiumsFor(when, now = new Date()) {
  const out = [];
  if (!(when instanceof Date) || Number.isNaN(when.getTime())) return out;
  const p = serviceParts(when);

  if (p.hour >= PREMIUMS.night.fromHour || p.hour < PREMIUMS.night.toHour) {
    out.push({ key: 'night', pct: PREMIUMS.night.pct });
  }
  if (p.weekday === 'Sat' || p.weekday === 'Sun') {
    out.push({ key: 'weekend', pct: PREMIUMS.weekend.pct });
  }
  if (FIXED_HOLIDAYS.includes(p.monthDay)) {
    out.push({ key: 'publicHoliday', pct: PREMIUMS.publicHoliday.pct });
  }
  const leadHours = (when.getTime() - now.getTime()) / 3600000;
  if (leadHours >= 0 && leadHours < PREMIUMS.urgent.withinHours) {
    out.push({ key: 'urgent', pct: PREMIUMS.urgent.pct });
  }
  // A job can qualify for several; charge the single highest rather than
  // stacking them into a number no customer would accept.
  if (out.length <= 1) return out;
  return [out.reduce((a, b) => (b.pct > a.pct ? b : a))];
}

/**
 * The indicative DriveMe fee for a request.
 *
 * @param {object} input
 * @param {string} input.product      key of PRODUCTS
 * @param {number} [input.hours]      personal-driver hours
 * @param {number} [input.waitMinutes] expected waiting the customer asked for
 * @param {Date}   [input.when]       scheduled pickup
 * @param {boolean}[input.outsideArea] route leaves the launch service area
 * @param {Date}   [input.now]
 * @returns {{quoteOnly:boolean, from:number|null, lines:Array, total:number|null, indicative:true}}
 */
export function quote(input) {
  const product = PRODUCTS[input.product];
  if (!product) throw new Error(`unknown product: ${input.product}`);

  // Outside the launch service area, or a product that has no list price:
  // one manual fixed quote, never a computed guess. (§5)
  if (product.quote || input.outsideArea) {
    return { quoteOnly: true, from: null, lines: [], total: null, indicative: true };
  }

  const lines = [];
  let base;
  if (product.unit === 'hour') {
    const hours = Math.max(product.minHours || 1, Math.ceil((input.hours || 0) * 2) / 2);
    base = hours * product.from;
    lines.push({ key: 'driverTime', hours, rate: product.from, amount: base });
  } else {
    base = product.from;
    lines.push({ key: 'base', product: input.product, amount: base });
  }

  // Waiting the customer has already asked for, beyond what the product includes.
  const included = input.product === 'waitReturn'
    ? WAITING.waitReturnIncludedMinutes
    : WAITING.includedMinutes;
  const extraWait = Math.max(0, (input.waitMinutes || 0) - included);
  if (extraWait > 0) {
    const units = Math.ceil(extraWait / WAITING.unitMinutes);
    const amount = round2(units * (WAITING.hourlyRate * (WAITING.unitMinutes / 60)));
    lines.push({ key: 'waiting', minutes: units * WAITING.unitMinutes, amount });
    base += amount;
  }

  const premiums = premiumsFor(input.when, input.now);
  for (const pr of premiums) {
    const amount = round2((base * pr.pct) / 100);
    lines.push({ key: 'premium', premium: pr.key, pct: pr.pct, amount });
  }

  const total = round2(lines.reduce((sum, l) => sum + l.amount, 0));
  return { quoteOnly: false, from: product.from, lines, total, indicative: true };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

/** Which product a service key uses by default, and which options it allows. */
export const SERVICE_PRODUCTS = {
  inspection: { default: 'inspection', allowed: ['inspection', 'oneWay', 'pickupReturn', 'waitReturn'] },
  workshop: { default: 'serviceRun', allowed: ['serviceRun', 'oneWay', 'pickupReturn', 'waitReturn'] },
  tyre: { default: 'serviceRun', allowed: ['serviceRun', 'oneWay', 'pickupReturn', 'waitReturn'] },
  wash: { default: 'serviceRun', allowed: ['serviceRun', 'oneWay', 'pickupReturn', 'waitReturn'] },
  glass: { default: 'serviceRun', allowed: ['serviceRun', 'oneWay', 'pickupReturn'] },
  pickupReturn: { default: 'pickupReturn', allowed: ['pickupReturn', 'oneWay', 'waitReturn'] },
  relocation: { default: 'oneWay', allowed: ['oneWay', 'longDistance'] },
  dealer: { default: 'oneWay', allowed: ['oneWay', 'pickupReturn'] },
  personalDriver: { default: 'personalDriver', allowed: ['personalDriver'] },
  safeRideHome: { default: 'designated', allowed: ['designated'] },
  airport: { default: 'airport', allowed: ['airport'] },
  business: { default: 'corporate', allowed: ['corporate'] },
};

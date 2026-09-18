/**
 * DriveMe pricing - the single source of truth for every published price.
 *
 * Both the published price list and the server-side quote import this module,
 * so a page can never advertise a number the API does not charge. That drift
 * is exactly what the §12 audit found on the old site (a €10 "beyond metro"
 * line that never reached the total, a €24 demo fare under a €105 minimum,
 * and a €100/month subscription that valued driver time below the list rate).
 *
 * Prices follow the pricing test in "DriveMe: A Driver for Your Car" (Driver
 * First Growth Plan, 13 Sep 2026), VAT included:
 *
 *   one-way move                      from 89 €  (typically 99-129 €)
 *   workshop / tyre / wash, return    from 149 € (typically 149-199 €)
 *   inspection, wait and return       from 169 €
 *   dealer or lease handover          from 99 €
 *
 * Two rules the strategy is explicit about, both enforced below:
 *
 *  1. No geographic surcharge input. The customer never calculates kilometres
 *     "outside a boundary". A route the service area does not cover becomes a
 *     manual fixed quote, not a surcharge the customer has to compute.
 *
 *  2. What we show before confirmation is INDICATIVE: a `from` figure plus
 *     disclosed premium lines. The fixed fee is set by a human in /admin
 *     before the job is confirmed.
 *
 * OWNER DECISION PENDING: these are test prices. The plan asks for them to be
 * reviewed against real demand; change them here and nowhere else.
 */

export const VAT_INCLUDED = true;         // consumer prices shown incl. VAT
export const CURRENCY = 'EUR';

/**
 * `from` is a starting price, never a total. `typical` is the range most jobs
 * land in, published so a starting price cannot read as a bait figure.
 * `quote: true` means the product has no starting price at all and always
 * goes to a manual fixed quote.
 *
 * Journeys with the customer in the car are quoted per route rather than
 * priced from a list.
 */
export const PRODUCTS = {
  oneWay: { from: 89, typical: [99, 129], quote: false, unit: 'job' },
  pickupReturn: { from: 149, typical: [149, 199], quote: false, unit: 'job' },
  waitReturn: { from: 169, quote: false, unit: 'job' },
  inspection: { from: 169, quote: false, unit: 'job' },
  serviceRun: { from: 149, typical: [149, 199], quote: false, unit: 'job' },
  handover: { from: 99, quote: false, unit: 'job' },
  // A journey with the customer in the car: route, duration and driver
  // logistics differ too much for a list price, so every one is quoted.
  journey: { from: null, quote: true, unit: 'job' },
  longDistance: { from: null, quote: true, unit: 'job' },
  corporate: { from: null, quote: true, unit: 'contract' },
};

/** Waiting rules. */
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
 * Disclosed premiums, as percentages of the DriveMe fee. They never stack:
 * a job that qualifies for several pays only the highest one.
 */
export const PREMIUMS = {
  night: { pct: 25, fromHour: 22, toHour: 6 },
  weekend: { pct: 15 },
  publicHoliday: { pct: 25 },
  urgent: { pct: 25, withinHours: 12 },
};

/** Cancellation terms, in machine-readable form. */
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
  // one manual fixed quote, never a computed guess.
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
  const included = input.product === 'waitReturn' || input.product === 'inspection'
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

/**
 * The service catalogue as the booking flow and the API see it.
 *
 * `type` is the plan's split of what is sold now:
 *   general_move    "Aja autoni toiseen osoitteeseen" - address to address
 *   appointment_run "Vie autoni palveluun" - to an inspection, workshop,
 *                   tyre shop, wash, body shop or dealer
 *   passenger       the customer and their passengers travel in the car,
 *                   driven by us - quoted per route
 *   business        contract lead, priced by quote
 *
 * `shapes` maps each trip shape the customer can pick to the product that
 * prices it; `defaultShape` is preselected. The server derives the product
 * from service + shape through productFor(), so a browser can never choose a
 * cheaper product than the shape it asked for.
 */
const SERVICES = {
  inspection: {
    type: 'appointment_run', defaultShape: 'waitReturn',
    shapes: { waitReturn: 'inspection', pickupReturn: 'pickupReturn', oneWay: 'oneWay' },
  },
  workshop: {
    type: 'appointment_run', defaultShape: 'pickupReturn',
    shapes: { pickupReturn: 'serviceRun', waitReturn: 'waitReturn', oneWay: 'oneWay' },
  },
  tyre: {
    type: 'appointment_run', defaultShape: 'pickupReturn',
    shapes: { pickupReturn: 'serviceRun', waitReturn: 'waitReturn', oneWay: 'oneWay' },
  },
  wash: {
    type: 'appointment_run', defaultShape: 'pickupReturn',
    shapes: { pickupReturn: 'serviceRun', waitReturn: 'waitReturn', oneWay: 'oneWay' },
  },
  glass: {
    type: 'appointment_run', defaultShape: 'pickupReturn',
    shapes: { pickupReturn: 'serviceRun', oneWay: 'oneWay' },
  },
  dealer: {
    type: 'appointment_run', defaultShape: 'oneWay',
    shapes: { oneWay: 'handover', pickupReturn: 'pickupReturn' },
  },
  relocation: {
    type: 'general_move', defaultShape: 'oneWay',
    shapes: { oneWay: 'oneWay' },
  },
  pickupReturn: {
    type: 'general_move', defaultShape: 'pickupReturn',
    shapes: { pickupReturn: 'pickupReturn' },
  },
  journey: { type: 'passenger', defaultShape: null, shapes: {}, product: 'journey' },
  personalDriver: { type: 'passenger', defaultShape: null, shapes: {}, product: 'journey' },
  safeRideHome: { type: 'passenger', defaultShape: null, shapes: {}, product: 'journey' },
  airport: { type: 'passenger', defaultShape: null, shapes: {}, product: 'journey' },
  business: { type: 'business', defaultShape: null, shapes: {}, product: 'corporate' },
};

/** The product that prices a service in a given shape (default shape when unknown). */
export function productFor(service, shape) {
  const s = SERVICES[service];
  if (!s) return null;
  if (s.product) return s.product;
  return s.shapes[shape] || s.shapes[s.defaultShape];
}

/**
 * Per-service summary used by the pages: `default` is the product behind the
 * published "from" price, `allowed` every product the service can be priced
 * as, `shapes` the choices the booking form offers.
 */
export const SERVICE_PRODUCTS = Object.fromEntries(Object.entries(SERVICES).map(([key, s]) => {
  const def = productFor(key, s.defaultShape);
  return [key, {
    type: s.type,
    default: def,
    defaultShape: s.defaultShape,
    shapes: { ...s.shapes },
    allowed: [...new Set([def, ...Object.values(s.shapes)])],
  }];
}));

/** Service keys by type, in catalogue order. */
export function servicesOfType(type) {
  return Object.keys(SERVICES).filter((k) => SERVICES[k].type === type);
}

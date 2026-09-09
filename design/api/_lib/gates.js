/**
 * Launch gates (§6.1) — the one place that decides whether a service may be
 * promised, published as bookable, or accepted by the API.
 *
 * The growth strategy's implementation principle: "Every published promise
 * must match an operational reality. If live tracking, instant assignment,
 * background checking, a payment method or insurance cover is not active and
 * documented, describe it as planned or remove it."
 *
 * Flipping a flag to `live: true` changes three things at once — the service
 * page stops showing the awaiting-clearance notice, the request form stops
 * refusing the service, and the API starts accepting it. So flip it only when
 * the written evidence named below is on file.
 */

export const launchGates = {
  // Gate A — Traficom: commercial passenger transport by passenger car needs a
  // taxi transport licence, a taxi driving licence and a vehicle registered
  // for licensed operation. The open question is how that applies to carrying
  // a paying customer in that customer's own privately registered car.
  passengerTransport: {
    live: false,
    evidence: 'Written Traficom + insurer confirmation on paid passenger transport in the customer\'s own car',
  },
  // Gate B — the statutory motor liability policy does not compensate damage
  // to the insured vehicle itself. Needs explicit cover for vehicles driven or
  // held, lost keys, theft, parking incidents and custody exposure.
  custodyInsurance: {
    live: false,
    evidence: 'Policy wording covering driven/held customer vehicles, keys, theft and custody',
  },
  // Gate C — exactly which driver checks can lawfully be obtained and retained.
  driverScreening: {
    live: false,
    evidence: 'Counsel and data-protection approved list of documented checks',
  },
  // Gate D — Finnish counsel review of the consumer terms.
  consumerTerms: {
    live: false,
    evidence: 'Counsel sign-off on distance-selling information, cancellation and liability',
  },
};

/**
 * Which gate each service depends on. A service absent from this map has no
 * gate and is bookable today.
 *
 * Note what is NOT here: the vehicle concierge services. Driving a customer's
 * car with nobody in it is not passenger transport, so Gate A does not block
 * them. Gate B (custody cover) is a commercial risk the owner carries at
 * launch rather than a legal bar, and the site says so on /turvallisuus/
 * instead of pretending to be insured.
 */
export const SERVICE_GATES = {
  personalDriver: 'passengerTransport',
  safeRideHome: 'passengerTransport',
  airport: 'passengerTransport',
};

/** True when this service must not be sold yet. */
export function isServiceGated(serviceKey) {
  const gate = SERVICE_GATES[serviceKey];
  return Boolean(gate) && launchGates[gate].live === false;
}

/* DriveMe — booking.js
   The quote form: three steps, and a step 2 that changes with the service.

   A journey is asked how many are travelling; a transfer is asked for the
   registration and whether the car is roadworthy; a service transfer is asked
   for the appointment and whether the car comes back. Nobody is asked all
   three, and nothing hidden is ever validated or sent.

   No price is calculated here. The quote is written by a person who has read
   the enquiry, which is why the form collects enough to write one. */
(function () {
  'use strict';

  var node = document.getElementById('booking-config');
  var form = document.getElementById('request-form');
  if (!node || !form) return;

  var CFG = JSON.parse(node.textContent);
  /* Demo bundles (build/demo-bundle.mjs) inject <meta name="driveme-demo">.
     Those deploys are static — there is no /api/bookings behind them — so the
     flow completes locally instead of failing at the last step. The meta is
     never present on a real deploy, so production always posts for real. */
  var DEMO = !!document.querySelector('meta[name="driveme-demo"]');
  var C = CFG.copy;

  var $ = function (id) { return document.getElementById(id); };
  var shell = $('enquiry-shell');
  var serviceSel = $('service');
  var errorSummary = $('error-summary');
  var submitBtn = $('submit-btn');
  var submitLabel = submitBtn.innerHTML;
  var donePanel = $('done-panel');

  // Set when a link asks for a service that is not sold yet.
  var gatedKey = null;
  // Which part of the site sent the visitor here, for lead_source.
  var entry = null;
  var touched = {};

  /* ---------------------------------------------------------- helpers */
  function show(el, on) { if (el) el.hidden = !on; }
  function val(id) { var e = $(id); return e ? String(e.value || '').trim() : ''; }
  function checked(id) { var e = $(id); return !!(e && e.checked); }

  /**
   * A service that is not sold cannot be enquired about, so the fields are put
   * away and a notice explains why. Done with a class rather than by hiding
   * each node, so nothing has to be put back one by one.
   */
  function enterGated(key) {
    gatedKey = key;
    var warn = $('gate-warning');
    warn.innerHTML = '<div class="callout warn"><h3>' + C.gatedTitle + '</h3><p>' + C.gatedBody + '</p></div>';
    show(warn, true);
    form.classList.add('is-gated');
    submitBtn.disabled = true;
  }

  function leaveGated() {
    if (!gatedKey) return;
    gatedKey = null;
    $('gate-warning').innerHTML = '';
    show($('gate-warning'), false);
    form.classList.remove('is-gated');
    submitBtn.disabled = false;
  }

  /* ------------------------------------------- what this service needs */
  function serviceType() {
    var s = CFG.services[serviceSel.value];
    return s ? s.type : null;                 // null for "" and for "other"
  }

  /* A company name is what turns this into a company enquiry, so the rest of
     the company questions appear the moment one is typed - and stay open for
     the corporate service, which is nothing but a company enquiry. */
  function companyWanted() {
    return serviceSel.value === 'business' || !!val('company_name');
  }

  /**
   * Shows the one group of questions this service needs and hides the others.
   * Required-ness follows visibility: a hidden field is never demanded, never
   * marked with an asterisk and never sent.
   */
  function syncService() {
    var type = serviceType();
    var journey = type === 'passenger';
    var move = type === 'general_move';
    var appointment = type === 'appointment_run';
    // A corporate enquiry or "something else" has no single route to describe,
    // so step 2 stays available but stops insisting on one.
    var routed = journey || move || appointment;

    show($('journey-fields'), journey);
    show($('move-fields'), move);
    show($('appointment-fields'), appointment);
    show($('business-fields'), companyWanted());

    $('pickup_location').required = routed;
    $('destination').required = routed;
    $('date').required = routed;
    // The car is the job in every one of these services, including a journey:
    // the driver drives that car, so its transmission decides who is sent.
    $('vehicle_details').required = routed;
    $('passengers').required = journey;

    // A journey ends somewhere rather than delivering a car to an address.
    var destLabel = form.querySelector('label[for="destination"]');
    if (destLabel) {
      destLabel.firstChild.nodeValue = journey ? C.destinationJourney : C.destination;
    }
    var legend = form.querySelector('#step-2-legend');
    if (legend) legend.lastChild.nodeValue = journey ? C.step2Journey : C.step2;

    syncRequiredMarks();
    // Re-check what is on screen now: a field that has just been hidden must
    // stop being an error, and one just revealed must not be marked yet.
    collectProblems('touched');
  }

  /* The asterisks follow the live requirement, not the markup. */
  function syncRequiredMarks() {
    form.querySelectorAll('.req').forEach(function (m) {
      var el = $(m.getAttribute('data-for'));
      m.hidden = !(el && el.required);
    });
  }

  /* ------------------------------------------------------- validation */
  function setError(id, message) {
    var input = $(id);
    var err = $(id + '-err');
    if (err) err.textContent = message || '';
    if (input) {
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
      // The label turns red with the border: colour alone never carries the
      // message, but it is what makes a missing field findable at a glance.
      var wrap = input.closest ? input.closest('.field') : null;
      if (wrap) wrap.classList.toggle('has-error', !!message);
    }
  }

  function clearAllErrors() {
    form.querySelectorAll('.err').forEach(function (el) {
      setError(el.id.replace(/-err$/, ''), '');
    });
  }

  function labelFor(el) {
    if (!el) return '';
    var lab = form.querySelector('label[for="' + el.id + '"]');
    // The label carries the required asterisk; the checklist does not need it.
    return lab ? lab.textContent.replace(/\*\s*$/, '').trim() : el.id;
  }

  /** On screen, and therefore the visitor's problem to fix. */
  function visible(el) {
    return !!(el && el.offsetParent !== null && !el.disabled);
  }

  function today() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  /**
   * Everything still standing between the visitor and a sent enquiry. `mark`
   * decides whether the fields are painted red as well: 'touched' marks only
   * the ones the visitor has already left, so the page never opens accusing
   * someone of not filling in a form they have just arrived at.
   */
  function collectProblems(mark) {
    var problems = [];
    var note = function (el, msg) {
      if (mark === true || (mark === 'touched' && touched[el.id])) setError(el.id, msg);
      problems.push({ id: el.id, label: labelFor(el) });
    };

    // Errors also arrive from the API, on fields this pass never looks at, so
    // the slate is wiped first or they would stick for good.
    if (mark) clearAllErrors();

    form.querySelectorAll('input[required], select[required]').forEach(function (el) {
      if (!visible(el)) return;
      if (!String(el.value || '').trim()) note(el, C.required);
    });

    if (val('customer_email') && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val('customer_email'))) {
      note($('customer_email'), C.badEmail);
    }
    if (val('customer_phone') && val('customer_phone').replace(/\D/g, '').length < 6) {
      note($('customer_phone'), C.badPhone);
    }
    // A date in the past is a typo, not a booking.
    if (val('date') && visible($('date'))) {
      var parts = val('date').split('-');
      var picked = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      if (picked < today()) note($('date'), C.badDate);
    }
    form.querySelectorAll('input[type="number"]').forEach(function (el) {
      if (!visible(el) || !String(el.value || '').trim()) return;
      var n = parseFloat(el.value);
      var min = el.getAttribute('min');
      var max = el.getAttribute('max');
      if (isNaN(n) || (min !== null && n < +min) || (max !== null && n > +max)) note(el, C.badRange);
    });

    return problems;
  }

  function problemList(problems) {
    return problems.map(function (p) {
      return '<li><a href="#' + p.id + '">' + p.label + '</a></li>';
    }).join('');
  }

  function validate() {
    var problems = collectProblems(true);
    form.querySelectorAll('input[id], select[id], textarea[id]').forEach(function (el) {
      touched[el.id] = true;
    });
    if (problems.length) {
      errorSummary.querySelector('ul').innerHTML = problemList(problems);
      show(errorSummary, true);
      errorSummary.focus();
    } else {
      show(errorSummary, false);
    }
    return problems.length === 0;
  }

  /* ------------------------------------------------------ lead source */
  /* site.js records how the visit started (campaign tags, referring site,
     landing page) in sessionStorage; this page adds which button sent the
     visitor to the form. Blocked storage costs the attribution, never the
     enquiry. */
  function leadSource() {
    var parts = [];
    try {
      var saved = JSON.parse(sessionStorage.getItem('dm_src') || 'null');
      if (saved) {
        if (saved.utm) parts.push('utm:' + saved.utm);
        if (saved.click) parts.push('click:' + saved.click);
        if (saved.ref) parts.push('ref:' + saved.ref);
        if (saved.landing) parts.push('landing:' + saved.landing);
      }
    } catch (e) { /* storage unavailable */ }
    if (entry) parts.push('entry:' + entry);
    return parts.length ? parts.join(' | ').slice(0, 300) : 'direct';
  }

  /* ----------------------------------------------------------- submit */
  function payload() {
    var type = serviceType();
    var journey = type === 'passenger';
    var move = type === 'general_move';
    var appointment = type === 'appointment_run';
    var company = val('company_name');
    var date = val('date');
    var time = val('time');

    // Only what this service actually asked. A hidden field keeps whatever it
    // happened to hold, and sending that would describe a job nobody ordered.
    return {
      language: CFG.locale,
      service: serviceSel.value,
      pickup_location: val('pickup_location') || null,
      destination: val('destination') || null,
      // A naive local datetime; the server reads it as Helsinki wall-clock.
      scheduled_for: date ? date + 'T' + (time || '09:00') : null,
      vehicle_details: val('vehicle_details') || null,
      vehicle_plate: move ? (val('vehicle_plate') || null) : null,
      // Only a move asks, so only a move can answer. Unchecked is a real
      // answer - it is how ops knows to offer a towing partner instead of a
      // driver. The sentence is sent as well as the flag, so the fact still
      // reaches ops on a database that has not had migration 0012 yet.
      roadworthy: move ? checked('roadworthy') : null,
      vehicle_notes: move && !checked('roadworthy')
        ? 'Customer says the car is NOT roadworthy or is off the road' : null,
      appointment_time: appointment ? (val('appointment_time') || null) : null,
      return_needed: appointment ? val('return_needed') === 'yes' : null,
      shape: appointment ? (val('return_needed') === 'yes' ? 'pickupReturn' : 'oneWay') : null,
      // A move carries nobody; a journey carries the people who asked for it.
      passenger_count: journey ? (parseInt(val('passengers'), 10) || 1) : 0,
      extra_stops: journey ? (val('extra_stops') || null) : null,
      customer_name: val('customer_name'),
      customer_phone: val('customer_phone'),
      customer_email: val('customer_email'),
      customer_type: company ? 'company' : 'person',
      company_name: company || null,
      business_id: company ? (val('business_id') || null) : null,
      volume: company ? (val('volume') || null) : null,
      recurrence: company ? (val('recurrence') || null) : null,
      notes: val('notes') || null,
      offer_code: val('offer_code').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20) || null,
      lead_source: leadSource(),
    };
  }

  function finish(reference) {
    show(shell, false);
    // Labelled, in the page's language: a bare code on its own line reads
    // like an error, and the customer quotes this on the phone.
    $('done-ref').textContent = C.doneRef + ': ' + reference;
    show(donePanel, true);
    donePanel.focus();
    donePanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function sending(on) {
    submitBtn.disabled = on;
    submitBtn.innerHTML = on ? C.submitting : submitLabel;
    submitBtn.classList.toggle('is-busy', on);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (gatedKey) return;
    if (!validate()) return;

    sending(true);

    if (DEMO) {
      finish('DEMO-' + String(Date.now()).slice(-6));
      sending(false);
      return;
    }

    fetch(CFG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload()),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (!res.ok || !res.data.success) {
          if (res.data && res.data.field) setError(res.data.field, res.data.error || C.failed);
          throw new Error((res.data && res.data.error) || C.failed);
        }
        finish(res.data.reference);
      })
      .catch(function (err) {
        // Everything the visitor typed stays exactly where it is: an error
        // must never cost somebody the form they have just filled in.
        errorSummary.querySelector('ul').innerHTML = '<li>' + (err.message || C.failed) + '</li>';
        show(errorSummary, true);
        errorSummary.focus();
      })
      .finally(function () { sending(false); });
  });

  var again = $('again-btn');
  if (again) {
    again.addEventListener('click', function () {
      form.reset();
      touched = {};
      clearAllErrors();
      leaveGated();
      show(errorSummary, false);
      show(shell, true);
      show(donePanel, false);
      syncService();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ------------------------------------------------------------ wiring */
  serviceSel.addEventListener('change', function () { leaveGated(); syncService(); });
  var companyField = $('company_name');
  if (companyField) {
    companyField.addEventListener('input', function () { show($('business-fields'), companyWanted()); });
  }
  // Leaving a field is the moment its emptiness becomes a fact worth flagging.
  form.addEventListener('focusout', function (e) {
    if (!e.target || !e.target.id) return;
    touched[e.target.id] = true;
    collectProblems('touched');
  });
  // And typing in it is the moment it stops being one.
  form.addEventListener('input', function (e) {
    if (!e.target || !e.target.id) return;
    var err = $(e.target.id + '-err');
    if (err && err.textContent) collectProblems('touched');
  });

  var offerToggle = $('offer-toggle');
  if (offerToggle) {
    offerToggle.addEventListener('click', function () {
      var opening = $('offer-field').hidden;
      show($('offer-field'), opening);
      offerToggle.setAttribute('aria-expanded', String(opening));
      if (opening) $('offer_code').focus();
    });
  }

  // Today is the earliest sensible collection date.
  var dateInput = $('date');
  if (dateInput && !dateInput.min) dateInput.min = new Date().toISOString().slice(0, 10);

  /* Deep links from the homepage, the service pages and the campaign. Each
     language links in its own words, and every language's spelling is accepted
     here so a shared or edited link keeps working:
     /pyyda-tarjous/?palvelu=homeDelivery&nouto=00100&lahde=home_hero
     /en/request-a-quote/?service=homeDelivery
     /sv/begar-offert/?tjanst=homeDelivery&kalla=home_hero */
  var params = new URLSearchParams(location.search);
  var param = function () {
    for (var i = 0; i < arguments.length; i++) {
      var v = params.get(arguments[i]);
      if (v) return v;
    }
    return null;
  };
  var wantedPickup = param('nouto', 'pickup', 'hamtning');
  var wantedDate = param('pvm', 'date', 'datum');
  if (wantedPickup) $('pickup_location').value = wantedPickup.slice(0, 300);
  if (wantedDate && /^\d{4}-\d{2}-\d{2}$/.test(wantedDate)) $('date').value = wantedDate;

  var wanted = param('palvelu', 'service', 'tjanst');
  if (wanted && CFG.aliases && CFG.aliases[wanted]) wanted = CFG.aliases[wanted];
  var source = (param('lahde', 'source', 'kalla') || '').replace(/[^\w:-]/g, '').slice(0, 40);
  entry = source || (wanted ? 'service:' + String(wanted).replace(/[^\w-]/g, '').slice(0, 30) : null);

  /* A campaign code carried over from the offer page fills in the field the
     customer could also have typed themselves, and opens it so they can see
     it is there. The discount is applied when we quote. */
  var offerCode = (param('etu', 'offer', 'erbjudande') || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20);
  if (offerCode && $('offer_code')) {
    $('offer_code').value = offerCode;
    show($('offer-field'), true);
    if (offerToggle) offerToggle.setAttribute('aria-expanded', 'true');
  }

  /* The service the visitor pressed. Every button on the site names its own
     service and the dropdown holds exactly those values, so "Kotiintoimitus"
     can no longer open as "Yksittäinen siirto". A retired key resolves through
     the alias table above; anything still unrecognised becomes "Muu palvelu"
     rather than silently selecting the first option. */
  if (wanted) {
    var known = CFG.services[wanted];
    if (known && known.gated) {
      enterGated(wanted);
    } else if ([].some.call(serviceSel.options, function (o) { return o.value === wanted; })) {
      serviceSel.value = wanted;
    } else {
      serviceSel.value = 'other';
    }
  }

  syncService();
}());

/* DriveMe — booking.js
   The two-stage price request: a short first stage, optional details, an
   indicative estimate, an accessible error summary and the POST to
   /api/bookings. Three things can be asked for: a car move to an address, a
   run to a provider, or a journey with the customer in the car (quoted).

   The estimate mirrors api/_lib/pricing.js, whose constants are injected into
   the page as JSON at build time. The server derives the product from the
   service and trip shape itself and recomputes the figure before storing it,
   and the fee is not final until DriveMe confirms it. */
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
  var FI = CFG.locale === 'fi';

  var $ = function (id) { return document.getElementById(id); };
  var serviceSel = $('service');
  var quoteAmount = $('quote-amount');
  var quoteLines = $('quote-lines');
  var quoteNote = $('quote-note');
  var errorSummary = $('error-summary');
  var submitBtn = $('submit-btn');
  var submitHint = $('submit-hint');
  var donePanel = $('done-panel');

  // Set when a link asks for a service that is not sold (a passenger ride).
  var gatedKey = null;
  // Which part of the site sent the visitor here, for lead_source.
  var entry = null;

  /* ---------------------------------------------------------- helpers */
  function money(n) {
    return (Math.round(n * 100) / 100).toLocaleString(FI ? 'fi-FI' : 'en-GB', {
      minimumFractionDigits: 0, maximumFractionDigits: 2,
    }) + ' €';
  }
  function show(el, on) { if (el) el.hidden = !on; }
  function val(id) { var e = $(id); return e ? String(e.value || '').trim() : ''; }
  function checked(name) {
    var e = form.querySelector('input[name="' + name + '"]:checked');
    return e ? e.value : '';
  }
  function tick(name, value) {
    var r = form.querySelector('input[name="' + name + '"][value="' + value + '"]');
    if (r) r.checked = true;
  }

  /**
   * The owner's permission is a booking condition, not fine print. Until it is
   * ticked the request cannot be accepted, so the button stays inert rather
   * than letting the visitor submit into an error summary.
   */
  var ackBoxes = Array.prototype.slice.call(
    form.querySelectorAll('input[name="ack"]')
  );
  function acksComplete() {
    return ackBoxes.every(function (a) { return a.checked; });
  }
  function syncSubmitGate() {
    submitBtn.disabled = !!gatedKey || !acksComplete();
    if (!submitHint) return;
    // Naming what is outstanding, next to the button that will not fire yet,
    // so a disabled button reads as waiting rather than as broken.
    var problems = gatedKey ? [] : collectProblems('touched');
    if (!problems.length) {
      submitHint.innerHTML = '';
      show(submitHint, false);
      return;
    }
    submitHint.innerHTML = '<strong>' + C.submitLocked + '</strong><ul>' +
      problemList(problems) + '</ul>';
    show(submitHint, true);
  }

  /**
   * A service that is not sold cannot be requested, so collecting the request
   * is pointless and an indicative price would quote something we refuse to
   * sell. Strip the form back to the first choice plus the notice explaining
   * why. Done with a class rather than by toggling each element's `hidden`, so
   * the per-type visibility below survives switching back.
   */
  function gatedLayout(on) {
    form.classList.toggle('is-gated', !!on);
  }

  function enterGated(key) {
    gatedKey = key;
    var warn = $('gate-warning');
    warn.innerHTML = '<div class="callout warn"><h3>' + C.gatedTitle + '</h3><p>' + C.gatedBody + '</p></div>';
    show(warn, true);
    gatedLayout(true);
    // Clear the type choice: with "move" still pre-ticked, clicking it would
    // fire no change event and the visitor could never leave this notice.
    form.querySelectorAll('input[name="service_type"]').forEach(function (r) { r.checked = false; });
    syncSubmitGate();
  }

  function leaveGated() {
    if (!gatedKey) return;
    gatedKey = null;
    $('gate-warning').innerHTML = '';
    show($('gate-warning'), false);
    gatedLayout(false);
  }

  /* ------------------------------------------------ what is being asked */
  function currentType() {
    var t = checked('service_type');
    return t === 'appointment_run' || t === 'passenger_journey' ? t : 'general_move';
  }

  // Which passenger service a link asked for; the journey page is the default.
  var passengerKey = 'journey';

  // A general move is a relocation, or a pickup-and-return when the car has
  // to come back. An appointment run is whichever provider service was picked.
  function currentServiceKey() {
    var type = currentType();
    if (type === 'appointment_run') return serviceSel.value;
    if (type === 'passenger_journey') return passengerKey;
    return checked('return_needed') === 'yes' ? 'pickupReturn' : 'relocation';
  }

  function currentService() {
    return CFG.services[currentServiceKey()] || {};
  }

  function currentShape() {
    var s = currentService();
    if (currentType() === 'general_move') return s.defaultShape;
    var shape = checked('shape');
    return s.shapes && s.shapes[shape] ? shape : s.defaultShape;
  }

  function productKey() {
    var s = currentService();
    return (s.shapes && s.shapes[currentShape()]) || s.product;
  }

  function syncSections() {
    var type = currentType();
    var appt = type === 'appointment_run';
    var journey = type === 'passenger_journey';
    show($('appointment-set'), appt);
    show($('move-set'), !appt);
    show($('passengers-field'), journey);
    $('route-legend').textContent = journey ? C.journeyLegend : C.moveLegend;
    // Where it goes is never optional: an address for a move or a journey,
    // the provider for a service run.
    $('provider').required = appt;
    $('destination').required = !appt;
    $('passengers').required = journey;

    // Offer only the return shapes this service can actually be priced as.
    var s = CFG.services[serviceSel.value] || {};
    form.querySelectorAll('input[name="shape"]').forEach(function (r) {
      var ok = !!(s.shapes && s.shapes[r.value]);
      r.closest('.choice').hidden = !ok;
      r.disabled = !ok;
    });
    var picked = form.querySelector('input[name="shape"]:checked');
    if (!picked || picked.disabled) tick('shape', s.defaultShape);

    syncRequiredMarks();
    estimate();
    syncSubmitGate();
  }

  function onServicePick() {
    // A new service starts from its own usual shape: an inspection is normally
    // a wait-and-return, a workshop visit a later return.
    var s = CFG.services[serviceSel.value] || {};
    tick('shape', s.defaultShape);
    syncSections();
  }

  /* ------------------------------------------------------- the quote */
  function scheduledDate() {
    var d = val('date');
    if (!d) return null;
    var w = val('window');
    var hour = w && w !== 'flex' ? parseInt(w.split('-')[0], 10) : 9;
    // Interpreted as Helsinki wall-clock. The browser may sit in another
    // zone, so the premium decision is only indicative; the server re-derives
    // it in Europe/Helsinki before the fee is confirmed.
    var parts = d.split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), hour, 0, 0);
  }

  function premiumFor(when) {
    if (!when) return null;
    var out = [];
    var p = CFG.premiums;
    var h = when.getHours();
    if (h >= p.night.fromHour || h < p.night.toHour) out.push({ key: 'night', pct: p.night.pct });
    var day = when.getDay();
    if (day === 0 || day === 6) out.push({ key: 'weekend', pct: p.weekend.pct });
    var md = String(when.getMonth() + 1).padStart(2, '0') + '-' + String(when.getDate()).padStart(2, '0');
    if (['01-01', '05-01', '12-06', '12-24', '12-25', '12-26'].indexOf(md) >= 0) {
      out.push({ key: 'publicHoliday', pct: p.publicHoliday.pct });
    }
    var lead = (when.getTime() - Date.now()) / 3600000;
    if (lead >= 0 && lead < p.urgent.withinHours) out.push({ key: 'urgent', pct: p.urgent.pct });
    if (!out.length) return null;
    return out.reduce(function (a, b) { return b.pct > a.pct ? b : a; });
  }

  function estimate() {
    var product = CFG.products[productKey()];

    if (!product || product.quote) {
      quoteAmount.innerHTML = '<small>&nbsp;</small>' + C.quoteManual;
      quoteLines.innerHTML = '';
      quoteNote.textContent = C.quoteManualNote;
      return;
    }

    var lines = [{ label: C.lines.base, amount: product.from }];
    var pr = premiumFor(scheduledDate());
    if (pr) lines.push({ label: C.lines[pr.key] + ' · +' + pr.pct + ' %', amount: product.from * pr.pct / 100 });

    var total = lines.reduce(function (sum, l) { return sum + l.amount; }, 0);
    quoteAmount.innerHTML = '<small>' + C.quoteFrom + '</small>' + money(total);
    quoteLines.innerHTML = lines.map(function (l) {
      return '<li><span>' + l.label + '</span><b>' + money(l.amount) + '</b></li>';
    }).join('');
    quoteNote.textContent = C.quoteNote;
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

  function visible(el) {
    return !!(el && el.offsetParent !== null && !el.disabled);
  }

  var touched = {};

  /* The asterisks follow the live requirement, not the markup: the provider is
     only demanded for a service run, the destination only for a move. */
  function syncRequiredMarks() {
    form.querySelectorAll('.req').forEach(function (m) {
      var el = $(m.getAttribute('data-for'));
      m.hidden = !(el && el.required);
    });
  }

  /**
   * Collects everything still standing between the visitor and a request.
   * `mark` decides whether the fields are painted red as well: the live hint
   * calls this on every keystroke and must not accuse a field the visitor has
   * not reached yet, while the submit attempt does mark them.
   */
  function collectProblems(mark) {
    var problems = [];
    // 'touched' marks only the fields the visitor has already left, so the page
    // never opens accusing someone of not filling in a form they just arrived at.
    var marks = function (id) {
      return mark === true || (mark === 'touched' && touched[id]);
    };
    var note = function (id, label, msg) {
      if (marks(id)) setError(id, msg);
      problems.push({ id: id, label: label });
    };

    // Wipe the slate first. Errors also arrive from the API, on fields this
    // pass never looks at, and without this they would stick for good.
    if (mark) clearAllErrors();

    form.querySelectorAll('input[required], select[required]').forEach(function (el) {
      if (el.type === 'checkbox') return;
      if (!visible(el)) return;
      if (!String(el.value || '').trim()) note(el.id, labelFor(el), C.required);
    });

    // Email is optional, but a mistyped one would lose the receipt.
    var email = val('customer_email');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      note('customer_email', labelFor($('customer_email')), C.badEmail);
    }
    // The phone number is how we reach the customer; catch an obvious typo.
    var phone = val('customer_phone');
    if (phone && phone.replace(/\D/g, '').length < 6) {
      note('customer_phone', labelFor($('customer_phone')), C.badPhone);
    }

    // Keep the numbers inside the bounds the API enforces.
    form.querySelectorAll('input[type="number"]').forEach(function (el) {
      if (!visible(el) || !String(el.value || '').trim()) return;
      var n = parseFloat(el.value);
      var min = el.getAttribute('min');
      var max = el.getAttribute('max');
      if (isNaN(n) || (min !== null && n < parseFloat(min)) || (max !== null && n > parseFloat(max))) {
        note(el.id, labelFor(el), C.badRange);
      }
    });

    var unticked = ackBoxes.filter(function (a) { return !a.checked; });
    if (mark) $('ack-err').textContent = unticked.length ? C.mustAccept : '';
    if (unticked.length) problems.push({ id: unticked[0].id, label: C.authLabel });

    return problems;
  }

  function clearAllErrors() {
    form.querySelectorAll('.err').forEach(function (el) {
      setError(el.id.replace(/-err$/, ''), '');
    });
  }

  function touchedAll() {
    form.querySelectorAll('input[id], select[id], textarea[id]').forEach(function (el) {
      touched[el.id] = true;
    });
  }

  function problemList(problems) {
    return problems.map(function (p) {
      return '<li><a href="#' + p.id + '">' + p.label + '</a></li>';
    }).join('');
  }

  function validate() {
    var problems = collectProblems(true);
    touchedAll();
    if (problems.length) {
      errorSummary.querySelector('ul').innerHTML = problemList(problems);
      show(errorSummary, true);
      errorSummary.focus();
    } else {
      show(errorSummary, false);
    }
    return problems.length === 0;
  }

  function labelFor(el) {
    if (!el) return '';
    var lab = form.querySelector('label[for="' + el.id + '"]');
    // The label carries the required asterisk; the checklist does not need it.
    return lab ? lab.textContent.replace(/\*\s*$/, '').trim() : el.id;
  }

  /* ------------------------------------------------------ lead source */
  /* site.js records how the visit started (campaign tags, referring site,
     landing page) in sessionStorage; this page adds which button sent the
     visitor to the form. Blocked storage costs the attribution, never the
     request. */
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
    var type = currentType();
    var appt = type === 'appointment_run';
    var shape = currentShape();
    var win = val('window');
    var hour = win && win !== 'flex' ? win.split('-')[0] : '09';
    // A move's shape says whether the car comes back; a journey is asked outright.
    var returning = shape ? shape !== 'oneWay' : checked('return_needed') === 'yes';

    return {
      language: CFG.locale,
      service: currentServiceKey(),
      service_type: type,
      shape: shape,
      product: productKey(),
      // A move carries nobody; a journey carries the people who asked for it.
      passenger_count: type === 'passenger_journey' ? (parseInt(val('passengers'), 10) || 1) : 0,
      pickup_location: val('pickup_location'),
      destination: appt ? val('provider') : val('destination'),
      return_needed: returning,
      return_location: returning ? val('pickup_location') : null,
      provider: appt ? val('provider') : null,
      appointment_time: appt ? (val('appointment_time') || null) : null,
      appointment_ref: appt ? (val('appointment_ref') || null) : null,
      scheduled_for: val('date') ? val('date') + 'T' + hour.padStart(2, '0') + ':00' : null,
      collection_window: win || null,
      access_notes: val('access_notes') || null,
      vehicle_plate: val('plate') || null,
      vehicle_details: val('vehicle_model') || null,
      vehicle_gearbox: val('gearbox') || null,
      vehicle_fuel: val('fuel') || null,
      customer_name: val('customer_name'),
      customer_phone: val('customer_phone'),
      customer_email: val('customer_email') || null,
      customer_type: val('customer_type') || 'person',
      company_name: val('company_name') || null,
      business_id: val('business_id') || null,
      invoice_email: val('invoice_email') || null,
      notes: val('notes') || null,
      vehicle_owner_authorization: !!($('ack-0') && $('ack-0').checked),
      lead_source: leadSource(),
    };
  }

  function finish(reference) {
    form.hidden = true;
    $('done-ref').textContent = reference;
    show(donePanel, true);
    donePanel.focus();
    donePanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (gatedKey) return;
    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = C.submitting;

    if (DEMO) {
      finish('DEMO-' + String(Date.now()).slice(-6));
      submitBtn.disabled = false;
      submitBtn.textContent = C.submit;
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
          if (res.data && res.data.field) {
            setError(res.data.field, res.data.error || C.failed);
          }
          throw new Error((res.data && res.data.error) || C.failed);
        }
        finish(res.data.reference);
      })
      .catch(function (err) {
        var ul = errorSummary.querySelector('ul');
        ul.innerHTML = '<li>' + (err.message || C.failed) + '</li>';
        show(errorSummary, true);
        errorSummary.focus();
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = C.submit;
        syncSubmitGate();
      });
  });

  var again = $('again-btn');
  if (again) {
    again.addEventListener('click', function () {
      form.reset();
      touched = {};
      leaveGated();
      form.hidden = false;
      show(donePanel, false);
      show($('company-fields'), false);
      syncSections();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ------------------------------------------------------------ wiring */
  form.querySelectorAll('input[name="service_type"]').forEach(function (r) {
    r.addEventListener('change', function () { leaveGated(); syncSections(); });
  });
  form.querySelectorAll('input[name="return_needed"], input[name="shape"]').forEach(function (r) {
    r.addEventListener('change', estimate);
  });
  serviceSel.addEventListener('change', onServicePick);
  ['date', 'window'].forEach(function (id) {
    var el = $(id);
    if (el) el.addEventListener('change', estimate);
    if (el) el.addEventListener('input', estimate);
  });
  var type = $('customer_type');
  if (type) {
    type.addEventListener('change', function () {
      show($('company-fields'), type.value === 'company');
    });
  }
  // Any edit can complete or reopen an item on the outstanding list.
  form.addEventListener('change', syncSubmitGate);
  form.addEventListener('input', syncSubmitGate);
  // Leaving a field is the moment its emptiness becomes a fact worth flagging.
  form.addEventListener('focusout', function (e) {
    if (e.target && e.target.id) {
      touched[e.target.id] = true;
      syncSubmitGate();
    }
  });

  /* Deep links from the homepage and the service pages:
     /varaus/?palvelu=inspection&nouto=00100&pvm=2026-09-15&lahde=home_hero
     /varaus/?tyyppi=siirto   /en/booking/?type=service */
  var params = new URLSearchParams(location.search);
  var wanted = params.get('palvelu') || params.get('service');
  var wantedType = params.get('tyyppi') || params.get('type');
  var wantedPath = params.get('polku') || params.get('path');
  var wantedPickup = params.get('nouto') || params.get('pickup');
  var wantedDate = params.get('pvm') || params.get('date');
  var source = (params.get('lahde') || params.get('source') || '').replace(/[^\w:-]/g, '').slice(0, 40);
  entry = source || (wanted ? 'service:' + String(wanted).replace(/[^\w-]/g, '').slice(0, 30) : null);

  if (wantedPickup && $('pickup_location')) $('pickup_location').value = wantedPickup.slice(0, 300);
  if (wantedDate && /^\d{4}-\d{2}-\d{2}$/.test(wantedDate) && $('date')) $('date').value = wantedDate;
  if (wantedType === 'palvelu' || wantedType === 'service') tick('service_type', 'appointment_run');
  if (wantedType === 'siirto' || wantedType === 'move') tick('service_type', 'general_move');
  if (wantedType === 'matka' || wantedType === 'journey') tick('service_type', 'passenger_journey');

  var ws = wanted && Object.prototype.hasOwnProperty.call(CFG.services, wanted) ? CFG.services[wanted] : null;
  if (ws && !ws.gated) {
    if (ws.type === 'appointment_run') {
      tick('service_type', 'appointment_run');
      serviceSel.value = wanted;
      tick('shape', ws.defaultShape);
    } else if (ws.type === 'general_move') {
      tick('service_type', 'general_move');
      tick('return_needed', wanted === 'pickupReturn' ? 'yes' : 'no');
    } else if (ws.type === 'passenger') {
      passengerKey = wanted;
      tick('service_type', 'passenger_journey');
    } else if (ws.type === 'business') {
      // Company leads start as a move with the company details already open;
      // contract pricing is agreed on the call.
      tick('service_type', 'general_move');
      $('customer_type').value = 'company';
      show($('company-fields'), true);
      $('more-details').open = true;
      show($('business-note'), true);
    }
  }

  syncSections();
  if ((ws && ws.gated) || wantedPath === 'kuljettaja' || wantedPath === 'driver') {
    enterGated(wanted || 'personalDriver');
  }

  // Today is the earliest sensible pickup date.
  var dateInput = $('date');
  if (dateInput && !dateInput.min) {
    dateInput.min = new Date().toISOString().slice(0, 10);
  }
}());

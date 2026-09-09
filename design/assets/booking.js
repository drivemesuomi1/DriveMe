/* DriveMe — booking.js
   The request flow (§7). Conditional fields, an indicative estimate, an
   accessible error summary and the POST to /api/bookings.

   The estimate here mirrors api/_lib/pricing.js, whose constants are
   injected into the page as JSON at build time — so the two can only differ
   if someone edits this arithmetic by hand. The server recomputes the figure
   before storing it, and the fee is not final until DriveMe confirms it. */
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

  /* ---------------------------------------------------------- helpers */
  function money(n) {
    return (Math.round(n * 100) / 100).toLocaleString(FI ? 'fi-FI' : 'en-GB', {
      minimumFractionDigits: 0, maximumFractionDigits: 2,
    }) + ' €';
  }
  function show(el, on) { if (el) el.hidden = !on; }

  /**
   * The confirmations are booking conditions, not fine print. Until every one
   * is ticked the request cannot be accepted, so the button stays inert rather
   * than letting the visitor submit into an error summary.
   */
  var ackBoxes = Array.prototype.slice.call(
    form.querySelectorAll('input[name="ack"]')
  );
  function acksComplete() {
    return ackBoxes.every(function (a) { return a.checked; });
  }
  function syncSubmitGate() {
    submitBtn.disabled = !acksComplete();
    if (!submitHint) return;
    // Naming what is outstanding, next to the button that will not fire yet,
    // so a disabled button reads as waiting rather than as broken.
    var problems = collectProblems('touched');
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
   * A gated service cannot be requested, so collecting the request is pointless
   * and the indicative price would quote something we refuse to sell. Strip the
   * form back to the choice that got you here plus the notice explaining why.
   *
   * Kept visible: the first fieldset (path + service picker + the notice), so
   * the visitor can switch back to the concierge path, and the phone link in
   * the quote panel, which is the one action still open to them.
   *
   * Done with a class rather than by toggling each element's `hidden`:
   * onServiceChange() above already decides, per service, whether the shape,
   * appointment and destination blocks belong on screen. Setting `hidden`
   * here would overwrite those decisions and reveal blocks that service does
   * not use when the visitor switches back.
   */
  function gatedLayout(on) {
    form.classList.toggle('is-gated', !!on);
  }
  function val(id) { var e = $(id); return e ? String(e.value || '').trim() : ''; }
  function checked(name) {
    var e = form.querySelector('input[name="' + name + '"]:checked');
    return e ? e.value : '';
  }

  /* ------------------------------------------------- service switching */
  function servicesFor(path) {
    return Object.keys(CFG.services).filter(function (k) {
      var cat = CFG.services[k].category;
      return path === 'driver' ? cat === 'driver' : cat !== 'driver';
    });
  }

  function fillServices(path, keep) {
    var keys = servicesFor(path);
    var current = keep && keys.indexOf(keep) >= 0 ? keep : keys[0];
    serviceSel.innerHTML = '';
    keys.forEach(function (k) {
      var o = document.createElement('option');
      o.value = k;
      o.textContent = CFG.services[k].label;
      if (k === current) o.selected = true;
      serviceSel.appendChild(o);
    });
    onServiceChange();
  }

  function currentService() {
    return CFG.services[serviceSel.value] || {};
  }

  function onServiceChange() {
    var s = currentService();
    var isDriverPath = s.category === 'driver';
    var isBusiness = s.category === 'business';

    // Appointment block only when the provider actually needs one (§7).
    show($('appointment-set'), s.appointment === 'required' || s.appointment === 'recommended');
    $('appointment-set').querySelectorAll('input,select').forEach(function (el) {
      el.disabled = $('appointment-set').hidden;
    });
    var providerInput = $('provider');
    if (providerInput) providerInput.required = s.appointment === 'required';

    // Hourly driver work asks for hours; a concierge run asks for waiting.
    show($('hours-field'), s.product === 'personalDriver');
    show($('wait-field'), !isDriverPath && !isBusiness);
    show($('shape-set'), !isDriverPath && !isBusiness && (s.allowed || []).length > 1);
    show($('destination-field'), !isDriverPath || s.product !== 'personalDriver');
    show($('return-field'), !isDriverPath && !isBusiness);

    // Shapes this service actually supports.
    form.querySelectorAll('input[name="shape"]').forEach(function (r) {
      var ok = (s.allowed || []).indexOf(r.value) >= 0;
      r.closest('.choice').hidden = !ok;
      r.disabled = !ok;
      if (!ok && r.checked) {
        var first = form.querySelector('input[name="shape"]:not([disabled])');
        if (first) first.checked = true;
      }
    });

    // A gated service cannot be requested at all — the document's
    // implementation principle: no bookable promise without clearance.
    var warn = $('gate-warning');
    if (s.gated) {
      warn.innerHTML = '<div class="callout warn"><h3>' + C.gatedTitle + '</h3><p>' +
        (FI
          ? 'Voit ilmoittaa kiinnostuksesi sähköpostitse, mutta emme ota tälle palvelulle varauksia ennen viranomais- ja vakuutusvahvistusta.'
          : 'You can register interest by email, but we take no bookings for this service before regulatory and insurance clearance.') +
        '</p></div>';
      show(warn, true);
      submitBtn.disabled = true;
    } else {
      warn.innerHTML = '';
      show(warn, false);
      syncSubmitGate();
    }
    gatedLayout(s.gated);
    syncRequiredMarks();

    estimate();
  }

  /* ------------------------------------------------------- the quote */
  function productKey() {
    var s = currentService();
    if (s.category === 'driver' || s.category === 'business') return s.product;
    var shape = checked('shape');
    // The service's own product wins when it is the selected shape's default
    // (an inspection run is priced as an inspection run, not as a generic
    // pickup-and-return), otherwise the chosen shape decides.
    if (shape && shape !== 'pickupReturn') return shape;
    return s.product;
  }

  function scheduledDate() {
    var d = val('date');
    if (!d) return null;
    var w = val('window') || '08-10';
    var hour = parseInt(w.split('-')[0], 10);
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
    var s = currentService();
    var key = productKey();
    var product = CFG.products[key];

    if (!product || product.quote || s.gated) {
      quoteAmount.innerHTML = '<small>&nbsp;</small>' + C.quoteManual;
      quoteLines.innerHTML = '';
      quoteNote.textContent = C.quoteManualNote;
      return;
    }

    var lines = [];
    var base;
    if (product.unit === 'hour') {
      var hours = Math.max(product.minHours || 1, Math.ceil((parseFloat(val('hours')) || 0) * 2) / 2);
      base = hours * product.from;
      lines.push({ label: C.lines.driverTime + ' · ' + hours + ' h', amount: base });
    } else {
      base = product.from;
      lines.push({ label: C.lines.base, amount: base });
    }

    var included = key === 'waitReturn' ? CFG.waiting.waitReturnIncludedMinutes : CFG.waiting.includedMinutes;
    var wait = parseInt(val('wait_minutes'), 10) || 0;
    var extra = Math.max(0, wait - included);
    if (extra > 0) {
      var units = Math.ceil(extra / CFG.waiting.unitMinutes);
      var amount = units * (CFG.waiting.hourlyRate * (CFG.waiting.unitMinutes / 60));
      lines.push({ label: C.lines.waiting + ' · ' + (units * CFG.waiting.unitMinutes) + ' min', amount: amount });
      base += amount;
    }

    var pr = premiumFor(scheduledDate());
    if (pr) lines.push({ label: C.lines[pr.key] + ' · +' + pr.pct + ' %', amount: base * pr.pct / 100 });

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

  // A destination is meaningless for an hourly driver booking, required for
  // every concierge run — one rule, read by both validation and the asterisks.
  function destinationRequired() {
    var s = currentService();
    return s.category !== 'driver' && s.category !== 'business';
  }

  var touched = {};

  /* The asterisks follow the live requirement, not the markup: the provider is
     only demanded by services that need a booked appointment. */
  function syncRequiredMarks() {
    form.querySelectorAll('.req').forEach(function (m) {
      var id = m.getAttribute('data-for');
      var el = $(id);
      m.hidden = !(el && el.required) && !(id === 'destination' && destinationRequired());
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
    // pass never looks at, and without this they would stick for good: the
    // visitor fixes the value and the message stays, accusing them of nothing
    // they can see.
    if (mark) clearAllErrors();

    form.querySelectorAll('input[required], select[required]').forEach(function (el) {
      if (el.type === 'checkbox') return;
      if (!visible(el)) return;
      if (!String(el.value || '').trim()) {
        note(el.id, labelFor(el), C.required);
      } else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim())) {
        note(el.id, labelFor(el), C.badEmail);
      }
    });

    if (destinationRequired()) {
      if (!val('destination')) note('destination', labelFor($('destination')), C.required);
    }

    // Keep the numbers inside the bounds the API enforces, so an out-of-range
    // entry is caught here rather than coming back as a failed request.
    form.querySelectorAll('input[type="number"]').forEach(function (el) {
      if (!visible(el) || !String(el.value || '').trim()) return;
      var n = parseFloat(el.value);
      var min = el.getAttribute('min');
      var max = el.getAttribute('max');
      if (isNaN(n) || (min !== null && n < parseFloat(min)) || (max !== null && n > parseFloat(max))) {
        note(el.id, labelFor(el), C.badRange);
      }
    });

    // One entry with a count, not eight lines: the confirmations are a single
    // block on the page and listing each sentence would bury the real fields.
    var unticked = ackBoxes.filter(function (a) { return !a.checked; });
    if (mark) $('ack-err').textContent = unticked.length ? C.mustAccept : '';
    if (unticked.length) {
      problems.push({
        id: unticked[0].id,
        label: (FI ? 'Varauksen vahvistukset' : 'Booking confirmations') +
          ' (' + unticked.length + '/' + ackBoxes.length + ')',
      });
    }

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

  /* ----------------------------------------------------------- submit */
  function payload() {
    var s = currentService();
    var shape = checked('shape');
    var scheduled = val('date') && val('window')
      ? val('date') + 'T' + val('window').split('-')[0].padStart(2, '0') + ':00'
      : null;

    return {
      language: CFG.locale,
      path: checked('path'),
      service: serviceSel.value,
      product: productKey(),
      shape: shape || null,
      pickup_location: val('pickup_location'),
      destination: val('destination') || null,
      return_location: $('return_same') && $('return_same').checked ? val('pickup_location') : (val('return_location') || null),
      access_notes: val('access_notes') || null,
      scheduled_for: scheduled,
      collection_window: val('window') || null,
      delivery_by: val('delivery_by') || null,
      wait_minutes: parseInt(val('wait_minutes'), 10) || 0,
      duration_hours: s.product === 'personalDriver' ? (parseFloat(val('hours')) || null) : null,
      provider: val('provider') || null,
      appointment_time: val('appointment_time') || null,
      appointment_ref: val('appointment_ref') || null,
      appointment_contact: val('appointment_contact') || null,
      key_method: val('key_method') || null,
      vehicle_plate: val('plate'),
      vehicle_details: [val('vehicle_model'), val('vehicle_year')].filter(Boolean).join(' '),
      vehicle_gearbox: val('gearbox') || null,
      vehicle_fuel: val('fuel') || null,
      vehicle_mileage: parseInt(val('mileage'), 10) || null,
      vehicle_notes: val('vehicle_notes') || null,
      customer_name: val('customer_name'),
      customer_phone: val('customer_phone'),
      customer_email: val('customer_email'),
      customer_type: val('customer_type') || 'person',
      company_name: val('company_name') || null,
      business_id: val('business_id') || null,
      invoice_email: val('invoice_email') || null,
      pickup_contact: val('pickup_contact') || null,
      delivery_contact: val('delivery_contact') || null,
      contact_notes: val('contact_notes') || null,
      payment_method: val('payment_method') || null,
      notes: val('notes') || null,
      acknowledged: true,
    };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (currentService().gated) return;
    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = C.submitting;

    if (DEMO) {
      form.hidden = true;
      $('done-ref').textContent = 'DEMO-' + String(Date.now()).slice(-6);
      show(donePanel, true);
      donePanel.focus();
      donePanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        form.hidden = true;
        $('done-ref').textContent = C.doneRef ? res.data.reference : res.data.reference;
        show(donePanel, true);
        donePanel.focus();
        donePanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      });
  });

  var again = $('again-btn');
  if (again) {
    again.addEventListener('click', function () {
      form.reset();
      form.hidden = false;
      show(donePanel, false);
      onPathChange();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ------------------------------------------------------------ wiring */
  function onPathChange() {
    fillServices(checked('path'), serviceSel.value);
  }

  form.querySelectorAll('input[name="path"]').forEach(function (r) {
    r.addEventListener('change', onPathChange);
  });
  serviceSel.addEventListener('change', onServiceChange);
  form.querySelectorAll('input[name="shape"]').forEach(function (r) {
    r.addEventListener('change', estimate);
  });
  ['date', 'window', 'wait_minutes', 'hours'].forEach(function (id) {
    var el = $(id);
    if (el) el.addEventListener('change', estimate);
    if (el) el.addEventListener('input', estimate);
  });
  var type = $('customer_type');
  if (type) {
    type.addEventListener('change', function () {
      show($('company-fields'), type.value === 'company');
      if (type.value === 'company') $('payment_method').value = 'invoice';
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
  syncRequiredMarks();
  syncSubmitGate();

  var same = $('return_same');
  if (same) {
    same.addEventListener('change', function () { show($('return-address'), !same.checked); });
  }

  /* Deep links from the service pages and the homepage quick start:
     /varaus/?palvelu=inspection&nouto=Mannerheimintie+1&pvm=2026-09-15 */
  var params = new URLSearchParams(location.search);
  var wantedService = params.get('palvelu') || params.get('service');
  var wantedPath = params.get('polku') || params.get('path');
  var wantedPickup = params.get('nouto') || params.get('pickup');
  var wantedDate = params.get('pvm') || params.get('date');
  if (wantedPickup && $('pickup_location')) $('pickup_location').value = wantedPickup.slice(0, 300);
  if (wantedDate && /^\d{4}-\d{2}-\d{2}$/.test(wantedDate) && $('date')) $('date').value = wantedDate;
  if (wantedPath === 'kuljettaja' || wantedPath === 'driver') {
    var driverRadio = form.querySelector('input[name="path"][value="driver"]');
    if (driverRadio) driverRadio.checked = true;
  }
  if (wantedService && CFG.services[wantedService]) {
    var cat = CFG.services[wantedService].category;
    var pathRadio = form.querySelector('input[name="path"][value="' + (cat === 'driver' ? 'driver' : 'car') + '"]');
    if (pathRadio) pathRadio.checked = true;
  }
  fillServices(checked('path'), wantedService || null);

  // Today is the earliest sensible pickup date.
  var dateInput = $('date');
  if (dateInput && !dateInput.min) {
    dateInput.min = new Date().toISOString().slice(0, 10);
  }
}());

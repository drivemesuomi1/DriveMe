/* DriveMe — booking.js
   The enquiry form: six fields, no price, and a POST to /api/bookings.

   What it does is validate what the API validates, keep the service the
   visitor arrived for selected, say plainly when a send fails, and show the
   confirmation when it succeeds. There is no estimate on this page: a quote
   is written by a person who has read the enquiry. */
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
  var shell = document.getElementById('enquiry-shell');
  var serviceSel = $('service');
  var errorSummary = $('error-summary');
  var submitBtn = $('submit-btn');
  var submitLabel = submitBtn.innerHTML;
  var donePanel = $('done-panel');

  // Set when a link asks for a service that is not sold yet.
  var gatedKey = null;
  // Which part of the site sent the visitor here, for lead_source.
  var entry = null;
  // What a deep link brought along that this form no longer asks for.
  var carried = { pickup: '' };
  var touched = {};

  /* ---------------------------------------------------------- helpers */
  function show(el, on) { if (el) el.hidden = !on; }
  function val(id) { var e = $(id); return e ? String(e.value || '').trim() : ''; }

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
      if (!String(el.value || '').trim()) note(el, C.required);
    });

    if (val('customer_email') && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val('customer_email'))) {
      note($('customer_email'), C.badEmail);
    }
    if (val('customer_phone') && val('customer_phone').replace(/\D/g, '').length < 6) {
      note($('customer_phone'), C.badPhone);
    }

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
    var company = val('company_name');
    return {
      language: CFG.locale,
      service: serviceSel.value,
      // The enquiry says who is asking and what they want. The route, the
      // vehicle, the handover and the declarations are settled on the call
      // back, so nothing here pretends to know them.
      passenger_count: 0,
      customer_name: val('customer_name'),
      customer_phone: val('customer_phone'),
      customer_email: val('customer_email'),
      customer_type: company ? 'company' : 'person',
      company_name: company || null,
      notes: val('notes') || null,
      offer_code: val('offer_code').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20) || null,
      // Carried through when a homepage or campaign link brought one along, so
      // the detail is not lost between the two pages.
      pickup_location: carried.pickup || null,
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
          if (res.data && res.data.field) {
            setError(res.data.field, res.data.error || C.failed);
          }
          throw new Error((res.data && res.data.error) || C.failed);
        }
        finish(res.data.reference);
      })
      .catch(function (err) {
        // Everything the visitor typed stays exactly where it is: an error
        // must never cost somebody the form they have just filled in.
        var ul = errorSummary.querySelector('ul');
        ul.innerHTML = '<li>' + (err.message || C.failed) + '</li>';
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
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ------------------------------------------------------------ wiring */
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

  /* Deep links from the homepage, the service pages and the campaign. Each
     language links in its own words, and every language's spelling is accepted
     here so a shared or edited link keeps working:
     /pyyda-tarjous/?palvelu=homeDelivery&lahde=home_hero
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
  carried.pickup = (param('nouto', 'pickup', 'hamtning') || '').slice(0, 300);
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
}());

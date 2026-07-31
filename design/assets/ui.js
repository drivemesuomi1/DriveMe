/* ==========================================================================
   DriveMe UI kit - behaviour for the shared components in assets/ui.css.
   Vanilla, no build step, no framework. Exposes a single global: DM.

   Native controls are *enhanced*, never discarded: every custom select keeps
   its <select> in the DOM (visually hidden) so form semantics, autofill and
   assistive tech still work if the script fails.
   ========================================================================== */
window.DM = (function () {
  'use strict';

  const ICONS = {
    chev: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
    tick: '<svg viewBox="0 0 24 24"><path d="M4 12.5l5.5 5.5L20 7"/></svg>',
    left: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.4 7-11a7 7 0 10-14 0c0 4.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.4-3.4"/></svg>',
    crosshair: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    cal: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    warn: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg>',
  };

  const h = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const pad2 = (n) => String(n).padStart(2, '0');

  /* ---------------- open-popover registry: one at a time ---------------- */
  const openPops = new Set();
  function closeAll(except) {
    openPops.forEach((p) => { if (p !== except) p.close(); });
  }
  document.addEventListener('pointerdown', (e) => {
    openPops.forEach((p) => { if (!p.root.contains(e.target)) p.close(); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll(null);
  });

  /** Flip the panel above the anchor when there isn't room below. */
  function placePanel(root, panel) {
    panel.classList.remove('up');
    const r = root.getBoundingClientRect();
    const need = panel.offsetHeight + 14;
    if (r.bottom + need > window.innerHeight && r.top > need) panel.classList.add('up');
  }

  /* ====================================================================
     Toast
     ==================================================================== */
  let toastHost = null;
  function toast(message, kind, ms) {
    if (!toastHost) {
      toastHost = h('div', 'dm-toasts');
      toastHost.setAttribute('role', 'status');
      toastHost.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastHost);
    }
    const t = h('div', 'dm-toast' + (kind ? ' ' + kind : ''));
    t.innerHTML = (kind === 'bad' ? ICONS.warn : kind === 'good' ? ICONS.tick : '') +
      '<span></span>';
    t.querySelector('span').textContent = message;
    toastHost.appendChild(t);
    requestAnimationFrame(() => t.classList.add('on'));
    setTimeout(() => {
      t.classList.remove('on');
      setTimeout(() => t.remove(), 300);
    }, ms || 3200);
    return t;
  }

  /* ====================================================================
     Segmented control - animated thumb follows the pressed button
     ==================================================================== */
  function segmented(root, onChange) {
    const btns = [...root.querySelectorAll('button')];
    let thumb = root.querySelector('.dm-seg-thumb');
    if (!thumb) { thumb = h('span', 'dm-seg-thumb'); root.appendChild(thumb); }

    function move() {
      const on = btns.find((b) => b.getAttribute('aria-pressed') === 'true') || btns[0];
      thumb.style.width = on.offsetWidth + 'px';
      thumb.style.transform = 'translateX(' + (on.offsetLeft - 4) + 'px)';
    }
    function set(btn, fire) {
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      move();
      if (fire !== false && onChange) onChange(btn.dataset.value, btn);
    }
    btns.forEach((b) => b.addEventListener('click', () => set(b)));
    requestAnimationFrame(move);
    window.addEventListener('resize', move);
    return { move, set: (v) => { const b = btns.find((x) => x.dataset.value === v); if (b) set(b, false); } };
  }

  /* ====================================================================
     Select - enhances a native <select> into a listbox
     ==================================================================== */
  function select(native, opts) {
    opts = opts || {};
    if (!native || native.dataset.dmReady) return null;
    native.dataset.dmReady = '1';

    const root = h('div', 'dm-select');
    const btn = h('button', 'dm-select-btn');
    btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    const labelSpan = h('span', 'dm-select-label');
    const chev = h('span', 'dm-chev', ICONS.chev);
    btn.append(labelSpan, chev);

    const panel = h('div', 'dm-pop');
    panel.setAttribute('role', 'listbox');
    panel.tabIndex = -1;
    panel.id = (native.id || 'dm-select') + '-listbox';
    btn.setAttribute('aria-controls', panel.id);

    native.classList.add('dm-sr');
    native.parentNode.insertBefore(root, native);
    root.append(btn, panel, native);
    if (native.id) {
      const lab = document.querySelector('label[for="' + native.id + '"]');
      if (lab) {
        btn.setAttribute('aria-labelledby', lab.id || (lab.id = native.id + '-lab'));
        panel.setAttribute('aria-labelledby', lab.id);
      }
    }
    if (!panel.hasAttribute('aria-labelledby')) {
      panel.setAttribute('aria-label', opts.label || native.getAttribute('aria-label') || 'Options');
    }

    let items = [], active = -1, open = false;

    function build() {
      panel.innerHTML = '';
      items = [...native.options].map((o, i) => {
        const b = h('button', 'dm-opt');
        b.type = 'button';
        b.setAttribute('role', 'option');
        b.id = panel.id + '-opt-' + i;
        b.dataset.i = i;
        if (o.disabled) b.disabled = true;
        const sub = o.dataset.sub;
        b.innerHTML = '<span>' + escapeHtml(o.textContent) +
          (sub ? '<span class="dm-opt-sub">' + escapeHtml(sub) + '</span>' : '') +
          '</span><span class="dm-tick">' + ICONS.tick + '</span>';
        b.addEventListener('click', () => { pick(i); });
        panel.appendChild(b);
        return b;
      });
      if (!items.length) panel.appendChild(h('div', 'dm-opt-empty', opts.empty || 'Nothing to choose from'));
      sync();
    }

    function sync() {
      const o = native.options[native.selectedIndex];
      labelSpan.textContent = o ? o.textContent : (opts.placeholder || '');
      labelSpan.style.color = o ? '' : 'var(--ink-500)';
      items.forEach((b, i) => b.setAttribute('aria-selected', String(i === native.selectedIndex)));
    }

    function pick(i) {
      if (native.options[i] && native.options[i].disabled) return;
      native.selectedIndex = i;
      native.dispatchEvent(new Event('change', { bubbles: true }));
      sync();
      close();
      btn.focus();
    }

    function setActive(i) {
      if (!items.length) return;
      const n = items.length;
      let next = i;
      for (let k = 0; k < n; k++) {                    // skip disabled entries
        const c = ((next % n) + n) % n;
        if (!items[c].disabled) { next = c; break; }
        next = i > active ? next + 1 : next - 1;
      }
      items.forEach((b) => b.classList.remove('active'));
      active = ((next % n) + n) % n;
      items[active].classList.add('active');
      items[active].scrollIntoView({ block: 'nearest' });
    }

    const api = {
      root,
      close() {
        if (!open) return;
        open = false;
        root.classList.remove('open');
        panel.classList.remove('on');
        btn.setAttribute('aria-expanded', 'false');
        openPops.delete(api);
      },
      open() {
        if (open) return;
        closeAll(api);
        build();
        open = true;
        root.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        panel.classList.add('on');
        placePanel(root, panel);
        openPops.add(api);
        setActive(native.selectedIndex < 0 ? 0 : native.selectedIndex);
      },
      refresh: build,
      sync,
    };

    btn.addEventListener('click', () => (open ? api.close() : api.open()));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); api.open(); }
    });
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); pick(+items[active].dataset.i); }
      else if (e.key === 'Escape') { e.preventDefault(); api.close(); btn.focus(); }
      else if (e.key === 'Tab') api.close();
    });
    root.addEventListener('keydown', (e) => {
      if (open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); panel.focus(); setActive(active + (e.key === 'ArrowDown' ? 1 : -1)); }
    });

    build();
    return api;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ====================================================================
     Date picker - readonly text input + calendar popover
     Value is kept ISO (yyyy-mm-dd) on input.dataset.value
     ==================================================================== */
  function locale(){ return document.documentElement.lang === 'fi' ? 'fi-FI' : undefined; }
  function weekdays(){
    return Array.from({ length:7 }, (_, i) =>
      new Date(2024, 0, 1 + i).toLocaleDateString(locale(), { weekday:'short' }).replace('.', ''));
  }

  const isoOf = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

  function datePicker(input, opts) {
    opts = opts || {};
    if (!input || input.dataset.dmReady) return null;
    input.dataset.dmReady = '1';
    input.readOnly = true;
    input.autocomplete = 'off';

    const root = input.closest('.dm-input-wrap') || input.parentNode;
    if (getComputedStyle(root).position === 'static') root.style.position = 'relative';

    const panel = h('div', 'dm-pop');
    const cal = h('div', 'dm-cal');
    panel.appendChild(cal);
    root.appendChild(panel);

    const min = opts.min ? startOfDay(new Date(opts.min)) : startOfDay(new Date());
    let view = new Date(min.getFullYear(), min.getMonth(), 1);
    let value = input.dataset.value ? new Date(input.dataset.value + 'T00:00:00') : null;

    function label(d) {
      return d.toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'short' });
    }

    function commit(d) {
      value = d;
      input.dataset.value = isoOf(d);
      input.value = label(d);
      input.dispatchEvent(new Event('change', { bubbles: true }));
      api.close();
      input.focus();
    }

    function render() {
      cal.innerHTML = '';
      const head = h('div', 'dm-cal-head');
      const prev = h('button', 'dm-cal-nav', ICONS.left);
      const next = h('button', 'dm-cal-nav', ICONS.right);
      prev.type = next.type = 'button';
      prev.setAttribute('aria-label', document.documentElement.lang === 'fi' ? 'Edellinen kuukausi' : 'Previous month');
      next.setAttribute('aria-label', document.documentElement.lang === 'fi' ? 'Seuraava kuukausi' : 'Next month');
      const title = h('span', 'dm-cal-title', view.toLocaleDateString(locale(), { month:'long', year:'numeric' }));
      if (view <= new Date(min.getFullYear(), min.getMonth(), 1)) prev.disabled = true;
      prev.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); });
      next.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); });
      head.append(prev, title, next);
      cal.appendChild(head);

      const grid = h('div', 'dm-cal-grid');
      weekdays().forEach((d) => grid.appendChild(h('div', 'dm-cal-dow', d)));

      const first = new Date(view.getFullYear(), view.getMonth(), 1);
      const lead = (first.getDay() + 6) % 7;                    // Monday-first
      const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      const today = startOfDay(new Date());

      for (let i = 0; i < lead; i++) grid.appendChild(h('div', ''));
      for (let d = 1; d <= days; d++) {
        const date = new Date(view.getFullYear(), view.getMonth(), d);
        const b = h('button', 'dm-cal-day', String(d));
        b.type = 'button';
        if (date < min) b.disabled = true;
        if (+date === +today) b.classList.add('today');
        if (value && +date === +startOfDay(value)) b.classList.add('sel');
        b.addEventListener('click', () => commit(date));
        grid.appendChild(b);
      }
      cal.appendChild(grid);

      const foot = h('div', 'dm-cal-foot');
      const t = h('button', 'dm-btn quiet sm', 'Tonight');
      const tm = h('button', 'dm-btn quiet sm', 'Tomorrow');
      t.type = tm.type = 'button';
      t.addEventListener('click', () => commit(today));
      tm.addEventListener('click', () => {
        const x = new Date(today); x.setDate(x.getDate() + 1); commit(x);
      });
      foot.append(t, tm);
      cal.appendChild(foot);
    }

    const api = {
      root,
      close() {
        panel.classList.remove('on');
        input.setAttribute('aria-expanded', 'false');
        openPops.delete(api);
      },
      open() {
        closeAll(api);
        if (value) view = new Date(value.getFullYear(), value.getMonth(), 1);
        render();
        panel.classList.add('on');
        input.setAttribute('aria-expanded', 'true');
        placePanel(root, panel);
        openPops.add(api);
      },
      set(iso) {
        if (!iso) return;
        commitSilent(new Date(iso + 'T00:00:00'));
      },
      get() { return input.dataset.value || ''; },
    };

    function commitSilent(d) {
      value = d;
      input.dataset.value = isoOf(d);
      input.value = label(d);
    }

    input.setAttribute('aria-haspopup', 'dialog');
    input.addEventListener('click', () => api.open());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); api.open(); }
    });

    if (opts.value) api.set(opts.value);
    return api;
  }

  /* ====================================================================
     Time picker - 15-minute list + evening quick picks
     Value kept as HH:MM on input.dataset.value
     ==================================================================== */
  function timePicker(input, opts) {
    opts = opts || {};
    if (!input || input.dataset.dmReady) return null;
    input.dataset.dmReady = '1';
    input.readOnly = true;
    input.autocomplete = 'off';

    const root = input.closest('.dm-input-wrap') || input.parentNode;
    if (getComputedStyle(root).position === 'static') root.style.position = 'relative';

    const panel = h('div', 'dm-pop');
    const box = h('div', 'dm-time');
    panel.appendChild(box);
    root.appendChild(panel);

    const fmt = (hh, mm) =>
      new Date(2000, 0, 1, hh, mm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    function commit(hh, mm, silent) {
      input.dataset.value = pad2(hh) + ':' + pad2(mm);
      input.value = fmt(hh, mm);
      if (!silent) {
        input.dispatchEvent(new Event('change', { bubbles: true }));
        api.close();
        input.focus();
      }
    }

    function render() {
      box.innerHTML = '';
      // Night-out is the core use case, so the common departure times lead.
      const quick = h('div', 'dm-time-quick');
      [['20:00', '8 pm'], ['22:00', '10 pm'], ['23:00', '11 pm'], ['00:30', '12:30 am']]
        .forEach(([v, lab]) => {
          const b = h('button', null, lab);
          b.type = 'button';
          b.addEventListener('click', () => commit(+v.slice(0, 2), +v.slice(3)));
          quick.appendChild(b);
        });
      box.appendChild(quick);

      const list = h('div', 'dm-time-list');
      list.setAttribute('role', 'listbox');
      list.setAttribute('aria-label', opts.label || 'Choose a time');
      const cur = input.dataset.value;
      let selected = null;
      for (let m = 0; m < 24 * 60; m += 15) {
        const hh = Math.floor(m / 60), mm = m % 60;
        const v = pad2(hh) + ':' + pad2(mm);
        const b = h('button', 'dm-opt', '<span>' + fmt(hh, mm) + '</span><span class="dm-tick">' + ICONS.tick + '</span>');
        b.type = 'button';
        b.setAttribute('role', 'option');
        b.setAttribute('aria-selected', String(v === cur));
        if (v === cur) selected = b;
        b.addEventListener('click', () => commit(hh, mm));
        list.appendChild(b);
      }
      box.appendChild(list);
      requestAnimationFrame(() => {
        if (selected) selected.scrollIntoView({ block: 'center' });
        else list.scrollTop = 20 * 4 * 44;                 // park the view at ~20:00
      });
    }

    const api = {
      root,
      close() { panel.classList.remove('on'); openPops.delete(api); },
      open() {
        closeAll(api);
        render();
        panel.classList.add('on');
        placePanel(root, panel);
        openPops.add(api);
      },
      set(v) { if (v) commit(+v.slice(0, 2), +v.slice(3), true); },
      get() { return input.dataset.value || ''; },
    };

    input.setAttribute('aria-haspopup', 'listbox');
    input.addEventListener('click', () => api.open());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); api.open(); }
    });

    if (opts.value) api.set(opts.value);
    return api;
  }

  /* ====================================================================
     Geocoding / routing - Photon (OSM) + OSRM, both CORS-friendly & free
     ==================================================================== */
  const HELSINKI = { lat: 60.1699, lng: 24.9384 };
  const METRO = ['helsinki', 'espoo', 'vantaa', 'kauniainen'];

  function labelOf(p) {
    const line1 = [p.name, p.housenumber && p.street ? p.street + ' ' + p.housenumber : p.street]
      .filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(', ');
    const line2 = [p.district, p.city || p.county, p.country].filter(Boolean).join(', ');
    return { primary: line1 || p.city || 'Unnamed place', secondary: line2 };
  }

  const geo = {
    HELSINKI,
    inMetro(city) {
      return !!city && METRO.includes(String(city).toLowerCase());
    },
    /** Autocomplete, biased to the capital region. */
    async search(q, signal) {
      if (!q || q.trim().length < 2) return [];
      const url = 'https://photon.komoot.io/api/?q=' + encodeURIComponent(q) +
        '&lat=' + HELSINKI.lat + '&lon=' + HELSINKI.lng + '&limit=6&lang=en';
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error('search failed');
      const data = await res.json();
      return (data.features || []).map((f) => {
        const p = f.properties, c = f.geometry.coordinates;
        const l = labelOf(p);
        return { lat: c[1], lng: c[0], city: p.city || p.county, ...l };
      });
    },
    /** Address for a dropped pin. */
    async reverse(lat, lng) {
      const url = 'https://photon.komoot.io/reverse?lat=' + lat + '&lon=' + lng + '&lang=en';
      const res = await fetch(url);
      if (!res.ok) throw new Error('reverse failed');
      const f = (await res.json()).features || [];
      if (!f.length) return { lat, lng, primary: lat.toFixed(5) + ', ' + lng.toFixed(5), secondary: '', city: null };
      const p = f[0].properties;
      const l = labelOf(p);
      return { lat, lng, city: p.city || p.county, ...l };
    },
    /** Real driving route; falls back to a straight line if OSRM is unreachable. */
    async route(a, b) {
      try {
        const url = 'https://router.project-osrm.org/route/v1/driving/' +
          a.lng + ',' + a.lat + ';' + b.lng + ',' + b.lat +
          '?overview=full&geometries=geojson';
        const res = await fetch(url);
        const data = await res.json();
        if (data.code === 'Ok' && data.routes && data.routes[0]) {
          const r = data.routes[0];
          return {
            km: r.distance / 1000,
            minutes: Math.round(r.duration / 60),
            line: r.geometry.coordinates.map((c) => [c[1], c[0]]),
            real: true,
          };
        }
      } catch { /* fall through to the straight line */ }
      const km = geo.haversine(a, b);
      return { km, minutes: Math.round((km / 45) * 60), line: [[a.lat, a.lng], [b.lat, b.lng]], real: false };
    },
    haversine(a, b) {
      const R = 6371, rad = (d) => (d * Math.PI) / 180;
      const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
      const s = Math.sin(dLat / 2) ** 2 +
        Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
      return 2 * R * Math.asin(Math.sqrt(s));
    },
    /**
     * Chargeable distance past the four capital-region cities (§3.2).
     * The service area has no published polygon, so we approximate it as a
     * 25 km radius from Helsinki centre and bill the remainder of the route.
     */
    kmBeyondMetro(destination, routeKm) {
      if (!destination) return 0;
      if (geo.inMetro(destination.city)) return 0;
      const asCrow = geo.haversine(HELSINKI, destination);
      if (asCrow <= 25) return 0;
      return Math.max(0, Math.round((routeKm || asCrow) - 25));
    },
  };

  /* ====================================================================
     Address autocomplete - Photon-backed suggestions under a text input
     ==================================================================== */
  function autocomplete(input, opts) {
    opts = opts || {};
    if (!input || input.dataset.dmReady) return null;
    input.dataset.dmReady = '1';
    input.autocomplete = 'off';
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');

    const wrap = input.closest('.dm-input-wrap') || input.parentNode;
    if (getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';

    const panel = h('div', 'dm-pop');
    panel.setAttribute('role', 'listbox');
    panel.id = (input.id || 'dm-autocomplete') + '-listbox';
    panel.setAttribute('aria-label', opts.label || input.getAttribute('aria-label') || 'Address suggestions');
    input.setAttribute('aria-controls', panel.id);
    wrap.appendChild(panel);

    let results = [], active = -1, timer = null, ctrl = null, chosen = null;

    function close() {
      panel.classList.remove('on');
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      openPops.delete(api);
    }
    function open() {
      closeAll(api);
      panel.classList.add('on');
      input.setAttribute('aria-expanded', 'true');
      placePanel(wrap, panel);
      openPops.add(api);
    }

    function draw() {
      panel.innerHTML = '';
      if (!results.length) {
        panel.appendChild(h('div', 'dm-opt-empty', 'No matches - try a street or venue name'));
        return;
      }
      results.forEach((r, i) => {
        const b = h('button', 'dm-opt');
        b.type = 'button';
        b.setAttribute('role', 'option');
        b.id = panel.id + '-opt-' + i;
        b.innerHTML = '<span class="dm-lead-ic">' + ICONS.pin + '</span>' +
          '<span><span>' + escapeHtml(r.primary) + '</span>' +
          (r.secondary ? '<span class="dm-opt-sub">' + escapeHtml(r.secondary) + '</span>' : '') + '</span>';
        b.addEventListener('click', () => choose(i));
        panel.appendChild(b);
      });
    }

    function setActive(i) {
      const n = results.length;
      if (!n) return;
      active = ((i % n) + n) % n;
      [...panel.children].forEach((c, k) => c.classList && c.classList.toggle('active', k === active));
      const el = panel.children[active];
      if (el && el.id) input.setAttribute('aria-activedescendant', el.id);
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    }

    function choose(i) {
      const r = results[i];
      if (!r) return;
      chosen = r;
      input.value = r.primary + (r.secondary ? ', ' + r.secondary.split(',')[0] : '');
      close();
      if (opts.onPick) opts.onPick(r);
    }

    async function run() {
      const q = input.value.trim();
      if (q.length < 2) { close(); return; }
      if (ctrl) ctrl.abort();
      ctrl = new AbortController();
      wrap.classList.add('busy');
      try {
        results = await geo.search(q, ctrl.signal);
        active = -1;
        draw();
        open();
      } catch (e) {
        if (e.name !== 'AbortError') { results = []; draw(); open(); }
      } finally {
        wrap.classList.remove('busy');
      }
    }

    const api = {
      root: wrap, close, open,
      /** Fill the box from a map pin without re-triggering a search. */
      setFromPlace(place) {
        chosen = place;
        input.value = place.primary + (place.secondary ? ', ' + place.secondary.split(',')[0] : '');
        close();
      },
      get value() { return chosen; },
      clear() { chosen = null; input.value = ''; },
    };

    input.addEventListener('input', () => {
      chosen = null;
      clearTimeout(timer);
      timer = setTimeout(run, 260);                    // debounce; Photon is rate-limited
    });
    input.addEventListener('focus', () => { if (results.length && input.value.trim().length >= 2) open(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (!panel.classList.contains('on')) run(); else setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Enter') { if (panel.classList.contains('on') && active >= 0) { e.preventDefault(); choose(active); } }
      else if (e.key === 'Escape') close();
    });

    return api;
  }

  /* ====================================================================
     Leaflet helpers - muted CARTO basemap + drawn pins
     ==================================================================== */
  const TILES = {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd', maxZoom: 20,
  };
  const SATELLITE_TILES = {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19,
  };

  function pinIcon(kind) {
    // kind: 'pickup' | 'dropoff' | 'car'
    const color = kind === 'dropoff' ? '#0B1524' : '#0F63BD';
    if (kind === 'car') {
      return L.divIcon({
        className: '',
        html: '<div class="dm-car"><span class="pulse"></span>' +
          '<svg viewBox="0 0 34 34">' +
          '<circle cx="17" cy="17" r="9" fill="#0F63BD" stroke="#fff" stroke-width="3"/></svg></div>',
        iconSize: [34, 34], iconAnchor: [17, 17],
      });
    }
    return L.divIcon({
      className: '',
      html: '<div class="dm-pin drop"><svg viewBox="0 0 30 38">' +
        '<path d="M15 37c0-9 9-13.4 9-22A9 9 0 106 15c0 8.6 9 13 9 22z" fill="' + color + '"/>' +
        '<circle cx="15" cy="14.5" r="4.4" fill="#fff"/></svg></div>',
      iconSize: [30, 38], iconAnchor: [15, 37],
    });
  }

  function map(el, opts) {
    opts = opts || {};
    const m = L.map(el, {
      zoomControl: opts.zoomControl !== false,
      scrollWheelZoom: opts.scrollWheelZoom !== false,
      attributionControl: true,
    }).setView([HELSINKI.lat, HELSINKI.lng], opts.zoom || 12);
    const street = L.tileLayer(TILES.url, TILES).addTo(m);
    const satellite = L.tileLayer(SATELLITE_TILES.url, SATELLITE_TILES);
    m.dmBaseLayers = { map: street, satellite };
    m.dmSetBaseLayer = (kind) => {
      const next = kind === 'satellite' ? satellite : street;
      const prev = next === satellite ? street : satellite;
      if (m.hasLayer(prev)) m.removeLayer(prev);
      if (!m.hasLayer(next)) next.addTo(m);
    };
    if (opts.initialLayer === 'satellite') m.dmSetBaseLayer('satellite');
    if (opts.layerControl !== false) {
      L.control.layers({ Map: street, Satellite: satellite }, null, {
        position: opts.layerControlPosition || 'topright',
        collapsed: true,
      }).addTo(m);
    }
    if (opts.zoomControl !== false) m.zoomControl.setPosition('topright');
    return m;
  }

  return {
    ICONS, h, escapeHtml, toast, select, segmented, datePicker, timePicker,
    autocomplete, geo, map, pinIcon, closeAll,
  };
})();

/* DriveMe — site.js
   Progressive enhancement only. Every generated page works with JavaScript
   off: the nav is a plain list, the FAQ is <details>, the hero quick start is
   a real GET form that submits to /varaus/ on its own. This file adds the
   small-screen menu, the reduced-motion guard on the hero video, and the live
   starting price on the quick start. */
(function () {
  'use strict';

  /* ---------------------------------------------------- mobile nav */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Closing on resize back to desktop avoids a nav stuck open behind the
    // media query that hides the toggle.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 880) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------- hero video ---
     autoplay is in the markup so the video runs without JS, but a viewer who
     asked their OS for reduced motion should get the poster frame instead of
     a looping reel they cannot stop. */
  var hero = document.getElementById('hero-video');
  if (hero && window.matchMedia) {
    var still = window.matchMedia('(prefers-reduced-motion: reduce)');
    var apply = function () {
      if (still.matches) {
        hero.removeAttribute('autoplay');
        hero.pause();
        hero.currentTime = 0;
        hero.load();            // repaint the poster over the paused frame
      } else if (hero.paused) {
        var p = hero.play();
        // Autoplay can still be refused (data saver, low power mode). The
        // poster carries the hero on its own, so a rejection is not an error.
        if (p && p.catch) p.catch(function () {});
      }
    };
    apply();
    if (still.addEventListener) still.addEventListener('change', apply);
    else if (still.addListener) still.addListener(apply);
  }

  /* --------------------------------------------- services menu ---
     Hover is an enhancement, never the only way in: the trigger is a real
     button, so click, Enter, Space and Escape all work, and a touch device
     that has no hover still opens it. Below the nav breakpoint the panel is
     a plain expanding block inside the collapsed menu. */
  var triggers = [].slice.call(document.querySelectorAll('.nav-trigger'));
  if (triggers.length) {
    var HOVER_MQ = window.matchMedia('(hover: hover) and (min-width: 1181px)');
    var closeTimer = null;

    var setOpen = function (trigger, open) {
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!panel) return;
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.hidden = !open;
    };
    var closeAll = function (except) {
      triggers.forEach(function (t) { if (t !== except) setOpen(t, false); });
    };

    triggers.forEach(function (trigger) {
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      var host = trigger.parentNode;

      trigger.addEventListener('click', function () {
        var open = trigger.getAttribute('aria-expanded') === 'true';
        closeAll(trigger);
        setOpen(trigger, !open);
      });

      // Pointer intent, with a grace period so crossing the gap between the
      // trigger and the panel does not snap it shut.
      host.addEventListener('mouseenter', function () {
        if (!HOVER_MQ.matches) return;
        clearTimeout(closeTimer);
        closeAll(trigger);
        setOpen(trigger, true);
      });
      host.addEventListener('mouseleave', function () {
        if (!HOVER_MQ.matches) return;
        closeTimer = setTimeout(function () { setOpen(trigger, false); }, 180);
      });

      // Leaving the whole group by keyboard closes it.
      host.addEventListener('focusout', function (e) {
        if (!host.contains(e.relatedTarget)) setOpen(trigger, false);
      });
      if (panel) {
        panel.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') { setOpen(trigger, false); trigger.focus(); }
        });
      }
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { setOpen(trigger, false); }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setOpen(trigger, true);
          var first = panel && panel.querySelector('a');
          if (first) first.focus();
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('.has-menu')) closeAll(null);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll(null);
    });
    // Crossing the breakpoint leaves a panel in the wrong mode otherwise.
    window.addEventListener('resize', function () { closeAll(null); });
  }

  /* ----------------------------------------------- entrance reveal ---
     trigger: element enters the viewport (once)
     property: opacity + translateY, 400ms entrance curve
     purpose: establishes reading order on first paint. Elements start
     visible in CSS when reduced motion is requested, and the whole thing is
     skipped where IntersectionObserver is missing — no JS, no hidden page. */
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        // 40ms stagger, capped at 6 items per the motion spec.
        var delay = Math.min(i, 5) * 40;
        setTimeout(function () { entry.target.classList.add('in'); }, delay);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    for (var r = 0; r < revealables.length; r++) io.observe(revealables[r]);
  } else {
    for (var n = 0; n < revealables.length; n++) revealables[n].classList.add('in');
  }

  /* -------------------------------------------------- floating CTA ---
     Shown only once the hero's own call to action has scrolled away, so the
     page never carries two competing primary actions at the same time. */
  var floater = document.getElementById('float-cta');
  var heroCta = document.querySelector('.hero-ctas .btn, .page-head .btn');
  if (floater) {
    if (heroCta && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        floater.classList.toggle('on', !entries[0].isIntersecting);
      }, { threshold: 0 }).observe(heroCta);
    } else {
      var onScroll = function () { floater.classList.toggle('on', window.scrollY > 640); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  /* --------------------------------------------- hero quick start ---
     Three fields, no submit of its own: it hands the service, address and
     date to the request flow as query parameters. The starting price comes
     from the option's data-from, which the build wrote from pricing.js, so
     this cannot quote a number the price list does not carry. */
  var quick = document.getElementById('quick-start');
  if (quick) {
    var service = document.getElementById('qs-service');
    var priceOut = document.getElementById('qs-from-price');
    var date = document.getElementById('qs-date');

    if (service && priceOut) {
      var showPrice = function () {
        var opt = service.options[service.selectedIndex];
        if (opt && opt.dataset.from) priceOut.textContent = opt.dataset.from;
      };
      service.addEventListener('change', showPrice);
      showPrice();
    }

    // Today is the earliest sensible collection date.
    if (date && !date.min) date.min = new Date().toISOString().slice(0, 10);

    // Drop empty fields so the handover URL carries only what was filled in.
    quick.addEventListener('submit', function () {
      var fields = quick.querySelectorAll('input, select');
      for (var i = 0; i < fields.length; i++) {
        if (!String(fields[i].value || '').trim()) fields[i].disabled = true;
      }
    });
  }
}());

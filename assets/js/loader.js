/**
 * loader.js — Multi-stage full-page preloader.
 *
 * Stage 1: a placeholder cover sits over the whole viewport (pure CSS, painted
 *          immediately so there is never a flash of unstyled content).
 * Stage 2: a "spinning globe" (horizontal latitude lines) fades in beside the
 *          brand wordmark, which types itself out letter by letter.
 * Stage 3: once the page (images + fonts) is ready, the cover is split into
 *          vertical strips that peel away — left to right, staggered — to
 *          reveal the whole page underneath. The overlay is then removed.
 *
 * The markup is injected into every generated page by lib/templates.js. This
 * script is loaded with `defer`, so it runs after parsing but before load.
 */
(function () {
  'use strict';

  var el = document.getElementById('page-loader');
  if (!el) return;

  var center = el.querySelector('.page-loader__center');
  var wordmark = el.querySelector('.page-loader__wordmark');
  var name = (el.getAttribute('data-name') || '').trim();

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STRIP_COUNT = 24;
  var STRIP_STAGGER = 18;   // ms between each strip
  var STRIP_DURATION = 420; // ms per strip
  var TYPE_SPEED = 85;      // ms per character
  var MIN_DURATION = 2000;  // keep the full sequence up at least this long
  var MAX_WAIT = 4000;      // safety net
  var done = false;
  var startTime = Date.now();

  function finish() {
    if (done) return;
    done = true;
    document.body.classList.remove('is-loading');
    document.body.removeAttribute('aria-busy');
    if (el && el.parentNode) el.parentNode.removeChild(el);
    el = null;
  }

  function buildWordmark() {
    if (!wordmark || !name) return;
    name.split('').forEach(function (ch) {
      var s = document.createElement('span');
      s.className = 'wchar';
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      wordmark.appendChild(s);
    });
  }

  function typeWordmark() {
    if (!wordmark) return;
    var chars = wordmark.querySelectorAll('.wchar');
    if (!chars.length) return;

    // Reduced motion: show the whole word at once.
    if (reduced) {
      chars.forEach(function (c) { c.classList.add('is-visible'); });
      return;
    }

    var i = 0;
    var timer = setInterval(function () {
      if (i >= chars.length) {
        clearInterval(timer);
        return;
      }
      chars[i].classList.add('is-visible');
      i += 1;
    }, TYPE_SPEED);
  }

  function startStage2() {
    if (!el) return;
    // Reveal the globe + wordmark pair.
    el.classList.add('is-stage-2');
    if (center) center.classList.add('is-visible');
    typeWordmark();
  }

  function startStage3() {
    if (!el || done) return;

    // Fade out the center lockup.
    if (center) center.classList.add('is-hidden');
    var strips = document.createElement('div');
    strips.className = 'page-loader__strips';

    var frag = document.createDocumentFragment();
    for (var i = 0; i < STRIP_COUNT; i += 1) {
      var s = document.createElement('span');
      s.className = 'strip';
      s.style.left = (i * 100 / STRIP_COUNT) + '%';
      s.style.width = (100 / STRIP_COUNT) + '%';
      frag.appendChild(s);
    }
    strips.appendChild(frag);
    el.appendChild(strips);

    // Reduced motion: skip the blinds, just fade the whole cover out.
    if (reduced) {
      el.classList.add('is-done');
      setTimeout(finish, 500);
      return;
    }

    // Move the placeholder gradient onto the strips, then collapse them so the
    // real hero (which shares the same background) is revealed underneath.
    el.classList.add('is-revealing');

    // Force reflow so the transitions below start from the fully-stretched
    // state, then collapse each strip upward with a stagger.
    void strips.offsetWidth;
    var items = strips.querySelectorAll('.strip');
    items.forEach(function (item, idx) {
      item.style.transition =
        'transform ' + STRIP_DURATION + 'ms cubic-bezier(0.65, 0, 0.35, 1) ' +
        (idx * STRIP_STAGGER) + 'ms';
      item.style.transform = 'scaleY(0)';
    });

    var total = (STRIP_COUNT - 1) * STRIP_STAGGER + STRIP_DURATION + 80;
    setTimeout(finish, total);
  }

  buildWordmark();

  // Record that the loader has shown this session, so subsequent page
  // navigations in the same tab skip it entirely (no repeat animation).
  try { sessionStorage.setItem('loaderShown', '1'); } catch (e) {}

  // Lock scrolling while the overlay is active.
  document.body.classList.add('is-loading');
  document.body.setAttribute('aria-busy', 'true');

  // Guard: never reveal before the minimum duration has elapsed so the full
  // sequence (cover → globe/wordmark → strips) always plays out. Reduced
  // motion skips straight to the fade instead.
  function requestStage3() {
    if (reduced) {
      startStage3();
      return;
    }
    var elapsed = Date.now() - startTime;
    var remaining = MIN_DURATION - elapsed;
    if (remaining > 0) {
      setTimeout(startStage3, remaining);
    } else {
      startStage3();
    }
  }

  // Stage 2 shortly after parse (a brief beat of the plain cover first).
  if (reduced) {
    startStage2();
  } else {
    setTimeout(startStage2, 200);
  }

  // Stage 3 once both the page assets and the webfonts are ready.
  var assetsReady = new Promise(function (resolve) {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });
  var fontsReady = document.fonts && document.fonts.ready
    ? document.fonts.ready
    : Promise.resolve();

  Promise.all([assetsReady, fontsReady]).then(requestStage3);

  // Safety net: never leave the cover up if something hangs.
  setTimeout(startStage3, MAX_WAIT);
})();

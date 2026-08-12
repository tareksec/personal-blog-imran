/**
 * post.js — Post detail page enhancements: reading progress bar and
 * share buttons (share buttons handled globally in main.js).
 */
(function () {
  'use strict';

  // Reading progress bar
  var bar = document.createElement('div');
  bar.className = 'reading-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  var ticking = false;
  function update() {
    var doc = document.documentElement;
    var total = doc.scrollHeight - doc.clientHeight;
    var pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
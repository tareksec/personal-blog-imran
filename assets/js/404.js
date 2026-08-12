/**
 * 404.js — Search box on the 404 page: redirects to the blog listing
 * with the query pre-filled.
 */
(function () {
  'use strict';
  var input = document.getElementById('nf-search');
  if (!input) return;

  function go() {
    var q = input.value.trim();
    window.location.href = q ? '/blog?q=' + encodeURIComponent(q) : '/blog';
  }
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); go(); }
  });
})();
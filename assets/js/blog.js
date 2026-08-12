/**
 * blog.js — Client-side search/filter for the blog listing page.
 * Uses the statically embedded window.__BLOG_POSTS__ data.
 */
(function () {
  'use strict';

  var input = document.getElementById('blog-search');
  var grid = document.getElementById('post-grid');
  var empty = document.getElementById('search-empty');
  if (!input || !grid) return;

  var posts = window.__BLOG_POSTS__ || [];
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.post-card'));

  // Pre-fill from ?q= (used by the 404 page search)
  var params = new URLSearchParams(window.location.search);
  var initial = params.get('q') || '';
  if (initial) {
    input.value = initial;
    input.dispatchEvent(new Event('input'));
  }

  function normalize(s) {
    return s.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  input.addEventListener('input', function () {
    var q = normalize(input.value);
    var visible = 0;

    cards.forEach(function (card, i) {
      var post = posts[i] || {};
      var haystack = normalize((post.title || '') + ' ' + (post.excerpt || '') + ' ' + ((post.category && post.category.label) || ''));
      var show = !q || haystack.indexOf(q) !== -1;
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });

    if (empty) empty.classList.toggle('is-hidden', visible > 0);
  });
})();
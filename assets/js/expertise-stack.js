(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    // Add js-ready class so CSS can hide elements before they animate
    document.body.classList.add('js-ready');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Optional: unobserve if you only want it to animate once
            // observer.unobserve(entry.target);
          } else {
            // Remove class to animate out when scrolled past (like react useScrollAnimation)
            entry.target.classList.remove('in-view');
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
      });

      var fadeEls = document.querySelectorAll('.expertise-fade');
      fadeEls.forEach(function(el) {
        observer.observe(el);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      var fadeEls = document.querySelectorAll('.expertise-fade');
      fadeEls.forEach(function(el) {
        el.classList.add('in-view');
      });
    }
  });
})();

/**
 * Reusable 3D stacked-card carousel.
 * Vanilla JS, no dependencies.
 *
 * Usage: each carousel container must have:
 *   - class "carousel-3d"
 *   - children ".carousel-item" with data-index
 *   - buttons ".carousel-arrow--prev" and ".carousel-arrow--next"
 *   - optional ".carousel-dot" buttons with data-dot
 */
(function () {
  'use strict';

  var AUTOPLAY_MS = 1000;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function initCarousel(carousel) {
    if (!carousel) return;

    var items = carousel.querySelectorAll('.carousel-item');
    var prevBtn = carousel.querySelector('.carousel-arrow--prev');
    var nextBtn = carousel.querySelector('.carousel-arrow--next');
    var dots = carousel.querySelectorAll('.carousel-dot');
    var total = items.length;
    if (total === 0) return;

    var activeIndex = 0;
    var autoplayInterval = null;
    var isInViewport = false;

    function updateCarousel() {
      for (var i = 0; i < total; i++) {
        var item = items[i];
        var offset = i - activeIndex;

        // Wrap offset for circular behavior
        if (offset > total / 2) offset -= total;
        if (offset < -total / 2) offset += total;

        item.classList.remove('carousel-item--active', 'carousel-item--prev', 'carousel-item--next', 'carousel-item--far');

        if (offset === 0) {
          item.classList.add('carousel-item--active');
        } else if (offset === -1) {
          item.classList.add('carousel-item--prev');
        } else if (offset === 1) {
          item.classList.add('carousel-item--next');
        } else {
          item.classList.add('carousel-item--far');
        }
      }

      // Update dots
      for (var d = 0; d < dots.length; d++) {
        dots[d].classList.toggle('is-active', d === activeIndex);
      }
    }

    function goTo(index) {
      activeIndex = mod(index, total);
      updateCarousel();
    }

    function goNext() {
      goTo(activeIndex + 1);
    }

    function goPrev() {
      goTo(activeIndex - 1);
    }

    // ── Autoplay ──

    function startAutoplay() {
      if (prefersReducedMotion) return;
      stopAutoplay();
      autoplayInterval = setInterval(goNext, AUTOPLAY_MS);
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // ── Event Listeners ──

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goPrev();
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goNext();
        resetAutoplay();
      });
    }

    // Dot navigation
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = parseInt(dot.getAttribute('data-dot'), 10);
        goTo(index);
        resetAutoplay();
      });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', function () {
      stopAutoplay();
    });
    carousel.addEventListener('mouseleave', function () {
      if (isInViewport) startAutoplay();
    });

    // Viewport-aware autoplay + keyboard
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isInViewport = entry.isIntersecting;
          if (isInViewport) {
            startAutoplay();
          } else {
            stopAutoplay();
          }
        });
      }, { threshold: 0.3 });
      observer.observe(carousel);
    } else {
      isInViewport = true;
      startAutoplay();
    }

    document.addEventListener('keydown', function (e) {
      if (!isInViewport) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
        resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
        resetAutoplay();
      }
    });

    // Reduced motion
    if (prefersReducedMotion) {
      carousel.classList.add('carousel--reduced-motion');
    }

    // Init
    updateCarousel();
  }

  // ── Initialize all carousels on the page ──
  var carousels = document.querySelectorAll('.carousel-3d');
  carousels.forEach(function (el) {
    initCarousel(el);
  });
})();

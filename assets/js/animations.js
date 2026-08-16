/**
 * animations.js — GSAP animation controller
 * Provides premium-feeling scroll-driven animations, parallax,
 * hero entrance timelines, and interactive micro-effects.
 *
 * Dependencies: gsap.min.js + ScrollTrigger.min.js (loaded via CDN before this file)
 * Architecture: vanilla JS IIFE — no framework, works on every static page.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* 0. Guard: bail early if GSAP didn't load or reduced-motion active  */
  /* ------------------------------------------------------------------ */

  if (typeof gsap === 'undefined') return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // Make all content visible immediately — CSS fallback handles the rest
    var reveals = document.querySelectorAll('.reveal');
    for (var i = 0; i < reveals.length; i++) {
      reveals[i].style.opacity = '1';
      reveals[i].style.transform = 'none';
    }
    return;
  }

  /* ------------------------------------------------------------------ */
  /* 1. Register plugin + mark document as GSAP-ready                   */
  /* ------------------------------------------------------------------ */

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('gsap-ready');

  // Default easing for premium feel
  gsap.defaults({ ease: 'power3.out' });

  /* ------------------------------------------------------------------ */
  /* 2. Hero entrance timeline (home page only)                         */
  /* ------------------------------------------------------------------ */

  function initHero() {
    var heroCopy = document.querySelector('.hero .hero-copy');
    if (!heroCopy) return;

    var eyebrow = heroCopy.querySelector('.eyebrow');
    var heading = heroCopy.querySelector('h1');
    var subtitle = heroCopy.querySelector('.hero-subtitle');
    var stats = heroCopy.querySelector('.hero-stats');
    var actions = heroCopy.querySelector('.hero-actions');
    var social = heroCopy.querySelector('.hero-social');
    var visual = document.querySelector('.hero .hero-visual');

    // Collect elements that exist
    var elements = [eyebrow, heading, subtitle, stats, actions, social, visual].filter(Boolean);
    if (!elements.length) return;

    // Set initial hidden state
    gsap.set(elements, { opacity: 0, y: 30 });

    // Also hide floating badges for staggered reveal
    var badges = document.querySelectorAll('.hero-badge');
    if (badges.length) gsap.set(badges, { opacity: 0, scale: 0.8 });

    // Build staggered timeline
    var tl = gsap.timeline({
      delay: 0.15, // slight delay for page settle
      defaults: { duration: 0.8, ease: 'power3.out' }
    });

    elements.forEach(function (el, i) {
      tl.to(el, {
        opacity: 1,
        y: 0,
        duration: el === visual ? 1 : 0.8,
      }, i * 0.15); // 0.15s stagger between elements
    });

    // Animate badges in after visual appears
    if (badges.length) {
      badges.forEach(function (badge, i) {
        tl.to(badge, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
        }, '-=0.3' );
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* 3. Hero parallax (ScrollTrigger scrub)                             */
  /* ------------------------------------------------------------------ */

  function initHeroParallax() {
    var heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    var visual = heroSection.querySelector('.hero-visual');
    var gridBg = heroSection.classList.contains('bg-grid-pattern') ? heroSection : null;

    // Parallax on hero image — moves slower than scroll
    if (visual) {
      gsap.to(visual, {
        y: 80,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        }
      });
    }

    // Subtle parallax on grid background
    if (gridBg) {
      gsap.to(gridBg, {
        backgroundPositionY: '40px',
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* 4. Scroll-reveal upgrade (replaces IntersectionObserver approach)   */
  /* ------------------------------------------------------------------ */

  function initScrollReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    revealEls.forEach(function (el) {
      // Compute stagger delay from CSS custom property
      var stagger = el.style.getPropertyValue('--stagger');
      var delay = stagger ? parseInt(stagger, 10) * 0.1 : 0;

      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            end: 'top 60%',
            toggleActions: 'play none none none',
            once: true,
          }
        }
      );
    });
  }

  /* ------------------------------------------------------------------ */
  /* 5. Section transitions — subtle scale + opacity on enter           */
  /* ------------------------------------------------------------------ */

  function initSectionTransitions() {
    var sections = document.querySelectorAll('.section');
    if (!sections.length) return;

    sections.forEach(function (section) {
      // Skip hero — it has its own entrance
      if (section.classList.contains('hero')) return;

      gsap.fromTo(section,
        { opacity: 0.85, scale: 0.985 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            end: 'top 60%',
            toggleActions: 'play none none none',
            once: true,
          }
        }
      );
    });
  }

  /* ------------------------------------------------------------------ */
  /* 6. Magnetic CTA buttons — subtle pull toward cursor on hover       */
  /* ------------------------------------------------------------------ */

  function initMagneticButtons() {
    // Only on non-touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    var btns = document.querySelectorAll('.btn-primary, .btn-ghost, .btn-light');
    if (!btns.length) return;

    var MAX_SHIFT = 4; // pixels

    btns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) / (rect.width / 2) * MAX_SHIFT;
        var dy = (e.clientY - cy) / (rect.height / 2) * MAX_SHIFT;

        gsap.to(btn, {
          x: dx,
          y: dy,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });

      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto',
        });
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 7. Expertise cards stagger (home page)                              */
  /* ------------------------------------------------------------------ */

  function initExpertiseStagger() {
    var container = document.getElementById('expertiseInteractive');
    if (!container) return;

    var tabs = container.querySelectorAll('.expertise-tab-wrapper');
    if (!tabs.length) return;

    // These already have .reveal, but we add a tighter grouped stagger
    gsap.fromTo(tabs,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        }
      }
    );
  }

  /* ------------------------------------------------------------------ */
  /* 8. Achievement cards entrance with scale                            */
  /* ------------------------------------------------------------------ */

  function initAchievementCards() {
    var cards = document.querySelectorAll('.achieve-card');
    if (!cards.length) return;

    gsap.fromTo(cards,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cards[0].closest('.achieve-grid') || cards[0],
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        }
      }
    );
  }

  /* ------------------------------------------------------------------ */
  /* 9. Page hero entrance (about, blog, contact pages)                  */
  /* ------------------------------------------------------------------ */

  function initPageHero() {
    var pageHero = document.querySelector('.page-hero');
    if (!pageHero) return;

    var heading = pageHero.querySelector('h1');
    var lead = pageHero.querySelector('.page-lead');
    var elements = [heading, lead].filter(Boolean);

    if (!elements.length) return;

    gsap.set(elements, { opacity: 0, y: 20 });

    var tl = gsap.timeline({
      delay: 0.1,
      defaults: { duration: 0.7, ease: 'power3.out' }
    });

    elements.forEach(function (el, i) {
      tl.to(el, { opacity: 1, y: 0 }, i * 0.15);
    });
  }

  /* ------------------------------------------------------------------ */
  /* INIT                                                                */
  /* ------------------------------------------------------------------ */

  initHero();
  initPageHero();
  initHeroParallax();
  initScrollReveal();
  initSectionTransitions();
  initExpertiseStagger();
  initAchievementCards();
  initMagneticButtons();

  /* ------------------------------------------------------------------ */
  /* CLEANUP — prevent memory leaks on multi-page navigation            */
  /* ------------------------------------------------------------------ */

  window.addEventListener('beforeunload', function () {
    ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
  });

})();

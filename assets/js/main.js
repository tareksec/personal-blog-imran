/**
 * main.js — Global behaviour: mobile nav, contact form (client-side
 * validation + honeypot + fetch to /api/contact), and share buttons.
 */
(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  var overlay = document.getElementById('nav-overlay');
  if (toggle && nav) {
    function closeNav() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (overlay) overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    function openNav() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      if (overlay) overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) { closeNav(); }
      else { openNav(); }
    });

    // Close on overlay click
    if (overlay) {
      overlay.addEventListener('click', closeNav);
    }

    // Close when a link inside nav is clicked
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');
    var submitBtn = document.getElementById('cf-submit');

    function setFieldError(name, message) {
      var field = form.querySelector('[name="' + name + '"]');
      if (!field) return;
      var wrap = field.closest('.form-field');
      var err = wrap ? wrap.querySelector('.field-error') : null;
      if (err) err.textContent = message || '';
      if (wrap) wrap.classList.toggle('has-error', Boolean(message));
    }

    function validate() {
      var ok = true;
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var subject = form.elements.subject.value.trim();
      var message = form.elements.message.value.trim();

      if (name.length < 2) { setFieldError('name', 'Please enter your name (at least 2 characters).'); ok = false; }
      else setFieldError('name', '');

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setFieldError('email', 'Please enter a valid email address.'); ok = false; }
      else setFieldError('email', '');

      if (subject.length < 2) { setFieldError('subject', 'Please add a short subject.'); ok = false; }
      else setFieldError('subject', '');

      if (message.length < 10) { setFieldError('message', 'Please write a message of at least 10 characters.'); ok = false; }
      else setFieldError('message', '');

      return ok;
    }

    // Live re-validation on input
    ['name', 'email', 'subject', 'message'].forEach(function (n) {
      var el = form.elements[n];
      if (el) el.addEventListener('input', function () { if (el.closest('.form-field').classList.contains('has-error')) validate(); });
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (status) { status.className = 'form-status'; status.textContent = ''; }
      if (!validate()) return;

      var payload = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        subject: form.elements.subject.value.trim(),
        message: form.elements.message.value.trim(),
        website: form.elements.website ? form.elements.website.value.trim() : '',
      };

      if (submitBtn) submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      try {
        var res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        var data = await res.json().catch(function () { return {}; });

        if (res.ok && data.success) {
          if (status) { status.className = 'form-status is-success'; status.textContent = 'Thank you! Your message has been sent. I’ll get back to you soon.'; }
          form.reset();
        } else {
          var msg = data && data.error ? data.error : 'Something went wrong. Please try again or email me directly.';
          if (status) { status.className = 'form-status is-error'; status.textContent = msg; }
        }
      } catch (err) {
        if (status) { status.className = 'form-status is-error'; status.textContent = 'Network error — please check your connection and try again.'; }
      } finally {
        if (submitBtn) submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }
    });
  }

  /* ---------- Share buttons (delegated, works on post pages) ---------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-share]');
    if (!btn) return;
    var wrap = btn.closest('[data-share-url]');
    if (!wrap) return;
    var url = wrap.getAttribute('data-share-url');
    var title = wrap.getAttribute('data-share-title') || '';
    var full = window.location.origin + url;
    var kind = btn.getAttribute('data-share');
    var href = '';

    if (kind === 'facebook') href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(full);
    else if (kind === 'twitter') href = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(full) + '&text=' + encodeURIComponent(title);
    else if (kind === 'linkedin') href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(full);
    else if (kind === 'whatsapp') href = 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + full);
    else if (kind === 'copy') {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(full).then(function () {
          var old = btn.innerHTML;
          btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>';
          setTimeout(function () { btn.innerHTML = old; }, 1600);
        });
      }
      return;
    }

    if (href) window.open(href, '_blank', 'noopener,width=640,height=520');
  });

  /* ---------- Scroll-reveal animation (CSS fallback, skipped if GSAP active) ---------- */
  (function () {
    if (document.documentElement.classList.contains('gsap-ready')) return;

    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
      // No support — just show everything
      for (var i = 0; i < revealEls.length; i++) revealEls[i].classList.add('is-visible');
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add('is-visible');
            observer.unobserve(entries[i].target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    for (var j = 0; j < revealEls.length; j++) observer.observe(revealEls[j]);
  })();

  /* ---------- Subscribe form ---------- */
  var subForm = document.getElementById('subscribe-form');
  if (subForm) {
    var subStatus = document.getElementById('subscribe-status');
    var subBtn = document.getElementById('sub-submit');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }

    subForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (subStatus) { subStatus.className = 'subscribe-status'; subStatus.textContent = ''; }

      var email = (subForm.elements.email.value || '').trim();
      if (!validateEmail(email)) {
        if (subStatus) { subStatus.className = 'subscribe-status is-error'; subStatus.textContent = 'Please enter a valid email address.'; }
        return;
      }

      if (subBtn) subBtn.classList.add('is-loading');
      if (subBtn) subBtn.disabled = true;

      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, website: (subForm.elements.website || {}).value || '' }),
      })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (result) {
          if (result.ok && result.data.success) {
            if (subStatus) { subStatus.className = 'subscribe-status is-success'; subStatus.textContent = result.data.message || 'Thanks for subscribing!'; }
            subForm.reset();
          } else {
            var msg = result.data && result.data.error ? result.data.error : 'Something went wrong. Please try again.';
            if (subStatus) { subStatus.className = 'subscribe-status is-error'; subStatus.textContent = msg; }
          }
        })
        .catch(function () {
          if (subStatus) { subStatus.className = 'subscribe-status is-error'; subStatus.textContent = 'Network error — please try again.'; }
        })
        .finally(function () {
          if (subBtn) subBtn.classList.remove('is-loading');
          if (subBtn) subBtn.disabled = false;
        });
    });
  }

  /* ---------- Counter animation (count-up) ---------- */
  (function () {
    var countEls = document.querySelectorAll('.achieve-value[data-target]');
    if (!countEls.length) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateCount(el, target, duration) {
      if (prefersReduced) {
        el.textContent = target % 1 === 0 ? String(target) : target.toFixed(0);
        return;
      }
      var start = performance.now();
      var startVal = 0;
      function tick(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        // easeOutExpo for a polished deceleration
        var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        var current = Math.round(startVal + (target - startVal) * eased);
        el.textContent = String(current) + (target < 10 && target % 1 !== 0 ? '+' : '');
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target % 1 === 0 ? String(target) : String(target);
        }
      }
      requestAnimationFrame(tick);
    }

    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < countEls.length; i++) {
        var el = countEls[i];
        var target = parseInt(el.getAttribute('data-target'), 10) || 0;
        animateCount(el, target, 1600);
      }
      return;
    }

    var countObserver = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          var el = entries[i].target;
          var target = parseInt(el.getAttribute('data-target'), 10) || 0;
          animateCount(el, target, 1600);
          countObserver.unobserve(el);
        }
      }
    }, { threshold: 0.4 });

    for (var j = 0; j < countEls.length; j++) {
      countObserver.observe(countEls[j]);
    }
  })();

  /* ---------- Flip Fade Text Animation ---------- */
  (function() {
    var containers = document.querySelectorAll('.flip-fade-container');
    if (!containers.length) return;
    
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return; // Keep static if animations disabled

    for (var i = 0; i < containers.length; i++) {
      var container = containers[i];
      var words = container.querySelectorAll('.flip-word');
      if (words.length <= 1) continue;

      (function(wordsArr) {
        var currentIndex = 0;
        setInterval(function() {
          var prevWord = wordsArr[currentIndex];
          prevWord.classList.remove('active');
          prevWord.classList.add('exit');
          
          currentIndex = (currentIndex + 1) % wordsArr.length;
          var nextWord = wordsArr[currentIndex];
          
          nextWord.classList.remove('exit');
          setTimeout(function() {
            nextWord.classList.add('active');
          }, 30);
        }, 2800);
      })(words);
    }
  })();

  /* ---------- Expertise Interactive Tabs ---------- */
  (function() {
    var container = document.getElementById('expertiseInteractive');
    if (!container) return;

    var tablist = container.querySelector('.expertise-tablist');
    var tabs = container.querySelectorAll('.expertise-tab');
    var panels = container.querySelectorAll('.expertise-panel');
    var accordions = container.querySelectorAll('.expertise-accordion-body');
    if (!tabs.length) return;

    var manualOverride = false;
    
    function switchTab(newIndex) {
      for (var i = 0; i < tabs.length; i++) {
        var isTarget = (i === newIndex);
        
        // Tab button state
        tabs[i].setAttribute('aria-selected', isTarget ? 'true' : 'false');
        tabs[i].classList.toggle('is-active', isTarget);
        
        // Desktop panel state
        if (panels[i]) {
          panels[i].setAttribute('aria-hidden', isTarget ? 'false' : 'true');
          panels[i].classList.toggle('is-active', isTarget);
        }
        
        // Mobile accordion state
        if (accordions[i]) {
          accordions[i].classList.toggle('is-active', isTarget);
        }
      }
    }

    // Click handling
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function(e) {
        manualOverride = true;
        var idx = parseInt(this.getAttribute('data-index'), 10);
        switchTab(idx);
      });
    }

    // Keyboard navigation (ARIA tabs pattern)
    if (tablist) {
      tablist.addEventListener('keydown', function(e) {
        var currentTab = document.activeElement;
        if (!currentTab || !currentTab.classList.contains('expertise-tab')) return;
        
        var idx = parseInt(currentTab.getAttribute('data-index'), 10);
        var nextIdx = idx;
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          nextIdx = (idx + 1) % tabs.length;
          e.preventDefault();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          nextIdx = (idx - 1 + tabs.length) % tabs.length;
          e.preventDefault();
        } else if (e.key === 'Home') {
          nextIdx = 0;
          e.preventDefault();
        } else if (e.key === 'End') {
          nextIdx = tabs.length - 1;
          e.preventDefault();
        }

        if (nextIdx !== idx) {
          manualOverride = true;
          tabs[nextIdx].focus();
          switchTab(nextIdx);
        }
      });
    }

    // Optional Auto-advance when scrolling into view
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        if (manualOverride) return;
        var isVisible = entries[0].isIntersecting;
        if (isVisible && !window.matchMedia('(max-width: 1023px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          var activeIdx = 0;
          var interval = setInterval(function() {
            if (manualOverride) {
              clearInterval(interval);
              return;
            }
            activeIdx = (activeIdx + 1) % tabs.length;
            switchTab(activeIdx);
          }, 3500);
          observer.unobserve(container);
        }
      }, { threshold: 0.35 });
      observer.observe(container);
    }
  })();

})();
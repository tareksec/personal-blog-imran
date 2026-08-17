/**
 * lib/templates.js — Shared HTML templates used by sync-cli.js to
 * generate every page of the site (home, about, contact, blog,
 * post detail, category, 404). Guarantees a consistent header/footer
 * and complete SEO meta on every page.
 */

const { SITE, IMAGES, ABOUT, CONTACT, BEC, NAV, TESTIMONIALS, PRIVACY, TERMS, AFFILIATIONS } = require('./content');
const { escapeHtml, formatDate } = require('./posts');

/* ------------------------------------------------------------------ */
/* Icons (inline SVG)                                                  */
/* ------------------------------------------------------------------ */

const ICONS = {
  menu: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
  user: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg>',
  tag: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9z"/><circle cx="8" cy="8" r="1.5"/></svg>',
  phone: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-8.6c0-2.05-.04-4.7-2.86-4.7-2.87 0-3.3 2.24-3.3 4.55V24H8V8z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L1 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L7.1 3.9H5.3L17.8 20z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07z"/></svg>',
  rss: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.2 20.2a2.2 2.2 0 1 1-4.4 0 2.2 2.2 0 0 1 4.4 0zM2 9.5v3.2c5.1 0 9.3 4.2 9.3 9.3h3.2C14.5 15.4 9.6 9.5 2 9.5zM2 2v3.2c9.3 0 16.8 7.5 16.8 16.8H22C22 11 13 2 2 2z"/></svg>',
  share: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>',
  copy: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  quote: '<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M10 7H6a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-7zm11 0h-4a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-7z"/></svg>',
  star: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  award: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
  book: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  users: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  target: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  video: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
  zap: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  send: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  globe: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  /* Expertise-specific icons */
  building: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M8 10h.01M12 6h.01M12 10h.01M16 6h.01M16 10h.01"/></svg>',
  trendingUp: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  userPlus: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  lightbulb: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',
  pieChart: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>',
};

/* ------------------------------------------------------------------ */
/* Layout shell                                                        */
/* ------------------------------------------------------------------ */

function layout({
  title,
  description,
  canonical,
  ogImage = '/assets/og-default.svg',
  ogType = 'website',
  activeNav = '',
  body,
  jsonLd = [],
  extraHead = '',
  bodyClass = '',
}) {
  const ogTitle = title;
  const jsonLdHtml = jsonLd
    .filter((obj) => obj && typeof obj === 'object')
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}"/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<link rel="canonical" href="${escapeHtml(canonical)}"/>
<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2"/>
<link rel="icon" type="image/x-icon" href="/favicon.ico?v=2"/>
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png?v=2"/>
<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2"/>
<link rel="manifest" href="/manifest.json?v=2"/>
<meta property="og:type" content="${escapeHtml(ogType)}"/>
<meta property="og:site_name" content="${escapeHtml(SITE.name)}"/>
<meta property="og:title" content="${escapeHtml(ogTitle)}"/>
<meta property="og:description" content="${escapeHtml(description)}"/>
<meta property="og:url" content="${escapeHtml(canonical)}"/>
<meta property="og:image" content="${escapeHtml(ogImage)}"/>
<meta property="og:locale" content="${SITE.locale}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${escapeHtml(ogTitle)}"/>
<meta name="twitter:description" content="${escapeHtml(description)}"/>
<meta name="twitter:image" content="${escapeHtml(ogImage)}"/>
<meta name="theme-color" content="${SITE.themeColor}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=Hind+Siliguri:wght@400;500;600&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/assets/css/style.css?v=3"/>
${extraHead}
${jsonLdHtml}
</head>
<body class="${escapeHtml(bodyClass)}">
${pageLoader()}
<script>
(function () {
  try {
    if (sessionStorage.getItem('loaderShown') === '1') {
      var l = document.getElementById('page-loader');
      if (l) l.parentNode.removeChild(l);
      document.documentElement.className += ' loader-skipped';
    }
  } catch (e) {}
})();
</script>
<noscript><style>.page-loader{display:none}</style></noscript>
${header(activeNav)}
<main id="main">${body}</main>
${footer()}
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js" defer></script>
<script src="/assets/js/loader.js" defer></script>
<script src="/assets/js/animations.js" defer></script>
<script src="/assets/js/main.js" defer></script>
<script src="/assets/js/expertise-stack.js" defer></script>
<script src="/assets/js/carousel.js" defer></script>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/* Header / Footer                                                     */
/* ------------------------------------------------------------------ */

function header(activeKey) {
  const navLinks = NAV.map(
    (item) =>
      `<a class="pill-nav-link${item.key === activeKey ? ' is-active' : ''}" href="${item.href}">${item.label}</a>`
  ).join('\n');

  const mobileLinks = NAV.map(
    (item) =>
      `<a class="pill-mobile-link${item.key === activeKey ? ' is-active' : ''}" href="${item.href}">${item.label}</a>`
  ).join('\n');

  return `<header class="pill-nav-container" id="site-header-wrapper">
  <a class="pill-brand" href="/" aria-label="${escapeHtml(SITE.name)} — Home">
    <img src="/assets/images/logo-v2.png" alt="${escapeHtml(SITE.shortName)}" class="navbar-logo" />
  </a>

  <nav class="pill-nav-menu" role="navigation" aria-label="Main">
    ${navLinks}
  </nav>

  <div class="pill-right">
    <a class="btn-pill" href="/contact">Contact Me</a>
    <button class="pill-toggle" id="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Toggle menu">
      <span class="icon-open">${ICONS.menu}</span>
      <span class="icon-close">${ICONS.close}</span>
    </button>
  </div>

  <div class="pill-mobile-nav" id="site-nav" aria-hidden="true">
    ${mobileLinks}
    <a class="btn-pill" href="/contact">Contact Me</a>
  </div>
</header>
<div class="nav-overlay" id="nav-overlay" aria-hidden="true"></div>`;
}

function footer() {
  const topicLinks = [
    ['Real Estate & Investment', '/blog/category/real-estate-investment'],
    ['Career & Leadership', '/blog/category/career-leadership'],
    ['HR & Recruitment', '/blog/category/hr-recruitment'],
    ['Business Strategy & CX', '/blog/category/business-strategy'],
    ['Global Issues', '/blog/category/global-issues'],
    ['Professional Etiquette', '/blog/category/professional-etiquette'],
  ]
    .map(([label, href]) => `<li><a href="${href}">${label}</a></li>`)
    .join('\n');

  return `<div class="modern-footer-wrapper">
  <div class="footer-top-strip">
    <div class="footer-strip-left">
      <span class="strip-icon">${ICONS.star || '✨'}</span>
      Follow my journey across platforms
    </div>
    <div class="footer-strip-right">
      <a class="pill-social" href="${SITE.social.linkedin}" target="_blank" rel="noopener">${ICONS.linkedin} LinkedIn</a>
      <a class="pill-social" href="${SITE.social.twitter}" target="_blank" rel="noopener">${ICONS.twitter} X (Twitter)</a>
      <a class="pill-social" href="${SITE.social.facebook}" target="_blank" rel="noopener">${ICONS.facebook} Facebook</a>
      <a class="pill-social" href="${SITE.blogSource}" target="_blank" rel="noopener">${ICONS.rss} Blogger</a>
    </div>
  </div>

  <footer class="modern-footer-card">
    <div class="footer-newsletter-block">
      <div class="newsletter-content">
        <h2 class="newsletter-heading">Get insights delivered to your inbox</h2>
        <p class="newsletter-subheading">Join readers receiving thought leadership on Real Estate, Leadership &amp; Business Strategy — straight from the blog.</p>
        <form class="modern-subscribe-form" id="subscribe-form" action="/api/subscribe.js" method="POST">
          <input type="email" name="email" class="modern-email-input" placeholder="Your email address" required aria-label="Email Address">
          <button type="submit" class="btn modern-btn-primary">Subscribe</button>
        </form>
        <p id="subscribe-msg" style="margin-top: 12px; font-size: 0.9rem;"></p>
      </div>
      <div class="newsletter-illustration">
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="70" cy="70" r="68" stroke="var(--color-primary)" stroke-width="2" stroke-dasharray="8 8" opacity="0.4"/>
          <rect x="30" y="45" width="80" height="50" rx="4" stroke="#fff" stroke-width="3" opacity="0.9"/>
          <path d="M30 45L70 75L110 45" stroke="#fff" stroke-width="3" opacity="0.9"/>
        </svg>
      </div>
    </div>

    <div class="footer-contact-banner">
      <div>
        <h2 class="contact-banner-heading">Have a question or an idea to discuss?</h2>
        <p class="contact-banner-subtext">Whether it’s real estate investment, leadership, or a speaking opportunity — I’d love to hear from you.</p>
      </div>
      <a href="/contact" class="btn modern-btn-light">Let's Connect</a>
    </div>

    <div class="modern-footer-columns">
      <div class="brand-col">
        <img src="/assets/images/logo-footer-v2.png" alt="${escapeHtml(SITE.name)}" class="modern-footer-logo" />
        <p class="modern-footer-tagline">${escapeHtml(SITE.tagline)}. ${escapeHtml(SITE.role)} at ${escapeHtml(SITE.organization)}.</p>
        <div class="modern-social-circles">
          <a href="${SITE.social.linkedin}" class="social-circle" target="_blank" rel="noopener" aria-label="LinkedIn">${ICONS.linkedin}</a>
          <a href="${SITE.social.twitter}" class="social-circle" target="_blank" rel="noopener" aria-label="X (Twitter)">${ICONS.twitter}</a>
          <a href="${SITE.social.facebook}" class="social-circle" target="_blank" rel="noopener" aria-label="Facebook">${ICONS.facebook}</a>
          <a href="${SITE.blogSource}" class="social-circle" target="_blank" rel="noopener" aria-label="Blogger">${ICONS.rss}</a>
        </div>
      </div>
      
      <div>
        <h3 class="modern-footer-col-title">Explore</h3>
        <ul class="modern-footer-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About Me</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/testimonials">Testimonials</a></li>
          <li><a href="/bec">BEC</a></li>
          <li><a href="/blog">All Insights</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>

      <div>
        <h3 class="modern-footer-col-title">Resources</h3>
        <ul class="modern-footer-links">
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="/terms-of-service">Terms of Service</a></li>
          <li><a href="/sitemap.xml">Sitemap</a></li>
          <li><a href="/robots.txt">Robots</a></li>
          <li><a href="${SITE.blogSource}" target="_blank" rel="noopener">Original Blog</a></li>
        </ul>
      </div>

      <div>
        <h3 class="modern-footer-col-title">Get in Touch</h3>
        <ul class="modern-footer-contact-list">
          <li>
            <div class="icon-badge">${ICONS.phone}</div>
            <a href="tel:${SITE.phones[0].replace(/[^+\d]/g, '')}">${escapeHtml(SITE.phones[0])}</a>
          </li>
          <li>
            <div class="icon-badge">${ICONS.phone}</div>
            <a href="tel:${SITE.phones[1].replace(/[^+\d]/g, '')}">${escapeHtml(SITE.phones[1])}</a>
          </li>
          <li>
            <div class="icon-badge">${ICONS.mail}</div>
            <a href="mailto:${escapeHtml(SITE.email)}">${escapeHtml(SITE.email)}</a>
          </li>
          <li>
            <div class="icon-badge">${ICONS.pin}</div>
            <span>${escapeHtml(SITE.officeAddress)}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="modern-footer-bottom">
      <p>© ${new Date().getFullYear()} ${escapeHtml(SITE.name)}. All rights reserved.</p>
      <p>Developed by <a href="https://artx.techvrs.com/" target="_blank" rel="noopener" style="color: rgba(255,255,255,0.75);">Artx</a></p>
    </div>
  </footer>
</div>`;
}

/* ------------------------------------------------------------------ */
/* Shared components                                                   */
/* ------------------------------------------------------------------ */

function postCard(post, { showExcerpt = true, revealStagger = null, isFeatured = false } = {}) {
  const href = `/blog/${post.slug}`;
  const img = post.image
    ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="lazy" decoding="async"/>`
    : `<div class="card-thumb card-thumb-fallback" aria-hidden="true">${ICONS.quote}</div>`;
  const baseClass = isFeatured ? 'post-card post-card--featured' : 'post-card';
  const cardClass = revealStagger !== null ? `${baseClass} reveal` : baseClass;
  const cardStyle = revealStagger !== null ? ` style="--stagger:${revealStagger}"` : '';
  return `<article class="${cardClass}"${cardStyle}>
  <a class="card-thumb-link" href="${href}" tabindex="-1" aria-hidden="true">${img}</a>
  <div class="card-body">
    <div class="card-meta">
      <a class="card-category" href="/blog/category/${post.category.slug}">${escapeHtml(post.category.label)}</a>
      <span class="card-date">${ICONS.calendar} ${escapeHtml(formatDate(post.published))}</span>
    </div>
    <h3 class="card-title"><a href="${href}">${escapeHtml(post.title)}</a></h3>
    ${showExcerpt ? `<p class="card-excerpt">${escapeHtml(post.excerpt)}</p>` : ''}
    <div class="card-foot">
      <span class="card-read">${ICONS.clock} ${post.readTime} min read</span>
      <a class="card-more" href="${href}">Read more ${ICONS.arrowRight}</a>
    </div>
  </div>
</article>`;
}

function categoryChips(categories, activeSlug) {
  const chips = categories
    .map(
      (c) =>
        `<a class="chip${c.slug === activeSlug ? ' is-active' : ''}" href="/blog/category/${c.slug}">${escapeHtml(c.label)}</a>`
    )
    .join('\n');
  return `<div class="chips">${chips}</div>`;
}

function pageLoader() {
  return `<div class="page-loader" id="page-loader" data-name="${escapeHtml(SITE.shortName)}" aria-hidden="true">
  <div class="page-loader__center">
    <span class="page-loader__globe" aria-hidden="true">
      <span class="globe-line"></span>
      <span class="globe-line"></span>
      <span class="globe-line"></span>
      <span class="globe-line"></span>
      <span class="globe-line"></span>
      <span class="globe-line"></span>
    </span>
    <span class="page-loader__wordmark" aria-hidden="true"></span>
  </div>
</div>`;
}

function pageHero({ eyebrow, title, lead }) {
  return `<section class="page-hero bg-grid-pattern">
  <div class="container">
    <p class="eyebrow">${escapeHtml(eyebrow)}</p>
    <h1>${title}</h1>
    ${lead ? `<p class="page-lead">${lead}</p>` : ''}
  </div>
</section>`;
}

function emptyState(title, text, ctaHref = '/blog') {
  return `<div class="empty-state">
  <h3>${escapeHtml(title)}</h3>
  <p>${escapeHtml(text)}</p>
  <a class="btn btn-primary" href="${ctaHref}">Browse all insights</a>
</div>`;
}

/* ------------------------------------------------------------------ */
/* Interactive Expertise Tabs Component                                */
/* ------------------------------------------------------------------ */

function generateExpertiseInteractive() {
  const images = [
    '/assets/images/expertis/realstate.jpg',
    '/assets/images/expertis/Career.webp',
    '/assets/images/expertis/hr.jpg',
    '/assets/images/expertis/Business.jpg',
    '/assets/images/expertis/Profession.jpg',
    '/assets/images/expertis/Global.jpg'
  ];

  const stackHTML = ABOUT.expertise.map((e, index) => {
    const num = String(index + 1).padStart(2, '0');
    const image = images[index] || images[0];
    
    return `<article class="expertise-stack-card" style="--index: ${index};">
      <div class="expertise-stack-content expertise-fade">
        <div class="expertise-stack-num" aria-hidden="true">${num}</div>
        <div class="expertise-stack-text">
          <h3>${escapeHtml(e.title)}</h3>
          <p class="expertise-stack-desc"><strong>${escapeHtml(e.description)}</strong></p>
          ${e.detailedText ? `<p class="expertise-stack-detail">${escapeHtml(e.detailedText)}</p>` : ''}
        </div>
      </div>
      <div class="expertise-stack-visual expertise-fade">
        <img src="${image}" alt="${escapeHtml(e.title)}" loading="lazy" decoding="async">
      </div>
    </article>`;
  }).join('\n');

  return `
    <div class="expertise-stack-container" id="expertiseInteractive">
      ${stackHTML}
    </div>
  `;
}

/* ------------------------------------------------------------------ */
/* Bangladesh Executive Chamber (BEC)                                  */
/* ------------------------------------------------------------------ */

function becSection() {
  return `
<section class="section section-bec">
  <div class="container">
    <div class="bec-card-layout">
      <div class="bec-card-visual reveal" style="--stagger:0">
        <img src="${IMAGES.expertiseGroup}" alt="Bangladesh Executive Chamber" loading="lazy">
      </div>
      <div class="bec-card-content reveal" style="--stagger:1">
        <p class="eyebrow">${escapeHtml(BEC.heading)}</p>
        <h2>${escapeHtml(BEC.subHeading)}</h2>
        <p>${escapeHtml(BEC.description)}</p>
        <div class="bec-card-actions">
          <a class="btn btn-primary" href="/bec">${escapeHtml(BEC.ctaText)} ${ICONS.arrowRight}</a>
          <div class="bec-card-social">
            <a href="${escapeHtml(BEC.linkedinUrl)}" target="_blank" rel="noopener" aria-label="BEC LinkedIn">${ICONS.linkedin}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  `;
}

function becPage() {
  const benefitsHtml = BEC.benefits.map((b, i) => `
    <div class="achieve-card reveal" style="--stagger:${i}; background: var(--color-bg); padding: 24px; border-radius: var(--radius); box-shadow: var(--shadow-sm);">
      <h3 style="margin-bottom: 12px; font-size: 1.25rem;">${escapeHtml(b.title)}</h3>
      <p style="margin: 0; font-size: 1rem; color: var(--color-muted);">${escapeHtml(b.description)}</p>
    </div>
  `).join('\n');

  return `
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Bangladesh Executive Chamber</p>
    <h1>${escapeHtml(BEC.pageTitle)}</h1>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="about-section-layout">
      <div class="about-section-content reveal" style="--stagger:0">
        ${BEC.pageContent.map(p => `<p>${escapeHtml(p)}</p>`).join('\n')}
        <div style="margin-top: 32px;">
          <a class="btn btn-primary" href="${escapeHtml(BEC.linkedinUrl)}" target="_blank" rel="noopener">Join us on LinkedIn ${ICONS.externalLink || ICONS.arrowRight}</a>
        </div>
      </div>
      <div class="about-section-img-wrapper reveal" style="--stagger:1">
        <img src="${IMAGES.aboutGroup}" alt="Executive Networking" class="about-section-img" loading="lazy">
      </div>
    </div>
  </div>
</section>

<section class="section" style="background: var(--color-bg-alt);">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <h2>Why Join BEC?</h2>
        <p class="section-sub">A community built on excellence, continuous learning, and strategic networking.</p>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 40px;">
      ${benefitsHtml}
    </div>
  </div>
</section>
  `;
}

/* ------------------------------------------------------------------ */
/* Home page                                                           */
/* ------------------------------------------------------------------ */

function homePage({ posts, categories, updates }) {
  const latest = posts.slice(0, 8);
  const latestHtml = latest.length
    ? `<div class="blog-carousel carousel-3d" id="blogCarousel">
      <div class="carousel-stage">
        ${latest.map((p, i) => `<div class="carousel-item" data-index="${i}">${postCard(p, { showExcerpt: true })}</div>`).join('\n')}
      </div>
      <button class="carousel-arrow carousel-arrow--prev" aria-label="Previous post" type="button">
        ${ICONS.arrowLeft}
      </button>
      <button class="carousel-arrow carousel-arrow--next" aria-label="Next post" type="button">
        ${ICONS.arrowRight}
      </button>
      <div class="carousel-dots" aria-label="Carousel pagination">
        ${latest.map((_, i) => `<button class="carousel-dot${i === 0 ? ' is-active' : ''}" data-dot="${i}" aria-label="Go to slide ${i + 1}" type="button"></button>`).join('')}
      </div>
    </div>`
    : emptyState('New posts coming soon', 'Fresh insights are on the way — check back shortly or explore all topics on the blog.');

  const topicsHtml = categories.length
    ? categoryChips(categories)
    : '';

  // ── Bio Intro (Marquee + Bio + Stats) ──
  const marqueeKeywords = ABOUT.expertise.map((e) => e.title);
  const marqueeContent = `<span class="marquee-content">${marqueeKeywords
    .map((k) => escapeHtml(k.toUpperCase()) + '<span class="marquee-dot">•</span>')
    .join('')}</span>`;
  const bioIntroHtml = `
<!-- Bio Intro — Marquee + Bio + Stats -->
<div class="marquee-bar" aria-hidden="true">
  <div class="marquee-track">
    ${marqueeContent}
    ${marqueeContent}
  </div>
</div>

<section class="section section-bio-intro">
  <div class="bio-decorative-accent" aria-hidden="true">
    <svg class="bio-accent-shape" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" stroke="var(--color-primary)" stroke-width="1.5" opacity="0.22"/>
      <circle cx="60" cy="60" r="40" stroke="var(--color-primary)" stroke-width="1" opacity="0.18"/>
      <circle cx="60" cy="60" r="24" stroke="var(--color-primary)" stroke-width="1" opacity="0.14"/>
    </svg>
  </div>
  <div class="container">
    <div class="bio-intro-grid">
      <div class="reveal" style="--stagger:0">
        <div class="bio-intro-label" style="margin-bottom: 8px;">
          <img src="/assets/images/logo-v2.png" alt="Imran Khan Lincoln" height="36" style="object-fit: contain;" />
        </div>
        <h2 class="bio-intro-heading">${escapeHtml(SITE.role)}</h2>
      </div>
      <div class="reveal" style="--stagger:1">
        <p class="bio-intro-paragraph">${escapeHtml(ABOUT.hero.intro)}</p>
        <p class="bio-intro-paragraph-secondary">I write on investment, careers, HR culture, customer experience, and global affairs — blending personal experience with reliable references.</p>
        <div class="bio-intro-meta">
          <div class="bio-intro-meta-item">
            <span class="bio-intro-meta-label">Location</span>
            <span class="bio-intro-meta-value">${escapeHtml(SITE.officeAddress)}</span>
          </div>
          <div class="bio-intro-meta-item">
            <span class="bio-intro-meta-label">Experience</span>
            <span class="bio-intro-meta-value">${escapeHtml(SITE.experienceYears)} Years, Real Estate</span>
          </div>
          <div class="bio-intro-meta-item">
            <span class="bio-intro-meta-label">Focus</span>
            <span class="bio-intro-meta-value">Customer Experience</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section-stats-strip" aria-label="Career highlights">
  <div class="container">
    <div class="stats-strip-grid">
      <div class="stats-strip-card stats-strip-card--light reveal" style="--stagger:0">
        <span class="stats-strip-number">${escapeHtml(SITE.experienceYears)}</span>
        <span class="stats-strip-label">Years Experience</span>
      </div>
      <div class="stats-strip-card stats-strip-card--dark reveal" style="--stagger:1">
        <span class="stats-strip-number">${posts.length || 26}</span>
        <span class="stats-strip-label">Published Insights</span>
      </div>
      <div class="stats-strip-card stats-strip-card--light reveal" style="--stagger:2">
        <span class="stats-strip-number">${ABOUT.expertise.length}</span>
        <span class="stats-strip-label">Expertise Areas</span>
      </div>
    </div>
  </div>
</section>
`;

  // ── Skills / Expertise ──
  const expertiseInteractiveHtml = ABOUT.expertise.length ? generateExpertiseInteractive() : '';

  // ── Upcoming Updates (Timeline) ──
  const iconMap = { book: ICONS.book, users: ICONS.users, target: ICONS.target, video: ICONS.video };
  const statusClassMap = {
    'Coming Soon': 'status-soon',
    'In Progress': 'status-progress',
    Planned: 'status-planned',
  };
  const updatesHtml = (updates || []).length
    ? (updates || []).map(
        (u, i) => `<div class="timeline-milestone reveal" style="--stagger:${i}">
  <div class="tl-marker">
    <div class="tl-dot">${iconMap[u.icon] || ICONS.zap}</div>
  </div>
  <div class="tl-card">
    <div class="tl-badge ${statusClassMap[u.status] || 'status-planned'}">${escapeHtml(u.status)}</div>
    <h3>${escapeHtml(u.title)}</h3>
    <p>${escapeHtml(u.description)}</p>
  </div>
</div>`
      ).join('\n')
    : '<div class="timeline-milestone reveal"><div class="tl-marker"><div class="tl-dot">${ICONS.zap}</div></div><div class="tl-card"><h3>Stay tuned</h3><p>Check back soon for upcoming projects, workshops, and announcements.</p></div></div>';

  // ── Social / Connect ──
  const socialLinks = [
    { icon: ICONS.linkedin, label: 'LinkedIn', href: SITE.social.linkedin, brand: 'linkedin' },
    { icon: ICONS.twitter, label: 'X (Twitter)', href: SITE.social.twitter, brand: 'twitter' },
    { icon: ICONS.facebook, label: 'Facebook', href: SITE.social.facebook, brand: 'facebook' },
    { icon: ICONS.rss, label: 'Blogger', href: SITE.blogSource, brand: 'blogger' },
  ];
  const socialHtml = socialLinks.map(
    (s, i) => `<a class="connect-link reveal connect-${s.brand}" href="${escapeHtml(s.href)}" target="_blank" rel="noopener" aria-label="${escapeHtml(s.label)}" style="--stagger:${i}">
  <span class="connect-icon">${s.icon}</span>
  <span class="connect-label">${escapeHtml(s.label)}</span>
</a>`
  ).join('\n');

  return `
<section class="hero bg-grid-pattern">
  <div class="container hero-inner">
    <div class="hero-copy">
      <p class="eyebrow">— Welcome</p>
      <h1>I'm <span class="hero-name-accent">${escapeHtml(SITE.name)}</span></h1>
      <p class="hero-subtitle">
        <span class="flip-fade-container">
          <span class="flip-word active">Real Estate.</span>
          <span class="flip-word">Leadership.</span>
          <span class="flip-word">Business Strategy.</span>
          <span class="flip-word">Customer Experience.</span>
        </span>
      </p>
      <div class="hero-stats">
        <div class="stat"><strong>${SITE.experienceYears}</strong><span>Years Experience</span></div>
        <div class="stat"><strong>CXO</strong><span>Leadership</span></div>
        <div class="stat"><strong>${posts.length || '26+'}</strong><span>Published Insights</span></div>
      </div>
      <div class="hero-actions">
        <a class="hero-btn hero-btn-primary" href="/blog">
          <span class="hero-btn-text">Read Insights</span>
          <span class="hero-btn-icon">${ICONS.arrowRight}</span>
        </a>
        <a class="hero-btn hero-btn-secondary" href="/contact">Get in Touch</a>
      </div>
      <div class="hero-social">
        <a href="${SITE.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${ICONS.linkedin}</a>
        <a href="${SITE.social.twitter}" target="_blank" rel="noopener" aria-label="X (Twitter)">${ICONS.twitter}</a>
        <a href="${SITE.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ICONS.facebook}</a>
        <a href="${SITE.social.blogger}" target="_blank" rel="noopener" aria-label="Blogger">${ICONS.rss}</a>
      </div>
    </div>
    <div class="hero-visual" aria-hidden="true">
      <!-- Rotating circular text badge -->
      <div class="hero-rotating-badge">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46"/>
          <defs><path id="textCircle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"/></defs>
          <text><textPath href="#textCircle">${SITE.experienceYears} YEARS EXPERIENCE • ${SITE.experienceYears} YEARS EXPERIENCE •</textPath></text>
        </svg>
      </div>
      <!-- Portrait photo -->
      <div class="hero-portrait">
        <img
          src="${IMAGES.hero}"
          alt="${escapeHtml(SITE.name)} — Portrait"
          width="380"
          height="460"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
      </div>
      <!-- Floating expertise badges -->
      <div class="hero-badge hero-badge-1">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Real Estate
      </div>
      <div class="hero-badge hero-badge-2">
        ${ICONS.user}
        Leadership
      </div>
      <div class="hero-badge hero-badge-3">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h4"/></svg>
        Business Strategy
      </div>
      <div class="hero-badge hero-badge-4">
        ${ICONS.users}
        HR &amp; Recruitment
      </div>
    </div>
  </div>
</section>

${bioIntroHtml}

<!-- Latest Insights -->
<section class="section section-latest" id="latest">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">Latest Insights</p>
        <h2>Recent articles from the blog</h2>
        <p class="section-sub">Fresh perspectives on Real Estate, Leadership &amp; Business Strategy — curated from the latest posts.</p>
      </div>
      <a class="btn btn-ghost" href="/blog">View all ${ICONS.arrowRight}</a>
    </div>
    ${latestHtml}
    <div class="section-cta reveal" style="--stagger:4; text-align:center; margin-top:36px;">
      <a class="btn btn-primary" href="/blog">View All Posts ${ICONS.arrowRight}</a>
    </div>
    ${topicsHtml ? `<div class="section-topics-inline">
      <p class="eyebrow" style="text-align:center;margin-bottom:12px;">Browse by topic</p>
      ${topicsHtml}
    </div>` : ''}
  </div>
</section>

<!-- Bangladesh Executive Chamber (BEC) -->
${becSection()}

<!-- Skills & Expertise -->
${expertiseInteractiveHtml ? `<section class="section section-skills">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">Expertise</p>
        <h2>Areas I write and speak about</h2>
      </div>
    </div>
    ${expertiseInteractiveHtml}
  </div>
</section>` : ''}

<!-- About Teaser -->
<section class="section section-about-teaser">
  <div class="container about-teaser">
    <div class="about-teaser-visual reveal">
      <!-- Floating stat badge -->
      <div class="about-teaser-badge about-teaser-badge-stat">
        ${ICONS.book}
        <div>
          <div class="teaser-badge-number">${ABOUT.stats[2] ? ABOUT.stats[2].value : '26+'}</div>
          <div class="teaser-badge-label">${ABOUT.stats[2] ? ABOUT.stats[2].label : 'Published Insights'}</div>
        </div>
      </div>
      <!-- Blob portrait -->
      <div class="about-teaser-portrait">
        <img
          src="${IMAGES.aboutTeaser}"
          alt="${escapeHtml(SITE.name)} — About"
          width="300"
          height="370"
          loading="lazy"
          decoding="async"
        />
      </div>
      <!-- Floating role badge -->
      <div class="about-teaser-badge about-teaser-badge-role">
        ${ICONS.award}
        ${escapeHtml(SITE.role)} · BEC
      </div>
    </div>
    <div class="about-teaser-copy reveal">
      <p class="eyebrow">— About Me</p>
      <h2>About <span class="hero-name-accent">${escapeHtml(SITE.name)}</span></h2>
      <p>${escapeHtml(ABOUT.hero.intro)} I write on investment, careers, HR culture, customer experience, and global affairs — blending personal experience with reliable references.</p>
      <a class="btn btn-primary" href="/about">More about me ${ICONS.arrowRight}</a>
    </div>
  </div>
</section>

<!-- Upcoming Updates (Timeline) -->
<section class="section section-updates">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">Roadmap</p>
        <h2>What&rsquo;s coming next</h2>
      </div>
    </div>
    <div class="roadmap-layout">
      <div class="updates-timeline">
        ${updatesHtml}
      </div>
      <div class="roadmap-illustration reveal" aria-hidden="true">
        <svg viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="40" y1="40" x2="40" y2="220" stroke="var(--color-border)" stroke-width="2"/>
          <circle cx="40" cy="60" r="12" fill="var(--color-primary)" opacity="0.15"/>
          <circle cx="40" cy="60" r="6" fill="var(--color-primary)" opacity="0.5"/>
          <rect x="65" y="48" width="90" height="24" rx="6" fill="var(--color-primary)" opacity="0.1"/>
          <rect x="65" y="52" width="70" height="8" rx="4" fill="var(--color-primary)" opacity="0.2"/>
          <rect x="65" y="62" width="40" height="6" rx="3" fill="var(--color-primary)" opacity="0.12"/>
          <circle cx="40" cy="130" r="12" fill="#e65100" opacity="0.12"/>
          <circle cx="40" cy="130" r="6" fill="#e65100" opacity="0.4"/>
          <rect x="65" y="118" width="100" height="24" rx="6" fill="var(--color-primary)" opacity="0.1"/>
          <rect x="65" y="122" width="80" height="8" rx="4" fill="var(--color-primary)" opacity="0.2"/>
          <rect x="65" y="132" width="50" height="6" rx="3" fill="var(--color-primary)" opacity="0.12"/>
          <circle cx="40" cy="200" r="12" fill="#666" opacity="0.08"/>
          <circle cx="40" cy="200" r="6" fill="#666" opacity="0.3"/>
          <rect x="65" y="188" width="85" height="24" rx="6" fill="var(--color-primary)" opacity="0.1"/>
          <rect x="65" y="192" width="65" height="8" rx="4" fill="var(--color-primary)" opacity="0.2"/>
          <rect x="65" y="202" width="35" height="6" rx="3" fill="var(--color-primary)" opacity="0.12"/>
        </svg>
      </div>
    </div>
  </div>
</section>

<!-- Testimonials / Reviews -->
<section class="section section-reviews" id="reviews">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">TESTIMONIALS</p>
        <h2>What People Say</h2>
        <p class="section-sub">${escapeHtml(TESTIMONIALS.subHeading)}</p>
      </div>
      <a class="btn btn-ghost" href="/testimonials">Read all testimonials ${ICONS.arrowRight}</a>
    </div>
  </div>
  
  <div class="reviews-marquee-container reveal" style="--stagger:1;">
    ${(() => {
      const items = (TESTIMONIALS.items || []).slice(0, 8);
      const cardsHTML = items.map((t, i) => `
      <figure class="review-card">
        <div class="review-quote-icon" aria-hidden="true">${ICONS.quote}</div>
        <blockquote><p>${escapeHtml(t.quote)}</p></blockquote>
        <figcaption>
          <img src="${escapeHtml(t.image)}" alt="${escapeHtml(t.name)}" width="56" height="56" loading="lazy" decoding="async"/>
          <div>
            <span class="review-name">${escapeHtml(t.name)}</span>
            <span class="review-role">${escapeHtml(t.role)}</span>
          </div>
        </figcaption>
      </figure>`).join('\n');
      return `<div class="marquee-track">\n${cardsHTML}\n${cardsHTML}\n</div>`;
    })()}
  </div>
  
  <div class="container">
    <div class="section-cta reveal" style="--stagger:2; text-align:center; margin-top:32px;">
      <a class="btn btn-primary" href="/testimonials">Read All Testimonials ${ICONS.arrowRight}</a>
    </div>
  </div>
</section>

`;
}

/* ------------------------------------------------------------------ */
/* Blog listing page                                                   */
/* ------------------------------------------------------------------ */

function blogPage({ posts, categories }) {
  const cards = posts.length
    ? `<div class="post-grid" id="post-grid">${posts.map((p) => postCard(p)).join('\n')}</div>`
    : emptyState('No posts yet', 'Blog posts will appear here once the Blogger feed is synced.');

  const json = JSON.stringify(
    posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      published: p.published,
      image: p.image,
      readTime: p.readTime,
      category: p.category,
    }))
  );

  return `
${pageHero({
  eyebrow: 'Blog & Insights',
  title: 'All insights from the blog',
  lead: 'Thought leadership on real estate, careers, HR culture, customer experience, and global affairs — written in a personal, opinion-led style.',
})}

<section class="section section-blog">
  <div class="container">
    <div class="blog-toolbar">
      <div class="blog-search">
        ${ICONS.search}
        <input type="search" id="blog-search" placeholder="Search insights…" aria-label="Search insights"/>
      </div>
      ${categoryChips(categories)}
    </div>
    ${cards}
    <div class="empty-state is-hidden" id="search-empty">
      <h3>No matching posts</h3>
      <p>Try a different keyword or browse all categories.</p>
    </div>
  </div>
</section>
<script>window.__BLOG_POSTS__ = ${json};</script>
<script src="/assets/js/blog.js" defer></script>`;
}

/* ------------------------------------------------------------------ */
/* Post detail page                                                    */
/* ------------------------------------------------------------------ */

function postPage({ post, related, prev, next }) {
  const href = `/blog/${post.slug}`;
  const date = formatDate(post.published);
  const tags = (post.categories || [])
    .map((t) => `<a class="chip" href="/blog/category/${post.category.slug}">${escapeHtml(t)}</a>`)
    .join('\n');

  const relatedHtml = related.length
    ? `<div class="post-grid">${related.map((p) => postCard(p)).join('\n')}</div>`
    : '';

  const prevHtml = prev
    ? `<a class="post-nav-link" href="/blog/${prev.slug}"><span class="post-nav-label">${ICONS.arrowLeft} Previous</span><span class="post-nav-title">${escapeHtml(prev.title)}</span></a>`
    : '<span class="post-nav-link is-disabled"><span class="post-nav-label">Previous</span></span>';

  const nextHtml = next
    ? `<a class="post-nav-link post-nav-next" href="/blog/${next.slug}"><span class="post-nav-label">Next ${ICONS.arrowRight}</span><span class="post-nav-title">${escapeHtml(next.title)}</span></a>`
    : '<span class="post-nav-link post-nav-next is-disabled"><span class="post-nav-label">Next</span></span>';

  const ogImage = post.image || '/assets/og-default.svg';

  return `
<article class="post-page">
  <div class="container post-container">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/blog">Blog</a></li>
        <li aria-current="page">${escapeHtml(post.title)}</li>
      </ol>
    </nav>

    <header class="post-header">
      <a class="post-category-badge" href="/blog/category/${post.category.slug}">${escapeHtml(post.category.label)}</a>
      <h1>${escapeHtml(post.title)}</h1>
      <div class="post-meta">
        <div class="post-author-avatar">
          <img src="${IMAGES.profile}" alt="${escapeHtml(post.author)}" width="48" height="48" loading="lazy" />
        </div>
        <div class="post-meta-details">
          <span class="post-author-name">${escapeHtml(post.author)}</span>
          <div class="post-meta-row">
            <span>${ICONS.calendar} ${escapeHtml(date)}</span>
            <span class="meta-dot">•</span>
            <span>${ICONS.clock} ${post.readTime} min read</span>
          </div>
        </div>
      </div>
    </header>

    ${post.image ? `<figure class="post-cover"><img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="lazy"/></figure>` : ''}

    <div class="post-layout">
      <div class="post-content" id="post-content">
        ${post.content}
        <div class="post-tags">${tags}</div>
      </div>

      <aside class="post-sidebar">
        <div class="sidebar-card">
          <h3>Share this article</h3>
          <div class="share-buttons" data-share-url="${escapeHtml(href)}" data-share-title="${escapeHtml(post.title)}">
            <button class="share-btn share-fb" data-share="facebook" aria-label="Share on Facebook">${ICONS.facebook}</button>
            <button class="share-btn share-tw" data-share="twitter" aria-label="Share on X">${ICONS.twitter}</button>
            <button class="share-btn share-li" data-share="linkedin" aria-label="Share on LinkedIn">${ICONS.linkedin}</button>
            <button class="share-btn share-wa" data-share="whatsapp" aria-label="Share on WhatsApp">${ICONS.share}</button>
            <button class="share-btn share-copy" data-share="copy" aria-label="Copy link">${ICONS.copy}</button>
          </div>
        </div>
        <div class="sidebar-card sidebar-author">
          <img
            src="${IMAGES.profile}"
            alt="${escapeHtml(SITE.name)} — Author"
            width="200"
            height="200"
            loading="lazy"
            decoding="async"
            class="author-avatar-img"
          />
          <h3>${escapeHtml(SITE.name)}</h3>
          <p>${escapeHtml(SITE.role)} at ${escapeHtml(SITE.organization)}</p>
          <a class="btn btn-ghost btn-sm" href="/about">About the author</a>
        </div>
      </aside>
    </div>

    <nav class="post-nav" aria-label="Post navigation">
      ${prevHtml}
      ${nextHtml}
    </nav>
  </div>
</article>

${relatedHtml ? `<section class="section section-related">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow">Keep Reading</p>
        <h2>Related insights</h2>
      </div>
    </div>
    ${relatedHtml}
  </div>
</section>` : ''}

<script>window.__POST__ = ${JSON.stringify({ slug: post.slug, title: post.title, url: href })};</script>
<script src="/assets/js/post.js" defer></script>`;
}

/* ------------------------------------------------------------------ */
/* Category page                                                       */
/* ------------------------------------------------------------------ */

function categoryPage({ category, posts, categories }) {
  const cards = posts.length
    ? `<div class="post-grid">${posts.map((p) => postCard(p)).join('\n')}</div>`
    : emptyState('No posts in this category yet', 'Posts tagged under this topic will appear here.');

  return `
${pageHero({
  eyebrow: 'Category',
  title: escapeHtml(category.label),
  lead: `All insights tagged under “${escapeHtml(category.label)}”.`,
})}

<section class="section section-blog">
  <div class="container">
    ${categoryChips(categories, category.slug)}
    ${cards}
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* About page                                                          */
/* ------------------------------------------------------------------ */

function aboutPage() {
  const stats = ABOUT.stats
    .map((s) => `<div class="stat"><strong>${escapeHtml(s.value)}</strong><span>${escapeHtml(s.label)}</span></div>`)
    .join('\n');

  const expertiseInteractive = ABOUT.expertise.length ? generateExpertiseInteractive() : '';

  const journey = (SITE.experience || ABOUT.journey)
    .map(
      (j) => `<li class="timeline-item">
        <span class="timeline-dot" aria-hidden="true"></span>
        <div class="timeline-body">
          <span class="timeline-period">${escapeHtml(j.period)}</span>
          <h3>${escapeHtml(j.role)}</h3>
          <p class="timeline-org">${escapeHtml(j.org)}</p>
          ${j.description ? `<p>${escapeHtml(j.description)}</p>` : ''}
        </div>
      </li>`
    )
    .join('\n');

  const bio = ABOUT.bio.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n');

  const servicesHtml = (SITE.services || []).map((s, i) => `
    <a class="service-card reveal" style="--stagger:${i}" href="/services#${escapeHtml(s.anchor)}">
      <span class="service-card-icon" aria-hidden="true">${ICONS[s.icon] || ICONS.briefcase}</span>
      <h3>${escapeHtml(s.title)}</h3>
      <p>${escapeHtml(s.description)}</p>
      <span class="service-card-link">Learn more ${ICONS.arrowRight}</span>
    </a>
  `).join('\n');

  const projectHtml = SITE.project ? `
<section class="section section-project" style="background: var(--color-bg-alt);">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">Current Project</p>
        <h2>${escapeHtml(SITE.project.name)}</h2>
        <p class="section-sub">${escapeHtml(SITE.project.description)}</p>
        <p style="margin-top: 16px;"><strong>Location:</strong> ${escapeHtml(SITE.project.address)}</p>
      </div>
    </div>
  </div>
</section>
` : '';

  const geoSummary = `<div class="geo-summary reveal" style="margin-bottom: 2rem; padding: 1.5rem; background: var(--color-primary-soft); border-left: 4px solid var(--color-primary); border-radius: 4px; color: var(--color-text);">
    <strong>Summary:</strong> ${escapeHtml(SITE.description)}
  </div>`;

  const affiliationsHtml = (AFFILIATIONS || []).map((aff, i) => `
    <div class="affiliation-card reveal" style="--stagger:${i}">
      <h3>${escapeHtml(aff.company)}</h3>
      <p class="affiliation-role">${escapeHtml(aff.role)} <br/> <em>"${escapeHtml(aff.tagline)}"</em></p>
      <ul class="affiliation-details">
        ${aff.phones.map(p => `<li>${ICONS.phone} <a href="tel:${p.replace(/[^+\d]/g, '')}">${escapeHtml(p)}</a></li>`).join('\n')}
        <li>${ICONS.mail} <a href="mailto:${escapeHtml(aff.email)}">${escapeHtml(aff.email)}</a></li>
        <li>${ICONS.globe} <a href="${escapeHtml(aff.website)}" target="_blank" rel="noopener">${escapeHtml(aff.website.replace(/^https?:\/\//, ''))}</a></li>
        <li>${ICONS.facebook} <a href="${escapeHtml(aff.facebook)}" target="_blank" rel="noopener">Facebook Page</a></li>
        <li class="affiliation-address">${ICONS.pin} <span>${escapeHtml(aff.address)}</span></li>
      </ul>
    </div>
  `).join('\n');

  const affiliationsSection = AFFILIATIONS && AFFILIATIONS.length ? `
<section class="section section-affiliations">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">Other Affiliations</p>
        <h2>Additional Roles</h2>
      </div>
    </div>
    <div class="affiliations-grid">
      ${affiliationsHtml}
    </div>
  </div>
</section>
` : '';

  return `
${pageHero({
  eyebrow: ABOUT.hero.eyebrow,
  title: escapeHtml(ABOUT.hero.heading),
  lead: escapeHtml(ABOUT.hero.intro),
})}

<section class="section section-about bg-grid-pattern">
  <div class="container about-intro">
    <div class="about-portrait-col" aria-hidden="true">
      <!-- Floating stat badge -->
      <div class="about-float-badge about-float-badge-stat">
        ${ICONS.book}
        <div>
          <div class="about-badge-number">${ABOUT.stats[2] ? ABOUT.stats[2].value : '26+'}</div>
          <div class="about-badge-label">${ABOUT.stats[2] ? ABOUT.stats[2].label : 'Published Insights'}</div>
        </div>
      </div>
      <!-- Portrait photo — same blob shape as hero -->
      <div class="about-portrait">
        <img
          src="${IMAGES.aboutBio}"
          alt="${escapeHtml(SITE.name)} — Profile Photo"
          width="340"
          height="420"
          loading="lazy"
          decoding="async"
        />
      </div>
      <!-- Floating role badge -->
      <div class="about-float-badge about-float-badge-role">
        ${ICONS.award}
        ${escapeHtml(SITE.role)} · BEC
      </div>
    </div>
    <div class="about-text-col">
      <p class="eyebrow">— About Me</p>
      <h2 class="about-intro-heading">About <span class="hero-name-accent">${escapeHtml(SITE.name)}</span></h2>
      <p class="about-intro-bio">${escapeHtml(ABOUT.bio[0])}</p>
      <blockquote class="about-quote">${ICONS.quote}<p>${escapeHtml(ABOUT.quote)}</p></blockquote>
      <div class="about-stats-row" style="margin-top: 24px;">
        <div class="stat"><strong>${SITE.experienceYears}</strong><span>Years Experience</span></div>
        <div class="stat"><strong>CXO</strong><span>Leadership</span></div>
        <div class="stat"><strong>${ABOUT.stats[3] ? ABOUT.stats[3].value : '6'}</strong><span>${ABOUT.stats[3] ? ABOUT.stats[3].label : 'Core Topic Areas'}</span></div>
      </div>
      <div class="about-contact-row">
        <a class="about-contact-pill" href="tel:${SITE.phones[0].replace(/[^+\d]/g, '')}">
          ${ICONS.phone}
          ${escapeHtml(SITE.phones[0])}
        </a>
        <a class="about-contact-pill" href="mailto:${escapeHtml(SITE.email)}">
          ${ICONS.mail}
          ${escapeHtml(SITE.email)}
        </a>
      </div>
    </div>
  </div>
</section>

<section class="section" style="padding-top: 0;">
  <div class="container about-grid">
    <div class="about-bio-wrapper" style="grid-column: 1 / -1;">
      <div class="about-bio-text">
        ${geoSummary}
        <p class="eyebrow">Biography</p>
        ${bio}
      </div>
      <div class="about-bio-visual">
        <div class="stepped-corner-wrapper">
          <img
            src="${IMAGES.aboutDesk}"
            alt="${escapeHtml(SITE.name)} — Office"
            width="400"
            height="400"
            loading="lazy"
            decoding="async"
            class="about-bio-img stepped-image"
          />
        </div>
      </div>
    </div>
  </div>
</section>

${affiliationsSection}

${projectHtml}

<section class="section section-services">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">Services</p>
        <h2>Professional Services & Consulting</h2>
        <p class="section-sub">Practical, experience-backed support across leadership, marketing, real estate, and career growth — designed to create lasting value.</p>
      </div>
    </div>
    <div class="service-grid">
      ${servicesHtml}
    </div>
  </div>
</section>

<section class="section section-expertise">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow">Expertise</p>
        <h2>
          Expertise in <br/>
          <span class="flip-fade-container text-primary">
            <span class="flip-word active">Real Estate.</span>
            <span class="flip-word">Leadership.</span>
            <span class="flip-word">Business Strategy.</span>
            <span class="flip-word">Customer Experience.</span>
          </span>
        </h2>
        <p class="section-subtitle">Bridging the gap between high-level strategy and operational reality to create lasting value across industries.</p>
      </div>
    </div>
    ${expertiseInteractive}
  </div>
</section>

<section class="section section-journey">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow">Journey</p>
        <h2>Career timeline</h2>
      </div>
    </div>
    <div class="about-section-layout">
      <ol class="timeline">${journey}</ol>
      <div class="stepped-corner-wrapper">
        <img
          src="${IMAGES.timelineAward}"
          alt="${escapeHtml(SITE.name)} — Achievements"
          width="500"
          height="375"
          loading="lazy"
          decoding="async"
          class="about-section-img stepped-image"
        />
      </div>
    </div>
  </div>
</section>

<section class="section section-mission">
  <div class="container">
    <div class="about-section-layout about-section-layout-reverse">
      <div class="stepped-corner-wrapper">
        <img
          src="${IMAGES.aboutGroup}"
          alt="${escapeHtml(SITE.name)} — Mission & Vision"
          width="500"
          height="273"
          loading="lazy"
          decoding="async"
          class="about-section-img stepped-image"
        />
      </div>
      <div class="mission-grid">
        <div class="mission-card">
          <h3>Mission</h3>
          <p>${escapeHtml(ABOUT.mission)}</p>
        </div>
        <div class="mission-card">
          <h3>Vision</h3>
          <p>${escapeHtml(ABOUT.vision)}</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section-cta">
  <div class="container cta-box">
    <h2>Let’s talk about your next opportunity</h2>
    <p>Reach out for speaking, collaboration, or a conversation about real estate and leadership.</p>
    <a class="btn btn-light" href="/contact">Contact me ${ICONS.arrowRight}</a>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* Contact page                                                        */
/* ------------------------------------------------------------------ */

function contactPage() {
  const phones = SITE.phones
    .map(
      (p) =>
        `<li><a href="tel:${p.replace(/[^+\d]/g, '')}"><span class="contact-icon">${ICONS.phone}</span><span>${escapeHtml(p)}</span></a></li>`
    )
    .join('\n');

  return `
${pageHero({
  eyebrow: 'Contact',
  title: CONTACT.heading,
  lead: escapeHtml(CONTACT.intro),
})}

<section class="section section-contact">
  <div class="container contact-grid">
    <div class="contact-form-wrap">
      <form id="contact-form" class="contact-form" novalidate>
        <div class="form-row">
          <div class="form-field">
            <label for="cf-name">Your name <span aria-hidden="true">*</span></label>
            <input id="cf-name" name="name" type="text" autocomplete="name" required minlength="2" maxlength="100" placeholder="Full name"/>
            <p class="field-error" data-error-for="name"></p>
          </div>
          <div class="form-field">
            <label for="cf-email">Email address <span aria-hidden="true">*</span></label>
            <input id="cf-email" name="email" type="email" autocomplete="email" required maxlength="200" placeholder="you@example.com"/>
            <p class="field-error" data-error-for="email"></p>
          </div>
        </div>
        <div class="form-field">
          <label for="cf-subject">Subject <span aria-hidden="true">*</span></label>
          <input id="cf-subject" name="subject" type="text" required minlength="2" maxlength="200" placeholder="What is this about?"/>
          <p class="field-error" data-error-for="subject"></p>
        </div>
        <div class="form-field">
          <label for="cf-message">Message <span aria-hidden="true">*</span></label>
          <textarea id="cf-message" name="message" rows="6" required minlength="10" maxlength="5000" placeholder="Write your message…"></textarea>
          <p class="field-error" data-error-for="message"></p>
        </div>
        <div class="honeypot" aria-hidden="true">
          <label for="cf-website">Leave this field empty</label>
          <input id="cf-website" name="website" type="text" tabindex="-1" autocomplete="off"/>
        </div>
        <button class="btn btn-primary btn-block" type="submit" id="cf-submit">
          <span class="btn-label">Send message</span>
          <span class="btn-spinner" aria-hidden="true"></span>
        </button>
        <div class="form-status" id="form-status" role="status" aria-live="polite"></div>
      </form>
    </div>

    <aside class="contact-info">
      <div class="contact-card contact-image-card stepped-corner-wrapper">
        <img
          src="${IMAGES.contactSpeaking}"
          alt="${escapeHtml(SITE.name)} — Contact"
          width="400"
          height="400"
          loading="lazy"
          decoding="async"
          class="contact-profile-img stepped-image"
        />
      </div>
      <div class="contact-card">
        <h3>Direct contact</h3>
        <ul class="contact-list">
          ${phones}
          <li><a href="mailto:${escapeHtml(SITE.email)}"><span class="contact-icon">${ICONS.mail}</span><span>${escapeHtml(SITE.email)}</span></a></li>
          <li><span class="contact-icon">${ICONS.pin}</span><span>${escapeHtml(SITE.officeAddress)}</span></li>
        </ul>
      </div>
      <div class="contact-card">
        <h3>Follow me</h3>
        <div class="footer-social">
          <a href="${SITE.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${ICONS.linkedin}</a>
          <a href="${SITE.social.twitter}" target="_blank" rel="noopener" aria-label="X (Twitter)">${ICONS.twitter}</a>
          <a href="${SITE.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ICONS.facebook}</a>
          <a href="${SITE.blogSource}" target="_blank" rel="noopener" aria-label="Blogger">${ICONS.rss}</a>
        </div>
      </div>
      <div class="contact-card">
        <h3>Office location</h3>
        <div class="map-wrap">
          <iframe title="Office location map — Gulshan, Dhaka" src="${CONTACT.mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        </div>
        <a class="btn btn-ghost btn-sm map-link" href="${CONTACT.mapLink}" target="_blank" rel="noopener">Open in Google Maps ${ICONS.arrowRight}</a>
      </div>
    </aside>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* 404 page                                                            */
/* ------------------------------------------------------------------ */

function notFoundPage() {
  return `
<section class="section section-404">
  <div class="container notfound">
    <p class="notfound-code">404</p>
    <h1>Page not found</h1>
    <p>The page you’re looking for doesn’t exist or has been moved. Try searching the blog or head back home.</p>
    <div class="notfound-actions">
      <a class="btn btn-primary" href="/">Go back home</a>
      <a class="btn btn-ghost" href="/blog">Browse the blog</a>
    </div>
    <div class="blog-search notfound-search">
      ${ICONS.search}
      <input type="search" id="nf-search" placeholder="Search insights…" aria-label="Search insights"/>
    </div>
  </div>
</section>
<script src="/assets/js/404.js" defer></script>`;
}

/* ------------------------------------------------------------------ */
/* JSON-LD builders                                                    */
/* ------------------------------------------------------------------ */

function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.baseUrl,
    description: SITE.description,
    publisher: personJsonLd(),
  };
}

function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    jobTitle: SITE.role,
    worksFor: { '@type': 'Organization', name: SITE.organization },
    telephone: SITE.phones[0],
    address: { '@type': 'PostalAddress', addressLocality: 'Dhaka', addressCountry: 'BD' },
    url: SITE.baseUrl,
    sameAs: [SITE.social.linkedin, SITE.social.twitter, SITE.social.facebook, SITE.blogSource],
    alumniOf: SITE.education ? SITE.education.map(e => ({ '@type': 'Organization', name: e.institution })) : undefined,
    knowsAbout: [...(SITE.skills || []), ...(SITE.services ? SITE.services.map(s => s.title) : [])]
  };
}

function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.organization,
    url: SITE.baseUrl + '/bec',
    member: {
      '@type': 'Person',
      name: SITE.name,
      jobTitle: SITE.role
    }
  };
}

function projectJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: SITE.project.name,
    description: SITE.project.description,
    address: { '@type': 'PostalAddress', streetAddress: SITE.project.address, addressLocality: "Cox's Bazar", addressCountry: 'BD' },
    url: SITE.baseUrl + '/projects'
  };
}

function articleJsonLd(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image || `${SITE.baseUrl}/assets/og-default.svg`,
    datePublished: post.published,
    dateModified: post.updated,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: SITE.name },
    mainEntityOfPage: `${SITE.baseUrl}/blog/${post.slug}`,
    keywords: (post.categories || []).join(', '),
  };
}

function breadcrumbJsonLd(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE.baseUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE.baseUrl}/blog/${post.slug}` },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Services page                                                       */
/* ------------------------------------------------------------------ */

function servicesPage() {
  const serviceSections = (SITE.services || []).map((s, i) => `
<section class="section service-detail${i % 2 === 1 ? ' service-detail--alt' : ''}" id="${escapeHtml(s.anchor)}">
  <div class="container service-detail-grid">
    <div class="service-detail-icon reveal" style="--stagger:0">${ICONS[s.icon] || ICONS.briefcase}</div>
    <div class="service-detail-body reveal" style="--stagger:1">
      <p class="eyebrow">${String(i + 1).padStart(2, '0')}</p>
      <h2>${escapeHtml(s.title)}</h2>
      <p class="service-detail-lead">${escapeHtml(s.description)}</p>
      <p class="service-detail-text">${escapeHtml(s.detail)}</p>
      <div class="service-who">
        <strong>Who it's for</strong>
        <p>${escapeHtml(s.whoItsFor)}</p>
      </div>
      <a class="btn btn-primary" href="/contact">Discuss this service ${ICONS.arrowRight}</a>
    </div>
  </div>
</section>`).join('\n');

  const overviewCards = (SITE.services || []).map((s, i) => `
<a class="service-card reveal" style="--stagger:${i}" href="#${escapeHtml(s.anchor)}">
  <span class="service-card-icon">${ICONS[s.icon] || ICONS.briefcase}</span>
  <h3>${escapeHtml(s.title)}</h3>
  <p>${escapeHtml(s.description)}</p>
  <span class="service-card-link">Learn more ${ICONS.arrowRight}</span>
</a>`).join('\n');

  return `
${pageHero({
  eyebrow: 'Services',
  title: 'Professional Services & Consulting',
  lead: 'Practical, experience-backed support across leadership, marketing, real estate, and career growth — designed to create lasting value for your business and people.',
})}

<section class="section section-services">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">What I offer</p>
        <h2>Services built around real business outcomes</h2>
      </div>
    </div>
    <div class="service-grid">
      ${overviewCards}
    </div>
  </div>
</section>

${serviceSections}

<section class="section section-cta">
  <div class="container cta-box reveal">
    <h2>Not sure which service fits?</h2>
    <p>Tell me about your goals and I'll point you in the right direction.</p>
    <a class="btn btn-light" href="/contact">Start a conversation ${ICONS.arrowRight}</a>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* Projects page (Chuti Bay)                                           */
/* ------------------------------------------------------------------ */

function projectsPage() {
  const p = SITE.project;
  const keyFacts = (p.keyFacts || []).map((f, i) => `
<div class="project-fact reveal" style="--stagger:${i}">
  <span class="project-fact-value">${escapeHtml(f.value)}</span>
  <span class="project-fact-label">${escapeHtml(f.label)}</span>
</div>`).join('\n');

  const structure = (p.investment?.structure || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('\n');
  const notes = (p.investment?.notes || []).map((n) => `<li class="project-note">${escapeHtml(n)}</li>`).join('\n');

  const overviewParas = (p.overview || []).map((para) => `<p>${escapeHtml(para)}</p>`).join('\n');

  const galleryHtml = (p.gallery?.items || []).length
    ? `<div class="project-gallery">${p.gallery.items.map((img) => `<img src="${escapeHtml(img)}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async"/>`).join('\n')}</div>`
    : `<div class="project-gallery-empty"><p>${escapeHtml(p.gallery?.note || 'Project imagery to be added.')}</p></div>`;

  return `
${pageHero({
  eyebrow: 'Projects',
  title: escapeHtml(p.name),
  lead: escapeHtml(p.description),
})}

<section class="section section-project-overview">
  <div class="container">
    <div class="about-section-layout">
      <div class="about-section-content reveal" style="--stagger:0">
        <p class="eyebrow">Overview</p>
        <h2>A landmark sea-view hotel in Cox's Bazar</h2>
        ${overviewParas}
        <div class="project-meta">
          <p><strong>Location:</strong> ${escapeHtml(p.address)}</p>
          <p><strong>Standard:</strong> ${escapeHtml(p.standard)}</p>
        </div>
        <a class="btn btn-primary" href="${escapeHtml(p.cta.href)}">${escapeHtml(p.cta.label)} ${ICONS.arrowRight}</a>
      </div>
      <div class="about-section-img-wrapper reveal" style="--stagger:1">
        <div class="project-fact-grid">
          ${keyFacts}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section-project-investment" style="background: var(--color-bg-alt);">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">Investment</p>
        <h2>${escapeHtml(p.investment.title)}</h2>
        <p class="section-sub">${escapeHtml(p.investment.description)}</p>
      </div>
    </div>
    <div class="project-investment-grid">
      <div class="project-investment-card reveal" style="--stagger:0">
        <h3>Scheme highlights</h3>
        <ul>${structure}</ul>
      </div>
      <div class="project-investment-card reveal" style="--stagger:1">
        <h3>Documents &amp; details</h3>
        <ul>${notes}</ul>
        <p class="project-note-hint">Figures marked [NEEDED] will be published once finalised.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-project-gallery">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">Gallery</p>
        <h2>Project visuals</h2>
      </div>
    </div>
    ${galleryHtml}
  </div>
</section>

<section class="section section-cta">
  <div class="container cta-box reveal">
    <h2>Interested in ${escapeHtml(p.name)}?</h2>
    <p>Get in touch for details on the share-based investment scheme and current availability.</p>
    <a class="btn btn-light" href="${escapeHtml(p.cta.href)}">${escapeHtml(p.cta.label)} ${ICONS.arrowRight}</a>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* Testimonials page                                                   */
/* ------------------------------------------------------------------ */

function testimonialCard(t, i) {
  const isPlaceholder = /NEEDED/.test(`${t.quote}${t.name}${t.role}`);
  return `
<figure class="testimonial-card reveal" style="--stagger:${i}">
  <div class="testimonial-quote">${ICONS.quote}</div>
  <blockquote>${isPlaceholder ? `<em>${escapeHtml(t.quote)}</em>` : `<p>${escapeHtml(t.quote)}</p>`}</blockquote>
  <figcaption>
    <img src="${escapeHtml(t.image)}" alt="${escapeHtml(t.name)}" width="56" height="56" loading="lazy" decoding="async"/>
    <div>
      <span class="testimonial-name">${escapeHtml(t.name)}</span>
      <span class="testimonial-role">${escapeHtml(t.role)}</span>
    </div>
  </figcaption>
</figure>`;
}

function testimonialsPage() {
  const cards = (TESTIMONIALS.items || []).map((t, i) => testimonialCard(t, i)).join('\n');
  return `
${pageHero({
  eyebrow: 'Testimonials',
  title: escapeHtml(TESTIMONIALS.heading),
  lead: escapeHtml(TESTIMONIALS.subHeading),
})}

<section class="section section-testimonials">
  <div class="container">
    <div class="testimonial-grid">
      ${cards}
    </div>
    <p class="testimonial-note reveal">Placeholder entries are shown for structure only — real client testimonials will be added as they are collected.</p>
  </div>
</section>

<section class="section section-cta">
  <div class="container cta-box reveal">
    <h2>Worked with me?</h2>
    <p>I'd love to hear about your experience — your feedback helps others make informed decisions.</p>
    <a class="btn btn-light" href="/contact">Share your feedback ${ICONS.arrowRight}</a>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* Legal pages (Privacy & Terms)                                       */
/* ------------------------------------------------------------------ */

function legalPage({ eyebrow, data }) {
  const sections = (data.sections || []).map((s, i) => `
<section class="legal-section reveal" style="--stagger:${i % 4}">
  <h2>${escapeHtml(s.heading)}</h2>
  ${s.body.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n')}
</section>`).join('\n');

  return `
${pageHero({
  eyebrow,
  title: escapeHtml(data.title),
  lead: escapeHtml(data.intro),
})}

<section class="section section-legal">
  <div class="container legal-container">
    <p class="legal-updated">Last updated: ${escapeHtml(data.lastUpdated)}</p>
    ${sections}
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* JSON-LD: Reviews & Services                                         */
/* ------------------------------------------------------------------ */

/** Only emit review structured data once real (non-placeholder) testimonials exist. */
function reviewsJsonLd() {
  const real = (TESTIMONIALS.items || []).filter((t) => !/NEEDED/.test(`${t.quote}${t.name}${t.role}`));
  if (!real.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (real.reduce((s, t) => s + (t.rating || 5), 0) / real.length).toFixed(1),
      reviewCount: real.length,
      bestRating: 5,
    },
    review: real.map((t) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.name },
      reviewBody: t.quote,
      reviewRating: { '@type': 'Rating', ratingValue: t.rating || 5, bestRating: 5 },
    })),
  };
}

function servicesJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Professional Services',
    itemListElement: (SITE.services || []).map((s, i) => ({
      '@type': 'Service',
      position: i + 1,
      name: s.title,
      description: s.description,
      provider: { '@type': 'Person', name: SITE.name },
    })),
  };
}

module.exports = {
  layout,
  header,
  footer,
  postCard,
  categoryChips,
  pageHero,
  emptyState,
  homePage,
  blogPage,
  postPage,
  categoryPage,
  aboutPage,
  contactPage,
  notFoundPage,
  servicesPage,
  projectsPage,
  testimonialsPage,
  privacyPage: () => legalPage({ eyebrow: 'Legal', data: PRIVACY }),
  termsPage: () => legalPage({ eyebrow: 'Legal', data: TERMS }),
  websiteJsonLd,
  personJsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
  organizationJsonLd,
  projectJsonLd,
  reviewsJsonLd,
  servicesJsonLd,
  becPage,
};
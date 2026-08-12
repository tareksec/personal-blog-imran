/**
 * lib/templates.js — Shared HTML templates used by sync-cli.js to
 * generate every page of the site (home, about, contact, blog,
 * post detail, category, 404). Guarantees a consistent header/footer
 * and complete SEO meta on every page.
 */

const { SITE, IMAGES, ABOUT, CONTACT, NAV } = require('./content');
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
  const jsonLdHtml = jsonLd.map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}"/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<link rel="canonical" href="${escapeHtml(canonical)}"/>
<link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
<link rel="icon" type="image/png" sizes="32x32" href="/assets/6d11f859fe14776d1522bc1e00fcf16adecae02643f121d065a98b84ec92a77d.png"/>
<link rel="apple-touch-icon" href="/assets/b1592c5a855b760ebffe74300d2d8c4456df1cff11bda800b04c0c56e71de4b9.png"/>
<link rel="manifest" href="/manifest.json"/>
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
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Source+Sans+Pro:wght@400;600;700&family=Noto+Serif+Bengali:wght@100..900&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/assets/css/style.css"/>
${extraHead}
${jsonLdHtml}
</head>
<body class="${escapeHtml(bodyClass)}">
${header(activeNav)}
<main id="main">${body}</main>
${footer()}
<script src="/assets/js/main.js" defer></script>
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
    <span class="pill-logo-badge">
      <svg width="22" height="22" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.9983 18.9474C13.6363 18.9474 15.7658 16.8316 15.7658 14.2105V4.73684C15.7658 2.11579 13.6363 0 10.9983 0C8.36032 0 6.23087 2.11579 6.23087 4.73684V14.2105C6.23087 16.8316 8.36032 18.9474 10.9983 18.9474ZM20.3902 14.2105C19.6115 14.2105 18.9599 14.7789 18.8328 15.5526C18.1813 19.2632 14.9235 22.1053 10.9983 22.1053C7.07311 22.1053 3.81536 19.2632 3.16381 15.5526C3.03668 14.7789 2.38513 14.2105 1.60645 14.2105C0.637065 14.2105 -0.125726 15.0632 0.0172978 16.0105C0.79598 20.7474 4.60993 24.4579 9.40916 25.1368V28.4211C9.40916 29.2895 10.1243 30 10.9983 30C11.8723 30 12.5875 29.2895 12.5875 28.4211V25.1368C17.3867 24.4579 21.2006 20.7474 21.9793 16.0105C22.1382 15.0632 21.3596 14.2105 20.3902 14.2105Z" fill="#fff"/>
      </svg>
    </span>
    <span class="pill-site-name">${escapeHtml(SITE.shortName)}</span>
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

  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-col footer-brand">
      <img src="/assets/logo-footer.svg" alt="${escapeHtml(SITE.name)}" width="196" height="28"/>
      <p>${escapeHtml(SITE.tagline)}. ${escapeHtml(SITE.role)} at ${escapeHtml(SITE.organization)}.</p>
      <div class="footer-social">
        <a href="${SITE.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${ICONS.linkedin}</a>
        <a href="${SITE.social.twitter}" target="_blank" rel="noopener" aria-label="X (Twitter)">${ICONS.twitter}</a>
        <a href="${SITE.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ICONS.facebook}</a>
        <a href="${SITE.blogSource}" target="_blank" rel="noopener" aria-label="Blogger">${ICONS.rss}</a>
      </div>
    </div>
    <div class="footer-col">
      <h3>Explore</h3>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/blog">All Insights</a></li>
        <li><a href="/about">About Me</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>Topics</h3>
      <ul>${topicLinks}</ul>
    </div>
    <div class="footer-col">
      <h3>Get in Touch</h3>
      <ul class="footer-contact">
        <li><a href="tel:${SITE.phones[0].replace(/[^+\d]/g, '')}">${ICONS.phone} ${escapeHtml(SITE.phones[0])}</a></li>
        <li><a href="tel:${SITE.phones[1].replace(/[^+\d]/g, '')}">${ICONS.phone} ${escapeHtml(SITE.phones[1])}</a></li>
        <li><a href="mailto:${escapeHtml(SITE.email)}">${ICONS.mail} ${escapeHtml(SITE.email)}</a></li>
        <li><span>${ICONS.pin} ${escapeHtml(SITE.officeAddress)}</span></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container footer-bottom-inner">
      <p>© ${new Date().getFullYear()} ${escapeHtml(SITE.name)}. All rights reserved.</p>
      <p><a href="/sitemap.xml">Sitemap</a> · <a href="/robots.txt">Robots</a> · <a href="${SITE.blogSource}" target="_blank" rel="noopener">Original Blog</a></p>
    </div>
  </div>
</footer>`;
}

/* ------------------------------------------------------------------ */
/* Shared components                                                   */
/* ------------------------------------------------------------------ */

function postCard(post, { showExcerpt = true } = {}) {
  const href = `/blog/${post.slug}`;
  const img = post.image
    ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="lazy" decoding="async"/>`
    : `<div class="card-thumb card-thumb-fallback" aria-hidden="true">${ICONS.quote}</div>`;
  return `<article class="post-card">
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

function pageHero({ eyebrow, title, lead }) {
  return `<section class="page-hero">
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
/* Home page                                                           */
/* ------------------------------------------------------------------ */

function homePage({ posts, categories, updates }) {
  const latest = posts.slice(0, 4);
  const latestHtml = latest.length
    ? `<div class="post-grid">${latest.map((p) => postCard(p)).join('\n')}</div>`
    : emptyState('No posts yet', 'Blog posts will appear here once the Blogger feed is synced.');

  const topicsHtml = categories.length
    ? categoryChips(categories)
    : '';

  // ── Achievements / Milestones ──
  const achievements = [
    { icon: 'building', value: SITE.experienceYears, label: 'Years in Real Estate', numeric: 18 },
    { icon: 'book', value: String(posts.length || '26'), label: 'Published Insights', numeric: posts.length || 26 },
    { icon: 'pieChart', value: String(categories.length || '5'), label: 'Topic Categories', numeric: categories.length || 5 },
    { icon: 'award', value: 'CXO', label: 'Leadership Role', numeric: null },
  ];
  const achievementsHtml = achievements.map(
    (a, i) => `<div class="achieve-card reveal"${a.numeric !== null ? ' data-count="' + a.numeric + '"' : ''} style="--stagger:${i}">
  <div class="achieve-accent"></div>
  <div class="achieve-icon">${ICONS[a.icon]}</div>
  <strong class="achieve-value"${a.numeric !== null ? ' data-target="' + a.numeric + '"' : ''}>${a.numeric !== null ? '0' : escapeHtml(a.value)}</strong>
  <span class="achieve-label">${escapeHtml(a.label)}</span>
</div>`
  ).join('\n');

  // ── Skills / Expertise ──
  const expertiseIconMap = [ICONS.building, ICONS.trendingUp, ICONS.userPlus, ICONS.pieChart, ICONS.briefcase, ICONS.globe];
  const expertiseItems = ABOUT.expertise.length
    ? ABOUT.expertise.map(
        (e, i) => `<div class="skill-card reveal" style="--stagger:${i}">
  <div class="skill-icon">${expertiseIconMap[i] || ICONS.lightbulb}</div>
  <h3>${escapeHtml(e.title)}</h3>
  <p>${escapeHtml(e.description)}</p>
</div>`
      ).join('\n')
    : '';

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
<section class="hero">
  <div class="container hero-inner">
    <div class="hero-copy">
      <p class="eyebrow">Featured</p>
      <h1>Insights on Real Estate,<br/>Leadership &amp; Business Strategy</h1>
      <p class="hero-lead">Exploring the intersections of Real Estate investments, Career development, HR culture, and Customer Experience. Discover strategies to build value in today’s dynamic business environment.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="/blog">Read My Blog ${ICONS.arrowRight}</a>
        <a class="btn btn-ghost" href="/about">About Me</a>
      </div>
      <div class="hero-stats">
        <div class="stat"><strong>${SITE.experienceYears}</strong><span>Years Experience</span></div>
        <div class="stat"><strong>CXO</strong><span>Leadership</span></div>
        <div class="stat"><strong>${posts.length || '26+'}</strong><span>Published Insights</span></div>
      </div>
    </div>
    <div class="hero-visual" aria-hidden="true">
      <div class="hero-photo-frame stepped-corner-wrapper">
        <img
          src="${IMAGES.hero}"
          alt="${escapeHtml(SITE.name)} — Hero"
          width="600"
          height="600"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          class="hero-photo stepped-image"
        />
      </div>
      <div class="hero-card hero-card-mini">${ICONS.tag} Real Estate &amp; Investment</div>
      <div class="hero-card hero-card-mini hero-card-mini-2">${ICONS.user} Career &amp; Leadership</div>
    </div>
  </div>
</section>

<!-- Achievements / Milestones -->
<section class="section section-achievements">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">By the Numbers</p>
        <h2>Proven experience, trusted insights</h2>
      </div>
    </div>
    <div class="achieve-grid">
      ${achievementsHtml}
    </div>
  </div>
</section>

<!-- Latest Insights -->
<section class="section section-latest" id="latest">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">Latest Insights</p>
        <h2>Recent articles from the blog</h2>
      </div>
      <a class="btn btn-ghost" href="/blog">View all ${ICONS.arrowRight}</a>
    </div>
    ${latestHtml}
    ${topicsHtml ? `<div class="section-topics-inline">
      <p class="eyebrow" style="text-align:center;margin-bottom:12px;">Browse by topic</p>
      ${topicsHtml}
    </div>` : ''}
  </div>
</section>

<!-- Skills & Expertise -->
${expertiseItems ? `<section class="section section-skills">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">Expertise</p>
        <h2>Areas I write and speak about</h2>
      </div>
    </div>
    <div class="skill-layout">
      <div class="skill-grid">
        ${expertiseItems}
      </div>
      <div class="skill-illustration reveal" aria-hidden="true">
        <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="50" width="100" height="140" rx="8" fill="var(--color-primary-soft)" opacity="0.7"/>
          <rect x="48" y="58" width="84" height="12" rx="4" fill="var(--color-primary)" opacity="0.25"/>
          <rect x="48" y="78" width="60" height="8" rx="4" fill="var(--color-primary)" opacity="0.18"/>
          <rect x="48" y="94" width="72" height="8" rx="4" fill="var(--color-primary)" opacity="0.18"/>
          <rect x="48" y="110" width="44" height="8" rx="4" fill="var(--color-primary)" opacity="0.18"/>
          <line x1="60" y1="130" x2="120" y2="130" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="4 4"/>
          <rect x="155" y="50" width="100" height="140" rx="8" fill="var(--color-primary-soft)" opacity="0.5"/>
          <circle cx="175" cy="72" r="14" fill="var(--color-primary)" opacity="0.2"/>
          <rect x="167" y="96" width="76" height="8" rx="4" fill="var(--color-primary)" opacity="0.15"/>
          <rect x="167" y="112" width="52" height="8" rx="4" fill="var(--color-primary)" opacity="0.15"/>
          <circle cx="205" cy="170" r="18" fill="var(--color-primary)" opacity="0.12"/>
          <path d="M195 162l8 8 16-16" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
        </svg>
      </div>
    </div>
  </div>
</section>` : ''}

<!-- About Teaser -->
<section class="section section-about-teaser">
  <div class="container about-teaser">
    <div class="about-teaser-visual reveal stepped-corner-wrapper">
      <img
        src="${IMAGES.aboutTeaser}"
        alt="${escapeHtml(SITE.name)} — About"
        width="400"
        height="400"
        loading="lazy"
        decoding="async"
        class="about-teaser-img stepped-image"
      />
    </div>
    <div class="about-teaser-copy reveal">
      <p class="eyebrow">About Me</p>
      <h2>${escapeHtml(SITE.role)} with ${SITE.experienceYears} years in Real Estate</h2>
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

<!-- Connect With Me -->
<section class="section section-connect">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">Stay Connected</p>
        <h2>Follow my journey across platforms</h2>
      </div>
    </div>
    <div class="connect-layout">
      <div class="connect-grid">
        ${socialHtml}
      </div>
      <div class="connect-illustration reveal" aria-hidden="true">
        <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="40" stroke="var(--color-primary)" stroke-width="1.5" opacity="0.15"/>
          <circle cx="60" cy="60" r="25" fill="var(--color-primary)" opacity="0.08"/>
          <circle cx="160" cy="45" r="30" stroke="var(--color-primary)" stroke-width="1.5" opacity="0.12"/>
          <circle cx="160" cy="45" r="18" fill="var(--color-primary)" opacity="0.06"/>
          <circle cx="180" cy="140" r="35" stroke="var(--color-primary)" stroke-width="1.5" opacity="0.15"/>
          <circle cx="180" cy="140" r="22" fill="var(--color-primary)" opacity="0.08"/>
          <circle cx="40" cy="150" r="28" stroke="var(--color-primary)" stroke-width="1.5" opacity="0.12"/>
          <circle cx="40" cy="150" r="16" fill="var(--color-primary)" opacity="0.06"/>
          <line x1="60" y1="100" x2="140" y2="55" stroke="var(--color-primary)" stroke-width="1" opacity="0.08" stroke-dasharray="6 4"/>
          <line x1="100" y1="80" x2="180" y2="90" stroke="var(--color-primary)" stroke-width="1" opacity="0.08" stroke-dasharray="6 4"/>
          <line x1="50" y1="120" x2="150" y2="135" stroke="var(--color-primary)" stroke-width="1" opacity="0.08" stroke-dasharray="6 4"/>
        </svg>
      </div>
    </div>
  </div>
</section>

<!-- Subscribe -->
<section class="section section-subscribe">
  <div class="container">
    <div class="subscribe-box reveal">
      <div class="subscribe-copy">
        <p class="eyebrow">Newsletter</p>
        <h2>Get insights delivered to your inbox</h2>
        <p>Join readers receiving thought leadership on Real Estate, Leadership &amp; Business Strategy — straight from the blog.</p>
      </div>
      <form class="subscribe-form" id="subscribe-form" novalidate>
        <div class="subscribe-field">
          ${ICONS.mail}
          <input type="email" name="email" placeholder="you@example.com" aria-label="Email address" required autocomplete="email"/>
          <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;" aria-hidden="true"/>
          <button class="btn btn-primary" type="submit" id="sub-submit">
            <span class="btn-label">${ICONS.send} Subscribe</span>
            <span class="btn-spinner" aria-hidden="true"></span>
          </button>
        </div>
        <div class="subscribe-status" id="subscribe-status" role="status" aria-live="polite"></div>
      </form>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="section section-cta">
  <div class="container cta-box reveal">
    <h2>Have a question or an idea to discuss?</h2>
    <p>Whether it’s real estate investment, leadership, or a speaking opportunity — I’d love to hear from you.</p>
    <a class="btn btn-light" href="/contact">Get in touch ${ICONS.arrowRight}</a>
  </div>
</section>`;
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
      <a class="card-category" href="/blog/category/${post.category.slug}">${escapeHtml(post.category.label)}</a>
      <h1>${escapeHtml(post.title)}</h1>
      <div class="post-meta">
        <span>${ICONS.user} ${escapeHtml(post.author)}</span>
        <span>${ICONS.calendar} ${escapeHtml(date)}</span>
        <span>${ICONS.clock} ${post.readTime} min read</span>
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
          <p>${escapeHtml(SITE.role)}, ${escapeHtml(SITE.organization)}</p>
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

  const expertise = ABOUT.expertise
    .map(
      (e) => `<div class="expertise-card">
        <h3>${escapeHtml(e.title)}</h3>
        <p>${escapeHtml(e.description)}</p>
      </div>`
    )
    .join('\n');

  const journey = ABOUT.journey
    .map(
      (j) => `<li class="timeline-item">
        <span class="timeline-dot" aria-hidden="true"></span>
        <div class="timeline-body">
          <span class="timeline-period">${escapeHtml(j.period)}</span>
          <h3>${escapeHtml(j.role)}</h3>
          <p class="timeline-org">${escapeHtml(j.org)}</p>
          <p>${escapeHtml(j.description)}</p>
        </div>
      </li>`
    )
    .join('\n');

  const bio = ABOUT.bio.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n');

  return `
${pageHero({
  eyebrow: ABOUT.hero.eyebrow,
  title: escapeHtml(ABOUT.hero.heading),
  lead: escapeHtml(ABOUT.hero.intro),
})}

<section class="section section-about">
  <div class="container about-grid">
    <div class="about-profile">
      <div class="stepped-corner-wrapper">
        <img
          src="${IMAGES.aboutBio}"
          alt="${escapeHtml(SITE.name)} — Profile Photo"
          width="600"
          height="600"
          loading="lazy"
          decoding="async"
          class="about-profile-img stepped-image"
        />
      </div>
      <h2>${escapeHtml(SITE.name)}</h2>
      <p class="about-role">${escapeHtml(SITE.role)} · ${escapeHtml(SITE.organization)}</p>
      <div class="about-stats">${stats}</div>
      <div class="footer-social about-social">
        <a href="${SITE.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${ICONS.linkedin}</a>
        <a href="${SITE.social.twitter}" target="_blank" rel="noopener" aria-label="X (Twitter)">${ICONS.twitter}</a>
        <a href="${SITE.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ICONS.facebook}</a>
        <a href="${SITE.blogSource}" target="_blank" rel="noopener" aria-label="Blogger">${ICONS.rss}</a>
      </div>
    </div>
    <div class="about-bio">
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
      <p class="eyebrow">Biography</p>
      ${bio}
      <blockquote class="about-quote">${ICONS.quote}<p>${escapeHtml(ABOUT.quote)}</p></blockquote>
    </div>
  </div>
</section>

<section class="section section-expertise">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow">Expertise</p>
        <h2>What I write about</h2>
      </div>
    </div>
    <div class="about-section-layout">
      <div class="stepped-corner-wrapper">
        <img
          src="${IMAGES.expertiseGroup}"
          alt="${escapeHtml(SITE.name)} — Expertise"
          width="500"
          height="500"
          loading="lazy"
          decoding="async"
          class="about-section-img stepped-image"
        />
      </div>
      <div class="expertise-grid">${expertise}</div>
    </div>
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
  title: escapeHtml(CONTACT.heading),
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
  websiteJsonLd,
  personJsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
};
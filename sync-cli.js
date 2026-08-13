/**
 * sync-cli.js — Build-time static site generator.
 *
 * 1. Fetches ALL posts from the Blogger feed (paginated).
 * 2. Normalizes them (slug, excerpt, read time, category, sanitized HTML).
 * 3. Writes data/posts.json (used by API functions as a fallback).
 * 4. Optionally syncs to Vercel KV (when KV env vars are present).
 * 5. Generates every page of the site:
 *      index.html, about.html, contact.html, blog.html, 404.html,
 *      blog/<slug>.html, blog/category/<slug>.html,
 *      sitemap.xml, robots.txt
 *
 * Usage: node sync-cli.js
 */

const fs = require('fs');
const path = require('path');

const { normalizePost } = require('./lib/posts');
const { SITE } = require('./lib/content');
const T = require('./lib/templates');

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const META_FILE = path.join(DATA_DIR, 'meta.json');
const BLOG_DIR = path.join(ROOT, 'blog');
const CATEGORY_DIR = path.join(BLOG_DIR, 'category');

const BLOGGER_FEED = 'https://imrankhanlincoln.blogspot.com/feeds/posts/default?alt=json';
const FETCH_TIMEOUT_MS = 20000;
const PAGE_SIZE = 150;

/* ------------------------------------------------------------------ */
/* Fetching                                                            */
/* ------------------------------------------------------------------ */

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'imranvai-site-builder/1.0' } });
    if (!res.ok) throw new Error(`Blogger feed responded ${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Fetch every post from Blogger (paginated). Returns raw entries. */
async function fetchAllEntries() {
  const first = await fetchWithTimeout(`${BLOGGER_FEED}&max-results=${PAGE_SIZE}&start-index=1`);
  const total = parseInt(first.feed?.openSearch$totalResults?.$t, 10) || 0;
  const entries = [...(first.feed?.entry || [])];

  if (total > PAGE_SIZE) {
    for (let start = PAGE_SIZE + 1; start <= total; start += PAGE_SIZE) {
      const page = await fetchWithTimeout(`${BLOGGER_FEED}&max-results=${PAGE_SIZE}&start-index=${start}`);
      entries.push(...(page.feed?.entry || []));
    }
  }
  return entries;
}

/* ------------------------------------------------------------------ */
/* Persistence                                                         */
/* ------------------------------------------------------------------ */

function readCachedPosts() {
  try {
    return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

/* ------------------------------------------------------------------ */
/* KV sync (optional)                                                  */
/* ------------------------------------------------------------------ */

async function syncToKv(posts) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.log('  ↳ KV env vars not set — skipping KV sync (API fallback will use data/posts.json).');
    return;
  }
  try {
    const { kv } = require('@vercel/kv');
    const index = [];
    for (const post of posts) {
      await kv.set(`post:${post.id}`, post);
      index.push(post.id);
    }
    await kv.set('blog:index', index);
    console.log(`  ↳ Synced ${posts.length} posts to Vercel KV.`);
  } catch (err) {
    console.warn(`  ↳ KV sync failed (non-fatal): ${err.message}`);
  }
}

/* ------------------------------------------------------------------ */
/* Page generation                                                     */
/* ------------------------------------------------------------------ */

function loadUpdates() {
  try {
    const file = path.join(DATA_DIR, 'updates.json');
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch { /* ignore */ }
  return [];
}

function generatePages(posts) {
  const sorted = [...posts].sort((a, b) => new Date(b.published) - new Date(a.published));

  // Category aggregation (by classified category slug)
  const catMap = new Map();
  for (const p of sorted) {
    if (!catMap.has(p.category.slug)) catMap.set(p.category.slug, { ...p.category, posts: [] });
    catMap.get(p.category.slug).posts.push(p);
  }
  const categories = [...catMap.values()].map((c) => ({ slug: c.slug, label: c.label, count: c.posts.length }));

  const base = SITE.baseUrl.replace(/\/$/, '');

  /* ---- Home ---- */
  writeFile(
    path.join(ROOT, 'index.html'),
    T.layout({
      title: SITE.title,
      description: SITE.description,
      canonical: `${base}/`,
      ogImage: `${base}/assets/og-default.svg`,
      activeNav: 'home',
      body: T.homePage({ posts: sorted, categories, updates: loadUpdates() }),
      jsonLd: [T.websiteJsonLd(), T.personJsonLd()],
    })
  );
  console.log(`  ✓ index.html (${sorted.length} posts)`);

  /* ---- About ---- */
  writeFile(
    path.join(ROOT, 'about.html'),
    T.layout({
      title: `About ${SITE.name} | CXO BEC & Real Estate Professional`,
      description: `Learn about ${SITE.name}, Chief Experience Officer (CXO) at Bangladesh Executive Chamber (BEC), with ${SITE.experienceYears} years in real estate, corporate training, and leadership coaching in Dhaka.`,
      canonical: `${base}/about`,
      ogImage: `${base}/assets/og-default.svg`,
      ogType: 'profile',
      activeNav: 'about',
      body: T.aboutPage(),
      jsonLd: [T.personJsonLd(), T.projectJsonLd()],
    })
  );
  console.log('  ✓ about.html');

  /* ---- Contact ---- */
  writeFile(
    path.join(ROOT, 'contact.html'),
    T.layout({
      title: `Contact ${SITE.name} | Real Estate Consultant & Corporate Trainer`,
      description: `Contact ${SITE.name} for business consulting, real estate marketing, and career development coaching in Gulshan, Dhaka. Phone: ${SITE.phones.join(', ')}.`,
      canonical: `${base}/contact`,
      ogImage: `${base}/assets/og-default.svg`,
      activeNav: 'contact',
      body: T.contactPage(),
      jsonLd: [T.websiteJsonLd()],
    })
  );
  console.log('  ✓ contact.html');

  /* ---- BEC ---- */
  writeFile(
    path.join(ROOT, 'bec.html'),
    T.layout({
      title: `Bangladesh Executive Chamber (BEC) | Empowering Leadership in Bangladesh`,
      description: 'Join a premier network of C-level executives and industry pioneers in Bangladesh. Bangladesh Executive Chamber (BEC) is dedicated to professional excellence.',
      canonical: `${base}/bec`,
      ogImage: `${base}/assets/og-default.svg`,
      activeNav: 'bec',
      body: T.becPage(),
      jsonLd: [T.websiteJsonLd(), T.organizationJsonLd()],
    })
  );
  console.log('  ✓ bec.html');

  /* ---- Services ---- */
  writeFile(
    path.join(ROOT, 'services.html'),
    T.layout({
      title: `Services — ${SITE.name} | Consulting, Training & Coaching`,
      description: `Professional services from ${SITE.name}: corporate training, lead generation, real estate marketing, business consulting, and career coaching in Dhaka, Bangladesh.`,
      canonical: `${base}/services`,
      ogImage: `${base}/assets/og-default.svg`,
      activeNav: 'services',
      body: T.servicesPage(),
      jsonLd: [T.websiteJsonLd(), T.servicesJsonLd()],
    })
  );
  console.log('  ✓ services.html');

  /* ---- Projects ---- */
  writeFile(
    path.join(ROOT, 'projects.html'),
    T.layout({
      title: `Projects — ${SITE.project.name} | Sea-view Hotel, Cox's Bazar`,
      description: `${SITE.project.name}: ${SITE.project.description}`,
      canonical: `${base}/projects`,
      ogImage: `${base}/assets/og-default.svg`,
      activeNav: 'projects',
      body: T.projectsPage(),
      jsonLd: [T.websiteJsonLd(), T.projectJsonLd()],
    })
  );
  console.log('  ✓ projects.html');

  /* ---- Testimonials ---- */
  writeFile(
    path.join(ROOT, 'testimonials.html'),
    T.layout({
      title: `Testimonials — ${SITE.name}`,
      description: `What clients and partners say about ${SITE.name} — real estate consulting, leadership coaching, and business strategy in Dhaka, Bangladesh.`,
      canonical: `${base}/testimonials`,
      ogImage: `${base}/assets/og-default.svg`,
      activeNav: 'testimonials',
      body: T.testimonialsPage(),
      jsonLd: [T.websiteJsonLd(), T.reviewsJsonLd()],
    })
  );
  console.log('  ✓ testimonials.html');

  /* ---- Privacy Policy ---- */
  writeFile(
    path.join(ROOT, 'privacy-policy.html'),
    T.layout({
      title: `Privacy Policy — ${SITE.name}`,
      description: 'Privacy policy for the personal website of Md. Imran Khan Lincoln.',
      canonical: `${base}/privacy-policy`,
      ogImage: `${base}/assets/og-default.svg`,
      activeNav: '',
      body: T.privacyPage(),
      jsonLd: [T.websiteJsonLd()],
    })
  );
  console.log('  ✓ privacy-policy.html');

  /* ---- Terms of Service ---- */
  writeFile(
    path.join(ROOT, 'terms-of-service.html'),
    T.layout({
      title: `Terms of Service — ${SITE.name}`,
      description: 'Terms of service for the personal website of Md. Imran Khan Lincoln.',
      canonical: `${base}/terms-of-service`,
      ogImage: `${base}/assets/og-default.svg`,
      activeNav: '',
      body: T.termsPage(),
      jsonLd: [T.websiteJsonLd()],
    })
  );
  console.log('  ✓ terms-of-service.html');

  /* ---- Blog listing ---- */
  writeFile(
    path.join(ROOT, 'blog.html'),
    T.layout({
      title: `Blog & Insights — ${SITE.name} | Leadership & Real Estate`,
      description: `All insights from ${SITE.name} on real estate marketing, careers, ESG, HR culture, customer experience, and global affairs.`,
      canonical: `${base}/blog`,
      ogImage: `${base}/assets/og-default.svg`,
      activeNav: 'blog',
      body: T.blogPage({ posts: sorted, categories }),
      jsonLd: [T.websiteJsonLd()],
    })
  );
  console.log(`  ✓ blog.html (${sorted.length} posts, ${categories.length} categories)`);

  /* ---- Post detail pages ---- */
  const generatedSlugs = new Set();
  sorted.forEach((post, i) => {
    const related = sorted
      .filter((p) => p.slug !== post.slug && p.category.slug === post.category.slug)
      .slice(0, 3);
    const prev = i > 0 ? sorted[i - 1] : null;
    const next = i < sorted.length - 1 ? sorted[i + 1] : null;

    writeFile(
      path.join(BLOG_DIR, `${post.slug}.html`),
      T.layout({
        title: `${post.title} — ${SITE.name}`,
        description: post.excerpt,
        canonical: `${base}/blog/${post.slug}`,
        ogImage: post.image || `${base}/assets/og-default.svg`,
        ogType: 'article',
        activeNav: 'blog',
        body: T.postPage({ post, related, prev, next }),
        jsonLd: [T.articleJsonLd(post), T.breadcrumbJsonLd(post)],
      })
    );
    generatedSlugs.add(post.slug);
  });
  console.log(`  ✓ blog/<slug>.html (${sorted.length} posts)`);

  /* ---- Category pages ---- */
  for (const cat of categories) {
    const catPosts = catMap.get(cat.slug).posts;
    writeFile(
      path.join(CATEGORY_DIR, `${cat.slug}.html`),
      T.layout({
        title: `${cat.label} — Blog & Insights | ${SITE.name}`,
        description: `All insights tagged under ${cat.label} by ${SITE.name}.`,
        canonical: `${base}/blog/category/${cat.slug}`,
        ogImage: `${base}/assets/og-default.svg`,
        activeNav: 'blog',
        body: T.categoryPage({ category: cat, posts: catPosts, categories }),
        jsonLd: [T.websiteJsonLd()],
      })
    );
  }
  console.log(`  ✓ blog/category/<slug>.html (${categories.length} categories)`);

  /* ---- 404 ---- */
  writeFile(
    path.join(ROOT, '404.html'),
    T.layout({
      title: `Page Not Found — ${SITE.name}`,
      description: 'The page you are looking for does not exist.',
      canonical: `${base}/404`,
      activeNav: '',
      body: T.notFoundPage(),
    })
  );
  console.log('  ✓ 404.html');

  /* ---- sitemap.xml ---- */
  const urls = [
    { loc: `${base}/`, priority: '1.0', freq: 'weekly' },
    { loc: `${base}/blog`, priority: '0.9', freq: 'daily' },
    { loc: `${base}/about`, priority: '0.7', freq: 'monthly' },
    { loc: `${base}/services`, priority: '0.8', freq: 'monthly' },
    { loc: `${base}/projects`, priority: '0.8', freq: 'monthly' },
    { loc: `${base}/testimonials`, priority: '0.6', freq: 'monthly' },
    { loc: `${base}/contact`, priority: '0.6', freq: 'monthly' },
    { loc: `${base}/bec`, priority: '0.7', freq: 'monthly' },
    { loc: `${base}/privacy-policy`, priority: '0.2', freq: 'yearly' },
    { loc: `${base}/terms-of-service`, priority: '0.2', freq: 'yearly' },
    ...sorted.map((p) => ({
      loc: `${base}/blog/${p.slug}`,
      priority: '0.8',
      freq: 'monthly',
      lastmod: p.updated.slice(0, 10),
    })),
    ...categories.map((c) => ({
      loc: `${base}/blog/category/${c.slug}`,
      priority: '0.6',
      freq: 'weekly',
    })),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ''}    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
  writeFile(path.join(ROOT, 'sitemap.xml'), sitemap);
  console.log(`  ✓ sitemap.xml (${urls.length} URLs)`);

  /* ---- robots.txt ---- */
  const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${base}/sitemap.xml
`;
  writeFile(path.join(ROOT, 'robots.txt'), robots);
  console.log('  ✓ robots.txt');

  /* ---- Clean up stale generated post pages ---- */
  let removed = 0;
  if (fs.existsSync(BLOG_DIR)) {
    for (const file of fs.readdirSync(BLOG_DIR)) {
      if (file.endsWith('.html') && file !== 'index.html' && !generatedSlugs.has(file.replace(/\.html$/, ''))) {
        fs.unlinkSync(path.join(BLOG_DIR, file));
        removed += 1;
      }
    }
  }
  if (removed) console.log(`  ↳ Removed ${removed} stale post page(s).`);

  return { categories, count: sorted.length };
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  console.log('── Md. Imran Khan Lincoln — site build ──');
  let entries = [];
  let source = 'live';

  try {
    entries = await fetchAllEntries();
    console.log(`Fetched ${entries.length} posts from Blogger.`);
  } catch (err) {
    console.warn(`Blogger fetch failed: ${err.message}`);
    const cached = readCachedPosts();
    if (cached.length) {
      console.log(`Using ${cached.length} cached posts from data/posts.json.`);
      entries = cached.map((p) => ({ __cached: true, ...p }));
      source = 'cache';
    } else {
      console.warn('No cached data available — generating site with empty blog sections.');
    }
  }

  let posts;
  if (source === 'live') {
    const usedSlugs = new Set();
    posts = entries.map((e) => normalizePost(e, usedSlugs));
    posts.sort((a, b) => new Date(b.published) - new Date(a.published));
    writeJson(POSTS_FILE, posts);
    writeJson(META_FILE, {
      syncedAt: new Date().toISOString(),
      count: posts.length,
      source: 'blogger',
    });
    console.log(`Wrote data/posts.json (${posts.length} posts).`);
  } else {
    posts = entries;
  }

  await syncToKv(posts);

  const { categories, count } = generatePages(posts);
  console.log(`\nBuild complete: ${count} posts, ${categories.length} categories.`);
  console.log(`Categories: ${categories.map((c) => `${c.label} (${c.count})`).join(', ')}`);
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});

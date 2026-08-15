/**
 * lib/posts.js — Shared helpers for normalizing Blogger posts,
 * generating slugs, excerpts, read times, category classification,
 * and sanitizing HTML content.
 */

const CATEGORY_RULES = [
  {
    slug: 'real-estate-investment',
    label: 'Real Estate & Investment',
    keywords: [
      'রিয়েল এস্টেট', 'রিয়েলস্টেট', 'real estate', 'বিনিয়োগ', 'investment',
      'ব্যাংক ডিপোজিট', 'bank deposit', 'জমি', 'property', 'আবাসন', 'housing',
      'অর্থনীতি', 'economy', 'সঞ্চয়', 'savings', 'মূল্যস্ফীতি', 'inflation',
      'সুদহার', 'interest rate', 'শেয়ারবাজার', 'stock market', 'ডলার', 'dollar',
    ],
  },
  {
    slug: 'career-leadership',
    label: 'Career & Leadership',
    keywords: [
      'ক্যারিয়ার', 'career', 'লিডার', 'leader', 'লিডারশিপ', 'leadership',
      'নেতৃত্ব', 'সফল', 'success', 'দক্ষতা', 'skill', 'যোগ্যতা', 'qualification',
      'চাকরি', 'job', 'কর্মজীবন', 'workplace', 'উন্নতি', 'growth', 'সুযোগ', 'opportunity',
      'ব্যর্থতা', 'failure', 'শেখা', 'learning', 'নিজেকে তৈরি', 'self-development',
    ],
  },
  {
    slug: 'hr-recruitment',
    label: 'HR & Recruitment',
    keywords: [
      'এইচআর', 'hr', 'নিয়োগ', 'recruitment', 'recruiting', 'ইন্টারভিউ', 'interview',
      'সিভি', 'cv', 'resume', 'রিজিউম', 'চাকরিপ্রার্থী', 'job seeker', 'ফ্রেশার', 'fresher',
      'প্রতিষ্ঠানের নাম', 'company name', 'মানবসম্পদ', 'human resource', 'কর্মী', 'employee',
    ],
  },
  {
    slug: 'business-strategy',
    label: 'Business Strategy & CX',
    keywords: [
      'ব্যবসা', 'business', 'স্ট্র্যাটেজি', 'strategy', 'কাস্টমার', 'customer',
      'customer experience', 'গ্রাহক', 'ব্র্যান্ড', 'brand', 'মার্কেটিং', 'marketing',
      'বাজার', 'market', 'প্রতিযোগিতা', 'competition', 'পরিবর্তন', 'change',
      'উদ্যোক্তা', 'entrepreneur', 'প্রজেক্ট', 'project', 'সেবা', 'service',
    ],
  },
  {
    slug: 'global-issues',
    label: 'Global Issues & Society',
    keywords: [
      'জাতিসংঘ', 'united nations', 'বিশ্বশান্তি', 'world peace', 'শান্তি', 'peace',
      'যুদ্ধ', 'war', 'ভূরাজনীতি', 'geopolitics', 'বিশ্ব', 'world', 'আন্তর্জাতিক', 'international',
      'মানবাধিকার', 'human rights', 'পরিবেশ', 'environment', 'জলবায়ু', 'climate',
      'সমাজ', 'society', 'রাজনীতি', 'politics', 'দ্বন্দ্ব', 'conflict',
    ],
  },
  {
    slug: 'professional-etiquette',
    label: 'Professional Etiquette',
    keywords: [
      'এটিকেট', 'etiquette', 'শিষ্টাচার', 'professional', 'প্রফেশনাল', 'আচরণ', 'behavior',
      'সম্পর্ক', 'relationship', 'যোগাযোগ', 'communication', 'নেটওয়ার্কিং', 'networking',
      'সম্মান', 'respect', 'সংস্কৃতি', 'culture', 'অফিস', 'office',
    ],
  },
];

const FALLBACK_CATEGORY = { slug: 'insights', label: 'Insights' };

/** Slugify a string, keeping Unicode letters/numbers/marks (Bengali-safe). */
function slugify(input, { maxLength = 80 } = {}) {
  if (!input) return '';
  let slug = String(input)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '');
  return slug || 'post';
}

/** Extract the last path segment of a Blogger URL as a fallback slug. */
function slugFromUrl(url) {
  try {
    const path = new URL(url).pathname.replace(/\.html?$/, '');
    const seg = path.split('/').filter(Boolean).pop() || '';
    return slugify(seg);
  } catch {
    return '';
  }
}

/** Build a unique slug for a post (title-based, fallback to URL segment). */
function buildSlug(title, url, usedSlugs) {
  let base = slugify(title);
  if (!base || base === 'post') base = slugFromUrl(url) || 'post';
  let slug = base;
  let n = 2;
  while (usedSlugs.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  usedSlugs.add(slug);
  return slug;
}

/** Strip HTML tags and decode entities for plain-text extraction. */
function stripHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Build a plain-text excerpt of a given length. */
function excerpt(html, length = 170) {
  const text = stripHtml(html);
  if (text.length <= length) return text;
  const cut = text.slice(0, length);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : length).trim()}…`;
}

/** Estimate reading time in minutes (200 wpm, Bengali-aware). */
function readTime(html) {
  const text = stripHtml(html);
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Sanitize Blogger HTML for safe embedding:
 * - strips scripts/styles/iframes/forms
 * - upgrades Blogger thumbnail URLs to larger sizes
 * - makes relative links absolute
 * - removes empty paragraphs
 */
function sanitizeHtml(html, baseUrl = 'https://imrankhanlincoln.blogspot.com') {
  let out = String(html || '');
  out = out.replace(/<script[\s\S]*?<\/script>/gi, '');
  out = out.replace(/<style[\s\S]*?<\/style>/gi, '');
  out = out.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
  out = out.replace(/<form[\s\S]*?<\/form>/gi, '');
  out = out.replace(/<link[\s\S]*?>/gi, '');
  out = out.replace(/<meta[\s\S]*?>/gi, '');
  out = out.replace(/on\w+="[^"]*"/gi, '');
  out = out.replace(/on\w+='[^']*'/gi, '');
  // Upgrade Blogger image sizes
  out = out.replace(/\/(?:s\d+|w\d+-h\d+)[^\/]*\//gi, '/s1600/');
  // Absolute-ize relative links
  out = out.replace(/(href|src)="\/(?!\/)/g, `$1="${baseUrl}/`);
  // Remove empty paragraphs
  out = out.replace(/<p>\s*(&nbsp;)?\s*<\/p>/gi, '');
  return out;
}

/** Extract the first usable image URL from post content. */
function extractImage(content, thumbnail) {
  if (thumbnail) {
    return thumbnail.replace(/\/(?:s\d+|w\d+-h\d+)[^\/]*\//i, '/s1600/');
  }
  const m = String(content || '').match(/<img[^>]+src="([^">]+)"/i);
  return m && m[1] ? m[1].replace(/\/(?:s\d+|w\d+-h\d+)[^\/]*\//i, '/s1600/') : '';
}

/** Classify a post into a category based on keyword matching. */
function classifyCategory(title, content) {
  const haystack = `${title} ${stripHtml(content)}`.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const rule of CATEGORY_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (haystack.includes(kw.toLowerCase())) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = rule;
    }
  }
  return best || FALLBACK_CATEGORY;
}

/** Format an ISO date for display (e.g. "7 August 2026"). */
function formatDate(iso, locale = 'en-GB') {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Escape HTML for safe attribute/text embedding. */
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Normalize a raw Blogger entry into a clean post object. */
function normalizePost(entry, usedSlugs) {
  const id = entry.id.$t;
  const title = entry.title.$t;
  const rawContent = entry.content ? entry.content.$t : '';
  const published = entry.published.$t;
  const updated = entry.updated.$t;
  const bloggerLabels = entry.category ? entry.category.map((c) => c.term) : [];
  const author = entry.author?.[0]?.name?.$t || 'Md. Imran Khan Lincoln';
  const linkObj = entry.link?.find((l) => l.rel === 'alternate');
  const url = linkObj ? linkObj.href : '';
  const thumbnail = entry['media$thumbnail']?.url || '';
  const image = extractImage(rawContent, thumbnail);
  const category = classifyCategory(title, rawContent);

  return {
    id,
    title,
    slug: buildSlug(title, url, usedSlugs),
    content: sanitizeHtml(rawContent),
    excerpt: excerpt(rawContent),
    published,
    updated,
    author,
    url,
    image,
    categories: bloggerLabels.length ? bloggerLabels : [category.label],
    category: { slug: category.slug, label: category.label },
    readTime: readTime(rawContent),
  };
}

module.exports = {
  CATEGORY_RULES,
  FALLBACK_CATEGORY,
  slugify,
  slugFromUrl,
  buildSlug,
  stripHtml,
  excerpt,
  readTime,
  sanitizeHtml,
  extractImage,
  classifyCategory,
  formatDate,
  escapeHtml,
  normalizePost,
};
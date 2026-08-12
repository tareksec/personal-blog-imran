import { kv } from '@vercel/kv';
import { normalizePost } from '../lib/posts.js';

/**
 * POST /api/sync-blog (also triggered by Vercel Cron)
 * Fetches ALL posts from Blogger (paginated), normalizes them with the
 * shared lib, and stores them in Vercel KV:
 *   post:<id>       — full normalized post
 *   blog:index      — ordered list of post IDs
 *   blog:categories — category slug → { slug, label, count }
 */

const BLOGGER_FEED = 'https://imrankhanlincoln.blogspot.com/feeds/posts/default?alt=json';
const PAGE_SIZE = 150;
const TIMEOUT_MS = 25000;

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'imranvai-sync/1.0' } });
    if (!res.ok) throw new Error(`Blogger feed responded ${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchAllEntries() {
  const first = await fetchWithTimeout(`${BLOGGER_FEED}&max-results=${PAGE_SIZE}&start-index=1`);
  const total = parseInt(first.feed?.openSearch$totalResults?.$t, 10) || 0;
  const entries = [...(first.feed?.entry || [])];
  for (let start = PAGE_SIZE + 1; start <= total; start += PAGE_SIZE) {
    const page = await fetchWithTimeout(`${BLOGGER_FEED}&max-results=${PAGE_SIZE}&start-index=${start}`);
    entries.push(...(page.feed?.entry || []));
  }
  return entries;
}

export default async function handler(req, res) {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return res.status(503).json({ success: false, error: 'KV is not configured. Set KV_REST_API_URL and KV_REST_API_TOKEN.' });
    }

    const entries = await fetchAllEntries();
    const usedSlugs = new Set();
    const posts = entries.map((e) => normalizePost(e, usedSlugs));
    posts.sort((a, b) => new Date(b.published) - new Date(a.published));

    const index = [];
    const catCounts = new Map();
    for (const post of posts) {
      await kv.set(`post:${post.id}`, post);
      index.push(post.id);
      const key = post.category.slug;
      catCounts.set(key, (catCounts.get(key) || 0) + 1);
    }

    await kv.set('blog:index', index);

    const categories = [...catCounts.entries()].map(([slug, count]) => {
      const post = posts.find((p) => p.category.slug === slug);
      return { slug, label: post ? post.category.label : slug, count };
    });
    await kv.set('blog:categories', categories);

    res.status(200).json({
      success: true,
      message: `Sync complete. Synced: ${posts.length}`,
      count: posts.length,
      categories,
    });
  } catch (error) {
    console.error('Error syncing blog:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

/**
 * GET /api/get-blogs
 * Query params:
 *   limit    — max posts to return (default 50, max 100)
 *   offset   — pagination offset (default 0)
 *   category — filter by category slug
 *   slug     — return a single post by slug
 *   q        — full-text search over title/excerpt/category
 *
 * Reads from Vercel KV when configured; falls back to the
 * build-time data/posts.json snapshot otherwise.
 */

function loadLocalPosts() {
  try {
    const file = path.join(process.cwd(), 'data', 'posts.json');
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  try {
    let posts = [];

    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const index = (await kv.get('blog:index')) || [];
      if (index.length) {
        const fetched = await Promise.all(index.map((id) => kv.get(`post:${id}`)));
        posts = fetched.filter(Boolean);
      }
    }

    if (!posts.length) {
      posts = loadLocalPosts();
    }

    // Sort newest first
    posts.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

    const { limit = '50', offset = '0', category, slug, q } = req.query;

    // Single post lookup by slug
    if (slug) {
      const post = posts.find((p) => p.slug === slug);
      if (!post) return res.status(404).json({ error: 'Post not found' });
      return res.status(200).json({ post });
    }

    let filtered = posts;

    if (category) {
      filtered = filtered.filter((p) => p.category && p.category.slug === category);
    }

    if (q) {
      const needle = String(q).toLowerCase();
      filtered = filtered.filter((p) => {
        const hay = `${p.title || ''} ${p.excerpt || ''} ${(p.category && p.category.label) || ''}`.toLowerCase();
        return hay.includes(needle);
      });
    }

    const total = filtered.length;
    const start = Math.max(0, parseInt(offset, 10) || 0);
    const size = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const page = filtered.slice(start, start + size);

    res.status(200).json({ posts: page, total, limit: size, offset: start });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
}

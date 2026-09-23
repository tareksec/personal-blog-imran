#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const QUEUE_FILE = path.join(ROOT, 'data', 'queue-posts.json');
const LOCAL_POSTS_FILE = path.join(ROOT, 'data', 'local-posts.json');
const HISTORY_FILE = path.join(ROOT, 'data', 'publish-history.json');

function loadJson(filePath, fallback = []) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.warn(Warning loading : );
  }
  return fallback;
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

async function run() {
  console.log('=== Daily Post Publisher (personal-blog-imran) ===');
  console.log(Current Time (UTC): );

  const queue = loadJson(QUEUE_FILE, []);
  if (!Array.isArray(queue) || queue.length === 0) {
    console.log('No pending posts in queue. Nothing to publish today.');
    process.exit(0);
  }

  const post = queue.shift();
  const nowIso = new Date().toISOString();
  post.published = nowIso;
  post.updated = nowIso;

  const localPosts = loadJson(LOCAL_POSTS_FILE, []);
  const exists = localPosts.some((p) => p.slug === post.slug);
  if (!exists) {
    localPosts.unshift(post);
    saveJson(LOCAL_POSTS_FILE, localPosts);
    console.log(Added post to local-posts.json: " ());
 } else {
 console.log(Post with slug  already exists in local-posts.json.);
 }

 saveJson(QUEUE_FILE, queue);
 console.log(Updated queue. Remaining posts: );

 const history = loadJson(HISTORY_FILE, []);
 history.push({
 title: post.title,
 slug: post.slug,
 publishedAt: nowIso,
 remainingInQueue: queue.length
 });
 saveJson(HISTORY_FILE, history);

 console.log('Rebuilding static site via sync-cli.js...');
 try {
 execSync('node sync-cli.js', { cwd: ROOT, stdio: 'inherit' });
 console.log('Site static build completed successfully.');
 } catch (err) {
 console.error(Build failed: );
 process.exit(1);
 }

 console.log(Successfully published . posts remaining in queue.);
}

run().catch((err) => {
 console.error('Fatal error in daily publisher:', err);
 process.exit(1);
});

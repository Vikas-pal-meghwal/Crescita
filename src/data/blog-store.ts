/**
 * blog-store.ts
 * Single source of truth for blog posts.
 * Reads from / writes to localStorage so admin changes
 * are reflected on the public blog pages without a server.
 */

import type { BlogPost } from "./blog-data";
import { BLOG_POSTS as DEFAULT_POSTS } from "./blog-data";

const KEY = "crescita_blogs";

/** Load posts — localStorage first, then seed defaults */
export function loadPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as BlogPost[];
  } catch {
    // corrupted storage — fall through to defaults
  }
  // First load: seed with defaults and persist
  localStorage.setItem(KEY, JSON.stringify(DEFAULT_POSTS));
  return DEFAULT_POSTS;
}

/** Persist posts array */
export function savePosts(posts: BlogPost[]): void {
  localStorage.setItem(KEY, JSON.stringify(posts));
}

/** Add or update a single post (upsert by slug) */
export function upsertPost(post: BlogPost): void {
  const posts = loadPosts();
  const idx = posts.findIndex((p) => p.slug === post.slug);
  if (idx >= 0) posts[idx] = post;
  else posts.unshift(post);
  savePosts(posts);
}

/** Delete a post by slug */
export function deletePost(slug: string): void {
  const posts = loadPosts().filter((p) => p.slug !== slug);
  savePosts(posts);
}

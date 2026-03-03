/**
 * One-time migration: export all posts from Turso DB to Markdown files.
 *
 * Usage:
 *   npx tsx src/scripts/migrate-posts-to-md.ts
 *
 * Requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN env vars.
 */

import fs from "fs";
import path from "path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";
import type { Post } from "../db/schema";
import { getContentSections } from "../lib/content-sections";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

interface Reference {
  title: string;
  author: string;
  url?: string;
}

function unescapeNewlines(text: string | null): string {
  if (!text) return "";
  // DB may store literal \n\n — convert to real newlines
  return text.replace(/\\n/g, "\n");
}

function buildFrontmatter(post: Post): string {
  const lines: string[] = ["---"];

  lines.push(`slug: ${post.slug}`);
  lines.push(`status: ${post.status}`);
  lines.push(`locale: ${post.locale}`);
  if (post.translationGroup) {
    lines.push(`translationGroup: ${post.translationGroup}`);
  }
  if (post.publishedAt) {
    lines.push(`publishedAt: "${post.publishedAt}"`);
  }
  lines.push("");

  lines.push(`topicTag: ${post.topicTag}`);
  lines.push(`headline: ${JSON.stringify(post.headline)}`);
  if (post.subtitle && post.subtitle !== "Swipe to learn why") {
    lines.push(`subtitle: ${JSON.stringify(post.subtitle)}`);
  }
  if (post.iconType && post.iconType !== "clock") {
    lines.push(`iconType: ${post.iconType}`);
  }
  lines.push("");

  lines.push(`quote: ${JSON.stringify(unescapeNewlines(post.quote))}`);
  if (post.quoteAttribution) {
    lines.push(`quoteAttribution: ${JSON.stringify(post.quoteAttribution)}`);
  }
  if (post.quoteIconType && post.quoteIconType !== "sun") {
    lines.push(`quoteIconType: ${post.quoteIconType}`);
  }
  lines.push("");

  if (post.ctaText && post.ctaText !== "Follow for {more} psychology life hacks") {
    lines.push(`ctaText: ${JSON.stringify(post.ctaText)}`);
  }

  // Hashtags
  let hashtags: string[] = [];
  try {
    hashtags = JSON.parse(post.hashtags);
  } catch {
    hashtags = post.hashtags.split(/\s+/).filter(Boolean);
  }
  lines.push("hashtags:");
  for (const tag of hashtags) {
    lines.push(`  - ${JSON.stringify(tag)}`);
  }

  if (post.handleBio && post.handleBio !== "psychology \u00B7 life hacks \u00B7 mental health") {
    lines.push(`handleBio: ${JSON.stringify(post.handleBio)}`);
  }
  lines.push("");

  if (post.colorPalette && post.colorPalette !== "sage") {
    lines.push(`colorPalette: ${post.colorPalette}`);
  }
  if (post.logoVariant && post.logoVariant !== "light") {
    lines.push(`logoVariant: ${post.logoVariant}`);
  }

  // References
  if (post.references) {
    try {
      const refs: Reference[] = JSON.parse(post.references);
      if (refs.length > 0) {
        lines.push("");
        lines.push("references:");
        for (const ref of refs) {
          lines.push(`  - title: ${JSON.stringify(ref.title)}`);
          lines.push(`    author: ${JSON.stringify(ref.author)}`);
          if (ref.url) {
            lines.push(`    url: ${JSON.stringify(ref.url)}`);
          }
        }
      }
    } catch {}
  }

  lines.push("---");
  return lines.join("\n");
}

function buildBody(post: Post): string {
  const sections = getContentSections(post);
  const parts: string[] = [];

  for (const section of sections) {
    parts.push(`## ${section.tag}`);
    parts.push("");
    parts.push(unescapeNewlines(section.body));
    parts.push("");
  }

  // Add caption after horizontal rule
  if (post.caption) {
    parts.push("---");
    parts.push("");
    parts.push(unescapeNewlines(post.caption).trim());
    parts.push("");
  }

  return parts.join("\n");
}

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const db = drizzle(client, { schema });

  const allPosts = await db.select().from(schema.posts);

  if (allPosts.length === 0) {
    console.log("No posts found in database.");
    process.exit(0);
  }

  console.log(`Found ${allPosts.length} post(s) to migrate.\n`);

  fs.mkdirSync(POSTS_DIR, { recursive: true });

  for (const post of allPosts) {
    const frontmatter = buildFrontmatter(post);
    const body = buildBody(post);
    const content = frontmatter + "\n\n" + body;

    const filename = `${post.slug}.md`;
    const filePath = path.join(POSTS_DIR, filename);

    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`  ${filename} (${post.status}, ${post.locale})`);
  }

  console.log(`\nDone! ${allPosts.length} file(s) written to content/posts/`);
  process.exit(0);
}

main().catch((e) => {
  console.error("Error:", e.message || e);
  process.exit(1);
});

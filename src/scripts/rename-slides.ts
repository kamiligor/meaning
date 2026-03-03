/**
 * One-time script: rename existing slide PNGs from random-hash names
 * to deterministic {slug}-slide-{slideNumber}.png names.
 *
 * Usage:
 *   npx tsx src/scripts/rename-slides.ts
 *
 * Requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN env vars.
 */

import fs from "fs";
import path from "path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";
import { getStorageDir } from "../lib/storage";

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const db = drizzle(client, { schema });

  const allPosts = await db.select().from(schema.posts);
  const allSlides = await db.select().from(schema.slides);

  const postMap = new Map(allPosts.map((p) => [p.id, p]));
  const storageDir = getStorageDir();

  let renamed = 0;
  let missing = 0;

  for (const slide of allSlides) {
    const post = postMap.get(slide.postId);
    if (!post) {
      console.log(`  SKIP: slide ${slide.filename} — post ${slide.postId} not found`);
      continue;
    }

    const newFilename = `${post.slug}-slide-${slide.slideNumber}.png`;
    const oldPath = path.join(storageDir, slide.filename);
    const newPath = path.join(storageDir, newFilename);

    if (slide.filename === newFilename) {
      continue; // Already has correct name
    }

    if (!fs.existsSync(oldPath)) {
      console.log(`  MISSING: ${slide.filename}`);
      missing++;
      continue;
    }

    fs.renameSync(oldPath, newPath);
    console.log(`  ${slide.filename} → ${newFilename}`);
    renamed++;
  }

  console.log(`\nDone! Renamed: ${renamed}, Missing: ${missing}`);
  process.exit(0);
}

main().catch((e) => {
  console.error("Error:", e.message || e);
  process.exit(1);
});

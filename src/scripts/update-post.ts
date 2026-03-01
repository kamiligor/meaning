/**
 * CLI script to update an existing post's text fields.
 *
 * Usage:
 *   npx tsx src/scripts/update-post.ts <id> '{"caption":"new caption", ...}'
 *   npx tsx src/scripts/update-post.ts <id> --file patch.json
 *
 * Only provided fields are updated. Slides are NOT regenerated.
 */

import { readFileSync } from "fs";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";

async function main() {
  const args = process.argv.slice(2);
  const id = parseInt(args[0]);
  if (!id) {
    console.error("Usage: npx tsx src/scripts/update-post.ts <id> '<json>' | --file patch.json");
    process.exit(1);
  }

  let rawJson: string;
  if (args[1] === "--file" && args[2]) {
    rawJson = readFileSync(args[2], "utf-8");
  } else if (args[1]) {
    rawJson = args[1];
  } else {
    console.error("Missing JSON patch data");
    process.exit(1);
  }

  const patch = JSON.parse(rawJson);

  // Serialize arrays/objects if provided
  if (Array.isArray(patch.contentSlides)) {
    patch.contentSlides = JSON.stringify(patch.contentSlides);
  }
  if (Array.isArray(patch.hashtags)) {
    patch.hashtags = JSON.stringify(patch.hashtags);
  }
  if (Array.isArray(patch.references)) {
    patch.references = JSON.stringify(patch.references);
  }

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const db = drizzle(client, { schema });

  const [updated] = await db
    .update(schema.posts)
    .set(patch)
    .where(eq(schema.posts.id, id))
    .returning();

  if (!updated) {
    console.error(`Post #${id} not found`);
    process.exit(1);
  }

  console.log(`Post #${id} updated.`);
  console.log("Updated fields:", Object.keys(patch).join(", "));
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

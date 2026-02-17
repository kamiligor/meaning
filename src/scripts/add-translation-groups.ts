/**
 * Link existing EN/PL post pairs by setting translation_group.
 * Pairs matched by creation order: EN posts (1,3,4,5) <-> PL posts (6,7,8,9).
 */
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";

const pairs: [number, number][] = [
  [1, 6],  // Wake-Up Time
  [3, 7],  // Protein Breakfast
  [4, 8],  // Negotiate
  [5, 9],  // Paradoxical Intention
];

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const db = drizzle(client, { schema });

  // Add column (ignore if already exists)
  try {
    await client.execute("ALTER TABLE posts ADD COLUMN translation_group TEXT");
    console.log("Column added.");
  } catch {
    console.log("Column already exists.");
  }

  // Clear old values
  await client.execute("UPDATE posts SET translation_group = NULL");

  for (const [enId, plId] of pairs) {
    const enPost = await db.query.posts.findFirst({ where: eq(schema.posts.id, enId) });
    if (!enPost) continue;

    const groupId = enPost.slug;
    await db.update(schema.posts).set({ translationGroup: groupId }).where(eq(schema.posts.id, enId));
    await db.update(schema.posts).set({ translationGroup: groupId }).where(eq(schema.posts.id, plId));

    const plPost = await db.query.posts.findFirst({ where: eq(schema.posts.id, plId) });
    console.log(`Group "${groupId}": #${enId} (en) + #${plId} (pl) "${plPost?.slug}"`);
  }

  console.log("\nDone.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

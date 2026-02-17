import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";
import { generateSlug } from "../lib/slug";

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const db = drizzle(client, { schema });

  const allPosts = await db.select().from(schema.posts);

  for (const p of allPosts) {
    const newSlug = generateSlug(p.headline);
    if (p.slug !== newSlug) {
      await db.update(schema.posts).set({ slug: newSlug }).where(eq(schema.posts.id, p.id));
      console.log(`#${p.id}: "${p.slug}" -> "${newSlug}"`);
    }
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

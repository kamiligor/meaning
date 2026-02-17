import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const db = drizzle(client, { schema });

  const slug = process.argv[2];
  if (!slug) { console.error("Usage: npx tsx src/scripts/show-post.ts <slug>"); process.exit(1); }

  const post = await db.query.posts.findFirst({ where: eq(schema.posts.slug, slug) });
  if (!post) { console.error("Not found"); process.exit(1); }

  console.log("contentBody length:", post.contentBody.length);
  console.log("contentBody:", post.contentBody);
  console.log("\nAll posts contentBody lengths:");

  const all = await db.select({ id: schema.posts.id, slug: schema.posts.slug, contentBody: schema.posts.contentBody }).from(schema.posts);
  for (const p of all) {
    console.log(`  #${p.id} ${p.slug}: ${p.contentBody.length} chars`);
  }

  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

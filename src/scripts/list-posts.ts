import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const db = drizzle(client, { schema });

  const posts = await db
    .select({
      id: schema.posts.id,
      headline: schema.posts.headline,
      locale: schema.posts.locale,
      status: schema.posts.status,
    })
    .from(schema.posts);

  for (const p of posts) {
    console.log(`#${p.id} [${p.locale}] [${p.status}] ${p.headline}`);
  }
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

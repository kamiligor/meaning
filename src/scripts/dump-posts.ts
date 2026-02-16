import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const db = drizzle(client, { schema });
  const posts = await db.select().from(schema.posts);
  console.log(JSON.stringify(posts, null, 2));
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

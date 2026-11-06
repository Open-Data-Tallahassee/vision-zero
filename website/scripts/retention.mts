// Monthly retention run: `npm run retention:purge` (needs DATABASE_URL for the target branch).
import nextEnv from "@next/env";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { purgeExpired } from "../src/server/requests/retention.ts";

nextEnv.loadEnvConfig(process.cwd());
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}
const db = new PrismaClient({ adapter: new PrismaNeonHttp(url, {}) });
const result = await purgeExpired(db);
console.log(JSON.stringify(result, null, 2));

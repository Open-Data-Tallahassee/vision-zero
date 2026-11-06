import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

// Load the same .env / .env.local files Next.js uses, so CLI commands hit the same database.
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Migrations need the direct (unpooled) connection.
  datasource: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "" },
});

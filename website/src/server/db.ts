import "server-only";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client.ts";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** Null when no database is configured, so pages can show the pathway as closed instead of failing. */
export function getDb(): PrismaClient | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({ adapter: new PrismaNeonHttp(url, {}) });
  }
  return globalForPrisma.prisma;
}

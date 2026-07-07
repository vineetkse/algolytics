import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql/web";
import { getTursoConfig } from "@/lib/env";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function resolveDatabaseUrl(): string {
  const url = process.env.DATABASE_URL ?? "file:dev.db";
  if (!url.startsWith("file:")) return url;

  const filePath = url.slice("file:".length);
  if (filePath.startsWith("/") || /^[A-Za-z]:/.test(filePath)) {
    return url;
  }

  const normalized = filePath.replace(/^\.\//, "");
  const resolved = path.resolve(process.cwd(), "prisma", normalized);
  return `file:${resolved}`;
}

function createPrismaClient(): PrismaClient {
  const turso = getTursoConfig();

  if (turso) {
    const adapter = new PrismaLibSQL({
      url: turso.url,
      authToken: turso.authToken,
    });
    return new PrismaClient({ adapter });
  }

  return new PrismaClient({
    datasourceUrl: resolveDatabaseUrl(),
    log: process.env.NODE_ENV === "development" ? ["error"] : [],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { isTursoDatabase } from "@/lib/env";

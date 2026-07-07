import "dotenv/config";
import { defineConfig } from "prisma/config";

// prisma generate only needs a valid URL string — not a live DB connection.
// On Vercel we use TURSO_DATABASE_URL at runtime; fall back for install/build.
function resolveDatasourceUrl(): string {
  return (
    process.env.DATABASE_URL ??
    process.env.TURSO_DATABASE_URL ??
    "file:./prisma/dev.db"
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: resolveDatasourceUrl(),
  },
});

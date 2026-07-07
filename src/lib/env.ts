export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export function getTursoConfig(): { url: string; authToken: string } | null {
  const url =
    process.env.TURSO_DATABASE_URL ??
    (process.env.DATABASE_URL?.startsWith("libsql:")
      ? process.env.DATABASE_URL
      : undefined);

  if (!url) return null;

  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!authToken) {
    throw new ConfigError("TURSO_AUTH_TOKEN is not set");
  }

  return { url, authToken };
}

export function assertRuntimeConfig(): void {
  if (!process.env.AUTH_SECRET) {
    throw new ConfigError("AUTH_SECRET is not set");
  }

  if (process.env.VERCEL === "1") {
    const turso = getTursoConfig();
    if (!turso) {
      throw new ConfigError(
        "TURSO_DATABASE_URL is not set. SQLite files do not work on Vercel."
      );
    }
  }
}

export function isTursoDatabase(): boolean {
  return !!getTursoConfig();
}

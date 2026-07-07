import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertRuntimeConfig, ConfigError, getTursoConfig } from "@/lib/env";

export async function GET() {
  try {
    assertRuntimeConfig();
    await prisma.trainingProfile.count();
    return NextResponse.json({
      ok: true,
      database: getTursoConfig() ? "turso" : "sqlite",
    });
  } catch (err) {
    if (err instanceof ConfigError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 503 });
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }
}

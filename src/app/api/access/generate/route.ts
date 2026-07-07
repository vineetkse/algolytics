import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ConfigError, assertRuntimeConfig } from "@/lib/env";
import { isRateLimited } from "@/lib/rate-limit";
import {
  generateTrainingCode,
  normalizeTrainingCode,
  codeLookupKey,
  codeHint,
  hashTrainingCode,
} from "@/lib/training-code";
import { setSessionCookie } from "@/lib/session";

function errorResponse(err: unknown) {
  console.error("Generate training code error:", err);

  if (err instanceof ConfigError) {
    return NextResponse.json(
      { error: `Server setup incomplete: ${err.message}` },
      { status: 503 }
    );
  }

  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  if (lower.includes("no such table") || lower.includes("trainingprofile")) {
    return NextResponse.json(
      {
        error:
          "Database tables are missing. Run ./scripts/apply-turso-migrations.sh against your Turso database.",
      },
      { status: 503 }
    );
  }

  if (lower.includes("unauthorized") || lower.includes("401")) {
    return NextResponse.json(
      { error: "Database auth failed. Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN." },
      { status: 503 }
    );
  }

  return NextResponse.json({ error: "Failed to generate training code." }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    assertRuntimeConfig();

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(`generate:${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many codes generated. Try again in an hour." },
        { status: 429 }
      );
    }

    let code = generateTrainingCode();
    let normalized = normalizeTrainingCode(code);
    let lookup = codeLookupKey(normalized);

    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.trainingProfile.findUnique({
        where: { codeLookup: lookup },
      });
      if (!existing) break;
      code = generateTrainingCode();
      normalized = normalizeTrainingCode(code);
      lookup = codeLookupKey(normalized);
      attempts++;
    }

    const hash = await hashTrainingCode(normalized);
    const hint = codeHint(normalized);

    const profile = await prisma.trainingProfile.create({
      data: {
        codeLookup: lookup,
        codeHash: hash,
        codeHint: hint,
        progress: { create: {} },
      },
    });

    await setSessionCookie({ profileId: profile.id, codeHint: hint });

    return NextResponse.json({
      code,
      codeHint: hint,
      profileId: profile.id,
    });
  } catch (err) {
    return errorResponse(err);
  }
}

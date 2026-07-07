import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isRateLimited } from "@/lib/rate-limit";
import {
  generateTrainingCode,
  normalizeTrainingCode,
  codeLookupKey,
  codeHint,
  hashTrainingCode,
} from "@/lib/training-code";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  try {
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

    // Ensure uniqueness (extremely unlikely collision)
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
  } catch {
    return NextResponse.json({ error: "Failed to generate training code." }, { status: 500 });
  }
}

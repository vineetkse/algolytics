import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isRateLimited } from "@/lib/rate-limit";
import {
  normalizeTrainingCode,
  codeLookupKey,
  verifyTrainingCode,
  isValidCodeFormat,
  formatTrainingCode,
} from "@/lib/training-code";
import { setSessionCookie } from "@/lib/session";

const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

function isEnterRateLimited(ip: string): boolean {
  return isRateLimited(`enter:${ip}`, MAX_ATTEMPTS, WINDOW_MS);
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (isEnterRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait 15 minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const rawCode = String(body.code ?? "").trim();

    if (!rawCode || !isValidCodeFormat(rawCode)) {
      return NextResponse.json(
        { error: "Invalid code format. Use ALGO-XXXX-XXXX." },
        { status: 400 }
      );
    }

    const normalized = normalizeTrainingCode(rawCode);
    const lookup = codeLookupKey(normalized);

    const profile = await prisma.trainingProfile.findUnique({
      where: { codeLookup: lookup },
    });

    if (!profile) {
      return NextResponse.json({ error: "Training code not found." }, { status: 404 });
    }

    const valid = await verifyTrainingCode(normalized, profile.codeHash);
    if (!valid) {
      return NextResponse.json({ error: "Training code not found." }, { status: 404 });
    }

    await setSessionCookie({ profileId: profile.id, codeHint: profile.codeHint });

    return NextResponse.json({
      success: true,
      codeHint: profile.codeHint,
      formattedCode: formatTrainingCode(rawCode),
    });
  } catch {
    return NextResponse.json({ error: "Failed to verify code." }, { status: 500 });
  }
}

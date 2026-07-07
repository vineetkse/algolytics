import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  normalizeTrainingCode,
  codeLookupKey,
  verifyTrainingCode,
  isValidCodeFormat,
} from "@/lib/training-code";
import { clearSessionCookie, requireSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const rawCode = String(body.code ?? "").trim();

    if (!rawCode || !isValidCodeFormat(rawCode)) {
      return NextResponse.json(
        { error: "Enter your full training code to confirm deletion." },
        { status: 400 }
      );
    }

    const profile = await prisma.trainingProfile.findUnique({
      where: { id: session.profileId },
    });

    if (!profile) {
      await clearSessionCookie();
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const normalized = normalizeTrainingCode(rawCode);
    const lookup = codeLookupKey(normalized);
    const valid = await verifyTrainingCode(normalized, profile.codeHash);

    if (!valid || lookup !== profile.codeLookup) {
      return NextResponse.json(
        { error: "Training code does not match this profile." },
        { status: 403 }
      );
    }

    await prisma.trainingProfile.delete({
      where: { id: session.profileId },
    });
    await clearSessionCookie();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

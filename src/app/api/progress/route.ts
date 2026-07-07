import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import {
  defaultProgress,
  parseProgress,
  serializeProgress,
  applyDrillResult,
  completeSessionInProgress,
  updateProblemProgress,
  recordMockInterview,
  resetProblemProgress,
  recordDailyWorkout,
} from "@/lib/progress-server";
import type { DrillResult, TrainingSession } from "@/lib/types";

async function getOrCreateProgress(profileId: string) {
  let record = await prisma.userProgress.findUnique({ where: { profileId } });
  if (!record) {
    record = await prisma.userProgress.create({ data: { profileId } });
  }
  return record;
}

export async function GET() {
  try {
    const session = await requireSession();
    const record = await getOrCreateProgress(session.profileId);
    return NextResponse.json(parseProgress(record));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const action = body.action as string;

    const record = await getOrCreateProgress(session.profileId);
    let progress = parseProgress(record);

    if (action === "recordDrill") {
      const { result, sessionId, drillType } = body as {
        result: DrillResult;
        sessionId: string;
        drillType: TrainingSession["drillType"];
      };
      progress = applyDrillResult(progress, result, sessionId, drillType);
    } else if (action === "completeSession") {
      progress = completeSessionInProgress(progress, body.sessionId as string);
    } else if (action === "migrate") {
      const localProgress = body.progress as typeof defaultProgress;
      if (localProgress && localProgress.totalDrills > progress.totalDrills) {
        progress = { ...defaultProgress, ...localProgress };
      }
    } else if (action === "updateProblem") {
      const { problemId, status, code, language, verifiedSolved, testsPassed, testsTotal } =
        body as {
          problemId: string;
          status?: import("@/lib/types").ProblemStatus;
          code?: string;
          language?: string;
          verifiedSolved?: boolean;
          testsPassed?: number;
          testsTotal?: number;
        };
      progress = updateProblemProgress(progress, problemId, {
        status,
        code,
        language,
        verifiedSolved,
        testsPassed,
        testsTotal,
      });
    } else if (action === "resetProblem") {
      progress = resetProblemProgress(progress, body.problemId as string);
    } else if (action === "recordDailyWorkout") {
      progress = recordDailyWorkout(progress);
    } else if (action === "recordMockInterview") {
      progress = recordMockInterview(
        progress,
        body.record as import("@/lib/types").MockInterviewRecord
      );
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updated = await prisma.userProgress.update({
      where: { profileId: session.profileId },
      data: serializeProgress(progress),
    });

    return NextResponse.json(parseProgress(updated));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

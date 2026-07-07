import { journeyPhases } from "@/data/journey/phases";
import { getAccuracy, getMasteryPercent, getProblemSolveStats } from "@/lib/progress-server";
import type { UserProgress } from "@/lib/types";

export interface PhaseUnlockStatus {
  unlocked: boolean;
  reason: string;
}

export function getPhaseUnlockStatus(
  progress: UserProgress,
  phaseNumber: number
): PhaseUnlockStatus {
  if (phaseNumber <= 1) {
    return { unlocked: true, reason: "Always available" };
  }

  const stats = getProblemSolveStats(progress);
  const accuracy = getAccuracy(progress);
  const patternScores = Object.values(progress.patternMastery).map((m) =>
    getMasteryPercent(m.attempts, m.correct)
  );
  const avgPattern =
    patternScores.length > 0
      ? Math.round(patternScores.reduce((a, b) => a + b, 0) / patternScores.length)
      : 0;
  const mockCount = progress.mockInterviews?.length ?? 0;

  const thresholds: Record<number, { check: () => boolean; reason: string }> = {
    2: {
      check: () => progress.totalDrills >= 5,
      reason: "Complete 5 recognition drills (Phase 1)",
    },
    3: {
      check: () => accuracy >= 60 && patternScores.length >= 3,
      reason: "60%+ drill accuracy on 3+ patterns",
    },
    4: {
      check: () => stats.verified >= 3,
      reason: "3 verified problem solves",
    },
    5: {
      check: () => stats.verified >= 6 && avgPattern >= 65,
      reason: "6 verified solves and 65%+ avg pattern mastery",
    },
    6: {
      check: () => stats.verified >= 8 && mockCount >= 1,
      reason: "8 verified solves and 1 mock interview",
    },
  };

  for (let p = 2; p < phaseNumber; p++) {
    const t = thresholds[p];
    if (t && !t.check()) {
      const phase = journeyPhases.find((ph) => ph.number === p);
      return {
        unlocked: false,
        reason: `Complete Phase ${p} (${phase?.name ?? ""}): ${t.reason}`,
      };
    }
  }

  return { unlocked: true, reason: "Unlocked" };
}

export function getMaxUnlockedDay(progress: UserProgress): number {
  for (const phase of [...journeyPhases].reverse()) {
    if (getPhaseUnlockStatus(progress, phase.number).unlocked) {
      return phase.endDay;
    }
  }
  return journeyPhases[0].endDay;
}

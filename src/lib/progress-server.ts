import { normalizeMasteryEntry, updateSpacedRepetition } from "@/lib/spaced-repetition";
import { codingProblems } from "@/data/problems";
import type {
  DrillResult,
  MockInterviewRecord,
  ProblemProgressEntry,
  ProblemStatus,
  TrainingSession,
  UserProgress,
} from "@/lib/types";
import { getJudgeSupportedCount } from "@/data/problems/judge-config";

export const defaultProgress: UserProgress = {
  totalDrills: 0,
  correctDrills: 0,
  streak: 0,
  patternMastery: {},
  sessions: [],
  problemProgress: {},
  mockInterviews: [],
};

export function parseProgress(record: {
  totalDrills: number;
  correctDrills: number;
  streak: number;
  lastTrainedAt: Date | null;
  patternMastery: string;
  sessions: string;
  problemProgress?: string;
  mockInterviews?: string;
  lastDailyWorkoutAt?: Date | null;
}): UserProgress {
  const rawMastery = JSON.parse(record.patternMastery || "{}") as Record<
    string,
    Partial<import("@/lib/types").PatternMasteryEntry>
  >;
  const patternMastery: UserProgress["patternMastery"] = {};
  for (const [id, entry] of Object.entries(rawMastery)) {
    patternMastery[id] = normalizeMasteryEntry(entry);
  }

  const sessions = JSON.parse(record.sessions || "[]");
  const problemProgress = JSON.parse(record.problemProgress || "{}") as Record<
    string,
    ProblemProgressEntry
  >;

  const mockInterviews = JSON.parse(record.mockInterviews || "[]") as MockInterviewRecord[];

  return {
    totalDrills: record.totalDrills,
    correctDrills: record.correctDrills,
    streak: record.streak,
    lastTrainedAt: record.lastTrainedAt?.toISOString(),
    patternMastery,
    sessions,
    problemProgress,
    mockInterviews,
    lastDailyWorkoutAt: record.lastDailyWorkoutAt?.toISOString(),
  };
}

export function serializeProgress(progress: UserProgress) {
  return {
    totalDrills: progress.totalDrills,
    correctDrills: progress.correctDrills,
    streak: progress.streak,
    lastTrainedAt: progress.lastTrainedAt ? new Date(progress.lastTrainedAt) : null,
    patternMastery: JSON.stringify(progress.patternMastery),
    sessions: JSON.stringify(progress.sessions),
    problemProgress: JSON.stringify(progress.problemProgress ?? {}),
    mockInterviews: JSON.stringify(progress.mockInterviews ?? []),
    lastDailyWorkoutAt: progress.lastDailyWorkoutAt
      ? new Date(progress.lastDailyWorkoutAt)
      : null,
  };
}

export function applyDrillResult(
  progress: UserProgress,
  result: DrillResult,
  sessionId: string,
  drillType: TrainingSession["drillType"]
): UserProgress {
  const today = new Date().toISOString().slice(0, 10);
  const lastDay = progress.lastTrainedAt?.slice(0, 10);

  let streak = progress.streak;
  if (!lastDay) {
    streak = 1;
  } else if (lastDay === today) {
    // same day
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    streak = lastDay === yesterdayStr ? streak + 1 : 1;
  }

  const patternMastery = { ...progress.patternMastery };
  const base = normalizeMasteryEntry(patternMastery[result.patternId]);
  const withStats = {
    ...base,
    attempts: base.attempts + 1,
    correct: base.correct + (result.correct ? 1 : 0),
  };
  patternMastery[result.patternId] = updateSpacedRepetition(withStats, result.correct);

  const sessions = [...progress.sessions];
  let session = sessions.find((s) => s.id === sessionId);
  if (!session) {
    session = {
      id: sessionId,
      startedAt: new Date().toISOString(),
      drillType,
      results: [],
    };
    sessions.push(session);
  }
  session.results.push(result);

  return {
    ...progress,
    totalDrills: progress.totalDrills + 1,
    correctDrills: progress.correctDrills + (result.correct ? 1 : 0),
    streak,
    lastTrainedAt: new Date().toISOString(),
    patternMastery,
    sessions,
    problemProgress: progress.problemProgress ?? {},
  };
}

export function updateProblemProgress(
  progress: UserProgress,
  problemId: string,
  update: {
    status?: ProblemStatus;
    code?: string;
    language?: string;
    verifiedSolved?: boolean;
    testsPassed?: number;
    testsTotal?: number;
  }
): UserProgress {
  const problemProgress = { ...(progress.problemProgress ?? {}) };
  const existing = problemProgress[problemId] ?? {
    status: "not_started" as ProblemStatus,
    attempts: 0,
  };

  const now = new Date().toISOString();
  const next: ProblemProgressEntry = { ...existing };

  if (update.code !== undefined) next.code = update.code;
  if (update.language !== undefined) next.language = update.language;

  if (update.status === "attempted" && existing.status === "not_started") {
    next.status = "attempted";
    next.attempts = existing.attempts + 1;
    next.lastAttemptAt = now;
  } else   if (update.status === "solved" || update.verifiedSolved) {
    if (existing.status !== "solved") {
      next.attempts = existing.attempts + 1;
    }
    next.status = "solved";
    next.solvedAt = now;
    next.lastAttemptAt = now;
    if (update.verifiedSolved) next.verifiedSolved = true;
  } else if (update.status) {
    next.status = update.status;
  }

  if (update.testsPassed !== undefined) next.testsPassed = update.testsPassed;
  if (update.testsTotal !== undefined) next.testsTotal = update.testsTotal;

  if (update.code !== undefined && !update.status) {
    next.lastAttemptAt = now;
  }

  problemProgress[problemId] = next;

  return { ...progress, problemProgress, lastTrainedAt: now };
}

export function recordDailyWorkout(progress: UserProgress): UserProgress {
  const now = new Date().toISOString();
  return { ...progress, lastDailyWorkoutAt: now, lastTrainedAt: now };
}

export function resetProblemProgress(
  progress: UserProgress,
  problemId: string
): UserProgress {
  const problemProgress = { ...(progress.problemProgress ?? {}) };
  const existing = problemProgress[problemId];
  if (existing) {
    problemProgress[problemId] = {
      status: "not_started",
      attempts: existing.attempts,
    };
  }
  return { ...progress, problemProgress, lastTrainedAt: new Date().toISOString() };
}

export function completeSessionInProgress(
  progress: UserProgress,
  sessionId: string
): UserProgress {
  const sessions = progress.sessions.map((s) =>
    s.id === sessionId ? { ...s, completedAt: new Date().toISOString() } : s
  );
  return { ...progress, sessions };
}

export function getAccuracy(progress: UserProgress): number {
  if (progress.totalDrills === 0) return 0;
  return Math.round((progress.correctDrills / progress.totalDrills) * 100);
}

export function getMasteryPercent(attempts: number, correct: number): number {
  if (attempts === 0) return 0;
  return Math.round((correct / attempts) * 100);
}

export function getProblemSolveStats(progress: UserProgress) {
  const entries = Object.values(progress.problemProgress ?? {});
  const solved = entries.filter((e) => e.status === "solved").length;
  const verified = entries.filter((e) => e.verifiedSolved).length;
  const selfReported = entries.filter(
    (e) => e.status === "solved" && !e.verifiedSolved
  ).length;
  const attempted = entries.filter((e) => e.status === "attempted").length;
  const total = codingProblems.length;
  const judgeTotal = getJudgeSupportedCount();
  return {
    solved,
    verified,
    selfReported,
    attempted,
    total,
    judgeTotal,
    notStarted: total - solved - attempted,
  };
}

export function recordMockInterview(
  progress: UserProgress,
  record: MockInterviewRecord
): UserProgress {
  const mockInterviews = [...(progress.mockInterviews ?? []), record];
  return { ...progress, mockInterviews, lastTrainedAt: new Date().toISOString() };
}

export interface InterviewReadiness {
  overall: number;
  dimensions: {
    label: string;
    score: number;
    max: number;
    detail: string;
  }[];
  ready: boolean;
}

export function getInterviewReadiness(progress: UserProgress): InterviewReadiness {
  const stats = getProblemSolveStats(progress);
  const verifiedScore = Math.min(100, Math.round((stats.verified / Math.max(stats.judgeTotal, 1)) * 100));
  const patternIds = Object.keys(progress.patternMastery);
  const patternScores = patternIds.map((id) => {
    const m = progress.patternMastery[id];
    return getMasteryPercent(m.attempts, m.correct);
  });
  const avgPattern =
    patternScores.length > 0
      ? Math.round(patternScores.reduce((a, b) => a + b, 0) / patternScores.length)
      : 0;
  const drillScore = getAccuracy(progress);
  const mocks = progress.mockInterviews ?? [];
  const mockCount = mocks.length;
  const mockScore = Math.min(100, mockCount * 25);
  const avgRubric =
    mocks.length > 0
      ? Math.round(
          mocks.reduce(
            (sum, m) =>
              sum +
              (m.rubric.communication +
                m.rubric.problemSolving +
                m.rubric.coding +
                m.rubric.complexity +
                m.rubric.testing) /
                5,
            0
          ) / mocks.length
      )
      : 0;

  const dimensions = [
    {
      label: "Verified coding",
      score: stats.verified,
      max: stats.judgeTotal,
      detail: `${stats.verified} problems passed all tests`,
    },
    {
      label: "Pattern mastery",
      score: avgPattern,
      max: 100,
      detail: `${avgPattern}% avg across ${patternIds.length} patterns`,
    },
    {
      label: "Drill accuracy",
      score: drillScore,
      max: 100,
      detail: `${drillScore}% on recognition drills`,
    },
    {
      label: "Mock interviews",
      score: mockCount,
      max: 4,
      detail: mockCount > 0 ? `Avg rubric ${avgRubric}/5` : "Complete at least 1 mock",
    },
  ];

  const overall = Math.round(
    verifiedScore * 0.35 + avgPattern * 0.25 + drillScore * 0.2 + mockScore * 0.2
  );
  const ready = stats.verified >= 8 && avgPattern >= 70 && mockCount >= 2;

  return { overall, dimensions, ready };
}

export function getProblemStatus(
  progress: UserProgress,
  problemId: string
): ProblemStatus {
  return progress.problemProgress?.[problemId]?.status ?? "not_started";
}

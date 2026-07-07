import type { PatternMasteryEntry, UserProgress } from "@/lib/types";
import { patterns } from "@/data/patterns";
import { confusionPairs } from "@/data/confusion-pairs";
import { getMasteryPercent } from "@/lib/progress-server";

const DEFAULT_EASE = 2.5;

export function normalizeMasteryEntry(
  entry?: Partial<PatternMasteryEntry>
): PatternMasteryEntry {
  return {
    attempts: entry?.attempts ?? 0,
    correct: entry?.correct ?? 0,
    lastReviewedAt: entry?.lastReviewedAt,
    nextReviewAt: entry?.nextReviewAt,
    intervalDays: entry?.intervalDays ?? 0,
    easeFactor: entry?.easeFactor ?? DEFAULT_EASE,
  };
}

export function updateSpacedRepetition(
  entry: PatternMasteryEntry,
  correct: boolean
): PatternMasteryEntry {
  const now = new Date();
  let { intervalDays, easeFactor } = entry;

  if (correct) {
    if (intervalDays === 0) {
      intervalDays = 1;
    } else if (intervalDays === 1) {
      intervalDays = 3;
    } else {
      intervalDays = Math.max(1, Math.round(intervalDays * easeFactor));
    }
    easeFactor = Math.min(easeFactor + 0.1, 3.0);
  } else {
    intervalDays = 0;
    easeFactor = Math.max(easeFactor - 0.25, 1.3);
  }

  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + Math.max(intervalDays, 1));

  return {
    ...entry,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReview.toISOString(),
    intervalDays,
    easeFactor,
  };
}

export function isPatternDue(entry: PatternMasteryEntry, now = new Date()): boolean {
  if (!entry.nextReviewAt) return true;
  if (entry.attempts === 0) return true;
  const accuracy = getMasteryPercent(entry.attempts, entry.correct);
  if (accuracy < 70 && entry.attempts >= 2) return true;
  return new Date(entry.nextReviewAt) <= now;
}

export function getDuePatternIds(progress: UserProgress, limit = 5): string[] {
  const now = new Date();
  const due = patterns
    .map((p) => {
      const entry = normalizeMasteryEntry(progress.patternMastery[p.id]);
      return {
        id: p.id,
        due: isPatternDue(entry, now),
        priority: entry.attempts === 0 ? 0 : getMasteryPercent(entry.attempts, entry.correct),
      };
    })
    .filter((p) => p.due)
    .sort((a, b) => a.priority - b.priority);

  return due.slice(0, limit).map((p) => p.id);
}

export function getWeakPatternIds(progress: UserProgress, limit = 3): string[] {
  return Object.entries(progress.patternMastery)
    .filter(([, e]) => e.attempts >= 2)
    .map(([id, e]) => ({
      id,
      accuracy: getMasteryPercent(e.attempts, e.correct),
    }))
    .filter((p) => p.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit)
    .map((p) => p.id);
}

export function getConfusionPairIdsForPatterns(patternIds: string[]): string[] {
  const ids = new Set<string>();
  for (const patternId of patternIds) {
    for (const pair of confusionPairs) {
      if (pair.patternA === patternId || pair.patternB === patternId) {
        ids.add(pair.id);
      }
    }
  }
  return Array.from(ids);
}

export function getDueCount(progress: UserProgress): number {
  const now = new Date();
  return patterns.filter((p) =>
    isPatternDue(normalizeMasteryEntry(progress.patternMastery[p.id]), now)
  ).length;
}

export interface DailyWorkoutPlan {
  duePatternIds: string[];
  duelPatternIds: string[];
  spotCount: number;
  duelCount: number;
  gauntletSeconds: number;
}

export function buildDailyWorkout(progress: UserProgress): DailyWorkoutPlan {
  const duePatternIds = getDuePatternIds(progress, 4);
  const weakIds = getWeakPatternIds(progress, 3);
  const focusIds = [...new Set([...duePatternIds, ...weakIds])].slice(0, 4);

  if (focusIds.length === 0) {
    focusIds.push("two-pointers", "sliding-window", "tree-bfs", "tree-dfs");
  }

  return {
    duePatternIds: focusIds,
    duelPatternIds: focusIds,
    spotCount: Math.min(5, Math.max(3, focusIds.length)),
    duelCount: 3,
    gauntletSeconds: 60,
  };
}

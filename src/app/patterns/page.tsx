"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { patterns, categoryLabels } from "@/data/patterns";
import { getProblemsByPattern } from "@/data/problems";
import { getMasteryPercent, getProblemStatus } from "@/lib/progress";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useUserStudyPlan } from "@/hooks/useUserStudyPlan";
import Link from "next/link";

function PatternsPageContent() {
  const searchParams = useSearchParams();
  const { progress, isAuthenticated } = useUserProgress();
  const { markTaskComplete } = useUserStudyPlan();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [taskSaving, setTaskSaving] = useState(false);
  const [taskDone, setTaskDone] = useState(false);

  const taskId = searchParams.get("taskId");
  const expandParam = searchParams.get("expand");

  useEffect(() => {
    if (expandParam) setExpanded(expandParam);
  }, [expandParam]);

  async function handleTaskComplete() {
    if (!taskId) return;
    setTaskSaving(true);
    try {
      await markTaskComplete(taskId);
      setTaskDone(true);
    } finally {
      setTaskSaving(false);
    }
  }

  const categories = [...new Set(patterns.map((p) => p.category))];
  const filtered =
    filter === "all" ? patterns : patterns.filter((p) => p.category === filter);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div>
        <h1 className="text-3xl font-bold">Pattern Library</h1>
        <p className="mt-3 text-muted">
          22 core algorithmic patterns. Learn the signals, mental models, and when to apply each one.
          {isAuthenticated && progress && (
            <span className="block mt-1 text-xs text-accent">Showing your personal mastery levels</span>
          )}
        </p>
      </div>

      {taskId && !taskDone && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent/30 bg-accent/5 px-5 py-4">
          <p className="text-sm text-muted">
            Study plan task: read this pattern&apos;s signals and mental model, then mark complete.
          </p>
          <button
            onClick={handleTaskComplete}
            disabled={taskSaving}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background hover:bg-accent-dim disabled:opacity-50"
          >
            {taskSaving ? "Saving..." : "Mark complete"}
          </button>
        </div>
      )}
      {taskDone && (
        <div className="mt-6 rounded-xl border border-success/20 bg-success/5 px-5 py-3 text-sm text-success">
          ✓ Pattern study task complete.{" "}
          <Link href="/study-plan" className="underline">
            Back to plan
          </Link>
        </div>
      )}

      {/* Category filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            filter === "all"
              ? "bg-accent text-background"
              : "bg-surface-elevated text-muted hover:text-foreground"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              filter === cat
                ? "bg-accent text-background"
                : "bg-surface-elevated text-muted hover:text-foreground"
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Pattern cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {filtered.map((pattern) => {
          const mastery = progress?.patternMastery[pattern.id];
          const masteryPct = mastery
            ? getMasteryPercent(mastery.attempts, mastery.correct)
            : null;

          return (
            <div
              key={pattern.id}
              className="rounded-2xl border border-border bg-surface overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpanded(expanded === pattern.id ? null : pattern.id)
                }
                className="flex w-full items-start justify-between p-6 text-left"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{pattern.name}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        pattern.difficulty === "beginner"
                          ? "bg-success/10 text-success"
                          : pattern.difficulty === "intermediate"
                            ? "bg-warning/10 text-warning"
                            : "bg-error/10 text-error"
                      }`}
                    >
                      {pattern.difficulty}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-accent">{pattern.tagline}</p>
                </div>
                <div className="flex items-center gap-3">
                  {masteryPct !== null && (
                    <span className="font-mono text-sm text-muted">{masteryPct}%</span>
                  )}
                  <span className="text-muted">{expanded === pattern.id ? "−" : "+"}</span>
                </div>
              </button>

              {expanded === pattern.id && (
                <div className="border-t border-border px-6 pb-6 animate-slide-up">
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-muted">When to use</h4>
                    <p className="mt-1 text-sm leading-relaxed">{pattern.whenToUse}</p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-muted">Mental model</h4>
                    <p className="mt-1 text-sm leading-relaxed">{pattern.mentalModel}</p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-muted">Signals to watch for</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {pattern.signals.map((signal) => (
                        <span
                          key={signal}
                          className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent"
                        >
                          {signal}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted">
                      Complexity: <span className="font-mono text-foreground">{pattern.timeComplexity}</span>
                    </span>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-sm font-semibold text-muted">Example problems</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {pattern.exampleProblems.map((problem) => (
                        <span
                          key={problem}
                          className="rounded-lg bg-surface-elevated px-2.5 py-1 text-xs"
                        >
                          {problem}
                        </span>
                      ))}
                    </div>
                  </div>

                  {(() => {
                    const patternProblems = getProblemsByPattern(pattern.id);
                    const solved = progress
                      ? patternProblems.filter(
                          (p) => getProblemStatus(progress, p.id) === "solved"
                        ).length
                      : 0;
                    if (patternProblems.length === 0) return null;
                    return (
                      <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-accent">
                            Solve on Algolytics ({solved}/{patternProblems.length} done)
                          </h4>
                          <Link
                            href={`/problems?pattern=${pattern.id}`}
                            className="text-xs text-accent hover:underline"
                          >
                            View all →
                          </Link>
                        </div>
                        <div className="mt-3 space-y-1">
                          {patternProblems.slice(0, 4).map((p) => {
                            const st = progress
                              ? getProblemStatus(progress, p.id)
                              : "not_started";
                            return (
                              <Link
                                key={p.id}
                                href={`/problems/${p.id}`}
                                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-elevated transition-colors"
                              >
                                <span
                                  className={
                                    st === "solved"
                                      ? "text-success"
                                      : st === "attempted"
                                        ? "text-warning"
                                        : "text-muted"
                                  }
                                >
                                  {st === "solved" ? "●" : st === "attempted" ? "◐" : "○"}
                                </span>
                                {p.title}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PatternsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <PatternsPageContent />
    </Suspense>
  );
}

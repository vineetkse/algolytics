"use client";

import { useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getPatternById } from "@/data/patterns";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useUserStudyPlan } from "@/hooks/useUserStudyPlan";
import { buildDailyWorkout, getDueCount } from "@/lib/spaced-repetition";
import { Button } from "@/components/Button";
import { AuthRequired } from "@/components/AuthRequired";
import { useState } from "react";

function DailyWorkoutContent() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const { progress, loading, recordDailyWorkout } = useUserProgress();
  const { markTaskComplete } = useUserStudyPlan();
  const [taskSaving, setTaskSaving] = useState(false);
  const [taskDone, setTaskDone] = useState(false);

  const plan = useMemo(
    () => (progress ? buildDailyWorkout(progress) : null),
    [progress]
  );

  if (loading || !progress || !plan) {
    return (
      <div className="flex justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const dueCount = getDueCount(progress);

  async function handleWorkoutComplete() {
    setTaskSaving(true);
    try {
      await recordDailyWorkout();
      if (taskId) {
        await markTaskComplete(taskId);
      }
      setTaskDone(true);
    } finally {
      setTaskSaving(false);
    }
  }

  const spotParams = new URLSearchParams({
    count: String(plan.spotCount),
    patterns: plan.duePatternIds.join(","),
  });
  const duelParams = new URLSearchParams({
    count: String(plan.duelCount),
    patterns: plan.duelPatternIds.join(","),
  });
  const gauntletParams = new URLSearchParams({
    patterns: plan.duePatternIds.join(","),
    seconds: String(plan.gauntletSeconds),
  });

  const steps = [
    {
      step: 1,
      title: "Spaced Repetition",
      subtitle: `${plan.spotCount} patterns due for review`,
      description: "Reinforce patterns your brain is about to forget. Science-backed retention.",
      href: `/train/pattern-spot?${spotParams}`,
      color: "border-accent/30 bg-accent/5",
      badge: `${dueCount} due`,
    },
    {
      step: 2,
      title: "Pattern Duel",
      subtitle: `${plan.duelCount} confusion pair battles`,
      description: "Face the pattern pairs you confuse most. Two choices, zero hesitation.",
      href: `/train/pattern-duel?${duelParams}`,
      color: "border-indigo-500/30 bg-indigo-500/5",
      badge: "Confusion training",
    },
    {
      step: 3,
      title: "Timed Gauntlet",
      subtitle: `${plan.gauntletSeconds}s rapid fire`,
      description: "Pressure test. How many patterns can you spot before time runs out?",
      href: `/train/gauntlet?${gauntletParams}`,
      color: "border-warning/30 bg-warning/5",
      badge: "Speed drill",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        <span className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          ~10 min total
        </span>
        <h1 className="mt-4 text-3xl font-bold">Daily Brain Workout</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Your personalized expert pipeline — spaced repetition, confusion duels, and timed
          pressure. Built from your weak patterns.
        </p>
      </div>

      {plan.duePatternIds.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {plan.duePatternIds.map((id) => {
            const p = getPatternById(id);
            return p ? (
              <span
                key={id}
                className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs text-accent"
              >
                {p.name}
              </span>
            ) : null;
          })}
        </div>
      )}

      <div className="mt-10 space-y-4">
        {steps.map((s) => (
          <Link
            key={s.step}
            href={s.href}
            className={`group flex items-start gap-5 rounded-2xl border p-6 transition-all hover:glow-accent ${s.color}`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface font-mono font-bold text-accent">
              {s.step}
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold group-hover:text-accent transition-colors">
                  {s.title}
                </h2>
                <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-xs text-muted">
                  {s.badge}
                </span>
              </div>
              <p className="text-sm text-accent">{s.subtitle}</p>
              <p className="mt-1 text-sm text-muted">{s.description}</p>
            </div>
            <span className="text-muted group-hover:text-accent">→</span>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface-elevated p-6 text-center">
        <p className="text-sm text-muted">
          Complete all 3 steps daily to maximize pattern retention and interview speed.
        </p>
        {progress.lastDailyWorkoutAt && (
          <p className="mt-2 text-xs text-muted">
            Last completed: {new Date(progress.lastDailyWorkoutAt).toLocaleDateString()}
          </p>
        )}
        <Button href={steps[0].href} size="lg" className="mt-4">
          Start Step 1
        </Button>
        <div className="mt-6 border-t border-border pt-6">
          <p className="text-xs text-muted mb-3">
            {taskId
              ? "Mark this workout done after completing all 3 steps."
              : "Finished all 3 steps? Log your daily workout."}
          </p>
          <Button
            onClick={handleWorkoutComplete}
            disabled={taskSaving || taskDone}
            variant="secondary"
          >
            {taskSaving ? "Saving..." : taskDone ? "Workout logged ✓" : "Mark workout complete"}
          </Button>
        </div>
        {taskDone && taskId && (
          <p className="mt-4 text-sm text-success">
            ✓ Study plan task updated.{" "}
            <Link href="/study-plan" className="underline">
              Back to plan
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default function DailyWorkoutPage() {
  return (
    <AuthRequired
      title="Get your training code"
      description="Your daily workout is personalized from your pattern mastery data."
    >
      <Suspense
        fallback={
          <div className="flex justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        }
      >
        <DailyWorkoutContent />
      </Suspense>
    </AuthRequired>
  );
}

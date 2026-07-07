"use client";

import Link from "next/link";
import { getPatternById } from "@/data/patterns";
import { journeyPhases } from "@/data/journey/phases";
import { studyPlanTemplates } from "@/data/study-plan-templates";
import {
  generateStudyPlan,
  getTodayDay,
  getPlanProgress,
  getTaskTrainUrl,
  getTaskMeta,
  isReflectTask,
} from "@/lib/study-plan";
import type { StudyPlanTask, StudyPlanTemplate } from "@/lib/types";
import { useUserStudyPlan } from "@/hooks/useUserStudyPlan";
import { useUserProgress } from "@/hooks/useUserProgress";
import { getMaxUnlockedDay, getPhaseUnlockStatus } from "@/lib/journey-gating";
import { Button } from "@/components/Button";
import { AuthRequired } from "@/components/AuthRequired";
import { useState } from "react";

function StudyPlanContent() {
  const { plan, loading, savePlan, deletePlan, profile } = useUserStudyPlan();
  const { progress: userProgress } = useUserProgress();

  async function handleStartTemplate(template: StudyPlanTemplate) {
    const newPlan = generateStudyPlan(template);
    await savePlan(newPlan);
  }

  async function handleAbandonPlan() {
    if (confirm("Abandon your current study plan? Progress will be lost.")) {
      await deletePlan();
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!plan) {
    const journeyTemplate = studyPlanTemplates.find((t) => t.journeyId === "zero-to-google");
    const otherTemplates = studyPlanTemplates.filter((t) => !t.journeyId);

    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Your Study Plan</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            Structured training beats random practice. Pick a plan — your daily curriculum,
            progress, and pattern focus are saved to your account.
          </p>
        </div>

        {journeyTemplate && (
          <div className="mt-12">
            <TemplateCard
              template={journeyTemplate}
              onSelect={() => handleStartTemplate(journeyTemplate)}
              featured
            />
            <p className="mt-4 text-center text-sm text-muted">
              <Link href="/journey" className="text-accent hover:underline">
                Preview the full 6-phase journey →
              </Link>
            </p>
          </div>
        )}

        <h2 className="mt-16 text-center text-lg font-semibold text-muted">Other plans</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {otherTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={() => handleStartTemplate(template)}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/study-plan/create" className="text-sm text-accent hover:underline">
            Or build a custom plan with your own patterns and duration →
          </Link>
        </div>
      </div>
    );
  }

  const today = getTodayDay(plan);
  const progress = getPlanProgress(plan);
  const isJourney = plan.journeyId === "zero-to-google";
  const maxUnlockedDay = userProgress ? getMaxUnlockedDay(userProgress) : plan.totalDays;
  const todayLocked =
    isJourney && today && today.dayNumber > maxUnlockedDay;
  const unlockHint =
    today && userProgress
      ? getPhaseUnlockStatus(
          userProgress,
          journeyPhases.find(
            (p) => today.dayNumber >= p.startDay && today.dayNumber <= p.endDay
          )?.number ?? 1
        )
      : null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            {profile ? `Code ···${profile.codeHint}` : "Active Plan"}
            {isJourney && today?.phaseNumber && (
              <span className="ml-2">· Phase {today.phaseNumber} of 6</span>
            )}
          </span>
          <h1 className="mt-3 text-3xl font-bold">{plan.name}</h1>
          <p className="mt-2 text-muted">{plan.description}</p>
          {isJourney && (
            <Link href="/journey" className="mt-2 inline-block text-sm text-accent hover:underline">
              View journey map →
            </Link>
          )}
        </div>
        <button
          onClick={handleAbandonPlan}
          className="shrink-0 text-sm text-muted hover:text-error transition-colors"
        >
          Abandon
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Your Progress</span>
          <span className="font-mono text-accent">{progress.percent}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-elevated">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <div className="mt-4 flex gap-6 text-sm">
          <div>
            <span className="text-muted">Days completed</span>
            <p className="font-semibold">{progress.completedDays} / {progress.totalDays}</p>
          </div>
          <div>
            <span className="text-muted">Daily commitment</span>
            <p className="font-semibold">
              {today?.minutesEstimate ?? plan.minutesPerDay} min
            </p>
          </div>
          <div>
            <span className="text-muted">Patterns</span>
            <p className="font-semibold">{plan.patternIds.length}</p>
          </div>
        </div>
      </div>

      {isJourney && today && (
        <JourneyPhaseBar currentDay={today.dayNumber} maxUnlockedDay={maxUnlockedDay} />
      )}

      {todayLocked && unlockHint && (
        <div className="mt-6 rounded-xl border border-warning/30 bg-warning/5 px-5 py-4 text-sm">
          <p className="font-medium text-warning">Phase locked</p>
          <p className="mt-1 text-muted">
            Day {today.dayNumber} opens after earlier milestones: {unlockHint.reason}
          </p>
          <p className="mt-2 text-xs text-muted">
            You can preview the schedule below. Unlocked through day {maxUnlockedDay} based on your
            progress.
          </p>
        </div>
      )}

      {today && !todayLocked && (
        <div className="mt-10">
          {today.milestone && (
            <div className="mb-6 rounded-xl border border-accent/30 bg-accent/5 px-5 py-3 text-sm text-accent">
              🎯 Milestone: {today.milestone}
            </div>
          )}
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">{today.title}</h2>
            {progress.todayComplete && (
              <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs text-success">
                Complete
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-muted">{today.description}</p>

          {today.focusPatternIds.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {today.focusPatternIds.map((id) => {
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

          <div className="mt-6 space-y-3">
            {today.tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-xl font-semibold">Full Schedule</h2>
        <div className="mt-4 space-y-2">
          {plan.days.map((day) => {
            const isToday = today?.dayNumber === day.dayNumber;
            const tasksDone = day.tasks.filter((t) => t.completed).length;
            const locked = isJourney && day.dayNumber > maxUnlockedDay;
            return (
              <div
                key={day.dayNumber}
                className={`flex items-center justify-between rounded-xl border px-5 py-3 text-sm ${
                  locked
                    ? "border-border/50 bg-surface/50 opacity-60"
                    : isToday
                      ? "border-accent/40 bg-accent/5"
                      : day.completed
                        ? "border-success/20 bg-success/5"
                        : "border-border bg-surface"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-muted w-8 shrink-0">D{day.dayNumber}</span>
                  <div className="min-w-0">
                    <span className="block truncate">
                      {day.title}
                      {locked && (
                        <span className="ml-2 text-xs text-warning">🔒</span>
                      )}
                    </span>
                    {isJourney && day.phase && (
                      <span className="text-xs text-muted">{day.phase}</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted">
                  {day.completed ? "Done" : `${tasksDone}/${day.tasks.length} tasks`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function StudyPlanPage() {
  return (
    <AuthRequired
      title="Get your training code first"
      description="Generate a unique training code to create and save your personalized study plan across devices."
    >
      <StudyPlanContent />
    </AuthRequired>
  );
}

function TaskRow({ task }: { task: StudyPlanTask }) {
  const { markTaskComplete } = useUserStudyPlan();
  const [saving, setSaving] = useState(false);

  async function handleReflectComplete() {
    setSaving(true);
    try {
      await markTaskComplete(task.id);
    } finally {
      setSaving(false);
    }
  }

  const url = getTaskTrainUrl(task);
  const reflect = isReflectTask(task);

  return (
    <div
      className={`rounded-xl border p-5 transition-all ${
        task.completed
          ? "border-success/20 bg-success/5"
          : "border-border bg-surface hover:border-accent/30"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
              task.completed
                ? "bg-success/20 text-success"
                : "bg-surface-elevated text-muted"
            }`}
          >
            {task.completed ? "✓" : "○"}
          </span>
          <div>
            <p className="font-medium">{task.label}</p>
            <p className="text-xs text-muted">{getTaskMeta(task)}</p>
            {reflect && task.reflectPrompt && !task.completed && (
              <p className="mt-2 text-sm text-muted leading-relaxed">{task.reflectPrompt}</p>
            )}
          </div>
        </div>
        {!task.completed && reflect && (
          <button
            onClick={handleReflectComplete}
            disabled={saving}
            className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background hover:bg-accent-dim transition-colors disabled:opacity-50"
          >
            {saving ? "..." : "Done"}
          </button>
        )}
        {!task.completed && !reflect && url && (
          <Link
            href={url}
            className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background hover:bg-accent-dim transition-colors"
          >
            Start
          </Link>
        )}
      </div>
    </div>
  );
}

function JourneyPhaseBar({
  currentDay,
  maxUnlockedDay,
}: {
  currentDay: number;
  maxUnlockedDay: number;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
      <h3 className="text-sm font-medium text-muted">Journey phases</h3>
      <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {journeyPhases.map((phase) => {
          const active = currentDay >= phase.startDay && currentDay <= phase.endDay;
          const done = currentDay > phase.endDay;
          const locked = phase.startDay > maxUnlockedDay;
          return (
            <div
              key={phase.id}
              className={`rounded-lg border px-3 py-2 text-center text-xs ${
                locked
                  ? "border-border/50 text-muted/50"
                  : active
                    ? "border-accent bg-accent/10 text-accent"
                    : done
                      ? "border-success/20 bg-success/5 text-success"
                      : "border-border text-muted"
              }`}
            >
              <div className="font-semibold">P{phase.number}</div>
              <div className="mt-0.5 truncate">{phase.name.split(" ")[0]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  onSelect,
  featured,
}: {
  template: StudyPlanTemplate;
  onSelect: () => void;
  featured?: boolean;
}) {
  const difficultyColor = {
    beginner: "text-success",
    intermediate: "text-warning",
    advanced: "text-error",
  }[template.difficulty];

  return (
    <div
      className={`rounded-2xl border bg-surface p-8 transition-all hover:border-accent/40 ${
        featured ? "border-accent/40 glow-accent md:p-10" : "border-border"
      }`}
    >
      {featured && (
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-background">
          Recommended for beginners
        </span>
      )}
      <div className={`flex items-center justify-between ${featured ? "mt-4" : ""}`}>
        <h3 className="text-xl font-semibold">{template.name}</h3>
        <span className={`text-xs font-medium capitalize ${difficultyColor}`}>
          {template.difficulty}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted leading-relaxed">{template.description}</p>

      <div className="mt-4 flex gap-4 text-xs text-muted font-mono">
        <span>{template.totalDays} days</span>
        <span>{template.minutesPerDay} min/day</span>
        <span>{template.patternIds.length} patterns</span>
      </div>

      <ul className="mt-4 space-y-1.5">
        {template.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-sm text-muted">
            <span className="text-accent mt-0.5">✓</span>
            {h}
          </li>
        ))}
      </ul>

      <Button onClick={onSelect} className="mt-6 w-full">
        Start This Plan
      </Button>
    </div>
  );
}

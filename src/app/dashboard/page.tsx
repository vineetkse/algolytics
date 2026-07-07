"use client";

import { patterns } from "@/data/patterns";
import { getAccuracy, getMasteryPercent, getProblemSolveStats, getInterviewReadiness } from "@/lib/progress";
import { getPatternById } from "@/data/patterns";
import { getPlanProgress, getTodayDay } from "@/lib/study-plan";
import { getDueCount } from "@/lib/spaced-repetition";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useUserStudyPlan } from "@/hooks/useUserStudyPlan";
import { Button } from "@/components/Button";
import { AuthRequired } from "@/components/AuthRequired";
import Link from "next/link";

function DashboardContent() {
  const { progress, loading, profile } = useUserProgress();
  const { plan: studyPlan } = useUserStudyPlan();

  if (loading || !progress) {
    return (
      <div className="flex justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const accuracy = getAccuracy(progress);
  const masteredPatterns = Object.entries(progress.patternMastery).filter(
    ([, m]) => getMasteryPercent(m.attempts, m.correct) >= 80 && m.attempts >= 3
  );

  const weakPatterns = Object.entries(progress.patternMastery)
    .filter(([, m]) => m.attempts >= 2 && getMasteryPercent(m.attempts, m.correct) < 60)
    .sort(([, a], [, b]) => a.correct / a.attempts - b.correct / b.attempts);

  const dueCount = getDueCount(progress);
  const problemStats = getProblemSolveStats(progress);
  const readiness = getInterviewReadiness(progress);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold">Your Progress</h1>
      <p className="mt-2 text-muted">
        {profile
          ? `Training code ···${profile.codeHint} — synced across devices.`
          : "Your personal training stats."}
      </p>

      <Link
        href="/mock"
        className="mt-6 block rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5 transition-all hover:border-indigo-500/50"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-indigo-400 font-medium">Mock Coding Interview</p>
            <p className="font-semibold">
              {readiness.overall}% ready · {(progress.mockInterviews ?? []).length} mock(s) done
            </p>
          </div>
          <span className="text-indigo-400">→</span>
        </div>
        <p className="mt-2 text-xs text-muted">
          45-min simulation with real test judging →
        </p>
      </Link>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Interview readiness</h2>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs ${
              readiness.ready ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
            }`}
          >
            {readiness.ready ? "On track" : "Keep building"}
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-elevated">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${readiness.overall}%` }}
          />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {readiness.dimensions.map((d) => (
            <div key={d.label} className="text-sm">
              <div className="flex justify-between">
                <span className="text-muted">{d.label}</span>
                <span className="font-mono text-xs">
                  {d.score}/{d.max}
                </span>
              </div>
              <p className="text-xs text-muted">{d.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/train/daily"
        className="mt-6 block rounded-2xl border border-accent/30 bg-accent/5 p-5 transition-all hover:border-accent/50"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-accent font-medium">Daily Brain Workout</p>
            <p className="font-semibold">
              {dueCount > 0
                ? `${dueCount} patterns due for review`
                : "Complete your 3-step expert pipeline"}
            </p>
          </div>
          <span className="text-accent">→</span>
        </div>
      </Link>

      {studyPlan ? (
        <Link
          href="/study-plan"
          className="mt-6 block rounded-2xl border border-accent/30 bg-accent/5 p-5 transition-all hover:border-accent/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-accent font-medium">Active Study Plan</p>
              <p className="font-semibold">{studyPlan.name}</p>
            </div>
            <span className="font-mono text-sm text-accent">
              {getPlanProgress(studyPlan).percent}%
            </span>
          </div>
          <p className="mt-2 text-xs text-muted">
            {getTodayDay(studyPlan)?.title ?? "Continue your training"} →
          </p>
        </Link>
      ) : (
        <Link
          href="/study-plan"
          className="mt-6 block rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted hover:border-accent/30 transition-colors"
        >
          No study plan yet — <span className="text-accent">create one</span> for structured daily training
        </Link>
      )}

      {progress.totalDrills === 0 && problemStats.solved === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg text-muted">No training sessions yet.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button href="/train" size="lg">
              Start Training
            </Button>
            <Button href="/problems" variant="secondary" size="lg">
              Solve Problems
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              { label: "Total Drills", value: progress.totalDrills },
              { label: "Accuracy", value: `${accuracy}%` },
              { label: "Day Streak", value: progress.streak },
              { label: "Verified Solves", value: `${problemStats.verified}/${problemStats.judgeTotal}` },
              { label: "Self-reported", value: problemStats.selfReported },
              { label: "Patterns Mastered", value: masteredPatterns.length },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-surface p-6 text-center"
              >
                <div className="text-3xl font-bold text-accent">{stat.value}</div>
                <div className="mt-1 text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-semibold">Pattern Mastery</h2>
            <div className="mt-6 space-y-3">
              {patterns.map((pattern) => {
                const mastery = progress.patternMastery[pattern.id];
                const pct = mastery
                  ? getMasteryPercent(mastery.attempts, mastery.correct)
                  : 0;
                const attempts = mastery?.attempts ?? 0;

                return (
                  <div key={pattern.id} className="flex items-center gap-4">
                    <span className="w-40 shrink-0 text-sm truncate">{pattern.name}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-elevated">
                      <div
                        className="h-full rounded-full bg-accent transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-20 text-right font-mono text-xs text-muted">
                      {attempts > 0 ? `${pct}% (${attempts})` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {weakPatterns.length > 0 && (
            <div className="mt-12 rounded-2xl border border-warning/20 bg-warning/5 p-6">
              <h2 className="font-semibold text-warning">Needs Practice</h2>
              <p className="mt-1 text-sm text-muted">
                These patterns have low accuracy. Focus your next session here.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {weakPatterns.map(([id]) => {
                  const p = getPatternById(id);
                  return p ? (
                    <span
                      key={id}
                      className="rounded-full bg-warning/10 px-3 py-1 text-sm text-warning"
                    >
                      {p.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {progress.sessions.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold">Recent Sessions</h2>
              <div className="mt-4 space-y-3">
                {[...progress.sessions]
                  .reverse()
                  .slice(0, 5)
                  .map((session) => {
                    const correct = session.results.filter((r) => r.correct).length;
                    const total = session.results.length;
                    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

                    return (
                      <div
                        key={session.id}
                        className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4"
                      >
                        <div>
                          <span className="text-sm font-medium capitalize">
                            {session.drillType.replace("-", " ")}
                          </span>
                          <span className="ml-3 text-xs text-muted">
                            {new Date(session.startedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="font-mono text-sm">
                          {correct}/{total} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthRequired
      title="Get your training code"
      description="Generate a code to track your accuracy, streaks, pattern mastery, and session history."
    >
      <DashboardContent />
    </AuthRequired>
  );
}

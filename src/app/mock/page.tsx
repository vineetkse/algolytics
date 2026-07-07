"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_INTERVIEW_PROBLEM_IDS } from "@/data/problems/judge-config";
import { getProblemById } from "@/data/problems";
import { MOCK_DURATION_MINUTES, mockPhases } from "@/data/mock-interview";
import { useUserProgress } from "@/hooks/useUserProgress";
import { getInterviewReadiness } from "@/lib/progress";
import { Button } from "@/components/Button";
import { AuthRequired } from "@/components/AuthRequired";

function MockInterviewHome() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const { progress } = useUserProgress();
  const readiness = progress ? getInterviewReadiness(progress) : null;
  const mocks = progress?.mockInterviews ?? [];

  function startMock(id?: string) {
    const pool = [...MOCK_INTERVIEW_PROBLEM_IDS];
    const problemId = id ?? pool[Math.floor(Math.random() * pool.length)];
    const params = new URLSearchParams({ problemId });
    if (taskId) params.set("taskId", taskId);
    router.push(`/mock/session?${params}`);
  }

  useEffect(() => {
    if (taskId) startMock();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auto-start once when linked from study plan
  }, [taskId]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center">
        <span className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          Interview simulation
        </span>
        <h1 className="mt-4 text-4xl font-bold">Mock Coding Interview</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted leading-relaxed">
          A {MOCK_DURATION_MINUTES}-minute simulated coding round: clarify, examples, approach,
          code, test, and self-review. Random medium problem with real test judging.
        </p>
        <Button onClick={() => startMock()} size="lg" className="mt-8">
          Start mock interview
        </Button>
        {taskId && (
          <p className="mt-3 text-sm text-accent">Starting mock from your study plan…</p>
        )}
      </div>

      {readiness && (
        <div className="mt-12 rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Interview readiness</h2>
            <span className="font-mono text-2xl font-bold text-accent">{readiness.overall}%</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-elevated">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${readiness.overall}%` }}
            />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {readiness.dimensions.map((d) => (
              <div key={d.label} className="text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">{d.label}</span>
                  <span className="font-mono">
                    {d.score}/{d.max}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">{d.detail}</p>
              </div>
            ))}
          </div>
          {readiness.ready ? (
            <p className="mt-4 text-sm text-success">You meet baseline interview-ready criteria.</p>
          ) : (
            <p className="mt-4 text-sm text-warning">
              Target: 8+ verified solves, 70%+ pattern mastery, 2+ mocks.
            </p>
          )}
        </div>
      )}

      {mocks.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold">Mock history</h2>
          <div className="mt-4 space-y-3">
            {[...mocks].reverse().slice(0, 10).map((m) => {
              const p = getProblemById(m.problemId);
              const avg =
                (m.rubric.communication +
                  m.rubric.problemSolving +
                  m.rubric.coding +
                  m.rubric.complexity +
                  m.rubric.testing) /
                5;
              return (
                <div
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-5 py-4"
                >
                  <div>
                    <p className="font-medium">{p?.title ?? m.problemId}</p>
                    <p className="text-xs text-muted">
                      {new Date(m.completedAt).toLocaleDateString()} ·{" "}
                      {Math.round(m.durationMs / 60000)} min
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={m.testsPassed ? "text-success" : "text-warning"}>
                      {m.testsPassed ? "Tests passed" : "Tests failed"}
                    </span>
                    <span className="font-mono text-accent">{avg.toFixed(1)}/5 rubric</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-xl font-semibold">Interview flow</h2>
        <div className="mt-6 space-y-3">
          {mockPhases.map((p, i) => (
            <div
              key={p.id}
              className="flex gap-4 rounded-xl border border-border bg-surface p-4"
            >
              <span className="font-mono text-accent">{i + 1}</span>
              <div>
                <p className="font-medium">
                  {p.title}{" "}
                  <span className="text-xs text-muted">~{p.durationMin} min</span>
                </p>
                <p className="text-sm text-muted mt-1">{p.instructions[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-surface-elevated p-6">
        <h3 className="font-semibold">Problem pool</h3>
        <p className="mt-2 text-sm text-muted">
          Mocks draw from {MOCK_INTERVIEW_PROBLEM_IDS.length} judge-supported problems.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {MOCK_INTERVIEW_PROBLEM_IDS.slice(0, 8).map((id) => {
            const p = getProblemById(id);
            return p ? (
              <span
                key={id}
                className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-muted"
              >
                {p.title}
              </span>
            ) : null;
          })}
          <span className="text-xs text-muted">+ more</span>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        <Link href="/study-plan" className="text-accent hover:underline">
          Phase 6 of the Zero to Google journey includes weekly mocks →
        </Link>
      </p>
    </div>
  );
}

export default function MockInterviewPage() {
  return (
    <AuthRequired
      title="Get your training code"
      description="Mock interviews are saved to your profile for readiness tracking."
    >
      <Suspense
        fallback={
          <div className="flex justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        }
      >
        <MockInterviewHome />
      </Suspense>
    </AuthRequired>
  );
}

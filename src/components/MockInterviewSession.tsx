"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProblemById } from "@/data/problems";
import { getJudgeConfig } from "@/data/problems/judge-config";
import { mockPhases, rubricCriteria, MOCK_DURATION_MINUTES } from "@/data/mock-interview";
import type { MockInterviewRubric, RunCodeResult } from "@/lib/types";
import type { RunnableLanguage } from "@/lib/code-runner";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Button } from "./Button";
import { CodeEditor } from "./CodeEditor";

const TOTAL_SECONDS = MOCK_DURATION_MINUTES * 60;
const LANGUAGES: RunnableLanguage[] = ["javascript", "python"];

export function MockInterviewSession() {
  const searchParams = useSearchParams();
  const problemId = searchParams.get("problemId");
  const taskId = searchParams.get("taskId");
  const { recordMockInterview } = useUserProgress();

  const problem = problemId ? getProblemById(problemId) : null;
  const judgeConfig = problemId ? getJudgeConfig(problemId) : null;

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [language, setLanguage] = useState<RunnableLanguage>("javascript");
  const [code, setCode] = useState("");
  const [runResult, setRunResult] = useState<RunCodeResult | null>(null);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [rubric, setRubric] = useState<MockInterviewRubric>({
    communication: 3,
    problemSolving: 3,
    coding: 3,
    complexity: 3,
    testing: 3,
  });
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const phase = mockPhases[phaseIndex];
  const phasesCompleted = mockPhases.slice(0, phaseIndex).map((p) => p.id);

  useEffect(() => {
    if (!problem) return;
    const starter =
      language === "python"
        ? problem.starterCode.python
        : problem.starterCode.javascript;
    setCode(starter ?? "");
    setRunResult(null);
    setRunError(null);
  }, [problem, language]);

  useEffect(() => {
    const t = setInterval(() => {
      const next = Math.floor((Date.now() - startedAt) / 1000);
      setElapsed(next);
      if (next >= TOTAL_SECONDS) {
        setTimeUp(true);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [startedAt]);

  const remaining = Math.max(0, TOTAL_SECONDS - elapsed);
  const remainingMin = Math.floor(remaining / 60);
  const remainingSec = remaining % 60;

  const runTests = useCallback(async () => {
    if (!problemId) return;
    setRunning(true);
    setRunError(null);
    try {
      const res = await fetch("/api/problems/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, code, language, submit: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRunError(data.error ?? "Run failed");
        return;
      }
      setRunResult(data as RunCodeResult);
    } finally {
      setRunning(false);
    }
  }, [problemId, code, language]);

  async function finishMock() {
    if (!problemId) return;
    setSaving(true);
    try {
      const record = {
        id: crypto.randomUUID(),
        problemId,
        startedAt: new Date(startedAt).toISOString(),
        completedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt,
        testsPassed: !!runResult?.passed,
        rubric: { ...rubric, notes: notes || undefined },
        phasesCompleted: [...phasesCompleted, phase.id],
      };
      await recordMockInterview(record);
      if (taskId) {
        await fetch("/api/study-plan", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "markTaskComplete", taskId }),
        });
      }
      setDone(true);
    } finally {
      setSaving(false);
    }
  }

  if (!problem || !judgeConfig) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">Invalid mock session</h1>
        <Link href="/mock" className="mt-4 inline-block text-accent hover:underline">
          ← Back to mock interviews
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <span className="text-4xl">🎯</span>
        <h1 className="mt-4 text-3xl font-bold">Mock complete</h1>
        <p className="mt-3 text-muted">
          {runResult?.passed
            ? "All tests passed — strong coding round."
            : "Keep practicing — review the solution and retry."}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button href="/mock">Another mock</Button>
          <Button href="/dashboard" variant="secondary">
            View readiness
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/mock" className="text-sm text-muted hover:text-accent">
            ← Exit mock
          </Link>
          <h1 className="mt-2 text-2xl font-bold">Mock Coding Interview</h1>
          <p className="text-sm text-muted">{problem.title} · {problem.difficulty}</p>
        </div>
        <div className="text-right">
          <p
            className={`font-mono text-2xl font-bold ${
              remaining < 300 ? "text-error" : "text-accent"
            }`}
          >
            {remainingMin}:{remainingSec.toString().padStart(2, "0")}
          </p>
          <p className="text-xs text-muted">remaining of {MOCK_DURATION_MINUTES} min</p>
        </div>
      </div>

      {timeUp && (
        <div className="mt-4 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-warning">
          Time is up — wrap up your solution and finish the self-review.
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {mockPhases.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setPhaseIndex(i)}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${
              i === phaseIndex
                ? "bg-accent text-background"
                : i < phaseIndex
                  ? "bg-success/10 text-success"
                  : "bg-surface-elevated text-muted"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-accent">
            Phase {phaseIndex + 1}: {phase.title}
          </h2>
          <p className="mt-1 text-xs text-muted">~{phase.durationMin} min suggested</p>

          <ul className="mt-4 space-y-2 text-sm text-muted">
            {phase.instructions.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-accent">→</span>
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl bg-surface-elevated p-4">
            <p className="text-xs font-semibold text-muted uppercase">Say out loud</p>
            <ul className="mt-2 space-y-1 text-sm">
              {phase.prompts.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </div>

          {phase.id === "review" && (
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold">Self-rubric (1–5)</h3>
              {rubricCriteria.map((c) => (
                <div key={c.key}>
                  <div className="flex justify-between text-sm">
                    <span>{c.label}</span>
                    <span className="font-mono text-accent">{rubric[c.key]}</span>
                  </div>
                  <p className="text-xs text-muted">{c.description}</p>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={rubric[c.key]}
                    onChange={(e) =>
                      setRubric((r) => ({ ...r, [c.key]: Number(e.target.value) }))
                    }
                    className="mt-1 w-full accent-accent"
                  />
                </div>
              ))}
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What to improve next time..."
                className="w-full rounded-xl border border-border bg-surface-elevated p-3 text-sm outline-none focus:border-accent/50"
                rows={3}
              />
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {phaseIndex > 0 && (
              <Button variant="secondary" onClick={() => setPhaseIndex(phaseIndex - 1)}>
                ← Back
              </Button>
            )}
            {phaseIndex < mockPhases.length - 1 ? (
              <Button onClick={() => setPhaseIndex(phaseIndex + 1)}>Next phase →</Button>
            ) : (
              <Button onClick={finishMock} disabled={saving}>
                {saving ? "Saving..." : "Finish mock interview"}
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-medium">{problem.title}</h3>
            <p className="mt-2 text-sm text-muted whitespace-pre-wrap line-clamp-6">
              {problem.description}
            </p>
          </div>

          {(phase.id === "code" || phase.id === "test") && (
            <>
              <div className="flex gap-1 border-b border-border px-4 py-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`rounded-md px-3 py-1 text-xs capitalize ${
                      language === lang
                        ? "bg-accent text-background"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                className="min-h-[240px] flex-1 bg-[#0d1117]"
              />
              <div className="border-t border-border p-4">
                <Button onClick={runTests} disabled={running} size="sm">
                  {running ? "Running..." : "Submit & run all tests"}
                </Button>
                {runError && <p className="mt-2 text-sm text-error">{runError}</p>}
                {runResult && (
                  <p
                    className={`mt-2 text-sm ${runResult.passed ? "text-success" : "text-error"}`}
                  >
                    {runResult.passed
                      ? `✓ All ${runResult.total} tests passed`
                      : `${runResult.passedCount}/${runResult.total} passed`}
                  </p>
                )}
              </div>
            </>
          )}

          {(phase.id === "clarify" || phase.id === "examples" || phase.id === "approach") && (
            <div className="p-6 text-sm text-muted space-y-3">
              {problem.examples.map((ex, i) => (
                <div key={i} className="rounded-lg bg-surface-elevated p-3 font-mono text-xs">
                  <p>Input: {ex.input}</p>
                  <p>Output: {ex.output}</p>
                </div>
              ))}
              <p className="text-xs">Use this panel as your &quot;whiteboard&quot; — talk through each example.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

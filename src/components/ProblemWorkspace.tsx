"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { CodingProblem, RunCodeResult } from "@/lib/types";
import { getPatternById } from "@/data/patterns";
import { getJudgeConfig, isJudgeSupported } from "@/data/problems/judge-config";
import { getProblemStatus } from "@/lib/progress";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useUserStudyPlan } from "@/hooks/useUserStudyPlan";
import { Button } from "./Button";
import { AuthRequired } from "./AuthRequired";
import { CodeEditor } from "./CodeEditor";

const LANGUAGES = ["javascript", "python"] as const;
type EditorLanguage = (typeof LANGUAGES)[number];

function buildStarterMap(problem: CodingProblem): Record<EditorLanguage, string> {
  return {
    javascript: problem.starterCode.javascript ?? "",
    python: problem.starterCode.python ?? "",
  };
}

function ProblemWorkspaceInner({ problem }: { problem: CodingProblem }) {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const { progress, updateProblem, resetProblem, loading } = useUserProgress();
  const { markTaskComplete } = useUserStudyPlan();
  const pattern = getPatternById(problem.patternId);

  const saved = progress?.problemProgress?.[problem.id];
  const [language, setLanguage] = useState<EditorLanguage>(
    (saved?.language as EditorLanguage) ?? "javascript"
  );
  const [codeByLanguage, setCodeByLanguage] = useState<Record<EditorLanguage, string>>(
    () => buildStarterMap(problem)
  );
  const code = codeByLanguage[language] ?? "";
  const [showPattern, setShowPattern] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunCodeResult | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [submitAttempts, setSubmitAttempts] = useState(0);

  const judgeSupported = isJudgeSupported(problem.id);
  const judgeConfig = getJudgeConfig(problem.id);
  const entry = progress?.problemProgress?.[problem.id];
  const solutionUnlocked = !!entry?.verifiedSolved || submitAttempts >= 2;

  useEffect(() => {
    if (!progress) return;
    const entry = progress.problemProgress?.[problem.id];
    const starters = buildStarterMap(problem);
    const lang = (entry?.language as EditorLanguage) ?? "javascript";

    setLanguage(lang);
    setCodeByLanguage({
      ...starters,
      ...(entry?.code && entry.language
        ? { [entry.language as EditorLanguage]: entry.code }
        : {}),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once when progress arrives
  }, [progress, problem.id]);

  function setCode(next: string) {
    setCodeByLanguage((prev) => ({ ...prev, [language]: next }));
  }

  function handleLanguageChange(lang: EditorLanguage) {
    if (lang === language) return;
    setLanguage(lang);
    setCodeByLanguage((prev) => {
      if (prev[lang] !== undefined) return prev;
      return { ...prev, [lang]: problem.starterCode[lang] ?? "" };
    });
    setRunResult(null);
    setRunError(null);
  }

  async function runTests(submit: boolean) {
    setRunning(true);
    setRunError(null);
    if (submit) setSubmitAttempts((n) => n + 1);
    try {
      await saveCodeQuiet();
      const res = await fetch("/api/problems/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: problem.id, code, language, submit }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRunError(data.error ?? "Run failed");
        setRunResult(null);
        return;
      }
      setRunResult(data as RunCodeResult);
      if (submit) {
        await updateProblem(problem.id, {
          code,
          language,
          testsPassed: data.passedCount,
          testsTotal: data.total,
          ...(data.passed
            ? { status: "solved" as const, verifiedSolved: true }
            : { status: "attempted" as const }),
        });
        if (data.passed && taskId) {
          await markTaskComplete(taskId);
        }
      }
    } finally {
      setRunning(false);
    }
  }

  async function saveCodeQuiet() {
    await updateProblem(problem.id, { code, language });
  }

  async function saveCode() {
    setSaving(true);
    try {
      await saveCodeQuiet();
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function markStatus(status: "attempted" | "solved") {
    setSaving(true);
    try {
      await updateProblem(problem.id, { status, code, language });
      if (status === "solved" && taskId) {
        await markTaskComplete(taskId);
      }
    } finally {
      setSaving(false);
    }
  }

  const starters = buildStarterMap(problem);
  const isCurrentModified = code.trim() !== (starters[language] ?? "").trim();
  const isAnyModified = LANGUAGES.some(
    (lang) => (codeByLanguage[lang] ?? "").trim() !== (starters[lang] ?? "").trim()
  );

  async function discardCode(scope: "current" | "all") {
    const message =
      scope === "all"
        ? "Reset code for all languages to the starter template? Saved solve status for this problem will be cleared."
        : `Reset ${language} code to the starter template?`;

    if (!confirm(message)) return;

    setSaving(true);
    try {
      if (scope === "all") {
        setCodeByLanguage(starters);
        setRunResult(null);
        setRunError(null);
        setSubmitAttempts(0);
        setShowSolution(false);
        await resetProblem(problem.id);
      } else {
        setCodeByLanguage((prev) => ({ ...prev, [language]: starters[language] }));
        setRunResult(null);
        setRunError(null);
        const entry = progress?.problemProgress?.[problem.id];
        if (entry?.language === language) {
          await updateProblem(problem.id, { code: starters[language], language });
        }
      }
    } finally {
      setSaving(false);
    }
  }

  const status = progress ? getProblemStatus(progress, problem.id) : "not_started";

  const statusBadge = {
    not_started: { label: "Not started", class: "bg-surface-elevated text-muted" },
    attempted: { label: "Attempted", class: "bg-warning/10 text-warning" },
    solved: {
      label: entry?.verifiedSolved ? "Verified ✓" : "Solved ✓",
      class: "bg-success/10 text-success",
    },
  }[status];

  const difficultyColor = {
    beginner: "text-success",
    intermediate: "text-warning",
    advanced: "text-error",
  }[problem.difficulty];

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <Link href="/problems" className="text-muted hover:text-accent">
          ← Problems
        </Link>
        <span className={`rounded-full px-2.5 py-0.5 text-xs capitalize ${statusBadge.class}`}>
          {statusBadge.label}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Problem panel */}
        <div className="rounded-2xl border border-border bg-surface p-6 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">{problem.title}</h1>
            <span className={`text-sm capitalize ${difficultyColor}`}>{problem.difficulty}</span>
          </div>

          {pattern && (
            <Link
              href={`/patterns`}
              className="mt-2 inline-block text-sm text-accent hover:underline"
            >
              Pattern: {pattern.name}
            </Link>
          )}

          <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {problem.description}
          </div>

          <div className="mt-6 space-y-4">
            {problem.examples.map((ex, i) => (
              <div key={i} className="rounded-xl bg-surface-elevated p-4 font-mono text-sm">
                <p className="text-muted text-xs mb-2">Example {i + 1}</p>
                <p><span className="text-muted">Input:</span> {ex.input}</p>
                <p className="mt-1"><span className="text-muted">Output:</span> {ex.output}</p>
                {ex.explanation && (
                  <p className="mt-1 text-muted text-xs">{ex.explanation}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-muted">Constraints</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
              {problem.constraints.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setShowHints(!showHints)}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:border-accent/40 transition-colors"
            >
              {showHints ? "Hide Hints" : "Show Hints"}
            </button>
            <button
              onClick={() => setShowPattern(!showPattern)}
              className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-2 text-sm text-accent hover:border-accent/50 transition-colors"
            >
              {showPattern ? "Hide Pattern" : "Reveal Pattern"}
            </button>
          </div>

          {showHints && (
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">
              {problem.hints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ol>
          )}

          {showPattern && pattern && (
            <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4">
              <h4 className="font-semibold text-accent">{pattern.name}</h4>
              <p className="mt-2 text-sm text-muted">{pattern.mentalModel}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {pattern.signals.map((s) => (
                  <span key={s} className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {showSolution && solutionUnlocked && judgeConfig && (
            <div className="mt-6 space-y-4 rounded-xl border border-success/20 bg-success/5 p-4">
              <h3 className="font-semibold text-success">Solution & Editorial</h3>
              <p className="text-sm text-muted leading-relaxed">{judgeConfig.editorial}</p>
              <p className="text-xs font-mono text-accent">
                Time {judgeConfig.timeComplexity} · Space {judgeConfig.spaceComplexity}
              </p>
              {judgeConfig.approaches.map((a) => (
                <div key={a.name} className="rounded-lg bg-surface p-3 text-sm">
                  <p className="font-medium">{a.name}</p>
                  <p className="mt-1 text-muted">{a.description}</p>
                  <p className="mt-1 text-xs font-mono text-muted">
                    {a.timeComplexity} · {a.spaceComplexity}
                  </p>
                </div>
              ))}
              <pre className="overflow-x-auto rounded-lg bg-[#0d1117] p-3 font-mono text-xs">
                {judgeConfig.solutionCode[language] ??
                  judgeConfig.solutionCode.javascript}
              </pre>
            </div>
          )}
        </div>

        {/* Code panel */}
        <div className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden lg:max-h-[calc(100vh-8rem)]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex gap-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`rounded-md px-3 py-1 text-xs capitalize transition-colors ${
                    language === lang
                      ? "bg-accent text-background"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            {savedMsg && <span className="text-xs text-success">Saved!</span>}
          </div>

          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            className="flex-1 min-h-[280px] bg-[#0d1117] lg:min-h-0"
          />

          {(runResult || runError) && (
            <div className="border-t border-border px-4 py-3 max-h-40 overflow-y-auto">
              {runError && <p className="text-sm text-error">{runError}</p>}
              {runResult && (
                <div className="space-y-1">
                  <p
                    className={`text-sm font-medium ${runResult.passed ? "text-success" : "text-error"}`}
                  >
                    {runResult.passed
                      ? `All ${runResult.total} tests passed`
                      : `${runResult.passedCount}/${runResult.total} tests passed`}
                  </p>
                  {runResult.results.map((r) => (
                    <div key={r.index} className="text-xs font-mono">
                      <span className={r.passed ? "text-success" : "text-error"}>
                        {r.passed ? "✓" : "✗"} Test {r.index + 1}
                        {r.hidden ? " (hidden)" : ""}
                      </span>
                      {!r.passed && !r.hidden && (
                        <span className="text-muted ml-2">
                          expected {r.expected} got {r.actual ?? r.error}
                        </span>
                      )}
                      {!r.passed && r.hidden && (
                        <span className="text-muted ml-2">hidden case failed</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2 border-t border-border p-4">
            {judgeSupported && (
              <>
                <Button
                  onClick={() => runTests(false)}
                  variant="secondary"
                  disabled={running}
                >
                  {running ? "Running..." : "Run"}
                </Button>
                <Button
                  onClick={() => runTests(true)}
                  disabled={running}
                >
                  {running ? "..." : "Submit"}
                </Button>
              </>
            )}
            <Button onClick={saveCode} variant="secondary" disabled={saving}>
              Save
            </Button>
            <button
              type="button"
              onClick={() => discardCode("current")}
              disabled={saving || !isCurrentModified}
              className="rounded-lg border border-border px-3 py-2 text-xs text-muted hover:border-error/40 hover:text-error disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted"
              title="Reset current language to starter code"
            >
              Reset
            </button>
            {isAnyModified && (
              <button
                type="button"
                onClick={() => discardCode("all")}
                disabled={saving}
                className="rounded-lg border border-error/30 px-3 py-2 text-xs text-error/80 hover:border-error/50 hover:text-error disabled:opacity-40"
                title="Reset all languages and clear saved progress"
              >
                Reset all
              </button>
            )}
            {judgeConfig && (
              <button
                onClick={() => solutionUnlocked && setShowSolution(!showSolution)}
                disabled={!solutionUnlocked}
                className="rounded-lg border border-border px-3 py-2 text-xs hover:border-accent/40 disabled:opacity-40"
              >
                {solutionUnlocked
                  ? showSolution
                    ? "Hide solution"
                    : "Show solution"
                  : `Solution (${Math.max(0, 2 - submitAttempts)} submits)`}
              </button>
            )}
            {!judgeSupported && (
              <>
                <Button
                  onClick={() => markStatus("attempted")}
                  variant="secondary"
                  disabled={saving || status === "solved"}
                >
                  Attempted
                </Button>
                <Button onClick={() => markStatus("solved")} disabled={saving}>
                  Mark Solved
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProblemWorkspace({ problem }: { problem: CodingProblem }) {
  return (
    <AuthRequired
      title="Get your training code"
      description="Save your solutions and track which problems you've solved."
    >
      <Suspense
        fallback={
          <div className="flex justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        }
      >
        <ProblemWorkspaceInner problem={problem} />
      </Suspense>
    </AuthRequired>
  );
}

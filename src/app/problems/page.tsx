"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { codingProblems } from "@/data/problems";
import { getJudgeSupportedCount, isJudgeSupported } from "@/data/problems/judge-config";
import { patterns, categoryLabels, getPatternById } from "@/data/patterns";
import { getProblemStatus, getProblemSolveStats } from "@/lib/progress";
import { useUserProgress } from "@/hooks/useUserProgress";

function ProblemsLibrary() {
  const searchParams = useSearchParams();
  const { progress, loading, isAuthenticated } = useUserProgress();
  const [filterPattern, setFilterPattern] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const pattern = searchParams.get("pattern");
    if (pattern) setFilterPattern(pattern);
  }, [searchParams]);

  const stats = useMemo(
    () => (progress ? getProblemSolveStats(progress) : null),
    [progress]
  );

  const filtered = useMemo(() => {
    return codingProblems.filter((p) => {
      if (filterPattern !== "all" && p.patternId !== filterPattern) return false;
      if (filterDifficulty !== "all" && p.difficulty !== filterDifficulty) return false;
      if (filterStatus !== "all" && progress) {
        const status = getProblemStatus(progress, p.id);
        if (status !== filterStatus) return false;
      }
      return true;
    });
  }, [filterPattern, filterDifficulty, filterStatus, progress]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div>
        <h1 className="text-3xl font-bold">Problem Set</h1>
        <p className="mt-3 text-muted">
          Real coding problems mapped to patterns. Run and submit in JavaScript or Python
          to verify your solution — {getJudgeSupportedCount()} problems support automated testing.
        </p>
      </div>

      {isAuthenticated && stats && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Verified", value: stats.verified, color: "text-success", hint: "Passed all tests" },
            { label: "Self-reported", value: stats.selfReported, color: "text-warning", hint: "Manual mark only" },
            { label: "Attempted", value: stats.attempted, color: "text-muted", hint: "" },
            { label: "Judge-ready", value: stats.judgeTotal, color: "text-accent", hint: `of ${stats.total} total` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted">{s.label}</div>
              {s.hint && <div className="text-[10px] text-muted mt-0.5">{s.hint}</div>}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        <select
          value={filterPattern}
          onChange={(e) => setFilterPattern(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none"
        >
          <option value="all">All patterns</option>
          {patterns.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none"
        >
          <option value="all">All difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        {isAuthenticated && (
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none"
          >
            <option value="all">All status</option>
            <option value="not_started">Not started</option>
            <option value="attempted">Attempted</option>
            <option value="solved">Solved</option>
          </select>
        )}
      </div>

      <div className="mt-6 space-y-2">
        {filtered.map((problem) => {
          const pattern = getPatternById(problem.patternId);
          const status = progress ? getProblemStatus(progress, problem.id) : "not_started";
          const statusIcon = {
            not_started: "○",
            attempted: "◐",
            solved: "●",
          }[status];

          return (
            <Link
              key={problem.id}
              href={`/problems/${problem.id}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-surface px-5 py-4 transition-all hover:border-accent/40"
            >
              <span
                className={`text-lg ${
                  status === "solved"
                    ? "text-success"
                    : status === "attempted"
                      ? "text-warning"
                      : "text-muted"
                }`}
              >
                {statusIcon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{problem.title}</span>
                  {isJudgeSupported(problem.id) && (
                    <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] text-accent">
                      runnable
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted mt-0.5">
                  {pattern?.name} · {categoryLabels[pattern?.category ?? "arrays"]}
                </p>
              </div>
              <span
                className={`text-xs capitalize ${
                  problem.difficulty === "beginner"
                    ? "text-success"
                    : problem.difficulty === "intermediate"
                      ? "text-warning"
                      : "text-error"
                }`}
              >
                {problem.difficulty}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function ProblemsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <ProblemsLibrary />
    </Suspense>
  );
}

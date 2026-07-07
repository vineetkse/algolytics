"use client";

import { useMemo, useState } from "react";
import { getPatternById } from "@/data/patterns";
import { filterDuelDrills, shuffleDrills } from "@/data/drills";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useUserStudyPlan } from "@/hooks/useUserStudyPlan";
import type { Drill } from "@/lib/types";
import { Button } from "./Button";
import { AuthRequired } from "./AuthRequired";

interface PatternDuelSessionProps {
  count?: number;
  patternIds?: string[];
  taskId?: string;
}

type Phase = "ready" | "active" | "feedback" | "complete";

function PatternDuelSessionInner({
  count = 8,
  patternIds,
  taskId,
}: PatternDuelSessionProps) {
  const { recordDrillResult, completeSession } = useUserProgress();
  const { markTaskComplete } = useUserStudyPlan();
  const [phase, setPhase] = useState<Phase>("ready");
  const [sessionDrills, setSessionDrills] = useState<Drill[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [startTime, setStartTime] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [lastCorrect, setLastCorrect] = useState(false);
  const [saving, setSaving] = useState(false);

  const drill = sessionDrills[currentIndex];
  const duelOptions = useMemo(() => {
    if (!drill?.distractorPatternId) return [];
    const a = getPatternById(drill.correctPatternId);
    const b = getPatternById(drill.distractorPatternId);
    if (!a || !b) return [];
    return Math.random() > 0.5 ? [a, b] : [b, a];
  }, [drill?.id, drill?.correctPatternId, drill?.distractorPatternId]);

  function startSession() {
    let filtered = filterDuelDrills(patternIds);
    const selected = shuffleDrills(filtered).slice(0, count);
    setSessionDrills(selected);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setPhase("active");
    setStartTime(Date.now());
  }

  async function handleSessionComplete() {
    setSaving(true);
    try {
      await completeSession(sessionId);
      if (taskId) await markTaskComplete(taskId);
    } finally {
      setSaving(false);
    }
    setPhase("complete");
  }

  async function handleSubmit() {
    if (!selectedPattern || !drill) return;
    const correct = selectedPattern === drill.correctPatternId;
    const timeMs = Date.now() - startTime;

    await recordDrillResult(
      {
        drillId: drill.id,
        patternId: drill.correctPatternId,
        correct,
        timeMs,
        selectedPatternId: selectedPattern,
      },
      sessionId,
      "pattern-duel"
    );

    setLastCorrect(correct);
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setPhase("feedback");
  }

  function handleNext() {
    if (currentIndex + 1 >= sessionDrills.length) {
      handleSessionComplete();
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedPattern(null);
    setStartTime(Date.now());
    setPhase("active");
  }

  const correctPattern = drill ? getPatternById(drill.correctPatternId) : null;
  const wrongPattern = drill?.distractorPatternId
    ? getPatternById(drill.distractorPatternId)
    : null;

  if (phase === "ready") {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold">Pattern Duel</h2>
        <p className="mt-3 text-muted">
          Two similar patterns. One problem. Pick the right one — this is how experts
          separate confusable techniques.
        </p>
        <p className="mt-2 text-sm text-muted">{count} duels in this session</p>
        <Button onClick={startSession} size="lg" className="mt-8">
          Begin Duel
        </Button>
      </div>
    );
  }

  if (phase === "complete") {
    const pct = Math.round((score.correct / score.total) * 100);
    return (
      <div className="mx-auto max-w-2xl text-center animate-slide-up">
        <div className="text-6xl font-bold text-gradient">{pct}%</div>
        <h2 className="mt-4 text-2xl font-bold">Duel Complete</h2>
        <p className="mt-2 text-muted">
          {score.correct} of {score.total} duels won
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button onClick={startSession} size="lg" disabled={saving}>
            Duel Again
          </Button>
          <Button href="/train" variant="secondary" size="lg">
            Training Center
          </Button>
        </div>
      </div>
    );
  }

  if (!drill) return null;

  return (
    <div className="mx-auto max-w-3xl animate-slide-up">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-elevated">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{
              width: `${((currentIndex + (phase === "feedback" ? 1 : 0)) / sessionDrills.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-sm text-muted font-mono">
          {currentIndex + 1}/{sessionDrills.length}
        </span>
      </div>

      <div className="rounded-2xl border border-indigo-500/30 bg-surface p-8">
        <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
          Pattern Duel
        </span>
        <p className="mt-4 text-lg leading-relaxed">{drill.problem}</p>
      </div>

      {phase === "active" && (
        <div className="mt-6">
          <p className="mb-4 text-sm font-medium text-muted">
            Which pattern fits? (2 choices — pick carefully)
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {duelOptions.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => setSelectedPattern(pattern.id)}
                className={`rounded-xl border p-6 text-left transition-all ${
                  selectedPattern === pattern.id
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-border bg-surface hover:border-indigo-500/30"
                }`}
              >
                <span className="text-lg font-semibold">{pattern.name}</span>
                <p className="mt-2 text-sm text-muted">{pattern.tagline}</p>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSubmit} disabled={!selectedPattern}>
              Lock In Answer
            </Button>
          </div>
        </div>
      )}

      {phase === "feedback" && correctPattern && (
        <div className="mt-6 animate-slide-up">
          <div
            className={`rounded-2xl border p-6 ${
              lastCorrect
                ? "border-success/30 bg-success/5"
                : "border-error/30 bg-error/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{lastCorrect ? "✓" : "✗"}</span>
              <div>
                <h3 className="font-semibold">
                  {lastCorrect ? "Correct!" : `Answer: ${correctPattern.name}`}
                </h3>
                <p className="mt-1 text-sm text-muted">{drill.explanation}</p>
              </div>
            </div>

            {!lastCorrect && wrongPattern && drill.whyNotDistractor && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-success/5 border border-success/20 p-4">
                  <h4 className="text-sm font-semibold text-success">
                    ✓ {correctPattern.name}
                  </h4>
                  <p className="mt-1 text-xs text-muted">{correctPattern.mentalModel}</p>
                </div>
                <div className="rounded-xl bg-error/5 border border-error/20 p-4">
                  <h4 className="text-sm font-semibold text-error">
                    ✗ {wrongPattern.name}
                  </h4>
                  <p className="mt-1 text-xs text-muted">{drill.whyNotDistractor}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleNext} disabled={saving}>
              {currentIndex + 1 >= sessionDrills.length ? "See Results" : "Next Duel"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PatternDuelSession(props: PatternDuelSessionProps) {
  return (
    <AuthRequired title="Get your training code" description="Save your duel results and track which pattern pairs confuse you.">
      <PatternDuelSessionInner {...props} />
    </AuthRequired>
  );
}

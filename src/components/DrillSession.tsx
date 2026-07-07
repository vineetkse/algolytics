"use client";

import { useState } from "react";
import { patterns } from "@/data/patterns";
import { filterDrills, shuffleDrills } from "@/data/drills";
import { getPatternById } from "@/data/patterns";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useUserStudyPlan } from "@/hooks/useUserStudyPlan";
import type { Drill, DrillType } from "@/lib/types";
import { Button } from "./Button";
import { AuthRequired } from "./AuthRequired";

interface DrillSessionProps {
  drillType: DrillType;
  count?: number;
  patternIds?: string[];
  taskId?: string;
}

type Phase = "ready" | "active" | "feedback" | "complete";

function DrillSessionInner({
  drillType,
  count = 10,
  patternIds,
  taskId,
}: DrillSessionProps) {
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
  const [shuffledPatterns] = useState(() => shuffleArray([...patterns]));

  const focusPatterns = patternIds?.length
    ? patterns.filter((p) => patternIds.includes(p.id))
    : null;

  function shuffleArray<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function startSession() {
    let filtered = filterDrills(drillType, patternIds);
    if (filtered.length < count) {
      filtered = filterDrills(drillType);
    }
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
      if (taskId) {
        await markTaskComplete(taskId);
      }
    } finally {
      setSaving(false);
    }
    setPhase("complete");
  }

  async function handleSubmit() {
    if (!selectedPattern) return;
    const drill = sessionDrills[currentIndex];
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
      drillType
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

  const drill = sessionDrills[currentIndex];
  const correctPattern = drill ? getPatternById(drill.correctPatternId) : null;

  const drillTypeLabels: Partial<Record<DrillType, string>> = {
    "pattern-spot": "Pattern Spotter",
    "signal-hunt": "Signal Hunter",
    decompose: "Decomposition Lab",
  };

  if (phase === "ready") {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold">{drillTypeLabels[drillType] ?? "Training"}</h2>
        <p className="mt-3 text-muted">
          {drillType === "pattern-spot" &&
            "Read each problem. Identify the algorithmic pattern before writing any code."}
          {drillType === "signal-hunt" &&
            "Given keyword signals, rapidly match them to the right pattern."}
          {drillType === "decompose" &&
            "Break down unfamiliar problems into steps, then identify the core pattern."}
        </p>
        {focusPatterns && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {focusPatterns.map((p) => (
              <span
                key={p.id}
                className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent"
              >
                {p.name}
              </span>
            ))}
          </div>
        )}
        <p className="mt-2 text-sm text-muted">{count} drills in this session</p>
        <Button onClick={startSession} size="lg" className="mt-8">
          Begin Session
        </Button>
      </div>
    );
  }

  if (phase === "complete") {
    const pct = Math.round((score.correct / score.total) * 100);
    return (
      <div className="mx-auto max-w-2xl text-center animate-slide-up">
        <div className="text-6xl font-bold text-gradient">{pct}%</div>
        <h2 className="mt-4 text-2xl font-bold">Session Complete</h2>
        <p className="mt-2 text-muted">
          {score.correct} of {score.total} patterns identified correctly
        </p>
        {taskId && (
          <p className="mt-2 text-sm text-accent">Study plan task saved to your account ✓</p>
        )}
        <p className="mt-1 text-xs text-muted">Progress synced to your training code</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button onClick={startSession} size="lg" disabled={saving}>
            Train Again
          </Button>
          {taskId ? (
            <Button href="/study-plan" variant="secondary" size="lg">
              Back to Study Plan
            </Button>
          ) : (
            <Button href="/dashboard" variant="secondary" size="lg">
              View Progress
            </Button>
          )}
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
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{
              width: `${((currentIndex + (phase === "feedback" ? 1 : 0)) / sessionDrills.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-sm text-muted font-mono">
          {currentIndex + 1}/{sessionDrills.length}
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-8">
        <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          {drillTypeLabels[drillType] ?? "Training"}
        </span>
        <p className="mt-4 text-lg leading-relaxed">{drill.problem}</p>

        {drill.decompositionSteps && phase === "feedback" && (
          <div className="mt-6 rounded-xl bg-surface-elevated p-5">
            <h4 className="text-sm font-semibold text-accent">Decomposition Steps</h4>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
              {drill.decompositionSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {phase === "active" && (
        <div className="mt-6">
          <p className="mb-4 text-sm font-medium text-muted">Which pattern fits this problem?</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {shuffledPatterns.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => setSelectedPattern(pattern.id)}
                className={`rounded-xl border p-4 text-left text-sm transition-all ${
                  selectedPattern === pattern.id
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border bg-surface hover:border-accent/30"
                }`}
              >
                <span className="font-medium">{pattern.name}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSubmit} disabled={!selectedPattern}>
              Submit Answer
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
                  {lastCorrect ? "Correct!" : `It was ${correctPattern.name}`}
                </h3>
                <p className="mt-1 text-sm text-muted">{drill.explanation}</p>
              </div>
            </div>

            {!lastCorrect && (
              <div className="mt-4 rounded-xl bg-surface-elevated p-4">
                <h4 className="text-sm font-semibold text-accent">Mental Model</h4>
                <p className="mt-2 text-sm text-muted">{correctPattern.mentalModel}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {correctPattern.signals.map((signal) => (
                    <span
                      key={signal}
                      className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleNext} disabled={saving}>
              {currentIndex + 1 >= sessionDrills.length ? "See Results" : "Next Drill"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function DrillSession(props: DrillSessionProps) {
  return (
    <AuthRequired
      title="Get your training code to train"
      description="Your drill results, streaks, and pattern mastery are saved to your training profile."
    >
      <DrillSessionInner {...props} />
    </AuthRequired>
  );
}

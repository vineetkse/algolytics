"use client";

import { useEffect, useRef, useState } from "react";
import { patterns } from "@/data/patterns";
import { filterDrills, shuffleDrills } from "@/data/drills";
import { getPatternById } from "@/data/patterns";
import { useUserProgress } from "@/hooks/useUserProgress";
import type { Drill } from "@/lib/types";
import { Button } from "./Button";
import { AuthRequired } from "./AuthRequired";

const GAUNTLET_SECONDS = 60;

interface GauntletSessionProps {
  patternIds?: string[];
  seconds?: number;
}

type Phase = "ready" | "active" | "feedback" | "complete";

function GauntletSessionInner({ patternIds, seconds = GAUNTLET_SECONDS }: GauntletSessionProps) {
  const { recordDrillResult, completeSession } = useUserProgress();
  const [phase, setPhase] = useState<Phase>("ready");
  const [pool, setPool] = useState<Drill[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [score, setScore] = useState({ correct: 0, answered: 0 });
  const [lastCorrect, setLastCorrect] = useState(false);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endedRef = useRef(false);
  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  const shuffledPatterns = useMemoShuffle(patterns);

  function startSession() {
    let filtered = filterDrills("pattern-spot", patternIds);
    if (filtered.length < 5) filtered = filterDrills("pattern-spot");
    setPool(shuffleDrills(filtered));
    setCurrentIndex(0);
    setScore({ correct: 0, answered: 0 });
    setTimeLeft(seconds);
    setPhase("active");
    endedRef.current = false;
  }

  useEffect(() => {
    if (phase !== "active") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (!endedRef.current) {
            endedRef.current = true;
            setPhase("complete");
            void completeSession(sessionIdRef.current);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, completeSession]);

  async function handleSubmit() {
    if (!selectedPattern || phase !== "active") return;
    const drill = pool[currentIndex % pool.length];
    const correct = selectedPattern === drill.correctPatternId;

    await recordDrillResult(
      {
        drillId: drill.id,
        patternId: drill.correctPatternId,
        correct,
        timeMs: 0,
        selectedPatternId: selectedPattern,
      },
      sessionId,
      "timed-gauntlet"
    );

    setLastCorrect(correct);
    setScore((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      answered: s.answered + 1,
    }));
    setSelectedPattern(null);
    setCurrentIndex((i) => i + 1);
    setPhase("feedback");

    setTimeout(() => {
      if (timeLeft > 0 && !endedRef.current) setPhase("active");
    }, 800);
  }

  const drill = pool[currentIndex % pool.length];
  const correctPattern = drill ? getPatternById(drill.correctPatternId) : null;

  if (phase === "ready") {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold">Timed Gauntlet</h2>
        <p className="mt-3 text-muted">
          {seconds} seconds. As many pattern identifications as you can. No pauses — pure
          reflex training.
        </p>
        <div className="mt-6 font-mono text-5xl font-bold text-warning">{seconds}s</div>
        <Button onClick={startSession} size="lg" className="mt-8">
          Start Gauntlet
        </Button>
      </div>
    );
  }

  if (phase === "complete") {
    return (
      <div className="mx-auto max-w-2xl text-center animate-slide-up">
        <div className="text-6xl font-bold text-gradient">{score.correct}</div>
        <h2 className="mt-4 text-2xl font-bold">Gauntlet Over</h2>
        <p className="mt-2 text-muted">
          {score.correct} correct out of {score.answered} answered in {seconds}s
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button onClick={startSession} size="lg" disabled={saving}>
            Run Again
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
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className={`font-mono text-3xl font-bold tabular-nums ${
              timeLeft <= 10 ? "text-error animate-pulse-glow" : "text-warning"
            }`}
          >
            {timeLeft}s
          </span>
          <span className="text-sm text-muted">
            Score: <span className="font-mono text-accent">{score.correct}</span>
          </span>
        </div>
        <span className="text-sm text-muted font-mono">#{score.answered + 1}</span>
      </div>

      <div
        className={`rounded-2xl border bg-surface p-8 transition-colors ${
          phase === "feedback"
            ? lastCorrect
              ? "border-success/30"
              : "border-error/30"
            : "border-warning/30"
        }`}
      >
        <span className="inline-block rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
          Timed Gauntlet
        </span>
        <p className="mt-4 text-lg leading-relaxed">{drill.problem}</p>
        {phase === "feedback" && correctPattern && (
          <p className="mt-3 text-sm text-muted">
            {lastCorrect ? "✓ Correct!" : `✗ ${correctPattern.name}`}
          </p>
        )}
      </div>

      {phase === "active" && (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {shuffledPatterns.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => setSelectedPattern(pattern.id)}
                className={`rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                  selectedPattern === pattern.id
                    ? "border-warning bg-warning/10"
                    : "border-border bg-surface hover:border-warning/30"
                }`}
              >
                {pattern.name}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSubmit} disabled={!selectedPattern}>
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function useMemoShuffle<T>(items: T[]): T[] {
  const [shuffled] = useState(() => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  });
  return shuffled;
}

export function GauntletSession(props: GauntletSessionProps) {
  return (
    <AuthRequired>
      <GauntletSessionInner {...props} />
    </AuthRequired>
  );
}

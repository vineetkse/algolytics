"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { FoundationLesson } from "@/data/journey/foundation-lessons";
import { FOUNDATION_LESSON_COUNT } from "@/data/journey/foundation-lessons";
import { useUserStudyPlan } from "@/hooks/useUserStudyPlan";
import { Button } from "./Button";
import { useState } from "react";

export function FoundationLessonView({ lesson }: { lesson: FoundationLesson }) {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const { markTaskComplete } = useUserStudyPlan();
  const [completing, setCompleting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleComplete() {
    if (!taskId) return;
    setCompleting(true);
    try {
      await markTaskComplete(taskId);
      setDone(true);
    } finally {
      setCompleting(false);
    }
  }

  const prevDay = lesson.day > 1 ? lesson.day - 1 : null;
  const nextDay = lesson.day < FOUNDATION_LESSON_COUNT ? lesson.day + 1 : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
        <Link href="/journey" className="hover:text-accent">
          ← Journey
        </Link>
        <span>·</span>
        <span>
          Phase 1 · Lesson {lesson.day} of {FOUNDATION_LESSON_COUNT}
        </span>
      </div>

      <div className="mt-6">
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          Code Foundations
        </span>
        <h1 className="mt-4 text-3xl font-bold">{lesson.title}</h1>
        <p className="mt-2 text-lg text-muted">{lesson.subtitle}</p>
      </div>

      <div className="mt-10 space-y-8">
        {lesson.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-accent">{section.heading}</h2>
            <p className="mt-3 text-muted leading-relaxed whitespace-pre-line">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-warning/30 bg-warning/5 p-6">
        <h3 className="font-semibold text-warning">Today&apos;s exercise</h3>
        <p className="mt-2 text-sm text-muted leading-relaxed">{lesson.exercise}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <h3 className="font-semibold">Checkpoints</h3>
        <ul className="mt-3 space-y-2">
          {lesson.checkpoints.map((c) => (
            <li key={c} className="flex items-start gap-2 text-sm text-muted">
              <span className="text-accent">□</span>
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        {taskId && !done && (
          <Button onClick={handleComplete} disabled={completing} size="lg">
            {completing ? "Saving..." : "Mark lesson complete"}
          </Button>
        )}
        {done && (
          <span className="flex items-center rounded-xl bg-success/10 px-4 py-3 text-sm text-success">
            ✓ Lesson marked complete
          </span>
        )}
        {nextDay && (
          <Button
            href={`/journey/foundation/${nextDay}`}
            variant="secondary"
            size="lg"
          >
            Next lesson →
          </Button>
        )}
      </div>

      <div className="mt-8 flex justify-between text-sm">
        {prevDay ? (
          <Link href={`/journey/foundation/${prevDay}`} className="text-muted hover:text-accent">
            ← Lesson {prevDay}
          </Link>
        ) : (
          <span />
        )}
        <Link href="/study-plan" className="text-accent hover:underline">
          Back to study plan
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { patterns, categoryLabels } from "@/data/patterns";
import { createCustomStudyPlan } from "@/lib/study-plan";
import type { PatternCategory } from "@/lib/types";
import { useUserStudyPlan } from "@/hooks/useUserStudyPlan";
import { Button } from "@/components/Button";
import { AuthRequired } from "@/components/AuthRequired";

const DURATION_OPTIONS = [7, 14, 21, 30, 56];
const TIME_OPTIONS = [5, 10, 15, 20, 25];

function CreateStudyPlanContent() {
  const router = useRouter();
  const { savePlan } = useUserStudyPlan();
  const [name, setName] = useState("My Custom Plan");
  const [totalDays, setTotalDays] = useState(14);
  const [minutesPerDay, setMinutesPerDay] = useState(10);
  const [selectedPatterns, setSelectedPatterns] = useState<Set<string>>(
    new Set(["two-pointers", "sliding-window", "tree-bfs", "tree-dfs"])
  );
  const [filterCategory, setFilterCategory] = useState<PatternCategory | "all">("all");
  const [saving, setSaving] = useState(false);

  const categories = [...new Set(patterns.map((p) => p.category))];
  const filteredPatterns =
    filterCategory === "all"
      ? patterns
      : patterns.filter((p) => p.category === filterCategory);

  function togglePattern(id: string) {
    setSelectedPatterns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function selectAll() {
    setSelectedPatterns(new Set(filteredPatterns.map((p) => p.id)));
  }

  async function handleCreate() {
    setSaving(true);
    try {
      const plan = createCustomStudyPlan({
        name,
        totalDays,
        minutesPerDay,
        patternIds: Array.from(selectedPatterns),
      });
      await savePlan(plan);
      router.push("/study-plan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">Build Custom Study Plan</h1>
      <p className="mt-2 text-muted">
        Choose your duration, daily time commitment, and patterns. Saved to your training code.
      </p>

      <div className="mt-10">
        <label className="text-sm font-medium text-muted">Plan Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-accent/50 transition-colors"
        />
      </div>

      <div className="mt-8">
        <label className="text-sm font-medium text-muted">Duration</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setTotalDays(d)}
              className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                totalDays === d
                  ? "bg-accent text-background"
                  : "bg-surface-elevated text-muted hover:text-foreground"
              }`}
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <label className="text-sm font-medium text-muted">Daily Time Commitment</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {TIME_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => setMinutesPerDay(t)}
              className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                minutesPerDay === t
                  ? "bg-accent text-background"
                  : "bg-surface-elevated text-muted hover:text-foreground"
              }`}
            >
              {t} min
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted">
            Patterns to Focus On ({selectedPatterns.size} selected)
          </label>
          <button onClick={selectAll} className="text-xs text-accent hover:underline">
            Select all visible
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory("all")}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${
              filterCategory === "all"
                ? "bg-accent text-background"
                : "bg-surface-elevated text-muted"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                filterCategory === cat
                  ? "bg-accent text-background"
                  : "bg-surface-elevated text-muted"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {filteredPatterns.map((pattern) => {
            const selected = selectedPatterns.has(pattern.id);
            return (
              <button
                key={pattern.id}
                onClick={() => togglePattern(pattern.id)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all ${
                  selected
                    ? "border-accent bg-accent/10"
                    : "border-border bg-surface hover:border-accent/30"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                    selected ? "border-accent bg-accent text-background" : "border-border"
                  }`}
                >
                  {selected ? "✓" : ""}
                </span>
                <div>
                  <p className="font-medium">{pattern.name}</p>
                  <p className="text-xs text-muted">{pattern.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface-elevated p-6">
        <h3 className="font-semibold">Plan Summary</h3>
        <p className="mt-2 text-sm text-muted">
          <strong className="text-foreground">{name}</strong> — {totalDays} days, {minutesPerDay}{" "}
          min/day, {selectedPatterns.size} patterns. Linked to your training code.
        </p>
        <Button onClick={handleCreate} size="lg" className="mt-6 w-full" disabled={saving}>
          {saving ? "Creating..." : "Create Study Plan"}
        </Button>
      </div>
    </div>
  );
}

export default function CreateStudyPlanPage() {
  return (
    <AuthRequired>
      <CreateStudyPlanContent />
    </AuthRequired>
  );
}

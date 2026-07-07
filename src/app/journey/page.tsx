import { Suspense } from "react";
import Link from "next/link";
import { journeyPhases } from "@/data/journey/phases";
import { studyPlanTemplates } from "@/data/study-plan-templates";
import { Button } from "@/components/Button";

export default function JourneyPage() {
  const template = studyPlanTemplates.find((t) => t.journeyId === "zero-to-google");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <span className="inline-flex rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-sm text-accent">
          24 weeks · 168 days · zero to interview-ready
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          The journey to think
          <br />
          <span className="text-gradient">like a smart coder</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed">
          Not a problem grind. A structured path that builds how you think — from first loops
          to naming patterns in seconds to coding under interview pressure.
        </p>
        {template && (
          <Button href="/study-plan" size="lg" className="mt-10">
            Start the 24-Week Journey
          </Button>
        )}
      </div>

      <div className="mt-20">
        <h2 className="text-center text-2xl font-bold">Six phases. One transformation.</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted">
          Each phase builds on the last. Coding problems unlock in Phase 3 once you hit mastery milestones.
        </p>

        <div className="mt-12 space-y-6">
          {journeyPhases.map((phase) => (
            <div
              key={phase.id}
              className="rounded-2xl border border-border bg-surface p-8 transition-all hover:border-accent/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-accent">
                    Phase {phase.number} · Days {phase.startDay}–{phase.endDay} · Week{" "}
                    {Math.ceil(phase.startDay / 7)}–{Math.ceil(phase.endDay / 7)}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold">{phase.name}</h3>
                  <p className="text-sm text-accent">{phase.tagline}</p>
                </div>
                <span className="rounded-full bg-surface-elevated px-3 py-1 text-xs text-muted">
                  ~{phase.minutesPerDay} min/day
                </span>
              </div>
              <p className="mt-4 text-sm text-muted leading-relaxed">{phase.goal}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {phase.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 text-xs text-muted"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 rounded-2xl border border-accent/20 bg-accent/5 p-10 text-center">
        <h2 className="text-2xl font-bold">What makes you smart</h2>
        <div className="mx-auto mt-8 grid max-w-3xl gap-6 text-left sm:grid-cols-2">
          {[
            {
              title: "Think before code",
              body: "21 foundation lessons teach decomposition, complexity, and the 5-step pipeline experts use.",
            },
            {
              title: "Recognition first",
              body: "4 weeks of pattern drills before heavy coding. You learn to see the tool before grabbing it.",
            },
            {
              title: "Spaced repetition",
              body: "Daily workouts target patterns your brain is about to forget — science-backed retention.",
            },
            {
              title: "Confusion training",
              body: "Pattern Duels separate lookalike techniques — the skill that separates pass from fail.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-semibold text-accent">{item.title}</h3>
              <p className="mt-1 text-sm text-muted leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <Link href="/study-plan" className="mt-8 inline-block text-sm text-accent hover:underline">
          Choose your study plan →
        </Link>
      </div>
    </div>
  );
}

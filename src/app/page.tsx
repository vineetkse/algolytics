import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";

const trainingModes = [
  {
    title: "Daily Brain Workout",
    description:
      "3-step expert pipeline: spaced repetition, pattern duels, and a 60s gauntlet — personalized to your weak spots.",
    href: "/train/daily",
    icon: "⚡",
    drills: "Personalized daily",
  },
  {
    title: "Pattern Duel",
    description:
      "Two similar patterns, one problem. Train the skill of separating confusable techniques.",
    href: "/train/pattern-duel",
    icon: "⚔️",
    drills: "18 duels",
  },
  {
    title: "Pattern Spotter",
    description:
      "Read a problem description and identify the algorithmic pattern — before touching code. This is how experts think.",
    href: "/train/pattern-spot",
    icon: "🎯",
    drills: "35 problems",
  },
  {
    title: "Timed Gauntlet",
    description:
      "60 seconds of rapid-fire pattern identification. Builds interview speed under pressure.",
    href: "/train/gauntlet",
    icon: "⏱️",
    drills: "60 second sprint",
  },
  {
    title: "Signal Hunter",
    description:
      "Train on keyword signals — 'sorted array', 'contiguous subarray', 'dependencies'. Spot patterns from clues alone.",
    href: "/train/signal-hunt",
    icon: "🔍",
    drills: "Keyword drills",
  },
  {
    title: "Decomposition Lab",
    description:
      "Face unfamiliar problems. Learn to break them into steps, model them, then match to a known pattern.",
    href: "/train/decompose",
    icon: "🧩",
    drills: "Real-world scenarios",
  },
  {
    title: "Zero to Google Journey",
    description:
      "168-day guided path from absolute beginner to interview-ready. Six phases: foundations → pattern eyes → coding → depth → speed → polish.",
    href: "/journey",
    icon: "🚀",
    drills: "24-week program",
  },
  {
    title: "Pattern Problems",
    description:
      "Real coding challenges linked to each pattern. Write code, track solved/attempted, and connect recognition to implementation.",
    href: "/problems",
    icon: "💻",
    drills: "60+ problems",
  },
];

const philosophy = [
  {
    step: "01",
    title: "Recognize, don't memorize",
    body: "Most platforms teach solutions. We teach recognition — the skill of seeing a new problem and knowing which tool fits.",
  },
  {
    step: "02",
    title: "Patterns before code",
    body: "The best engineers spend 80% of their time understanding the problem and 20% writing code. We train that ratio.",
  },
  {
    step: "03",
    title: "Spaced repetition for the brain",
    body: "Like language learning, pattern recognition needs repetition with feedback. Short daily sessions build lasting muscle memory.",
  },
  {
    step: "04",
    title: "Unknown problems become familiar",
    body: "Every 'new' problem is a combination of known patterns. Train your eye to decompose the unfamiliar into the familiar.",
  },
];

export default function Home() {
  return (
    <div className="neural-grid">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 text-center">
        <div className="flex justify-center">
          <Logo size={56} className="rounded-xl glow-accent" />
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-muted">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
          Pattern recognition training for engineers
        </div>

        <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Stop grinding problems.
          <br />
          <span className="text-gradient">Start recognizing patterns.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed">
          Algolytics trains the skill that separates senior engineers from juniors:
          identifying the right algorithmic pattern before writing code.
          Build muscle memory. Change how you think.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/access" size="lg">
            Get Your Training Code
          </Button>
          <Button href="/journey" variant="secondary" size="lg">
            Zero to Google Journey
          </Button>
          <Button href="/patterns" variant="secondary" size="lg">
            Explore Patterns
          </Button>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-8">
          {[
            { value: "22", label: "Core patterns" },
            { value: "85+", label: "Training drills" },
            { value: "60+", label: "Coding problems" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-accent">{stat.value}</div>
              <div className="mt-1 text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Training Modes */}
      <section className="border-t border-border bg-surface/50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold">Eight ways to train your brain</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
            Each mode targets a different cognitive skill in the problem-solving pipeline.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trainingModes.map((mode) => (
              <a
                key={mode.href}
                href={mode.href}
                className="group rounded-2xl border border-border bg-surface p-8 transition-all hover:border-accent/40 hover:glow-accent"
              >
                <span className="text-3xl">{mode.icon}</span>
                <h3 className="mt-4 text-xl font-semibold group-hover:text-accent transition-colors">
                  {mode.title}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{mode.description}</p>
                <span className="mt-4 inline-block text-sm font-medium text-accent">
                  {mode.drills} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold">A different way to think</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
            Most platforms teach you to solve known problems. We teach you to face unknown ones.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {philosophy.map((item) => (
              <div key={item.step} className="flex gap-6">
                <span className="font-mono text-2xl font-bold text-accent/40">{item.step}</span>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold">Ready to rewire how you solve problems?</h2>
          <p className="mt-4 text-muted">
            5 minutes a day for drills. Full coding workspace when you are ready to implement.
          </p>
          <Button href="/access" size="lg" className="mt-8">
            Get Your Training Code
          </Button>
        </div>
      </section>
    </div>
  );
}
